const express = require('express');
const bootcampsController = require('../controllers/bootcamps');

//Include other resources routers
const courseRouter = require('./courses');
const router = express.Router();

//Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(bootcampsController.getBootcamp)
  .post(bootcampsController.createBootcamp);

router
  .route('/:id')
  .get(bootcampsController.getOneBootcamp)
  .put(bootcampsController.updateBootcamp)
  .delete(bootcampsController.deleteBootcamp);

router
  .route('/radius/:zipcode/:distance')
  .get(bootcampsController.getBootcampsInRadius);
module.exports = router;
