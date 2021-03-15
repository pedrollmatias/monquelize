'use strict';

const Logger = require('../../src/loaders/logger');
const mongodbMongooseServices = require('../../src/mongodb-mongoose/services');
const postgresSequelizeServices = require('../../src/postgres-sequelize/services');
const mongooseModels = require('../../src/mongodb-mongoose/models');
const postgresSequelizeModels = require('../../src/postgres-sequelize/models');
const { dbConnect, dbDisconnect, clearMongodbMongooseCollections, clearPostrgresSequelizeTables } = require('../utils');
const data = require('../data');
const Chance = require('chance');
const chance = new Chance();
const dayjs = require('dayjs');
const withTransaction = require('../../src/mongodb-mongoose/api/middlewares/with-transaction');

const diffMonth = 1;

function populateUnits(units) {
  return Promise.all(
    units.map(async (unit) => {
      const [mongodbMongooseUnit, postgresSequelizeUnit] = await Promise.all([
        mongodbMongooseServices.unitService.add(unit),
        postgresSequelizeServices.unitService.add(unit),
      ]);

      return {
        mongodbMongoose: mongodbMongooseUnit,
        postgresSequelize: postgresSequelizeUnit,
      };
    })
  );
}

function populateUsers(users) {
  return Promise.all(
    users.map(async (user) => {
      const [mongodbMongooseUser, postgresSequelizeUser] = await Promise.all([
        mongodbMongooseServices.userService.add(user),
        postgresSequelizeServices.userService.add(user),
      ]);

      return {
        mongodbMongoose: mongodbMongooseUser,
        postgresSequelize: postgresSequelizeUser,
      };
    })
  );
}

function populatePaymentMethods(paymentMethods) {
  return Promise.all(
    paymentMethods.map(async (paymentMethod) => {
      const [mongodbMongoosePaymentMethod, postgresSequelizePaymentMethod] = await Promise.all([
        mongodbMongooseServices.paymentMethodService.add(paymentMethod),
        postgresSequelizeServices.paymentMethodService.add(paymentMethod),
      ]);

      return {
        mongodbMongoose: mongodbMongoosePaymentMethod,
        postgresSequelize: postgresSequelizePaymentMethod,
      };
    })
  );
}

async function populateCategories(categories, parent = {}) {
  for (const category of categories) {
    const categoryMongodbMongoose = { ...category, parent: parent.mongodbMongoose };
    const categoryPostgresSequelize = { ...category, parent: parent.postgresSequelize };

    const [categoryDocMongodbMongoose, categoryDocPostgresSequelize] = await Promise.all([
      mongodbMongooseServices.categoryService.add(categoryMongodbMongoose),
      postgresSequelizeServices.categoryService.add(categoryPostgresSequelize),
    ]);

    if (category.childrenCategories) {
      await populateCategories(category.childrenCategories, {
        mongodbMongoose: categoryDocMongodbMongoose,
        postgresSequelize: {
          ...categoryDocPostgresSequelize,
          associatedIds: { postgresSequelizeId: categoryDocPostgresSequelize._id },
        },
      });
    }
  }
}

async function populateProducts(products) {
  const _products = [];

  for (const product of products) {
    const [
      categoryMongodbMongoose,
      unitMongodbMongoose,
      categoryPostgresSequelize,
      unitPostgresSequelize,
    ] = await Promise.all([
      mongooseModels.categoryModel.findOne({ path: product.categoryPathRef }, { __v: 0 }),
      mongooseModels.unitModel.findOne({ unit: product.unitNameRef }, { __v: 0 }),
      postgresSequelizeModels.Category.findOne({
        where: { path: product.categoryPathRef },
      }),
      postgresSequelizeModels.Unit.findOne({
        where: { unit: product.unitNameRef },
      }),
    ]);

    const mongodbMongooseProduct = { ...product, category: categoryMongodbMongoose, unit: unitMongodbMongoose };
    const postgresSequelizeProduct = {
      ...product,
      categoryId: categoryPostgresSequelize._id,
      unitId: unitPostgresSequelize._id,
    };

    const [_mongodbMongooseProduct, _postgresSequelizeProduct] = await Promise.all([
      withTransaction(async (session) => mongodbMongooseServices.productService.add(mongodbMongooseProduct, session)),
      postgresSequelizeServices.productService.add(postgresSequelizeProduct),
    ]);

    _products.push({
      mongodbMongoose: _mongodbMongooseProduct,
      postgresSequelize: _postgresSequelizeProduct,
    });
  }

  return _products;
}

