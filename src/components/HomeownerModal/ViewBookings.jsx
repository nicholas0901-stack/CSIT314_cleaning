
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ViewBookings = ({
  show,
  onHide,
  acceptedBookings,
  handlePayCleaner,
  setSelectedJob,
  setShowRatingModal,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Confirmed Jobs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">
          These jobs have been accepted by your selected cleaners.
        </p>
        <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered align-middle w-100">
    <thead className="table-light">
      <tr>
        <th>Cleaner</th>
        <th>Service</th>
        <th>Price</th>
        <th>Location</th>
        <th>Date & Time</th>
        <th>Payment</th>
        <th>Rating</th>
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
            <td style={{ whiteSpace: "nowrap" }}>
              {new Date(job.appointment_datetime).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
              })}
            </td>
            <td>
              {job.is_paid ? (
                <span className="text-success">Paid</span>
              ) : job.completed ? (
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handlePayCleaner(job)}
                >
                  Pay Now
                </Button>
              ) : (
                <span className="text-muted">In-progress</span>
              )}
            </td>
            <td className="text-center align-middle">
              {job.completed && !job.rating ? (
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowRatingModal(true);
                  }}
                >
                  Rate Cleaner
                </Button>
              ) : job.rating ? (
                <span className="text-muted">{job.rating}★</span>
              ) : (
                "-"
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center">
            No accepted jobs yet.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewBookings;
