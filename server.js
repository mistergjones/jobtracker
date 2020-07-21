const express = require("express");

// establsh app
const app = express();

// create const pool based on the .dbConfig
const { pool } = require("./dbConfig");
// create bcrypt
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// more middle ware components
const session = require("express-session");
const flash = require("express-flash");

const passport = require("passport");
const initializePassport = require("./passportConfig");

const axios = require("axios");
initializePassport(passport);

// assign PORT 4000 in development mode
const PORT = process.env.PORT || 4000;

// middle ware
app.set("view engine", "ejs");
app.use(bodyParser());
// This piece sends details from our frontend register to the server/
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

// set the key with a key word to encrypt session stuff
app.use(
  session({
    secret: "secret",
    resave: false,
    // do we want to save session details if there is no values in the session
    saveUninitialized: false,
  })
);

// set
app.use(passport.initialize());
app.use(passport.session());

// we will use this for flash messages
app.use(flash());

// establish the routes to the ejs files
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user.firstname });
});

//logout route
app.get("/users/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out");
  res.redirect("/users/login");
});

// using asynchronous
app.post("/users/register", async (req, res) => {
  console.log(req);
  // get variables from teh form
  let { firstname, lastname, email, password, password2 } = req.body;

  console.log(firstname, lastname, email, password, password2);

  // for form validation if any errors
  let errors = [];

  if (!firstname || !lastname || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  // check for minimum password length
  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 chars" });
  }

  // check for matching passwords
  if (password != password2) {
    error.push({ mesasge: "Please ensure both passwords match" });
  }

  // if any validation checks results in an error...return the message on the login page
  if (errors.length > 0) {
    // re-render the login page and pass in the message of the error earray
    res.render("register", { errors });
  } else {
    // form validation is all correct. Now tackle the bcrypt password component
    // Remember, it is asynchronous hence the await command
    // parameters: password, # of rounds to encrypt
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // query the database to see if hte user exists already.
    // $1 will be replaced by the variable we will pass in....which is email
    pool.query(
      `SELECT * FROM users
              WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        // just print out if there is a duplicate of emails in the DB
        console.log(results.rows);

        // if tehre is a duplicate...
        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          // re render the register page
          res.render("register", { errors });
        } else {
          pool.query(
            `INSERT INTO users (firstname, lastname, email, password)
                        VALUES ($1,$2,$3,$4)
                        RETURNING id, password`,
            [firstname, lastname, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              // pass a flash message to our redirect page
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);
app.get("/jobs", async (req, res) => {
  const response = await axios.get("https://jobs.github.com/positions.json");
  const listings = response.data;
  listings.forEach((listing) => {
    console.log(listing.id);
    pool.query(
      `INSERT INTO jobs (api_id,type, url, created_at, company, company_url, location, title, description, how_to_apply, company_logo)
                  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        listing.id,
        listing.type,
        listing.url,
        listing.created_at,
        listing.company,
        listing.company_url,
        listing.location,
        listing.title,
        listing.description,
        listing.how_to_apply,
        listing.company_logo,
      ],
      (err, results) => {
        if (err) {
          throw err;
        }
        // console.log(results.rows);
        // // pass a flash message to our redirect page
        // req.flash("success_msg", "You are now registered. Please log in");
        // res.redirect("/users/login");
      }
    );
  });
  res.send(response.data[0]);
});

// check if user is authenticated user
function checkAuthenticated(req, res, next) {
  // is a function of passport. So if a user is authenticaled
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  } // else...just move onto the next piece of middleware
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // otherwise if there are not authetnicted, go to login page,
  res.redirect("/users/login");
}

app.get("/auth/facebook", passport.authenticate("facebook"));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
