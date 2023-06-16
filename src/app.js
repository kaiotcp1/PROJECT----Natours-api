const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

/*
definindo um roteador que irá lidar
com as rotas da API /api/v1/tours
*/
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

/* 1) GLOBAL MIDDLEWARES
 Set security HTTP headers
 Helmet helps secure Express apps by setting HTTP response headers.
*/
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: " Too many request from this IP, pelase try again in an hour!",
});
app.use("/api", limiter);

/* 
permite que o Express reconheça o objeto JSON
enviado no corpo da solicitação
e o transforme em um objeto JavaScript utilizável
*/
app.use(
  express.json({
    limit: "10kb",
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization agains XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// Serving static files, HTML CSS, IMAGES..
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //   console.log(req.headers);
  next();
});

// -----------------------------------------------------------------------

// Routes- Mounting
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// All the HTTP Verbs
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
