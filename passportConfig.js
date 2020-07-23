const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
var FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");
const configAuth = require("./config/auth.js");
function initialize(passport) {
  console.log("Passport is initialized");

  const authenticateUser = (email, password, done) => {
    console.log(email, password);
    pool.query(
      `SELECT * from users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }

        console.log(results.rows);

        // if it has found the user...
        if (results.rows.length > 0) {
          // pass in the first element object of the db list
          const user = results.rows[0];

          // now compare the user inputted password and db password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            // passwords match, null the error message but pass the user object
            if (isMatch) {
              return done(null, user);
            } else {
              //password is incorrect
              return done(null, false, {
                message: "Password is incorrect",
              });
            }
          });
        } else {
          // No user
          return done(null, false, {
            message: "No user with that email address",
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );
  // Stores user details inside session. serializeUser determines which data of the user
  // object should be stored in the session. The result of the serializeUser method is attached
  // to the session as req.session.passport.user = {}.
  passport.serializeUser((user, done) => done(null, user.id));

  // use the id and obtain the entire user details and store the entire record in the session for when we naviage to different pages.
  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * from users where ID = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      }
      // the user o
      return done(null, results.rows[0]);
    });
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOrCreate(accessToken, function (err, user) {
          if (err) {
            return done(err);
          }
          done(null, user);
        });
      }
    )
  );
}

module.exports = initialize;
