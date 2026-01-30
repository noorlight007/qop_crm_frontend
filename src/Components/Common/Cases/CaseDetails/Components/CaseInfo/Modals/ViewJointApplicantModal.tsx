import { JointApplicantViewModalProps } from "@/Types/Common/Cases/CaseDetails/JointApplicant/JointApplicantTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useState } from "react";
import { FileText, Mail, Phone, User } from "react-feather";
import { FaTrash } from "react-icons/fa";
import { TbUserEdit } from "react-icons/tb";
import {
  Badge,
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import DeleteJointApplicantModal from "./DeleteJointApplicantModal";
import UpdateJointApplicantModal from "./UpdateJointApplicantModal";

const ViewJointApplicantModal: React.FC<JointApplicantViewModalProps> = ({
  isOpen,
  toggle,
  selectedApplicant,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updatedApplicant, setUpdatedApplicant] = useState(selectedApplicant);

  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleUpdateSuccess = (updatedData: any) => {
    setUpdatedApplicant(updatedData);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    toggle();
  };

  if (!selectedApplicant) return null;

  const displayApplicant = updatedApplicant || selectedApplicant;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient border-0">
        <span className="fs-5 fw-bold text-primary">
          Joint Applicant Information
        </span>
      </ModalHeader>
      <ModalBody
        className="p-0"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {/* Profile Section */}
        <div className="bg-light p-4 text-center border-bottom">
          <div className="mb-3">
            {displayApplicant?.joint_user_details?.profile_image ? (
              <Image
                src={displayApplicant.joint_user_details.profile_image}
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
            {displayApplicant?.joint_user_details?.title
              ? formatChoiceFieldValue(
                  displayApplicant.joint_user_details.title,
                ) + ". "
              : ""}
            {displayApplicant?.joint_user_details?.first_name}{" "}
            {displayApplicant?.joint_user_details?.middle_name &&
              displayApplicant?.joint_user_details?.middle_name + " "}
            {displayApplicant?.joint_user_details?.last_name}
          </h4>
          <div>
            <Badge pill className="px-3 py-2 bg-light-primary">
              👥{" "}
              {displayApplicant?.relationship === "OTHER"
                ? displayApplicant?.other_relationship || "Other"
                : formatChoiceFieldValue(displayApplicant?.relationship) ||
                  "Joint Applicant"}
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
                      {displayApplicant?.joint_user_details?.email ? (
                        <a
                          href={`mailto:${displayApplicant.joint_user_details.email}`}
                          className="text-decoration-none"
                        >
                          {displayApplicant.joint_user_details.email}
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
                      {displayApplicant?.joint_user_details?.phone ? (
                        <a
                          href={`tel:${displayApplicant.joint_user_details.phone}`}
                          className="text-decoration-none"
                        >
                          {displayApplicant.joint_user_details.phone}
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

          {/* Relationship Details & Additional Information */}
          <Row>
            <Col md="6">
              {/* Relationship Details */}
              <div className="mb-4">
                <h6
                  className="text-uppercase fw-bold text-primary mb-3"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  Relationship Details
                </h6>
                <Row>
                  <Col md="12" className="mb-3">
                    <div>
                      <small className="text-muted d-block fw-500">
                        Relationship
                      </small>
                      <p className="m-0 text-dark fw-500">
                        {displayApplicant?.relationship === "OTHER"
                          ? displayApplicant?.other_relationship || "-"
                          : displayApplicant?.relationship
                            ? formatChoiceFieldValue(
                                displayApplicant.relationship,
                              )
                            : "-"}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md="6">
              {/* Notes */}
              {displayApplicant?.notes && (
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
                      {displayApplicant.notes}
                    </p>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <hr className="my-3" />

          {/* Additional Information */}
          <div>
            <h6
              className="text-uppercase fw-bold text-primary mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Additional Information
            </h6>
            <Row>
              <Col md="6" className="mb-3">
                {displayApplicant?.created_by ? (
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block fw-500 mb-2">
                      Created By
                    </small>
                    <p className="m-0 text-dark">
                      <strong>
                        {displayApplicant.created_by.title
                          ? formatChoiceFieldValue(
                              displayApplicant.created_by.title,
                            ).trim() + " "
                          : ""}
                        {displayApplicant.created_by.first_name}{" "}
                        {displayApplicant.created_by.middle_name}{" "}
                        {displayApplicant.created_by.last_name}
                      </strong>
                    </p>
                    <small className="text-muted">
                      {displayApplicant.created_by.user_type
                        ? formatChoiceFieldValue(
                            displayApplicant.created_by.user_type,
                          )
                        : ""}
                    </small>
                  </div>
                ) : (
                  <div
                    className="p-3 bg-light rounded"
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
              </Col>
              <Col md="6" className="mb-3">
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block fw-500 mb-2">
                    Created At
                  </small>
                  <p className="m-0 text-dark fw-500">
                    {displayApplicant?.created_at &&
                    formatDateAndTime(displayApplicant?.created_at)
                      ? formatDateAndTime(displayApplicant?.created_at)
                      : "-"}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <div className="d-flex gap-2 align-items-center">
          <Button color="danger" onClick={toggleDeleteModal}>
            <FaTrash /> Delete
          </Button>
          <Button color="info" onClick={toggleUpdateModal}>
            <TbUserEdit /> Edit
          </Button>
        </div>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
      <UpdateJointApplicantModal
        isOpen={isUpdateModalOpen}
        toggle={toggleUpdateModal}
        user={updatedApplicant || selectedApplicant}
        onUpdateSuccess={handleUpdateSuccess}
      />
      <DeleteJointApplicantModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        selectedApplicant={selectedApplicant}
        onDelete={handleDeleteSuccess}
      />
    </Modal>
  );
};

export default ViewJointApplicantModal;
