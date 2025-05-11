const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const UserController = require('./UserController');
const AuthController = require('./AuthController'); 
const CleanerController = require('./CleanerController');
const BookingController = require('./BookingController');
const PaymentController = require('./PaymentController');
const PreferenceController = require('./PreferenceController');
const AdminController = require('./AdminController');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connect to database
const db = new sqlite3.Database('./teamabc.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

//image upload handle 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/cleaners");  // ✅ Save directly to the served folder
  },
  filename: (req, file, cb) => {
    cb(null, `cleaner_${Date.now()}${path.extname(file.originalname)}`);
  }
});


const upload = multer({ storage });
// Instantiate controllers
const userController = new UserController(db);
const authController = new AuthController(db);
const cleanerController = new CleanerController(db);
const bookingController = new BookingController(db);
const paymentController = new PaymentController(db);
const preferenceController = new PreferenceController(db);
const adminController = new AdminController(db);




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
app.post("/api/cleaner/profile", upload.single("profileImage"), (req, res) =>cleanerController.saveProfileWithImage(req, res));
// Booking routes
app.post('/api/bookings', (req, res) => bookingController.createBooking(req, res));
app.put('/api/bookings/:bookingId/accept', (req, res) => bookingController.acceptBooking(req, res));
app.put('/api/bookings/:bookingId/decline', (req, res) => bookingController.declineBooking(req, res));
app.get('/api/bookings/:cleanerId', (req, res) => bookingController.getPendingBookings(req, res));
app.get('/api/bookings/accepted/:homeownerId', (req, res) =>bookingController.getAcceptedBookings(req, res));
app.get('/api/bookings/cleaner/:cleanerId/accepted', (req, res) =>bookingController.getCleanerAcceptedBookings(req, res));
app.get('/api/bookings/completed/:homeownerId', (req, res) => bookingController.getCompletedBookings(req, res));

// Cleaner marks booking as completed
app.put('/api/bookings/:bookingId/complete', (req, res) => bookingController.markAsCompleted(req, res));
app.put("/api/cleaner/services/:id", (req, res) =>cleanerController.updateService(req, res));

// Homeowner rates completed booking
app.post('/api/bookings/:bookingId/rate', (req, res) => bookingController.rateCompletedJob(req, res));
app.get('/api/cleaners/:cleanerId/reviews', (req, res) => cleanerController.getCleanerReviews(req, res));

// Wallet routes
app.get('/api/wallet/:userId', (req, res) => paymentController.getWalletBalance(req, res));
app.post('/api/wallet/topup', (req, res) => paymentController.topUpWallet(req, res));

// Payment routes
app.post('/api/payments', (req, res) => paymentController.addPaymentRecord(req, res));
app.get('/api/payments/cleaner/:cleanerId', (req, res) => paymentController.getPaymentsByCleaner(req, res));
app.post('/api/payments', (req, res) => paymentController.addPaymentRecord(req, res));
app.get('/api/cleaner/:cleanerId/earnings', (req, res) => paymentController.getCleanerEarnings(req, res));
app.get("/api/wallet/:userId", (req, res) => paymentController.getWalletBalance(req, res));


// Preference routes
app.get('/api/preferences/:homeownerId', (req, res) => preferenceController.getPreferences(req, res));
app.post('/api/preferences/:homeownerId', (req, res) => preferenceController.savePreferences(req, res));

//Report routes
app.get("/api/admin/reports", (req, res) => adminController.getReport(req, res));
app.get('/api/admin/services', (req, res) => adminController.getAllCleanerServices(req, res));

app.delete('/api/cleaner/services/:id', (req, res) =>adminController.deleteService(req, res));
app.post('/api/admin/services', (req, res) => adminController.addService(req, res));

// ===================== SERVER ===================== //

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
