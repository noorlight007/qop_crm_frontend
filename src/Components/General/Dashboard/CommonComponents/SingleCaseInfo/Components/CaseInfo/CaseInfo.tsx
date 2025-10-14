import UpdateCaseModal from "@/Components/General/Dashboard/CommonComponents/Cases/Cases/Modals/UpdateCaseModal";
import {
  CaseInfoPrpos,
  SingleCaseProps,
} from "@/Types/CommonComponents/Cases/CaseTypes";
import { useState } from "react";
import { TbCircleArrowUp } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
} from "reactstrap";

const CaseInfo: React.FC<SingleCaseProps> = ({ caseInfo, isLoading }) => {
  const [isUpdateCaseModalOpen, setIsUpdateCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<CaseInfoPrpos | null>(null);

  const toggleUpdateCaseModal = () =>
    setIsUpdateCaseModalOpen(!isUpdateCaseModalOpen);

  // Dynamic column sizing configuration
  const getCardColumns = (index: number) => {
    // First 3 cards: 4 columns each (3 per row)
    // Last 2 cards: 6 columns each (2 per row)
    if (index < 3) {
      return { xl: 4, lg: 4, md: 6, sm: 12 };
    } else {
      return { xl: 6, lg: 6, md: 6, sm: 12 };
    }
  };

  // Card configuration array
  const cardData = [
    {
      title: "Case User",
      borderClass: "border-b-primary",
      spinnerColor: "primary",
      content: (
        <Row className="pt-2">
          <Col xs="12">
            <h6 className="pt-1">
              <span className="small">Name:</span>{" "}
              <strong className="small">
                {caseInfo?.lead_user?.title
                  ? caseInfo.lead_user.title[0].toUpperCase() +
                    caseInfo.lead_user.title.slice(1).toLowerCase()
                  : ""}{" "}
                {caseInfo?.lead_user?.first_name}{" "}
                {caseInfo?.lead_user?.middle_name}{" "}
                {caseInfo?.lead_user?.last_name}
              </strong>
            </h6>
            <h6 className="pt-1">
              <span className="small">Email:</span>{" "}
              <strong>
                <small>{caseInfo?.lead_user?.email}</small>
              </strong>
            </h6>
            <h6 className="pt-1">
              {caseInfo?.lead_user?.phone ? (
                <>
                  <span className="small">Phone:</span>{" "}
                  <strong>
                    <a
                      className="text-dark text_decoration_hover small"
                      href={`tel:${caseInfo?.lead_user?.phone}`}
                    >
                      {caseInfo?.lead_user?.phone}
                    </a>
                  </strong>
                </>
              ) : (
                <>
                  <span className="small">Phone:</span>{" "}
                  <strong className="text-muted opacity-50 small">
                    Not Found
                  </strong>
                </>
              )}
            </h6>
          </Col>
        </Row>
      ),
    },
    {
      title: "Case Info",
      borderClass: "border-b-warning",
      spinnerColor: "warning",
      content: (
        <Row className="pt-2">
          <Col xs="12">
            <h6 className="pt-1">
              <span className="small">Case Category:</span>{" "}
              <strong className="small">
                {caseInfo?.case_category
                  ? caseInfo.case_category
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")
                  : "N/A"}
              </strong>
            </h6>
            <h6 className="pt-1">
              <span className="small">Case Status:</span>{" "}
              <strong
                className={`rounded-1 px-1 small ${
                  caseInfo?.is_removed ? "bg-danger" : "bg-success"
                }`}
              >
                {caseInfo?.is_removed ? "Removed" : "Active"}
              </strong>
            </h6>
            <h6 className="pt-1">
              <span className="small">Case Stage:</span>{" "}
              <strong className="small">
                {caseInfo?.case_stage
                  ? caseInfo.case_stage
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")
                  : "N/A"}
              </strong>
            </h6>
          </Col>
        </Row>
      ),
    },
    {
      title: "Assigned Advisor",
      borderClass: "border-b-info",
      spinnerColor: "info",
      content: (
        <Row className="pt-2">
          <Col xs="12">
            {caseInfo?.assigned_user ? (
              <>
                <h6 className="pt-1">
                  <span className="small">Name:</span>{" "}
                  <strong className="small">
                    {caseInfo?.assigned_user?.title
                      ? caseInfo.assigned_user.title[0].toUpperCase() +
                        caseInfo.assigned_user.title.slice(1).toLowerCase()
                      : ""}{" "}
                    {caseInfo?.assigned_user?.first_name}{" "}
                    {caseInfo?.assigned_user?.middle_name}{" "}
                    {caseInfo?.assigned_user?.last_name}
                  </strong>
                </h6>
                <h6 className="pt-1">
                  <span className="small">Email:</span>{" "}
                  <strong>
                    <small>{caseInfo?.assigned_user?.email}</small>
                  </strong>
                </h6>
                <h6 className="pt-1">
                  <span className="small">User Type:</span>{" "}
                  <strong className="small">
                    {caseInfo?.assigned_user?.user_type
                      ? caseInfo.assigned_user?.user_type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")
                      : "N/A"}
                  </strong>
                </h6>
              </>
            ) : (
              <div className="text-center py-3 mt-2">
                <h6 className="text-muted">
                  <em>Not Assigned Yet</em>
                </h6>
              </div>
            )}
          </Col>
        </Row>
      ),
    },
    {
      title: "Created By",
      borderClass: "border-b-success",
      spinnerColor: "success",
      content: (
        <Row className="pt-2">
          <Col xs="12">
            <h6 className="pt-1">
              <span className="small">Name:</span>{" "}
              <strong className="small">
                {caseInfo?.created_by?.title
                  ? caseInfo.created_by.title[0].toUpperCase() +
                    caseInfo.created_by.title.slice(1).toLowerCase()
                  : ""}{" "}
                {caseInfo?.created_by?.first_name}{" "}
                {caseInfo?.created_by?.middle_name}{" "}
                {caseInfo?.created_by?.last_name}
              </strong>
            </h6>
            <h6 className="pt-1">
              <span className="small">Email:</span>{" "}
              <strong>
                <small>{caseInfo?.created_by?.email}</small>
              </strong>
            </h6>
            <h6 className="pt-1">
              <span className="small">User Type:</span>{" "}
              <strong className="small">
                {caseInfo?.created_by?.user_type
                  ? caseInfo.created_by?.user_type
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")
                  : "N/A"}
              </strong>
            </h6>
          </Col>
        </Row>
      ),
    },
    {
      title: "Updated By",
      borderClass: "border-b-secondary",
      spinnerColor: "secondary",
      content: (
        <Row className="pt-2">
          <Col xs="12">
            {caseInfo?.updated_by ? (
              <>
                <h6 className="pt-1">
                  <span className="small">Name:</span>{" "}
                  <strong className="small">
                    {caseInfo?.updated_by?.title
                      ? caseInfo.updated_by.title[0].toUpperCase() +
                        caseInfo.updated_by.title.slice(1).toLowerCase()
                      : ""}{" "}
                    {caseInfo?.updated_by?.first_name}{" "}
                    {caseInfo?.updated_by?.middle_name}{" "}
                    {caseInfo?.updated_by?.last_name}
                  </strong>
                </h6>
                <h6 className="pt-1">
                  <span className="small">Email:</span>{" "}
                  <strong>
                    <small>{caseInfo?.updated_by?.email}</small>
                  </strong>
                </h6>
                <h6 className="pt-1">
                  <span className="small">User Type:</span>{" "}
                  <strong className="small">
                    {caseInfo?.updated_by?.user_type
                      ? caseInfo.updated_by?.user_type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")
                      : "N/A"}
                  </strong>
                </h6>
              </>
            ) : (
              <div className="text-center py-3 mt-2">
                <h6 className="text-muted">
                  <em>No Updates Yet</em>
                </h6>
              </div>
            )}
          </Col>
        </Row>
      ),
    },
  ];

  const openUpdateCaseModal = (caseInfo: CaseInfoPrpos) => {
    setCurrentCase(caseInfo);
    toggleUpdateCaseModal();
  };

  return (
    <Col sm="12">
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3 className="mb-2">
            Case Info
            <span className="small text-muted opacity-75">
              ({caseInfo?.name})
            </span>
          </h3>
          <Button
            color="primary"
            onClick={() => openUpdateCaseModal(caseInfo!)}
            disabled={!caseInfo} // Disable if caseInfo is null
            className="d-flex justify-content-center align-items-center gap-1"
          >
            <TbCircleArrowUp size={18} />
            <span>Update Info</span>
          </Button>
        </CardHeader>

        <Row className="px-3 mt-3">
          {cardData.map((card, index) => {
            const columns = getCardColumns(index);
            return (
              <Col
                key={card.title}
                sm={columns.sm}
                md={columns.md}
                lg={columns.lg}
                xl={columns.xl}
              >
                <Card className="shadow">
                  <CardBody
                    className={`support-ticket-font pt-2 border-3 rounded-3 ${card.borderClass}`}
                  >
                    <CardHeader className="pt-0 pb-1 m-0 text-center">
                      <h6 className="fw-bold">{card.title}</h6>
                    </CardHeader>
                    {isLoading ? (
                      <Row className="pt-2">
                        <Col xs="12" className="text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            color={card.spinnerColor}
                          />
                        </Col>
                      </Row>
                    ) : (
                      card.content
                    )}
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Row className="px-3">
          <div>
            <h4>Notes:</h4>
            <p className="text-muted p-1">
              {caseInfo?.notes
                ? caseInfo.notes.charAt(0).toUpperCase() +
                  caseInfo.notes.slice(1).toLowerCase()
                : "Notes not available"}
            </p>
          </div>
        </Row>
      </Card>
      <UpdateCaseModal
        isOpen={isUpdateCaseModalOpen}
        toggle={toggleUpdateCaseModal}
        caseData={currentCase as CaseInfoPrpos}
      />
    </Col>
  );
};

export default CaseInfo;
