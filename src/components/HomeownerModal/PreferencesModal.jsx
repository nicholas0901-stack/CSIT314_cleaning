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
        {/* Preferred Minimum Rating */}
          <Form.Group className="mt-3">
            <Form.Label>Minimum Cleaner Rating</Form.Label>
            <Form.Select
              value={preferences.minimum_rating || 0}
              onChange={(e) =>
                setPreferences({ ...preferences, minimum_rating: parseFloat(e.target.value) })
              }
            >
              <option value={0}>No preference</option>
              <option value={5}>5 stars</option>
              <option value={4}>4 stars & up</option>
              <option value={3}>3 stars & up</option>
              <option value={2}>2 stars & up</option>
              <option value={1}>1 star & up</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Price Range</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="number"
                placeholder="Min"
                value={preferences.min_price || ""}
                onChange={(e) =>
                  setPreferences({ ...preferences, min_price: e.target.value })
                }
              />
              <Form.Control
                type="number"
                placeholder="Max"
                value={preferences.max_price || ""}
                onChange={(e) =>
                  setPreferences({ ...preferences, max_price: e.target.value })
                }
              />
            </div>
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
