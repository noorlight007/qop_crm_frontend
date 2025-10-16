import AddClientModal from "@/Components/General/Dashboard/CommonComponents/Directors/Clients/Modals/AddClientModal";
import ViewClientModal from "@/Components/General/Dashboard/CommonComponents/Directors/Clients/Modals/ViewClientModal";
import { useGetOrgClientsQuery } from "@/Redux/Reducers/Network/Organisations/SingleOrganisation/OrgClientsApi";
import {
  ClientInfoProps,
  ClientsProps,
} from "@/Types/CommonComponents/Directors/ClientTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from "reactstrap";

const OrgClients: React.FC<ClientsProps> = ({ clientsPerPage = 5 }) => {
  const { organisationslug } = useParams();
  const [clients, setClients] = useState<ClientInfoProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientInfoProps | null>(
    null
  );

  const { data: clientData, isLoading } = useGetOrgClientsQuery(
    { organisationslug },
    {
      skip: !organisationslug,
    }
  );

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
    role: "",
    reason_for_enquiry: "",
    gender: "",
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const openDeleteModal = (client: ClientInfoProps) => {
    setClientToDelete(client);
    toggleDeleteModal();
  };

  useEffect(() => {
    if (clientData) {
      const clientsData = Array.isArray(clientData)
        ? clientData
        : clientData.clients;
      setClients(clientsData || []);
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

  const filteredClients = clients.filter((client) => {
    const fullName = `${client?.user?.title || ""} ${
      client?.user?.first_name || ""
    } ${client?.user?.middle_name || ""} ${
      client?.user?.last_name || ""
    }`.toLowerCase();

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      client?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

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
          <Col md={6}>
            <InputGroup>
              <Input
                type="text"
                placeholder="Search by name or email... "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            className="d-flex justify-content-end mt-sm-0 mt-2"
          >
            <Button
              color="primary"
              onClick={openAddModal}
              className="d-flex justify-content-center align-items-center gap-1"
            >
              <TbCirclePlus size={18} />
              <span>Add Client</span>
            </Button>
          </Col>
        </Row>
        <Row>
          <Table hover responsive>
            <thead className="thead-light">
              <tr className="text-center">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
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
                    <td>
                      <span
                        className="text_decoration_hover"
                        onClick={() => {
                          setSelectedClient(client);
                          toggleViewModal();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {client.user?.title
                          ? client.user?.title.charAt(0).toUpperCase() +
                            client.user?.title.slice(1).toLowerCase()
                          : ""}{" "}
                        {client?.user?.first_name} {client?.user?.middle_name}{" "}
                        {client?.user?.last_name}
                      </span>
                    </td>
                    <td>{client?.official_email || "-"}</td>
                    <td>
                      {client?.official_phone ? (
                        <a
                          href={`tel:${client?.official_phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {client?.official_phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {client?.role?.charAt(0)?.toUpperCase() +
                        client?.role?.slice(1)?.toLowerCase()}
                    </td>
                    <td>
                      <p className="m-0">
                        {client.created_by?.title
                          ? client.created_by?.title.charAt(0).toUpperCase() +
                            client.created_by?.title.slice(1).toLowerCase()
                          : ""}{" "}
                        {client?.created_by?.first_name}{" "}
                        {client?.created_by?.middle_name}{" "}
                        {client?.created_by?.last_name}
                      </p>
                      <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
                        (
                        {client.created_by?.user_type
                          ?.split("_")
                          .map(
                            (word: any) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                        )
                      </p>
                    </td>
                    <td>{formatDateToDMYAndTime(client?.created_at)}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2 align-items-center">
                        <Button
                          color="success"
                          size="sm"
                          title="Update User"
                          onClick={() => openUpdateModal(client)}
                        >
                          <i className="icon-pencil-alt"></i>
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          title="Delete User"
                          onClick={() => openDeleteModal(client)}
                        >
                          <i className="icon-trash"></i>
                        </Button>
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
              <p className="text-success">
                Showing{" "}
                {filteredClients.length === 0 ? "0" : indexOfFirstClient + 1} to{" "}
                {Math.min(indexOfLastClient, filteredClients.length)} of{" "}
                {filteredClients.length} Clients
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
                  )
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
                      (pageNumber) => pageNumber > 1 && pageNumber < totalPages
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
        {/*
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
          clientName={`${clientToDelete?.user?.first_name} ${clientToDelete?.user?.last_name}`}
        /> */}
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default OrgClients;
