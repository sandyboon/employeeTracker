const connectionPool = require('./dbConnection');
const employeeDatabase = require('./emplyeeDB');

async function init() {
  let employeeDB = null;
  try {
    employeeDB = new employeeDatabase(await connectionPool('root', 'password'));
    await employeeDB.getRowCount('department');
  } catch (err) {
    console.log(err);
  } finally {
    if (employeeDB !== null) employeeDB.closePool();
  }
}

init();
