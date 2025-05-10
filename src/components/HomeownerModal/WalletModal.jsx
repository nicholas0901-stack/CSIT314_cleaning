import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const WalletModal = ({
  show,
  onHide,
  walletBalance,
  topUpAmount,
  setTopUpAmount,
  handleTopUp,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>My Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">
          Current Balance: ${walletBalance.toFixed(2)}
        </p>
        <Form>
          <Form.Group>
            <Form.Label>Top-Up Amount ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              min={1}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleTopUp}>
          Top Up
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WalletModal;
