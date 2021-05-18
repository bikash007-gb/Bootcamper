const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const sanitized = require('express-mongo-sanitize');
const fileupload = require('express-fileupload');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieparser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const review = require('./routes/review');
dotenv.config({ path: './config.env' });

//DB connection
connectDB();

const app = express();
app.use(express.json());

//Cookie parser
app.use(cookieparser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//File uploading
app.use(fileupload());

//sanitize data
app.use(sanitized());

//Set security headers
app.use(helmet());

//Prevent xss attacks
app.use(xss());

//rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

//enable cors:
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', review);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`app listening on ${process.env.NODE_ENV} mode port ${PORT}`);
});

//Handle unhandled promise rejection

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`);
  server.close(() => process.exit(1));
});
