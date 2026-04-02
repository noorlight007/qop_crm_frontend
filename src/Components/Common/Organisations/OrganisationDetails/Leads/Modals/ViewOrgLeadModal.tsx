import { ViewOrgLeadModalProps } from "@/Types/Network/Director/Users/Organisations/OrgLeadTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { FileText, Mail, Phone, TrendingUp, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewOrgLeadModal: React.FC<ViewOrgLeadModalProps> = ({
  isOpen,
  toggle,
  selectedLead,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">Lead Information</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedLead?.profile_image ? (
              <Image
                src={selectedLead.profile_image}
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
          <h4 className="mb-1 text-dark fw-bold">{selectedLead?.name}</h4>
          <p>
            <Badge pill className="px-3 py-2 bg-light-primary">
              👤 Lead
            </Badge>
          </p>
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
                      {selectedLead?.email || "-"}
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
                      {selectedLead?.phone ? (
                        <span className="text-decoration-none">
                          {selectedLead.phone}
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
                    {selectedLead?.source ? (
                      formatChoiceFieldValue(selectedLead.source)
                    ) : (
                      <small className="text-muted">Not Found</small>
                    )}
                  </p>
                </div>
              </Col>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">
                    Enquiry Type
                  </small>
                  <p className="m-0 text-dark fw-500">
                    {selectedLead?.enquiry_type ? (
                      formatChoiceFieldValue(selectedLead.enquiry_type)
                    ) : (
                      <small className="text-muted">Not Available</small>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
            {(selectedLead?.other_source ||
              selectedLead?.other_enquiry_type) && (
              <Row>
                {selectedLead?.other_source && (
                  <Col md="6" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Other Source
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedLead.other_source}
                      </p>
                    </div>
                  </Col>
                )}
                {selectedLead?.other_enquiry_type && (
                  <Col md="6" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Other Enquiry Type
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedLead.other_enquiry_type}
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            )}
          </div>

          <hr className="my-3" />

          {/* Notes */}
          {selectedLead?.note && (
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
                    {selectedLead.note}
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
            {selectedLead?.created_by ? (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>
                    {selectedLead.created_by.title
                      ? formatChoiceFieldValue(
                          selectedLead.created_by.title,
                        ).trim() + " "
                      : ""}
                    {selectedLead.created_by.first_name}{" "}
                    {selectedLead.created_by.middle_name}{" "}
                    {selectedLead.created_by.last_name}
                  </strong>
                </p>
                <small className="text-muted">
                  {selectedLead.created_by.user_type
                    ? formatChoiceFieldValue(selectedLead.created_by.user_type)
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

export default ViewOrgLeadModal;
