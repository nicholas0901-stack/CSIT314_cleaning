import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CleanerWalletModal = ({ 
  show, 
  onHide, 
  cleanerWalletBalance, 
  onWithdraw 
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');

  const handleWithdrawChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setError("Amount cannot be negative.");
    } else {
      setError('');
    }
    setWithdrawAmount(value);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount to withdraw.');
    } else if (amount > cleanerWalletBalance) {
      setError('Withdrawal amount exceeds balance.');
    } else {
      // Call the parent onWithdraw function (which would trigger API or logic to process the withdrawal)
      onWithdraw(amount);
      setWithdrawAmount('');  // Reset input after withdrawal
      onHide();  // Close the modal after withdrawal
    }
  };

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
        
        <Form.Group controlId="withdrawAmount">
          <Form.Label>Amount to Withdraw</Form.Label>
          <Form.Control 
            type="number" 
            placeholder="Enter amount" 
            value={withdrawAmount} 
            onChange={handleWithdrawChange} 
          />
          {error && <p className="text-danger mt-2">{error}</p>}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CleanerWalletModal;
