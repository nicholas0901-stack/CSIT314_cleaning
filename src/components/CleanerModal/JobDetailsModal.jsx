import React from "react";
import { Modal, Button } from "react-bootstrap";

const JobDetailsModal = ({
  show,
  onHide,
  selectedRequest,
  handleAcceptRequest,
  handleDeclineRequest,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
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
                onHide();
              }}
            >
              Accept
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => {
                handleDeclineRequest(selectedRequest.id);
                onHide();
              }}
            >
              Decline
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobDetailsModal;