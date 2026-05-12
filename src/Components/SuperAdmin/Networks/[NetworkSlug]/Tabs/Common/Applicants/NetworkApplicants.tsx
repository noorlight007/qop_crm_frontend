"use client";
import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetOrgApplicantListQuery } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgApplicantApi";
import { useGetNetworkApplicantListQuery } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
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
import ViewOrgApplicantModal from "./Modals/ViewApplicantModal";
import AddNetworkApplicantModal from "./Modals/AddNetworkApplicantModal";
import UpdateNetworkApplicantModal from "./Modals/UpdateNetworkApplicantModal";
import { NetworkApplicantInfo } from "@/Types/SuperAdmin/Networks/NetworkTypes";
import DeleteNetworkApplicantModal from "./Modals/DeleteNetworkApplicantModal";

const NetworkApplicants: React.FC<{ role: "LEAD" | "APPLICANT" }> = ({
  role,
}) => {
  // Correctly extract dynamic route param (folder is [OrganisationSlug])
  const { networkslug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<NetworkApplicantInfo | null>(
    null,
  );
  const [leadToUpdate, setLeadToUpdate] = useState<NetworkApplicantInfo | null>(
    null,
  );
  const [newCaseLead, setNewCaseLead] = useState<{
    applicantId?: number;
    applicantName?: string;
    applicantData?: any;
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
  const { data: applicantData, isLoading } = useGetNetworkApplicantListQuery(
    {
      network_slug: networkslug,
      params: {
        page: currentPage,
        search: searchQuery,
        is_lead: role === "LEAD" ? "true" : "false",
      },
    },
    { skip: !networkslug },
  );

  const [selectedApplicant, setSelectedApplicant] = useState<NetworkApplicantInfo>({
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

  const toggleViewModal = (item?: NetworkApplicantInfo) => {
    if (item) {
      setSelectedApplicant(item);
    }
    setIsViewModalOpen(!isViewModalOpen);
  };

  const toggleAddModal = () => {
    setIsAddModalOpen((prev) => !prev);
  };

  const handleOpenCase = ({
    applicantId,
    applicantName,
    applicantData,
  }: any) => {
    setNewCaseLead({ applicantId, applicantName, applicantData });
    setIsAddCaseModalOpen(true);
  };

  const toggleAddCaseModal = () => {
    setIsAddCaseModalOpen((prev) => !prev);
    if (isAddCaseModalOpen) {
      setNewCaseLead({});
    }
  };

  const openUpdateLeadModal = (item: NetworkApplicantInfo) => {
    setLeadToUpdate(item);
    setIsUpdateModalOpen(true);
  };

  const openDeleteLeadModal = (item: NetworkApplicantInfo) => {
    setLeadToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Extract applicants and pagination info from API response
  const applicants = Array.isArray(applicantData)
    ? applicantData
    : applicantData?.results || [];
  const totalCount = applicantData?.count || 0; // from API e.g. 12
  // Capture stable page size from a non-last page to avoid last-page short length
  useEffect(() => {
    const currentLength = Array.isArray(applicantData)
      ? applicantData.length
      : applicantData?.results?.length || 0;
    const isLastPage =
      !Array.isArray(applicantData) &&
      applicantData &&
      applicantData.next === null;
    if (currentLength > 0) {
      if (pageSize === 0) setPageSize(currentLength);
      else if (!isLastPage && currentLength !== pageSize)
        setPageSize(currentLength);
    }
  }, [applicantData, pageSize]);

  const effectivePageSize = pageSize || applicants.length || 1;
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
            <h2 className="mb-0">{role === "LEAD" ? "Leads" : "Applicants"}</h2>
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
            {role === "LEAD" && (
              <Button color="primary" onClick={toggleAddModal}>
                <TbCirclePlus className="me-1" />
                Add Lead
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
              ) : applicants.length > 0 ? (
                applicants.map((item: NetworkApplicantInfo) => (
                  <tr key={item.alias} className="text-center">
                    <td className="text-start">
                      <span
                        className="text_decoration_hover"
                        onClick={() => toggleViewModal(item)}
                        style={{ cursor: "pointer" }}
                      >
                        {item?.name ? (
                          item?.name
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </span>
                    </td>
                    <td>
                      {item?.email ? (
                        item.email
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {item?.phone ? (
                        <span className="text-black">{item?.phone}</span>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {item?.source === "OTHER" ? (
                        item?.other_source || (
                          <small className="text-muted">Not Available</small>
                        )
                      ) : item?.source ? (
                        formatChoiceFieldValue(item.source)
                      ) : (
                        <small className="text-muted">Not specified</small>
                      )}
                    </td>
                    <td>
                      {item?.enquiry_type === "OTHER" ? (
                        item?.other_enquiry_type || (
                          <small className="text-muted">Not Available</small>
                        )
                      ) : item?.enquiry_type ? (
                        formatChoiceFieldValue(item.enquiry_type)
                      ) : (
                        <small className="text-muted">Not specified</small>
                      )}
                    </td>
                    <td>
                      {item.created_by == null ? (
                        <small className="text-muted">Not Available</small>
                      ) : (
                        <>
                          <p className="m-0">
                            {item.created_by?.name || "Unknown User"}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            (
                            {item.created_by?.email
                              ? formatChoiceFieldValue(item.created_by?.email)
                              : "Not Found"}
                            )
                          </p>
                        </>
                      )}
                    </td>
                    <td>
                      {formatDateAndTime(item?.created_at || "Not Available")}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => openUpdateLeadModal(item)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => openDeleteLeadModal(item)}
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
                    No {role === "LEAD" ? "Leads" : "Applicants"} available.
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
                of {totalCount} {role === "LEAD" ? " Leads" : " Applicants"}
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
        <ViewOrgApplicantModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedApplicant={selectedApplicant}
          role={role}
        />
        <AddNetworkApplicantModal
          isOpen={isAddModalOpen}
          toggle={toggleAddModal}
          onApplicantCreated={() => setCurrentPage(1)}
          onOpenCase={handleOpenCase}
          role={role}
        />
        <UpdateNetworkApplicantModal
          isOpen={isUpdateModalOpen}
          toggle={() => setIsUpdateModalOpen(false)}
          applicantToUpdate={leadToUpdate}
          role={role}
        />
        <DeleteNetworkApplicantModal
          isOpen={isDeleteModalOpen}
          toggle={() => setIsDeleteModalOpen(false)}
          applicantToDelete={leadToDelete}
          role={role}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default NetworkApplicants;
