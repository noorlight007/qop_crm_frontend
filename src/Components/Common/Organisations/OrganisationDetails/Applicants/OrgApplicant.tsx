"use client";
import { useGetOrgLeadAndApplicantListQuery } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgUserListApi";
import { OrgApplicantInfo } from "@/Types/Network/Director/Organisations/OrgApplicantType";
import LoadingSpinner from "@/app/loading";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import {
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
import ViewOrgApplicantModal from "./Modals/ViewOrgApplicantModal";

const OrgApplicants: React.FC = () => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;
  const [applicants, setApplicants] = useState<OrgApplicantInfo[]>([]);
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
  const { data: applicantData, isLoading } = useGetOrgLeadAndApplicantListQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
        is_lead: false,
      },
    },
    { skip: !organisationslug },
  );

  const [selectedApplicant, setSelectedApplicant] = useState<
    Partial<OrgApplicantInfo>
  >({
    alias: "",
    profile_image: "",
    name: "",
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
      user_type: "",
    },
    created_at: "",
  });

  const toggleViewModal = (client?: OrgApplicantInfo) => {
    if (client) {
      setSelectedApplicant(client);
    }
    setIsViewModalOpen(!isViewModalOpen);
  };

  useEffect(() => {
    if (applicantData) {
      const applicantsData = Array.isArray(applicantData)
        ? applicantData
        : applicantData.results || applicantData.clients;
      setApplicants(applicantsData || []);
    }
  }, [applicantData]);

  // Server-side pagination: derive totalCount and a stable page size to avoid inflated pages
  const totalCount =
    applicantData && !Array.isArray(applicantData)
      ? applicantData.count
      : applicants.length;

  // capture a stable page size from pages that are not the last page
  useEffect(() => {
    const currentLength = Array.isArray(applicantData)
      ? applicantData.length
      : applicantData?.results?.length || 0;
    const isLastPage =
      !Array.isArray(applicantData) &&
      applicantData &&
      applicantData.next === null;
    if (currentLength > 0) {
      if (stablePageSize === 0) setStablePageSize(currentLength);
      else if (!isLastPage && currentLength !== stablePageSize)
        setStablePageSize(currentLength);
    }
  }, [applicantData, stablePageSize]);

  const effectivePageSize = stablePageSize || applicants.length || 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePageSize));
  const currentApplicants = applicants;

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
            <h2>Applicants</h2>
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
                id="orgClientSearch"
                className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                style={{ cursor: "pointer", zIndex: 10 }}
              />

              <UncontrolledPopover
                placement="right"
                target="orgClientSearch"
                trigger="hover"
              >
                <PopoverBody className="bg-white rounded text-dark p-3 small">
                  🔍 You can search using Name, Email Address or Phone Number.
                </PopoverBody>
              </UncontrolledPopover>
            </InputGroup>
          </Col>
          <Col md="3" xs="12" />
        </Row>
        <Row>
          <Table hover responsive>
            <thead className="thead-light">
              <tr className="text-center">
                <th className="text-start">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
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
              ) : currentApplicants.length > 0 ? (
                currentApplicants.map((applicant: any) => (
                  <tr key={applicant.alias} className="text-center">
                    <td>
                      <div className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                        <span
                          className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                          style={{ width: 40, height: 40 }}
                        >
                          {applicant?.profile_image ? (
                            <Image
                              src={applicant.profile_image}
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
                          onClick={() => toggleViewModal(applicant)}
                          style={{ cursor: "pointer" }}
                        >
                          {applicant.title
                            ? formatChoiceFieldValue(applicant.title)
                            : ""}
                          {"."} {applicant?.first_name} {applicant?.middle_name}{" "}
                          {applicant?.last_name}
                        </span>
                      </div>
                    </td>
                    <td>
                      {applicant?.email ? (
                        applicant.email
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {applicant?.phone ? (
                        <span className="text-black">{applicant?.phone}</span>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {applicant?.source ? (
                        formatChoiceFieldValue(applicant?.source)
                      ) : (
                        <small className="text-muted">Not Found</small>
                      )}
                    </td>
                    <td>
                      {applicant.created_by == null ? (
                        <small className="text-muted">Not Available</small>
                      ) : (
                        <>
                          <p className="m-0">
                            {applicant.created_by?.name || "Unknown User"}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            (
                            {applicant.created_by?.user_type
                              ? formatChoiceFieldValue(
                                  applicant.created_by?.user_type,
                                )
                              : "Not Found"}
                            )
                          </p>
                        </>
                      )}
                    </td>
                    <td>{formatDateAndTime(applicant?.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No applicants available.
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
                  : (currentPage - 1) * effectivePageSize + 1}{" "}
                to{" "}
                {Math.min(
                  (currentPage - 1) * effectivePageSize + effectivePageSize,
                  totalCount,
                )}{" "}
                of {totalCount} Applicants
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

        {/* modals */}
        <ViewOrgApplicantModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedApplicant={selectedApplicant}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default OrgApplicants;
