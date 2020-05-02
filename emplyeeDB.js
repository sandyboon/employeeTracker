/**Module to connect to DB and fire all sorts of queries on DB */
const mysql = require('mysql2/promise');
const connectionPool = require('./dbConnection');
const cTable = require('console.table');

class EmployeeDB {
  static poolInitialized = false;
  constructor(dbConnectionPool) {
    this.pool = dbConnectionPool;
  }
  async getRowCount(tableName) {
    const [rows] = await this.pool.execute(
      `SELECT COUNT(1) AS COUNT FROM ${tableName}`
    );
    console.table(rows);
  }

  async closePool() {
    await this.pool.end();
    console.log(
      'Db Connection pool closing. All db conenction are closed now.'
    );
  }
}

module.exports = EmployeeDB;
