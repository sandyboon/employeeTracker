const inquirer = require('inquirer');

const connectionPool = require('./dbConnection');
const EmployeeDatabase = require('./emplyeeDB');
const Responder = require('./lib/responder');
const questions = require('./lib/questions');
const colorCode = require('./lib/consoleColors');

let employeeDB;
let responderInstance;

async function init() {
  showWelcomeMessage();
  const connectionPoolInstance = await connectionPool(
    await getDbUserName(),
    await getMySQLPassword()
  );

  try {
    employeeDB = new EmployeeDatabase(connectionPoolInstance);
    responderInstance = new Responder(employeeDB);
    let userResponse = await getUserResponse();
    while (userWantsToContinue(userResponse)) {
      userResponse = await getUserResponse();
      await responderInstance.parseUserChoice(userResponse);
    }
    //
    // ;
    // await employeeDB.getAllRecords('employee');
    // await employeeDB.updateEmployeeRole(2, 1);
    // await employeeDB.viewEmployee(2);
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

function userWantsToContinue(userResponse) {
  return userResponse.choices !== questions.possibleActions.QUIT;
}

async function getUserResponse() {
  return await inquirer.prompt(
    questions.getQuestions(
      await haveDeptBeenDefined(),
      await haveRolesBeenDefined()
    )
  );
}

async function haveRolesBeenDefined() {
  const rolesCount = await employeeDB.getRowCount('role');
  return rolesCount > 0;
}

async function haveDeptBeenDefined() {
  const deptCount = await employeeDB.getRowCount('department');
  return deptCount > 0;
}

async function getDbUserName() {
  const { userName } = await inquirer.prompt(questions.userNameQuestion);
  return userName;
}

/**
 * Prompt the user for their mysql password.
 */
async function getMySQLPassword() {
  const { dbPassword } = await inquirer.prompt(questions.passwordQuestion);
  return dbPassword;
}

function showWelcomeMessage() {
  console.log(
    colorCode.green,
    '************Welcome to the Employee Tracker System**************'
  );
  console.log(colorCode.white);
}

function parseUserChoice() {}

init();
