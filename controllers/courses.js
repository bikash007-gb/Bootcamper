const Course = require('../models/Course');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../util/erroeResponse');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({
      bootcamp: req.params.bootcampId,
    }).populate({ path: 'bootcamp', select: 'name description ' });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    const courses = await Course.find().populate({
      path: 'bootcamp',
      select: 'name description ',
    });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  }
});
