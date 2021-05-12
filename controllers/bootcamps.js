const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../util/erroeResponse');
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      status: 'success',
      total: bootcamps.length,
      bootcamps,
    });
  } catch (error) {
    next(error);
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      status: 'success',
      bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`No document found with ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`No document found with ${req.params.id}`, 404)
      );
    }
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

exports.getOneBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`No document found with ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      bootcamp,
    });
  } catch (error) {
    //next(new ErrorResponse(`Something went wrong`, 500));
    next(error);
  }
};
