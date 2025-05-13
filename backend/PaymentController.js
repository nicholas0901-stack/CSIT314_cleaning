// PaymentController.js

class PaymentController {
    constructor(db) {
      this.db = db;
    }
  
    // --- Payment-related methods ---
    //add payment for homeowner
    addPaymentRecord(req, res) {
      const { bookingId, amount, method, status } = req.body;
      const sql = `INSERT INTO payments (booking_id, amount, method, status, created_at)
             VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`;
  
      this.db.run(sql, [bookingId, amount, method, status], function (err) {
        if (err) {
          console.error("Insert payment error:", err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true, paymentId: this.lastID });
      });
    }
    // get payment from homeowner to cleaner
    getPaymentsByCleaner(req, res) {
        const cleanerId = req.params.cleanerId;
      
        const sql = `
          SELECT 
            p.*, 
            b.service_name, 
            b.price, 
            b.location, 
            b.appointment_datetime,
            u.name AS homeowner_name
          FROM payments p
          JOIN bookings b ON p.booking_id = b.id
          JOIN users u ON b.homeowner_id = u.id
          WHERE b.cleaner_id = ?
          ORDER BY p.created_at DESC
        `;
      
        this.db.all(sql, [cleanerId], (err, rows) => {
          if (err) {
            console.error("Get payments error:", err.message);
            return res.status(500).json({ success: false });
          }
          res.json({ success: true, payments: rows });
        });
      }
      
  
    // --- Wallet-related methods ---
    // get wallet balance ammount
    getWalletBalance(req, res) {
      const userId = req.params.userId;
      const sql = `SELECT balance FROM wallets WHERE user_id = ?`;
  
      this.db.get(sql, [userId], (err, row) => {
        if (err) {
          console.error("Wallet fetch error:", err.message);
          return res.status(500).json({ success: false });
        }
        if (row) {
          res.json({ success: true, balance: row.balance });
        } else {
          res.json({ success: true, balance: 0.0 });
        }
      });
    }
    // for homeowner to top up wallet
    topUpWallet(req, res) {
      const { userId, amount } = req.body;
  
      const sql = `
        INSERT INTO wallets (user_id, balance, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(user_id) DO UPDATE 
        SET balance = balance + excluded.balance,
            updated_at = datetime('now')
      `;
  
      this.db.run(sql, [userId, amount], function (err) {
        if (err) {
          console.error("Top-up error:", err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true });
      });
    }
    // add paymenet to homeowner wallet
    addPaymentRecord(req, res) {
        const { bookingId, amount, method, status, userId } = req.body;
      
        const checkBalanceSql = `SELECT balance FROM wallets WHERE user_id = ?`;
        const deductBalanceSql = `
          UPDATE wallets 
          SET balance = balance - ?, 
              updated_at = datetime('now', 'localtime')
          WHERE user_id = ? AND balance >= ?
        `;
        const insertPaymentSql = `
          INSERT INTO payments (booking_id, amount, method, status, created_at)
          VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
        `;
        const markBookingPaidSql = `
          UPDATE bookings SET is_paid = 1 WHERE id = ?
        `;
        const getCleanerSql = `SELECT cleaner_id FROM bookings WHERE id = ?`;
        const creditCleanerSql =  `
          INSERT INTO wallets (user_id, balance, updated_at)
          VALUES (?, ?, datetime('now', 'localtime'))
          ON CONFLICT(user_id) DO UPDATE 
          SET balance = balance + excluded.balance,
              updated_at = datetime('now', 'localtime')
        `;
        const insertTransactionSql = `
          INSERT INTO transactions (user_id, type, amount, description)
          VALUES (?, ?, ?, ?)
        `;
      
        const db = this.db;
      
        db.get(checkBalanceSql, [userId], (err, row) => {
          if (err) {
            console.error("Balance check error:", err.message);
            return res.status(500).json({ success: false, message: "Failed to check balance" });
          }
      
          const currentBalance = row?.balance || 0;
          if (currentBalance < amount) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
          }
      
          db.run(deductBalanceSql, [amount, userId, amount], function (err) {
            if (err) {
              console.error("Wallet deduction error:", err.message);
              return res.status(500).json({ success: false, message: "Failed to deduct balance" });
            }
      
            db.run(insertPaymentSql, [bookingId, amount, method, status], function (err) {
              if (err) {
                console.error("Payment insert error:", err.message);
                return res.status(500).json({ success: false, message: "Failed to record payment" });
              }
      
              db.run(markBookingPaidSql, [bookingId], function (err) {
                if (err) {
                  console.warn("Warning: booking not marked as paid -", err.message);
                }
      
                // Step 5: Get cleaner ID and credit their wallet
                db.get(getCleanerSql, [bookingId], function (err, row) {
                  if (err || !row) {
                    console.error("Cleaner fetch error:", err?.message || "No cleaner found");
                    return res.json({ success: true, paymentId: this.lastID }); // Continue gracefully
                  }
      
                  const cleanerId = row.cleaner_id;
      
                  db.run(creditCleanerSql, [cleanerId, amount], function (err) {
                    if (err) {
                      console.error("Failed to credit cleaner wallet:", err.message);
                      return res.json({ success: true, paymentId: this.lastID }); // Continue gracefully
                    }
      
                    // Log transaction for cleaner
                    db.run(insertTransactionSql, [cleanerId, 'payment', amount, 'Payment received for job'], function (err) {
                      if (err) {
                        console.warn("Transaction log for cleaner failed:", err.message);
                      }
                    });
      
                    // Log transaction for homeowner
                    db.run(insertTransactionSql, [userId, 'payment', -amount, 'Payment made for job'], function (err) {
                      if (err) {
                        console.warn("Transaction log for homeowner failed:", err.message);
                      }
                    });
      
                    res.json({ success: true, paymentId: this.lastID });
                  });
                });
              });
            });
          });
        });
      }
      
      // cleaner to get total earnings from paymenet
      getCleanerEarnings(req, res) {
        const cleanerId = req.params.cleanerId;
      
        const sql = `
          SELECT SUM(p.amount) as total_earnings
          FROM payments p
          JOIN bookings b ON p.booking_id = b.id
          WHERE b.cleaner_id = ? AND p.status = 'paid'
        `;
      
        this.db.get(sql, [cleanerId], (err, row) => {
          if (err) {
            console.error("Earnings fetch error:", err.message);
            return res.status(500).json({ success: false });
          }
          res.json({ success: true, earnings: row.total_earnings || 0 });
        });
      }
      
      
      
  }
  
  module.exports = PaymentController;
  
