import { JointUserViewModalProps } from "@/Types/CommonComponents/SingleCaseInfo/JointUser/JointUserTypes";
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

const ViewJointUserModal: React.FC<JointUserViewModalProps> = ({
  isOpen,
  toggle,
  selectedUser,
}) => {
  if (!selectedUser) return null;
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
              {selectedUser.joint_user_details?.title
                ? formatChoiceFieldValue(selectedUser.joint_user_details?.title)
                : ""}{" "}
              {selectedUser.joint_user_details?.first_name}{" "}
              {selectedUser.joint_user_details?.middle_name}{" "}
              {selectedUser.joint_user_details?.last_name}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Email:</span>
            {selectedUser.joint_user_details?.email ? (
              <small>{selectedUser.joint_user_details?.email}</small>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Phone:</span>
            {selectedUser.joint_user_details?.phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${selectedUser.joint_user_details?.phone}`}
              >
                {selectedUser.joint_user_details?.phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">User Type:</span>
            <small>
              {selectedUser.joint_user_details?.user_type ? (
                formatChoiceFieldValue(
                  selectedUser.joint_user_details?.user_type
                )
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(selectedUser?.created_at &&
                formatDateAndTime(selectedUser?.created_at)) || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created By:</span>
            <small>
              {selectedUser?.created_by ? (
                <>
                  {selectedUser?.created_by.title
                    ? formatChoiceFieldValue(selectedUser?.created_by.title)
                    : ""}{" "}
                  {selectedUser?.created_by.first_name}{" "}
                  {selectedUser?.created_by.middle_name}{" "}
                  {selectedUser?.created_by.last_name}
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
              {selectedUser?.created_by?.user_type
                ? formatChoiceFieldValue(selectedUser?.created_by?.user_type)
                : "Not available"}
              )
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Relationship:</span>
            <small>
              {selectedUser?.relationship || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="6" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Notes:</span>
            <small>
              {selectedUser?.notes || (
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

export default ViewJointUserModal;
