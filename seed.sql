/*Sample Data*/
USE employeeTracker;

INSERT INTO department (name) 
VALUES ('dummyDept');

Insert INTO role(title,salary,department_id)
values ('manager', '200.50', 1);

Insert INTO employee(first_name, last_name, role_id, manager_id)
values ('fName', 'lName', 1, null), ('fName2', 'lName2', 1, 2)




