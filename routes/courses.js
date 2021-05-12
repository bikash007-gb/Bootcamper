const express = require('express');
const courseController = require('../controllers/courses');
const router = express.Router({ mergeParams: true });

router.route('/').get(courseController.getCourses);

module.exports = router;
