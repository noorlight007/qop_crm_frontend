import {
  OrgUserListType,
  OrgUserRole,
} from "@/Types/Common/Organisations/OrgUserListTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import React from "react";
import { Mail, Phone, User } from "react-feather";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

export type ViewOrgUserModalProps = {
  isOpen: boolean;
  toggle: () => void;
  role: OrgUserRole;
  selectedUser: Partial<OrgUserListType>;
};

const ViewOrgUserModal: React.FC<ViewOrgUserModalProps> = ({
  isOpen,
  toggle,
  role,
  selectedUser,
}) => {
  const headerTitle =
    role === "ADMIN"
      ? "Admin Information"
      : role === "INTRODUCER"
        ? "Introducer Information"
        : role === "ADVISER"
          ? "Adviser Information"
          : "User Information";

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">{headerTitle}</span>
      </ModalHeader>
      <ModalBody className="p-0">
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {selectedUser?.profile_image ? (
              <Image
                src={selectedUser.profile_image as string}
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
          <h4 className="mb-1 text-dark fw-bold">{selectedUser?.name}</h4>

          <div className="d-flex justify-content-center gap-2">
            <p>
              {selectedUser?.is_active ? (
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
                      {selectedUser?.email ? (
                        selectedUser.email
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
                      {selectedUser?.phone ? (
                        <span className="text-decoration-none text-primary">
                          {selectedUser.phone}
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

          {/* Personal Details */}
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Personal Details
            </h6>
            <Row>
              {role === "INTRODUCER" && (
                <>
                  <Col md="4" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Company Name
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedUser?.company_name ? (
                          selectedUser.company_name
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col md="4" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Company Address
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {selectedUser?.company_address ? (
                          selectedUser.company_address
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </p>
                    </div>
                  </Col>
                </>
              )}

              <Col md={role === "INTRODUCER" ? "4" : "6"} className="mb-3">
                <div>
                  <small className="text-muted d-block fw-500">
                    Joining Date
                  </small>
                  <p className="m-0 text-dark fw-500">
                    {selectedUser?.joining_date ? (
                      selectedUser.joining_date
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
            {(selectedUser as any)?.created_by ? (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted d-block fw-500 mb-2">
                  Created By
                </small>
                <p className="m-0 text-dark">
                  <strong>
                    {(selectedUser as any).created_by.title
                      ? formatChoiceFieldValue(
                          (selectedUser as any).created_by.title,
                        ).trim() + " "
                      : ""}
                    {(selectedUser as any).created_by.first_name}{" "}
                    {(selectedUser as any).created_by.middle_name}{" "}
                    {(selectedUser as any).created_by.last_name}
                  </strong>
                </p>
                <small className="text-muted">
                  {(selectedUser as any).created_by.email
                    ? formatChoiceFieldValue(
                        (selectedUser as any).created_by.email,
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

export default ViewOrgUserModal;
