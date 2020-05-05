/**Module to connect to DB and fire all sorts of queries on DB */
const mysql = require('mysql2/promise');
const cTable = require('console.table');

/*Constants defining table names */
const DEPARTMENT = 'department';
const ROLE = 'role';
const EMPLOYEE = 'employee';

class EmployeeDB {
  static poolInitialized = false;
  constructor(dbConnectionPool) {
    this.pool = dbConnectionPool;
  }
  async getRowCount(tableName) {
    const [rows] = await this.pool.execute(
      `SELECT COUNT(1) AS COUNT FROM ${tableName}`
    );
    return rows[0].COUNT;
  }

  async getAllRecords(tableName) {
    const [rows] = await this.pool.execute(`SELECT * FROM ${tableName}`);
    return rows;
  }

  async getAllDeptNames() {
    const [rows] = await this.pool.execute(`SELECT name FROM ${DEPARTMENT}`);
    // console.log('names is : ' + rows.map((dept) => dept.name));
    return rows;
  }

  async viewAllEmployees() {
    const [rows] = await this.pool
      .execute(`SELECT EMP1.id, EMP1.first_name, EMP1.last_name, title, name AS department, salary, 
      CONCAT( EMP2.first_name, ' ', EMP2.last_name) as manager 
      FROM employee AS EMP1 
      LEFT JOIN employee EMP2 on EMP1.manager_id = EMP2.id 
      JOIN role on EMP1.role_id = role.id 
      JOIN department on role.department_id = department.id ORDER BY EMP1.id`);
    return rows;
  }

  async viewAllRoles() {
    const [rows] = await this.pool
      .execute(`SELECT role.*, department.name as department FROM role JOIN department ON role.department_id = department.id 
      order by role.id`);
    return rows;
  }

  async getEmployeesWithRole() {
    const [rows] = await this.pool.execute(`
    SELECT employee.id, concat(first_name, ' ',  last_name) AS name, role.title, department.name AS department 
    FROM employee join role ON employee.role_id = role.id JOIN
    department ON department.id = role.department_id ORDER BY employee.id`);
    return rows;
  }

  async getEmployeesWithManager() {
    const [rows] = await this.pool.execute(`
    SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS name, role.title, department.name AS department,
 concat(E2.first_name, ' ', E2.last_name) AS manager
    FROM employee join role ON employee.role_id = role.id JOIN
    department ON department.id = role.department_id
    LEFT JOIN employee E2 ON employee.manager_id = E2.id
    ORDER BY employee.id`);
    return rows;
  }

  async viewEmployee(empId) {
    const [rows] = await this.pool.execute(
      `SELECT EMP1.id, EMP1.first_name, EMP1.last_name, title, name AS department, salary, 
      CONCAT( EMP2.first_name, ' ', EMP2.last_name) as manager 
      FROM employee AS EMP1 
      LEFT JOIN employee EMP2 on EMP1.manager_id = EMP2.id 
      JOIN role on EMP1.role_id = role.id 
      JOIN department on role.department_id = department.id WHERE EMP1.id = ? `,
      [empId]
    );
    return rows;
  }

  async getRecordById(tableName, id) {
    const [
      rows,
    ] = await this.pool.execute(`SELECT * FROM ${tableName} WHERE id= ?`, [id]);
    return rows;
  }

  async insertDepartment(departmentName) {
    const [
      rows,
    ] = await this.pool.execute(`INSERT INTO ${DEPARTMENT} (name) VALUES (?)`, [
      departmentName,
    ]);
    const insertedRow = await this.getRecordById(DEPARTMENT, rows.insertId);
    return insertedRow;
  }

  async insertRole({ title, salary, department_id }) {
    const [rows] = await this.pool.execute(
      `INSERT INTO ${ROLE} (title,
      salary,
      department_id) VALUES (?,?,?)`,
      [title, salary, department_id]
    );
    const insertedRow = await this.getRecordById(ROLE, rows.insertId);
    return insertedRow;
  }

  async insertEmployee({ first_name, last_name, role_id, manager_id }) {
    const [
      rows,
    ] = await this.pool.execute(
      `INSERT INTO ${EMPLOYEE} (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [first_name, last_name, role_id, manager_id]
    );
    const insertedRow = await this.getRecordById(EMPLOYEE, rows.insertId);
    return insertedRow;
  }

  async updateEmployeeRole({ empId, newRoleId }) {
    const [
      rows,
    ] = await this.pool.execute(
      `UPDATE ${EMPLOYEE} SET role_id = ? WHERE id = ?`,
      [newRoleId, empId]
    );
    return await this.getRecordById(EMPLOYEE, empId);
  }

  async updateEmployeeManager({ empId, newManagerId }) {
    const [
      rows,
    ] = await this.pool.execute(
      `UPDATE ${EMPLOYEE} SET manager_id = ? WHERE id = ?`,
      [newManagerId, empId]
    );
    return await this.viewEmployee(empId);
  }

  async closePool() {
    await this.pool.end();
    console.log(
      'Db Connection pool closing. All db conenction are closed now.'
    );
  }
}

module.exports = EmployeeDB;
