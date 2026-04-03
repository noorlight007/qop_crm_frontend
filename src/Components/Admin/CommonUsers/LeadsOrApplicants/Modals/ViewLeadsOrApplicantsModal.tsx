import { ViewLeadsOrApplicantsModalProps } from "@/Types/Admin/Common/LeadsOrApplicants/LeadsOrApplicantsTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { Calendar, Mail, Phone, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewLeadsOrApplicantsModal: React.FC<ViewLeadsOrApplicantsModalProps> = ({
  isOpen,
  toggle,
  selectedLeadsOrApplicants,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">{title} Information</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedLeadsOrApplicants?.profile_image ? (
              <Image
                src={selectedLeadsOrApplicants.profile_image}
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
            {selectedLeadsOrApplicants?.title
              ? formatChoiceFieldValue(selectedLeadsOrApplicants.title) + " "
              : ""}
            {selectedLeadsOrApplicants?.first_name}{" "}
            {selectedLeadsOrApplicants?.middle_name &&
              selectedLeadsOrApplicants?.middle_name + " "}
            {selectedLeadsOrApplicants?.last_name}
          </h4>
          <p className="mb-2 text-muted small">
            {selectedLeadsOrApplicants?.name
              ? formatChoiceFieldValue(selectedLeadsOrApplicants.name)
              : "User"}
          </p>
          <div>
            {selectedLeadsOrApplicants?.is_active ? (
              <Badge pill className="px-3 py-2 bg-light-success">
                ✓ Approved
              </Badge>
            ) : (
              <Badge pill className="px-3 py-2 bg-light-danger">
                ⏳ Pending
              </Badge>
            )}
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
                      {selectedLeadsOrApplicants?.email ? (
                        <a
                          href={`mailto:${selectedLeadsOrApplicants.email}`}
                          className="text-decoration-none"
                        >
                          {selectedLeadsOrApplicants.email}
                        </a>
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
                      {selectedLeadsOrApplicants?.phone ? (
                        <span className="text-primary text-decoration-none">
                          {selectedLeadsOrApplicants.phone}
                        </span>
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

          {/* Additional Information */}
          <div>
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              <Calendar
                size={14}
                className="me-2"
                style={{ display: "inline" }}
              />
              Additional Information
            </h6>
            <div className="mb-3 p-3 bg-light rounded">
              <small className="text-muted d-block fw-500 mb-2">
                Created At
              </small>
              <p className="m-0 text-dark fw-500">
                {selectedLeadsOrApplicants?.created_at &&
                formatDateAndTime(selectedLeadsOrApplicants?.created_at) ? (
                  formatDateAndTime(selectedLeadsOrApplicants?.created_at)
                ) : (
                  <small className="text-muted">Not Available</small>
                )}
              </p>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewLeadsOrApplicantsModal;
