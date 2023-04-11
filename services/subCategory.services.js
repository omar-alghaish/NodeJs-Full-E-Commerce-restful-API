
const SubCategory = require("../models/subCategoryModel");
const factory = require('./handlerFactory')


const os = require("os")

// @description      create subCategory
// @route            POST  /api/v1/subcategeries
// @access           Private

exports.setCategoryIdToBody = (req,res,next)=>{
  if(!req.body.category) req.body.category =req.params.category;
}

exports.createFilterObj = (req,res,next) =>{
  let filterObject = {};
  if (req.params.categoryId) filterObject ={category:req.params.categoryId};
  req.filterObj = filterObject;
  next()
}

exports.createSubCategory = factory.createOne(SubCategory)

// @description      Get list of subCategories
// @route            CET   /api/v1/subcategories
// @access           Public

exports.getSubCategories =  factory.getAll(SubCategory)


// @description      Get specific subcategory by id
// @route            GET /api/v1/subcagegries/:id
// @access           public

exports.getSubCategory = factory.getOne(SubCategory)

// @description      update specific subcategory
// @route            Put  /api/v1/subcategeries/:id
// @access           Private

exports.updateSubCategory = factory.updateOne(SubCategory)


// @description      Delet specific subcategory
// @route            DELEtE  /api/v1/subcategeries/:id
// @access           Private

exports.deleteSubCategory = factory.deleteOne(SubCategory)
