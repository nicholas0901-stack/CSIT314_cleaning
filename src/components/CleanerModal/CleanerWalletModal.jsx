import React from "react";
import { Modal, Button } from "react-bootstrap";

const CleanerWalletModal = ({ show, onHide, cleanerWalletBalance }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>My Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="fs-5">
          Total Balance: <strong>${cleanerWalletBalance.toFixed(2)}</strong>
        </p>
        <p className="text-muted">
          This reflects your total earnings available for withdrawal.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CleanerWalletModal;
