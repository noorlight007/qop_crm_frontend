"use client";
import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetOrgLeadAndApplicantListQuery } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgUserListApi";
import { OrgLeadInfo } from "@/Types/Common/Organisations/OrgLeadTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaInfoCircle, FaSearch, FaTrash } from "react-icons/fa";
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
  Table,
  UncontrolledPopover,
} from "reactstrap";
import AddOrgNewCaseModal from "../Cases/Modals/AddOrgNewCaseModal";
import AddOrgLeadModal from "./Modals/AddOrgLeadModal";
import DeleteOrgLeadModal from "./Modals/DeleteOrgLeadModal";
import UpdateOrgLeadModal from "./Modals/UpdateOrgLeadModal";
import ViewOrgLeadModal from "./Modals/ViewOrgLeadModal";

const OrgLeads: React.FC = () => {
  // Correctly extract dynamic route param (folder is [OrganisationSlug])
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<OrgLeadInfo | null>(null);
  const [leadToUpdate, setLeadToUpdate] = useState<OrgLeadInfo | null>(null);
  const [newCaseLead, setNewCaseLead] = useState<{
    leadId?: number;
    leadName?: string;
    leadData?: any;
  }>({});
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
  const { data: leadData, isLoading } = useGetOrgLeadAndApplicantListQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
        is_lead: true,
      },
    },
    { skip: !organisationslug },
  );

  const [selectedLead, setSelectedLead] = useState<OrgLeadInfo>({
    alias: "",
    profile_image: "",
    name: "",
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    enquiry_type: "",
    other_enquiry_type: "",
    source: "",
    other_source: "",
    note: "",
    created_by: {
      name: "",
      title: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
    },
    created_at: "",
  });

  const toggleViewModal = (lead?: OrgLeadInfo) => {
    if (lead) {
      setSelectedLead(lead);
    }
    setIsViewModalOpen(!isViewModalOpen);
  };

  const toggleAddModal = () => {
    setIsAddModalOpen((prev) => !prev);
  };

  const handleOpenCase = ({ leadId, leadName, leadData }: any) => {
    setNewCaseLead({ leadId, leadName, leadData });
    setIsAddCaseModalOpen(true);
  };

  const toggleAddCaseModal = () => {
    setIsAddCaseModalOpen((prev) => !prev);
    if (isAddCaseModalOpen) {
      setNewCaseLead({});
    }
  };

  const openUpdateLeadModal = (lead: OrgLeadInfo) => {
    setLeadToUpdate(lead);
    setIsUpdateModalOpen(true);
  };

  const openDeleteLeadModal = (lead: OrgLeadInfo) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

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
        <LoadingGrow />
      </div>
    );
  }

  return (
    <Card>
      <CardBody>
        <Row className="d-flex justify-content-between py-4">
          <Col md="3" xs="12">
            <h2 className="mb-0">Leads</h2>
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
                style={{ padding: "10px 27px 10px 25px" }}
                className="rounded-end-1"
              />
              <FaInfoCircle
                id="orgLeadSearch"
                className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                style={{ cursor: "pointer", zIndex: 10 }}
              />

              <UncontrolledPopover
                placement="right"
                target="orgLeadSearch"
                trigger="hover"
              >
                <PopoverBody className="bg-white rounded text-dark p-3 small">
                  🔍 You can search using Name, Email Address or Phone Number.
                </PopoverBody>
              </UncontrolledPopover>
            </InputGroup>
          </Col>
          <Col
            md={3}
            xs="12"
            className="d-flex justify-content-md-end justify-content-start mt-3 mt-md-0"
          >
            <Button color="primary" onClick={toggleAddModal}>
              <TbCirclePlus className="me-1" />
              Add Lead
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
                <th>Source</th>
                <th>Enquiry Type</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <LoadingGrow />
                    </div>
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead: OrgLeadInfo) => (
                  <tr key={lead.alias} className="text-center">
                    <td className="text-start">
                      <span
                        className="text_decoration_hover"
                        onClick={() => toggleViewModal(lead)}
                        style={{ cursor: "pointer" }}
                      >
                        {lead?.name ? (
                          lead?.name
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </span>
                    </td>
                    <td>
                      {lead?.email ? (
                        lead.email
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {lead?.phone ? (
                        <span className="text-black">{lead?.phone}</span>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {lead?.source === "OTHER" ? (
                        lead?.other_source || (
                          <small className="text-muted">Not Available</small>
                        )
                      ) : lead?.source ? (
                        formatChoiceFieldValue(lead.source)
                      ) : (
                        <small className="text-muted">Not specified</small>
                      )}
                    </td>
                    <td>
                      {lead?.enquiry_type === "OTHER" ? (
                        lead?.other_enquiry_type || (
                          <small className="text-muted">Not Available</small>
                        )
                      ) : lead?.enquiry_type ? (
                        formatChoiceFieldValue(lead.enquiry_type)
                      ) : (
                        <small className="text-muted">Not specified</small>
                      )}
                    </td>
                    <td>
                      {lead.created_by == null ? (
                        <small className="text-muted">Not Available</small>
                      ) : (
                        <>
                          <p className="m-0">
                            {lead.created_by?.name || "Unknown User"}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            (
                            {lead.created_by?.email
                              ? formatChoiceFieldValue(
                                  lead.created_by?.email,
                                )
                              : "Not Found"}
                            )
                          </p>
                        </>
                      )}
                    </td>
                    <td>
                      {formatDateAndTime(lead?.created_at || "Not Available")}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => openUpdateLeadModal(lead)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => openDeleteLeadModal(lead)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
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
              <p className="text-primary">
                Showing{" "}
                {totalCount === 0 || effectivePageSize === 0
                  ? "0"
                  : (currentPage - 1) * effectivePageSize + 1}{" "}
                to{" "}
                {Math.min(
                  (currentPage - 1) * effectivePageSize + effectivePageSize,
                  totalCount,
                )}{" "}
                of {totalCount} Leads
              </p>
            </div>{" "}
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
                    <PaginationLink onClick={() => setCurrentPage(pageNumber)}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ),
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
        <ViewOrgLeadModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedLead={selectedLead}
        />
        <AddOrgLeadModal
          isOpen={isAddModalOpen}
          toggle={toggleAddModal}
          header="Lead"
          onLeadCreated={() => setCurrentPage(1)}
          onOpenCase={handleOpenCase}
        />
        <AddOrgNewCaseModal
          isOpen={isAddCaseModalOpen}
          toggle={toggleAddCaseModal}
          leadId={newCaseLead.leadId}
          leadName={newCaseLead.leadName}
          leadData={newCaseLead.leadData}
        />
        <UpdateOrgLeadModal
          isOpen={isUpdateModalOpen}
          toggle={() => setIsUpdateModalOpen(false)}
          leadToUpdate={leadToUpdate}
        />
        <DeleteOrgLeadModal
          isOpen={isDeleteModalOpen}
          toggle={() => setIsDeleteModalOpen(false)}
          leadToDelete={leadToDelete}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default OrgLeads;
