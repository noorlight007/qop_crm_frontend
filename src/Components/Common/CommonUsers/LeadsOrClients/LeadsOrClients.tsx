import { useGetLeadsOrClientsQuery } from "@/Redux/Reducers/Common/CommonUsers/LeadsOrClientsApi";
import {
  LeadOrClient,
  LeadsOrClientsProps,
} from "@/Types/Common/CommonUsers/LeadsOrClientsTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
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
import AddNewCaseModal from "../../Cases/Modals/AddNewCaseModal";
import ClientEnquiryLink from "./Components/ClientEnquiryLink";
import AddLeadModal from "./Modals/AddLeadModal";
import DeleteLeadOrClientModal from "./Modals/DeleteLeadOrClientModal";
import UpdateLeadOrClientModal from "./Modals/UpdateLeadOrClientModal";
import ViewLeadOrClientModal from "./Modals/ViewLeadOrClientModal";

const LeadsOrClients: React.FC<LeadsOrClientsProps> = ({
  title,
  leadsOrClientsPerPage = 12,
  userRole,
}) => {
  const { data: session } = useSession();
  const [leadsOrClients, setLeadsOrClients] = useState<LeadOrClient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Host AddNewCaseModal at page-level so it can open after AddLeadModal closes.
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [caseModalLeadId, setCaseModalLeadId] = useState<number | undefined>(
    undefined,
  );
  const [caseModalLeadName, setCaseModalLeadName] = useState<
    string | undefined
  >(undefined);
  const [caseModalLeadData, setCaseModalLeadData] = useState<any | undefined>(
    undefined,
  );
  const [selectedLeadOrClient, setSelectedLeadOrClient] = useState<
    Partial<LeadOrClient>
  >({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: null,
    profile_image: null,
    source: "",
    other_source: null,
    enquiry_type: "",
    other_enquiry_type: null,
    created_at: "",
    created_by: { name: "", user_type: "" },
  });

  // const { data: authUsersData, isLoading } = useGetAuthUsersQuery({
  //   role: userRole,
  //   page: currentPage,
  //   search: debouncedSearch || undefined,
  // });

  const { data: leadsOrClientsData, isLoading: isLeadsOrClientsLoading } =
    useGetLeadsOrClientsQuery({
      page: currentPage,
      search: debouncedSearch || undefined,
      is_lead: userRole === "LEAD" ? true : false,
    });

  console.log("LeadsOrClientsData:", leadsOrClientsData);

  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleAddUserModal = () => setIsAddUserModalOpen(!isAddUserModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const openCaseModalFromLead = (payload: {
    leadId?: number;
    leadName?: string | undefined;
    leadData?: any;
  }) => {
    setCaseModalLeadId(payload.leadId);
    setCaseModalLeadName(payload.leadName);
    setCaseModalLeadData(payload.leadData);
    setIsCaseModalOpen(true);
  };

  const closeCaseModal = () => {
    setIsCaseModalOpen(false);
    setCaseModalLeadId(undefined);
    setCaseModalLeadName(undefined);
    setCaseModalLeadData(undefined);
  };

  const openViewModal = (LeadOrClient: LeadOrClient) => {
    setSelectedLeadOrClient(LeadOrClient);
    toggleViewModal();
  };

  const openAddUserModal = () => {
    toggleAddUserModal();
  };

  const openUpdateModal = (LeadOrClient: LeadOrClient) => {
    setSelectedLeadOrClient(LeadOrClient);
    toggleUpdateModal();
  };

  const openDeleteModal = (LeadOrClient: LeadOrClient) => {
    setSelectedLeadOrClient(LeadOrClient);
    toggleDeleteModal();
  };

  // useEffect(() => {
  //   if (authUsersData) {
  //     if (Array.isArray(authUsersData)) {
  //       setAuthUsers(authUsersData || []);
  //       setTotalCount(authUsersData.length || 0);
  //     } else if (authUsersData.results) {
  //       setAuthUsers(authUsersData.results || []);
  //       setTotalCount(authUsersData.count || 0);
  //     } else {
  //       setAuthUsers([]);
  //       setTotalCount(0);
  //     }
  //   }
  // }, [authUsersData]);

  useEffect(() => {
    if (leadsOrClientsData) {
      if (Array.isArray(leadsOrClientsData)) {
        setLeadsOrClients(leadsOrClientsData || []);
        setTotalCount(leadsOrClientsData.length || 0);
      } else if (leadsOrClientsData.results) {
        setLeadsOrClients(leadsOrClientsData.results || []);
        setTotalCount(leadsOrClientsData.count || 0);
      } else {
        setLeadsOrClients([]);
        setTotalCount(0);
      }
    }
  }, [leadsOrClientsData]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // const currentAuthUsers = authUsers;
  const currentLeadsOrClientsData = leadsOrClients;
  // const totalPages = Math.ceil(totalCount / leadsOrClientsPerPage) || 1;

  const filteredData = currentLeadsOrClientsData;
  const effectiveTotal = totalCount;
  const totalPages = Math.ceil(effectiveTotal / leadsOrClientsPerPage) || 1;

  // if (isLeadsOrClientsLoading) {
  //   return (
  //     <div className="p-4">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <>
      {/* Public Lead Link - only for Leads, not Clients */}
      {userRole === "LEAD" && <ClientEnquiryLink />}
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
              {userRole === "LEAD" && (
                <Button color="primary" onClick={openAddUserModal}>
                  <TbCirclePlus size={18} className="me-1" />
                  Add {title.slice(0, -1)}
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Table hover responsive>
              <thead className="thead-light">
                <tr className="text-center">
                  <th className="text-start">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th className="text-truncate">Enquiry Type</th>
                  <th className="text-truncate">Created At</th>
                  <th className="text-truncate">Created By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLeadsOrClientsLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <Spinner color="primary" />
                      </div>
                    </td>
                  </tr>
                ) : filteredData?.length > 0 ? (
                  filteredData?.map((user: any) => (
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
                          <span className="text-black">{user?.phone}</span>
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </td>

                      <td>
                        {user?.source === "OTHER" ? (
                          user?.other_source || (
                            <small className="text-muted">Not Available</small>
                          )
                        ) : user?.source ? (
                          formatChoiceFieldValue(user.source)
                        ) : (
                          <small className="text-muted">Not specified</small>
                        )}
                      </td>
                      <td>
                        {user?.enquiry_type === "OTHER" ? (
                          user?.other_enquiry_type || (
                            <small className="text-muted">Not Available</small>
                          )
                        ) : user?.enquiry_type ? (
                          formatChoiceFieldValue(user.enquiry_type)
                        ) : (
                          <small className="text-muted">Not specified</small>
                        )}
                      </td>

                      <td>
                        {formatDateAndTime(user?.created_at) || (
                          <small className="text-muted">Not Available</small>
                        )}
                      </td>
                      <td>
                        {user?.created_by ? (
                          <>
                            <span>{user?.created_by?.name}</span>
                            <small className="text-muted d-block">
                              (
                              {formatChoiceFieldValue(
                                user?.created_by?.user_type,
                              )}
                              )
                            </small>
                          </>
                        ) : (
                          <small className="text-muted">Not Available</small>
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
                          {(session?.user?.user_type === "NETWORK_DIRECTOR" ||
                            session?.user?.user_type === "NETWORK_COMPLIANCE" ||
                            session?.user?.user_type ===
                              "ORGANISATION_DIRECTOR") && (
                            <Button
                              color="danger"
                              size="sm"
                              title="Delete User"
                              onClick={() => {
                                openDeleteModal(user);
                              }}
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
                  {effectiveTotal === 0
                    ? "0"
                    : (currentPage - 1) * leadsOrClientsPerPage + 1}{" "}
                  to{" "}
                  {filteredData?.length === 0
                    ? 0
                    : (currentPage - 1) * leadsOrClientsPerPage +
                      filteredData?.length}{" "}
                  of {effectiveTotal} Users
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
                        (pageNumber) =>
                          pageNumber > 1 && pageNumber < totalPages,
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
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                      >
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
          <ViewLeadOrClientModal
            isOpen={isViewModalOpen}
            toggle={toggleViewModal}
            selectedLeadOrClient={selectedLeadOrClient}
          />
          <AddLeadModal
            isOpen={isAddUserModalOpen}
            toggle={toggleAddUserModal}
            onOpenCase={openCaseModalFromLead}
          />

          <AddNewCaseModal
            isOpen={isCaseModalOpen}
            toggle={closeCaseModal}
            leadId={caseModalLeadId}
            leadName={caseModalLeadName}
            leadData={caseModalLeadData}
          />
          <UpdateLeadOrClientModal
            isOpen={isUpdateModalOpen}
            toggle={toggleUpdateModal}
            selectedLeadOrClient={selectedLeadOrClient}
          />
          <DeleteLeadOrClientModal
            isOpen={isDeleteModalOpen}
            toggle={toggleDeleteModal}
            selectedLeadOrClient={selectedLeadOrClient}
          />
          {/* modals end */}
        </CardBody>
      </Card>
    </>
  );
};

export default LeadsOrClients;
