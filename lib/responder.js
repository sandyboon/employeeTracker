const { parse, stringify } = require('flatted/cjs');
const inquirer = require('inquirer');
const questions = require('./questions');

class Responder {
  constructor(employeeDb) {
    this.employeeDb = employeeDb;
  }

  async parseUserChoice({ choices }) {
    console.log('Parsing choices ..' + choices);
    switch (choices) {
      case questions.possibleActions.QUIT:
        break;
      case questions.possibleActions.CREATE_DEPT:
      case questions.possibleActions.NO_DEPT_FOUND:
        //We need to ask question for creating a dept
        await this.employeeDb.insertDepartment(await this.getDeptName());
        break;
      case questions.possibleActions.CREATE_ROLE:
      case questions.possibleActions.NO_ROLE_FOUND:
        let newRole = await this.createNewRole();
        console.table(newRole);
        break;
      default:
        break;
    }
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
    this.employeeDb.insertRole(answers);
  }
}

module.exports = Responder;
