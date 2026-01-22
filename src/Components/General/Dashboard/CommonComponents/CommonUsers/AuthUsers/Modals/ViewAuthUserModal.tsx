import { ViewAuthUserModalProps } from "@/Types/CommonComponents/CommonUsers/AuthUsersTypes";
import { formatDate, formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { Calendar, Mail, Phone, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewAuthUserModal: React.FC<ViewAuthUserModalProps> = ({
  isOpen,
  toggle,
  selectedAuthUser,
}) => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">User Information</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedAuthUser?.profile_image ? (
              <Image
                src={selectedAuthUser.profile_image}
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
            {selectedAuthUser?.title
              ? formatChoiceFieldValue(selectedAuthUser.title) + " "
              : ""}
            {selectedAuthUser?.first_name}{" "}
            {selectedAuthUser?.middle_name &&
              selectedAuthUser?.middle_name + " "}
            {selectedAuthUser?.last_name}
          </h4>
          <p className="mb-2 text-muted small">
            {selectedAuthUser?.name
              ? formatChoiceFieldValue(selectedAuthUser.name)
              : "User"}
          </p>
          <div>
            <Badge pill className="px-3 py-2 me-2 bg-light-primary">
              👤{" "}
              {selectedAuthUser?.role
                ? formatChoiceFieldValue(selectedAuthUser.role)
                : "User"}
            </Badge>
            {selectedAuthUser?.is_active ? (
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
                      {selectedAuthUser?.email ? (
                        <a
                          href={`mailto:${selectedAuthUser.email}`}
                          className="text-decoration-none"
                        >
                          {selectedAuthUser.email}
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
                      {selectedAuthUser?.phone ? (
                        <a
                          href={`tel:${selectedAuthUser.phone}`}
                          className="text-decoration-none"
                        >
                          {selectedAuthUser.phone}
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
              {pathname !== "/dashboard/organisation/director/introducers" && (
                <>
                  <Col md="6" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Gender
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedAuthUser?.gender
                          ? formatChoiceFieldValue(selectedAuthUser.gender)
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
                        {selectedAuthUser?.joining_date &&
                        !isNaN(Date.parse(selectedAuthUser.joining_date))
                          ? formatDate(selectedAuthUser.joining_date)
                          : "-"}
                      </p>
                    </div>
                  </Col>
                </>
              )}
              {pathname === "/dashboard/organisation/director/introducers" && (
                <>
                  <Col md="4" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Company Name
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {(selectedAuthUser as any)?.company_name || "-"}
                      </p>
                    </div>
                  </Col>
                  <Col md="4" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Company Address
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {(selectedAuthUser as any)?.company_address || "-"}
                      </p>
                    </div>
                  </Col>
                  <Col md="4" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Joining Date
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedAuthUser?.joining_date &&
                        !isNaN(Date.parse(selectedAuthUser.joining_date))
                          ? formatDate(selectedAuthUser.joining_date)
                          : "-"}
                      </p>
                    </div>
                  </Col>
                </>
              )}
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
                {selectedAuthUser?.created_at &&
                formatDateAndTime(selectedAuthUser?.created_at)
                  ? formatDateAndTime(selectedAuthUser?.created_at)
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewAuthUserModal;
