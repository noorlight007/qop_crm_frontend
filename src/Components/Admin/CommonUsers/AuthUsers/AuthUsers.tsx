import { useGetAuthUsersQuery } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import { formatDate, formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  PopoverBody,
  Row,
  Spinner,
  Table,
  UncontrolledPopover,
} from "reactstrap";

// Define your network and role options
const NETWORK_OPTIONS = [
  { value: "", label: "All Networks" },
  { value: "cityplus", label: "CityPlus" },
  // Add more network options as needed
];

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "NETWORK_ADVISER", label: "Network Adviser" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  // Add more role options as needed
];

const AuthUsers: React.FC<AuthUsersProps> = ({
  title,
  authUsersPerPage = 10,
}) => {
  const pathname = window.location.pathname;
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  
  // New state for network and role filters
  const [selectedNetwork, setSelectedNetwork] = useState("cityplus");
  const [selectedRole, setSelectedRole] = useState("NETWORK_ADVISER");

  const { data: authUsersData, isLoading } = useGetAuthUsersQuery({
    network: selectedNetwork || undefined,
    role: selectedRole || undefined,
    page: currentPage,
    page_size: authUsersPerPage,
    search: debouncedSearch || undefined,
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    if (authUsersData) {
      if (Array.isArray(authUsersData)) {
        setAuthUsers(authUsersData || []);
        setTotalCount(authUsersData.length || 0);
      } else if (authUsersData.results) {
        setAuthUsers(authUsersData.results || []);
        setTotalCount(authUsersData.count || 0);
      } else {
        setAuthUsers([]);
        setTotalCount(0);
      }
    }
  }, [authUsersData]);

  // Reset to page 1 when filters change
  const handleNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedNetwork(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const currentAuthUsers = authUsers;
  const totalPages = Math.ceil(totalCount / authUsersPerPage) || 1;

  return (
    <Card>
      <CardBody>
        <Row className="d-flex justify-content-between py-4">
          <Col md="3" xs="12">
            <h2>{title}</h2>
          </Col>
          <Col md={3} xs="12">
            <InputGroup className="position-relative">
              <FaSearch
                className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                style={{ zIndex: 10, pointerEvents: "none" }}
              />
              <Input
                type="text"
                placeholder="Search... "
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ padding: "10px 10px 10px 25px" }}
              />
              <FaInfoCircle
                id="complianceAssistantSearch"
                className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                style={{ cursor: "pointer", zIndex: 10 }}
              />

              <UncontrolledPopover
                placement="right"
                target="complianceAssistantSearch"
                trigger="hover"
              >
                <PopoverBody className="bg-white rounded text-dark p-3 small">
                  🔍 You can search using Title(e.g., Mr, Ms), First Name,
                  Middle Name, Last Name, Email Address or Phone Number.
                </PopoverBody>
              </UncontrolledPopover>
            </InputGroup>
          </Col>
          <Col
            md="3"
            xs="12"
            className="d-flex justify-content-end mt-sm-0 mt-2"
          >
            <Button
              color="primary"
              // onClick={openAddUserModal}
            >
              <TbCirclePlus size={18} className="me-1" />
              Add {title.slice(0, -1)}
            </Button>
          </Col>
        </Row>

        {/* Filter Row for Network and Role */}
        <Row className="mb-3">
          <Col md="3" xs="12" className="mb-2 mb-md-0">
            <Label for="networkFilter" className="fw-semibold">
              Network
            </Label>
            <Input
              type="select"
              id="networkFilter"
              value={selectedNetwork}
              onChange={handleNetworkChange}
            >
              {NETWORK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="3" xs="12">
            <Label for="roleFilter" className="fw-semibold">
              Role
            </Label>
            <Input
              type="select"
              id="roleFilter"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
          </Col>
        </Row>

        <Row>
          <Table hover responsive>
            <thead className="thead-light">
              <tr className="text-center">
                <th className="text-start">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joining Date</th>
                {pathname !== "/organisation/director/introducers" && (
                  <th>Gender</th>
                )}
                {pathname === "/organisation/director/introducers" && (
                  <>
                    <th>Company Name</th>
                    <th>Company Address</th>
                  </>
                )}
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner color="primary" />
                    </div>
                  </td>
                </tr>
              ) : currentAuthUsers.length > 0 ? (
                currentAuthUsers.map((user) => (
                  <tr key={user.alias} className="text-center">
                    <td className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                      <span
                        className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                        style={{ width: 40, height: 40 }}
                      >
                        {user?.profile_image ? (
                          <Image
                            src={user.profile_image}
                            alt="Profile"
                            width={35}
                            height={35}
                            className="rounded-circle"
                          />
                        ) : (
                          <User size={30} className="text-primary" />
                        )}
                      </span>
                      <span
                        className="text_decoration_hover"
                        onClick={() => {
                          //   openViewModal(user);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {user?.title ? formatChoiceFieldValue(user?.title) : ""}{" "}
                        {user?.first_name} {user?.middle_name} {user?.last_name}
                      </span>
                    </td>
                    <td>
                      {user?.email ? (
                        user.email
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {user?.phone ? (
                        <a
                          href={`tel:${user?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {user?.phone}
                        </a>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>

                    <td>
                      {user.joining_date ? (
                        formatDate(user?.joining_date)
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    {pathname !== "/organisation/director/introducers" && (
                      <td>
                        {user?.gender ? (
                          formatChoiceFieldValue(user?.gender)
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </td>
                    )}
                    {pathname === "/organisation/director/introducers" && (
                      <>
                        <td>
                          {user?.company_name || (
                            <small className="text-muted">Not Available</small>
                          )}
                        </td>
                        <td>
                          {user?.company_address || (
                            <small className="text-muted">Not Available</small>
                          )}
                        </td>
                      </>
                    )}
                    <td>
                      {formatDateAndTime(user?.created_at) || (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {user?.is_active ? (
                        <Badge color="success">Approved</Badge>
                      ) : (
                        <Badge color="danger">Pending</Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2 align-items-center">
                        <Button
                          color="primary"
                          size="sm"
                          title="Update User"
                          //   onClick={() => openUpdateModal(user)}
                        >
                          <i className="icon-pencil-alt"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No users available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
        <Row>
          <div className="d-flex justify-content-between align-items-center p-3">
            <div className="px-2">
              <p className="text-primary">
                Showing{" "}
                {totalCount === 0
                  ? "0"
                  : (currentPage - 1) * authUsersPerPage + 1}{" "}
                to{" "}
                {currentAuthUsers.length === 0
                  ? 0
                  : (currentPage - 1) * authUsersPerPage +
                    currentAuthUsers.length}{" "}
                of {totalCount} Users
              </p>
            </div>
            <Pagination className="d-flex justify-content-end p-2">
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first onClick={() => setCurrentPage(1)} />
              </PaginationItem>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>

              {totalPages <= 7 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <PaginationItem
                      key={pageNumber}
                      active={pageNumber === currentPage}
                    >
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )
              ) : (
                <>
                  <PaginationItem active={currentPage === 1}>
                    <PaginationLink onClick={() => setCurrentPage(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {currentPage > 3 && (
                    <PaginationItem disabled>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )}

                  {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                    .filter(
                      (pageNumber) => pageNumber > 1 && pageNumber < totalPages,
                    )
                    .map((pageNumber) => (
                      <PaginationItem
                        key={pageNumber}
                        active={pageNumber === currentPage}
                      >
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {currentPage < totalPages - 2 && (
                    <PaginationItem disabled>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem active={currentPage === totalPages}>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  next
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  last
                  onClick={() => setCurrentPage(totalPages)}
                />
              </PaginationItem>
            </Pagination>
          </div>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AuthUsers;