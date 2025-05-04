const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const UserController = require('./UserController');
const AuthController = require('./AuthController'); 
const CleanerController = require('./CleanerController');
const BookingController = require('./BookingController');
const PaymentController = require('./PaymentController');





const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./teamabc.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Instantiate controllers
const userController = new UserController(db);
const authController = new AuthController(db);
const cleanerController = new CleanerController(db);
const bookingController = new BookingController(db);
const paymentController = new PaymentController(db);


// ===================== ROUTES ===================== //

// Auth routes
app.post('/api/login', (req, res) => authController.login(req, res));
app.post('/api/register', (req, res) => authController.register(req, res));

// User management
app.get('/api/users', (req, res) => userController.getAllUsers(req, res));
app.post('/api/users', (req, res) => userController.createUser(req, res));
app.put('/api/users/:id', (req, res) => userController.updateUser(req, res));
app.delete('/api/users/:id', (req, res) => userController.deleteUser(req, res));

// Cleaner profile & services
app.post('/api/services', (req, res) => cleanerController.createService(req, res));
app.get('/api/services/:cleanerId', (req, res) => cleanerController.getServices(req, res));
app.delete('/api/services/:serviceId', (req, res) => cleanerController.deleteService(req, res));
app.post('/api/profile', (req, res) => cleanerController.saveProfile(req, res));
app.get('/api/profile/:cleanerId', (req, res) => cleanerController.getProfile(req, res));
app.get('/api/cleaners', (req, res) => cleanerController.getAllCleaners(req, res));
app.get('/api/cleaner/details/:cleanerId', (req, res) =>cleanerController.getCleanerWithServicesAndReviews(req, res));
app.post('/api/favourites', (req, res) => cleanerController.toggleFavourite(req, res));
app.get('/api/homeowner/:id/favourites', (req, res) => {cleanerController.getFavourites(req, res);});

// Booking routes
app.post('/api/bookings', (req, res) => bookingController.createBooking(req, res));
app.put('/api/bookings/:bookingId/accept', (req, res) => bookingController.acceptBooking(req, res));
app.put('/api/bookings/:bookingId/decline', (req, res) => bookingController.declineBooking(req, res));
app.get('/api/bookings/:cleanerId', (req, res) => bookingController.getPendingBookings(req, res));
app.get('/api/bookings/accepted/:homeownerId', (req, res) =>bookingController.getAcceptedBookings(req, res));

// Wallet routes
app.get('/api/wallet/:userId', (req, res) => paymentController.getWalletBalance(req, res));
app.post('/api/wallet/topup', (req, res) => paymentController.topUpWallet(req, res));

// Payment routes
app.post('/api/payments', (req, res) => paymentController.addPaymentRecord(req, res));
app.get('/api/payments/cleaner/:cleanerId', (req, res) => paymentController.getPaymentsByCleaner(req, res));
app.post('/api/payments', (req, res) => paymentController.addPaymentRecord(req, res));
app.get('/api/cleaner/:cleanerId/earnings', (req, res) => paymentController.getCleanerEarnings(req, res));
app.get("/api/wallet/:userId", (req, res) => paymentController.getWalletBalance(req, res));


// ===================== SERVER ===================== //

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
