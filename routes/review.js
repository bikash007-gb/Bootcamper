const express = require('express');
const advanceResults = require('../middlewares/advanceResult');
const reviewController = require('../controllers/review');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');

const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(
    advanceResults(Review, {
      path: 'bootcamp',
      select: 'name description ',
    }),
    reviewController.getReviews
  )
  .post(protect, authorize('user', 'admin'), reviewController.addReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .put(protect, authorize('user', 'admin'), reviewController.updateReview)
  .delete(protect, authorize('user', 'admin'), reviewController.deleteReview);

module.exports = router;
