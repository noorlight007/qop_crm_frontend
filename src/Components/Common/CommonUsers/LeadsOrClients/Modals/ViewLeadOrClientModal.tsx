import { ViewLeadsOrClientsModalProps } from "@/Types/Common/CommonUsers/LeadsOrClientsTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { FileText, Mail, Phone, TrendingUp, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewLeadOrClientModal: React.FC<ViewLeadsOrClientsModalProps> = ({
  isOpen,
  toggle,
  selectedLeadsOrClients,
}) => {
  if (!selectedLeadsOrClients) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">Lead Information</span>
      </ModalHeader>
      <ModalBody
        className="p-0"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedLeadsOrClients?.profile_image ? (
              <Image
                src={selectedLeadsOrClients.profile_image}
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
          <h4 className="mb-1 text-dark fw-bold">
            {selectedLeadsOrClients?.title
              ? formatChoiceFieldValue(selectedLeadsOrClients.title) + ". "
              : ""}
            {selectedLeadsOrClients?.first_name}{" "}
            {selectedLeadsOrClients?.middle_name &&
              selectedLeadsOrClients?.middle_name + " "}
            {selectedLeadsOrClients?.last_name}
          </h4>

          <div>
            <Badge pill className="px-3 py-2 bg-light-primary">
              👤 {formatChoiceFieldValue(selectedLeadsOrClients.role)}
            </Badge>
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
                      {selectedLeadsOrClients?.email ? (
                        <a
                          href={`mailto:${selectedLeadsOrClients.email}`}
                          className="text-decoration-none"
                        >
                          {selectedLeadsOrClients.email}
                        </a>
                      ) : (
                        "-"
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
                      {selectedLeadsOrClients?.phone ? (
                        <a
                          href={`tel:${selectedLeadsOrClients.phone}`}
                          className="text-decoration-none"
                        >
                          {selectedLeadsOrClients.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <hr className="my-3" />

          {/* Lead Details */}
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              <TrendingUp
                size={14}
                className="me-2"
                style={{ display: "inline" }}
              />
              Lead Details
            </h6>
            <Row>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">Source</small>
                  <p className="m-0 text-dark fw-500">
                    {selectedLeadsOrClients?.source === "OTHER"
                      ? selectedLeadsOrClients?.other_source || "-"
                      : selectedLeadsOrClients?.source
                        ? formatChoiceFieldValue(selectedLeadsOrClients.source)
                        : "-"}
                  </p>
                </div>
              </Col>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">
                    Enquiry Type
                  </small>
                  <p className="m-0 text-dark fw-500">
                    {selectedLeadsOrClients?.enquiry_type === "OTHER"
                      ? selectedLeadsOrClients?.other_enquiry_type || "-"
                      : selectedLeadsOrClients?.enquiry_type
                        ? formatChoiceFieldValue(
                            selectedLeadsOrClients.enquiry_type,
                          )
                        : "-"}
                  </p>
                </div>
              </Col>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">User Type</small>
                  <p className="m-0 text-dark fw-500">
                    {selectedLeadsOrClients?.role
                      ? formatChoiceFieldValue(selectedLeadsOrClients.role)
                      : "-"}
                  </p>
                </div>
              </Col>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">Role</small>
                  <p className="m-0 text-dark fw-500">
                    {selectedLeadsOrClients?.role
                      ? formatChoiceFieldValue(selectedLeadsOrClients.role)
                      : "-"}
                  </p>
                </div>
              </Col>
            </Row>
          </div>

          <hr className="my-3" />

          {/* Notes */}
          {selectedLeadsOrClients?.note && (
            <>
              <div className="mb-4">
                <h6
                  className="text-uppercase fw-bold text-primary mb-3"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  <FileText
                    size={14}
                    className="me-2"
                    style={{ display: "inline" }}
                  />
                  Notes
                </h6>
                <div
                  className="p-3 bg-light rounded"
                  style={{ borderLeft: "3px solid #0d6efd" }}
                >
                  <p
                    className="m-0 text-dark"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {selectedLeadsOrClients?.note}
                  </p>
                </div>
              </div>

              <hr className="my-3" />
            </>
          )}

          {/* Metadata */}
          <div>
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Additional Information
            </h6>
            {selectedLeadsOrClients?.created_by ? (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>{selectedLeadsOrClients.created_by.name}</strong>
                </p>
                <small className="text-muted">
                  {selectedLeadsOrClients.created_by.user_type
                    ? formatChoiceFieldValue(
                        selectedLeadsOrClients.created_by.user_type,
                      )
                    : ""}
                </small>
              </div>
            ) : (
              <div
                className="mb-3 p-3 bg-light rounded"
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
            <div className="mb-3 p-3 bg-light rounded">
              <small className="text-muted d-block fw-500 mb-2">
                Created At
              </small>
              <p className="m-0 text-dark fw-500">
                {selectedLeadsOrClients?.created_at &&
                formatDateAndTime(selectedLeadsOrClients?.created_at)
                  ? formatDateAndTime(selectedLeadsOrClients?.created_at)
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewLeadOrClientModal;