async function populateSales(paymentMethods, users, products, salesAveragePerDay) {
  const startDate = dayjs().subtract(diffMonth, 'month').startOf('month');
  const endDate = dayjs().add(diffMonth, 'month').endOf('month');
  const diffInDays = endDate.diff(startDate, 'day');

  for (const day of Array.from({ length: diffInDays }).keys()) {
    const currentDate = startDate.add(day, 'day');

    const randomDiff = chance.floating({ min: 0, max: 0.3, fixed: 2 });
    const minSalesAmount = Math.floor(salesAveragePerDay + salesAveragePerDay * -randomDiff);
    const maxSalesAmount = Math.ceil(salesAveragePerDay + salesAveragePerDay * randomDiff);
    const randomSalesAmountInDay = chance.integer({ min: minSalesAmount, max: maxSalesAmount });

    // eslint-disable-next-line no-unused-vars
    for (const _ of Array.from({ length: randomSalesAmountInDay }).keys()) {
      let sale = { date: currentDate.toDate(), timestamp: currentDate.toDate().getTime() };

      const productsAmountToBeSold = chance.integer({ min: 1, max: 10 });

      const saleProducts = Array.from({ length: productsAmountToBeSold }).map(() => {
        const randomProductIndex = chance.integer({ min: 0, max: products.length - 1 });
        const randomProductAmount = chance.integer({ min: 1, max: 3 });
        const mongodbMongooseProduct = products[randomProductIndex].mongodbMongoose;

        return {
          ...mongodbMongooseProduct.toJSON(),
          productId: products[randomProductIndex].postgresSequelize._id,
          productRef: products[randomProductIndex].mongodbMongoose._id,
          category: mongodbMongooseProduct.category._id,
          unitRef: mongodbMongooseProduct.unit._id,
          shortUnit: mongodbMongooseProduct.unit.shortUnit,
          amount: randomProductAmount,
          price: mongodbMongooseProduct.salePrice,
        };
      });

      sale = { ...sale, products: saleProducts };

      const saleHasSeller = chance.bool({ likelihood: 70 });

      if (saleHasSeller) {
        const randomUserIndex = chance.integer({ min: 0, max: users.length - 1 });

        sale = {
          ...sale,
          seller: users[randomUserIndex].mongodbMongoose,
          sellerId: users[randomUserIndex].postgresSequelize._id,
        };
      }

      const randomPaymentMethodIndex = chance.integer({ min: 0, max: paymentMethods.length - 1 });

      sale = {
        ...sale,
        paymentMethod: paymentMethods[randomPaymentMethodIndex].mongodbMongoose,
        paymentMethodId: paymentMethods[randomPaymentMethodIndex].postgresSequelize._id,
        paymentMethodRef: paymentMethods[randomPaymentMethodIndex].postgresSequelize._id,
      };

      await Promise.all([
        withTransaction(async (session) => mongodbMongooseServices.saleService.add(sale, session)),
        postgresSequelizeServices.saleService.add(sale),
      ]);
    }
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
    await populateUnits(data.units);

    const paymentMethods = await populatePaymentMethods(data.paymentMethods);
    const users = await populateUsers(data.users);
    const products = await populateProducts(data.products[scenario]);

    await populateSales(paymentMethods, users, products, salesAverage);

    dbDisconnect();
    Logger.info('Databases disconnected');
  } catch (err) {
    Logger.error(err.stack);
  }
})();
