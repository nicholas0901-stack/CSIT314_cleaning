import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ManageServicesModal = ({
  show,
  onHide,
  profile,
  tempProfile,
  setTempProfile,
  previewImageUrl,
  services,
  newService,
  setNewService,
  handleAddService,
  handleDeleteService,
  handleSaveAll,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Manage Your Services & Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted mb-4">
          Easily manage your cleaning services, skills, experience, and work preferences.
        </p>

        {(previewImageUrl || tempProfile?.image_path) && (
          <div className="text-center mb-4">
            <img
              src={previewImageUrl || `http://localhost:5000/${tempProfile.image_path}`}
              alt="Cleaner Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "http://localhost:5000/images/default.jpg";
              }}
              style={{
                width: "380px",
                height: "500px",
                objectFit: "cover",
                border: "2px solid #dee2e6",
              }}
            />
          </div>
        )}

        <Form onSubmit={handleSaveAll}>
          <h5 className="fw-bold mb-3">Your Profile Details</h5>

          <div className="mb-4">
            <p><strong>Bio:</strong> {profile.skills || "No bio yet."}</p>
            <p><strong>Experience:</strong> {profile.experience ? `${profile.experience} years` : "No experience yet."}</p>
            <p><strong>Preferred Areas:</strong> {profile.preferred_areas || "No preferred areas yet."}</p>
            <p><strong>Availability:</strong> {profile.availability || "No availability set."}</p>
          </div>

          <hr className="my-4" />

          <h5 className="fw-bold mb-3">Your Services</h5>
          {services.length > 0 ? (
            <table className="table table-bordered shadow-sm mb-4">
              <thead className="table-light">
                <tr>
                  <th>Service Name</th>
                  <th>Price ($)</th>
                  <th style={{ width: "150px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.service_name}</td>
                    <td>${service.price}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info mb-4">
              No services added yet. Start by adding your first service below!
            </div>
          )}

          <h6 className="fw-bold mb-3">Add New Service</h6>
          <div className="row align-items-end mb-4">
            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Deep Cleaning"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </Form.Group>
            </div>

            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 120"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </Form.Group>
            </div>

            <div className="col-md-2 d-grid">
              <Button variant="success" type="button" onClick={handleAddService}>
                + Add
              </Button>
            </div>
          </div>

          <hr className="my-4" />
          <h5 className="fw-bold mb-3">Edit Your Profile</h5>

          <Form.Group className="mb-3">
            <Form.Label>Upload Profile Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setTempProfile((prev) => ({
                  ...prev,
                  imageFile: file,
                }));
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="e.g. Experienced in residential cleaning, passionate about customer satisfaction."
              value={tempProfile.skills || ""}
              onChange={(e) => setTempProfile({ ...tempProfile, skills: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Experience (Years)</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 3"
              value={tempProfile.experience || ""}
              onChange={(e) => setTempProfile({ ...tempProfile, experience: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Preferred Area</Form.Label>
            <Form.Select
                value={tempProfile.preferred_areas || ""}
                onChange={(e) => setTempProfile({ ...tempProfile, preferred_areas: e.target.value })}
              >
              <option value="">-- Select Area --</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Availability</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="e.g. Weekdays 9am-6pm, Saturday mornings"
              value={tempProfile.availability || ""}
              onChange={(e) => setTempProfile({ ...tempProfile, availability: e.target.value })}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary">
              Save Profile Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManageServicesModal;
