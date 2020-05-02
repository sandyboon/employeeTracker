const mysql = require('mysql2/promise');

//creates a connection pool
//use pool.qeury(`query`) to run query which call getConnection() and query() and then releases the connection to the pool
//dont forget to end the pool when application exits
async function createPool(userName, password) {
  console.log(`Getting pool with ${userName} | ${password}`);
  let pool = await mysql.createPool({
    connectionLimit: 10, //number of conn. in pool
    host: 'localhost',
    port: 3306,
    user: userName,
    password: password,
    database: 'employeeTracker',
  });
  console.log('connected to database ');
  return pool;
}

module.exports = createPool;
