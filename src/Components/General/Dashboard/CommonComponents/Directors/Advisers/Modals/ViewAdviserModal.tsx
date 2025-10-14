import { ViewAdviserModalProps } from "@/Types/CommonComponents/Directors/AdviserTypes";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
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
                ? selectedAdviser.user?.title.charAt(0).toUpperCase() +
                  selectedAdviser.user?.title.slice(1).toLowerCase()
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
          <Col md="4" sm="6" className="d-flex flex-column">
            <span className="text-muted">Official Email:</span>
            {selectedAdviser?.official_email ? (
              <small>{selectedAdviser.official_email}</small>
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
            <span className="text-muted">Official Phone:</span>
            {selectedAdviser?.official_phone ? (
              <a
                className="text-dark text_decoration_hover small"
                href={`tel:${selectedAdviser?.official_phone}`}
              >
                {selectedAdviser.official_phone}
              </a>
            ) : (
              <span className="text-muted small">Not available</span>
            )}
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Date of Birth:</span>
            <small>
              {selectedAdviser?.dob || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Gender:</span>
            <small>
              {selectedAdviser?.gender ? (
                selectedAdviser.gender.charAt(0).toUpperCase() +
                selectedAdviser.gender.slice(1).toLowerCase()
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">User Type:</span>
            <small>
              {selectedAdviser?.user?.user_type ? (
                selectedAdviser.user.user_type
                  .split("_")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() +
                      word.slice(1).toLowerCase()
                  )
                  .join(" ")
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">User Role:</span>
            <small>
              {selectedAdviser?.role ? (
                selectedAdviser.role.charAt(0).toUpperCase() +
                selectedAdviser.role.slice(1).toLowerCase()
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Created At:</span>
            <small>
              {(selectedAdviser?.created_at &&
                formatDateToDMYAndTime(selectedAdviser?.created_at)) || (
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
                    ? selectedAdviser.created_by.title.charAt(0).toUpperCase() +
                      selectedAdviser.created_by.title.slice(1).toLowerCase()
                    : ""}
                  {" "} {selectedAdviser.created_by.first_name}{" "}
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
                ? selectedAdviser.created_by.user_type
                    .split("_")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")
                : "Not available"}
              )
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Permanent Address:</span>
            <small>
              {selectedAdviser?.permanent_address || (
                <span className="text-muted">Not available</span>
              )}
            </small>
          </Col>
          <Col md="4" sm="6" className="d-flex flex-column mt-4">
            <span className="text-muted">Present Address:</span>
            <small>
              {selectedAdviser?.present_address || (
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

export default ViewAdviserModal;
