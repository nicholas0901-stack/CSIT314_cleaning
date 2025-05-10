import React from "react";
import { Modal, Button } from "react-bootstrap";

const ServiceHistoryModal = ({ show, onHide, completedBookings }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Used Services</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {completedBookings.length > 0 ? (
          <table className="table table-bordered shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Cleaner</th>
                <th>Service</th>
                <th>Paid</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.map((job) => (
                <tr key={job.id}>
                  <td>{job.cleaner_name}</td>
                  <td>{job.service_name}</td>
                  <td>${job.price}</td>
                  <td>{job.appointment_datetime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No completed services yet.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ServiceHistoryModal;
