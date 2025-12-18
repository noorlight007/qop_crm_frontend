import { ViewAdviserModalProps } from "@/Types/CommonComponents/CommonUsers/AdviserTypes";
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

const ViewAdviserModal: React.FC<ViewAdviserModalProps> = ({
  isOpen,
  toggle,
  selectedAdviser,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Adviser Information</h3>
      </ModalHeader>
      <ModalBody>
        {/* 1st row  */}
        <Row>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Name:</span>
            <small>
              {selectedAdviser.user?.title
                ? formatChoiceFieldValue(selectedAdviser.user.title)
                : ""}{" "}
              {selectedAdviser?.user?.first_name}{" "}
              {selectedAdviser?.user?.middle_name}{" "}
              {selectedAdviser?.user?.last_name}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Email:</span>
            {selectedAdviser?.user?.email ? (
              <span className="small">{selectedAdviser.user?.email}</span>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Phone:</span>

            {selectedAdviser?.user?.phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${selectedAdviser?.user?.phone}`}
              >
                {selectedAdviser.user?.phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Gender:</span>
            <small>
              {selectedAdviser?.gender ? (
                formatChoiceFieldValue(selectedAdviser.gender)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">User Type:</span>
            <small>
              {selectedAdviser?.user?.user_type ? (
                formatChoiceFieldValue(selectedAdviser.user.user_type)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">User Role:</span>
            <small>
              {selectedAdviser?.role ? (
                formatChoiceFieldValue(selectedAdviser.role)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(selectedAdviser?.created_at &&
                formatDateAndTime(selectedAdviser?.created_at)) || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Created By:</span>
            <small>
              {selectedAdviser?.created_by ? (
                <>
                  {selectedAdviser.created_by.title
                    ? formatChoiceFieldValue(selectedAdviser.created_by.title)
                    : ""}{" "}
                  {selectedAdviser.created_by.first_name}{" "}
                  {selectedAdviser.created_by.middle_name}{" "}
                  {selectedAdviser.created_by.last_name}
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
              {selectedAdviser?.created_by?.user_type
                ? formatChoiceFieldValue(selectedAdviser.created_by.user_type)
                : "Not available"}
              )
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Joining Date:</span>
            <small>
              {selectedAdviser?.joining_date &&
              !isNaN(Date.parse(selectedAdviser.joining_date))
                ? formatDate(selectedAdviser.joining_date)
                : "Not available"}
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

export default ViewAdviserModal;
