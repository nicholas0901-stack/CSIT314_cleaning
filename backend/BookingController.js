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
        WHERE b.homeowner_id = ? AND (b.status = 'Accepted' OR b.status = 'Completed')
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
          WHERE b.cleaner_id = ? AND (b.status = 'Accepted' OR b.status = 'Completed')
        `;
      
        this.db.all(sql, [cleanerId], (err, rows) => {
          if (err) {
            console.error("Fetch cleaner bookings error:", err.message);
            return res.status(500).json({ success: false });
          }
          res.json({ success: true, bookings: rows });
        });
      }
      
      
      // Cleaner marks job as completed
      markAsCompleted(req, res) {
        const { bookingId } = req.params;
        const sql = `UPDATE bookings SET completed = 1, status = 'Completed' WHERE id = ?`;

        this.db.run(sql, [bookingId], function (err) {
          if (err) {
            console.error('Mark completed error:', err.message);
            res.status(500).json({ success: false });
          } else {
            res.json({ success: true, message: 'Job marked as completed' });
          }
        });
      }


      // Homeowner to rate the cleaner for a completed job
      rateCompletedJob(req, res) {
        const { bookingId } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

          const db = this.db; 

          const getBookingSql = `SELECT * FROM bookings WHERE id = ? AND completed = 1`;
          db.get(getBookingSql, [bookingId], (err, booking) => {
            if (err || !booking) {
              return res.status(404).json({ success: false, message: 'Completed booking not found' });
            }

            const insertReviewSql = `
              INSERT INTO reviews (booking_id, homeowner_id, cleaner_id, rating, comment)
              VALUES (?, ?, ?, ?, ?)
            `;

            db.run(insertReviewSql, [bookingId, booking.homeowner_id, booking.cleaner_id, rating, comment || ""], function (err) {
              if (err) {
                console.error('Insert review error:', err.message);
                return res.status(500).json({ success: false });
              }

              const updateSql = `UPDATE bookings SET rating = ? WHERE id = ?`;
              db.run(updateSql, [rating, bookingId], function (err) {
                if (err) {
                  console.error('Booking rating update error:', err.message);
                  return res.status(500).json({ success: false });
                }

                res.json({ success: true, message: 'Rating and review saved successfully' });
              });
            });
          });
        }

            // Fetch completed jobs for a homeowner
            getCompletedBookings(req, res) {
              const { homeownerId } = req.params;
              const sql = `
                SELECT b.*, u.name AS cleaner_name
                FROM bookings b
                JOIN users u ON b.cleaner_id = u.id
                WHERE b.homeowner_id = ? AND b.completed = 1
                ORDER BY b.appointment_datetime DESC
              `;

              this.db.all(sql, [homeownerId], (err, rows) => {
                if (err) {
                  console.error("Completed bookings fetch error:", err.message);
                  return res.status(500).json({ success: false });
                }
                res.json({ success: true, bookings: rows });
              });
            }
            
            // Get booking status update for homeowner 
            getAllBookingsForHomeowner(req, res) {
              const { homeownerId } = req.params;
              const sql = `
                SELECT b.*, u.name as cleaner_name
                FROM bookings b
                JOIN users u ON b.cleaner_id = u.id
                WHERE b.homeowner_id = ?
                ORDER BY b.created_at DESC
              `;
              this.db.all(sql, [homeownerId], (err, rows) => {
                if (err) {
                  console.error("Fetch all bookings error:", err.message);
                  return res.status(500).json({ success: false });
                }
                res.json({ success: true, bookings: rows });
              });
            }
            
            getAllBookingsForCleaner(req, res) {
              const { cleanerId } = req.params;
              const sql = `
                SELECT b.*, u.name AS homeowner_name
                FROM bookings b
                JOIN users u ON b.homeowner_id = u.id
                WHERE b.cleaner_id = ?
                ORDER BY b.created_at DESC
              `;

              this.db.all(sql, [cleanerId], (err, rows) => {
                if (err) {
                  console.error("Fetch cleaner all bookings error:", err.message);
                  return res.status(500).json({ success: false });
                }
                res.json({ success: true, bookings: rows });
              });
            }


  }
  

  module.exports = BookingController;
  
