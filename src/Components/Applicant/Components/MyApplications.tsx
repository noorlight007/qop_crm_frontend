import LoadingSpinner from "@/app/loading";
import { useGetApplicantCaseQuery } from "@/Redux/Reducers/Applicant/ApplicantCaseApi";
import { ApplicantCaseTypes } from "@/Types/Applicant/ApplicantCaseTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Link from "next/link";
import React, { useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Row,
  Table,
} from "reactstrap";

const stageBadgeColor: Record<string, string> = {
  ENQUIRY: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const categoryBadgeColor: Record<string, string> = {
  MORTGAGE: "primary",
  INSURANCE: "secondary",
  PROTECTION: "dark",
};

const buildFullName = (
  user:
    | {
        title?: string | null;
        first_name?: string | null;
        middle_name?: string | null;
        last_name?: string | null;
      }
    | null
    | undefined
): string => {
  if (!user) return "-";
  return [
    user.title ? formatChoiceFieldValue(user.title) : "",
    user.first_name || "",
    user.middle_name || "",
    user.last_name || "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "-";
};

const ExpandedRow: React.FC<{ app: ApplicantCaseTypes }> = ({ app }) => (
  <tr>
    <td colSpan={8} className="p-0 bg-light border-0">
      <div className="p-3">
        <Row className="g-3">

          {/* Customer */}
          <Col md={4}>
            <Card className="h-100 border shadow-none">
              <CardHeader className="py-2 px-3 bg-white">
                <small className="fw-bold text-muted text-uppercase">
                  Primary Customer
                </small>
              </CardHeader>
              <CardBody className="py-2 px-3">
                <p className="mb-1 fw-semibold">{buildFullName(app.customer)}</p>
                <p className="mb-1 small text-muted">{app.customer?.email || "-"}</p>
                <p className="mb-1 small">{app.customer?.phone || "-"}</p>
                {app.customer?.enquiry_type && (
                  <p className="mb-1 small">
                    <span className="text-muted">Enquiry type: </span>
                    {formatChoiceFieldValue(app.customer.enquiry_type)}
                  </p>
                )}
                {app.customer?.source && (
                  <p className="mb-0 small">
                    <span className="text-muted">Source: </span>
                    {formatChoiceFieldValue(app.customer.source)}
                  </p>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Joint Users */}
          <Col md={4}>
            <Card className="h-100 border shadow-none">
              <CardHeader className="py-2 px-3 bg-white">
                <small className="fw-bold text-muted text-uppercase">
                  Joint Applicants ({app.joint_users?.length || 0})
                </small>
              </CardHeader>
              <CardBody className="py-2 px-3">
                {app.joint_users?.length ? (
                  app.joint_users.map((u, idx) => (
                    <div
                      key={u.alias || idx}
                      className={idx > 0 ? "border-top pt-2 mt-2" : ""}
                    >
                      <p className="mb-1 fw-semibold">{buildFullName(u)}</p>
                      <p className="mb-1 small text-muted">{u.email || "-"}</p>
                      <p className="mb-1 small">{u.phone || "-"}</p>
                      {u.enquiry_type && (
                        <p className="mb-1 small">
                          <span className="text-muted">Enquiry type: </span>
                          {formatChoiceFieldValue(u.enquiry_type)}
                        </p>
                      )}
                      {u.source && (
                        <p className="mb-1 small">
                          <span className="text-muted">Source: </span>
                          {formatChoiceFieldValue(u.source)}
                        </p>
                      )}
                      {u.note && (
                        <p className="mb-0 small fst-italic text-muted">
                          &ldquo;{u.note}&rdquo;
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="mb-0 small text-muted">No joint applicants</p>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Case & Financial Details */}
          <Col md={4}>
            <Card className="h-100 border shadow-none">
              <CardHeader className="py-2 px-3 bg-white">
                <small className="fw-bold text-muted text-uppercase">
                  Case & Financial Details
                </small>
              </CardHeader>
              <CardBody className="py-2 px-3">
                <Table size="sm" borderless className="mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted ps-0 small">Assigned to</td>
                      <td className="text-end small pe-0">
                        {buildFullName(app.assigned_user)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Network</td>
                      <td className="text-end small pe-0">
                        {app.network?.name || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Mortgage type</td>
                      <td className="text-end small pe-0">
                        {app.mortgage_type
                          ? formatChoiceFieldValue(app.mortgage_type)
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Loan amount</td>
                      <td className="text-end small pe-0">
                        {app.loan_amount && app.loan_amount !== "0"
                          ? `£${parseFloat(app.loan_amount).toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Purchase price</td>
                      <td className="text-end small pe-0">
                        {app.purchase_price && app.purchase_price !== "0"
                          ? `£${parseFloat(app.purchase_price).toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Valuation</td>
                      <td className="text-end small pe-0">
                        {app.property_valuation && app.property_valuation !== "0"
                          ? `£${parseFloat(app.property_valuation).toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Lender</td>
                      <td className="text-end small pe-0">
                        {app.lender || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Review date</td>
                      <td className="text-end small pe-0">
                        {app.review_date
                          ? formatDateAndTime(app.review_date)
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0 small">Completion date</td>
                      <td className="text-end small pe-0">
                        {app.completion_date
                          ? formatDateAndTime(app.completion_date)
                          : "-"}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          {/* Property Details — only if any meaningful data exists */}
          {app.property_details &&
            (app.property_details.postcode ||
              app.property_details.property_type ||
              app.property_details.bedrooms > 0 ||
              app.property_details.estimated_value > 0) && (
              <Col md={12}>
                <Card className="border shadow-none">
                  <CardHeader className="py-2 px-3 bg-white">
                    <small className="fw-bold text-muted text-uppercase">
                      Property Details
                    </small>
                  </CardHeader>
                  <CardBody className="py-2 px-3">
                    <Row className="g-2">
                      {[
                        ["Postcode", app.property_details.postcode],
                        ["City", app.property_details.city],
                        ["County", app.property_details.county],
                        ["Country", app.property_details.country],
                        [
                          "Property type",
                          app.property_details.property_type
                            ? formatChoiceFieldValue(
                                app.property_details.property_type
                              )
                            : null,
                        ],
                        [
                          "House type",
                          app.property_details.house_type
                            ? formatChoiceFieldValue(
                                app.property_details.house_type
                              )
                            : null,
                        ],
                        [
                          "Tenure",
                          app.property_details.tenure
                            ? formatChoiceFieldValue(
                                app.property_details.tenure
                              )
                            : null,
                        ],
                        ["Bedrooms", app.property_details.bedrooms || null],
                        ["Bathrooms", app.property_details.bathrooms || null],
                        [
                          "Estimated value",
                          app.property_details.estimated_value
                            ? `£${app.property_details.estimated_value.toLocaleString()}`
                            : null,
                        ],
                        ["Year built", app.property_details.year_built > 1 ? app.property_details.year_built : null],
                        [
                          "EPC rating",
                          app.property_details.epc_rating || null,
                        ],
                        [
                          "New build",
                          app.property_details.is_the_property_a_new_build
                            ? "Yes"
                            : null,
                        ],
                        [
                          "Listed building",
                          app.property_details.is_the_property_a_listed_building
                            ? "Yes"
                            : null,
                        ],
                      ]
                        .filter(([, v]) => v !== null && v !== undefined)
                        .map(([label, value]) => (
                          <Col xs={6} md={3} key={String(label)}>
                            <p className="mb-0 text-muted small">{label}</p>
                            <p className="mb-0 small fw-semibold">{String(value)}</p>
                          </Col>
                        ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            )}

        </Row>
      </div>
    </td>
  </tr>
);

const MyApplications: React.FC = () => {
  const { data: applicantCase, isLoading } =
    useGetApplicantCaseQuery(undefined);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );

  const toggleRow = (alias: string) =>
    setExpandedRow((prev) => (prev === alias ? null : alias));

  return (
    <Card className="mb-4 p-0">
      <CardHeader className="bg-primary text-white d-flex align-items-center">
        <i className="fa fa-file-text me-2"></i>
        <h5 className="mb-0">My Applications</h5>
      </CardHeader>
      <CardBody className="p-0">
        <Table responsive hover bordered className="mb-0 text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Case #</th>
              <th>Created</th>
              <th>Category</th>
              <th>Stage</th>
              <th>Customer</th>
              <th>Joint Applicants</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicantCase?.results?.length ? (
              applicantCase.results.map((app: ApplicantCaseTypes) => (
                <React.Fragment key={app.alias}>
                  <tr>
                    <td>
                      <Link
                        className="text_decoration_hover fw-semibold"
                        href={`/client/cases/${app.alias}`}
                      >
                        {app.name}
                      </Link>
                    </td>
                    <td className="text-nowrap small">
                      {formatDateAndTime(app.created_at)}
                    </td>
                    <td>
                      {app.case_category ? (
                        <Badge
                          color={
                            categoryBadgeColor[app.case_category] || "secondary"
                          }
                          pill
                        >
                          {formatChoiceFieldValue(app.case_category)}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {app.case_stage ? (
                        <Badge
                          color={stageBadgeColor[app.case_stage] || "secondary"}
                          pill
                        >
                          {formatChoiceFieldValue(app.case_stage)}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="text-start">
                      <p className="mb-0 small fw-semibold">
                        {buildFullName(app.customer)}
                      </p>
                      <p className="mb-0 small text-muted">
                        {app.customer?.email || "-"}
                      </p>
                    </td>
                    <td>
                      {app.joint_users?.length ? (
                        <Badge pill className="border">
                          {app.joint_users.length}
                        </Badge>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td className="small">{app.customer?.phone || "-"}</td>
                    <td>
                      <div className="d-flex gap-1 justify-content-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          title={
                            expandedRow === app.alias
                              ? "Collapse details"
                              : "Expand details"
                          }
                          onClick={() => toggleRow(app.alias)}
                        >
                          <i
                            className={`fa fa-chevron-${
                              expandedRow === app.alias ? "up" : "down"
                            }`}
                          />
                        </button>
                        <Link href={`/client/cases/${app.alias}`}>
                          <button className="btn btn-primary btn-sm">
                            Continue
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === app.alias && <ExpandedRow app={app} />}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-muted py-4">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="px-3 py-2">
          <p className="mb-0 small text-success">
            Showing {applicantCase?.results?.length || 0} of{" "}
            {applicantCase?.count || 0} cases
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default MyApplications;