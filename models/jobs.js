const { runSql } = require("../lib/queries")

const getSavedJobs = async userId => {
    let savedJobs = [];
    const results = await getSavedJobIdsByUserId(userId);
    for (let i = 0; i < results.rows.length; i++) {
        const { rows } = await getJobById(results.rows[i].api_id);
        savedJobs.push(rows[0]);
    }
    return savedJobs;
}

const getJobById = async jobId => {
    const sql = "Select * FROM jobs WHERE api_id = $1";
    const params = [jobId];
    const job = await runSql(sql, params);
    return job;
}

const getSavedJobIdsByUserId = async userId => {
    const sql = "SELECT api_id FROM userToJobs WHERE user_id = $1";
    const params = [userId]
    const savedJobIds = await runSql(sql, params);
    return savedJobIds;
}

const saveJobIdsForUserId = async (jobId, userId) => {
    const sql = "INSERT INTO usertojobs (api_id, user_id) VALUES ($1,$2)";
    const params = [jobId, userId];
    const result = await runSql(sql, params);
}

const getJobs = async () => {
    const sql = "SELECT * FROM jobs ORDER BY id ASC";
    const params = [];
    const jobs = await runSql(sql, params);
    return jobs;
}

const saveJob = async job => {
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
        job.company_logo
    ]
    console.log("saveJob");
    await runSql(sql, params);
}
module.exports = {
    getJobById,
    getSavedJobs,
    saveJobIdsForUserId,
    getJobs,
    saveJob
};