class AdminsController {
  constructor(db) {
    this.db = db;
  }

  getReport(req, res) {
    const { reportType } = req.query;
    let dateCondition = "";

    if (reportType === "daily") {
      dateCondition = "DATE(b.created_at) = DATE('now')";
    } else if (reportType === "weekly") {
      dateCondition = "b.created_at >= DATE('now', '-7 days')";
    } else if (reportType === "monthly") {
      dateCondition = "b.created_at >= DATE('now', 'start of month')";
    }

    const sql = `
      SELECT 
        b.id AS booking_id,
        u1.name AS homeowner_name,
        u2.name AS cleaner_name,
        b.service_name,
        b.price,
        b.status,
        b.completed,
        b.rating,
        b.created_at,
        p.amount AS payment_amount,
        p.method AS payment_method,
        p.status AS payment_status,
        p.created_at AS payment_date,
        r.comment AS review_comment,
        r.rating AS review_rating
      FROM bookings b
      LEFT JOIN users u1 ON b.homeowner_id = u1.id
      LEFT JOIN users u2 ON b.cleaner_id = u2.id
      LEFT JOIN payments p ON b.id = p.booking_id
      LEFT JOIN reviews r ON b.id = r.booking_id
      WHERE ${dateCondition}
      ORDER BY b.created_at DESC
    `;

    this.db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Report generation error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
      }

      // Save to reports table
      const insertSql = `INSERT INTO reports (type, payload) VALUES (?, ?)`;
      const payload = JSON.stringify(rows);

      this.db.run(insertSql, [reportType, payload], (insertErr) => {
        if (insertErr) {
          console.error("Failed to store report:", insertErr.message);
        }
      });

      res.json({ success: true, report: rows });
    });
  }

  getAllCleanerServices(req, res) {
    const sql = `
      SELECT 
        s.id, 
        s.cleaner_id, 
        s.service_name, 
        s.price, 
        u.name AS cleaner_name
      FROM services s
      JOIN users u ON s.cleaner_id = u.id
      WHERE u.role = 'Cleaner'
      ORDER BY s.cleaner_id
    `;

    this.db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Get cleaner services error:", err.message);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true, services: rows });
    });
  }

  deleteService(req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM services WHERE id = ?`;

    this.db.run(sql, [id], function (err) {
      if (err) {
        console.error('Admin delete service error:', err.message);
        return res.status(500).json({ success: false });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }

      res.json({ success: true });
    });
  }

  addService(req, res) {
    const { cleaner_id, service_name, price } = req.body;

    if (!cleaner_id || !service_name || price == null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const sql = `INSERT INTO services (cleaner_id, service_name, price) VALUES (?, ?, ?)`;
    this.db.run(sql, [cleaner_id, service_name, price], function (err) {
      if (err) {
        console.error("Admin add service error:", err.message);
        return res.status(500).json({ success: false });
      }

      res.status(201).json({ success: true, serviceId: this.lastID });
    });
  }
}

module.exports = AdminsController;
