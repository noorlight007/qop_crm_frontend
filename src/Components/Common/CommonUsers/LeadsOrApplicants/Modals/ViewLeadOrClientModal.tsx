import { ViewLeadOrClientModalProps } from "@/Types/Common/CommonUsers/LeadsOrApplicantsTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { FileText, Mail, Phone, TrendingUp, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewLeadOrClientModal: React.FC<ViewLeadOrClientModalProps> = ({
  isOpen,
  toggle,
  selectedLeadOrClient,
}) => {
  if (!selectedLeadOrClient) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">User Information</span>
      </ModalHeader>
      <ModalBody
        className="p-0"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedLeadOrClient?.profile_image ? (
              <Image
                src={selectedLeadOrClient.profile_image}
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
            {selectedLeadOrClient?.title
              ? formatChoiceFieldValue(selectedLeadOrClient.title) + " "
              : ""}
            {selectedLeadOrClient?.first_name}{" "}
            {selectedLeadOrClient?.middle_name &&
              selectedLeadOrClient?.middle_name + " "}
            {selectedLeadOrClient?.last_name}
          </h4>

          <div>
            <Badge pill className="px-3 py-2 bg-light-primary">
              👤 {selectedLeadOrClient.is_lead === true ? "Lead" : "Client"}
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
                      {selectedLeadOrClient?.email ? (
                        <span className="text-primary">
                          {selectedLeadOrClient.email}
                        </span>
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
                      {selectedLeadOrClient?.phone ? (
                        <span className="text-primary text-decoration-none">
                          {selectedLeadOrClient.phone}
                        </span>
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
                    {selectedLeadOrClient?.source === "OTHER"
                      ? selectedLeadOrClient?.other_source || "-"
                      : selectedLeadOrClient?.source
                        ? formatChoiceFieldValue(selectedLeadOrClient.source)
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
                    {selectedLeadOrClient?.enquiry_type === "OTHER"
                      ? selectedLeadOrClient?.other_enquiry_type || "-"
                      : selectedLeadOrClient?.enquiry_type
                        ? formatChoiceFieldValue(
                            selectedLeadOrClient.enquiry_type,
                          )
                        : "-"}
                  </p>
                </div>
              </Col>
            </Row>
          </div>

          <hr className="my-3" />

          {/* Notes */}
          {selectedLeadOrClient?.note && (
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
                    className="m-0 text-dark text-capitalize"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {selectedLeadOrClient?.note}
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
            {selectedLeadOrClient?.created_by ? (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>{selectedLeadOrClient.created_by.name}</strong>
                </p>
                <small className="text-muted">
                  (
                  {selectedLeadOrClient.created_by.user_type
                    ? formatChoiceFieldValue(
                        selectedLeadOrClient.created_by.user_type,
                      )
                    : ""}
                  )
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
                {selectedLeadOrClient?.created_at &&
                formatDateAndTime(selectedLeadOrClient?.created_at)
                  ? formatDateAndTime(selectedLeadOrClient?.created_at)
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
