const Bootcamp = require('../models/Bootcamps');

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      status: 'success',
      bootcamps,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      total: bootcamps.length,
      error: error.message,
    });
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
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      res.status(404).json({ msg: 'No document found' });
    }
    res.status(200).json({
      status: 'success',
      bootcamp,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      res.status(404).json({ msg: 'No document found' });
    }
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};

exports.getOneBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      bootcamp,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};
