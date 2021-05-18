const express = require('express');
const authController = require('../controllers/auth');
const auth = require('../middlewares/auth');
const router = express.Router();

router.route('/logout').get(authController.logout);
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/me').get(auth.protect, authController.getMe);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:resettoken').put(authController.resetPassword);
router.route('/updatedetails').put(auth.protect, authController.updateDetails);
router
  .route('/updatepassword')
  .put(auth.protect, authController.updatePassword);
module.exports = router;
