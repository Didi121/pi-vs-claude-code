const sequelize = require('./config/database');
const { Employee } = require('./models');

async function setupDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');

    // Sync the models to create tables
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
    
    // Run the employees table migration
    const fs = require('fs');
    const path = require('path');
    
    const migrationPath = path.join(__dirname, '../../db/migrations/001_create_employees_table.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split and execute each SQL statement
    const statements = migrationSql.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sequelize.query(statement);
      }
    }
    
    console.log('Migration executed successfully.');
  } catch (error) {
    console.error('Unable to setup database:', error);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();