import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const location = useLocation();
  const role = location.state?.role || "Guest";
  const name = location.state?.name || "Guest";
  const cleanerId = location.state?.id || null;  // <-- IMPORTANT
  const [showCleanerModal, setShowCleanerModal] = useState(false);
  const [cleaners, setCleaners] = useState([]);  
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [selectedServicePrice, setSelectedServicePrice] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDatetime, setSelectedDatetime] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [showFavouritesModal, setShowFavouritesModal] = useState(false);
  const userId = location.state?.id || null;
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [requests, setRequests] = useState([]); 
  const [editingUser, setEditingUser] = useState(null);
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [cleanerPayments, setCleanerPayments] = useState([]);
  const [showCleanerPaymentsModal, setShowCleanerPaymentsModal] = useState(false);
  const [showCleanerWalletModal, setShowCleanerWalletModal] = useState(false);
  const [cleanerWalletBalance, setCleanerWalletBalance] = useState(0);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

    console.log("Cleaner ID inside Dashboard:", cleanerId); 

  const [tempProfile, setTempProfile] = useState({
    skills: '',
    experience: '',
    preferred_areas: '',
    availability: ''
  });
  
  const [profile, setProfile] = useState({
    skills: '',
    experience: '',
    preferredAreas: '',
    availability: ''
  });
  
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [showModal, setShowModal] = useState(false);
  
  


  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      toast.error("Please fill in service name and price.");
      return;
    }
  
    if (!cleanerId) {
      toast.error("Cleaner ID missing. Cannot save service.");
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanerId: cleanerId,
          serviceName: newService.name,
          price: newService.price,
        }),
      });
  
      const data = await res.json();
      if (data.success) {
        fetchServices();
        setNewService({ name: "", price: "" });
      } else {
        toast.error("Failed to add service.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append("cleanerId", userId); // or whatever cleaner ID you're using
    formData.append("skills", tempProfile.skills);
    formData.append("experience", tempProfile.experience);
    formData.append("preferredAreas", tempProfile.preferred_areas);
    formData.append("availability", tempProfile.availability);
  
    if (tempProfile.imageFile) {
      formData.append("profileImage", tempProfile.imageFile);
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/cleaner/profile", {
        method: "POST",
        body: formData
      });
  
      const result = await response.json();
      if (result.success) {
        toast.success("Profile updated successfully.");
        // optionally re-fetch cleaner profile
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile.");
    }
  };
  
  
  // Helper to filter jobs for the selected date
  const filteredJobs = acceptedJobs.filter((job) => {
    const jobDate = new Date(job.appointment_datetime).toDateString();
    return jobDate === selectedDate.toDateString();
  });
  const handleDeleteService = async (serviceId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
        method: 'DELETE',
      });
  
      const data = await res.json();
      if (data.success) {
        fetchServices();
      } else {
        toast.error("Failed to delete service.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchServices = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${cleanerId}`);
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${cleanerId}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setTempProfile(data.profile); 

      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  
  const handleOpenUserModal = () => {
    fetchUsers();
    setShowUserModal(true);
  };
  
  const handleSaveAll = async (e) => {
    e.preventDefault();
  
    // Save service (if any)
    if (newService.name && newService.price) {
      await handleAddService();
    }
  
    // Save profile 
    await handleSaveProfile();
  
    //  Re-fetch updated profile from backend
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${cleanerId}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setTempProfile(data.profile); // Update state with fresh data
  
        //  Force reload image (append timestamp to avoid cache)
        if (data.profile.image_path) {
          setPreviewImageUrl(`http://localhost:5000/${data.profile.image_path}?t=${Date.now()}`);
        }
      }
    } catch (err) {
      console.error("Failed to refresh profile after save:", err);
    }
  };
  
  const fetchCleaners = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cleaners');
      const data = await res.json();
      if (data.success) {
        setCleaners(data.cleaners);
      }
    } catch (error) {
      console.error('Failed to fetch cleaners:', error);
    }
  };  
  const handleViewProfile = async (cleaner) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/cleaner/details/${cleaner.id}?homeownerId=${userId}`
      );
      const data = await res.json();
  
      setSelectedCleaner({
        id: cleaner.id,
        name: cleaner.name,
        image_path: data.image_path || "",
        experience: data.experience,
        skills: data.skills,
        preferred_areas: data.preferred_areas,
        availability: data.availability,
        services: data.services || [],
        reviews: data.reviews || []
      });
  
      setIsFavourite(data.isFavourite || false); 
      setShowProfileModal(true);
    } catch (error) {
      console.error("Error fetching cleaner profile:", error);
    }
  };
  
  
  
  
  const handleBookCleaner = async (cleaner) => {
    if (!selectedServiceName || !selectedServicePrice || !selectedLocation || !selectedDatetime) {
      toast.error("Please select service, location, and date/time before booking!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeownerId: userId,
          cleanerId: cleaner.id,
          serviceName: selectedServiceName,
          price: selectedServicePrice,
          location: selectedLocation,
          appointmentDatetime: selectedDatetime,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        toast.success('Booking request sent successfully!');
        setShowProfileModal(false);
      } else {
        toast.error('Failed to send booking request.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Something went wrong.');
    }
  };
  
  
  const handleAcceptRequest = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/accept`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking accepted!');
  
        //  Update status of the accepted request locally
        setRequests((prevRequests) =>
          prevRequests.map(req =>
            req.id === bookingId ? { ...req, status: 'Accepted' } : req
          )
        );
        
      } else {
        toast.error('Failed to accept booking.');
      }
    } catch (error) {
      console.error('Accept error:', error);
    }
  };
  
  // Fetch accepted bookings
  const fetchAcceptedBookings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/accepted/${userId}`);
      const data = await res.json();
      if (data.success) {
        setAcceptedBookings(data.bookings);
      } else {
        toast.error("Failed to load accepted bookings.");
      }
    } catch (error) {
      console.error("Fetch accepted bookings error:", error);
    }
  };
  const handleDeclineRequest = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/decline`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking declined.');
  
        //  remove the declined request from the list
        setRequests((prevRequests) => prevRequests.filter(req => req.id !== bookingId));
        
      } else {
        toast.error('Failed to decline booking.');
      }
    } catch (error) {
      console.error('Decline error:', error);
    }
  };
  
  useEffect(() => {
    if (role === "Cleaner") {
      const interval = setInterval(() => {
        fetchJobRequests();
      }, 10000); // Refresh every 10 seconds
  
      return () => clearInterval(interval);
    }
  }, [role]);
  
  
  
  const fetchJobRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${cleanerId}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);  // Update the modal to show requests
      }
    } catch (error) {
      console.error('Failed to fetch job requests:', error);
    }
  };
  
  const fetchFavourites = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/homeowner/${userId}/favourites`);
      const data = await res.json();
      if (data.success) {
        setFavourites(data.favourites);
      } else {
        toast.error("Failed to load favourites.");
      }
    } catch (error) {
      console.error("Failed to fetch favourites:", error);
    }
  };
  // Fetch wallet balance
const fetchWalletBalance = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/wallet/${userId}`);
    ;
    const data = await res.json();
    if (data.success) {
      setWalletBalance(data.balance);
    }
  } catch (err) {
    console.error("Failed to fetch wallet balance:", err);
  }
};
const handleTopUp = async () => {
  if (!topUpAmount || isNaN(topUpAmount)) {
    toast.error("Please enter a valid amount.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/wallet/topup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount: parseFloat(topUpAmount) }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Top-up successful!");
      setTopUpAmount(""); // clear input
      fetchWalletBalance(); // refresh balance here 🔁
    } else {
      toast.error("Top-up failed.");
    }
  } catch (err) {
    console.error("Top-up error:", err);
  }
};
useEffect(() => {
  const fetchAcceptedJobs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/cleaner/${cleanerId}/accepted`);
      const data = await response.json();
      if (data.success) setAcceptedJobs(data.bookings);
    } catch (error) {
      console.error("Error fetching accepted jobs:", error);
    }
  };

  if (showScheduleModal) {
    fetchAcceptedJobs();
  }
}, [showScheduleModal]);
// Call fetchWalletBalance when wallet modal is opened
useEffect(() => {
  if (showWalletModal) {
    fetchWalletBalance();
  }
}, [showWalletModal]);
  
const handlePayCleaner = async (job) => {
  try {
    const res = await fetch("http://localhost:5000/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: job.id,
        amount: job.price,
        method: "wallet",
        status: "paid",
        userId: userId, // homeowner ID
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Payment successful!");
      fetchWalletBalance();      // update wallet UI
      fetchAcceptedBookings();   // refresh bookings UI
    } else {
      toast.error("Payment failed. Do you have enough balance?");
    }
  } catch (err) {
    console.error("Payment error:", err);
    toast.error("Payment error occurred.");
  }
};


const fetchCleanerPayments = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/payments/cleaner/${cleanerId}`);
    const data = await res.json();
    if (data.success) {
      setCleanerPayments(data.payments);
    }
  } catch (err) {
    console.error("Failed to fetch cleaner payments:", err);
  }
};



