"use client";
import { useGetOrgUserListQuery } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/OrgUserListApi";
import { OrgAdviserInfo } from "@/Types/Network/Director/Users/Organisations/OrgAdviserType";
import LoadingSpinner from "@/app/loading";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { FaSearch } from "react-icons/fa";
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
  Row,
  Spinner,
  Table,
} from "reactstrap";
import ViewOrgAdviserModals from "./Modals/ViewOrgAdviserModals";

const OrgAdvisers: React.FC = () => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;
  const [advisers, setAdvisers] = useState<OrgAdviserInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stablePageSize, setStablePageSize] = useState<number>(0);
  const [isViewOrgAdviserModalOpen, setIsViewOrgAdviserModalOpen] =
    useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState<
    Partial<OrgAdviserInfo>
  >({});

  const toggleViewOrgAdviserModal = (adviser?: Partial<OrgAdviserInfo>) => {
    if (adviser) {
      setSelectedAdviser(adviser);
    }
    setIsViewOrgAdviserModalOpen(!isViewOrgAdviserModalOpen);
  };

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: adviserData, isLoading } = useGetOrgUserListQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
        role: "ORGANISATION_ADVISER",
      },
    },
    { skip: !organisationslug },
  );

  useEffect(() => {
    if (adviserData) {
      const advisersArray: OrgAdviserInfo[] = Array.isArray(adviserData)
        ? adviserData
        : adviserData.results || adviserData.advisers;
      setAdvisers(advisersArray || []);
    }
  }, [adviserData]);

  // Server-side pagination: use API count and a stable page size
  const totalCount =
    adviserData && !Array.isArray(adviserData)
      ? adviserData.count
      : advisers.length;

  useEffect(() => {
    const currentLength = Array.isArray(adviserData)
      ? adviserData.length
      : adviserData?.results?.length || 0;
    const isLastPage =
      !Array.isArray(adviserData) && adviserData && adviserData.next === null;
    if (currentLength > 0) {
      if (stablePageSize === 0) setStablePageSize(currentLength);
      else if (!isLastPage && currentLength !== stablePageSize)
        setStablePageSize(currentLength);
    }
  }, [adviserData, stablePageSize]);

  const effectivePageSize = stablePageSize || advisers.length || 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePageSize));
  const currentAdvisers = advisers;

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
            <h2>Advisers</h2>
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
                <th className="text-start">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joining Date</th>
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
              ) : currentAdvisers.length > 0 ? (
                currentAdvisers.map((adviser) => (
                  <tr key={adviser.alias} className="text-center">
                    <td className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                      <span
                        className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                        style={{ width: 40, height: 40 }}
                      >
                        {adviser?.profile_image ? (
                          <Image
                            src={adviser?.profile_image}
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
                        onClick={() => toggleViewOrgAdviserModal(adviser)}
                        style={{ cursor: "pointer" }}
                      >
                        {adviser?.name}
                      </span>
                    </td>
                    <td>{adviser?.email || "-"}</td>
                    <td>
                      {adviser?.phone ? (
                        <a
                          href={`tel:${adviser?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {adviser?.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {adviser?.joining_date ? adviser.joining_date : "-"}
                    </td>
                    <td>
                      <p className="m-0">
                        {adviser.created_by
                          ? `${
                              adviser.created_by?.title
                                ? formatChoiceFieldValue(
                                    adviser.created_by.title,
                                  ).trim() + " "
                                : ""
                            }${adviser.created_by.first_name || ""} ${
                              adviser.created_by.middle_name || ""
                            } ${adviser.created_by.last_name || ""}`.trim()
                          : "Not found"}
                      </p>
                      <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
                        (
                        {adviser.created_by?.user_type
                          ? formatChoiceFieldValue(adviser.created_by.user_type)
                          : "Not found"}
                        )
                      </p>
                    </td>
                    <td>{formatDateAndTime(adviser?.created_at)}</td>
                    <td>
                      {adviser?.is_active ? (
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
                    No advisers available.
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
                of {totalCount} Advisers
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
      <ViewOrgAdviserModals
        isOpen={isViewOrgAdviserModalOpen}
        toggle={toggleViewOrgAdviserModal}
        selectedAdviser={selectedAdviser}
      />
    </Card>
  );
};

export default OrgAdvisers;
