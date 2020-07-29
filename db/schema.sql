-- These commands create the required database for jobTracker

-- drop database if it exits
drop database jobtracker;


-- create the database;
create database jobtracker;

-- connect to the database. Note: you need to on the cli psql
\c jobtracker;

-- now create the main tables.

CREATE TABLE users
(
    id SERIAL PRIMARY KEY NOT NULL,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    UNIQUE (email)
);

INSERT INTO users (firstname, lastname, email, password) VALUES ('glen', 'jones', 'gj@gj.com', 'password');
INSERT INTO users (firstname, lastname, email, password) VALUES ('ben', 'jones', 'bj@bj.com', 'password');
INSERT INTO users (firstname, lastname, email, password) VALUES ('ken', 'jones', 'kj@kj.com', 'password');
INSERT INTO users (firstname, lastname, email, password) VALUES ('mr', 'jones', 'mr@mr.com', 'password');

CREATE TABLE jobs
(
    id SERIAL PRIMARY KEY NOT NULL,
    api_id VARCHAR(1000) NOT NULL,
    type VARCHAR(1000) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    created_at VARCHAR(500) NOT NULL,
    company VARCHAR(1000) NOT NULL,
    company_url VARCHAR(1000),
    location VARCHAR(1000) NOT NULL,
    title VARCHAR(1000) NOT NULL,
    description VARCHAR(50000) NOT NULL,
    how_to_apply VARCHAR(3000) NOT NULL,
    company_logo VARCHAR(3000)
);

INSERT INTO jobs
    (api_id, type, url, created_at, company, company_url, location, title, description, how_to_apply, company_logo)
VALUES
    ('100', 'Full Time', 'https://jobs.github.com/positions/cc20d9f2-0102-4785-8253-66093d3ca5c0', 'Thu Jul 16 02:02:01 UTC 2020', 'IBM', 'https://www.getkoffie.com/', 'NYC/Remote', 'Junior Data Engineer', '<p>IBM is an </p>\n', 'https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e4bccde8a00566a0961a533bbed67c6026714783/koffie%20logo%20black.jpg','');

INSERT INTO jobs
    (api_id, type, url, created_at, company, company_url, location, title, description, how_to_apply, company_logo)
VALUES
    ('200', 'Part Time', 'https://jobs.github.com/positions/cc20d9f2-0102-4785-8253-66093d3ca5c0', 'Thu Jul 16 02:02:01 UTC 2020', 'Telstra', 'https://www.getkoffie.com/', 'NYC/Remote', 'Junior Data Engineer', '<p>Telstra is an </p>\n', 'https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e4bccde8a00566a0961a533bbed67c6026714783/koffie%20logo%20black.jpg','');
INSERT INTO jobs
    (api_id, type, url, created_at, company, company_url, location, title, description, how_to_apply, company_logo)
VALUES
        ('300', 'Half Time', 'https://jobs.github.com/positions/cc20d9f2-0102-4785-8253-66093d3ca5c0', 'Thu Jul 16 02:02:01 UTC 2020', 'Facebook', 'https://www.getkoffie.com/', 'NYC/Remote', 'Junior Data Engineer', '<p>Facebook is an </p>\n', 'https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e4bccde8a00566a0961a533bbed67c6026714783/koffie%20logo%20black.jpg','');
INSERT INTO jobs
    (api_id, type, url, created_at, company, company_url, location, title, description, how_to_apply, company_logo)
VALUES
        ('400', 'Quarter Time', 'https://jobs.github.com/positions/cc20d9f2-0102-4785-8253-66093d3ca5c0', 'Thu Jul 16 02:02:01 UTC 2020', 'Google', 'https://www.getkoffie.com/', 'NYC/Remote', 'Junior Data Engineer', '<p>Google is an </p>\n', 'https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e4bccde8a00566a0961a533bbed67c6026714783/koffie%20logo%20black.jpg','');




create table userToJobs (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id NUMERIC(4) NOT NULL,
    api_id VARCHAR(50) NOT NULL
    );

INSERT INTO userToJobs (user_id,api_id) values (6,'100');
INSERT INTO userToJobs (user_id,api_id) values (6,'300');
INSERT INTO userToJobs (user_id,api_id) values (9,'200');

-- Perhaps we need to implement a boolean column in users to denote if they have saved a job or not...(T/F). If a user goes to a saved jobs screen..if (F) - show no jobs saved ELSE (t) show jobs;
-- Perhaps we need to implement a column in userToJobs to capture a message that "job no longer available"
-- Perhaps we need an SQL Delete statement that when a user sees the above, they hit "remove", and hte SQL removes it from userToJobs table

-- the below is a query that determines which job has not been saved in a userToJobs table
select t1.api_id from jobs t1 LEFT JOIN userToJobs t2 ON t2.api_id = t1.api_id WHERE t2.api_id IS NULL;

-- algorithm
-- 1. load the data api in as per usual in the normal table
-- 2. keep track of the user id in the session....this is valuable (params???)
-- 3. When a user hits "save"...the following needs to occur:
    -- a. take the user id and the API_ID and insert it into the table (userToJobs)
        -- i. NOTE: we have another screen/route that will run a simple SELECT query to only show their saved jobs (NOTE: need to track their USER_ID for this)
        -- ii. the user just continues where they are and adds jobs.
        -- iii. perhaps update the "saved_job_status === true)

-- 4. The next time a refresh occurs: 
    -- a. IF the API_ID only exists in the JOBS table (i.e. it is not in the latest batch) && NOT IN the table 'usersToJobs', we can simply delete the records (the above query identifies this). 
    
-- 5. The next time a refresh occurs: (a user HAS saved a job)
    -- a. IF the API_ID only exists in the JOBS table (i.e. it is not in the latest batch) && API_ID exists in USERTOJOBS table... 
        -- i. delete record from JOBS table.
        -- ii. update status in USERTOJOBS to "Job no longer available". 
        -- NOTE: So when a user looks at this job, they can then delete this from their screen.

