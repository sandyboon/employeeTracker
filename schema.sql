DROP DATABASE IF EXISTS employeeTracker;

CREATE DATABASE employeeTracker;

USE employeeTracker;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT,
	name  VARCHAR(30) NOT NULL,
	CONSTRAINT PK_department PRIMARY KEY (id),
    CONSTRAINT UK_dept_name UNIQUE KEY(name)
);

CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30)  NOT NULL,
    salary decimal(10,2) NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT PK_role PRIMARY KEY (id),
    CONSTRAINT FK_role_department FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30)  NOT NULL,
    last_name VARCHAR(30)  NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    CONSTRAINT PK_employee PRIMARY KEY (id),
    CONSTRAINT FK_employee_role FOREIGN KEY (role_id)
    REFERENCES role(id),
	CONSTRAINT FK_employee_manager FOREIGN KEY (manager_id)
    REFERENCES employee(id) ON DELETE CASCADE	
);