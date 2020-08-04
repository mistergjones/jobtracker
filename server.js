const express = require("express");

// establsh app
const app = express();
const methodOverride = require("method-override");
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
initializePassport(passport);

const axios = require("axios");

// const db = require("../jobtracker/lib/queries");
const db = require("./lib/queries");
// required for fetching data via browser for api
var fetch = require("node-fetch");

// assign PORT 4000 in development mode
const PORT = process.env.PORT || 4000;

// Jobs module
const {
    getSavedJobs,
    saveJobIdsForUserId,
    getJobs,
    saveJob,
    getJobById,
} = require("./models/jobs");
const { getUserByEmail, addUser } = require("./models/users");
// middle ware
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
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
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === "object" && "_method" in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);

//to send session information to ejs
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
// we will use this for flash messages
app.use(flash());

// establish the routes to the ejs files
app.get("/", (req, res) => {
    res.render("index", { title: "Home Page" });
});
app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact Us Page" });
});
app.get("/about", (req, res) => {
    res.render("about", { title: "About Us Page" });
});
app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register", { title: "Register Page" });
});

app.get("/users/login", checkAuthenticated, (req, res) => {
    res.render("login", { title: "Login Page" });
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
    res.render("dashboard", {
        user: req.user.firstname,
        title: "Dashboard Page",
    });
});

//logout route
app.get("/users/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You have logged out");
    res.redirect("/users/login");
});

//save jobs by user
app.get("/saveJob/:app_id", async (req, res) => {
    if (req.sessionID) {
        // d&& req.user.id) {
        let api_id = req.params.app_id;
        let user_id = req.user.id;

        console.log({ api_id }, { user_id });
        //saving to database
        await saveJobIdsForUserId(api_id, user_id);
        req.flash("success_msg", "You have saved the job");
        res.redirect("/viewjobs");
    } else {
        req.flash("success_msg", "You must logged-in first");
        res.redirect("/users/login");
    }
    // console.log({ req });
});

//view applied jobs
app.get("/appliedJobs", async (req, res) => {
    if (req.user.id) {
        // console.log("ASDFSAFSAFADFDSAFDSAF");
        // console.log(req.user.id);
        let savedJobs = [];
        try {
            savedJobs = await getSavedJobs(req.user.id);

            res.render("appliedJobs/show.ejs", {
                savedJobs,
                title: "View Applied Jobs",
            });
        } catch (error) {
            console.log("error has occurred!", error);
        }
    } else {
        req.flash("success_msg", "You must logged-in first");
        res.redirect("/users/login");
    }
});

//view applied jobs
app.get("/appliedJobs/:api_id", async (req, res) => {
    if (req.user.id) {
        var getJob = null;
        // console.log(getAllJobs);
        var api_id = req.params.api_id;

        const job = await getJobById(api_id);
        getJob = job.rows[0];
        res.render("appliedJobs/edit.ejs", {
            getJob: getJob,
            title: "Edit Applied Job",
        });
    } else {
        req.flash("success_msg", "You must logged-in first");
        res.redirect("/users/login");
    }
});
//update applied job information
app.put("/appliedJobs/:api_id", async (req, res) => {
    console.log("reached to update route");

    if (req.user.id) {
        var getJob = null;
        var api_id = req.params.api_id;
        var contactPerson = req.body.contact_person;
        var applicationDate = req.body.application_date;
        var followUpDate = req.body.follow_up_date;
        var interviewDate = req.body.interview_date;
        var remarks = req.body.remarks;

        //change the sql to update

        pool.query(
            `UPDATE usertojobs SET 
            contactperson = '${contactPerson}',  
            dateofapplication = '${applicationDate}', 
            followupdate = '${followUpDate}',
            interviewdate = '${interviewDate}',
            remarks = '${remarks}' 
            WHERE api_id='${api_id}';`,
            (error, results) => {
                if (error) {
                    throw error;
                }
                getJob = results.rows[0];
                req.flash("success_msg", "Edited successfully");
                res.redirect("/appliedJobs");
            }
        );
        // });
    } else {
        req.flash("success_msg", "You must logged-in first");
        res.redirect("/users/login");
    }
});

// delete applied jobs
app.delete("/appliedJobs/delete/:api_id", (req, res) => {
    console.log("reached to delete route");
    if (req.user.id) {
        var user_id = req.user.id;
        var api_id = req.params.api_id;
        console.log(api_id);
        //change the sql to update
        pool.query(
            `DELETE FROM userToJobs WHERE api_id='${api_id}' and user_id=${user_id};`,
            (error, results) => {
                if (error) {
                    throw error;
                }
                //   getJob = results.rows[0];
                req.flash("success_msg", "Deleted successfully");
                res.redirect("/appliedJobs");
                //});
                // });
            }
        );
    } else {
        req.flash("success_msg", "You must logged-in first");
        res.redirect("/users/login");
    }
});
// using asynchronous
app.post("/users/register", async (req, res) => {
    console.log(req);
    // get variables from the form
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
        res.render("register", { errors, title: "Register Page" });
    } else {
        // form validation is all correct. Now tackle the bcrypt password component
        // Remember, it is asynchronous hence the await command
        // parameters: password, # of rounds to encrypt
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // query the database to see if hte user exists already.
        // $1 will be replaced by the variable we will pass in....which is email

        const results = await getUserByEmail(email);
        console.log("results after getUserByEmail", results);
        if (results.rows.length > 0) {
            errors.push({ message: "Email already registered" });
            // re render the register page
            res.render("register", { errors, title: "Register Page" });
        } else {
            await addUser(firstname, lastname, email, hashedPassword);
            req.flash("success_msg", "You are now registered. Please log in");

            res.redirect("/users/login");
        }
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
    console.log("hello.");
    const baseURL = "https://jobs.github.com/positions.json";

    // just initialise it to one - it will break once the results = 0
    let resultCount = 50;
    onPage = 0; // used for each page that will have 50 results each

    // hold all results of jobs in an array
    const allJobs = [];
    let a = 0;
    let clockInterval = setInterval(() => {
        a += 1;
    }, 1000);
    console.log("clock = ", clockInterval);
    // fetch all pages
    while (resultCount === 50) {
        // access the URL
        const res = await fetch(`${baseURL}?page=${onPage}`);
        // pulling out the json from the response
        const jobs = await res.json();
        // create a flat array with a spread operator.
        allJobs.push(...jobs);
        // capture how many results appear on that appage
        resultCount = jobs.length;
        console.log("got", resultCount, "jobs");
        onPage++;
    }

    console.log("clock = ", a);
    console.log("Obtained: ", allJobs.length, "jobs total");
    //console.log(allJobs);
    // const response = await axios.get("https://jobs.github.com/positions.json");
    // const listings = response.data;

    let newListings = allJobs;
    // Get jobs from database
    const { rows } = await getJobs();

    // remove same jobs
    rows.forEach((row) => {
        for (let index = 0; index < newListings.length; index++) {
            if (newListings[index].id === row.api_id) {
                newListings.splice(index, 1);
                break;
            }
        }
    });

    // Add new listings
    for (let i = 0; i < newListings.length; i++) {
        console.log("listings[i] =", newListings[i]);
        await saveJob(newListings[i]);
    }

    res.redirect("/users/dashboard");
});

app.get("/viewjobs", async (req, res) => {
    const { rows } = await getJobs();

    res.render("show", {
        getAllJobs: rows,
        title: "Jobs Page",
    });
});
// app.get("/viewjobs", db.getAllJobs);

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
