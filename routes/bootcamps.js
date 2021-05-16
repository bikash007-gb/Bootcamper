const express = require('express');
const bootcampsController = require('../controllers/bootcamps');
const advanceResults = require('../middlewares/advanceResult');
const Bootcamp = require('../models/Bootcamps');
const auth = require('../middlewares/auth');
//Include other resources routers
const courseRouter = require('./courses');
const router = express.Router();

//Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(advanceResults(Bootcamp, 'courses'), bootcampsController.getBootcamp)
  .post(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    bootcampsController.createBootcamp
  );

router
  .route('/:id')
  .get(bootcampsController.getOneBootcamp)
  .put(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    bootcampsController.updateBootcamp
  )
  .delete(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    bootcampsController.deleteBootcamp
  );

router
  .route('/radius/:zipcode/:distance')
  .get(bootcampsController.getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    bootcampsController.bootcampPhotoUpload
  );
module.exports = router;
