import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button} from "react-bootstrap";
import { toast } from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';
import RateCleanerModal from "./HomeownerModal/RateCleanerModal";
import SearchCleanerModal from "./HomeownerModal/SearchCleanerModal";
import CleanerProfileModal from './HomeownerModal/CleanerProfileModal';
import FavouritesModal from './HomeownerModal/FavouritesModal';
import ViewBookings from "./HomeownerModal/ViewBookings";
import WalletModal from "./HomeownerModal/WalletModal";
import PreferencesModal from "./HomeownerModal/PreferencesModal";
import ReviewsModal from "./HomeownerModal/ReviewsModal";
import ServiceHistoryModal from './HomeownerModal/ServiceHistoryModal';
import ManageServicesModal from "./CleanerModal/ManageServicesModal";
import JobRequestsModal from "./CleanerModal/JobRequestsModal";
import JobDetailsModal from './CleanerModal/JobDetailsModal';
import CleanerPaymentsModal from "./CleanerModal/CleanerPaymentsModal";
import CleanerWalletModal from "./CleanerModal/CleanerWalletModal";
import ScheduleModal from "./CleanerModal/ScheduleModal";
import ManageUsersModal from './AdminModal/ManageUsersModal';
import PlatformManagementModal from './PlatformManagementModal';
import NotificationModal from "./NotificationModal";

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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedCleanerReviews, setSelectedCleanerReviews] = useState([]);
  const [showServiceHistory, setShowServiceHistory] = useState(false);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
const [latestBookingStatus, setLatestBookingStatus] = useState({});
const [notifications, setNotifications] = useState([]);
const [showNotificationModal, setShowNotificationModal] = useState(false);
const [cleanerNotifications, setCleanerNotifications] = useState([]);
const [latestCleanerStatus, setLatestCleanerStatus] = useState({});
const [showCleanerNotificationModal, setShowCleanerNotificationModal] = useState(false);

   
const pollBookingStatusUpdates = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/all/${userId}`);
    const data = await res.json();

    if (data.success) {
      const updatedStatusMap = { ...latestBookingStatus };
      const newNotifications = [];

     data.bookings.forEach((booking) => {
  const prevStatus = latestBookingStatus[booking.id];

  if (
    (prevStatus && prevStatus !== booking.status) ||
    (!prevStatus && ["Declined", "Accepted", "Completed"].includes(booking.status))
  ) {
    const cleanerName = booking.cleaner_name || "Cleaner";  
    let message = "";

    if (booking.status === "Accepted") {
      message = `${cleanerName} accepted your booking for ${booking.service_name}`;
      toast.success(message);
    } else if (booking.status === "Declined") {
      message = `${cleanerName} declined your booking for ${booking.service_name}`;
      toast.error(message);
    } else if (booking.status === "Completed") {
      message = `${cleanerName} completed the job for ${booking.service_name}. Please proceed for payment.`;
      toast.success(message);
    }

    if (message) {
      newNotifications.push({
        id: Date.now() + Math.random(),
        message,
        datetime: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }),
      });
    }
  }

  updatedStatusMap[booking.id] = booking.status;
});
      if (newNotifications.length > 0) {
        setNotifications((prev) => [...newNotifications, ...prev]);
      }

      setLatestBookingStatus(updatedStatusMap);
    }
  } catch (error) {
    console.error("Failed to poll booking statuses:", error);
  }
};

const pollCleanerNotifications = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/cleaner/all/${userId}`);
    const data = await res.json();

    if (data.success) {
      const newNotes = [];
      const updatedStatusMap = { ...latestCleanerStatus };

      data.bookings.forEach((booking) => {
        const prev = latestCleanerStatus[booking.id] || {};
        const homeownerName = booking.homeowner_name || "Homeowner";

        let message = null;

        // New booking request
        if (!prev.status && booking.status === "Pending") {
          message = `${homeownerName} has requested a job: ${booking.service_name}.`;
          toast.success(message);
        }

        // New payment
        if (!prev.is_paid && booking.is_paid) {
          message = `${homeownerName} has completed payment for ${booking.service_name}.`;
          toast.success(message);
        }

        // New rating (e.g., rating changed from null to 4 or 5)
        if (!prev.rating && booking.rating) {
          message = `${homeownerName} rated you ${booking.rating}⭐ for ${booking.service_name}.`;
          toast.success(message);
        }

        if (message) {
          const note = {
            id: Date.now() + Math.random(),
            message,
            datetime: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }),
          };
          newNotes.push(note);
        }

        // Update tracking state
        updatedStatusMap[booking.id] = {
          status: booking.status,
          is_paid: booking.is_paid,
          rating: booking.rating,
        };
      });

      if (newNotes.length > 0) {
        setCleanerNotifications((prev) => [...newNotes, ...prev]);
      }

      setLatestCleanerStatus(updatedStatusMap);
    }
  } catch (err) {
    console.error("Cleaner poll error:", err);
  }
};







