var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var session = require("express-session");

const { v4: uuidv4 } = require("uuid");

const oktaClient = require("./util/oktaClient");
const oidc = require("./util/oidc");
const userData = require("./util/userData");

const dashboardRouter = require("./routes/dashboard");
const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/authorizationCode");
const teamsRouter = require("./routes/teams");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//setup and use session
app.use(
  session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: false,
  })
);

//use OIDC
app.use(oidc.router);

//use more middleware to get user info
app.use((req, res, next) => {
  if (!req.userContext) {
    return next();
  }

  oktaClient
    .getUser(req.userContext.userinfo.sub)
    .then((user) => {
      //TODO expand userData to allow more flexibility, reflect this here
      userData
        .getUserIsSuper(user.id)
        .then((data) => {
          req.user = user;
          res.locals.user = user;
          req.userIsSuper = data;
          res.locals.userIsSuper = data;
          next();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

//middleware functions for access control
function loginRequired(req, res, next) {
  if (!req.userContext) {
    return res.status(401).render("unauthenticated");
  }
  next();
}

function adminRequired(req, res, next) {
  if (!req.userContext || req.userIsSuper != 1) {
    return res.status(401).render("unauthenticated");
  }
  next();
}

app.use("/", publicRouter);
app.use("/dashboard", loginRequired, dashboardRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRequired, adminRouter);
app.use("/authorization-code", authRouter);
app.use("/teams", loginRequired, teamsRouter);

// catch 404 and forward to error handler
app.use(function (next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
