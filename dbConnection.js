const mysql = require('mysql2/promise');
const { parse, stringify } = require('flatted/cjs');

const dbName = 'employeeTracker';
const dbServerPort = 3306;
const dbServerHost = 'localhost';
const connectionInPool = 10;
//creates a connection pool
//use pool.qeury(`query`) to run query which call getConnection() and query() and then releases the connection to the pool
//dont forget to end the pool when application exits
async function createPool(userName, password) {
  console.log(
    `Getting pool with userName: ${userName} | password: ${password}`
  );
  try {
    let pool = await mysql.createPool({
      connectionLimit: connectionInPool, //number of conn. in pool
      host: dbServerHost,
      port: dbServerPort,
      user: userName,
      password: password,
      database: dbName,
    });
    return pool;
  } catch (error) {
    throw error;
  }
  console.log('pool connected to database ' + stringify(pool));
}

module.exports = createPool;
