'use strict';

const Logger = require('../src/loaders/logger');
const mongodbMongooseServices = require('../src/mongodb-mongoose/services');
const postgresSequelizeServices = require('../src/postgres-sequelize/services');
const mongooseModels = require('../src/mongodb-mongoose/models');
const postgresSequelizeModels = require('../src/postgres-sequelize/models');
const { dbConnect, dbDisconnect, clearMongodbMongooseCollections, clearPostrgresSequelizeTables } = require('./utils');
const data = require('./data');

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
  for (const unit of units) {
    await Promise.all([mongodbMongooseServices.unitService.add(unit), postgresSequelizeServices.unitService.add(unit)]);
  }
}

async function populatePaymentMethods(paymentMethods) {
  for (const paymentMethod of paymentMethods) {
    await Promise.all([
      mongodbMongooseServices.paymentMethodService.add(paymentMethod),
      postgresSequelizeServices.paymentMethodService.add(paymentMethod),
    ]);
  }
}

async function populateUsers(users) {
  for (const user of users) {
    await Promise.all([mongodbMongooseServices.userService.add(user), postgresSequelizeServices.userService.add(user)]);
  }
}

async function populateProducts(products) {
  for (const product of products) {
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

    await Promise.all([
      mongodbMongooseServices.productService.add(mongodbMongooseProduct),
      postgresSequelizeServices.productService.add(postgresSequelizeProduct),
    ]);
  }
}

(async function populate() {
  try {
    const scenario = process.env.SCENARIO;
    // const magnitude = process.env.MAGNITUDE;

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
    await populatePaymentMethods(data.paymentMethods[scenario]);
    await populateUsers(data.users[scenario]);
    await populateProducts(data.products[scenario]);
    dbDisconnect();
    Logger.info('Databases disconnected');
  } catch (err) {
    Logger.error(err.stack);
  }
})();
