// Expanded PlatformManagementModal.jsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import toast from "react-hot-toast";

const downloadCSV = (data, filename = "report.csv") => {
  const headers = [
    "Booking ID",
    "Homeowner",
    "Cleaner",
    "Service",
    "Status",
    "Paid",
    "Completed",
    "Review",
    "Rating",
    "Created"
  ];

  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.booking_id,
        `"${row.homeowner_name}"`,
        `"${row.cleaner_name}"`,
        `"${row.service_name}"`,
        row.status,
        `$${row.payment_amount || "0.00"}`,
        row.completed ? "Yes" : "No",
        `"${row.review_comment || "-"}"`,
        row.review_rating || "-",
        new Date(row.created_at).toLocaleString()
      ].join(",")
    )
  ];

  try {
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("CSV downloaded successfully!");
  } catch (err) {
    console.error("CSV download failed:", err);
    toast.error("Failed to download CSV.");
  }
};

const PlatformManagementModal = ({ show, onHide }) => {
  const [reportType, setReportType] = useState("daily");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(true);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ cleaner_id: "", service_name: "", price: "" });

  useEffect(() => {
    if (show) {
      fetchServices();
    }
  }, [show]);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reports?reportType=${reportType}`);
      const data = await res.json();
      if (data.success) {
        setReportData(data.report);
        setShowReport(true);
      }
    } catch (error) {
      console.error("Report generation failed:", error);
      toast.error("Report generation failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/services");
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.success) {
          setServices(data.services);
        } else {
          console.error("Service fetch failed:", data);
        }
      } catch (jsonErr) {
        console.error("Invalid JSON from server:", text);
        toast.error("Invalid JSON from server");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      toast.error("Network or server error");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/cleaner/services/${id}`, { method: "DELETE" });
      fetchServices();
      toast.success("Service deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed");
    }
  };

  const handleUpdateService = async (id, { service_name, price }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cleaner/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_name, price })
      });
      if (res.ok) {
        toast.success("Service updated successfully");
        fetchServices();
      } else {
        toast.error("Failed to update service");
      }
    } catch (err) {
      toast.error("Update request failed");
      console.error("Update failed:", err);
    }
  };

  const handleAddService = async () => {
    const { cleaner_id, service_name, price } = newService;
    if (!cleaner_id || !service_name || price === "") {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cleaner_id, service_name, price })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Service added successfully");
        setNewService({ cleaner_id: "", service_name: "", price: "" });
        fetchServices();
      } else {
        toast.error("Failed to add service");
      }
    } catch (err) {
      toast.error("Error while adding service");
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Platform Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Generate Reports</h5>
        <Form.Group className="mb-3">
          <Form.Label>Select Report Type</Form.Label>
          <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
          </Form.Select>
          <Button
            className="mt-2"
            variant="outline-primary"
            size="sm"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </Form.Group>

        {reportData.length > 0 && (
          <>
            <div className="d-flex justify-content-end gap-2 mb-2">
              <Button variant="secondary" size="sm" onClick={() => setShowReport(!showReport)}>
                {showReport ? "Hide Report" : "Show Report"}
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => downloadCSV(reportData, `${reportType}-report.csv`)}
                disabled={!showReport}
              >
                Download CSV
              </Button>
            </div>

            {showReport && (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Homeowner</th>
                      <th>Cleaner</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Paid</th>
                      <th>Completed</th>
                      <th>Review</th>
                      <th>Rating</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...reportData].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((row, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{row.homeowner_name}</td>
                        <td>{row.cleaner_name}</td>
                        <td>{row.service_name}</td>
                        <td>{row.status}</td>
                        <td>${row.payment_amount || "0.00"}</td>
                        <td>{row.completed ? "Yes" : "No"}</td>
                        <td>{row.review_comment || "-"}</td>
                        <td>{row.review_rating || "-"}</td>
                        <td className="text-center">
                          {new Date(row.created_at + "Z").toLocaleString("en-SG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Singapore"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}

        <hr className="my-4" />

        <h5>Manage All Cleaner Services</h5>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Cleaner ID</th>
              <th>Cleaner Name</th>
              <th>Service Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              services.reduce((acc, svc) => {
                const key = `${svc.cleaner_id}|${svc.cleaner_name}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(svc);
                return acc;
              }, {})
            ).map(([key, serviceGroup], idx) => {
              const [cleaner_id, cleaner_name] = key.split("|");
              return (
                <React.Fragment key={key}>
                  {serviceGroup.map((service, i) => (
                    <tr key={service.id}>
                      {i === 0 && (
                        <>
                          <td rowSpan={serviceGroup.length}>{idx + 1}</td>
                          <td rowSpan={serviceGroup.length}>{cleaner_id}</td>
                          <td rowSpan={serviceGroup.length}>{cleaner_name}</td>
                        </>
                      )}
                      <td>
                        <Form.Control
                          type="text"
                          size="sm"
                          value={service.service_name}
                          onChange={(e) => {
                            const updated = [...services];
                            const target = updated.find((s) => s.id === service.id);
                            if (target) target.service_name = e.target.value;
                            setServices(updated);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          size="sm"
                          value={service.price}
                          onChange={(e) => {
                            const updated = [...services];
                            const target = updated.find((s) => s.id === service.id);
                            if (target) target.price = e.target.value;
                            setServices(updated);
                          }}
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          Delete
                        </Button>{" "}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleUpdateService(service.id, {
                              price: service.price,
                              service_name: service.service_name
                            })
                          }
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>

        <hr className="my-4" />
        <h5>Add New Service for Cleaner</h5>
        <Form className="row align-items-end mb-3">
          <div className="col-md-3">
            <Form.Label>Cleaner</Form.Label>
            <Form.Select
              value={newService.cleaner_id || ""}
              onChange={(e) => setNewService({ ...newService, cleaner_id: e.target.value })}
            >
              <option value="">-- Select Cleaner --</option>
              {[...new Set(services.map(s => `${s.cleaner_id}|${s.cleaner_name}`))]
                .map(key => {
                  const [id, name] = key.split("|");
                  return <option key={id} value={id}>{name}</option>;
                })}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Fridge Cleaning"
              value={newService.service_name || ""}
              onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 100"
              value={newService.price || ""}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <Button className="mt-3" onClick={handleAddService}>+ Add Service</Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlatformManagementModal;