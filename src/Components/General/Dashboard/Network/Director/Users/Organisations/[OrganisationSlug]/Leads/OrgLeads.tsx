"use client";
import ViewLeadModal from "@/Components/General/Dashboard/CommonComponents/CommonUsers/Leads/Modals/ViewLeadModal";
import { useGetOrgLeadsQuery } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/OrgLeadsApi";
import {
  LeadsInfo,
  LeadsProps,
} from "@/Types/CommonComponents/Directors/LeadTypes";
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

const OrgLeads: React.FC<LeadsProps> = () => {
  // Correctly extract dynamic route param (folder is [OrganisationSlug])
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number>(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // rtk hooks
  const { data: leadData, isLoading } = useGetOrgLeadsQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
      },
    },
    { skip: !organisationslug }
  );

  const [selectedLead, setSelectedLead] = useState<Partial<LeadsInfo>>({
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

  // Extract leads and pagination info from API response
  const leads = Array.isArray(leadData) ? leadData : leadData?.results || [];
  const totalCount = leadData?.count || 0; // from API e.g. 12
  // Capture stable page size from a non-last page to avoid last-page short length
  useEffect(() => {
    const currentLength = Array.isArray(leadData)
      ? leadData.length
      : leadData?.results?.length || 0;
    const isLastPage =
      !Array.isArray(leadData) && leadData && leadData.next === null;
    if (currentLength > 0) {
      if (pageSize === 0) setPageSize(currentLength);
      else if (!isLastPage && currentLength !== pageSize)
        setPageSize(currentLength);
    }
  }, [leadData, pageSize]);

  const effectivePageSize = pageSize || leads.length || 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePageSize));

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
            <h2>Leads</h2>
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
          <Col md={3} xs="12" />
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
              ) : leads.length > 0 ? (
                leads.map((lead: LeadsInfo) => (
                  <tr key={lead.alias} className="text-center">
                    <td>
                      <span
                        className="text_decoration_hover"
                        onClick={() => {
                          setSelectedLead(lead);
                          toggleViewModal();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {lead.user?.title
                          ? formatChoiceFieldValue(lead.user?.title)
                          : ""}{" "}
                        {lead?.user?.first_name} {lead?.user?.middle_name}{" "}
                        {lead?.user?.last_name}
                      </span>
                    </td>
                    <td>{lead?.user?.email || "-"}</td>
                    <td>
                      {lead?.user?.phone ? (
                        <a
                          href={`tel:${lead?.user?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {lead?.user?.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {lead?.role ? formatChoiceFieldValue(lead.role) : "-"}
                    </td>
                    <td>
                      <p className="m-0">
                        {lead.created_by?.title
                          ? formatChoiceFieldValue(lead.created_by?.title)
                          : ""}{" "}
                        {lead?.created_by?.first_name}{" "}
                        {lead?.created_by?.middle_name}{" "}
                        {lead?.created_by?.last_name}
                      </p>
                      <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
                        (
                        {lead.created_by?.user_type
                          ? formatChoiceFieldValue(lead.created_by?.user_type)
                          : ""}
                        )
                      </p>
                    </td>
                    <td>{formatDateAndTime(lead?.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No leads available.
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
                {totalCount === 0 || effectivePageSize === 0
                  ? "0"
                  : (currentPage - 1) * effectivePageSize + 1}{" "}
                to{" "}
                {Math.min(
                  (currentPage - 1) * effectivePageSize + effectivePageSize,
                  totalCount
                )}{" "}
                of {totalCount} Leads
              </p>
            </div>{" "}
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

        {/* Modals */}
        <ViewLeadModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedLead={selectedLead}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default OrgLeads;
