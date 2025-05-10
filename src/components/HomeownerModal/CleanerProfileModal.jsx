import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";

const CleanerProfileModal = ({
  show,
  onHide, // ✅ use onHide instead of onClose
  selectedCleaner,
  selectedServiceName,
  setSelectedServiceName,
  selectedServicePrice,
  setSelectedServicePrice,
  selectedLocation,
  setSelectedLocation,
  selectedDatetime,
  setSelectedDatetime,
  userId,
  isFavourite,
  setIsFavourite,
  handleBookCleaner
}) => {
  const handleFavourite = async () => {
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
        const message = data.action === "added"
          ? "Cleaner added to your favourites!"
          : "Cleaner removed from your favourites.";
        toast.success(message);
        setIsFavourite(data.action === "added");
      } else {
        toast.error("Failed to update favourites.");
      }
    } catch (err) {
      console.error("Favourite error:", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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
                        <p className="card-text"><strong>Price:</strong> ${service.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No services listed yet.</p>
            )}

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
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button
          style={{
            backgroundColor: "#ffc107",
            color: "#000",
            border: "1px solid #ffc107"
          }}
          className="me-2"
          onClick={handleFavourite}
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
  );
};

export default CleanerProfileModal;