// Admin routes — placeholder endpoints for roles and members
// Note: These handlers return 501 Not Implemented to document the contract.

const express = require('express');
const router = express.Router();

// Roles
router.post('/api/admin/roles', (req, res) => {
  return res.status(501).json({ error: 'not_implemented', message: 'Create role: POST /api/admin/roles' });
});

router.get('/api/admin/roles/:id', (req, res) => {
  const { id } = req.params;
  return res.status(501).json({ error: 'not_implemented', message: `Get role ${id}: GET /api/admin/roles/:id` });
});

router.put('/api/admin/roles/:id', (req, res) => {
  const { id } = req.params;
  return res.status(501).json({ error: 'not_implemented', message: `Update role ${id}: PUT /api/admin/roles/:id` });
});

// Members
router.post('/api/admin/members', (req, res) => {
  return res.status(501).json({ error: 'not_implemented', message: 'Create member: POST /api/admin/members' });
});

router.get('/api/admin/members/:id', (req, res) => {
  const { id } = req.params;
  return res.status(501).json({ error: 'not_implemented', message: `Get member ${id}: GET /api/admin/members/:id` });
});

router.put('/api/admin/members/:id', (req, res) => {
  const { id } = req.params;
  return res.status(501).json({ error: 'not_implemented', message: `Update member ${id}: PUT /api/admin/members/:id` });
});

module.exports = router;
