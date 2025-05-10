class PreferenceController {
    constructor(db) {
      this.db = db;
    }
  
    // GET preferences for homeowner such as Locations 
    getPreferences = (req, res) => {
      const { homeownerId } = req.params;
      const sql = `SELECT * FROM service_preferences WHERE homeowner_id = ?`;
  
      this.db.get(sql, [homeownerId], (err, row) => {
        if (err) {
          console.error("DB error (getPreferences):", err.message);
          return res.status(500).json({ success: false, message: 'DB error' });
        }
        res.json({ success: true, preferences: row || {} });
      });
    };
  
    // POST preferences (insert or update)
    savePreferences = (req, res) => {
      const { prefers_pet_friendly, prefers_eco_friendly, preferred_area, other_notes } = req.body;
      const { homeownerId } = req.params;
  
      const sql = `
        INSERT INTO service_preferences 
        (homeowner_id, prefers_pet_friendly, prefers_eco_friendly, preferred_area, other_notes)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(homeowner_id) DO UPDATE SET
          prefers_pet_friendly = excluded.prefers_pet_friendly,
          prefers_eco_friendly = excluded.prefers_eco_friendly,
          preferred_area = excluded.preferred_area,
          other_notes = excluded.other_notes
      `;
  
      this.db.run(
        sql,
        [
          homeownerId,
          prefers_pet_friendly ? 1 : 0,
          prefers_eco_friendly ? 1 : 0,
          preferred_area,
          other_notes
        ],
        function (err) {
          if (err) {
            console.error("Preference save error:", err.message);
            return res.status(500).json({ success: false, message: 'DB error' });
          }
          res.json({ success: true });
        }
      );
    };
  }
  
  module.exports = PreferenceController;
  