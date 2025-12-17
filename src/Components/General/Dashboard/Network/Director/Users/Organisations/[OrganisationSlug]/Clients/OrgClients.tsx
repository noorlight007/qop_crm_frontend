"use client";
import ViewClientModal from "@/Components/General/Dashboard/CommonComponents/CommonUsers/Clients/Modals/ViewClientModal";
import { useGetOrgClientsQuery } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/OrgClientsApi";
import {
  ClientInfoProps,
  ClientsProps,
} from "@/Types/CommonComponents/Directors/ClientTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
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

const OrgClients: React.FC<ClientsProps> = () => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;
  const [clients, setClients] = useState<ClientInfoProps[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [stablePageSize, setStablePageSize] = useState<number>(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // rtk query - pass params object to match OrgClientsApi
  const { data: clientData, isLoading } = useGetOrgClientsQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
      },
    },
    { skip: !organisationslug }
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
        : clientData.results || clientData.clients;
      setClients(clientsData || []);
    }
  }, [clientData]);

  // Server-side pagination: derive totalCount and a stable page size to avoid inflated pages
  const totalCount =
    clientData && !Array.isArray(clientData)
      ? clientData.count
      : clients.length;

  // capture a stable page size from pages that are not the last page
  useEffect(() => {
    const currentLength = Array.isArray(clientData)
      ? clientData.length
      : clientData?.results?.length || 0;
    const isLastPage =
      !Array.isArray(clientData) && clientData && clientData.next === null;
    if (currentLength > 0) {
      if (stablePageSize === 0) setStablePageSize(currentLength);
      else if (!isLastPage && currentLength !== stablePageSize)
        setStablePageSize(currentLength);
    }
  }, [clientData, stablePageSize]);

  const effectivePageSize = stablePageSize || clients.length || 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePageSize));
  const currentClients = clients;

  // Keep currentPage within bounds
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

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
                placeholder="Search... "
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                    <td>{formatDateAndTime(client?.created_at)}</td>
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
                {totalCount === 0
                  ? "0"
                  : (currentPage - 1) * effectivePageSize + 1}{" "}
                to{" "}
                {Math.min(
                  (currentPage - 1) * effectivePageSize + effectivePageSize,
                  totalCount
                )}{" "}
                of {totalCount} Clients
              </p>
            </div>
            {totalPages > 1 && (
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
            )}
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
