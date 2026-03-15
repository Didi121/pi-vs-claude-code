const { Employee, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/employees
exports.listEmployees = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = { deleted_at: null };
    if (req.query.search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${req.query.search}%` } },
        { lastName:  { [Op.iLike]: `%${req.query.search}%` } },
        { email:     { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }
    if (req.query.department) where.department = req.query.department;
    if (req.query.status)     where.status     = req.query.status;

    const { count, rows } = await Employee.findAndCountAll({
      where, limit, offset,
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });

    res.json({
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// GET /api/employees/:id
exports.getEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, deleted_at: null } });
    if (!emp) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employé introuvable' } });
    res.json({ data: emp });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, department, hireDate, salary, status } = req.body;
    const required = ['firstName','lastName','email','hireDate'];
    const missing  = required.filter(f => !req.body[f]);
    if (missing.length) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Champs requis manquants: ${missing.join(', ')}` } });

    const emp = await Employee.create({ firstName, lastName, email, phone, position, department, hireDate, salary, status: status || 'active' });
    res.status(201).json({ data: emp });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email déjà utilisé' } });
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, deleted_at: null } });
    if (!emp) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employé introuvable' } });
    await _logHistory(emp, req.body);
    await emp.update(req.body);
    res.json({ data: emp });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// PATCH /api/employees/:id
exports.partialUpdateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, deleted_at: null } });
    if (!emp) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employé introuvable' } });
    await _logHistory(emp, req.body);
    await emp.update(req.body);
    res.json({ data: emp });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// DELETE /api/employees/:id (soft delete)
exports.deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, deleted_at: null } });
    if (!emp) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employé introuvable' } });
    await emp.update({ status: 'archived', deleted_at: new Date() });
    res.json({ data: emp, message: 'Employé archivé avec succès' });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// POST /api/employees/:id/restore
exports.restoreEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id } });
    if (!emp) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Employé introuvable' } });
    await emp.update({ status: 'active', deleted_at: null });
    res.json({ data: emp, message: 'Employé restauré avec succès' });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// GET /api/employees/:id/history
exports.getEmployeeHistory = async (req, res) => {
  try {
    const rows = await sequelize.query(
      'SELECT * FROM employee_history WHERE employee_id = :id ORDER BY changed_at DESC',
      { replacements: { id: req.params.id }, type: sequelize.QueryTypes.SELECT }
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// Helper : audit log
async function _logHistory(emp, changes) {
  const fields = Object.keys(changes);
  for (const field of fields) {
    const oldVal = emp[field] != null ? String(emp[field]) : null;
    const newVal = changes[field] != null ? String(changes[field]) : null;
    if (oldVal !== newVal) {
      await sequelize.query(
        'INSERT INTO employee_history (employee_id, field_name, old_value, new_value) VALUES (:id, :field, :old, :new)',
        { replacements: { id: emp.id, field, old: oldVal, new: newVal } }
      );
    }
  }
}
