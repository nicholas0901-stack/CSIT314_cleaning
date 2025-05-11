import React from "react";
import { Modal } from "react-bootstrap";

const ReviewsModal = ({ show, onHide, selectedCleanerReviews }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Reviews</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedCleanerReviews?.length > 0 ? (
          selectedCleanerReviews.map((review, idx) => (
            <div key={idx} className="border rounded p-2 mb-2">
              <strong>{review.reviewer_name}</strong> ({review.rating}★)
              <p className="mb-1 text-muted">
                {new Date(review.created_at + 'Z').toLocaleString("en-SG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Singapore"
                })}
              </p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-muted text-center">No reviews available yet.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

  

export default ReviewsModal;
