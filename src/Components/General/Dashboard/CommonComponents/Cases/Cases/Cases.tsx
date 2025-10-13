import { useGetCasesQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useGetAdviserDetailsQuery } from "@/Redux/Reducers/CommonComponents/Directors/AdviserDetailsApi";
import {
  CaseInfoPrpos,
  CaseUser,
} from "@/Types/CommonComponents/Cases/CaseTypes";
import { AdviserInfoProps } from "@/Types/CommonComponents/Directors/AdviserTypes";
import { getCaseUrl } from "@/utils/GetCaseUrl";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TbCirclePlus, TbFileDescription } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import AddNewCaseModal from "./Modals/AddNewCaseModal";
import DeleteCaseModal from "./Modals/DeleteCaseModal";
import UpdateCaseModal from "./Modals/UpdateCaseModal";

const Cases: React.FC = () => {
  const { data: session } = useSession();
  const [isAddNewCaseModalOpen, setIsAddNewCaseModalOpen] = useState(false);
  const [isUpdateCaseModalOpen, setIsUpdateCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<CaseInfoPrpos | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(10);
  const [filterIcon, setFilterIcon] = useState(false);
  const [isDeleteCaseModalOpen, setIsDeleteCaseModalOpen] = useState(false);

  const defaultFilters = {
    created_by: "",
    case_category: "",
    applicant_type: "",
    case_status: "",
    case_stage: "",
    is_removed: "",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const { data: adviserData, isLoading: isAdviserLoading } =
    useGetAdviserDetailsQuery(undefined);

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
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  };

  // Calculate total pages
  const pageCount = caseData?.count
    ? Math.ceil(caseData.count / casesPerPage)
    : 1;

  const userType = session?.user?.user_type;

  return (
    <>
      <Row>
        {/* // Skeleton Loading State */}
        {isLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <Col md className="mb-2" key={index}>
                <Card className="border-0 p-2 rounded-2 shadow-sm bg-white">
                  <CardBody className="p-2">
                    <div className="d-flex justify-content-between">
                      <div style={{ width: "70%" }}>
                        <div
                          className="skeleton-loading mb-2"
                          style={{ width: "80%", height: "16px" }}
                        />
                        <div
                          className="skeleton-loading"
                          style={{ width: "50%", height: "24px" }}
                        />
                      </div>
                      <div
                        className="skeleton-loading rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </>
        ) : (
          // Actual Content
          <>
            {/* All Cases  */}
            <Col md>
              <Card className="p-2 shadow">
                <CardBody className="p-2">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="small text-muted">
                        All Cases
                      </CardTitle>
                      <h4 className="mb-1 text-dark">{caseData?.count || 0}</h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-primary rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileDescription className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* Active Cases  */}
            <Col md>
              <Card className="p-2 shadow">
                <CardBody className="p-2">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="small text-muted">
                        Active Cases
                      </CardTitle>
                      <h4 className="mb-1 text-dark">
                        {caseData?.results?.filter(
                          (item: any) => !item.is_removed
                        ).length || 0}
                      </h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-success rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileDescription className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* Pending Cases  */}
            <Col md>
              <Card className="p-2 shadow">
                <CardBody className="p-2">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="small text-muted">
                        Pending Cases
                      </CardTitle>
                      <h4 className="mb-1 text-dark">10</h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-warning rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileDescription className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* Completed Cases  */}
            <Col md>
              <Card className="p-2 shadow">
                <CardBody className="p-2">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="small text-muted">
                        Completed Cases
                      </CardTitle>
                      <h4 className="mb-1 text-dark">10</h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-info rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileDescription className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </>
        )}
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <Row className="flex justify-content-between">
                <Col md="3">
                  <h3>Cases Overview</h3>
                </Col>
                <Col>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Search Case..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{ padding: "10px 10px" }}
                    />
                    <InputGroupText className="bg-success rounded-start-0 border-start-0">
                      <FaSearch />
                    </InputGroupText>
                  </InputGroup>
                </Col>
                <Col
                  md="3"
                  xs="12"
                  className="text-md-end text-center mt-2 mt-md-0 d-flex justify-content-end align-items-center gap-2"
                >
                  <Button
                    color="success"
                    onClick={toggleFilterIcon}
                    className="me-2"
                  >
                    {filterIcon ? (
                      <i className="fa-solid fa-filter-circle-xmark"></i>
                    ) : (
                      <i className="fa-solid fa-filter"></i>
                    )}
                  </Button>
                  {userType !== "ORGANIZATION_SUPPORT" && (
                    <Button
                      color="primary"
                      onClick={openAddNewCaseModal}
                      className="d-flex justify-content-center align-items-center gap-1"
                    >
                      <TbCirclePlus size={18} />
                      <span>Add New Case</span>
                    </Button>
                  )}
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-2 m-0">
              {filterIcon && (
                <Card className="shadow-lg bg-light-success rounded-3 p-3 mt-3 mb-3">
                  <Row className="justify-content-center g-3">
                    <Col xs="12" sm="6" md="3">
                      <Label>Select Employee</Label>
                      <Input
                        type="select"
                        id="employeeFilter"
                        className="py-1"
                        value={filters.created_by}
                        onChange={(e) =>
                          handleFilterChange("created_by", e.target.value)
                        }
                      >
                        <option value="">All Employee</option>
                        {adviserData?.map((adviser: AdviserInfoProps) => (
                          <option key={adviser.alias} value={adviser.user.id}>
                            {adviser.user.first_name} {adviser.user.last_name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                      <Label>Select Category</Label>
                      <Input
                        type="select"
                        id="caseCategory"
                        className="py-1"
                        value={filters.case_category}
                        onChange={(e) =>
                          handleFilterChange("case_category", e.target.value)
                        }
                      >
                        <option value="">All Categories</option>
                        <option value="MORTGAGE">Mortgage</option>
                        <option value="PROTECTION">Protection</option>
                        <option value="GENERAL_INSURANCE">
                          General Insurance
                        </option>
                      </Input>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                      <Label>Select Stage</Label>
                      <Input
                        type="select"
                        id="caseStage"
                        className="py-1"
                        value={filters.case_stage}
                        onChange={(e) =>
                          handleFilterChange("case_stage", e.target.value)
                        }
                      >
                        <option value="">All Stages</option>
                        <option value="ENQUIRY">Enquiry</option>
                        <option value="FACT_FIND">Fact Find</option>
                        <option value="RESEARCH_COMPLIANCE_CHECK">
                          Research and Compliance Check
                        </option>
                        <option value="DECISION_IN_PRINCIPLE">
                          Decision in Principle
                        </option>
                        <option value="FULL_MORTGAGE_APPLICATION">
                          Full Mortgage Application
                        </option>
                        <option value="OFFER_FROM_BANK">Offer From Bank</option>
                        <option value="LEGAL">Legal</option>
                        <option value="COMPLETION">Completion</option>
                        <option value="FUTURE_OPPORTUNITY">
                          Future Opportunity
                        </option>
                        <option value="NOT_PROCEED">Not Proceed</option>
                      </Input>
                    </Col>
                    <Col xs="12" sm="6" md="3">
                      <Label>Clear All Filters</Label>
                      <Button
                        outline
                        className="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center gap-1"
                        onClick={() => {
                          setFilters(defaultFilters);
                          setCurrentPage(1);
                        }}
                      >
                        Clear<i className="fa-solid fa-xmark"></i>
                      </Button>
                    </Col>
                  </Row>
                </Card>
              )}
              <Row>
                <Table hover responsive className="mt-3">
                  <thead className="thead-light text-center">
                    <tr>
                      <th>Case Name</th>
                      <th>Case Users</th>
                      <th>Phone</th>
                      <th>Case Category</th>
                      <th>Case Stage</th>
                      <th>Created At</th>
                      <th>Created By</th>
                      <th>Assigned To</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} className="text-center">
                          <Spinner color="primary" />
                        </td>
                      </tr>
                    ) : caseData?.results?.length > 0 ? (
                      caseData.results.map((caseItem: CaseInfoPrpos) => (
                        <tr key={caseItem.alias}>
                          <td>
                            <Link
                              className="text_decoration_hover text-truncate"
                              href={getCaseUrl(
                                caseItem.alias,
                                userType as string
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
                          <td className="text-start">
                            <ul
                              style={{
                                listStyleType: "disc",
                                paddingLeft: "40px",
                              }}
                            >
                              <li>
                                {caseItem.lead_user ? (
                                  <>
                                    {caseItem.lead_user.title
                                      ? caseItem.lead_user.title[0].toUpperCase() +
                                        caseItem.lead_user.title
                                          .slice(1)
                                          .toLowerCase() +
                                        ". "
                                      : ""}
                                    {caseItem.lead_user.first_name}{" "}
                                    {caseItem.lead_user.middle_name
                                      ? caseItem.lead_user.middle_name + " "
                                      : ""}
                                    {caseItem.lead_user.last_name}
                                    {caseItem.lead_user.user_type && (
                                      <span
                                        className="ms-1 text-muted"
                                        style={{ fontSize: "0.85em" }}
                                      >
                                        <small>
                                          (
                                          {caseItem.lead_user.user_type
                                            .split("_")
                                            .map(
                                              (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1).toLowerCase()
                                            )
                                            .join(" ")}
                                          )
                                        </small>
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  "-"
                                )}
                              </li>
                              {caseItem.joint_users &&
                              caseItem.joint_users.length > 0 ? (
                                caseItem.joint_users.map((joint: CaseUser) => (
                                  <li key={joint.alias || joint.id}>
                                    {joint.title
                                      ? joint.title[0].toUpperCase() +
                                        joint.title.slice(1).toLowerCase() +
                                        ". "
                                      : ""}
                                    {joint.first_name}{" "}
                                    {joint.middle_name
                                      ? joint.middle_name + " "
                                      : ""}
                                    {joint.last_name}
                                    {joint.user_type ? (
                                      <span
                                        className="ms-1 text-muted"
                                        style={{ fontSize: "0.85em" }}
                                      >
                                        <small>
                                          (
                                          {joint.user_type
                                            ?.split("_")
                                            .map(
                                              (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1).toLowerCase()
                                            )
                                            .join(" ")}
                                          )
                                        </small>
                                      </span>
                                    ) : null}
                                  </li>
                                ))
                              ) : (
                                <></>
                              )}
                            </ul>
                          </td>
                          <td>
                            {caseItem.lead_user.phone ? (
                              <a
                                href={`tel:${caseItem.lead_user.phone}`}
                                className="text-black text_decoration_hover"
                              >
                                {caseItem.lead_user.phone}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {caseItem.case_category
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ")}
                          </td>
                          <td>
                            {caseItem.case_stage
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ")}
                          </td>
                          <td>{formatDateToDMYAndTime(caseItem.created_at)}</td>
                          <td>
                            <p className="m-0">
                              {caseItem.created_by?.title
                                ? caseItem.created_by.title[0].toUpperCase() +
                                  caseItem.created_by.title
                                    .slice(1)
                                    .toLowerCase() +
                                  ". "
                                : ""}
                              {caseItem.created_by?.first_name}{" "}
                              {caseItem.created_by?.middle_name
                                ? caseItem.created_by.middle_name + " "
                                : ""}
                              {caseItem.created_by?.last_name}
                            </p>
                            <p
                              className="m-0 opacity-75"
                              style={{ fontSize: "9px" }}
                            >
                              (
                              {caseItem.created_by?.user_type
                                ?.split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                              )
                            </p>
                          </td>
                          <td>
                            {caseItem.assigned_user ? (
                              <>
                                <p className="m-0">
                                  {caseItem.assigned_user.title
                                    ? caseItem.assigned_user.title[0].toUpperCase() +
                                      caseItem.assigned_user.title
                                        .slice(1)
                                        .toLowerCase() +
                                      ". "
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
                                  (
                                  {caseItem.assigned_user.user_type
                                    ?.split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                    )
                                    .join(" ")}
                                  )
                                </p>
                              </>
                            ) : (
                              <span className="text-muted">Not Assigned</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <Button
                                size="sm"
                                color="success"
                                className="me-2"
                                title="Update Case"
                                onClick={() => openUpdateCaseModal(caseItem)}
                              >
                                <i className="icon-pencil-alt"></i>
                              </Button>
                              {userType !== "ORGANIZATION_SUPPORT" &&
                                userType !== "ORGANIZATION_ADVISER" && (
                                  <Button
                                    size="sm"
                                    color="danger"
                                    title="Delete Case"
                                    onClick={() =>
                                      openDeleteCaseModal(caseItem)
                                    }
                                  >
                                    <i className="icon-trash"></i>
                                  </Button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center">
                          No cases found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Row>
              <Row>
                <div className="d-flex justify-content-between px-4 py-3">
                  <div>
                    <p className="text-success">
                      Showing{" "}
                      {caseData?.results?.length
                        ? (currentPage - 1) * casesPerPage + 1
                        : 0}{" "}
                      to{" "}
                      {Math.min(
                        currentPage * casesPerPage,
                        caseData?.count || 0
                      )}{" "}
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

                    {/* Generate visible page numbers */}
                    {(() => {
                      const pages = [];
                      const total = pageCount;
                      const currentPageNumber = currentPage;

                      let start = Math.max(2, currentPageNumber - 2);
                      let end = Math.min(total - 1, currentPageNumber + 2);

                      // Always show page 1
                      pages.push(
                        <PaginationItem
                          key={1}
                          active={currentPageNumber === 1}
                        >
                          <PaginationLink onClick={() => setCurrentPage(1)}>
                            1
                          </PaginationLink>
                        </PaginationItem>
                      );

                      // Add ellipsis if needed before middle pages
                      if (start > 2) {
                        pages.push(
                          <PaginationItem key="ellipsis-start" disabled>
                            <PaginationLink>...</PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Show middle pages
                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <PaginationItem
                            key={i}
                            active={currentPageNumber === i}
                          >
                            <PaginationLink onClick={() => setCurrentPage(i)}>
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Add ellipsis if needed after middle pages
                      if (end < total - 1) {
                        pages.push(
                          <PaginationItem key="ellipsis-end" disabled>
                            <PaginationLink>...</PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Always show last page
                      if (total > 1) {
                        pages.push(
                          <PaginationItem
                            key={total}
                            active={currentPageNumber === total}
                          >
                            <PaginationLink
                              onClick={() => setCurrentPage(total)}
                            >
                              {total}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

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
        </Col>
      </Row>
    </>
  );
};

export default Cases;
