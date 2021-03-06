const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../util/erroeResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../util/geocoder');
const path = require('path');

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Add user to body
  req.body.user = req.user.id;

  //Check for published bootcamps
  const published = await Bootcamp.findOne({ user: req.user.id });

  //If the user is not admin they can only create One Bootcamp
  if (published && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `the user with ID ${req.user.id} has already published a Bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: 'success',
    bootcamp,
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No document found with ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role != 'admin') {
    return next(new ErrorResponse(`User id is not authorized to update`, 401));
  }
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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
  if (bootcamp.user.toString() !== req.user.id && req.user.role != 'admin') {
    return next(new ErrorResponse(`User id is not authorized to delete`, 401));
  }
  bootcamp.remove();
  res.status(204).json({
    status: 'success',
  });
});

exports.getOneBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate({
    path: 'courses',
    select: 'title tuition',
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

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No document found with ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role != 'admin') {
    return next(new ErrorResponse(`User id is not authorized to update`, 401));
  }

  if (!req.files) {
    return next(new ErrorResponse('please upload a file', 400));
  }

  const file = req.files.file;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('please upload an image file', 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //create custom file name"
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
