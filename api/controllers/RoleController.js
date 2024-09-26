const { Role } = require('../models');

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    const role = await Role.create({ roleName });
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await role.update({ roleName });
    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await role.destroy();
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};