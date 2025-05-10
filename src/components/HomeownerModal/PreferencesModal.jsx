import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PreferencesModal = ({
  show,
  onHide,
  preferences,
  setPreferences,
  savePreferences,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cleaning Preferences</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Preferred Area Selection */}
        <Form.Group className="mt-3">
          <Form.Label>Preferred Cleaning Area</Form.Label>
          <Form.Select
            value={preferences.preferred_area || ""}
            onChange={(e) =>
              setPreferences({ ...preferences, preferred_area: e.target.value })
            }
          >
            <option value="">-- Select Area --</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </Form.Select>
        </Form.Group>

        {/* Other Notes */}
        <Form.Group className="mt-3">
          <Form.Label>Other Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={preferences.other_notes}
            onChange={(e) =>
              setPreferences({ ...preferences, other_notes: e.target.value })
            }
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={savePreferences}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PreferencesModal;
