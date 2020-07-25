'use strict';

const { productModel, categoryModel, saleModel, purchaseModel } = require('../../models');

module.exports = async function editProduct(productId, data, session) {
  let product = await productModel.retrieve(productId, session);
  const productObj = product.toObject();
  const updatedProduct = await product.edit(data);

  product = productObj;

  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];

  await updatedProduct.populate(queryPopulate).execPopulate();

  // Update product in sales and purchases if sku, name, category, unit was modified
  if (hasToUpdateInSalesOrPurchases(product, updatedProduct)) {
    const query = { 'products.productRef': updatedProduct._id };
    const sales = await saleModel.find(query);
    const purchases = await purchaseModel.find(query);

    for (const sale of sales) {
      await sale.editProduct(updatedProduct);
    }

    for (const purchase of purchases) {
      await purchase.editProduct(updatedProduct);
    }
  }

  // Update product in category
  if (updatedProduct.category) {
    if (!product.category) {
      // Add category
      const category = await categoryModel.retrieve(product.category, session);

      await category.addProduct(updatedProduct.toObject());
    } else if (product.category && product.category.equals(updatedProduct.category._id)) {
      // Same category
      const category = await categoryModel.retrieve(updatedProduct.category._id, session);

      await category.editProduct(updatedProduct);
    } else if (product.category && !product.category.equals(updatedProduct.category._id)) {
      // Change category
      const oldCategory = await categoryModel.retrieve(product.category, session);
      const category = await categoryModel.retrieve(updatedProduct.category._id, session);

      await oldCategory.removeProduct(updatedProduct._id);
      await category.addProduct(updatedProduct.toObject());
    }
  } else {
    if (product.category) {
      // Remove category
      const category = await categoryModel.retrieve(product.category, session);

      await category.removeProduct(updatedProduct._id);
    }
  }

  return updatedProduct;
};

function hasToUpdateInSalesOrPurchases(oldProduct, newProduct) {
  const relevantFields = ['sku', 'name', 'category', 'unit'];

  return relevantFields.some((field) => oldProduct[field] !== newProduct[field]);
}
