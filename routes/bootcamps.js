const express = require('express');
const bootcampsController = require('../controllers/bootcamps');
const router = express.Router();

router
  .route('/')
  .get(bootcampsController.getBootcamp)
  .post(bootcampsController.createBootcamp);

router
  .route('/:id')
  .get(bootcampsController.getOneBootcamp)
  .put(bootcampsController.updateBootcamp)
  .delete(bootcampsController.deleteBootcamp);

module.exports = router;
