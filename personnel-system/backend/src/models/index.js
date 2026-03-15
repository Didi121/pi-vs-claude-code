const sequelize = require('../config/database');

const Employee = require('./employee.model');

// Define associations here (future)

module.exports = {
  sequelize,
  Employee
};