import { ViewOrgAdminModalProps } from "@/Types/Network/Director/Users/Organisations/OrgAdminTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { Mail, Phone, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewOrgAdminModal: React.FC<ViewOrgAdminModalProps> = ({
  isOpen,
  toggle,
  selectedAdmin,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">Admin Information</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedAdmin?.profile_image ? (
              <Image
                src={selectedAdmin.profile_image}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-circle shadow-sm"
                style={{ border: "3px solid #fff" }}
              />
            ) : (
              <div
                className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm mx-auto"
                style={{ width: "120px", height: "120px" }}
              >
                <User size={60} className="text-primary" />
              </div>
            )}
          </div>
          <h4 className="mb-1 text-dark fw-bold">{selectedAdmin?.name}</h4>
          <p className="mb-2 text-muted small">
            {selectedAdmin?.role
              ? formatChoiceFieldValue(selectedAdmin.role)
              : "Admin"}
          </p>

          <div className="d-flex justify-content-center gap-2">
            <p>
              <Badge pill className="px-3 py-2 bg-light-primary">
                👤 {formatChoiceFieldValue(selectedAdmin?.role)}
              </Badge>
            </p>
            <p>
              {selectedAdmin?.is_active ? (
                <Badge pill className="px-3 py-2 bg-light-success">
                  ✓ Approved
                </Badge>
              ) : (
                <Badge pill className="px-3 py-2 bg-light-danger">
                  ⏳ Pending
                </Badge>
              )}
            </p>
          </div>
        </div>

        <div className="p-4">
          {/* Contact Information */}
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Contact Information
            </h6>
            <Row>
              <Col md="6" className="mb-3">
                <div className="d-flex align-items-start">
                  <Mail size={18} className="text-primary mt-1 me-2" />
                  <div>
                    <small className="text-muted d-block">Email</small>
                    <p className="m-0 text-dark">
                      {selectedAdmin?.email ? (
                        selectedAdmin.email
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </p>
                  </div>
                </div>
              </Col>
              <Col md="6" className="mb-3">
                <div className="d-flex align-items-start">
                  <Phone size={18} className="text-primary mt-1 me-2" />
                  <div>
                    <small className="text-muted d-block">Phone</small>
                    <p className="m-0 text-dark">
                      {selectedAdmin?.phone ? (
                        <a
                          href={`tel:${selectedAdmin.phone}`}
                          className="text-decoration-none"
                        >
                          {selectedAdmin.phone}
                        </a>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <hr className="my-3" />

          {/* Personal Details */}
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Personal Details
            </h6>
            <Row>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">Gender</small>
                  <p className="m-0 text-dark fw-500">
                    {selectedAdmin?.gender ? (
                      formatChoiceFieldValue(selectedAdmin.gender)
                    ) : (
                      <small className="text-muted">Not Available</small>
                    )}
                  </p>
                </div>
              </Col>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">
                    Joining Date
                  </small>
                  <p className="m-0 text-dark fw-500">
                    {selectedAdmin?.joining_date ? (
                      selectedAdmin.joining_date
                    ) : (
                      <small className="text-muted">Not Available</small>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
          </div>

          <hr className="my-3" />

          {/* Metadata */}
          <div>
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Additional Information
            </h6>
            {selectedAdmin?.created_by ? (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>
                    {selectedAdmin.created_by.title
                      ? formatChoiceFieldValue(
                          selectedAdmin.created_by.title,
                        ).trim() + " "
                      : ""}
                    {selectedAdmin.created_by.first_name}{" "}
                    {selectedAdmin.created_by.middle_name}{" "}
                    {selectedAdmin.created_by.last_name}
                  </strong>
                </p>
                <small className="text-muted">
                  {selectedAdmin.created_by.user_type
                    ? formatChoiceFieldValue(selectedAdmin.created_by.user_type)
                    : ""}
                </small>
              </div>
            ) : (
              <div
                className="mb-3 p-3 bg-light rounded border-left"
                style={{ borderLeft: "3px solid #ffc107" }}
              >
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-muted fst-italic">
                  No creator information available
                </p>
              </div>
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewOrgAdminModal;
