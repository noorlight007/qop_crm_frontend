import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import {
  caseCategories,
  insuranceCaseStages,
  mortgageStages,
} from "@/Data/Common/FilterChoiceFields";
import { useGetCasesQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { useGetUserListQuery } from "@/Redux/Reducers/Common/Cases/UserFiltersListApi";
import { useGetUsersQuery } from "@/Redux/Reducers/Common/CommonUsers/UsersApi";
import { CaseInfoPrpos, CaseUser } from "@/Types/Common/Cases/CaseTypes";
import { getCaseUrl } from "@/utils/RedirectPaths";
import { formatDate } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  PopoverBody,
  Row,
  Table,
  UncontrolledPopover,
} from "reactstrap";
import CaesSummary from "./CaesSummary/CaesSummary";
import AddNewCaseModal from "./Modals/AddNewCaseModal";
import DeleteCaseModal from "./Modals/DeleteCaseModal";
import UpdateCaseModal from "./Modals/UpdateCaseModal";

interface CasesProps {
  initialIsRemoved?: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// Expanded row — shows the hidden columns when the user clicks the eye icon
// ────────────────────────────────────────────────────────────────────────────────
const ExpandedCaseRow: React.FC<{
  caseItem: CaseInfoPrpos;
  colSpan: number;
}> = ({ caseItem, colSpan }) => {
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
            {/* Lender */}
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

            {/* Case Stage & Review Date */}
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

            {/* Category Details */}
            {caseItem.case_category === "MORTGAGE" && (
              <Col md={4}>
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
              <Col md={4}>
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

            {/* Security Property */}
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

// ────────────────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────────────────
const Cases: React.FC<CasesProps> = ({ initialIsRemoved }) => {
  const { data: session } = useSession();
  const [isAddNewCaseModalOpen, setIsAddNewCaseModalOpen] = useState(false);
  const [isUpdateCaseModalOpen, setIsUpdateCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<CaseInfoPrpos | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(12);
  const [filterIcon, setFilterIcon] = useState(false);
  const [isDeleteCaseModalOpen, setIsDeleteCaseModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // ← NEW

  const defaultFilters = {
    created_by__id: "",
    assigned_to__id: "",
    assigned_to_admin__id: "",
    case_category: "",
    case_stage: "",
    is_removed: initialIsRemoved ?? "",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const { data: adviserData, isLoading: isAdviserLoading } =
    useGetUserListQuery({ role: "ADVISER" });

  const { data: adminData, isLoading: isAdminLoading } = useGetUserListQuery({
    role: "ADMIN",
  });

  const { data: usersData } = useGetUsersQuery(undefined);

  const { data: caseData, isLoading: isCaseLoading } = useGetCasesQuery({
    search: searchQuery,
    ...filters,
    page: currentPage,
    limit: casesPerPage,
  });

  const isLoading = isAdviserLoading || isCaseLoading;

  const toggleFilterIcon = () => setFilterIcon(!filterIcon);
  const toggleAddNewCaseModal = () =>
    setIsAddNewCaseModalOpen(!isAddNewCaseModalOpen);
  const toggleUpdateCaseModal = () =>
    setIsUpdateCaseModalOpen(!isUpdateCaseModalOpen);
  const toggleDeleteCaseModal = () =>
    setIsDeleteCaseModalOpen(!isDeleteCaseModalOpen);

  const openAddNewCaseModal = () => toggleAddNewCaseModal();
  const openUpdateCaseModal = (caseItem: CaseInfoPrpos) => {
    setCurrentCase(caseItem);
    toggleUpdateCaseModal();
  };
  const openDeleteCaseModal = (caseItem: CaseInfoPrpos) => {
    setCurrentCase(caseItem);
    toggleDeleteCaseModal();
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterKey]: value }));
    setCurrentPage(1);
  };

  // Toggle expanded row — collapse if already open
  const toggleExpandRow = (alias: string) =>
    setExpandedRow((prev) => (prev === alias ? null : alias));

  const pageCount = caseData?.count
    ? Math.ceil(caseData.count / casesPerPage)
    : 1;

  const userRole = session?.user?.role;

  // How many columns the expanded row must span
  const tableColSpan = 7;

  return (
    <div>
      <CaesSummary />
      <Card>
        <CardHeader>
          <Row className="flex justify-content-between">
            <Col md="3">
              <h3>Cases</h3>
            </Col>
            <Col md="3" xs="12">
              <InputGroup className="position-relative">
                <FaSearch
                  className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                  style={{ zIndex: 10, pointerEvents: "none" }}
                />
                <Input
                  type="text"
                  placeholder="Search Case..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ padding: "10px 27px 10px 25px" }}
                  className="rounded-end-1"
                />
                <FaInfoCircle
                  id="caseSearchSuggestion"
                  className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                  style={{ cursor: "pointer", zIndex: 10 }}
                />
                <UncontrolledPopover
                  placement="right"
                  target="caseSearchSuggestion"
                  trigger="hover"
                >
                  <PopoverBody className="bg-white rounded text-dark p-3 small">
                    🔍 You Can Search Using The Client Name, Phone Number, Email
                    Address, Case Category, Case Status or Assigned User Name.
                  </PopoverBody>
                </UncontrolledPopover>
              </InputGroup>
            </Col>
            <Col
              md="3"
              xs="12"
              className="text-md-end text-center mt-2 mt-md-0 d-flex justify-content-end align-items-center gap-2"
            >
              <Button
                color="secondary"
                onClick={toggleFilterIcon}
                className="me-2"
              >
                {filterIcon ? (
                  <i className="fa-solid fa-filter-circle-xmark"></i>
                ) : (
                  <i className="fa-solid fa-filter"></i>
                )}
              </Button>
              <Button
                color="primary"
                onClick={openAddNewCaseModal}
                className="d-flex justify-content-center align-items-center gap-1"
              >
                <TbCirclePlus size={18} />
                <span>Add New Case</span>
              </Button>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-2 m-0">
          {filterIcon && (
            <Card className="shadow-lg bg-light-secondary rounded-3 p-3 mt-3 mb-3">
              <Row className="justify-content-center g-3">
                <Col>
                  <Label>Select Created By</Label>
                  <Input
                    type="select"
                    className="py-1"
                    value={filters.created_by__id}
                    onChange={(e) =>
                      handleFilterChange("created_by__id", e.target.value)
                    }
                  >
                    <option value="">All Users</option>
                    {usersData?.map((user: any) => (
                      <option key={user.alias} value={user.id}>
                        {user?.name}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col>
                  <Label>Select Adviser</Label>
                  <Input
                    type="select"
                    className="py-1"
                    value={filters.assigned_to__id}
                    onChange={(e) =>
                      handleFilterChange("assigned_to__id", e.target.value)
                    }
                  >
                    <option value="">All Users</option>
                    {adviserData?.map((adviser: any) => (
                      <option key={adviser.alias} value={adviser.id}>
                        {adviser.name}
                      </option>
                    ))}
                  </Input>
                </Col>
                {session?.user?.is_network ? null : (
                  <Col>
                    <Label>Select Admin</Label>
                    <Input
                      type="select"
                      className="py-1"
                      value={filters.assigned_to_admin__id}
                      onChange={(e) =>
                        handleFilterChange(
                          "assigned_to_admin__id",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">All Users</option>
                      {adminData?.map((admin: any) => (
                        <option key={admin.alias} value={admin.id}>
                          {admin.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                )}

                <Col>
                  <Label>Select Category</Label>
                  <Input
                    type="select"
                    className="py-1"
                    value={filters.case_category}
                    onChange={(e) =>
                      handleFilterChange("case_category", e.target.value)
                    }
                  >
                    {caseCategories?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col>
                  <Label>Select Stage</Label>
                  <Input
                    type="select"
                    className="py-1"
                    value={filters.case_stage}
                    onChange={(e) =>
                      handleFilterChange("case_stage", e.target.value)
                    }
                    disabled={!filters.case_category}
                  >
                    {filters?.case_category === "MORTGAGE"
                      ? mortgageStages.map((stage) => (
                          <option key={stage.value} value={stage.value}>
                            {stage.label}
                          </option>
                        ))
                      : insuranceCaseStages.map((stage) => (
                          <option key={stage.value} value={stage.value}>
                            {stage.label}
                          </option>
                        ))}
                  </Input>
                </Col>
                <Col>
                  <Label>Clear All Filters</Label>
                  <Button
                    outline
                    color="danger"
                    className="w-100 d-flex justify-content-center align-items-center gap-1"
                    onClick={() => {
                      setFilters(defaultFilters);
                      setCurrentPage(1);
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>Clear
                  </Button>
                </Col>
              </Row>
            </Card>
          )}

          <Row>
            <Table hover responsive className="mt-3">
              <thead className="thead-light text-center">
                <tr>
                  <th>Case ID</th>
                  <th>Applicants</th>
                  <th>Case Category</th>
                  {session?.user?.role && session.user.is_network ? (
                    <th>Organisation</th>
                  ) : null}
                  <th>Adviser</th>
                  <th>Admin</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan={tableColSpan} className="text-center">
                      <LoadingGrow />
                    </td>
                  </tr>
                ) : caseData?.results?.length > 0 ? (
                  caseData.results.map((caseItem: CaseInfoPrpos) => (
                    // Use React.Fragment so each row can be followed by its
                    // expanded details row without breaking table structure
                    <React.Fragment key={caseItem.alias}>
                      <tr>
                        {/* ── Case ID ── */}
                        <td>
                          <Link
                            className="text_decoration_hover text-truncate"
                            href={getCaseUrl(
                              caseItem.alias,
                              userRole as string,
                              session?.user?.is_network,
                            )}
                          >
                            {caseItem.is_removed ? (
                              <s className="text-danger opacity-50">
                                {caseItem.name}
                              </s>
                            ) : (
                              caseItem.name
                            )}
                          </Link>
                        </td>

                        {/* ── Applicants ── */}
                        <td className="text-start text-truncate">
                          <ul
                            style={{
                              listStyleType: "disc",
                              paddingLeft: "40px",
                            }}
                          >
                            <li>
                              {caseItem.customer ? (
                                <>
                                  {caseItem.customer.title
                                    ? formatChoiceFieldValue(
                                        caseItem.customer.title,
                                      ) + " "
                                    : ""}
                                  {caseItem.customer.first_name}{" "}
                                  {caseItem.customer.middle_name
                                    ? caseItem.customer.middle_name + " "
                                    : ""}
                                  {caseItem.customer.last_name}
                                </>
                              ) : (
                                <small className="text-muted">
                                  Not Available
                                </small>
                              )}
                            </li>
                            {(caseItem.joint_users?.length ?? 0) > 0 &&
                              caseItem?.joint_users?.map((joint: CaseUser) => (
                                <li key={joint.alias || joint.id}>
                                  {joint.title
                                    ? formatChoiceFieldValue(joint.title) + " "
                                    : ""}
                                  {joint.first_name}{" "}
                                  {joint.middle_name
                                    ? joint.middle_name + " "
                                    : ""}
                                  {joint.last_name}
                                  <small style={{ fontSize: "9px" }}>
                                    (JA)
                                  </small>
                                </li>
                              ))}
                          </ul>
                        </td>

                        {/* ── Case Category ── */}
                        <td className="text-truncate">
                          {caseItem.case_category ? (
                            <>
                              {formatChoiceFieldValue(caseItem.case_category)}
                            </>
                          ) : (
                            <small className="text-muted">Not Available</small>
                          )}
                        </td>

                        {session?.user?.role && session.user.is_network ? (
                          <td className="text-truncate">
                            {" "}
                            {caseItem.organization?.name ? (
                              caseItem.organization.name
                            ) : (
                              <small className="text-muted">
                                Owned by Network
                              </small>
                            )}{" "}
                          </td>
                        ) : null}

                        {/* ── Adviser ── */}
                        <td className="text-truncate">
                          {caseItem.assigned_user ? (
                            <>
                              <p className="m-0">
                                {caseItem.assigned_user.title
                                  ? formatChoiceFieldValue(
                                      caseItem.assigned_user.title,
                                    ) + " "
                                  : ""}
                                {caseItem.assigned_user.first_name}{" "}
                                {caseItem.assigned_user.middle_name
                                  ? caseItem.assigned_user.middle_name + " "
                                  : ""}
                                {caseItem.assigned_user.last_name}
                              </p>
                              <p
                                className="m-0 opacity-75"
                                style={{ fontSize: "9px" }}
                              >
                                ({caseItem.assigned_user.email ?? ""})
                              </p>
                            </>
                          ) : (
                            <small className="text-muted">Not Assigned</small>
                          )}
                        </td>

                        {/* ── Admin ── */}
                        <td className="text-truncate">
                          {caseItem.assigned_admin ? (
                            <>
                              <p className="m-0">
                                {caseItem.assigned_admin.title
                                  ? formatChoiceFieldValue(
                                      caseItem.assigned_admin.title,
                                    ) + " "
                                  : ""}
                                {caseItem.assigned_admin.first_name}{" "}
                                {caseItem.assigned_admin.middle_name
                                  ? caseItem.assigned_admin.middle_name + " "
                                  : ""}
                                {caseItem.assigned_admin.last_name}
                              </p>
                              <p
                                className="m-0 opacity-75"
                                style={{ fontSize: "9px" }}
                              >
                                ({caseItem.assigned_admin.email ?? ""})
                              </p>
                            </>
                          ) : (
                            <small className="text-muted">Not Assigned</small>
                          )}
                        </td>

                        {/* ── Actions ── */}
                        <td>
                          <div className="d-flex justify-content-center align-items-center gap-1">
                            {/* Expand / collapse details */}
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              title={
                                expandedRow === caseItem.alias
                                  ? "Collapse details"
                                  : "Expand details"
                              }
                              onClick={() => toggleExpandRow(caseItem.alias)}
                            >
                              <i
                                className={`fa fa-chevron-${
                                  expandedRow === caseItem.alias ? "up" : "down"
                                }`}
                              />
                            </button>

                            {/* Edit */}
                            <Button
                              size="sm"
                              color="success"
                              title="Update Case"
                              onClick={() => openUpdateCaseModal(caseItem)}
                            >
                              <i className="icon-pencil-alt"></i>
                            </Button>

                            {/* Delete — role-gated, same as before */}
                            {session?.user?.role &&
                              ((session.user.is_network &&
                                (session.user.role === "DIRECTOR" ||
                                  session.user.role === "COMPLIANCE")) ||
                                (!session.user.is_network &&
                                  session.user.role === "DIRECTOR")) && (
                                <Button
                                  size="sm"
                                  color="danger"
                                  title="Delete Case"
                                  onClick={() => openDeleteCaseModal(caseItem)}
                                >
                                  <i className="icon-trash"></i>
                                </Button>
                              )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded details row */}
                      {expandedRow === caseItem.alias && (
                        <ExpandedCaseRow
                          caseItem={caseItem}
                          colSpan={tableColSpan}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableColSpan} className="text-center">
                      No cases found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>

          {/* Pagination — unchanged */}
          <Row>
            <div className="d-flex justify-content-between px-4 py-3">
              <div>
                <p className="text-primary">
                  Showing{" "}
                  {caseData?.results?.length
                    ? (currentPage - 1) * casesPerPage + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(currentPage * casesPerPage, caseData?.count || 0)}{" "}
                  of {caseData?.count || 0} cases
                </p>
              </div>
              <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>
                {(() => {
                  const pages = [];
                  const total = pageCount;
                  const curr = currentPage;
                  let start = Math.max(2, curr - 2);
                  let end = Math.min(total - 1, curr + 2);

                  pages.push(
                    <PaginationItem key={1} active={curr === 1}>
                      <PaginationLink onClick={() => setCurrentPage(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>,
                  );
                  if (start > 2)
                    pages.push(
                      <PaginationItem key="ellipsis-start" disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>,
                    );
                  for (let i = start; i <= end; i++)
                    pages.push(
                      <PaginationItem key={i} active={curr === i}>
                        <PaginationLink onClick={() => setCurrentPage(i)}>
                          {i}
                        </PaginationLink>
                      </PaginationItem>,
                    );
                  if (end < total - 1)
                    pages.push(
                      <PaginationItem key="ellipsis-end" disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>,
                    );
                  if (total > 1)
                    pages.push(
                      <PaginationItem key={total} active={curr === total}>
                        <PaginationLink onClick={() => setCurrentPage(total)}>
                          {total}
                        </PaginationLink>
                      </PaginationItem>,
                    );
                  return pages;
                })()}
                <PaginationItem disabled={currentPage === pageCount}>
                  <PaginationLink
                    next
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
                <PaginationItem disabled={currentPage === pageCount}>
                  <PaginationLink
                    last
                    onClick={() => setCurrentPage(pageCount)}
                  />
                </PaginationItem>
              </Pagination>
            </div>
          </Row>
        </CardBody>

        <AddNewCaseModal
          isOpen={isAddNewCaseModalOpen}
          toggle={toggleAddNewCaseModal}
        />
        <UpdateCaseModal
          isOpen={isUpdateCaseModalOpen}
          toggle={toggleUpdateCaseModal}
          caseData={currentCase as CaseInfoPrpos}
        />
        <DeleteCaseModal
          isOpen={isDeleteCaseModalOpen}
          toggle={toggleDeleteCaseModal}
          caseData={currentCase}
          onDelete={toggleDeleteCaseModal}
        />
      </Card>
    </div>
  );
};

export default Cases;
