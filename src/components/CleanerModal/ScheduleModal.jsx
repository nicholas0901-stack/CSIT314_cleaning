import React from "react";
import { Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";

const ScheduleModal = ({
  show,
  onHide,
  acceptedJobs,
  selectedDate,
  setSelectedDate,
  filteredJobs,
  markJobAsCompleted
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Accepted Jobs</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {acceptedJobs?.length > 0 ? (
          <>
            <div className="mb-4">
              <h5 className="mb-2">Select Date</h5>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileContent={({ date }) => {
                  const jobExists = acceptedJobs.some(
                    (job) =>
                      new Date(job.appointment_datetime).toDateString() === date.toDateString()
                  );
                  return jobExists ? (
                    <div
                      style={{
                        backgroundColor: "#d4edda",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        textAlign: "center",
                        marginTop: "2px",
                      }}
                    >
                      📅
                    </div>
                  ) : null;
                }}
                
              />
            </div>

            <h6 className="mb-3 text-muted">
              Jobs on {selectedDate.toDateString()}
            </h6>

            {filteredJobs.length > 0 ? (
              <div className="row">
                {filteredJobs.map((job) => (
                  <div className="col-md-6 mb-4" key={job.id}>
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title">{job.service_name}</h5>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p>
                          <strong>Date & Time:</strong>{" "}
                          {job.appointment_datetime
                            ? new Date(job.appointment_datetime).toLocaleString("en-SG", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Singapore",
                              })
                            : "N/A"}
                        </p>
                        <p><strong>Price:</strong> ${job.price}</p>
                        <p><strong>Status:</strong> {job.status}</p>

                        {job.status === "Accepted" && !job.completed && (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => markJobAsCompleted(job.id)}
                          >
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info text-center">
                No jobs scheduled for this date.
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted">No accepted jobs yet.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleModal;
