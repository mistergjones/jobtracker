// // import the data base pool query settings
const { pool } = require("../dbConfig");

const runSql = async (sql, params) => {
    try {
        const results = await pool.query(sql, params);
        return results;
    } catch (error) {
        console.log("There has been an error!", sql, error)
    }

}

module.exports = {
    runSql
}

// // establish the and run the query. Return the results.
// const getAllJobs = (request, response) => {
//     pool.query("SELECT * FROM jobs ORDER BY id ASC", (error, results) => {
//         if (error) {
//             throw error;
//         }
//         response.status(200).json(results.rows);
//     });
// };

// module.exports = {
//     getAllJobs,
// };
