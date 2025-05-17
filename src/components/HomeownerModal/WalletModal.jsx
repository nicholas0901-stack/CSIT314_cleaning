import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const WalletModal = ({
  show,
  onHide,
  walletBalance,
  topUpAmount,
  setTopUpAmount,
  handleTopUp,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const paymentOptions = [
    { key: "credit", label: "Credit Card" },
    { key: "paypal", label: "PayPal" },
  ];

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100 text-primary  fw-bold">
          Top Up Your Wallet
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Payment Method Selection */}
        <div className="text-center text-primary  mb-4">
          <h6 className="text-primary fw-bold mb-3">Select Payment Method</h6>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {paymentOptions.map((opt) => (
              <div
                key={opt.key}
                className={`px-3 py-2 border rounded text-center cursor-pointer ${
                  paymentMethod === opt.key
                    ? "border-success bg-light"
                    : "bg-white"
                }`}
                style={{ minWidth: "120px", cursor: "pointer" }}
                onClick={() => setPaymentMethod(opt.key)}
              >
                <i className="bi bi-credit-card-2-front mb-1"></i>
                <div className="fw-semibold">{opt.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="mb-3">
          <h6 className="text-primary  fw-bold border-bottom pb-1">
            Personal Information
          </h6>
          <Form.Group className="mt-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="e.g. johndoe@email.com" />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="e.g. John" />
          </Form.Group>
        </div>

        {/* Conditional Payment Info */}
        {paymentMethod === "credit" && (
          <div className="mb-3">
            <h6 className="text-primary  fw-bold border-bottom pb-1">
              Credit Card Info
            </h6>
            <Form.Group className="mt-2">
              <Form.Label>Name on Card</Form.Label>
              <Form.Control type="text" placeholder="e.g. John Doe" />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="0000-0000-0000-0000"
                maxLength={19}
              />
            </Form.Group>
            <Row className="mt-2">
              <Col>
                <Form.Label>Expiration</Form.Label>
                <Form.Control type="text" placeholder="MM/YY" maxLength={5} />
              </Col>
              <Col>
                <Form.Label>CVV Number</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="123"
                  maxLength={4}
                />
              </Col>
            </Row>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="mb-3">
            <h6 className="text-primary  fw-bold border-bottom pb-1">
              PayPal Info
            </h6>
            <Form.Group className="mt-2">
              <Form.Label>PayPal Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="e.g. paypal@example.com"
              />
            </Form.Group>
          </div>
        )}

        {/* Top-Up Amount */}
        <div className="mb-3">
          <h6 className="text-primary  fw-bold border-bottom pb-1">
            Top-Up Amount
          </h6>
          <Form.Group>
            <Form.Label>Amount ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 50"
              value={topUpAmount}
              min={1}
              onChange={(e) => setTopUpAmount(e.target.value)}
            />
          </Form.Group>
        </div>

        <div className="text-muted text-end">
          Current Wallet Balance:{" "}
          <strong>${walletBalance.toFixed(2)}</strong>
          {topUpAmount > 0 && (
            <div className="text-success">
              New Balance: $
              {(walletBalance + parseFloat(topUpAmount || 0)).toFixed(2)}
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
  <Button variant="outline-primary" onClick={onHide}>
    Cancel
  </Button>
  <Button variant="outline-primary" onClick={handleTopUp}>
    {paymentMethod === "paypal" ? "Pay with PayPal" : "💳 Submit Payment"}
  </Button>
</Modal.Footer>

    </Modal>
  );
};

export default WalletModal;
