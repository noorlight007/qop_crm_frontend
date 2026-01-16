import { JointApplicantViewModalProps } from "@/Types/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const ViewJointApplicantModal: React.FC<JointApplicantViewModalProps> = ({
  isOpen,
  toggle,
  selectedApplicant,
}) => {
  if (!selectedApplicant) return null;
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
              {selectedApplicant.joint_user_details?.title
                ? formatChoiceFieldValue(
                    selectedApplicant.joint_user_details?.title
                  )
                : ""}{" "}
              {selectedApplicant.joint_user_details?.first_name}{" "}
              {selectedApplicant.joint_user_details?.middle_name}{" "}
              {selectedApplicant.joint_user_details?.last_name}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Email:</span>
            {selectedApplicant.joint_user_details?.email ? (
              <small>{selectedApplicant.joint_user_details?.email}</small>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Phone:</span>
            {selectedApplicant.joint_user_details?.phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${selectedApplicant.joint_user_details?.phone}`}
              >
                {selectedApplicant.joint_user_details?.phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(selectedApplicant?.created_at &&
                formatDateAndTime(selectedApplicant?.created_at)) || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created By:</span>
            <small>
              {selectedApplicant?.created_by ? (
                <>
                  {selectedApplicant?.created_by.title
                    ? formatChoiceFieldValue(
                        selectedApplicant?.created_by.title
                      )
                    : ""}{" "}
                  {selectedApplicant?.created_by.first_name}{" "}
                  {selectedApplicant?.created_by.middle_name}{" "}
                  {selectedApplicant?.created_by.last_name}
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
              {selectedApplicant?.created_by?.user_type
                ? formatChoiceFieldValue(
                    selectedApplicant?.created_by?.user_type
                  )
                : "Not available"}
              )
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Relationship:</span>
            <small>
              {selectedApplicant?.relationship === "OTHER"
                ? formatChoiceFieldValue(
                    selectedApplicant?.other_relationship || ""
                  ) || <span className="text-muted">Not specified</span>
                : formatChoiceFieldValue(selectedApplicant?.relationship) || (
                    <span className="text-muted">Not specified</span>
                  )}
            </small>
          </Col>
          <Col sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Notes:</span>
            <small>
              {selectedApplicant?.notes || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-end">
        <Button color="danger" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewJointApplicantModal;
