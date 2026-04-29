import { ViewOrgApplicantModalProps } from "@/Types/Common/Organisations/OrgApplicantType";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { FileText, Mail, Phone, User } from "react-feather";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewOrgApplicantModal: React.FC<ViewOrgApplicantModalProps> = ({
  isOpen,
  toggle,
  selectedApplicant,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">Applicant Information</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedApplicant?.profile_image ? (
              <Image
                src={selectedApplicant.profile_image}
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
          <h4 className="mb-1 text-dark fw-bold">{selectedApplicant?.name}</h4>
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
                      {selectedApplicant?.email || "-"}
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
                      {selectedApplicant?.phone ? (
                        <span className="text-decoration-none">
                          {selectedApplicant?.phone}
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

          {/* Applicant Details */}
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Applicant Details
            </h6>
            <Row>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">Source</small>
                  <p className="m-0 text-dark fw-500">
                    {selectedApplicant?.source ? (
                      formatChoiceFieldValue(selectedApplicant.source)
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
                    {selectedApplicant?.enquiry_type ? (
                      formatChoiceFieldValue(selectedApplicant.enquiry_type)
                    ) : (
                      <small className="text-muted">Not Available</small>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
            {selectedApplicant?.other_source && (
              <Row>
                <Col md="6" className="mb-3">
                  <div>
                    <small className="text-muted d-block fw-500">
                      Other Source
                    </small>
                    <p className="m-0 text-dark fw-500">
                      {selectedApplicant.other_source}
                    </p>
                  </div>
                </Col>
                {selectedApplicant?.other_enquiry_type && (
                  <Col md="6" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Other Enquiry Type
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedApplicant.other_enquiry_type}
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            )}
          </div>

          <hr className="my-3" />

          {/* Notes */}
          {selectedApplicant?.note && (
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
                    {selectedApplicant.note}
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
            {selectedApplicant?.created_by ? (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>
                    {selectedApplicant.created_by.title
                      ? formatChoiceFieldValue(
                          selectedApplicant.created_by.title,
                        ).trim() + " "
                      : ""}
                    {selectedApplicant.created_by.first_name}{" "}
                    {selectedApplicant.created_by.middle_name}{" "}
                    {selectedApplicant.created_by.last_name}
                  </strong>
                </p>
                <small className="text-muted">
                  {selectedApplicant.created_by.email
                    ? formatChoiceFieldValue(
                        selectedApplicant.created_by.email,
                      )
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

export default ViewOrgApplicantModal;
