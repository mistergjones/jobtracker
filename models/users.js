const { runSql } = require("../lib/queries")

const getUserByEmail = async email => {
    const sql = "SELECT * FROM users WHERE email = $1";
    const params = [email];
    const user = await runSql(sql, params);
    return user;
}

const addUser = async (firstname, lastname, email, hashedPassword) => {
    const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES ($1,$2,$3,$4)RETURNING id, password";
    const params = [firstname, lastname, email, hashedPassword];
    const result = await runSql(sql, params);
}


module.exports = {
    getUserByEmail,
    addUser
}