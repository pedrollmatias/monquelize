// 'use strict';

// const { Product } = require('../../models');
// const validateInventory = require('./validate-inventory');

// module.exports = async function adjustInventory(productId, product) {
//   validateInventory(product);

//   let [, updatedProduct] = await Product.update(product, {
//     where: { _id: productId },
//     returning: true,
//     plain: true,
//   });

//   updatedProduct = updatedProduct.dataValues;

//   return updatedProduct;
// };

// 'use strict';

// const { productModel } = require('../../models');

// module.exports = async function adjustInventory(productId, data, session) {
//   const product = await productModel.retrieve(productId, session);
//   const productHistory = product.history || [];
//   const productInventory = product.inventory || {};

//   productHistory.push({ ...data, date: Date.now() });

//   switch (data.movementType) {
//     case '100': // Input
//       productInventory.currentAmount += Number(data.amount);
//       break;
//     case '200': // Output
//       productInventory.currentAmount -= Number(data.amount);
//       break;
//   }

//   return product.edit({ inventory: productInventory, history: productHistory });
// };
