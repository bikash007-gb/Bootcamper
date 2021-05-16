const express = require('express');
const advanceResults = require('../middlewares/advanceResult');
const Course = require('../models/Course');
const courseController = require('../controllers/courses');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/auth');

router
  .route('/')
  .get(
    advanceResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    courseController.getCourses
  )
  .post(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    courseController.addCourse
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    courseController.updateCourse
  )
  .delete(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    courseController.deleteCourse
  );

module.exports = router;
