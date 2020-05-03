const connectionPool = require('./dbConnection');
const employeeDatabase = require('./emplyeeDB');

async function init() {
  let employeeDB = null;
  try {
    employeeDB = new employeeDatabase(await connectionPool('root', 'password'));
    await employeeDB.getRowCount('department');
    await employeeDB.getAllRecords('employee');
    await employeeDB.updateEmployeeRole(2, 1);
    await employeeDB.viewEmployee(2);
    /*try {
      const newDepartement = 'kaamkaaj7';
      await employeeDB.insertDepartment(newDepartement);
      console.log(
        '\x1b[32m',
        `New departement ${newDepartement} has been added!`
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(
          'A department already exists with that name. Please try again...'
        );
      } else {
        console.log(
          'An error occured while attempting to add the new department please try again ...'
        );
      }
    }
    try {
      console.log('Inserting role...');
      await employeeDB.insertRole({
        title: 'Workingt',
        salary: '2000',
        department_id: 200,
      });
    } catch (error) {
      if (error.code.includes('ER_NO_REFERENCED_ROW')) {
        console.log('Invalid department id. Please try again');
      }
      console.log(error);
    }

    try {
      console.log('Inserting role...');
      await employeeDB.insertEmployee({
        first_name: 'ramu',
        last_name: 'ji',
        role_id: 1,
        manager_id: null,
      });
    } catch (error) {
      if (error.code.includes('ER_NO_REFERENCED_ROW')) {
        console.log('Invalid department id. Please try again');
      }
      console.log(error);
    }*/
  } catch (err) {
    console.log(err);
  } finally {
    if (employeeDB !== null) employeeDB.closePool();
  }
}

init();
