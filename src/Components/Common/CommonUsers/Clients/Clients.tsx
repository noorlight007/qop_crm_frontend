import { useGetClientDetailsQuery } from "@/Redux/Reducers/Common/CommonUsers/ClientsApi";
import {
  ClientInfoProps,
  ClientsProps,
} from "@/Types/Common/CommonUsers/ClientTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { User } from "react-feather";
import { FaSearch } from "react-icons/fa";
import { TbMailShare } from "react-icons/tb";
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
  Row,
  Spinner,
  Table,
} from "reactstrap";
import AddClientModal from "./Modals/AddClientModal";
import ClientInvitationModal from "./Modals/ClientInvitationModal";
import DeleteClientModal from "./Modals/DeleteClientModal";
import UpdateClientModal from "./Modals/UpdateClientModal";
import ViewClientModal from "./Modals/ViewClientModal";

const Clients: React.FC<ClientsProps> = ({ clientsPerPage = 10 }) => {
  const { data: session } = useSession();
  const [clients, setClients] = useState<ClientInfoProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientInfoProps | null>(
    null,
  );

  const { data: clientData, isLoading } = useGetClientDetailsQuery({
    page: currentPage,
    page_size: clientsPerPage,
    search: debouncedSearch || undefined,
  });

  const [selectedClient, setSelectedClient] = useState<
    Partial<ClientInfoProps>
  >({
    user: {
      title: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      profile_image: "",
      user_type: "",
    },
    source: "",
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const openDeleteModal = (client: ClientInfoProps) => {
    setClientToDelete(client);
    toggleDeleteModal();
  };
  const toggleInvitationModal = () =>
    setIsInvitationModalOpen(!isInvitationModalOpen);

  useEffect(() => {
    if (clientData) {
      if (Array.isArray(clientData)) {
        setClients(clientData || []);
        setTotalCount(clientData.length || 0);
      } else if ((clientData as any).results) {
        setClients((clientData as any).results || []);
        setTotalCount((clientData as any).count || 0);
      } else if ((clientData as any).clients) {
        setClients((clientData as any).clients || []);
        setTotalCount(((clientData as any).clients || []).length || 0);
      } else {
        setClients([]);
        setTotalCount(0);
      }
    }
  }, [clientData]);

  // openmodals
  const openAddModal = () => {
    toggleModal();
  };

  const openUpdateModal = (client: ClientInfoProps) => {
    setSelectedClient(client);
    toggleUpdateModal();
  };
  // openmodals end

  // Server-side search/pagination is used. `clients` contains current page results.
  const currentClients = clients;
  const totalPages = Math.ceil(totalCount / clientsPerPage) || 1;

  // debounce search input to avoid firing on every keystroke
  const searchTimeout = useRef<number | null>(null);
  useEffect(() => {
    if (searchTimeout.current) {
      window.clearTimeout(searchTimeout.current);
    }
    // set a 300ms debounce
    searchTimeout.current = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300) as unknown as number;

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

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
        <Row className="flex justify-content-between py-4">
          <Col md="3">
            <h2>Clients</h2>
          </Col>
          <Col md={3} xs={12}>
            <InputGroup className="position-relative">
              <FaSearch
                className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                style={{ zIndex: 10, pointerEvents: "none" }}
              />
              <Input
                type="text"
                placeholder="Search... "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "10px 10px 10px 25px" }}
              />
            </InputGroup>
          </Col>
          <Col
            md="3"
            xs="12"
            className="d-flex justify-content-end mt-sm-0 mt-2"
          >
            {/* {session?.user?.user_type !== "NETWORK_COMPLIANCE_ASSISTANT" && (
              <Button
                color="primary"
                onClick={openAddModal}
                className="d-flex justify-content-center align-items-center gap-1"
              >
                <TbCirclePlus size={18} />
                <span>Add Client</span>
              </Button>
            )} */}
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
                <th>Enquiry Type</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner color="primary" />
                    </div>
                  </td>
                </tr>
              ) : currentClients.length > 0 ? (
                currentClients.map((client: any) => (
                  <tr key={client.alias} className="text-center">
                    <td className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                      <span
                        className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                        style={{ width: 40, height: 40 }}
                      >
                        {client.user?.profile_image ? (
                          <Image
                            src={client.user.profile_image}
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
                          setSelectedClient(client);
                          toggleViewModal();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {client.user?.title
                          ? formatChoiceFieldValue(client.user?.title)
                          : ""}{" "}
                        {client?.user?.first_name} {client?.user?.middle_name}{" "}
                        {client?.user?.last_name}
                      </span>
                    </td>
                    <td>
                      {client?.user?.email || (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {client?.user?.phone ? (
                        <a
                          href={`tel:${client?.user?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {client?.user?.phone}
                        </a>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {client?.source === "OTHER" ? (
                        client?.other_source || (
                          <small className="text-muted">Not Available</small>
                        )
                      ) : client?.source ? (
                        formatChoiceFieldValue(client.source)
                      ) : (
                        <small className="text-muted">Not specified</small>
                      )}
                    </td>
                    <td>
                      {client?.enquiry_type === "OTHER" ? (
                        client?.other_enquiry_type || (
                          <small className="text-muted">Not Available</small>
                        )
                      ) : client?.enquiry_type ? (
                        formatChoiceFieldValue(client.enquiry_type)
                      ) : (
                        <small className="text-muted">Not specified</small>
                      )}
                    </td>
                    <td>
                      {client?.created_by === null ? (
                        <small className="text-muted">Not specified</small>
                      ) : (
                        <>
                          <p className="m-0">
                            {client.created_by?.title
                              ? formatChoiceFieldValue(client.created_by?.title)
                              : ""}{" "}
                            {client?.created_by?.first_name}{" "}
                            {client?.created_by?.middle_name}{" "}
                            {client?.created_by?.last_name}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            (
                            {client.created_by?.user_type
                              ? formatChoiceFieldValue(
                                  client.created_by?.user_type,
                                )
                              : "N/A"}
                            )
                          </p>
                        </>
                      )}
                    </td>
                    <td>{formatDateAndTime(client?.created_at)}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2 align-items-center">
                        <Button
                          color="info"
                          size="sm"
                          title="Send Client Invitation"
                          onClick={() => {
                            setSelectedClient(client);
                            toggleInvitationModal();
                          }}
                        >
                          <TbMailShare size="16" />
                        </Button>
                        <Button
                          color="primary"
                          size="sm"
                          title="Update User"
                          onClick={() => openUpdateModal(client)}
                        >
                          <i className="icon-pencil-alt"></i>
                        </Button>
                        {(session?.user?.user_type === "NETWORK_DIRECTOR" ||
                          session?.user?.user_type ===
                            "NETWORK_COMPLIANCE_ASSISTANT" ||
                          session?.user?.user_type ===
                            "ORGANISATION_DIRECTOR") && (
                          <Button
                            color="danger"
                            size="sm"
                            title="Delete User"
                            onClick={() => openDeleteModal(client)}
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
                  <td colSpan={7} className="text-center">
                    No clients available.
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
                  : (currentPage - 1) * clientsPerPage + 1}{" "}
                to{" "}
                {currentClients.length === 0
                  ? 0
                  : (currentPage - 1) * clientsPerPage +
                    currentClients.length}{" "}
                of {totalCount} Clients
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

              {totalPages <= clientsPerPage ? (
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

        {/* modals */}
        <AddClientModal isOpen={isModalOpen} toggle={toggleModal} />
        <ViewClientModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedClient={selectedClient}
        />
        <UpdateClientModal
          isOpen={isUpdateModalOpen}
          toggle={toggleUpdateModal}
          onSave={() => {
            toggleUpdateModal();
          }}
          selectedClient={selectedClient}
        />
        <DeleteClientModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          clientAlias={clientToDelete?.alias || ""}
          clientName={`${
            clientToDelete?.user?.title
              ? formatChoiceFieldValue(clientToDelete?.user?.title) + " "
              : ""
          }${clientToDelete?.user?.first_name} ${
            clientToDelete?.user?.middle_name
              ? clientToDelete?.user?.middle_name + " "
              : ""
          }${clientToDelete?.user?.last_name}`}
        />
        <ClientInvitationModal
          isOpen={isInvitationModalOpen}
          toggle={toggleInvitationModal}
          selectedClient={selectedClient}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default Clients;
