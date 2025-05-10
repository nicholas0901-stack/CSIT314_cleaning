import React from "react";
import { Modal, Button } from "react-bootstrap";

const AvailableCleanersModal = ({
  show,
  onClose,
  cleaners,
  fetchCleanerReviews,
  handleViewProfile
}) => (
  <Modal show={show} onHide={onClose} centered dialogClassName="modal-xl">
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
                  className="card-img-top"
                  alt={`${cleaner.name}'s profile`}
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
                  <p className="card-text d-flex justify-content-center align-items-center">
                    <strong>Rating:</strong>&nbsp;
                    {cleaner.average_rating ? (
                      <>
                        {cleaner.average_rating} ★
                        <Button variant="link" size="sm" className="ms-2 p-0" onClick={() => fetchCleanerReviews(cleaner.id)}>
                          View Reviews
                        </Button>
                      </>
                    ) : "Not rated yet"}
                  </p>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => {
                      onClose();
                      handleViewProfile(cleaner);
                    }}
                  >
                    View Profile
                  </Button>
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
      <Button variant="secondary" onClick={onClose}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default AvailableCleanersModal;
