import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import ExpandedCaseRow from "@/Components/Common/Cases/ExpandedCaseRow";
import {
  caseCategories,
  insuranceCaseStages,
  mortgageStages,
} from "@/Data/Common/FilterChoiceFields";
import { useGetUserListQuery } from "@/Redux/Reducers/Common/Cases/UserFiltersListApi";
import { useGetNetworkCaseListQuery } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import { CaseInfoPrpos, CaseUser } from "@/Types/Common/Cases/CaseTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { getNetworkCaseUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useState } from "react";
import { FaInfoCircle, FaSearch, FaTrash } from "react-icons/fa";
import { TbArrowsRightLeft } from "react-icons/tb";
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

const CasesTab: React.FC = () => {
  const { data: session } = useSession();
  const { networkslug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(10);
  const [filterIcon, setFilterIcon] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const defaultFilters = {
    case_category: "",
    case_stage: "",
    assigned_to__id: "",
    assigned_to_admin__id: "",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const { data: caseData, isLoading } = useGetNetworkCaseListQuery({
    network_slug: networkslug as string,
    params: {
      search: searchQuery,
      ...filters,
      page: currentPage,
      page_size: casesPerPage,
    },
  });

  const { data: adviserData } = useGetUserListQuery({
    role: "ADVISER",
    network_slug: networkslug as string,
  });

  const { data: adminData } = useGetUserListQuery({
    role: "ADMIN",
    network_slug: networkslug as string,
  });

  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  const toggleExpandRow = (alias: string) => {
    setExpandedRow((prev) => (prev === alias ? null : alias));
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  };

  const pageCount = caseData?.count
    ? Math.ceil(caseData.count / casesPerPage)
    : 1;

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Card className="mb-0">
              <CardHeader>
                <Row className="flex justify-content-between">
                  <Col md="3">
                    <h3>Cases Overview</h3>
                  </Col>
                  <Col md={3} xs="12">
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
                        id="networkCaseSearch"
                        className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                        style={{ cursor: "pointer", zIndex: 10 }}
                      />
                      <UncontrolledPopover
                        placement="right"
                        target="networkCaseSearch"
                        trigger="hover"
                      >
                        <PopoverBody className="bg-white rounded text-dark p-3 small">
                          🔍 You Can Search Using The Lead's Name, Phone Number,
                          Email Address, Case Category, Case Status or Assigned
                          User's Name.
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
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="p-2 m-0">
                {filterIcon && (
                  <Card className="shadow-lg bg-light-secondary rounded-3 p-3 mt-3 mb-3">
                    <Row className="justify-content-center g-3">
                      <Col>
                        <Label>Select Adviser</Label>
                        <Input
                          type="select"
                          className="py-1"
                          value={filters.assigned_to__id}
                          onChange={(e) =>
                            handleFilterChange(
                              "assigned_to__id",
                              e.target.value,
                            )
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

                      <Col>
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
                          id="caseStage"
                          className="py-1"
                          value={filters.case_stage}
                          onChange={(e) =>
                            handleFilterChange("case_stage", e.target.value)
                          }
                          disabled={!filters.case_category}
                        >
                          {filters?.case_category === "MORTGAGE" ? (
                            <>
                              {mortgageStages.map((stage) => (
                                <option key={stage.value} value={stage.value}>
                                  {stage.label}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              {insuranceCaseStages.map((stage) => (
                                <option key={stage.value} value={stage.value}>
                                  {stage.label}
                                </option>
                              ))}
                            </>
                          )}
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
                          Clear <i className="fa-solid fa-xmark"></i>
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
                        <th>Applicants</th>
                        <th>Phone</th>
                        <th>Category</th>
                        <th>Adviser</th>
                        <th>Admin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="text-center">
                            <LoadingGrow />
                          </td>
                        </tr>
                      ) : caseData?.results?.length > 0 ? (
                        caseData.results.map((caseItem: CaseInfoPrpos) => (
                          <Fragment key={caseItem.alias}>
                            <tr>
                              <td>
                                <Link
                                  className="text_decoration_hover text-truncate"
                                  href={getNetworkCaseUrl(
                                    networkslug as string,
                                    caseItem.alias,
                                    session?.user?.role || "",
                                  )}
                                >
                                  {caseItem.name}
                                </Link>
                              </td>
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
                                  {caseItem.joint_users &&
                                  caseItem.joint_users.length > 0 ? (
                                    caseItem.joint_users.map(
                                      (joint: CaseUser) => (
                                        <li key={joint.alias || joint.id}>
                                          {joint.title
                                            ? formatChoiceFieldValue(
                                                joint.title,
                                              ) + " "
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
                                      ),
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </ul>
                              </td>
                              <td>
                                {caseItem.customer?.phone ? (
                                  <span className="text-black">
                                    {caseItem.customer.phone}
                                  </span>
                                ) : (
                                  <small className="text-muted">
                                    Not Available
                                  </small>
                                )}
                              </td>
                              <td className="text-truncate">
                                {caseItem.case_category ? (
                                  <>
                                    {formatChoiceFieldValue(
                                      caseItem.case_category,
                                    )}
                                    {caseItem.case_category === "MORTGAGE" &&
                                      ((caseItem.application_type &&
                                        String(
                                          caseItem.application_type,
                                        ).trim() !== "") ||
                                        (caseItem.mortgage_type &&
                                          String(
                                            caseItem.mortgage_type,
                                          ).trim() !== "")) && (
                                        <p className="small">
                                          (
                                          {caseItem.application_type
                                            ? formatChoiceFieldValue(
                                                caseItem.application_type,
                                              )
                                            : null}
                                          {caseItem.application_type &&
                                          caseItem.mortgage_type ? (
                                            <>
                                              {" "}
                                              <TbArrowsRightLeft className="text-primary" />{" "}
                                              {formatChoiceFieldValue(
                                                caseItem.mortgage_type,
                                              )}
                                            </>
                                          ) : caseItem.mortgage_type ? (
                                            <>
                                              {formatChoiceFieldValue(
                                                caseItem.mortgage_type,
                                              )}
                                            </>
                                          ) : null}
                                          )
                                        </p>
                                      )}
                                  </>
                                ) : (
                                  <small className="text-muted">
                                    Not Available
                                  </small>
                                )}
                              </td>
                              <td>
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
                                        ? caseItem.assigned_user.middle_name +
                                          " "
                                        : ""}
                                      {caseItem.assigned_user.last_name}
                                    </p>
                                    <p
                                      className="m-0 opacity-75"
                                      style={{ fontSize: "9px" }}
                                    >
                                      (
                                      {caseItem.assigned_user.email
                                        ? caseItem.assigned_user.email
                                        : "Not Found"}
                                      )
                                    </p>
                                  </>
                                ) : (
                                  <small className="text-muted">
                                    Not Assigned
                                  </small>
                                )}
                              </td>
                              <td>
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
                                        ? caseItem.assigned_admin.middle_name +
                                          " "
                                        : ""}
                                      {caseItem.assigned_admin.last_name}
                                    </p>
                                    <p
                                      className="m-0 opacity-75"
                                      style={{ fontSize: "9px" }}
                                    >
                                      (
                                      {caseItem.assigned_admin.email
                                        ? caseItem.assigned_admin.email
                                        : "Not Found"}
                                      )
                                    </p>
                                  </>
                                ) : (
                                  <small className="text-muted">
                                    Not Assigned
                                  </small>
                                )}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center gap-1">
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    title={
                                      expandedRow === caseItem.alias
                                        ? "Collapse details"
                                        : "Expand details"
                                    }
                                    onClick={() =>
                                      toggleExpandRow(caseItem.alias)
                                    }
                                  >
                                    <i
                                      className={`fa fa-chevron-${
                                        expandedRow === caseItem.alias
                                          ? "up"
                                          : "down"
                                      }`}
                                    />
                                  </button>
                                  {/* Delete button placeholder — wire up your modal here */}
                                  <Button color="danger" size="sm" disabled>
                                    <FaTrash />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            {expandedRow === caseItem.alias && (
                              <ExpandedCaseRow
                                caseItem={caseItem}
                                colSpan={7}
                              />
                            )}
                          </Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center">
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
                      <p className="text-primary">
                        Showing{" "}
                        {caseData?.results?.length
                          ? (currentPage - 1) * casesPerPage + 1
                          : 0}{" "}
                        to{" "}
                        {Math.min(
                          currentPage * casesPerPage,
                          caseData?.count || 0,
                        )}{" "}
                        of {caseData?.count || 0} cases
                      </p>
                    </div>
                    <Pagination>
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink
                          first
                          onClick={() => setCurrentPage(1)}
                        />
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
                        const currentPageNumber = currentPage;

                        let start = Math.max(2, currentPageNumber - 2);
                        let end = Math.min(total - 1, currentPageNumber + 2);

                        pages.push(
                          <PaginationItem
                            key={1}
                            active={currentPageNumber === 1}
                          >
                            <PaginationLink onClick={() => setCurrentPage(1)}>
                              1
                            </PaginationLink>
                          </PaginationItem>,
                        );

                        if (start > 2) {
                          pages.push(
                            <PaginationItem key="ellipsis-start" disabled>
                              <PaginationLink>...</PaginationLink>
                            </PaginationItem>,
                          );
                        }

                        for (let i = start; i <= end; i++) {
                          pages.push(
                            <PaginationItem
                              key={i}
                              active={currentPageNumber === i}
                            >
                              <PaginationLink onClick={() => setCurrentPage(i)}>
                                {i}
                              </PaginationLink>
                            </PaginationItem>,
                          );
                        }

                        if (end < total - 1) {
                          pages.push(
                            <PaginationItem key="ellipsis-end" disabled>
                              <PaginationLink>...</PaginationLink>
                            </PaginationItem>,
                          );
                        }

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
                            </PaginationItem>,
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
            </Card>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default CasesTab;
