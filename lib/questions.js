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

questions.getRoleDepartment = function RoleDept() {
  this.message = 'Please select a department for this new role';
  this.name = 'department_id';
  this.type = 'list';
  this.departmentObjs = null;
  this.choices = [];
  this.filter = (val) => {
    return this.departmentObjs.filter((dept) => dept.name === val)[0].id;
  };
  this.validate = validateRequiredString;
};

questions.getEmployeeFName = {
  message: 'Please provide first name of the new Employee',
  name: 'first_name',
  type: 'input',
  validate: validateRequiredString,
};

questions.getEmployeeLName = {
  message: 'Please provide last name of the new Employee',
  name: 'last_name',
  type: 'input',
  validate: validateRequiredString,
};

questions.getRoleForEmployee = function RoleForEmployee() {
  this.message = 'Please select a role for this new employee: ';
  this.name = 'role_id';
  this.type = 'list';
  this.choices = [];
  this.filter = (val) => {
    return val.substring(0, val.indexOf('|')).trim();
  };
  this.validate = validateRequiredString;
};

questions.getManagerForEmployee = function ManagerorEmployee() {
  this.message = 'Please select a manager for this new employee: ';
  this.name = 'manager_id';
  this.type = 'list';
  this.choices = [];
  this.filter = (val) => {
    return val.includes('|') ? val.substring(0, val.indexOf('|')).trim() : null;
  };
  this.validate = validateRequiredString;
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

questions.filterChoicesIfDataFound = (action) => {
  return (
    action !== questions.possibleActions.QUIT &&
    action !== questions.possibleActions.NO_ROLE_FOUND &&
    action !== questions.possibleActions.NO_DEPT_FOUND
  );
};
/**
 * If there are no dept. defined then the only question to be presented is to crete a Department first
 */
questions.getQuestions = function (haveDeptBeenDefined, haveRolesBeenDefine) {
  //empty the choices. Start with Quit
  this.userActions.choices.push(this.possibleActions.QUIT);
  if (!haveDeptBeenDefined) {
    this.userActions.choices.push(this.possibleActions.NO_DEPT_FOUND);
  } else if (!haveRolesBeenDefine) {
    this.userActions.choices.push(this.possibleActions.CREATE_DEPT);
    this.userActions.choices.push(this.possibleActions.NO_ROLE_FOUND);
  } else {
    //User can be presented with all the choices
    this.userActions.choices.push(
      ...Object.values(this.possibleActions).filter(
        this.filterChoicesIfDataFound
      )
    );
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
  let roleCreationQuestions = [];
  roleCreationQuestions.push(this.getRoleName);
  roleCreationQuestions.push(this.getRoleSalary);

  let roleDeptQuestion = new this.getRoleDepartment();
  roleDeptQuestion.choices = departments.map((dept) => dept.name);
  roleDeptQuestion.departmentObjs = departments;
  roleCreationQuestions.push(roleDeptQuestion);
  return roleCreationQuestions;
};

questions.getEmployeeCreationQuestions = function (roles, managers) {
  let employeeCreationQues = [];
  employeeCreationQues.push(this.getEmployeeFName);
  employeeCreationQues.push(this.getEmployeeLName);

  let roleDeptQuestion = new this.getRoleForEmployee();
  roleDeptQuestion.choices = roles.map(
    (role) =>
      `${role.id} | ${role.title} in Department: ${role.department} with Salary: ${role.salary}`
  );

  let empManageQuestion = new this.getManagerForEmployee();
  empManageQuestion.choices.push(`No Manager`);
  empManageQuestion.choices.push(
    ...managers.map(
      (emp) =>
        `${emp.id} | ${emp.name} in Department: ${emp.department} with Role: ${emp.title}`
    )
  );
  employeeCreationQues.push(roleDeptQuestion);
  employeeCreationQues.push(empManageQuestion);
  return employeeCreationQues;
};

questions.getDefaultManager;

module.exports = questions;
