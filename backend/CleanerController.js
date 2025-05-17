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
  const { cleanerId, skills, experience, preferredAreas, availability, is_active } = req.body;

  const checkSql = `SELECT * FROM cleaner_profiles WHERE cleaner_id = ?`;
  this.db.get(checkSql, [cleanerId], (err, profile) => {
    if (err) {
      console.error('Check profile error:', err.message);
      return res.status(500).json({ success: false });
    }

    if (profile) {
      //  Update existing profile
      const updateSql = `
        UPDATE cleaner_profiles 
        SET skills = ?, experience = ?, preferred_areas = ?, availability = ?, is_active = ?
        WHERE cleaner_id = ?`;

      this.db.run(updateSql, [skills, experience, preferredAreas, availability, is_active ? 1 : 0, cleanerId], function (err) {
        if (err) {
          console.error('Update profile error:', err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true });
      });
    } else {
      //  Insert new profile
      const insertSql = `
        INSERT INTO cleaner_profiles (cleaner_id, skills, experience, preferred_areas, availability, is_active)
        VALUES (?, ?, ?, ?, ?, ?)`;

      this.db.run(insertSql, [cleanerId, skills, experience, preferredAreas, availability, is_active ? 1 : 0], function (err) {
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
  const cleanerId = req.params.cleanerId;

  const sql = `SELECT * FROM cleaner_profiles WHERE cleaner_id = ?`;

  this.db.get(sql, [cleanerId], (err, row) => {
    if (err) {
      console.error("Get profile error:", err.message);
      return res.status(500).json({ success: false });
    }

    if (row) {
      res.json({ success: true, profile: row }); //  row must include is_active
    } else {
      res.json({ success: false, message: "Profile not found" });
    }
  });
}

    
  
    getAllCleaners(req, res) {
  const { preferredArea, minimumRating, minPrice, maxPrice } = req.query;

  let sql = `
    SELECT 
      users.id, 
      users.name, 
      users.email, 
      users.image_path, 
      cp.skills, 
      cp.experience, 
      cp.preferred_areas, 
      cp.availability,
      ROUND(AVG(b.rating), 2) AS average_rating,
      MIN(s.price) AS min_service_price,
      MAX(s.price) AS max_service_price
    FROM users
    LEFT JOIN cleaner_profiles cp ON users.id = cp.cleaner_id
    LEFT JOIN bookings b ON users.id = b.cleaner_id AND b.completed = 1 AND b.rating IS NOT NULL
    LEFT JOIN services s ON users.id = s.cleaner_id
    WHERE users.role = 'Cleaner' AND cp.is_active = 1
  `;

  const params = [];

  if (preferredArea) {
    sql += ` AND cp.preferred_areas = ?`;
    params.push(preferredArea);
  }

  sql += ` GROUP BY users.id`;

  this.db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Get filtered cleaners error:', err.message);
      return res.status(500).json({ success: false });
    }

    let filtered = rows;

    if (minimumRating) {
      filtered = filtered.filter(c => parseFloat(c.average_rating || 0) >= parseFloat(minimumRating));
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter(c => parseFloat(c.min_service_price || 0) >= parseFloat(minPrice));
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter(c => parseFloat(c.max_service_price || 0) <= parseFloat(maxPrice));
    }

    res.json({ success: true, cleaners: filtered });
  });
}

    
    
    
    
    
      // Get all cleaners profiles with services and reviews
      getCleanerWithServicesAndReviews(req, res) {
        const cleanerId = req.params.cleanerId;
        const homeownerId = req.query.homeownerId; // <-- passed in query string from React
      
        const cleanerSql = `
        SELECT users.id, users.name, users.image_path, cleaner_profiles.skills, cleaner_profiles.experience,
              cleaner_profiles.preferred_areas, cleaner_profiles.availability
        FROM users
        LEFT JOIN cleaner_profiles ON users.id = cleaner_profiles.cleaner_id
        WHERE users.id = ? AND users.role = 'Cleaner'
      `;

        const servicesSql = `SELECT * FROM services WHERE cleaner_id = ?`;
        const reviewsSql = `
          SELECT r.rating, r.comment, u.name as reviewer_name, r.created_at
          FROM reviews r
          JOIN users u ON r.homeowner_id = u.id
          WHERE r.cleaner_id = ?
          ORDER BY r.created_at DESC
        `;
        const favouriteSql = `SELECT * FROM favourites WHERE homeowner_id = ? AND cleaner_id = ?`;
      
        this.db.get(cleanerSql, [cleanerId], (err, cleaner) => {
          if (err || !cleaner) return res.status(404).json({ error: "Cleaner not found" });
      
          this.db.all(servicesSql, [cleanerId], (err, services) => {
            if (err) return res.status(500).json({ error: err.message });
            cleaner.services = services;
      
            this.db.all(reviewsSql, [cleanerId], (err, reviews) => {
              if (err) return res.status(500).json({ error: err.message });
              cleaner.reviews = reviews;
      
              // Check favourite status
              if (homeownerId) {
                this.db.get(favouriteSql, [homeownerId, cleanerId], (err, favRow) => {
                  cleaner.isFavourite = !!favRow;
                  res.json(cleaner);
                });
              } else {
                cleaner.isFavourite = false;
                res.json(cleaner);
              }
            });
          });
        });
      }
    
    // toogle cleaner favourite 
    toggleFavourite(req, res) {
      const { homeownerId, cleanerId } = req.body;
    
      const checkSql = `SELECT * FROM favourites WHERE homeowner_id = ? AND cleaner_id = ?`;
      const insertSql = `INSERT INTO favourites (homeowner_id, cleaner_id) VALUES (?, ?)`;
      const deleteSql = `DELETE FROM favourites WHERE homeowner_id = ? AND cleaner_id = ?`;
    
      this.db.get(checkSql, [homeownerId, cleanerId], (err, row) => {
        if (err) {
          console.error("Favourite check error:", err.message);
          return res.status(500).json({ success: false });
        }
    
        if (row) {
          // Already a favourite — so unfavourite
          this.db.run(deleteSql, [homeownerId, cleanerId], function (err) {
            if (err) {
              console.error("Unfavourite error:", err.message);
              return res.status(500).json({ success: false });
            }
            res.json({ success: true, action: "removed" });
          });
        } else {
          // Not favourited — so add
          this.db.run(insertSql, [homeownerId, cleanerId], function (err) {
            if (err) {
              console.error("Add to favourites error:", err.message);
              return res.status(500).json({ success: false });
            }
            res.json({ success: true, action: "added" });
          });
        }
      });
    }
    
    // get favourite cleaner functions
    getFavourites(req, res) {
      const homeownerId = req.params.id;
    
      const sql = `
        SELECT users.id, users.name, users.image_path, cp.experience, cp.preferred_areas
        FROM favourites f
        JOIN users ON f.cleaner_id = users.id
        LEFT JOIN cleaner_profiles cp ON users.id = cp.cleaner_id
        WHERE f.homeowner_id = ?
      `;
    
      this.db.all(sql, [homeownerId], (err, rows) => {
        if (err) {
          console.error("Get favourites error:", err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true, favourites: rows });
      });
    }
    
    saveProfileWithImage(req, res) {
  const { cleanerId, skills, experience, preferredAreas, availability, is_active } = req.body;
  const isActiveValue = is_active === "1" ? 1 : 0;

  const imagePath = req.file ? `images/cleaners/${req.file.filename}` : null;

  const checkSql = `SELECT * FROM cleaner_profiles WHERE cleaner_id = ?`;
  this.db.get(checkSql, [cleanerId], (err, profile) => {
    if (err) {
      console.error("Profile check error:", err.message);
      return res.status(500).json({ success: false });
    }

    const updateImagePath = (callback) => {
      if (imagePath) {
        this.db.run(`UPDATE users SET image_path = ? WHERE id = ?`, [imagePath, cleanerId], (err) => {
          if (err) console.error("Image update failed:", err.message);
          callback();
        });
      } else {
        callback();
      }
    };

    if (profile) {
      const updateSql = `
        UPDATE cleaner_profiles 
        SET skills = ?, experience = ?, preferred_areas = ?, availability = ?, is_active = ?
        WHERE cleaner_id = ?
      `;

      this.db.run(updateSql, [skills, experience, preferredAreas, availability, isActiveValue, cleanerId], (err) => {
        if (err) {
          console.error("Profile update error:", err.message);
          return res.status(500).json({ success: false });
        }
        updateImagePath(() => res.json({ success: true }));
      });
    } else {
      const insertSql = `
        INSERT INTO cleaner_profiles (cleaner_id, skills, experience, preferred_areas, availability, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(insertSql, [cleanerId, skills, experience, preferredAreas, availability, isActiveValue], function (err) {
        if (err) {
          console.error("Profile insert error:", err.message);
          return res.status(500).json({ success: false });
        }
        updateImagePath(() => res.status(201).json({ success: true }));
      });
    }
  });
}

    // get cleaner reviews from homeowner
    getCleanerReviews(req, res) {
      const cleanerId = req.params.cleanerId;
      const sql = `
        SELECT r.rating, r.comment, r.created_at, u.name AS reviewer_name
        FROM reviews r
        JOIN users u ON r.homeowner_id = u.id
        WHERE r.cleaner_id = ?
        ORDER BY r.created_at DESC
      `;
    
      this.db.all(sql, [cleanerId], (err, rows) => {
        if (err) {
          console.error("Review fetch error:", err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true, reviews: rows });
      });
    }
    // get cleaner jobs
    getCleanerJobs(req, res) {
      const { cleanerId } = req.params;
      const sql = `
        SELECT b.*, u.name as homeowner_name 
        FROM bookings b
        JOIN users u ON b.homeowner_id = u.id
        WHERE b.cleaner_id = ?
          AND (b.status = 'Accepted' OR b.status = 'Completed')
        ORDER BY b.appointment_datetime ASC
      `;
    
      this.db.all(sql, [cleanerId], (err, rows) => {
        if (err) {
          console.error("Get cleaner jobs error:", err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true, bookings: rows });
      });
    }
    // In CleanerController
    updateService(req, res) {
      const { service_name, price } = req.body;
      const { id } = req.params;

      const sql = `UPDATE services SET service_name = ?, price = ? WHERE id = ?`;
      this.db.run(sql, [service_name, price, id], function (err) {
        if (err) {
          console.error("Update service error:", err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true });
      });
    }
  }
  
  module.exports = CleanerController;
  
