
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiErrors");
const ApiFeature = require("../utils/apiFeature");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter={};
    if(req.filterObj) {filter = req.filterObj}
    const documentsCounts = await Model.countDocuments();
    const apiFeature = new ApiFeature(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search()
      .limitFields()
      .sort1();
    const { mongooseQuery, paginationResult } = apiFeature;
    const document = await mongooseQuery;
    res
      .status(200)
      .json({ results: document.length, paginationResult, data: document });
  });

exports.getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) build query
    let query =  Model.findById(id);
    if (populationOption){
      query = query.populate(populationOption)
    }
    // 2) execute query
    const document = await query
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`), 404);
    }
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No ${Model} for this id ${id}`), 404);
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No ${Model} for this id ${req.params.id}`),
        404
      );
    }
    res.status(200).json({ data: document });
  });
