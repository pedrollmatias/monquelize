'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getPathRegex(name) {
  return new RegExp(`(^|( > ))${name} > `);
}

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    path: {
      type: String,
      required: true,
    },
    products: [
      {
        productRef: {
          type: Schema.Types.ObjectId,
        },
        sku: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        unit: {
          unitRef: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          shortUnit: {
            type: String,
            required: true,
          },
        },
        salePrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { collection: 'categories' }
);

CategorySchema.pre('validate', async function () {
  const category = this;

  if (/>/.test(category.name)) {
    await category.invalidate('name', 'The category name can not have the character ">"');
  }

  if (category.parent) {
    const Category = mongoose.model('Category');
    const parent = await Category.findById(category.parent || null);

    if (!parent) {
      return category.invalidate('parent', 'Parent category not found');
    }
    if (parent._id.equals(category._id)) {
      return category.invalidate('parent', 'A category can not be its own subcategory');
    }
    if (category.isParent(parent)) {
      return category.invalidate(
        'parent',
        'It is not possible to define as a parent category one of its child categories'
      );
    }

    return category.setPath(parent);
  }

  return category.setPath();
});

CategorySchema.pre('remove', async function preventRemoveCategoryWithChildren() {
  const category = this;
  const childrenCategories = await category.findChildren(category.name);

  if (childrenCategories.length) {
    throw new Error('Can not remove category with children categories');
  }
});

CategorySchema.pre('findOne', function populateCategory() {
  this.populate('parent');
});

CategorySchema.static({
  async load(categoryId, session) {
    const Category = this;
    const category = session
      ? await Category.findById(categoryId).session(session)
      : await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  },
  async create(category) {
    const Category = this;
    const categoryDoc = new Category(category);

    return categoryDoc.save();
  },
});

CategorySchema.method({
  async edit(data) {
    const category = this;

    category.overwrite(data);

    return category.save();
  },
  async editFields(data) {
    const category = this;

    for (const key of Object.keys(data)) {
      category.set(key, data[key]);
    }

    return category.save();
  },
  isParent(category) {
    return getPathRegex(this.name).test(category.path);
  },
  findChildren(oldName) {
    const category = this;

    return category.constructor.find({ path: getPathRegex(oldName) }).sort({ path: 1 });
  },
  setPath(parent) {
    this.path = parent ? `${parent.path} > ${this.name}` : this.name;
  },
  async updateChildrenPaths(oldName) {
    const category = this;
    const children = await category.findChildren(oldName);

    for (const child of children) {
      const childPathArray = child.path.split(' > ');
      const parentPathIndex = childPathArray.indexOf((subPath) => subPath === oldName);
      const newPath = category.path.split(' > ').concat(childPathArray.slice(parentPathIndex)).join(' > ');

      child.path = newPath;

      await child.save();
    }
  },
  async addProduct(product) {
    const category = this;

    product.productRef = product._id;
    product.unit.unitRef = product.unit.unitRef || product.unit._id;

    const categoryProducts = category.products;

    categoryProducts.push(product);

    return category.editFields({ products: categoryProducts });
  },
  async editProcut(product) {
    const category = this;
    const categoryProducts = category.products.map((categoryProduct) => {
      if (categoryProduct.productRef.equals(product._id)) {
        categoryProduct.sku = product.sku;
        categoryProduct.name = product.name;
        categoryProduct.unit = {
          unitRef: product.unit._id,
          shortUnit: product.unit.shortUnit,
        };
        categoryProduct.salePrice = product.salePrice;
      }

      return categoryProduct;
    });

    return category.editFields({ products: categoryProducts });
  },
  async removeProduct(productId) {
    const category = this;
    const categoryProducts = category.products.filter(
      (categoryProduct) => !categoryProduct.productRef.equals(productId)
    );

    await category.editFields({ products: categoryProducts });
  },
});

module.exports = mongoose.model('Category', CategorySchema);
