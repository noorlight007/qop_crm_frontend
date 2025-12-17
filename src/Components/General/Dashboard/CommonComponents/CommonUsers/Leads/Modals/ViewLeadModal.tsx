import { ViewLeadModalProps } from "@/Types/CommonComponents/CommonUsers/LeadTypes";
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

const ViewLeadModal: React.FC<ViewLeadModalProps> = ({
  isOpen,
  toggle,
  selectedLead,
}) => {
  if (!selectedLead) return null;
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Lead Information</h3>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Name:</span>
            <small>
              {selectedLead.user?.title
                ? formatChoiceFieldValue(selectedLead.user?.title)
                : ""}{" "}
              {selectedLead?.user?.first_name} {selectedLead?.user?.middle_name}{" "}
              {selectedLead?.user?.last_name}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Email:</span>
            {selectedLead?.user?.email ? (
              <small>{selectedLead.user?.email}</small>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column">
            <span className="text-muted">Phone:</span>
            {selectedLead?.user?.phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${selectedLead?.user?.phone}`}
              >
                {selectedLead.user?.phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Gender:</span>
            <small>
              {selectedLead?.gender ? (
                formatChoiceFieldValue(selectedLead?.gender)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">User Type:</span>
            <small>
              {selectedLead?.user?.user_type ? (
                formatChoiceFieldValue(selectedLead.user.user_type)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">User Role:</span>
            <small>
              {selectedLead?.role ? (
                formatChoiceFieldValue(selectedLead.role)
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(selectedLead?.created_at &&
                formatDateAndTime(selectedLead?.created_at)) || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Created By:</span>
            <small>
              {selectedLead?.created_by ? (
                <>
                  {selectedLead.created_by.title
                    ? formatChoiceFieldValue(selectedLead.created_by.title)
                    : ""}{" "}
                  {selectedLead.created_by.first_name}{" "}
                  {selectedLead.created_by.middle_name}{" "}
                  {selectedLead.created_by.last_name}
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
              {selectedLead?.created_by?.user_type
                ? formatChoiceFieldValue(selectedLead.created_by.user_type)
                : "Not available"}
              )
            </small>
          </Col>
          <Col md="4" sm="12" className="d-flex flex-column mt-4">
            <span className="text-muted">Reason for Enquiry:</span>
            <small>
              {selectedLead?.reason_for_enquiry || (
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

export default ViewLeadModal;
