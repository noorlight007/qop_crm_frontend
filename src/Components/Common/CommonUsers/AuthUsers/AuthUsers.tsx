import LoadingSpinner from "@/app/loading";
import { useGetAuthUsersQuery } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import {
  AuthUser,
  AuthUsersProps,
} from "@/Types/Common/CommonUsers/AuthUsersTypes";
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
  Pagination,
  PaginationItem,
  PaginationLink,
  PopoverBody,
  Row,
  Spinner,
  Table,
  UncontrolledPopover,
} from "reactstrap";
import AddAuthUserModal from "./Modals/AddAuthUserModal";
import UpdateAuthUserModal from "./Modals/UpdateAuthUserModal";
import ViewAuthUserModal from "./Modals/ViewAuthUserModal";

const AuthUsers: React.FC<AuthUsersProps> = ({
  title,
  authUsersPerPage = 12,
  userRole,
}) => {
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAuthUser, setSelectedAuthUser] = useState<Partial<AuthUser>>({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: null,
    joining_date: "",
    is_active: false,
    profile_image: null,
    company_name: "",
    company_address: "",
    created_at: "",
    created_by: null,
  });

  const { data: authUsersData, isLoading } = useGetAuthUsersQuery({
    role: userRole,
    page: currentPage,
    search: debouncedSearch || undefined,
  });

  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleAddUserModal = () => setIsAddUserModalOpen(!isAddUserModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);

  const openViewModal = (authUser: AuthUser) => {
    setSelectedAuthUser(authUser);
    toggleViewModal();
  };

  const openAddUserModal = () => {
    toggleAddUserModal();
  };

  const openUpdateModal = (authUser: AuthUser) => {
    setSelectedAuthUser(authUser);
    toggleUpdateModal();
  };

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

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const currentAuthUsers = authUsers;
  const totalPages = Math.ceil(totalCount / authUsersPerPage) || 1;

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

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
                className="rounded-end-1"
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
                  🔍 You can search using Name, Email Address or Phone Number.
                </PopoverBody>
              </UncontrolledPopover>
            </InputGroup>
          </Col>
          <Col
            md="3"
            xs="12"
            className="d-flex justify-content-end mt-sm-0 mt-2"
          >
            <Button color="primary" onClick={openAddUserModal}>
              <TbCirclePlus size={18} className="me-1" />
              Add {title.slice(0, -1)}
            </Button>
          </Col>
        </Row>
        <Row>
          <Table hover responsive>
            <thead className="thead-light">
              <tr className="text-center">
                <th className="text-start">Name</th>
                <th>Email</th>
                <th>Phone</th>
                {userRole === "NETWORK_COMPLIANCE" && <th>Designation</th>}
                <th>Joining Date</th>
                {userRole === "INTRODUCER" && (
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
                    <td>
                      <div className="d-flex justify-content-start align-items-center gap-1 text-truncate">
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
                            openViewModal(user);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {user?.title
                            ? formatChoiceFieldValue(user?.title)
                            : ""}{" "}
                          {user?.first_name} {user?.middle_name}{" "}
                          {user?.last_name}
                        </span>
                      </div>
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
                          className="text-black"
                        >
                          {user?.phone}
                        </a>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>

                    {userRole === "NETWORK_COMPLIANCE" && (
                      <td>
                        {user?.designation ? (
                          user?.designation
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </td>
                    )}

                    <td>
                      {user.joining_date ? (
                        formatDate(user?.joining_date)
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>

                    {userRole === "INTRODUCER" && (
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
                          onClick={() => openUpdateModal(user)}
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

        {/* Modals */}
        <ViewAuthUserModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedAuthUser={selectedAuthUser}
          userRole={userRole}
        />
        <AddAuthUserModal
          isOpen={isAddUserModalOpen}
          toggle={toggleAddUserModal}
          userRole={userRole}
          userTitle={title}
        />
        <UpdateAuthUserModal
          isOpen={isUpdateModalOpen}
          toggle={toggleUpdateModal}
          selectedAuthUser={selectedAuthUser}
          userRole={userRole}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default AuthUsers;
