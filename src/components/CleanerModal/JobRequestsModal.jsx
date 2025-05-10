
import React from "react";
import { Modal, Button } from "react-bootstrap";

const JobRequestsModal = ({
  show,
  onHide,
  requests,
  setSelectedRequest,
  setShowJobDetailsModal
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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
                        onHide(); // hide the modal
                        setShowJobDetailsModal(true); // show details modal
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
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobRequestsModal;
