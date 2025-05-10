import React from "react";
import { Modal } from "react-bootstrap";

const ReviewsModal = ({ show, onHide, cleanerName, selectedCleanerReviews }) => {
    return (
      <Modal show={show} onHide={onHide} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>
            {cleanerName ? `${cleanerName}'s Reviews` : "Cleaner Reviews"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCleanerReviews?.length > 0 ? (
            selectedCleanerReviews.map((review, idx) => (
              <div key={idx} className="border rounded p-2 mb-2">
                <strong>{review.reviewer_name}</strong> ({review.rating}★)
                <p className="mb-1 text-muted">{new Date(review.created_at).toLocaleString()}</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-muted text-center">No reviews available for this cleaner yet.</p>
          )}
        </Modal.Body>
      </Modal>
    );
  };
  

export default ReviewsModal;
