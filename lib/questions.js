const questions = {};

questions.possibleActions = {
  NO_DEPT_FOUND: 'No Departments found! Create a new department...',
  NO_ROLE_FOUND: 'No Roles found! Create a new role...',
  QUIT: 'Quit',
  //Create
  CREATE_DEPT: 'Add a new department',
  CREATE_ROLE: 'Add a new role',
  CREATE_EMP: 'Add a new employee',

  //View
  VIEW_ALL_MP: 'View All Employees',
  VIEW_EMP: 'View a specific Employee',
  VIEW_ALL_DEPT: 'View All Department',
  VIEW_ALL_ROLES: 'View All Roles',

  //UPDATE
  UPDATE_EMP_ROLE: "Update an Employee's role",
};

questions.passwordQuestion = {
  type: 'password',
  message: 'Please provide password to the database server...',
  name: 'dbPassword',
  mask: '*',
  validate: validateRequiredString,
};

questions.userNameQuestion = {
  message: 'Please provide username to the database server...',
  name: 'userName',
  type: 'input',
  default: 'root',
  validate: validateRequiredString,
};

questions.createADepartment = {
  message: 'Please provide a name for the new department',
  name: 'name',
  type: 'input',
  validate: validateRequiredString,
};

questions.getRoleName = {
  message: 'Please provide a name for the new role',
  name: 'title',
  type: 'input',
  validate: validateRequiredString,
};

questions.getRoleSalary = {
  message: 'Please provide the salary for this new role',
  name: 'salary',
  type: 'number',
  validate: validateNumber,
};

questions.getRoleDepartment = {
  message: 'Please select a department for this new role',
  name: 'deptName',
  type: 'list',
  departmentObjs: null,
  choices: [],
  filter: (val) => {
    return val + '123';
  },
  validate: validateRequiredString,
};

questions.getEmployeeName = {
  message: 'Please provide a name for the new Employee',
  name: 'name',
  type: 'input',
  validate: validateRequiredString,
};

questions.userActions = {
  type: 'list',
  name: 'choices',
  message: '',
  choices: [],
};

function validateRequiredString(input) {
  if (typeof input === 'undefined' || input.trim().length === 0) {
    return 'This is a required field';
  }
  return true;
}

function validateNumber(input) {
  if (typeof input === 'undefined' || isNaN(input) || input <= 0) {
    return 'Please provide a positive number';
  }
  return true;
}
/**
 * If there are no dept. defined then the only question to be presented is to crete a Department first
 */
questions.getQuestions = function (haveDeptBeenDefined, haveRolesBeenDefine) {
  //empty the choices. Start with Quit
  this.userActions.choices = [this.possibleActions.QUIT];
  if (!haveDeptBeenDefined) {
    this.userActions.choices.push(this.possibleActions.NO_DEPT_FOUND);
  } else if (!haveRolesBeenDefine) {
    this.userActions.choices.push(this.possibleActions.NO_ROLE_FOUND);
  } else {
    //User can be presented with all the choices
    this.userActions.choices.push(Object.values(this.possibleActions));
  }
  return this.userActions;
};

questions.getDepartMentCreationQuestions = function () {
  let deptCreationQues = [];
  deptCreationQues.push(this.createADepartment);
  // deptCreationQues.push(this.getEmployeeName);
  console.log(deptCreationQues);
  return deptCreationQues;
};

questions.getRoleCreationQuestions = function (departments) {
  console.log(departments);
  let roleCreationQuestions = [];
  roleCreationQuestions.push(this.getRoleName);
  roleCreationQuestions.push(this.getRoleSalary);
  this.getRoleDepartment.choices = departments.map((dept) => dept.name);
  this.getRoleDepartment.departmentObjs = departments;
  console.log(this.getRoleDepartment);
  roleCreationQuestions.push(this.getRoleDepartment);
  return roleCreationQuestions;
};

module.exports = questions;
