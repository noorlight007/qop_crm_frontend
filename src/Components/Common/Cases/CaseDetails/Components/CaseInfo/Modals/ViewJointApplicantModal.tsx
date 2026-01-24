import { JointApplicantViewModalProps } from "@/Types/Common/Cases/CaseDetails/JointApplicant/JointApplicantTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useState } from "react";
import { FaRegWindowClose, FaTrash } from "react-icons/fa";
import { TbUserEdit } from "react-icons/tb";
import {
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
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Joint Applicant Information</h3>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Name:</span>
            <small>
              {displayApplicant.joint_user_details?.title
                ? formatChoiceFieldValue(
                    displayApplicant.joint_user_details?.title,
                  )
                : ""}{" "}
              {displayApplicant.joint_user_details?.first_name}{" "}
              {displayApplicant.joint_user_details?.middle_name}{" "}
              {displayApplicant.joint_user_details?.last_name}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Email:</span>
            {displayApplicant.joint_user_details?.email ? (
              <small>{displayApplicant.joint_user_details?.email}</small>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Phone:</span>
            {displayApplicant.joint_user_details?.phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${displayApplicant.joint_user_details?.phone}`}
              >
                {displayApplicant.joint_user_details?.phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(displayApplicant?.created_at &&
                formatDateAndTime(displayApplicant?.created_at)) || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created By:</span>
            <small>
              {displayApplicant?.created_by ? (
                <>
                  {displayApplicant?.created_by.title
                    ? formatChoiceFieldValue(displayApplicant?.created_by.title)
                    : ""}{" "}
                  {displayApplicant?.created_by.first_name}{" "}
                  {displayApplicant?.created_by.middle_name}{" "}
                  {displayApplicant?.created_by.last_name}
                </>
              ) : (
                "Not available"
              )}
            </small>
            <small
              className="text-muted"
              style={{ marginTop: "-6px", fontSize: "10px" }}
            >
              (
              {displayApplicant?.created_by?.user_type
                ? formatChoiceFieldValue(
                    displayApplicant?.created_by?.user_type,
                  )
                : "Not available"}
              )
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Relationship:</span>
            <small>
              {displayApplicant?.relationship === "OTHER"
                ? formatChoiceFieldValue(
                    displayApplicant?.other_relationship || "",
                  ) || <span className="text-muted">Not specified</span>
                : formatChoiceFieldValue(displayApplicant?.relationship) || (
                    <span className="text-muted">Not specified</span>
                  )}
            </small>
          </Col>
          <Col sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Notes:</span>
            <small>
              {displayApplicant?.notes || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <div className="d-flex gap-1 align-items-center">
          <Button color="danger" onClick={toggleDeleteModal}>
            <FaTrash /> Delete
          </Button>
          <Button color="secondary" onClick={toggleUpdateModal}>
            <TbUserEdit /> Edit
          </Button>
        </div>
        <Button
          color="warning"
          onClick={toggle}
          className="d-flex gap-1 align-items-center"
        >
          <FaRegWindowClose />
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
