import ViewClientModal from "@/Components/General/Dashboard/CommonComponents/Directors/Clients/Modals/ViewClientModal";
import { useGetOrgClientsQuery } from "@/Redux/Reducers/Network/Organisations/SingleOrganisation/OrgClientsApi";
import {
  ClientInfoProps,
  ClientsProps,
} from "@/Types/CommonComponents/Directors/ClientTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
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

const OrgClients: React.FC<ClientsProps> = ({ clientsPerPage = 5 }) => {
  const { organisationslug } = useParams();
  const [clients, setClients] = useState<ClientInfoProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
      email: "",
      phone: "",
      profile_image: "",
      user_type: "",
    },
    role: "",
    reason_for_enquiry: "",
    gender: "",
  });

  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);

  useEffect(() => {
    if (clientData) {
      const clientsData = Array.isArray(clientData)
        ? clientData
        : clientData.clients;
      setClients(clientsData || []);
    }
  }, [clientData]);

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
          <Col md={3} xs="12">
            <InputGroup className="position-relative">
              <FaSearch
                className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                style={{ zIndex: 10, pointerEvents: "none" }}
              />
              <Input
                type="text"
                placeholder="Search by name or email... "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "10px 10px 10px 25px" }}
              />
            </InputGroup>
          </Col>
          <Col md="3" xs="12" />
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
                          ? formatChoiceFieldValue(client.user?.title)
                          : ""}{" "}
                        {client?.user?.first_name} {client?.user?.middle_name}{" "}
                        {client?.user?.last_name}
                      </span>
                    </td>
                    <td>{client?.user?.email || "-"}</td>
                    <td>
                      {client?.user?.phone ? (
                        <a
                          href={`tel:${client?.user?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {client?.user?.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {client?.role
                        ? formatChoiceFieldValue(client?.role)
                        : "-"}
                    </td>
                    <td>
                      <p className="m-0">
                        {client.created_by?.title
                          ? formatChoiceFieldValue(client.created_by?.title)
                          : ""}{" "}
                        {client?.created_by?.first_name}{" "}
                        {client?.created_by?.middle_name}{" "}
                        {client?.created_by?.last_name}
                      </p>
                      <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
                        (
                        {client.created_by?.user_type
                          ? formatChoiceFieldValue(client.created_by?.user_type)
                          : "-"}
                        )
                      </p>
                    </td>
                    <td>{formatDateToDMYAndTime(client?.created_at)}</td>
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
        <ViewClientModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedClient={selectedClient}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default OrgClients;
