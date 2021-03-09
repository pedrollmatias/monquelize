'use strict';

const Logger = require('../src/loaders/logger');
const mongodbMongooseServices = require('../src/mongodb-mongoose/services');
const postgresSequelizeServices = require('../src/postgres-sequelize/services');
const mongooseModels = require('../src/mongodb-mongoose/models');
const postgresSequelizeModels = require('../src/postgres-sequelize/models');
const { dbConnect, dbDisconnect, clearMongodbMongooseCollections, clearPostrgresSequelizeTables } = require('./utils');
const data = require('./data');
const chance = require('chance');
const dayjs = require('dayjs');

async function populateCategories(categories, parent) {
  for (const category of categories) {
    const categoryMongodbMongoose = { ...category, parent: parent && parent.mongodbMongoose };
    const categoryPostgresSequelize = { ...category, parent: parent && parent.postgresSequelize };

    const [categoryDocMongodbMongoose, categoryDocPostgresSequelize] = await Promise.all([
      mongodbMongooseServices.categoryService.add(categoryMongodbMongoose),
      postgresSequelizeServices.categoryService.add(categoryPostgresSequelize),
    ]);

    if (category.categories) {
      await populateCategories(category.categories, {
        mongodbMongoose: categoryDocMongodbMongoose,
        postgresSequelize: {
          ...categoryDocPostgresSequelize,
          associatedIds: { postgresSequelizeId: categoryDocPostgresSequelize._id },
        },
      });
    }
  }
}

async function populateUnits(units) {
  units.map(async (unit) => {
    const [mongodbMongooseUnit, postgresSequelizeUnit] = await Promise.all([
      mongodbMongooseServices.unitService.add(unit),
      postgresSequelizeServices.unitService.add(unit),
    ]);

    return {
      mongodbMongoose: mongodbMongooseUnit,
      postgresSequelize: postgresSequelizeUnit,
    };
  });
}

async function populatePaymentMethods(paymentMethods) {
  return paymentMethods.map(async (paymentMethod) => {
    const [mongodbMongoosePaymentMethod, postgresSequelizePaymentMethod] = await Promise.all([
      mongodbMongooseServices.paymentMethodService.add(paymentMethod),
      postgresSequelizeServices.paymentMethodService.add(paymentMethod),
    ]);

    return {
      mongodbMongoose: mongodbMongoosePaymentMethod,
      postgresSequelize: postgresSequelizePaymentMethod,
    };
  });
}

async function populateUsers(users) {
  return users.map(async (user) => {
    const [mongodbMongooseUser, postgresSequelizeUser] = await Promise.all([
      mongodbMongooseServices.userService.add(user),
      postgresSequelizeServices.userService.add(user),
    ]);

    return {
      mongodbMongoose: mongodbMongooseUser,
      postgresSequelize: postgresSequelizeUser,
    };
  });
}

async function populateProducts(products) {
  return products.map(async (product) => {
    const [
      categoryMongodbMongoose,
      unitMongodbMongoose,
      categoryPostgresSequelize,
      unitPostgresSequelize,
    ] = await Promise.all([
      mongooseModels.categoryModel.findOne({ path: product.categoryPath }),
      mongooseModels.unitModel.findOne({ unit: product.unitName }),
      postgresSequelizeModels.Category.findOne({
        where: { path: product.categoryPath },
      }),
      postgresSequelizeModels.Unit.findOne({
        where: { unit: product.unitName },
      }),
    ]);

    const mongodbMongooseProduct = { ...product, category: categoryMongodbMongoose, unit: unitMongodbMongoose };
    const postgresSequelizeProduct = {
      ...product,
      categoryId: categoryPostgresSequelize && categoryPostgresSequelize._id,
      unitId: unitPostgresSequelize && unitPostgresSequelize._id,
    };

    const [_mongodbMongooseProduct, _postgresSequelizeProduct] = await Promise.all([
      mongodbMongooseServices.productService.add(mongodbMongooseProduct),
      postgresSequelizeServices.productService.add(postgresSequelizeProduct),
    ]);

    return {
      mongodbMongoose: _mongodbMongooseProduct,
      postgresSequelize: _postgresSequelizeProduct,
    };
  });
}

async function populateSales(paymentMethods, users, products, salesAveragePerDay) {
  const startDate = dayjs().subtract(6, 'month').startOf('month');
  const endDate = dayjs().add(6, 'month').endOf('month');
  const diffInDays = endDate.diff(startDate, 'day');

  for (let day = 0; day <= diffInDays; day++) {
    const currentDate = startDate.add(day, 'day');
    const randomDiff = chance.floating({ min: -0.3, max: 0.3, fixed: 2 });
    const minSalesAmount = Math.floor(salesAveragePerDay + salesAveragePerDay * randomDiff);
    const maxSalesAmount = Math.ceil(salesAveragePerDay + salesAveragePerDay * randomDiff);
    const randomSalesAmountInDay = chance.integer({ min: minSalesAmount, max: maxSalesAmount });

    Array.from({ length: randomSalesAmountInDay }).forEach(async () => {
      let sale = { date: currentDate, timestamp: currentDate.getTime() };

      const productsAmountToBeSold = chance.integer({ min: 1, max: 10 });

      const saleProducts = Array.from({ length: productsAmountToBeSold }).map(() => {
        const randomProductIndex = chance.integer({ min: 0, max: products.length - 1 });
        const randomProductAmount = chance.integer({ min: 1, max: 3 });
        const product = {
          ...products[randomProductIndex].mongodbMongoose,
          associatedIds: {
            mongodbMongooseId: product._id,
            postresSequelizeId: products[randomProductIndex].postgresSequelize._id,
          },
          amount: randomProductAmount,
          price: product.salePrice,
        };
      });

      sale = { ...sale, products: saleProducts };

      const saleHasSeller = chance.bool({ likelihood: 70 });

      if (saleHasSeller) {
        const randomUserIndex = chance.integer({ min: 0, max: users.length - 1 });

        sale = { ...sale, seller: users[randomUserIndex] };
      }

      const randomPaymentMethodIndex = chance.integer({ min: 0, max: paymentMethods.length - 1 });

      sale = { ...sale, paymentMethod: paymentMethods[randomPaymentMethodIndex] };

      await Promise.all([
        mongodbMongooseServices.saleService.add(sale),
        postgresSequelizeServices.saleService.add(sale),
      ]);
    });
  }
}

(async function populate() {
  try {
    const scenario = process.env.SCENARIO;
    const salesAverage = Number(process.env.SALES_AVG);

    Logger.info('Connecting to databases...');
    await dbConnect();
    Logger.info('Databases connected');
    Logger.info('Clearing "MongoDB with Mongoose" DB collections data...');
    await clearMongodbMongooseCollections();
    Logger.info('Clearing "Postgres with Sequelize" DB tables data...');
    await clearPostrgresSequelizeTables();
    Logger.info('Populating Databases...');
    await populateCategories(data.categories[scenario]);
    await populateUnits(data.units[scenario]);

    const paymentMethods = await populatePaymentMethods(data.paymentMethods[scenario]);
    const users = await populateUsers(data.users[scenario]);
    const products = await populateProducts(data.products[scenario]);

    await populateSales(paymentMethods, users, products, salesAverage);

    dbDisconnect();
    Logger.info('Databases disconnected');
  } catch (err) {
    Logger.error(err.stack);
  }
})();
