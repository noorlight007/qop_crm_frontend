import { AdviserInfoProps } from "@/Types/Network/Director/AdviserTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { Mail, Phone, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

interface ViewOrgAdviserModalsProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAdviser?: Partial<AdviserInfoProps>;
}

const ViewOrgAdviserModals: React.FC<ViewOrgAdviserModalsProps> = ({
  isOpen,
  toggle,
  selectedAdviser,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">Adviser Information</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedAdviser?.user?.profile_image ? (
              <Image
                src={selectedAdviser.user.profile_image}
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
            {selectedAdviser?.user?.title
              ? formatChoiceFieldValue(selectedAdviser.user.title) + ". "
              : ""}
            {selectedAdviser?.user?.first_name}{" "}
            {selectedAdviser?.user?.middle_name &&
              selectedAdviser?.user?.middle_name + " "}
            {selectedAdviser?.user?.last_name}
          </h4>
          <p className="mb-2 text-muted small">
            {selectedAdviser?.role
              ? formatChoiceFieldValue(selectedAdviser.role)
              : "Adviser"}
          </p>
          <div>
            {selectedAdviser?.is_active ? (
              <Badge color="success" pill className="px-3 py-2">
                ✓ Approved
              </Badge>
            ) : (
              <Badge color="warning" pill className="px-3 py-2">
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
                      {selectedAdviser?.user?.email || "-"}
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
                      {selectedAdviser?.user?.phone ? (
                        <a
                          href={`tel:${selectedAdviser.user.phone}`}
                          className="text-decoration-none"
                        >
                          {selectedAdviser.user.phone}
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
                    {selectedAdviser?.gender
                      ? formatChoiceFieldValue(selectedAdviser.gender)
                      : "-"}
                  </p>
                </div>
              </Col>
              <Col md="6" className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">
                    Joining Date
                  </small>
                  <p className="m-0 text-dark fw-500">
                    {selectedAdviser?.joining_date || "-"}
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
            {selectedAdviser?.created_by && (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>
                    {selectedAdviser.created_by.title
                      ? formatChoiceFieldValue(
                          selectedAdviser.created_by.title
                        ).trim() + " "
                      : ""}
                    {selectedAdviser.created_by.first_name}{" "}
                    {selectedAdviser.created_by.middle_name}{" "}
                    {selectedAdviser.created_by.last_name}
                  </strong>
                </p>
                <small className="text-muted">
                  {selectedAdviser.created_by.user_type
                    ? formatChoiceFieldValue(
                        selectedAdviser.created_by.user_type
                      )
                    : ""}
                </small>
              </div>
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewOrgAdviserModals;
