const { runSql } = require("../lib/queries");

const getSavedJobs = async (userId) => {
    let savedJobs = [];
    const results = await getSavedJobIdsByUserId(userId);
    // console.log(results.length);
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
    console.log("results = ", results);
    for (let i = 0; i < results.rows.length; i++) {
        const { rows } = await getJobById(results.rows[i].api_id);
        savedJobs.push({
            ...rows[0],
            contactperson: results.rows[i].contactperson,
            applicationdate: results.rows[i].dateofapplication,
            followupdate: results.rows[i].followupdate,
            interviewdate: results.rows[i].interviewdate,
            remarks: results.rows[i].remarks
        });
    }

    // console.log(savedJobs.length);
    // console.log(savedJobs);
    // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBASDFASFDSFSDAFSDAFADFDSAFFDAS");
    return savedJobs;
};

const getJobById = async (jobId) => {
    const sql = "Select * FROM jobs WHERE api_id = $1";
    const params = [jobId];
    const job = await runSql(sql, params);
    return job;
};

const getSavedJobByUserIdandJobId = async (userId, jobId) => {
    const sql = "SELECT * FROM userToJobs WHERE user_id = $1 AND api_id = $2";
    const params = [userId, jobId];
    const job = await runSql(sql, params);

    const results = await getJobById(jobId);

    console.log("results **** === ", results)
    console.log("job = ", job);
    return {
        ...job.rows[0],
        company: results.rows[0].company,
        title: results.rows[0].title
    };
}


const getSavedJobIdsByUserId = async (userId) => {
    const sql = "SELECT * FROM userToJobs WHERE user_id = $1";
    const params = [userId];
    const savedJobIds = await runSql(sql, params);
    // console.log(savedJobIds.length);
    // console.log("DDDDDDDDDDDDDDDDDDDDDASDFSAFSFASDFASFASDFSDADSFADSAFSD");
    return savedJobIds;
};

const saveJobIdsForUserId = async (jobId, userId) => {
    const sql = "INSERT INTO usertojobs (api_id, user_id) VALUES ($1,$2)";
    const params = [jobId, userId];
    const result = await runSql(sql, params);
};

const getJobs = async () => {
    const sql = "SELECT * FROM jobs ORDER BY id ASC";
    const params = [];
    const jobs = await runSql(sql, params);
    return jobs;
};

const saveJob = async (job) => {
    const sql = `INSERT INTO jobs (api_id,type, url, created_at, company, company_url, location, title, description, how_to_apply, company_logo)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
    params = [
        job.id,
        job.type,
        job.url,
        job.created_at,
        job.company,
        job.company_url,
        job.location,
        job.title,
        job.description,
        job.how_to_apply,
        job.company_logo,
    ];
    console.log("saveJob");
    await runSql(sql, params);
};
module.exports = {
    getJobById,
    getSavedJobs,
    saveJobIdsForUserId,
    getJobs,
    saveJob,
    getSavedJobByUserIdandJobId
};
