const { runSql } = require("../lib/queries")

const getSavedJobs = async userId => {
    let savedJobs = [];
    const results = await getSavedJobIdsByUserId(userId);
    for (let i = 0; i < results.rows.length; i++) {
        const { rows } = await getJobsById(results.rows[i].api_id);
        savedJobs.push(rows[0]);
    }
    return savedJobs;
}

const getJobsById = async jobId => {
    const sql = "Select * FROM jobs WHERE api_id = $1";
    const params = [jobId];
    const jobs = await runSql(sql, params);
    return jobs;
}

const getSavedJobIdsByUserId = async userId => {
    const sql = "SELECT api_id FROM userToJobs WHERE user_id = $1";
    const params = [userId]
    const savedJobIds = await runSql(sql, params);
    return savedJobIds;
}
module.exports = { getSavedJobs };