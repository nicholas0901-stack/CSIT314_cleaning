// AuthController.js for user authentication and registeration
class AuthController {
    constructor(db) {
      this.db = db;
    }
  
    // Login user
    login(req, res) {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }
  
      const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
      this.db.get(sql, [email, password], (err, user) => {
        if (err) {
          console.error('Login error:', err.message);
          return res.status(500).json({ success: false, message: 'Database error' });
        } 
        
        if (user) {
          console.log('Login success for:', user.email);
          res.status(200).json({
            success: true,
            user: {
              id: user.id,           
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        } else {
          console.log('Login failed for:', email);
          res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }
      });
    }
  
    // Register new user
    register(req, res) {
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }
  
      const checkSql = `SELECT * FROM users WHERE email = ?`;
      this.db.get(checkSql, [email], (err, user) => {
        if (err) {
          console.error('Check email error:', err.message);
          return res.status(500).json({ success: false, message: 'Database error.' });
        }
        if (user) {
          return res.status(400).json({ success: false, message: 'Email already exists.' });
        }
  
        const insertSql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        this.db.run(insertSql, [name, email, password, role], function (err) {
          if (err) {
            console.error('Register error:', err.message);
            return res.status(500).json({ success: false, message: 'Failed to register user.' });
          }
          res.status(201).json({ success: true, userId: this.lastID });
        });
      });
    }
  }
  
  module.exports = AuthController;
  