const fetchCleanerWallet = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/wallet/${cleanerId}`);
    const data = await res.json();
    if (data.success) {
      setCleanerWalletBalance(data.balance);
    } else {
      toast.error("Failed to fetch wallet balance.");
    }
  } catch (err) {
    console.error("Cleaner wallet fetch error:", err);
  }
};



  const [showUserModal, setShowUserModal] = useState(false);
const [users, setUsers] = useState([
  { id: 1, name: "Jane Doe", email: "jane@example.com", password: "test123", role: "Cleaner" }
]);
const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Cleaner" });
const [userError, setUserError] = useState("");



  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand fw-bold" href="/">TeamABC Dashboard</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/login">Logout</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <h1 className="fw-bold text-dark">Welcome, {name}!</h1>
        <p className="lead text-dark">Here's your personalized cleaning dashboard</p>

        <div className="row g-4 mt-4">
        {/* Homeowner cards */}
        {role === "Homeowner" && (
          <>
            {/* Search Cleaners */}
            <div className="col-md-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">Find & Shortlist Cleaners</h5>
                  <p className="card-text">
                    Search and favourite potential cleaners for future bookings.
                  </p>
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      fetchCleaners();
                      setShowCleanerModal(true);
                    }}
                  >
                    Search Cleaners
                  </button>
                </div>
              </div>
            </div>

            {/* Used Services */}
            <div className="col-md-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">Used Services</h5>
                  <p className="card-text">
                    Check past services, filtered by type or period.
                  </p>
                  <a href="/homeowner/history" className="btn btn-outline-dark btn-sm">
                    Service History
                  </a>
                </div>
              </div>
            </div>

            {/* My Favourites */}
            <div className="col-md-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">My Favourites</h5>
                  <p className="card-text">View and manage your favourited cleaners.</p>
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => {
                      fetchFavourites(); // 
                      setShowFavouritesModal(true);
                    }}
                  >
                    Show Favourites
                  </button>
                </div>
              </div>
            </div>
            {/* Upcoming Bookings */}
            <div className="col-md-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">Upcoming Bookings</h5>
                  <p className="card-text">
                    View the status of cleaners accepted your requests.
                  </p>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => {
                      fetchAcceptedBookings(); 
                      setShowAcceptedModal(true);
                    }}
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            </div>
            {/*Wallet*/}
            <div className="col-md-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">My Wallet</h5>
                  <p className="card-text">Top up and manage your balance for bookings.</p>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setShowWalletModal(true)}>My Wallet</button>
                </div>
              </div>
            </div>
          </>
        )}



          {/* Cleaner cards */}
          {role === "Cleaner" && (
            <>
                <div className="col-md-6 col-lg-4">
                <div className="card shadow h-100">
                    <div className="card-body">
                    <h5 className="card-title">Manage Services</h5>
                    <p className="card-text">List and update your services and pricing.</p>
                    <Button
                        onClick={() => {
                            fetchProfile();
                            fetchServices();
                            setShowModal(true);
                        }}
                        variant="outline-success"
                        size="sm"
                        >
                        Manage Services
                        </Button>
                    </div>
                </div>
                </div>

                <div className="col-md-6 col-lg-4">
                <div className="card shadow h-100">
                    <div className="card-body">
                    <h5 className="card-title">Job Requests</h5>
                    <p className="card-text">Accept or decline new cleaning jobs.</p>
                    <Button variant="outline-info" size="sm" onClick={() => {
                            fetchJobRequests();
                            setShowRequestsModal(true);
                        }}>
                        View Requests
                        </Button>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="card shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Profile & Calendar</h5>
                    <p className="card-text">Manage your availability and view bookings.</p>
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      onClick={() => setShowScheduleModal(true)} // 🔥 Trigger modal here
                    >
                      Manage Schedule
                    </Button>
                  </div>
                </div>
              </div>

                <div className="col-md-6 col-lg-4">
                <div className="card shadow h-100">
                    <div className="card-body">
                    <h5 className="card-title">Notifications & Messaging</h5>
                    <p className="card-text">Get notified and chat with homeowners.</p>
                    <Button variant="outline-primary" size="sm">Go to Inbox</Button>
                    </div>
                </div>
                </div>

                <div className="col-md-6 col-lg-4">
                <div className="card shadow h-100">
                    <div className="card-body">
                    <h5 className="card-title">Payment Tracking</h5>
                    <p className="card-text">Track job payments and pending amounts.</p>
                    <Button variant="outline-dark" size="sm" onClick={() => {
                      fetchCleanerPayments(); 
                      setShowCleanerPaymentsModal(true);
                    }}>
                      View Payments
                    </Button>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="card shadow h-100">
                    <div className="card-body">
                      <h5 className="card-title">My Wallet</h5>
                      <p className="card-text">View your total earnings from completed jobs.</p>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => {
                          fetchCleanerWallet();
                          setShowCleanerWalletModal(true);
                        }}
                      >
                        View Wallet
                      </Button>
                    </div>
                  </div>
                </div>
              
            </>
           )}


          {/* Admin cards */}
          {role === "Admin" && (
            <>
              <div className="col-md-6 col-lg-6">
                <div className="card shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">User Profiles</h5>
                    <p className="card-text">Manage all users and permissions.</p>
                    <Button variant="outline-primary" size="sm" onClick={handleOpenUserModal}>
                        Manage Users
                        </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                <div className="card shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Platform Management</h5>
                    <p className="card-text">Manage services and generate reports.</p>
                    <a href="/admin/platform" className="btn btn-outline-danger btn-sm">Platform Tools</a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

 {/* Admin User Management Modal */}
<Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Manage User Accounts</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p className="text-muted mb-3">Create, modify, or remove user accounts below.</p>

    {/* User Table */}
    <table className="table table-bordered shadow-sm">
      <thead className="table-light">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th style={{ width: "200px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={() => {
                  setEditingUser(user);
                  setEditRole(user.role);
                  setEditPassword("");
                  setShowEditModal(true);
                }}
              >
                Modify
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  // Call DELETE /api/users/:id
                  fetch(`http://localhost:5000/api/users/${user.id}`, {
                    method: 'DELETE'
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      fetchUsers(); // Refresh users list
                      toast.success('Deleted User');
                    } else {
                      toast.error('Failed to delete user.');
                    }
                  });
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <hr className="my-4" />
    {userError && <p className="text-danger">{userError}</p>}

    {/* Create User Form */}
    <h5 className="fw-bold">Create New User</h5>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Alice Tan"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="e.g. alice@example.com"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter temporary password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option>Cleaner</option>
          <option>Homeowner</option>
          <option>Admin</option>
        </Form.Select>
      </Form.Group>
    </Form>

    <Button
      variant="success"
      className="mt-2"
      onClick={() => {
        if (!newUser.name || !newUser.email || !newUser.password) {
          setUserError("All fields are required.");
          return;
        }

        // Call POST /api/users
        fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            fetchUsers(); // Refresh users list
            setNewUser({ name: "", email: "", password: "", role: "Cleaner" });
            setUserError("");
          } else {
            setUserError("Failed to create user.");
          }
        });
      }}
    >
      Create User
    </Button>

    {/* Edit User Modal */}
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modify User: {editingUser?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Leave blank to keep unchanged"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Role</Form.Label>
            <Form.Select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              <option>Cleaner</option>
              <option>Homeowner</option>
              <option>Admin</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            const updateData = {
              role: editRole
            };
            if (editPassword) {
              updateData.password = editPassword;
            }

            // Call PUT /api/users/:id
            fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateData)
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                fetchUsers(); // Refresh users list
                setShowEditModal(false);
                setEditingUser(null);
                setEditPassword("");
                toast.success('Saved Changes');
              } else {
                toast.error('Failed to modify user.');
              }
            });
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUserModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


