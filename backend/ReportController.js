class ReportController {
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
  
        res.json({ success: true, report: rows });
      });
    }
  }
  