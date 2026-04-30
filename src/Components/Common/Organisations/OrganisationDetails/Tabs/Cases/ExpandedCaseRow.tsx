import { CaseInfoPrpos } from "@/Types/Common/Cases/CaseTypes";
import { formatDate, formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import React from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

interface ExpandedCaseRowProps {
  caseItem: CaseInfoPrpos;
  colSpan: number;
}

const ExpandedCaseRow: React.FC<ExpandedCaseRowProps> = ({
  caseItem,
  colSpan,
}) => {
  const propertyDetails = (() => {
    const pd = caseItem?.property_details;
    if (!pd) return null;
    const countryFormatted = pd.country
      ? formatChoiceFieldValue(pd.country)
      : pd.country;
    const parts = [
      pd.house_name_or_number,
      pd.address_one,
      pd.address_two,
      pd.city,
      pd.county,
      formatChoiceFieldValue(pd.region),
      countryFormatted,
    ].filter((v) => v !== null && v !== undefined && String(v).trim() !== "");
    return parts.length ? parts.join(", ") : null;
  })();

  return (
    <tr>
      <td colSpan={colSpan} className="p-0 bg-light border-0">
        <div className="p-3">
          <Row className="g-3">
            <Col>
              <Card className="h-100 border shadow-none">
                <CardHeader className="py-2 px-3 bg-white">
                  <small className="fw-bold text-muted text-uppercase">
                    Lender
                  </small>
                </CardHeader>
                <CardBody className="py-2 px-3 text-muted fs-6">
                  {caseItem.lender ? (
                    <p className="mb-0 mt-2 small">
                      {formatChoiceFieldValue(caseItem.lender)}
                    </p>
                  ) : (
                    <small className="text-muted">Not Available</small>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 border shadow-none">
                <CardHeader className="py-2 px-3 bg-white">
                  <small className="fw-bold text-muted text-uppercase">
                    Created
                  </small>
                </CardHeader>
                <CardBody className="py-2 px-3 text-muted fs-6">
                  <p className="mb-1 mt-2 small">
                    <strong>At:</strong>{" "}
                    {formatDateAndTime(caseItem.created_at)}
                  </p>
                  {caseItem.created_by == null ? (
                    <small className="text-muted">Not Available</small>
                  ) : (
                    <>
                      <p className="mb-0 small">
                        <strong>By:</strong> {caseItem.created_by?.name}
                      </p>
                      <p className="mb-0 small opacity-75">
                        (
                        {caseItem.created_by?.email
                          ? caseItem.created_by?.email
                          : ""}
                        )
                      </p>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 border shadow-none">
                <CardHeader className="py-2 px-3 bg-white">
                  <small className="fw-bold text-muted text-uppercase">
                    Case Stage & Review Date
                  </small>
                </CardHeader>
                <CardBody className="py-2 px-3 text-muted fs-6">
                  {caseItem.case_stage ? (
                    <>
                      <p className="mb-1 mt-2 small">
                        <strong>Case Stage:</strong>{" "}
                        {formatChoiceFieldValue(caseItem.case_stage)}
                      </p>
                      {formatDate(caseItem?.review_date) ? (
                        <p className="mb-0 small">
                          <strong>Review Date:</strong>{" "}
                          {formatDate(caseItem.review_date)}
                        </p>
                      ) : (
                        <span className="small">
                          <strong>Review Date:</strong>{" "}
                          <span className="text-muted">Not Available</span>
                        </span>
                      )}
                    </>
                  ) : (
                    <small className="text-muted">Not Available</small>
                  )}
                </CardBody>
              </Card>
            </Col>

            {caseItem.case_category === "MORTGAGE" && (
              <Col md={3}>
                <Card className="h-100 border shadow-none">
                  <CardHeader className="py-2 px-3 bg-white">
                    <small className="fw-bold text-muted text-uppercase">
                      Mortgage Details
                    </small>
                  </CardHeader>
                  <CardBody className="py-2 px-3 fs-6 text-start">
                    {caseItem.application_type || caseItem.mortgage_type ? (
                      <ul
                        className="mb-0 mt-2 small text-muted"
                        style={{ listStyleType: "none", paddingLeft: "0" }}
                      >
                        {caseItem.application_type && (
                          <li>
                            <span className="text-primary me-1">→</span>
                            <strong>Application Type:</strong>{" "}
                            {formatChoiceFieldValue(caseItem.application_type)}
                          </li>
                        )}
                        {caseItem.mortgage_type && (
                          <li>
                            <span className="text-primary me-1">→</span>
                            <strong>Mortgage Type:</strong>{" "}
                            {formatChoiceFieldValue(caseItem.mortgage_type)}
                          </li>
                        )}
                      </ul>
                    ) : (
                      <small className="text-muted d-block text-center">
                        Not Available
                      </small>
                    )}
                  </CardBody>
                </Card>
              </Col>
            )}

            {(caseItem.case_category === "GENERAL_INSURANCE" ||
              caseItem.case_category === "PROTECTION") && (
              <Col md={3}>
                <Card className="h-100 border shadow-none">
                  <CardHeader className="py-2 px-3 bg-white">
                    <small className="fw-bold text-muted text-uppercase">
                      {caseItem.case_category === "GENERAL_INSURANCE"
                        ? "Insurance Details"
                        : "Protection Details"}
                    </small>
                  </CardHeader>
                  <CardBody className="py-2 px-3 fs-6">
                    {caseItem.case_category === "GENERAL_INSURANCE" ? (
                      caseItem.policy_type ? (
                        <ul
                          className="mb-0 mt-2 small text-muted"
                          style={{ listStyleType: "none", paddingLeft: "0" }}
                        >
                          <li>
                            <span className="text-primary me-1">→</span>
                            <strong>Insurance Type:</strong>{" "}
                            {formatChoiceFieldValue(caseItem.policy_type)}
                          </li>
                        </ul>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )
                    ) : caseItem.provider ? (
                      <ul
                        className="mb-0 mt-2 small text-muted"
                        style={{ listStyleType: "none", paddingLeft: "0" }}
                      >
                        <li>
                          <span className="text-primary me-1">→</span>
                          <strong>Protection Type:</strong>{" "}
                          {formatChoiceFieldValue(caseItem.provider)}
                        </li>
                      </ul>
                    ) : (
                      <small className="text-muted d-block text-center">
                        Not Available
                      </small>
                    )}
                  </CardBody>
                </Card>
              </Col>
            )}

            <Col md={3}>
              <Card className="h-100 border shadow-none">
                <CardHeader className="py-2 px-3 bg-white">
                  <small className="fw-bold text-muted text-uppercase">
                    Security Property
                  </small>
                </CardHeader>
                <CardBody className="py-2 px-3">
                  {propertyDetails ? (
                    <p className="mb-0 mt-2 small">{propertyDetails}</p>
                  ) : (
                    <small className="text-muted">Not Available</small>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </td>
    </tr>
  );
};

export default ExpandedCaseRow;
