import { ViewAuthUserModalProps } from "@/Types/CommonComponents/CommonUsers/AuthUsersTypes";
import { formatDate, formatDateAndTime } from "@/utils/dateAndTimeFormatter";
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

const ViewAuthUserModal: React.FC<ViewAuthUserModalProps> = ({
  isOpen,
  toggle,
  selectedAuthUser,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">
          {selectedAuthUser?.name
            ? formatChoiceFieldValue(selectedAuthUser?.name)
            : ""}{" "}
          Information
        </h3>
      </ModalHeader>
      <ModalBody>
        {/* 1st row  */}
        <Row>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Name:</span>
            <small>
              {selectedAuthUser?.title
                ? formatChoiceFieldValue(selectedAuthUser?.title)
                : ""}{" "}
              {selectedAuthUser?.first_name} {selectedAuthUser?.middle_name}{" "}
              {selectedAuthUser?.last_name}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Email:</span>
            {selectedAuthUser?.email ? (
              <span className="small">{selectedAuthUser?.email}</span>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Phone:</span>
            {selectedAuthUser?.phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${selectedAuthUser?.phone}`}
              >
                {selectedAuthUser?.phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Gender:</span>
            <small>
              {selectedAuthUser?.gender ? (
                formatChoiceFieldValue(selectedAuthUser?.gender)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Joining Date:</span>
            <small>
              {selectedAuthUser?.joining_date &&
              !isNaN(Date.parse(selectedAuthUser.joining_date))
                ? formatDate(selectedAuthUser.joining_date)
                : "Not available"}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(selectedAuthUser?.created_at &&
                formatDateAndTime(selectedAuthUser?.created_at)) || (
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

export default ViewAuthUserModal;
