require("dotenv").config();

const bodyParser     = require("body-parser");
const cookieParser   = require("cookie-parser");
const express        = require("express");
const favicon        = require("serve-favicon");
const hbs            = require("hbs");
const mongoose       = require("mongoose");
const logger         = require("morgan");
const path           = require("path");
const session        = require("express-session");
const MongoStore     = require("connect-mongo")(session);
const flash          = require("connect-flash");
const passport       = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const User           = require("./models/User");
const bcrypt         = require("bcryptjs");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(
  session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(flash());
passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }

      return next(null, user);
    });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          let theImage = "";
          if (profile.photos) {
            theImage = profile._json.picture;
          }
          User.create({
            username: profile._json.name,
            googleID: profile.id,
            isAdmin: false,
            profileImage: theImage
          })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = "WeLunch – Pre-Alpha";

// creating a universal variable in all HBS files called "theUser"
// this variable is equal to the user in the session
// that means if there's no user in the session, the variable will be null/undefined
app.use((req, res, next) => {
  res.locals.theUser = req.user;
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash("success");
  next();
});

const index = require("./routes/index");
app.use("/", index);

const userRoutes = require("./routes/user-routes");
app.use("/", userRoutes);


const ingredientsARoutes = require("./routes/ingredients-a-routes");
app.use("/", ingredientsARoutes);


const ingredientsBRoutes = require("./routes/ingredients-b-routes");
app.use("/", ingredientsBRoutes);

const mealRoutes = require("./routes/meal-routes");
app.use("/", mealRoutes);


const adminRoutes = require("./routes/admin-routes");
app.use("/", adminRoutes);

module.exports = app;
