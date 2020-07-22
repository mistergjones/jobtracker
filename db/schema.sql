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

INSERT INTO users
    (firstname, lastname, email, password)
VALUES
    ('glen', 'jones', 'gj@gj.com', 'password');

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
    ('cc20d9f2-0102-4785-8253-66093d3ca5c0', 'Full Time', 'https://jobs.github.com/positions/cc20d9f2-0102-4785-8253-66093d3ca5c0', 'Thu Jul 16 02:02:01 UTC 2020', 'Koffie Labs', 'https://www.getkoffie.com/', 'NYC/Remote', 'Junior Data Engineer', '<p>Koffie is an insurance company purpose built for the autonomous vehicle era. We are taking transportation insurance out of the dark ages by using modern technology to deliver instant policies based on advanced safety and autonomous technology. As an InsurTech, Koffie is free from legacy systems and inefficient processes, our AI-driven predictive models deliver a reimagined insurance experience for fleets.</p>\n<p>We believe strongly in diversity of thought which comes from different backgrounds and experiences and want to hear from you, regardless of where you live. Koffie is a work from home first company but believes face time every few weeks is essential.</p>\n<p>Our vision is to align incentives across fleets, technology providers, brokers and the automotive industry. By catalyzing the adoption of safety technology, we positively impact road safety and facilitate a more efficient supply chain. Were backed by top-tier VCs in the fintech and mobility sectors. If youre ready to work obsessively with us to make insurance better, faster, more efficient and build products for the next 100 years of mobility, we want to hear from you.</p>\n<p>Description\nThis is a unique role that offers broad exposure to software engineering and data science. We are eager to find underrepresented candidates who are early in their career and dont want to choose between engineering or data science.</p>\n<p>Working with data science and engineering, you will be deeply enmeshed in the critical nuances of disambiguation, normalization, standardization and other ETL skills. You will also have the opportunity to work in all stages of our software process from researching data sources to developing data pipelines and building business intelligence visualization tools.</p>\n<p>Responsibilities</p>\n<p>Design and build data pipelines\nRun and iterate data science experiments in the cloud and in a production environment\nSupport business intelligence and data science needs via visualization/reporting</p>\n<p>Background/Experience</p>\n<p>-Undergraduate CS degree or equivalent; 2-5 years professional experience\n-Experience with python; the ideal candidate is generally comfortable with web programming, consuming APIs, data wrangling, etc.\n-ETL processes on large open/public (&gt;50 GB) datasets a plus\n-Designing systems that store/query geospatial and time series data\n-Familiarity with python data engineering, data science, and visualization frameworks\n-Good understanding of classification and regression metrics\n-Curiosity for insurance and autonomous technology applied to transportation/trucking\n-Entrepreneurial mindset and comfort with ambiguity</p>\n<p>Benefits\nFor US employees we offer a competitive salary, stock options, unlimited vacation, 100% employer paid health, vision and dental plans, commuter benefits and discounted fitness classes, generous WFH stipend, personal learning/training (for professional/industry certification) and conference budget. For remote hires outside the US, we are unable to provide employer paid health, vision and dental plans, commuter benefits and discounted fitness classes.</p>\n<p>We believe strongly in diversity of thought which comes from different backgrounds and experiences. Covid has helped us transform to a WFH-first company, so periodic multi-day get-togethers are an essential part of growing our team.</p>\n', '<p><a href=\"https://apply.workable.com/j/A4566CE638\">https://apply.workable.com/j/A4566CE638</a></p>\n', 'https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e4bccde8a00566a0961a533bbed67c6026714783/koffie%20logo%20black.jpg');




