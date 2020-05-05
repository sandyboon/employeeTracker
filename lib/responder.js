const { parse, stringify } = require('flatted/cjs');
const inquirer = require('inquirer');
const questions = require('./questions');
const colorCode = require('./consoleColors');

class Responder {
  constructor(employeeDb) {
    this.employeeDb = employeeDb;
  }

  async respondToUserChoice({ choices }) {
    switch (choices) {
      case questions.possibleActions.QUIT:
        break;

      case questions.possibleActions.CREATE_DEPT:
      case questions.possibleActions.NO_DEPT_FOUND:
        //We need to ask question for creating a dept
        let newDepartment = await this.createNewDepartment();
        console.table(newDepartment);
        break;

      case questions.possibleActions.CREATE_ROLE:
      case questions.possibleActions.NO_ROLE_FOUND:
        let newRole = await this.createNewRole();
        console.log(colorCode.magenta, 'New Role Added!');
        console.table(newRole);
        break;

      case questions.possibleActions.CREATE_EMP:
        let newEmp = await this.createNewEmployee();
        console.log(colorCode.magenta, 'New Employee Added!');
        console.table(newEmp);
      default:
        break;
    }
  }

  async createNewDepartment() {
    return await this.employeeDb.insertDepartment(await this.getDeptName());
  }

  async getDeptName() {
    const answer = await inquirer.prompt(
      questions.getDepartMentCreationQuestions()
    );
    console.log('prompted..' + stringify(answer));
    return answer.name;
  }

  async createNewRole() {
    const answers = await inquirer.prompt(
      questions.getRoleCreationQuestions(
        await this.employeeDb.getAllRecords('department')
      )
    );
    //create the new role in database
    return await this.employeeDb.insertRole(answers);
  }

  async createNewEmployee() {
    const answers = await inquirer.prompt(
      questions.getEmployeeCreationQuestions(
        await this.employeeDb.viewAllRoles(),
        await this.employeeDb.getEmployeesWithRole()
      )
    );
    return await this.employeeDb.insertEmployee(answers);
  }
}

module.exports = Responder;
