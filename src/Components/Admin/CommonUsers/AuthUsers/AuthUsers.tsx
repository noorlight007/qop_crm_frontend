import {
  useGetNetworkListQuery,
  useGetOrganisationListQuery,
} from "@/Redux/Reducers/Admin/CommonUsers/AuthUsersApi";
import { useGetAuthUsersQuery } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import {
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

const AuthUsers: React.FC<AuthUsersProps> = ({
  title,
  authUsersPerPage = 10,
}) => {
  const pathname = window.location.pathname;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Updated state for network and organization filters
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedOrganisation, setSelectedOrganisation] = useState("");

  // Fetch network and organization lists
  const { data: networkList, isLoading: networkListLoading } =
    useGetNetworkListQuery({});
  const { data: orgList, isLoading: orgListLoading } =
    useGetOrganisationListQuery({
      network: selectedNetwork,
    });

  // Set first network as default when networkList is loaded
  useEffect(() => {
    if (networkList && networkList.length > 0 && !selectedNetwork) {
      setSelectedNetwork(networkList[0].subdomain);
    }
  }, [networkList, selectedNetwork]);

  // Determine the role based on selection
  const role = selectedOrganisation
    ? "ORGANISATION_DIRECTOR"
    : "NETWORK_DIRECTOR";

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

  const currentAuthUsers = authUsers;
  const totalPages = Math.ceil(totalCount / authUsersPerPage) || 1;

  return (
    <Card>
      <CardBody>
        <Row className="d-flex justify-content-between py-4">
          <Col>
            <h2>{title}</h2>
          </Col>
          <Col md={2} xs="12">
            <InputGroup className="position-relative">
              <FaSearch
                className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                style={{ zIndex: 10, pointerEvents: "none" }}
              />
              <Input
                type="text"
                placeholder="Search... "
                value={searchQuery}
                className="rounded"
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
                networkList?.map((network: any) => (
                  <option key={network.subdomain} value={network.subdomain}>
                    {network.name}
                  </option>
                ))
              )}
            </Input>
          </Col>
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
                orgList?.map((org: any, index: any) => (
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
          <Col className="d-flex justify-content-end mt-sm-0 mt-2">
            <Button
              color="primary"
              // onClick={openAddUserModal}
            >
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
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner color="primary" />
                    </div>
                  </td>
                </tr>
              ) : currentAuthUsers.length > 0 ? (
                currentAuthUsers.map((user: any) => (
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
                      {formatDateAndTime(user?.created_at) || (
                        <small className="text-muted">Not Available</small>
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
