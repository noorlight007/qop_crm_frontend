import {
  useGetNetworkListQuery,
  useGetOrganisationListQuery,
} from "@/Redux/Reducers/Admin/CommonUsers/AuthUsersApi";
import {
  useFetchSupportTicketQuery,
  useUpdateSupportTicketMutation,
} from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import { SupportTicketFormData } from "@/Types/Common/SupportTicket/SupportTicketTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { getSupportTicketUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaChevronDown,
  FaExclamationCircle,
  FaInfoCircle,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import { TbCheck, TbCirclePlus } from "react-icons/tb";
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
import Swal from "sweetalert2";
import AddSupportTicketModal from "./Modals/AddSupportTicketModal";
import DeleteSupportTicketModal from "./Modals/DeleteSupportTicketModal";
import UpdateSupportTicketModal from "./Modals/UpdateSuppotTicketModal";
interface SupportTicketProps {
  initialIsRemoved?: string;
}

const SupportTicket: React.FC<SupportTicketProps> = ({ initialIsRemoved }) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] =
    useState<SupportTicketFormData | null>(null);

  const [filterIcon, setFilterIcon] = useState(false);
  const defaultFilters = {
    ticket_type: "",
    status: "",
    priority: "",
    network: "",
    organisation: "",
    created_by: "",
    is_removed: initialIsRemoved ?? "",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedOrganisation, setSelectedOrganisation] = useState("");

  const userType = session?.user?.user_type;

  const {
    data: supportTicketData,
    isLoading,
    isFetching,
    isError,
  } = useFetchSupportTicketQuery(
    {
      params: {
        search: debouncedSearch || undefined,
        page: currentPage,
        ticket_type: filters.ticket_type || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        network: filters.network || undefined,
        organisation: filters.organisation || undefined,
        created_by: filters.created_by || undefined,
        is_removed: filters.is_removed || undefined,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [updateSupportTicket, { isLoading: updateSupTicketLoading }] =
    useUpdateSupportTicketMutation();

  // Fetch network and organization lists
  const { data: networkList, isLoading: networkListLoading } =
    useGetNetworkListQuery(undefined);
  const { data: orgList, isLoading: orgListLoading } =
    useGetOrganisationListQuery(
      {
        network: selectedNetwork,
      },
      {
        skip: !selectedNetwork, // Only fetch when a network is selected
      },
    );

  const [ticketData, setTicketData] = useState<Partial<SupportTicketFormData>>({
    ticket_type: "",
    subject: "",
    message: "",
    files: [],
  });

  const formatChoiceFieldValue = (value: string) => {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const tickets =
    isFetching || isError ? [] : (supportTicketData?.results ?? []);

  const totalCount =
    isFetching || isError ? 0 : (supportTicketData?.count ?? 0);

  const ticketsPerPage = 12;
  const totalPages = Math.ceil(totalCount / ticketsPerPage);

  const openUpdateModal = (ticket: SupportTicketFormData) => {
    setTicketData(ticket);
    toggleUpdateModal();
  };

  const openDeleteModal = (ticket: SupportTicketFormData) => {
    setTicketToDelete(ticket);
    toggleDeleteModal();
  };

  type TicketType = "FEEDBACK" | "BUG_REPORT" | "FEATURE_REQUEST";

  const ticketTypeColorMap: Record<TicketType, string> = {
    FEEDBACK: "success",
    BUG_REPORT: "warning",
    FEATURE_REQUEST: "info",
  };

  type TicketStatus = "OPEN" | "IN_REVIEW" | "RESOLVED";

  const statusColorMap: Record<TicketStatus, string> = {
    OPEN: "danger",
    IN_REVIEW: "warning",
    RESOLVED: "success",
  };

  type Priority = "URGENT" | "MEDIUM" | "NORMAL" | "WHEN_POSSIBLE";

  const priorityColorMap: Record<Priority, string> = {
    URGENT: "danger",
    MEDIUM: "warning",
    NORMAL: "info",
    WHEN_POSSIBLE: "dark",
  };

  const statusIconMap: Record<TicketStatus, JSX.Element> = {
    OPEN: <FaExclamationCircle />,
    IN_REVIEW: <FaSpinner />,
    RESOLVED: <TbCheck />,
  };

  const statusOptions = [
    { value: "OPEN", label: "Open" },
    { value: "IN_REVIEW", label: "In Review" },
    { value: "RESOLVED", label: "Resolved" },
  ];

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleDropdown = (ticketId: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const handleStatusChange = async (ticketAlias: string, newStatus: string) => {
    try {
      await updateSupportTicket({
        ticket_alias: ticketAlias,
        payload: { status: newStatus },
      }).unwrap();

      Swal.fire("Success", "Status Updated Successfully!", "success");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  };

  return (
    <Row>
      <Col>
        <Card className="shadow-sm">
          <CardBody>
            <Row className="d-flex justify-content-between align-items-center py-4">
              <Col md="3" xs="12" className="d-flex ">
                <h2 className="mb-0 h4 h2-md">Tickets:</h2>
                <div
                  className="btn-group ms-2"
                  role="group"
                  aria-label="Show tickets filter"
                  style={{
                    background: "#e9ecef",
                    padding: 3,
                    borderRadius: 999,
                  }}
                >
                  <Button
                    size="sm"
                    color={!filters.created_by ? "primary" : "light"}
                    className={`rounded-pill px-3 py-1 ${!filters.created_by ? "" : "text-muted"}`}
                    style={{ borderRadius: 999, padding: "6px 14px" }}
                    onClick={() => handleFilterChange("created_by", "")}
                    aria-pressed={!filters.created_by}
                    type="button"
                  >
                    All
                  </Button>

                  <Button
                    size="sm"
                    color={
                      filters.created_by === String(session?.user?.id)
                        ? "primary"
                        : "light"
                    }
                    className={`rounded-pill px-3 py-1 ${filters.created_by === String(session?.user?.id) ? "" : "text-muted"}`}
                    style={{ borderRadius: 999, padding: "6px 14px" }}
                    onClick={() =>
                      handleFilterChange(
                        "created_by",
                        String(session?.user?.id) || "",
                      )
                    }
                    aria-pressed={
                      filters.created_by === String(session?.user?.id)
                    }
                    type="button"
                  >
                    My
                  </Button>
                </div>
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
                    style={{ padding: "10px 27px 10px 25px" }}
                    className="rounded-end-1"
                  />
                  <FaInfoCircle
                    id="ticketSearchSuggestion"
                    className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                    style={{ cursor: "pointer", zIndex: 10 }}
                  />

                  <UncontrolledPopover
                    placement="right"
                    target="ticketSearchSuggestion"
                    trigger="hover"
                  >
                    <PopoverBody className="bg-white rounded text-dark p-3 small">
                      🔍 You can search using Ticket ID, Creator's Name,
                      Creator's Email Address or Phone Number.
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
                {session?.user?.user_type !== "ADMIN" && (
                  <Button
                    color="primary"
                    onClick={toggleModal}
                    className="d-flex justify-content-center align-items-center gap-1"
                  >
                    <TbCirclePlus size={18} />
                    <span>Create Support Ticket</span>
                  </Button>
                )}
              </Col>
            </Row>

            {filterIcon && (
              <Card className="shadow-lg bg-light-secondary rounded-3 p-3 mt-3 mb-3">
                <Row className="justify-content-center g-3">
                  <Col>
                    <Label>Select Ticket Type</Label>
                    <Input
                      type="select"
                      id="ticketTypeFilter"
                      className="py-1"
                      value={filters.ticket_type}
                      onChange={(e) =>
                        handleFilterChange("ticket_type", e.target.value)
                      }
                    >
                      <option value="">All Ticket Types</option>{" "}
                      <option value="FEEDBACK">Feedback</option>
                      <option value="BUG_REPORT">Bug Report</option>
                      <option value="FEATURE_REQUEST">Feature Request</option>
                    </Input>
                  </Col>
                  <Col>
                    <Label>Select Ticket Status</Label>
                    <Input
                      type="select"
                      id="ticketStatusFilter"
                      className="py-1"
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="">All Statuses</option>{" "}
                      <option value="OPEN">Open</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="RESOLVED">Resolved</option>
                    </Input>
                  </Col>
                  <Col>
                    <Label>Select Ticket Priority</Label>
                    <Input
                      type="select"
                      id="ticketPriorityFilter"
                      className="py-1"
                      value={filters.priority}
                      onChange={(e) =>
                        handleFilterChange("priority", e.target.value)
                      }
                    >
                      <option value="">All Priorities</option>{" "}
                      <option value="URGENT">Urgent</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="NORMAL">Normal</option>
                      <option value="WHEN_POSSIBLE">When Possible</option>
                    </Input>
                  </Col>
                  {userType === "ADMIN" && (
                    <>
                      <Col>
                        <Label>Select Network</Label>
                        <Input
                          type="select"
                          id="networkFilter"
                          className="py-1"
                          value={filters.network}
                          onChange={(e) => {
                            const networkValue = e.target.value;
                            handleFilterChange("network", networkValue);
                            setSelectedNetwork(networkValue);
                            handleFilterChange("organisation", "");
                            setSelectedOrganisation("");
                          }}
                        >
                          <option value="">All Networks</option>
                          {(Array.isArray(networkList)
                            ? networkList
                            : (networkList?.results ?? [])
                          )?.map((network: any) => (
                            <option
                              key={network.subdomain}
                              value={network.subdomain}
                            >
                              {network.name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col>
                        <Label>Select Organisation</Label>
                        <Input
                          type="select"
                          id="organisationFilter"
                          className="py-1"
                          value={filters.organisation}
                          onChange={(e) => {
                            const orgValue = e.target.value;
                            handleFilterChange("organisation", orgValue);
                            setSelectedOrganisation(orgValue);
                          }}
                          disabled={!selectedNetwork || orgListLoading}
                        >
                          <option value="">
                            {!selectedNetwork
                              ? "Select a Network first"
                              : orgListLoading
                                ? "Loading organisations..."
                                : "All Organisations"}
                          </option>
                          {(Array.isArray(orgList)
                            ? orgList
                            : (orgList?.results ?? [])
                          )?.map((org: any, index: any) => (
                            <option
                              key={org.subdomain || `${org.name}-${index}`}
                              value={org.subdomain || org.name}
                            >
                              {org.name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </>
                  )}

                  <Col>
                    <Label>Clear All Filters</Label>
                    <Button
                      outline
                      color="danger"
                      className="w-100 d-flex justify-content-center align-items-center gap-1"
                      onClick={() => {
                        setFilters(defaultFilters);
                        setSelectedNetwork("");
                        setSelectedOrganisation("");
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
              <Table hover responsive>
                <thead className="thead-light">
                  <tr className="text-center">
                    <th>Ticket ID</th>
                    <th>Ticket Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Files</th>
                    <th>Created By</th>
                    <th>Created At</th>
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
                  ) : tickets.length > 0 ? (
                    tickets.map((ticket: any) => (
                      <tr key={ticket.alias} className="text-center">
                        <td className="text-truncate">
                          <Link
                            href={`${getSupportTicketUrl(ticket.alias, userType as string)}`}
                            className="text_decoration_hover"
                          >
                            {ticket.ticket_id}
                          </Link>
                        </td>
                        <td>
                          <Badge
                            color={
                              ticketTypeColorMap[
                                ticket?.ticket_type as TicketType
                              ] ?? "dark"
                            }
                          >
                            {formatChoiceFieldValue(ticket.ticket_type)}
                          </Badge>
                        </td>
                        <td>
                          {ticket.status ? (
                            userType === "ADMIN" ? (
                              <Dropdown
                                isOpen={dropdownOpen[ticket.id] || false}
                                toggle={() => toggleDropdown(ticket.id)}
                              >
                                <DropdownToggle
                                  tag="span"
                                  style={{ cursor: "pointer" }}
                                  caret={false}
                                >
                                  <Badge
                                    color={
                                      statusColorMap[
                                        ticket?.status as TicketStatus
                                      ] ?? "dark"
                                    }
                                    className="d-flex justify-content-center align-items-center gap-1 px-1"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {
                                      statusIconMap[
                                        ticket?.status as TicketStatus
                                      ]
                                    }
                                    <span style={{ marginTop: "2.5px" }}>
                                      {formatChoiceFieldValue(ticket?.status)}
                                    </span>
                                    <FaChevronDown size={10} />
                                  </Badge>
                                </DropdownToggle>
                                <DropdownMenu
                                  className="shadow-sm py-2"
                                  style={{ minWidth: "160px" }}
                                >
                                  {statusOptions.map((option) => {
                                    const isActive =
                                      ticket.status === option.value;
                                    const colorClass =
                                      statusColorMap[
                                        option.value as TicketStatus
                                      ] || "secondary";

                                    return (
                                      <DropdownItem
                                        key={option.value}
                                        onClick={() =>
                                          handleStatusChange(
                                            ticket.alias,
                                            option.value,
                                          )
                                        }
                                        className="d-flex align-items-center gap-3 px-3 py-2"
                                        active={isActive}
                                      >
                                        <span
                                          className={`rounded-circle bg-${colorClass}`}
                                          style={{
                                            width: "8px",
                                            height: "8px",
                                          }}
                                        />
                                        <span
                                          className={isActive ? "fw-bold" : ""}
                                        >
                                          {option.label}
                                        </span>
                                        {isActive && (
                                          <span className="ms-auto">
                                            <FaCheck />
                                          </span>
                                        )}
                                      </DropdownItem>
                                    );
                                  })}
                                </DropdownMenu>
                              </Dropdown>
                            ) : (
                              <Badge
                                color={
                                  statusColorMap[
                                    ticket?.status as TicketStatus
                                  ] ?? "dark"
                                }
                                className="d-flex justify-content-center align-items-center gap-1"
                              >
                                {statusIconMap[ticket?.status as TicketStatus]}{" "}
                                <span style={{ marginTop: "2.5px" }}>
                                  {formatChoiceFieldValue(ticket?.status)}
                                </span>
                              </Badge>
                            )
                          ) : (
                            <small className="text-muted">Not Found</small>
                          )}
                        </td>

                        <td>
                          <span>
                            {ticket.priority ? (
                              <Badge
                                color={
                                  priorityColorMap[
                                    ticket?.priority as Priority
                                  ] ?? "dark"
                                }
                              >
                                {formatChoiceFieldValue(ticket?.priority)}
                              </Badge>
                            ) : (
                              <small className="text-text-muted">
                                Not Founds
                              </small>
                            )}
                          </span>
                        </td>
                        <td>
                          <span>{ticket.subject}</span>
                        </td>
                        <td>
                          <div
                            style={{
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ticket.message}
                          </div>
                        </td>
                        <td>
                          {ticket.files.length > 0 ? (
                            <div>{ticket.files.length} file(s)</div>
                          ) : (
                            <span className="text-muted">No files</span>
                          )}
                        </td>
                        <td>
                          <p className="m-0">
                            {ticket.created_by?.title
                              ? formatChoiceFieldValue(ticket.created_by?.title)
                              : ""}{" "}
                            {ticket.created_by?.first_name}{" "}
                            {ticket.created_by?.middle_name}{" "}
                            {ticket.created_by?.last_name}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            {ticket.created_by?.email}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            (
                            {formatChoiceFieldValue(
                              ticket.created_by?.user_type,
                            )}
                            )
                          </p>
                        </td>
                        <td>{formatDateAndTime(ticket.created_at)}</td>

                        <td>
                          <div className="d-flex justify-content-center gap-2 align-items-center">
                            <Button
                              color="secondary"
                              size="sm"
                              title="View Ticket"
                              onClick={() => openUpdateModal(ticket)}
                            >
                              <i className="icon-pencil-alt"></i>
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              title="Mark as Resolved"
                              disabled={ticket.is_resolved}
                              onClick={() => openDeleteModal(ticket)}
                            >
                              <i className="icon-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">
                        No support tickets available.
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
                      : (currentPage - 1) * ticketsPerPage + 1}{" "}
                    to{" "}
                    {tickets.length === 0
                      ? 0
                      : (currentPage - 1) * ticketsPerPage +
                        tickets.length}{" "}
                    of {totalCount} Tickets
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
          </CardBody>
        </Card>

        {/* Support Ticket Modal */}
        <AddSupportTicketModal isOpen={isModalOpen} toggle={toggleModal} />

        <UpdateSupportTicketModal
          isOpen={isUpdateModalOpen}
          toggle={toggleUpdateModal}
          onSave={() => {
            toggleUpdateModal();
          }}
          selected={ticketData}
        />

        <DeleteSupportTicketModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          ticketAlias={ticketToDelete?.alias}
        />
      </Col>
    </Row>
  );
};

export default SupportTicket;
