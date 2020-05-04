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
        console.log('will create a new role');
        await this.getNewRole();
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

  async getNewRole() {
    const answer = await inquirer.prompt(
      questions.getRoleCreationQuestions(await this.employeeDb.getAllRecords())
    );
    console.log('Promopted title: ' + answer.title);
    console.log('Promopted dept: ' + answer.deptName);
    console.log('prompted..' + stringify(answer));
  }
}

module.exports = Responder;
