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
    let userResponse;
    do {
      userResponse = await getUserResponse();
      await responderInstance.respondToUserChoice(userResponse);
    } while (userWantsToContinue(userResponse));
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