useEffect(() => {
  const initializeStatusMap = async () => {
    try {
      if (role === "Homeowner") {
        const res = await fetch(`http://localhost:5000/api/bookings/all/${userId}`);
        const data = await res.json();
        if (data.success) {
          const map = {};
          data.bookings.forEach(b => map[b.id] = b.status);
          setLatestBookingStatus(map);
        }
      } else if (role === "Cleaner") {
        const res = await fetch(`http://localhost:5000/api/bookings/cleaner/${userId}/accepted`);
        const data = await res.json();
        if (data.success) {
          const map = {};
          data.bookings.forEach(b => {
            map[b.id] = {
              status: b.status,
              paid: b.is_paid,
            };
          });
          setLatestBookingStatus(map);
        }
      }
    } catch (err) {
      console.error("Initial status load failed", err);
    }
  };

  if (role === "Homeowner" || role === "Cleaner") initializeStatusMap();
}, [role, userId]);


useEffect(() => {
  let interval;

  if (role === "Homeowner") {
    interval = setInterval(() => {
      pollBookingStatusUpdates(); // already implemented
    }, 10000);
  } else if (role === "Cleaner") {
    interval = setInterval(() => {
      pollCleanerNotifications(); // function that checks for new bookings/payment
    }, 10000);
  }

  return () => clearInterval(interval);
}, [role, latestBookingStatus, latestCleanerStatus]);




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

  formData.append("cleanerId", userId);
  formData.append("skills", tempProfile.skills || "");
  formData.append("experience", tempProfile.experience || "");
  formData.append("preferredAreas", tempProfile.preferred_areas || "");
  formData.append("availability", tempProfile.availability || "");
  formData.append("is_active", tempProfile.is_active ? 1 : 0);

  if (tempProfile.imageFile) {
    formData.append("profileImage", tempProfile.imageFile);
  }

  try {
    const response = await fetch("http://localhost:5000/api/cleaner/profile", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      toast.success("Profile updated successfully.");
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

  // Re-fetch updated profile from backend
  try {
    const res = await fetch(`http://localhost:5000/api/profile/${cleanerId}`);
    const data = await res.json();
    if (data.success && data.profile) {
      setTempProfile({
        skills: data.profile.skills || "",
        experience: data.profile.experience || "",
        preferred_areas: data.profile.preferred_areas || "",
        availability: data.profile.availability || "",
        is_active: data.profile.is_active === 1,
        image_path: data.profile.image_path || "",
        imageFile: null // Don't override unless needed
      });

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
      const area = preferences.preferred_area;
      const rating = preferences.minimum_rating;
      const minPrice = preferences.min_price;
      const maxPrice = preferences.max_price;
  
      const queryParams = new URLSearchParams();
      if (area) queryParams.append("preferredArea", area);
      if (rating && rating > 0) queryParams.append("minimumRating", rating);
      if (minPrice != null) queryParams.append("minPrice", minPrice);
      if (maxPrice != null) queryParams.append("maxPrice", maxPrice);
  
      const url = `http://localhost:5000/api/cleaners?${queryParams.toString()}`;
  
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCleaners(data.cleaners);
      }
    } catch (error) {
      console.error("Failed to fetch cleaners:", error);
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
  
 
  
  // Define it at the top level in the component
  const fetchAcceptedJobs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/cleaner/${cleanerId}/accepted`);
      const data = await response.json();
      if (data.success) {
        setAcceptedJobs(data.bookings); // this now includes 'Accepted' and 'Completed'
      }
    } catch (error) {
      console.error("Error fetching accepted jobs:", error);
    }
  };
  

  
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

  const handleCleanerWithdraw = async (amount) => {
  try {
    const res = await fetch("http://localhost:5000/api/wallet/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: cleanerId, amount }),  // use cleanerId
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Withdrawal successful!");
      fetchCleanerWallet(); // refresh balance
    } else {
      toast.error(data.message || "Withdrawal failed.");
    }
  } catch (err) {
    console.error("Withdrawal error:", err);
    toast.error("Something went wrong.");
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
useEffect(() => {
  console.log("User ID from component:", userId);
}, []);

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

      //  Refresh job list and payment records
      fetchAcceptedBookings();    // if you want to update the booking table
      fetchCleanerPayments();     // this should update the records in the modal
    } else {
      toast.error("Payment failed. Insufficent Funds !");
    }
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Something went wrong.");
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

const [preferences, setPreferences] = useState({
  prefers_pet_friendly: false,
  prefers_eco_friendly: false,
  other_notes: "",
});
const [showPreferencesModal, setShowPreferencesModal] = useState(false);

const fetchPreferences = async () => {
  const res = await fetch(`http://localhost:5000/api/preferences/${userId}`);
  const data = await res.json();
  if (data.success) setPreferences(data.preferences);
};

const savePreferences = async () => {
  try {
    await fetch(`http://localhost:5000/api/preferences/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });
    toast.success("Preferences saved!");
    setShowPreferencesModal(false);
  } catch (error) {
    console.error("Failed to save preferences:", error);
    toast.error("Error saving preferences.");
  }
};

const rateCleaner = async (bookingId, rating, comment) => {
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Thanks for your rating!");
      setShowRatingModal(false);
      fetchAcceptedBookings(); // refresh list
    } else {
      toast.error("Failed to submit rating.");
    }
  } catch (err) {
    console.error(err);
  }
};

// mark complete jobs
const markJobAsCompleted = async (bookingId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/complete`, {
      method: "PUT",
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Job marked as completed!");
      fetchAcceptedJobs();         
      fetchAcceptedBookings();     
    } else {
      toast.error("Failed to mark job as completed.");
    }
  } catch (err) {
    console.error(err);
  }
};


const fetchCleanerReviews = async (cleanerId, cleanerName) => {
  try {
    const res = await fetch(`http://localhost:5000/api/cleaners/${cleanerId}/reviews`);
    const data = await res.json();

    if (data.success) {
      setSelectedCleanerReviews(data.reviews);
      setSelectedCleaner(prev => ({ ...(prev || {}), name: cleanerName })); // ✅ store the name
      setShowReviewsModal(true);
    } else {
      toast.error("Failed to fetch reviews.");
    }
  } catch (error) {
    console.error("Review fetch error:", error);
    toast.error("An error occurred while fetching reviews.");
  }
};


const fetchCompletedServices = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/completed/${userId}`);
    const data = await res.json();
    if (data.success) {
      setCompletedBookings(data.bookings); // you must define this state
    }
  } catch (err) {
    console.error("Error fetching completed services:", err);
  }
};

useEffect(() => {
  // Fetch accepted jobs if schedule modal is opened
  if (showScheduleModal) {
    const fetchAcceptedJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/cleaner/${cleanerId}/accepted`);
        const data = await response.json();
        if (data.success) setAcceptedJobs(data.bookings);
      } catch (error) {
        console.error("Error fetching accepted jobs:", error);
      }
    };
    fetchAcceptedJobs();
  }

  // Fetch wallet balance if wallet modal is opened
  if (showWalletModal) {
    const fetchWalletBalance = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/wallet/${userId}`);
        const data = await res.json();
        if (data.success) {
          setWalletBalance(data.balance);
        }
      } catch (err) {
        console.error("Failed to fetch wallet balance:", err);
      }
    };
    fetchWalletBalance();
  }
}, [showScheduleModal, showWalletModal]);


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
          <ul className="navbar-nav ms-auto align-items-center">
            {(role === "Homeowner" || role === "Cleaner") && (
              <li className="nav-item me-3">
                <button
                  className="btn btn-sm btn-outline-light position-relative"
                  onClick={() =>
                    role === "Homeowner"
                      ? setShowNotificationModal(true)
                      : setShowCleanerNotificationModal(true)
                  }
                >
                  <i className="bi bi-bell"></i>
                  {((role === "Homeowner" && notifications.length > 0) ||
                    (role === "Cleaner" && cleanerNotifications.length > 0)) && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {role === "Homeowner" ? notifications.length : cleanerNotifications.length}
                    </span>
                  )}
                </button>
              </li>
            )}
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
                  <Button
                    variant="outline-dark"
                    onClick={() => {
                      fetchCompletedServices(); // fetch data before opening modal
                      setShowServiceHistory(true);
                    }}
                  >
                    Service History
                  </Button>
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
            {/* Preferences Card */}
            <div className="col-md-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">My Cleaning Preferences</h5>
                  <p className="card-text">Tell us your preferred cleaning options.</p>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      fetchPreferences();
                      setShowPreferencesModal(true);
                    }}
                  >
                    Edit Preferences
                  </button>
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
                      onClick={() => setShowScheduleModal(true)} 
                    >
                      Manage Schedule
                    </Button>
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
                    <Button variant="outline-danger" size="sm" onClick={() => setShowPlatformModal(true)}>
                      Platform Tools
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

 {/* Admin Main Modal */}
           {/* Admin Mangement Modal  */}
          <ManageUsersModal
            showUserModal={showUserModal}
            setShowUserModal={setShowUserModal}
            users={users}
            newUser={newUser}
            setNewUser={setNewUser}
            userError={userError}
            setUserError={setUserError}
            fetchUsers={fetchUsers}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            editPassword={editPassword}
            setEditPassword={setEditPassword}
            editRole={editRole}
            setEditRole={setEditRole}
          />

          <PlatformManagementModal
            show={showPlatformModal}
            onHide={() => setShowPlatformModal(false)}
          />

{/* Cleaner Main Modal */}
        {/* Manage services & profile modal */}
        <ManageServicesModal
          show={showModal}
          onHide={() => setShowModal(false)}
          profile={profile}
          tempProfile={tempProfile}
          setTempProfile={setTempProfile}
          previewImageUrl={previewImageUrl}
          services={services}
          newService={newService}
          setNewService={setNewService}
          handleAddService={handleAddService}
          handleDeleteService={handleDeleteService}
          handleSaveAll={handleSaveAll}
          preferences={preferences}
          setPreferences={setPreferences}
        />
        {/* Cleaner Job request Modal */}
        <JobRequestsModal
          show={showRequestsModal}
          onHide={() => setShowRequestsModal(false)}
          requests={requests}
          setSelectedRequest={setSelectedRequest}
          setShowJobDetailsModal={setShowJobDetailsModal}
        />
        {/* Cleaner Job Details Modal */}
        <JobDetailsModal
          show={showJobDetailsModal}
          onHide={() => setShowJobDetailsModal(false)}
          selectedRequest={selectedRequest}
          handleAcceptRequest={handleAcceptRequest}
          handleDeclineRequest={handleDeclineRequest}
        />

        {/* Cleaner Payment tracking */}
        <CleanerPaymentsModal
          show={showCleanerPaymentsModal}
          onHide={() => setShowCleanerPaymentsModal(false)}
          cleanerPayments={cleanerPayments}
        />

      {/*Cleaner Wallets*/}
      <CleanerWalletModal
        show={showCleanerWalletModal}
        onHide={() => setShowCleanerWalletModal(false)}
        cleanerWalletBalance={cleanerWalletBalance}
        onWithdraw={handleCleanerWithdraw}
      />

      {/*Schedule For Cleaner modal */}
      <ScheduleModal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        acceptedJobs={acceptedJobs}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        filteredJobs={filteredJobs}
        markJobAsCompleted={markJobAsCompleted}
      />

       {/*Cleaner modal notification*/}
     <NotificationModal
      show={showCleanerNotificationModal}
      onHide={() => setShowCleanerNotificationModal(false)}
      notifications={cleanerNotifications}
      setNotifications={setCleanerNotifications}
    />




{/* Homeowner Main Modal */}
    {/* Search Cleaner Modal */}
    <SearchCleanerModal
      show={showCleanerModal}
      onHide={() => setShowCleanerModal(false)}
      cleaners={cleaners}
      fetchCleanerReviews={fetchCleanerReviews}
      handleViewProfile={handleViewProfile}
    />
    {/* Cleaner Profile Modal */}
    <CleanerProfileModal
      show={showProfileModal}
      onHide={() => setShowProfileModal(false)} 
      selectedCleaner={selectedCleaner}
      selectedServiceName={selectedServiceName}
      selectedServicePrice={selectedServicePrice}
      setSelectedServiceName={setSelectedServiceName}
      setSelectedServicePrice={setSelectedServicePrice}
      selectedLocation={selectedLocation}
      setSelectedLocation={setSelectedLocation}
      selectedDatetime={selectedDatetime}
      setSelectedDatetime={setSelectedDatetime}
      userId={userId}
      isFavourite={isFavourite}
      setIsFavourite={setIsFavourite}
      handleBookCleaner={handleBookCleaner}
    />


    {/* favourites modal for HomeOwner */}
    <FavouritesModal
      show={showFavouritesModal}
      onHide={() => setShowFavouritesModal(false)}
      favourites={favourites}
      handleViewProfile={handleViewProfile}
    />

    {/*viewBookings modal for homeowner */}
    <ViewBookings
      show={showAcceptedModal}
      onHide={() => setShowAcceptedModal(false)}
      acceptedBookings={acceptedBookings}
      handlePayCleaner={handlePayCleaner}
      setSelectedJob={setSelectedJob}
      setShowRatingModal={setShowRatingModal}
    />
    {/*Homeowner Wallet modal */}
    <WalletModal
      show={showWalletModal}
      onHide={() => setShowWalletModal(false)}
      walletBalance={walletBalance}
      topUpAmount={topUpAmount}
      setTopUpAmount={setTopUpAmount}
      handleTopUp={handleTopUp}
    />
    {/* homeowner Preferences Modal */}
    <PreferencesModal
      show={showPreferencesModal}
      onHide={() => setShowPreferencesModal(false)}
      preferences={preferences}
      setPreferences={setPreferences}
      savePreferences={savePreferences}
    />
    {/* Show ratings for Cleaner*/}
    <RateCleanerModal
      show={showRatingModal}
      onClose={() => setShowRatingModal(false)}
      selectedJob={selectedJob}
      onSubmit={rateCleaner}
    />
    {/* Show cleaner reviews*/}
    <ReviewsModal
      show={showReviewsModal}
      onHide={() => setShowReviewsModal(false)}
      selectedCleanerReviews={selectedCleanerReviews}
    />

    {/* homeowner past purchases history*/}
    <ServiceHistoryModal
      show={showServiceHistory}
      onHide={() => setShowServiceHistory(false)}
      completedBookings={completedBookings}
    />
    {/* homeowner notification Modal*/}
    <NotificationModal
      show={showNotificationModal}
      onHide={() => setShowNotificationModal(false)}
      notifications={notifications}
      setNotifications={setNotifications}
    />





    </div>
  );
};

export default Dashboard;
