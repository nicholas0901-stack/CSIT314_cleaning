import React from "react";
import { Modal, Button } from "react-bootstrap";

const CleanerPaymentsModal = ({ show, onHide, cleanerPayments }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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
                  <td>
                    {new Date(pmt.created_at).toLocaleString("en-SG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Singapore",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No payments recorded yet.</p>
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

export default CleanerPaymentsModal;
