// CleanerController.js for cleaner 

class CleanerController {
    constructor(db) {
      this.db = db;
    }
  
    // Create a new service
    createService(req, res) {
      const { cleanerId, serviceName, price } = req.body;
      const sql = `INSERT INTO services (cleaner_id, service_name, price) VALUES (?, ?, ?)`;
  
      this.db.run(sql, [cleanerId, serviceName, price], function (err) {
        if (err) {
          console.error('Create service error:', err.message);
          res.status(500).json({ success: false });
        } else {
          res.status(201).json({ success: true, serviceId: this.lastID });
        }
      });
    }
  
    // Fetch all services for a cleaner
    getServices(req, res) {
      const { cleanerId } = req.params;
      const sql = `SELECT * FROM services WHERE cleaner_id = ?`;
  
      this.db.all(sql, [cleanerId], (err, rows) => {
        if (err) {
          console.error('Get services error:', err.message);
          res.status(500).json({ success: false });
        } else {
          res.json({ success: true, services: rows });
        }
      });
    }
  
    // Delete a service
    deleteService(req, res) {
      const { serviceId } = req.params;
      const sql = `DELETE FROM services WHERE id = ?`;
  
      this.db.run(sql, [serviceId], function (err) {
        if (err) {
          console.error('Delete service error:', err.message);
          res.status(500).json({ success: false });
        } else {
          res.json({ success: true });
        }
      });
    }
  
    // Create or update profile
    saveProfile(req, res) {
      const { cleanerId, skills, experience, preferredAreas, availability } = req.body;
  
      const checkSql = `SELECT * FROM cleaner_profiles WHERE cleaner_id = ?`;
      this.db.get(checkSql, [cleanerId], (err, profile) => {
        if (err) {
          console.error('Check profile error:', err.message);
          return res.status(500).json({ success: false });
        }
  
        if (profile) {
          // Update
          const updateSql = `
            UPDATE cleaner_profiles 
            SET skills = ?, experience = ?, preferred_areas = ?, availability = ?
            WHERE cleaner_id = ?`;
  
          this.db.run(updateSql, [skills, experience, preferredAreas, availability, cleanerId], function (err) {
            if (err) {
              console.error('Update profile error:', err.message);
              return res.status(500).json({ success: false });
            }
            res.json({ success: true });
          });
        } else {
          // Insert
          const insertSql = `
            INSERT INTO cleaner_profiles (cleaner_id, skills, experience, preferred_areas, availability)
            VALUES (?, ?, ?, ?, ?)`;
  
          this.db.run(insertSql, [cleanerId, skills, experience, preferredAreas, availability], function (err) {
            if (err) {
              console.error('Insert profile error:', err.message);
              return res.status(500).json({ success: false });
            }
            res.status(201).json({ success: true, profileId: this.lastID });
          });
        }
      });
    }
  
    // Fetch cleaner profile
    getProfile(req, res) {
      const { cleanerId } = req.params;
      const sql = `SELECT * FROM cleaner_profiles WHERE cleaner_id = ?`;
  
      this.db.get(sql, [cleanerId], (err, row) => {
        if (err) {
          console.error('Get profile error:', err.message);
          res.status(500).json({ success: false });
        } else {
          res.json({ success: true, profile: row });
        }
      });
    }
  
    // Get all cleaners with profiles
    getAllCleaners(req, res) {
      const sql = `
        SELECT users.id, users.name, users.email, cleaner_profiles.skills, cleaner_profiles.experience, cleaner_profiles.preferred_areas, cleaner_profiles.availability
        FROM users
        LEFT JOIN cleaner_profiles ON users.id = cleaner_profiles.cleaner_id
        WHERE users.role = 'Cleaner'
      `;
  
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Get all cleaners error:', err.message);
          res.status(500).json({ success: false });
        } else {
          res.json({ success: true, cleaners: rows });
        }
      });
    }
  }
  
  module.exports = CleanerController;
  