import {
  useGetAuthUsersQuery,
  useGetNetworkListQuery,
  useGetOrganisationListQuery,
  useUpdateAuthUserDetailsMutation,
} from "@/Redux/Reducers/Admin/CommonUsers/AuthUsersApi";
import {
  AuthUser,
  AuthUsersProps,
} from "@/Types/Admin/Common/AuthUsers/AuthUserType";
import { formatDate, formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import {
  FaCheckCircle,
  FaChevronDown,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import { TbCopy } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
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
import Swal from "sweetalert2";
import DeleteAuthUserModal from "./Modals/DeleteAuthUserModal";
import UpdateAuthUserModal from "./Modals/UpdateAuthUserModal";
import ViewAuthUserModal from "./Modals/ViewAuthUserModal";

const AuthUsers: React.FC<AuthUsersProps> = ({
  title,
  authUsersPerPage = 12,
  roles,
}) => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Updated state for network and organization filters
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedOrganisation, setSelectedOrganisation] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const role = roles;

  const [selectedAuthUser, setSelectedAuthUser] = useState<Partial<AuthUser>>({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: null,
    is_active: false,
    profile_image: null,
    created_at: "",
    created_by: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleDropdown = (userAlias: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [userAlias]: !prev[userAlias],
    }));
  };

  // Fetch network and organization lists
  const { data: networkList, isLoading: networkListLoading } =
    useGetNetworkListQuery(undefined);
  const { data: orgList, isLoading: orgListLoading } =
    useGetOrganisationListQuery({
      network: selectedNetwork,
    });

  const {
    data: authUsersData,
    isLoading,
    isFetching,
    isError,
  } = useGetAuthUsersQuery(
    {
      role,
      network: selectedNetwork || undefined,
      organisation: selectedOrganisation || undefined,
      page: currentPage,
      page_size: authUsersPerPage,
      search: debouncedSearch || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [updateStatusData, isUpdateStatusLoading] =
    useUpdateAuthUserDetailsMutation();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const authUsers =
    isFetching || isError
      ? []
      : Array.isArray(authUsersData)
        ? authUsersData
        : (authUsersData?.results ?? []);

  const totalCount =
    isFetching || isError
      ? 0
      : Array.isArray(authUsersData)
        ? authUsersData.length
        : (authUsersData?.count ?? 0);

  const handleNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedNetwork(e.target.value);
    setSelectedOrganisation("");
    setCurrentPage(1);
  };

  const handleOrganisationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOrganisation(e.target.value);
    setCurrentPage(1);
  };

  const statusOptions = [
    { value: true, label: "Approved" },
    { value: false, label: "Pending" },
  ];

  // Status color map
  const statusColorMap = {
    true: "success",
    false: "danger",
  };

  // Handle status change
  const handleStatusChange = async (userAlias: string, newStatus: boolean) => {
    try {
      const result = await updateStatusData({
        user_alias: userAlias, // Changed from 'alias' to 'userAlias'
        payload: { is_active: newStatus },
      }).unwrap();
      Swal.fire("Success", "Status Updated Successfully!", "success");
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
    }
  };

  const openViewModal = (authUser: AuthUser) => {
    setSelectedAuthUser(authUser);
    toggleViewModal();
  };

  const openUpdateModal = (authUser: AuthUser) => {
    setSelectedAuthUser(authUser);
    toggleUpdateModal();
  };

  const openDeleteModal = (authUser: AuthUser) => {
    setSelectedAuthUser(authUser);
    toggleDeleteModal();
  };

  const currentAuthUsers = authUsers;
  const totalPages = Math.ceil(totalCount / authUsersPerPage) || 1;

  const [copiedEmailAlias, setCopiedEmailAlias] = useState<string | null>(null);

  const handleCopyEmail = (email: string, alias: string) => {
    if (!email) return;
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopiedEmailAlias(alias);
        setTimeout(() => setCopiedEmailAlias(null), 2000);
      })
      .catch(() => {
        const el = document.createElement("textarea");
        el.value = email;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopiedEmailAlias(alias);
        setTimeout(() => setCopiedEmailAlias(null), 2000);
      });
  };

  return (
    <Card>
      <CardBody>
        <Row className="d-flex justify-content-between py-4">
          <Col>
            <h2>{title}s</h2>
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
                className="rounded end-1"
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
                  🔍 You can search using Name, Email Address or Phone Number.
                </PopoverBody>
              </UncontrolledPopover>
            </InputGroup>
          </Col>
          <Col md={3}>
            <Input
              type="select"
              id="networkFilter"
              value={selectedNetwork}
              onChange={handleNetworkChange}
              disabled={networkListLoading}
              style={{ paddingTop: "0.4rem", paddingBottom: "0.4rem" }}
            >
              {networkListLoading ? (
                <option disabled>Loading...</option>
              ) : (
                <>
                  <option value="">Select a Network</option>
                  {(Array.isArray(networkList)
                    ? networkList
                    : (networkList?.results ?? [])
                  )?.map((network: any) => (
                    <option key={network.subdomain} value={network.subdomain}>
                      {network.name}
                    </option>
                  ))}
                </>
              )}
            </Input>
          </Col>
          {roles !== "COMPLIANCE" && (
            <Col md={3}>
              <Input
                type="select"
                id="organisationFilter"
                value={selectedOrganisation}
                onChange={handleOrganisationChange}
                disabled={orgListLoading || !selectedNetwork}
                style={{ paddingTop: "0.4rem", paddingBottom: "0.4rem" }}
              >
                <option value="">Select an Organisation</option>
                {orgListLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  (Array.isArray(orgList)
                    ? orgList
                    : (orgList?.results ?? [])
                  ).map((org: any, index: any) => (
                    <option
                      key={org.subdomain || `${org.name}-${index}`}
                      value={org.subdomain || org.name}
                    >
                      {org.name}
                    </option>
                  ))
                )}
              </Input>
            </Col>
          )}
          <Col md={1}>
            <Button
              outline
              color="danger"
              className="w-100 d-flex justify-content-center align-items-center gap-1"
              onClick={() => {
                setSelectedNetwork("");
                setSelectedOrganisation("");
                setSearchQuery("");
                setCurrentPage(1);
              }}
            >
              <i className="fa-solid fa-xmark"></i>Clear
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
                {roles === "COMPLIANCE" && <th>Designation</th>}
                <th>Joining Date</th>
                {session?.user?.user_type === "ADMIN" &&
                  roles !== "LEAD" &&
                  roles !== "CLIENT" && <th>Network</th>}
                {session?.user?.user_type === "ADMIN" &&
                  roles !== "LEAD" &&
                  roles !== "CLIENT" && <th>Organisation</th>}
                <th>Created By</th>
                <th>Created At</th>
                {roles !== "LEAD" && roles !== "CLIENT" && <th>Status</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={10} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner color="primary" />
                    </div>
                  </td>
                </tr>
              ) : currentAuthUsers.length > 0 ? (
                currentAuthUsers.map((user: any) => (
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
                        <span
                          className="d-flex justify-content-center align-items-center gap-2"
                          style={{ minWidth: 0 }}
                        >
                          <span className="text-truncate" title={user.email}>
                            {user.email}
                          </span>
                          <span
                            style={{ cursor: "pointer", flexShrink: 0 }}
                            onClick={() =>
                              handleCopyEmail(user.email, user.alias)
                            }
                          >
                            {copiedEmailAlias === user.alias ? (
                              <FaCheckCircle size={12}/>
                            ) : (
                              <TbCopy size={12}/>
                            )}
                          </span>
                        </span>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {user?.phone ? (
                        <a className="text-black">{user?.phone}</a>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    {roles === "COMPLIANCE" && (
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
                    {session?.user?.user_type === "ADMIN" &&
                      roles !== "LEAD" &&
                      roles !== "CLIENT" && (
                        <>
                          <td className="text-truncate">
                            {user?.network || (
                              <small className="text-muted">
                                Not Specified
                              </small>
                            )}
                          </td>
                          <td className="text-truncate">
                            {user?.organisation || (
                              <small className="text-muted">
                                Not Specified
                              </small>
                            )}
                          </td>
                        </>
                      )}
                    {user?.created_by?.name ? (
                      <td>
                        <p className="m-0">{user?.created_by.name}</p>
                        <p
                          className="m-0 opacity-75"
                          style={{ fontSize: "9px" }}
                        >
                          {user?.created_by?.email}
                        </p>
                        <p
                          className="m-0 opacity-75"
                          style={{ fontSize: "9px" }}
                        >
                          ({formatChoiceFieldValue(user?.created_by?.user_type)}
                          )
                        </p>
                      </td>
                    ) : (
                      <td>
                        <small className="text-muted">Not Available</small>
                      </td>
                    )}

                    <td>
                      {formatDateAndTime(user?.created_at) || (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    {/* Status with Dropdown */}
                    {roles !== "LEAD" && roles !== "CLIENT" && (
                      <td>
                        <div style={{ position: "relative" }}>
                          <Dropdown
                            isOpen={dropdownOpen[user.alias] || false}
                            toggle={() => toggleDropdown(user.alias)}
                          >
                            <DropdownToggle
                              tag="span"
                              style={{ cursor: "pointer" }}
                              caret={false}
                            >
                              <Badge
                                color={user?.is_active ? "success" : "danger"}
                                className="d-flex justify-content-center align-items-center gap-1"
                                style={{ cursor: "pointer" }}
                              >
                                <span>
                                  {user?.is_active ? "Approved" : "Pending"}
                                </span>
                                <FaChevronDown size={10} />
                              </Badge>
                            </DropdownToggle>

                            <DropdownMenu
                              className="shadow-sm py-2"
                              style={{
                                minWidth: "140px",
                                zIndex: 1050,
                              }}
                              container="body"
                            >
                              {statusOptions.map((option) => {
                                const isActive =
                                  user.is_active === option.value;
                                const colorClass =
                                  statusColorMap[
                                    option.value.toString() as "true" | "false"
                                  ];

                                return (
                                  <DropdownItem
                                    key={option.value.toString()}
                                    onClick={() =>
                                      handleStatusChange(
                                        user.alias,
                                        option.value,
                                      )
                                    }
                                    className="d-flex align-items-center gap-3 px-3 py-2"
                                    active={isActive}
                                    style={{
                                      backgroundColor: isActive
                                        ? "rgba(0,0,0,0.05)"
                                        : "transparent",
                                    }}
                                  >
                                    <span
                                      className={`rounded-circle bg-${colorClass}`}
                                      style={{ width: "8px", height: "8px" }}
                                    />
                                    <span className={isActive ? "fw-bold" : ""}>
                                      {option.label}
                                    </span>
                                    {isActive && (
                                      <span className="ms-auto">✓</span>
                                    )}
                                  </DropdownItem>
                                );
                              })}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </td>
                    )}

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
                        {roles !== "DIRECTOR" && (
                          <Button
                            color="danger"
                            size="sm"
                            title="Delete User"
                            onClick={() => openDeleteModal(user)}
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center">
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
      <ViewAuthUserModal
        isOpen={isViewModalOpen}
        toggle={toggleViewModal}
        selectedAuthUser={selectedAuthUser}
      />

      <UpdateAuthUserModal
        title={title}
        isOpen={isUpdateModalOpen}
        toggle={toggleUpdateModal}
        selectedAuthUser={selectedAuthUser}
      />

      <DeleteAuthUserModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        selectedAuthUser={selectedAuthUser}
      />
    </Card>
  );
};

export default AuthUsers;
