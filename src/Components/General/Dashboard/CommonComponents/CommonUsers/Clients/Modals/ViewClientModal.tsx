import { ViewClientModalProps } from "@/Types/CommonComponents/Directors/ClientTypes";
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

const ViewClientModal: React.FC<ViewClientModalProps> = ({
  isOpen,
  toggle,
  selectedClient,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Client Details</h3>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Name:</span>
            <small>
              {selectedClient.user?.title
                ? formatChoiceFieldValue(selectedClient.user.title)
                : ""}{" "}
              {selectedClient?.user?.first_name}{" "}
              {selectedClient?.user?.middle_name}{" "}
              {selectedClient?.user?.last_name}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Email:</span>
            {selectedClient?.user?.email ? (
              <small>{selectedClient.user?.email}</small>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Phone:</span>

            {selectedClient?.user?.phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${selectedClient?.user?.phone}`}
              >
                {selectedClient.user?.phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Gender:</span>
            <small>
              {selectedClient?.gender ? (
                formatChoiceFieldValue(selectedClient?.gender)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">User Type:</span>
            <small>
              {selectedClient?.user?.user_type ? (
                formatChoiceFieldValue(selectedClient.user.user_type)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">User Role:</span>
            <small>
              {selectedClient?.role ? (
                formatChoiceFieldValue(selectedClient?.role)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(selectedClient?.created_at &&
                formatDateAndTime(selectedClient?.created_at)) || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Created By:</span>
            <small>
              {selectedClient?.created_by ? (
                <>
                  {selectedClient.created_by.title
                    ? formatChoiceFieldValue(selectedClient.created_by.title)
                    : ""}{" "}
                  {selectedClient.created_by.first_name}{" "}
                  {selectedClient.created_by.middle_name}{" "}
                  {selectedClient.created_by.last_name}
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
              {selectedClient?.created_by?.user_type
                ? formatChoiceFieldValue(selectedClient.created_by.user_type)
                : "Not available"}
              )
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Reason for Enquiry:</span>
            <small>
              {(selectedClient?.reason_for_enquiry &&
                formatDateAndTime(selectedClient?.reason_for_enquiry)) || (
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

export default ViewClientModal;