{/* Cleaner Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Manage Your Services & Profile</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <p className="text-muted mb-4">
      Easily manage your cleaning services, skills, experience, and work preferences.
    </p>
    {(previewImageUrl || tempProfile?.image_path) && (
  <div className="text-center mb-4">
    <img
      src={previewImageUrl || `http://localhost:5000/${tempProfile.image_path}`}
      alt="Cleaner Profile"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "http://localhost:5000/images/default.jpg"; // fallback
      }}
      style={{
        width: "380px",
        height: "500px",
        objectFit: "cover",
        border: "2px solid #dee2e6",
      }}
    />
  </div>
)}
    <Form onSubmit={handleSaveAll}>
      <h5 className="fw-bold mb-3">Your Profile Details</h5>

      <div className="mb-4">
        
        <p><strong>Bio:</strong> {profile.skills || "No bio yet."}</p>
        <p><strong>Experience:</strong> {profile.experience ? `${profile.experience} years` : "No experience yet."}</p>
        <p><strong>Preferred Areas:</strong> {profile.preferred_areas || "No preferred areas yet."}</p>
        <p><strong>Availability:</strong> {profile.availability || "No availability set."}</p>
      </div>

      <hr className="my-4" />

      {/* === Services Table Section === */}
      <h5 className="fw-bold mb-3">Your Services</h5>
      {services.length > 0 ? (
        <table className="table table-bordered shadow-sm mb-4">
          <thead className="table-light">
            <tr>
              <th>Service Name</th>
              <th>Price ($)</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.service_name}</td>
                <td>${service.price}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info mb-4">
          No services added yet. Start by adding your first service below!
        </div>
      )}

      {/* === Add New Service Section === */}
      <h6 className="fw-bold mb-3">Add New Service</h6>
      <div className="row align-items-end mb-4">
        <div className="col-md-5">
          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Deep Cleaning"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
          </Form.Group>
        </div>

        <div className="col-md-5">
          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 120"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
          </Form.Group>
        </div>

        <div className="col-md-2 d-grid">
          <Button
            variant="success"
            type="button"
            onClick={handleAddService}
          >
            + Add
          </Button>
        </div>
      </div>

      <hr className="my-4" />

      {/* === Edit Profile Section === */}
      <h5 className="fw-bold mb-3">Edit Your Profile</h5>

      <Form.Group className="mb-3">
      <Form.Label>Upload Profile Image</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setTempProfile((prev) => ({
            ...prev,
            imageFile: file, // ✅ Save the actual file object for FormData
          }));
        }}
      />
    </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="e.g. Experienced in residential cleaning, passionate about customer satisfaction."
          value={tempProfile.skills || ""}
          onChange={(e) => setTempProfile({ ...tempProfile, skills: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Experience (Years)</Form.Label>
        <Form.Control
          type="number"
          placeholder="e.g. 3"
          value={tempProfile.experience || ""}
          onChange={(e) => setTempProfile({ ...tempProfile, experience: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Preferred Work Areas</Form.Label>
        <Form.Select
            value={tempProfile.preferred_areas || ""}
            onChange={(e) => setTempProfile({ ...tempProfile, preferred_areas: e.target.value })}
        >
            <option value="">-- Select Area --</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
        </Form.Select>
      </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Availability</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="e.g. Weekdays 9am-6pm, Saturday mornings"
          value={tempProfile.availability || ""}
          onChange={(e) => setTempProfile({ ...tempProfile, availability: e.target.value })}
        />
      </Form.Group>

      {/* === Save All Button === */}
      <div className="d-flex justify-content-end">
        <Button type="submit" variant="primary">
          Save Profile Changes
                </Button>
            </div>
            </Form>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
      {/* === Job Request === */}
      <Modal show={showRequestsModal} onHide={() => setShowRequestsModal(false)} centered size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Job Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {requests.length > 0 ? (
            <table className="table table-bordered shadow-sm">
                <thead className="table-light">
                <tr>
                    <th>Homeowner</th>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {requests.map((req) => (
                    <tr key={req.id}>
                    <td>{req.homeowner_name || "N/A"}</td>
                    <td>{req.service_name}</td>
                    <td>${req.price}</td>
                    <td>{req.status}</td>
                    <td>
                        <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => {
                            setSelectedRequest(req);
                            setShowRequestsModal(false); // 🔥 Hide the Requests Modal
                            setShowJobDetailsModal(true); // 🔥 Open the Job Details Modal
                            }}
                        >
                            View
                        </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p className="text-center">No requests available.</p>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRequestsModal(false)}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
        {/* Cleaner Job Details Modal */}
        <Modal show={showJobDetailsModal} onHide={() => setShowJobDetailsModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedRequest ? (
           <>
           <p><strong>Homeowner:</strong> {selectedRequest.homeowner_name}</p>
           <p><strong>Service:</strong> {selectedRequest.service_name}</p>
           <p><strong>Price:</strong> ${selectedRequest.price}</p>
           <p><strong>Location:</strong> {selectedRequest.location || "N/A"}</p>
           <p><strong>Date & Time:</strong> {selectedRequest.appointment_datetime || "N/A"}</p>
           <p><strong>Status:</strong> {selectedRequest.status}</p>
         </>
         
            ) : (
            <p>Loading job details...</p>
            )}
        </Modal.Body>
        <Modal.Footer>
            {selectedRequest && selectedRequest.status === "Pending" && (
            <>
                <Button
                variant="outline-success"
                onClick={() => {
                    handleAcceptRequest(selectedRequest.id);
                    setShowJobDetailsModal(false);
                }}
                >
                Accept
                </Button>
                <Button
                variant="outline-danger"
                onClick={() => {
                    handleDeclineRequest(selectedRequest.id);
                    setShowJobDetailsModal(false);
                }}
                >
                Decline
                </Button>
            </>
            )}
            <Button variant="secondary" onClick={() => setShowJobDetailsModal(false)}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
        {/* Cleaner Payment tracking */}
        <Modal show={showCleanerPaymentsModal} onHide={() => setShowCleanerPaymentsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>My Payment Records</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cleanerPayments.length > 0 ? (
            <table className="table table-bordered shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>Homeowner</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {cleanerPayments.map((pmt) => (
                  <tr key={pmt.id}>
                    <td>{pmt.homeowner_name}</td>
                    <td>{pmt.service_name}</td>
                    <td>${pmt.amount}</td>
                    <td>{pmt.status}</td>
                    <td>{pmt.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted">No payments recorded yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCleanerPaymentsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/*Cleaner Wallets*/}
      <Modal show={showCleanerWalletModal} onHide={() => setShowCleanerWalletModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>My Wallet</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p className="fs-5">
      Total Balance: <strong>${cleanerWalletBalance.toFixed(2)}</strong>
    </p>
    <p className="text-muted">This reflects your total earnings available for withdrawal.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowCleanerWalletModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

 {/* Manage Schedule For Cleaner modal */}
<Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Accepted Jobs</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {acceptedJobs?.length > 0 ? (
      <>
        {/* === Calendar for Date Selection === */}
        <div className="mb-4">
          <h5 className="mb-2">Select Date</h5>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileContent={({ date }) => {
              const jobExists = acceptedJobs.some((job) =>
                new Date(job.appointment_datetime).toDateString() === date.toDateString()
              );
              return jobExists ? (
                <div
                  style={{
                    backgroundColor: "#d4edda",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    textAlign: "center",
                    marginTop: "2px"
                  }}
                >
                  📅
                </div>
              ) : null;
            }}
          />
        </div>

        {/* === Filtered Jobs Based on Date === */}
        <h6 className="mb-3 text-muted">
          Jobs on {selectedDate.toDateString()}
        </h6>

        {filteredJobs.length > 0 ? (
          <div className="row">
            {filteredJobs.map((job) => (
              <div className="col-md-6 mb-4" key={job.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{job.service_name}</h5>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Date & Time:</strong> {job.appointment_datetime}</p>
                    <p><strong>Price:</strong> ${job.price}</p>
                    <p><strong>Status:</strong> {job.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">
            No jobs scheduled for this date.
          </div>
        )}
      </>
    ) : (
      <p className="text-center text-muted">No accepted jobs yet.</p>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

{/* Homeowner Modal */}
<Modal
  show={showCleanerModal}
  onHide={() => setShowCleanerModal(false)}
  centered
  dialogClassName="modal-xl" // Wider modal
>
  <Modal.Header closeButton>
  <Modal.Title>Available Cleaners</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p className="text-muted mb-3">Browse and find available cleaners for your needs.</p>
    <div className="row">
      {cleaners.length > 0 ? (
        cleaners.map((cleaner) => (
          <div className="col-md-4 mb-4" key={cleaner.id}>
            <div className="card shadow h-100">
              <img
                src={`http://localhost:5000/${cleaner.image_path || 'images/default.jpg'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://localhost:5000/images/default.jpg';
                }}
                alt={`${cleaner.name}'s profile`}
                className="card-img-top"
                style={{
                  height: "230px",
                  objectFit: "contain",
                  backgroundColor: "#f8f9fa",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem"
                }}
                
              />
              <div className="card-body text-center">
                <h5 className="card-title">{cleaner.name}</h5>
                <p className="card-text">
                  <strong>Experience:</strong> {cleaner.experience ? `${cleaner.experience} yrs` : "N/A"}
                </p>
                <p className="card-text">
                  <strong>Preferred Areas:</strong> {cleaner.preferred_areas || "N/A"}
                </p>
                <div className="mt-auto">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => {
                      setShowCleanerModal(false);
                      handleViewProfile(cleaner);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12">
          <div className="alert alert-info text-center">No cleaners available.</div>
        </div>
      )}
    </div>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowCleanerModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


   {/* Cleaner Profile Modal for HomeOwner */}
    <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedCleaner?.name}'s Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {selectedCleaner ? (
  <>
    <div className="card shadow-sm mb-4">
      <img
        src={`http://localhost:5000/${selectedCleaner.image_path || 'images/default.jpg'}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'http://localhost:5000/images/default.jpg';
        }}
        className="card-img-top"
        alt={`${selectedCleaner.name}'s Profile`}
        style={{
          height: "400px",
          objectFit: "contain",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        }}
      />
      <div className="card-body text-center">
        <h4 className="card-title mb-3">{selectedCleaner.name}</h4>
        <p><strong>Bio:</strong> {selectedCleaner.skills || "N/A"}</p>
        <p><strong>Experience:</strong> {selectedCleaner.experience ? `${selectedCleaner.experience} yrs` : "N/A"}</p>
        <p><strong>Preferred Areas:</strong> {selectedCleaner.preferred_areas || "N/A"}</p>
        <p><strong>Availability:</strong> {selectedCleaner.availability || "N/A"}</p>
      </div>
    </div>

    <h5 className="fw-bold mb-3">Services Offered</h5>

    {selectedCleaner.services?.length > 0 ? (
      <div className="row">
        {selectedCleaner.services.map((service) => (
          <div className="col-md-4 mb-4" key={service.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h6 className="card-title">{service.service_name}</h6>
                <p className="card-text">
                  <strong>Price:</strong> ${service.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted">No services listed yet.</p>
    )}

    {/* Booking Section */}
    <Form.Group className="mt-4">
      <Form.Label>Select a Service to Book</Form.Label>
      <Form.Select
        value={selectedServiceName}
        onChange={(e) => {
          const selected = selectedCleaner.services.find(
            (service) => service.service_name === e.target.value
          );
          setSelectedServiceName(selected?.service_name || "");
          setSelectedServicePrice(selected?.price || "");
        }}
      >
        <option value="">-- Please choose a service --</option>
        {selectedCleaner.services.map((service) => (
          <option key={service.id} value={service.service_name}>
            {service.service_name} - ${service.price}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mt-4">
      <Form.Label>Service Location</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter location (e.g. 123 Main St)"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      />
    </Form.Group>

    <Form.Group className="mt-3">
      <Form.Label>Preferred Date & Time</Form.Label>
      <Form.Control
        type="datetime-local"
        value={selectedDatetime}
        onChange={(e) => setSelectedDatetime(e.target.value)}
      />
    </Form.Group>
  </>
) : (
  <p>Loading profile...</p>
)}
 </Modal.Body>

      {/* ===== Footer Buttons ===== */}
      <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
        Close
      </Button>

      <Button
      style={{
        backgroundColor: "#ffc107",  
        color: "#000",               
        border: "1px solid #ffc107"
      }}
      className="me-2"
      onClick={async () => {
        try {
          const res = await fetch("http://localhost:5000/api/favourites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              homeownerId: userId,
              cleanerId: selectedCleaner.id,
            }),
          });

          const data = await res.json();
          if (data.success) {
            const message =
              data.action === "added"
                ? "Cleaner added to your favourites!"
                : "Cleaner removed from your favourites.";
            toast.success(message);

            // Update state directly
            setIsFavourite(data.action === "added");
          } else {
            toast.error("Failed to update favourites.");
          }
        } catch (err) {
          console.error("Favourite error:", err);
        }
      }}
    >
      {isFavourite ? "Saved" : "Save to Favourites"}
    </Button>


        <Button
          variant="success"
          onClick={() => {
            if (!selectedServiceName || !selectedServicePrice || !selectedLocation || !selectedDatetime) {
              toast.error("Please select service, location, and date/time before booking!");
              return;
            }
            handleBookCleaner(selectedCleaner);
          }}
        >
          Book This Cleaner
        </Button>
    </Modal.Footer>
    </Modal>
    {/* ===== favourites for HomeOwner ===== */}
    <Modal show={showFavouritesModal} onHide={() => setShowFavouritesModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>My Favourite Cleaners</Modal.Title>
      </Modal.Header>
      <Modal.Body>
  <p className="text-muted mb-3">Here are the cleaners you've saved to favourites.</p>

  {favourites.length > 0 ? (
    <div className="row">
      {favourites.map((cleaner) => (
        <div className="col-md-4 mb-4" key={cleaner.id}> {/* <-- 3 columns per row */}
          <div className="card shadow-sm h-100">
            <img
              src={`http://localhost:5000/${cleaner.image_path || "images/default.jpg"}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "http://localhost:5000/images/default.jpg";
              }}
              className="card-img-top"
              alt={`${cleaner.name}'s Profile`}
              style={{
                height: "220px",
                objectFit: "cover",
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem",
              }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">{cleaner.name}</h5>
              <p className="card-text mb-1">
                <strong>Experience:</strong> {cleaner.experience ? `${cleaner.experience} yrs` : "N/A"}
              </p>
              <p className="card-text mb-2">
                <strong>Preferred Areas:</strong> {cleaner.preferred_areas || "N/A"}
              </p>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  setShowFavouritesModal(false);
                  handleViewProfile(cleaner);
                }}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="alert alert-info text-center">You haven't saved any favourites yet.</div>
  )}
</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowFavouritesModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    {/* === Modal for Accepted Bookings === */}
    <Modal show={showAcceptedModal} onHide={() => setShowAcceptedModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Confirmed Jobs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">These jobs have been accepted by your selected cleaners.</p>
        <table className="table table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Cleaner</th>
              <th>Service</th>
              <th>Price</th>
              <th>Location</th>
              <th>Date & Time</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {acceptedBookings.length > 0 ? (
              acceptedBookings.map((job) => (
                <tr key={job.id}>
                  <td>{job.cleaner_name}</td>
                  <td>{job.service_name}</td>
                  <td>${job.price}</td>
                  <td>{job.location}</td>
                  <td>{job.appointment_datetime}</td>
                  <td>
                    {job.is_paid ? (
                      <span className="text-success">Paid</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handlePayCleaner(job)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No accepted jobs yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAcceptedModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    {/* ===== Wallet Modal for Homeowner ===== */}
    <Modal show={showWalletModal} onHide={() => setShowWalletModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>My Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">Current Balance: ${walletBalance.toFixed(2)}</p>

        <Form>
          <Form.Group>
            <Form.Label>Top-Up Amount ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              min={1}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowWalletModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleTopUp}>
      Top Up
    </Button>

      </Modal.Footer>
    </Modal>



    </div>
  );
};

export default Dashboard;
