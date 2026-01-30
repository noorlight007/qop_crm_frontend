import { ViewOrgClientModalProps } from "@/Types/Network/Director/Users/Organisations/OrgClientType";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { FileText, Mail, Phone, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewOrgClientModal: React.FC<ViewOrgClientModalProps> = ({
  isOpen,
  toggle,
  selectedClient,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">Client Information</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedClient?.profile_image ? (
              <Image
                src={selectedClient.profile_image}
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
          <h4 className="mb-1 text-dark fw-bold">{selectedClient?.name}</h4>
          <p>
            <Badge pill className="px-3 py-2 bg-light-primary">
              👤 {formatChoiceFieldValue(selectedClient?.role)}
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
                      {selectedClient?.email || "-"}
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
                      {selectedClient?.phone ? (
                        <a
                          href={`tel:${selectedClient.phone}`}
                          className="text-decoration-none"
                        >
                          {selectedClient?.phone}
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

          {/* Client Details */}
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Client Details
            </h6>
            <Row>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">Source</small>
                  <p className="m-0 text-dark fw-500">
                    {selectedClient?.source ? (
                      formatChoiceFieldValue(selectedClient.source)
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
                    {selectedClient?.enquiry_type ? (
                      formatChoiceFieldValue(selectedClient.enquiry_type)
                    ) : (
                      <small className="text-muted">Not Available</small>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
            {selectedClient?.other_source && (
              <Row>
                <Col md="6" className="mb-3">
                  <div>
                    <small className="text-muted d-block fw-500">
                      Other Source
                    </small>
                    <p className="m-0 text-dark fw-500">
                      {selectedClient.other_source}
                    </p>
                  </div>
                </Col>
                {selectedClient?.other_enquiry_type && (
                  <Col md="6" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Other Enquiry Type
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedClient.other_enquiry_type}
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            )}
          </div>

          <hr className="my-3" />

          {/* Notes */}
          {selectedClient?.note && (
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
                    {selectedClient.note}
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
            {selectedClient?.created_by ? (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>
                    {selectedClient.created_by.title
                      ? formatChoiceFieldValue(
                          selectedClient.created_by.title,
                        ).trim() + " "
                      : ""}
                    {selectedClient.created_by.first_name}{" "}
                    {selectedClient.created_by.middle_name}{" "}
                    {selectedClient.created_by.last_name}
                  </strong>
                </p>
                <small className="text-muted">
                  {selectedClient.created_by.user_type
                    ? formatChoiceFieldValue(
                        selectedClient.created_by.user_type,
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

export default ViewOrgClientModal;
