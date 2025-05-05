// bookingController.js for homeowner bookings

class BookingController {
    constructor(db) {
      this.db = db;
    }
  
    // create booking
    createBooking(req, res) {
        const { homeownerId, cleanerId, serviceName, price, location, appointmentDatetime } = req.body;
    
        if (!homeownerId || !cleanerId || !serviceName || !price || !location || !appointmentDatetime) {
        return res.status(400).json({ success: false, message: 'Missing booking details' });
        }
    
        const sql = `
        INSERT INTO bookings (homeowner_id, cleaner_id, service_name, price, location, appointment_datetime)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    
        this.db.run(sql, [homeownerId, cleanerId, serviceName, price, location, appointmentDatetime], function (err) {
        if (err) {
            console.error('Booking creation failed:', err.message);
            res.status(500).json({ success: false });
        } else {
            res.status(201).json({ success: true, bookingId: this.lastID });
        }
        });
    }
  
  
    // Accept a booking
    acceptBooking(req, res) {
      const { bookingId } = req.params;
      const sql = `UPDATE bookings SET status = 'Accepted' WHERE id = ?`;
  
      this.db.run(sql, [bookingId], function (err) {
        if (err) {
          console.error('Accept error:', err.message);
          res.status(500).json({ success: false });
        } else {
          res.json({ success: true });
        }
      });
    }
  
    // Decline a booking
    declineBooking(req, res) {
      const { bookingId } = req.params;
      const sql = `UPDATE bookings SET status = 'Declined' WHERE id = ?`;
  
      this.db.run(sql, [bookingId], function (err) {
        if (err) {
          console.error('Decline error:', err.message);
          res.status(500).json({ success: false });
        } else {
          res.json({ success: true });
        }
      });
    }
  
    // Fetch pending bookings for a specific cleaner
    getPendingBookings(req, res) {
        const { cleanerId } = req.params;
      
        const sql = `
          SELECT 
            bookings.id, 
            bookings.service_name, 
            bookings.price, 
            bookings.status, 
            bookings.location, 
            bookings.appointment_datetime, 
            users.name AS homeowner_name
          FROM bookings
          JOIN users ON bookings.homeowner_id = users.id
          WHERE bookings.cleaner_id = ? AND bookings.status = 'Pending'
          ORDER BY bookings.created_at DESC
        `;
      
        this.db.all(sql, [cleanerId], (err, rows) => {
          if (err) {
            console.error('Error fetching bookings:', err.message);
            return res.status(500).json({ success: false });
          }
          res.json({ success: true, requests: rows });
        });
      }
      getAcceptedBookings(req, res) {
        const { homeownerId } = req.params;
        const sql = `
          SELECT b.*, u.name as cleaner_name
          FROM bookings b
          JOIN users u ON b.cleaner_id = u.id
          WHERE b.homeowner_id = ? AND b.status = 'Accepted'
        `;
      
        this.db.all(sql, [homeownerId], (err, rows) => {
          if (err) {
            console.error("Fetch accepted bookings error:", err.message);
            return res.status(500).json({ success: false });
          }
          res.json({ success: true, bookings: rows });
        });
      }
      getCleanerAcceptedBookings(req, res) {
        const { cleanerId } = req.params;
        const sql = `
          SELECT b.*, u.name as homeowner_name
          FROM bookings b
          JOIN users u ON b.homeowner_id = u.id
          WHERE b.cleaner_id = ? AND b.status = 'Accepted'
        `;
      
        this.db.all(sql, [cleanerId], (err, rows) => {
          if (err) {
            console.error("Fetch accepted cleaner bookings error:", err.message);
            return res.status(500).json({ success: false });
          }
          res.json({ success: true, bookings: rows });
        });
      }
      
      
  }
  
  
  module.exports = BookingController;
  
