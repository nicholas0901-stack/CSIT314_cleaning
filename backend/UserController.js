// UserController.js for System Admin
class UserController {
    constructor(db) {
      this.db = db;
    }
  
    // 1. Get all users
    getAllUsers(req, res) {
      const sql = `SELECT id, name, email, role FROM users`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Fetch users error:', err.message);
          res.status(500).json({ success: false, message: 'Database error' });
        } else {
          res.json({ success: true, users: rows });
        }
      });
    }
  
    // 2. Create new user
    createUser(req, res) {
      const { name, email, password, role } = req.body;
      const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
      this.db.run(sql, [name, email, password, role], function (err) {
        if (err) {
          console.error('Create user error:', err.message);
          res.status(500).json({ success: false, message: 'Database error' });
        } else {
          res.status(201).json({ success: true, userId: this.lastID });
        }
      });
    }
  
    // 3. Update user
    updateUser(req, res) {
      const { role, password } = req.body;
      const { id } = req.params;
  
      let updates = [];
      let params = [];
  
      if (role) {
        updates.push("role = ?");
        params.push(role);
      }
      if (password) {
        updates.push("password = ?");
        params.push(password);
      }
      params.push(id);
  
      const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  
      this.db.run(sql, params, function (err) {
        if (err) {
          console.error('Update user error:', err.message);
          res.status(500).json({ success: false, message: 'Database error' });
        } else {
          res.json({ success: true });
        }
      });
    }
  
    // 4. Delete user
    deleteUser(req, res) {
      const { id } = req.params;
      const sql = `DELETE FROM users WHERE id = ?`;
      this.db.run(sql, id, function (err) {
        if (err) {
          console.error('Delete user error:', err.message);
          res.status(500).json({ success: false, message: 'Database error' });
        } else {
          res.json({ success: true });
        }
      });
    }
  }
  
  module.exports = UserController;
