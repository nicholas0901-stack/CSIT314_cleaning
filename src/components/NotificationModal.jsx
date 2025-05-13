import React from "react";
import { Modal } from "react-bootstrap";

const NotificationModal = ({
  show,
  onHide,
  notifications,
  setNotifications
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <p className="text-muted">No notifications yet.</p>
        ) : (
          <>
            <ul className="list-group">
              {notifications.map((note) => (
                <li
                  key={note.id}
                  className="list-group-item d-flex align-items-start"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  <i className="bi bi-info-circle-fill text-primary me-2 mt-1"></i>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{note.message}</div>
                    <div className="text-muted small">{note.datetime}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Clear All Button */}
            <div className="text-end mt-3">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  setNotifications([]);
                  onHide(); // optionally close the modal
                }}
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default NotificationModal;
