import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";

const ManageUsersModal = ({
  showUserModal,
  setShowUserModal,
  users,
  newUser,
  setNewUser,
  userError,
  setUserError,
  fetchUsers,
  showEditModal,
  setShowEditModal,
  editingUser,
  setEditingUser,
  editPassword,
  setEditPassword,
  editRole,
  setEditRole
}) => {
  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setUserError("All fields are required.");
      return;
    }

    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchUsers();
          setNewUser({ name: "", email: "", password: "", role: "Cleaner" });
          setUserError("");
        } else {
          setUserError("Failed to create user.");
        }
      });
  };

  const handleSaveChanges = () => {
    const updateData = { role: editRole };
    if (editPassword) updateData.password = editPassword;

    fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchUsers();
          setShowEditModal(false);
          setEditingUser(null);
          setEditPassword("");
          toast.success('Saved Changes');
        } else {
          toast.error('Failed to modify user.');
        }
      });
  };

  return (
    <>
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage User Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">Create, modify, or remove user accounts below.</p>

          <table className="table table-bordered shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditingUser(user);
                        setEditRole(user.role);
                        setEditPassword("");
                        setShowEditModal(true);
                      }}
                    >
                      Modify
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        fetch(`http://localhost:5000/api/users/${user.id}`, {
                          method: 'DELETE'
                        })
                          .then(res => res.json())
                          .then(data => {
                            if (data.success) {
                              fetchUsers();
                              toast.success('Deleted User');
                            } else {
                              toast.error('Failed to delete user.');
                            }
                          });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="my-4" />
          {userError && <p className="text-danger">{userError}</p>}

          <h5 className="fw-bold">Create New User</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Alice Tan"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="e.g. alice@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter temporary password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option>Cleaner</option>
                <option>Homeowner</option>
                <option>Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="success" className="mt-2" onClick={handleCreateUser}>
              Create User
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modify User: {editingUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Role</Form.Label>
              <Form.Select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option>Cleaner</option>
                <option>Homeowner</option>
                <option>Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageUsersModal;
