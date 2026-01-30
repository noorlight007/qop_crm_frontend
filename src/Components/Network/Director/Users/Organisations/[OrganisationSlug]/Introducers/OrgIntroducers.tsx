"use client";
import { useGetOrgUserListQuery } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/OrgUserListApi";
import { OrgIntroducerInfo } from "@/Types/Network/Director/Users/Organisations/OrgIntroducerTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import {
  Badge,
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
import ViewOrgIntroducerModal from "./Modals/ViewOrgIntroducerModal";

const OrgIntroducers: React.FC = () => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;
  const [introducers, setIntroducers] = useState<OrgIntroducerInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stablePageSize, setStablePageSize] = useState<number>(0);
  const [isViewOrgIntroducerModalOpen, setIsViewOrgIntroducerModalOpen] =
    useState(false);
  const [selectedIntroducer, setSelectedIntroducer] = useState<
    Partial<OrgIntroducerInfo>
  >({});

  const toggleViewOrgIntroducerModal = (
    introducer?: Partial<OrgIntroducerInfo>,
  ) => {
    if (introducer) {
      setSelectedIntroducer(introducer);
    }
    setIsViewOrgIntroducerModalOpen(!isViewOrgIntroducerModalOpen);
  };

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: introducerData, isLoading } = useGetOrgUserListQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
        role: "INTRODUCER",
      },
    },
    { skip: !organisationslug },
  );

  useEffect(() => {
    if (introducerData) {
      const introducersArray: OrgIntroducerInfo[] = Array.isArray(
        introducerData,
      )
        ? introducerData
        : introducerData.results || introducerData.admins;
      setIntroducers(introducersArray || []);
    }
  }, [introducerData]);

  // Server-side pagination: use API count and a stable page size
  const totalCount =
    introducerData && !Array.isArray(introducerData)
      ? introducerData.count
      : introducers.length;
  useEffect(() => {
    const currentLength = Array.isArray(introducerData)
      ? introducerData.length
      : introducerData?.results?.length || 0;
    const isLastPage =
      !Array.isArray(introducerData) &&
      introducerData &&
      introducerData.next === null;
    if (currentLength > 0) {
      if (stablePageSize === 0) setStablePageSize(currentLength);
      else if (!isLastPage && currentLength !== stablePageSize)
        setStablePageSize(currentLength);
    }
  }, [introducerData, stablePageSize]);

  const effectivePageSize = stablePageSize || introducers.length || 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePageSize));
  const currentIntroducers = introducers;

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
            <h2>Introducers</h2>
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
                id="orgIntoducerSearch"
                className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                style={{ cursor: "pointer", zIndex: 10 }}
              />

              <UncontrolledPopover
                placement="right"
                target="orgIntoducerSearch"
                trigger="hover"
              >
                <PopoverBody className="bg-white rounded text-dark p-3 small">
                  🔍 You can search using Title(e.g., Mr, Ms), First Name,
                  Middle Name, Last Name, Email Address or Phone Number.
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
                <th>Joining Date</th>
                <th>Company Name</th>
                <th>Company Address</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Status</th>
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
              ) : currentIntroducers.length > 0 ? (
                currentIntroducers.map((introducer) => (
                  <tr key={introducer.alias} className="text-center">
                    <td className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                      <span
                        className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                        style={{ width: 40, height: 40 }}
                      >
                        {introducer?.profile_image ? (
                          <Image
                            src={introducer?.profile_image}
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
                        onClick={() => toggleViewOrgIntroducerModal(introducer)}
                        style={{ cursor: "pointer" }}
                      >
                        {introducer?.name}
                      </span>
                    </td>
                    <td>
                      {introducer?.email ? (
                        introducer.email
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {introducer?.phone ? (
                        <a
                          href={`tel:${introducer?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {introducer?.phone}
                        </a>
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {introducer?.joining_date ? (
                        introducer.joining_date
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {introducer?.company_name ? (
                        introducer.company_name
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {introducer?.company_address ? (
                        introducer.company_address
                      ) : (
                        <small className="text-muted">Not Available</small>
                      )}
                    </td>
                    <td>
                      {introducer.created_by == null ? (
                        <small className="text-muted">Not Available</small>
                      ) : (
                        <>
                          <p className="m-0">
                            {introducer.created_by?.title
                              ? formatChoiceFieldValue(
                                  introducer.created_by?.title,
                                )
                              : ""}{" "}
                            {introducer?.created_by?.first_name}{" "}
                            {introducer?.created_by?.middle_name}{" "}
                            {introducer?.created_by?.last_name}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            (
                            {introducer.created_by?.user_type
                              ? formatChoiceFieldValue(
                                  introducer.created_by?.user_type,
                                )
                              : ""}
                            )
                          </p>
                        </>
                      )}
                    </td>
                    <td>{formatDateAndTime(introducer?.created_at)}</td>
                    <td>
                      {introducer?.is_active ? (
                        <Badge color="success">Approved</Badge>
                      ) : (
                        <Badge color="danger">Pending</Badge>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No introducers available.
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
                of {totalCount} Introducers
              </p>
            </div>
            {totalPages > 1 && (
              <Pagination className="d-flex">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                  ),
                )}

                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    next
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
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
      </CardBody>
      {/* Modals */}
      <ViewOrgIntroducerModal
        isOpen={isViewOrgIntroducerModalOpen}
        toggle={toggleViewOrgIntroducerModal}
        selectedIntroducer={selectedIntroducer}
      />
    </Card>
  );
};

export default OrgIntroducers;
