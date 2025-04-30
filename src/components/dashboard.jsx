import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
  
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

  const userId = location.state?.id || null;

const [requests, setRequests] = useState([]); 
  console.log("Cleaner ID inside Dashboard:", cleanerId); // <-- Add here

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
      alert("Please fill in service name and price.");
      return;
    }
  
    if (!cleanerId) {
      alert("Cleaner ID missing. Cannot save service.");
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
        alert("Failed to add service.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleSaveProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanerId: cleanerId,
          skills: tempProfile.skills,
          experience: tempProfile.experience,
          preferredAreas: tempProfile.preferred_areas,
          availability: tempProfile.availability,
        }),
      });
  
      const data = await res.json();
      if (data.success) {
        alert("Profile saved successfully!");
        setProfile(tempProfile);    // ✅ Update the real profile now!
      } else {
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleDeleteService = async (serviceId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
        method: 'DELETE',
      });
  
      const data = await res.json();
      if (data.success) {
        fetchServices();
      } else {
        alert("Failed to delete service.");
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
  
    // Save service only if user entered a new one
    if (newService.name && newService.price) {
      await handleAddService();
    }
  
    // Always save profile
    await handleSaveProfile();
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
      const res = await fetch(`http://localhost:5000/api/services/${cleaner.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCleaner({ ...cleaner, services: data.services });
        setShowProfileModal(true);
      } else {
        alert('Failed to fetch cleaner services.');
      }
    } catch (error) {
      console.error('Error fetching cleaner services:', error);
    }
  };
  
  const handleBookCleaner = async (cleaner) => {
    if (!selectedServiceName || !selectedServicePrice || !selectedLocation || !selectedDatetime) {
      alert("Please select service, location, and date/time before booking!");
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
        alert('Booking request sent successfully!');
        setShowProfileModal(false);
      } else {
        alert('Failed to send booking request.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong.');
    }
  };
  
  
  const handleAcceptRequest = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/accept`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        alert('Booking accepted!');
  
        // 🛠 Update status of the accepted request locally
        setRequests((prevRequests) =>
          prevRequests.map(req =>
            req.id === bookingId ? { ...req, status: 'Accepted' } : req
          )
        );
        
      } else {
        alert('Failed to accept booking.');
      }
    } catch (error) {
      console.error('Accept error:', error);
    }
  };
  
  
  const handleDeclineRequest = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/decline`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        alert('Booking declined.');
  
        // 🛠 Immediately remove the declined request from the list
        setRequests((prevRequests) => prevRequests.filter(req => req.id !== bookingId));
        
      } else {
        alert('Failed to decline booking.');
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
  
  
  
  const [showUserModal, setShowUserModal] = useState(false);
const [users, setUsers] = useState([
  { id: 1, name: "Jane Doe", email: "jane@example.com", password: "test123", role: "Cleaner" }
]);
const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Cleaner" });
const [userError, setUserError] = useState("");

const [editingUser, setEditingUser] = useState(null);
const [editPassword, setEditPassword] = useState("");
const [editRole, setEditRole] = useState("");
const [showEditModal, setShowEditModal] = useState(false);

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
              <div className="col-md-6 col-lg-6">
                <div className="card shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Find & Shortlist Cleaners</h5>
                    <p className="card-text">Search and favourite potential cleaners for future bookings.</p>
                    <a
                        href="#"
                        className="btn btn-outline-info btn-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            fetchCleaners();
                            setShowCleanerModal(true);
                        }}
                        >
                        Search Cleaners
                        </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                <div className="card shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Used Services</h5>
                    <p className="card-text">Check past services, filtered by type or period.</p>
                    <a href="/homeowner/history" className="btn btn-outline-dark btn-sm">Service History</a>
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
                    <Button variant="outline-warning" size="sm">Manage Schedule</Button>
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
                    <p className="card-text">Track completed payments and pending amounts.</p>
                    <Button variant="outline-dark" size="sm">View Payments</Button>
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
                    } else {
                      alert('Failed to delete user.');
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
              } else {
                alert('Failed to modify user.');
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

    <Form onSubmit={handleSaveAll}>
      {/* === Profile Section (TOP) === */}
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



{/* Homeowner Modal */}
    <Modal show={showCleanerModal} onHide={() => setShowCleanerModal(false)} centered size="lg">
    <Modal.Header closeButton>
        <Modal.Title>Available Cleaners</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <p className="text-muted mb-3">Browse and find available cleaners for your needs.</p>

        {/* Cleaners Table */}
        <table className="table table-bordered shadow-sm">
        <thead className="table-light">
            <tr>
            <th>Name</th>
            <th>Experience</th>
            <th>Preferred Areas</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    {cleaners.length > 0 ? (
        cleaners.map((cleaner) => (
        <tr key={cleaner.id}>
            <td>{cleaner.name}</td>
            <td>{cleaner.experience ? `${cleaner.experience} yrs` : "N/A"}</td>
            <td>{cleaner.preferred_areas || "N/A"}</td>
            <td>
            <Button
                variant="outline-success"
                size="sm"
                className="me-2"
                onClick={() => handleViewProfile(cleaner)}
            >
                View Profile
            </Button>
            </td>
        </tr>
        ))
    ) : (
        <tr>
        <td colSpan="5" className="text-center">No cleaners available.</td>
        </tr>
    )}
    </tbody>
        </table>
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
        <h5 className="mb-3">Bio</h5>
        <p>{selectedCleaner.skills || "N/A"}</p>

        <h5 className="mb-3">Experience</h5>
        <p>{selectedCleaner.experience ? `${selectedCleaner.experience} yrs` : "N/A"}</p>

        <h5 className="mb-3">Preferred Areas</h5>
        <p>{selectedCleaner.preferred_areas || "N/A"}</p>

        <h5 className="mb-3">Availability</h5>
        <p>{selectedCleaner.availability || "N/A"}</p>

        <hr className="my-4" />

        <h5 className="fw-bold">Services Offered</h5>
        {selectedCleaner.services?.length > 0 ? (
          <>
            <table className="table table-bordered shadow-sm mt-3">
              <thead className="table-light">
                <tr>
                  <th>Service Name</th>
                  <th>Price ($)</th>
                </tr>
              </thead>
              <tbody>
                {selectedCleaner.services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.service_name}</td>
                    <td>${service.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ===== Select Service to Book ===== */}
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

            {/* ===== Select Location ===== */}
            <Form.Group className="mt-4">
              <Form.Label>Service Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location (e.g. 123 Main St)"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </Form.Group>

            {/* ===== Select Date/Time ===== */}
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
          <p className="text-muted">No services listed yet.</p>
        )}
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
      variant="success"
      onClick={() => {
        if (!selectedServiceName || !selectedServicePrice || !selectedLocation || !selectedDatetime) {
          alert("Please select service, location, and date/time before booking!");
          return;
        }
        handleBookCleaner(selectedCleaner);
      }}
    >
      Book This Cleaner
    </Button>
  </Modal.Footer>
</Modal>





    </div>
  );
};

export default Dashboard;