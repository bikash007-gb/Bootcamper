const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../util/erroeResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../util/geocoder');

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  //create operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'courses',
    select: 'title tuition',
  });

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
  }

  //Sort fields
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  //pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    status: 'success',
    total: bootcamps.length,
    pagination,
    bootcamps,
  });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: 'success',
    bootcamp,
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No document found with ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();
  res.status(204).json({
    status: 'success',
  });
});

exports.getOneBootcamp = asyncHandler(async (req, res, next) => {
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
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
