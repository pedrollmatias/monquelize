'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { mongooseModelMethodsFactory } = require('../../modules');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      validate: {
        validator: function (name) {
          return !/>/.test(name);
        },
        message: 'The category name can not have the character ">"',
      },
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
        unitRef: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        shortUnit: {
          type: String,
          required: true,
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

mongooseModelMethodsFactory.registerMethods(categorySchema);

categorySchema.pre('validate', async function () {
  const category = this;

  if (category.parent) {
    const categoryModel = mongoose.model('Category');
    const parent = await categoryModel.findById(category.parent);

    if (!parent) {
      return category.invalidate('parent', 'Parent category not found');
    }

    if (parent._id.equals(category._id)) {
      return category.invalidate('parent', 'A category can not be its own subcategory');
    }

    if (isParentCategory(category, parent)) {
      return category.invalidate(
        'parent',
        'It is not possible to define as a parent category one of its child categories'
      );
    }

    const _category = setPath(category, parent);

    return _category;
  }

  const _category = setPath(category);

  return _category;
});

categorySchema.pre('remove', async function preventRemoveCategoryWithChildren() {
  const category = this;
  const categoryModel = mongoose.model('Category');
  const childrenCategories = await categoryModel.find({ parent: category._id });

  if (childrenCategories.length) {
    throw new Error('Can not remove category with children categories');
  }
});

categorySchema.pre('findOne', function populateCategory() {
  this.populate('parent');
});

function getPathRegex(name) {
  return new RegExp(`(^|( > ))${name} > `);
}

function isParentCategory(category, parentCategory) {
  return getPathRegex(category.name).test(parentCategory.path);
}

function setPath(category, parent) {
  category.path = parent ? `${parent.path} > ${category.name}` : category.name;

  return category;
}

module.exports = mongoose.model('Category', categorySchema);
