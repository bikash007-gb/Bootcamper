const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamps');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../util/erroeResponse');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advanceResults);
  }
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description ',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id ${req.params.id} found`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    course,
  });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No course with the id ${req.params.bootcampId} found`,
        404
      )
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role != 'admin') {
    return next(
      new ErrorResponse(`User id is not authorized to add a course `, 401)
    );
  }
  const course = await Course.create(req.body);
  res.status(201).json({
    status: 'success',
    course,
  });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No document found with ${req.params.id}`, 404)
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role != 'admin') {
    return next(
      new ErrorResponse(`User id is not authorized to update course `, 401)
    );
  }
  course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body({
      new: true,
      runValidators: true,
    })
  );
  res.status(200).json({
    status: 'success',
    course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No document found with ${req.params.id}`, 404)
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role != 'admin') {
    return next(
      new ErrorResponse(`User id is not authorized to update course `, 401)
    );
  }
  course.remove();
  res.status(204).json({
    status: 'success',
  });
});
