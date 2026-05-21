import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetAdvertisersQuery } from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import {
  Advertiser,
  AdvertiserListResponse,
} from "@/Types/SuperAdmin/Advertisers/AdvertisersTypes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle } from "react-feather";
import { FaEnvelope, FaGlobe, FaInfoCircle, FaSearch } from "react-icons/fa";
import {
  Alert,
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
  UncontrolledPopover,
} from "reactstrap";
import AddAdvertiserModal from "./Modal/AddAdvertiserModal";

const getInitials = (value?: string | null) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "—";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second =
    parts.length > 1 ? (parts[1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  return (first + second).toUpperCase() || "—";
};

const toAbsoluteUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const AdvertiserList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddAdvertiserOpen, setIsAddAdvertiserOpen] = useState(false);
  const itemsPerPage = 12;

  const toggleAddAdvertiserModal = () =>
    setIsAddAdvertiserOpen((prev) => !prev);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const {
    data: advertisersData,
    isLoading,
    isFetching,
    error,
  } = useGetAdvertisersQuery({
    search: debouncedSearch,
    page: currentPage,
    page_size: itemsPerPage,
  });

  const response = advertisersData as AdvertiserListResponse | Advertiser[];
  const advertisers: Advertiser[] = Array.isArray(response)
    ? response
    : (response?.results ?? []);

  const totalCount = Array.isArray(response)
    ? advertisers.length
    : (response?.count ?? advertisers.length);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const apiErrorDetail: string | null = (() => {
    if (!error) return null;
    const data = (error as any)?.data ?? (error as any);
    const detail = data?.detail ?? data?.message ?? data;
    if (!detail) return JSON.stringify(error);
    return typeof detail === "string" ? detail : JSON.stringify(detail);
  })();

  if (isLoading) {
    return (
      <Row className="py-5">
        <Col xs="12" className="text-center">
          <LoadingGrow />
        </Col>
      </Row>
    );
  }

  if (apiErrorDetail) {
    return (
      <Row className="mt-3">
        <Col xs="12">
          <Alert color="danger" className="mb-0">
            {apiErrorDetail}
          </Alert>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row>
        <Col lg={5} md={4} xs="12" />
        <Col lg={3} md={4} xs="12">
          <InputGroup className="position-relative">
            <FaSearch
              className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
              style={{ zIndex: 10, pointerEvents: "none" }}
            />
            <Input
              type="text"
              placeholder="Search... "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ padding: "10px 10px 10px 25px" }}
              className="rounded-end-1"
            />
            <FaInfoCircle
              id="AdvertisersPopover"
              className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
              style={{ cursor: "pointer", zIndex: 10 }}
            />

            <UncontrolledPopover
              placement="right"
              target="AdvertisersPopover"
              trigger="hover"
            >
              <PopoverBody className="bg-white rounded text-dark p-3 small">
                🔍 You can search using Company Name.
              </PopoverBody>
            </UncontrolledPopover>
          </InputGroup>
        </Col>

        <Col md={4} xs="12" className="text-md-end text-center mt-2 mt-md-0">
          <Button color="primary" onClick={toggleAddAdvertiserModal}>
            <PlusCircle size={16} className="me-2" />
            Add Advertiser
          </Button>
        </Col>
      </Row>

      {isFetching ? <LoadingGrow /> : null}

      <Row className="mt-4 g-4">
        {advertisers.length === 0 ? (
          <Col xs="12" className="text-center">
            <div className="text-muted">
              <FaSearch size={48} className="mb-3 opacity-50" />
              <h5 className="mb-1">No advertisers found</h5>
              <p className="mb-0">
                Try adjusting your search or create a new advertiser.
              </p>
            </div>
          </Col>
        ) : (
          advertisers.map((advertiser) => (
            <Col xs="12" md="4" xl="3" key={advertiser.alias}>
              <Card className="h-100 border-0 shadow-lg rounded-4 overflow-hidden mb-0 bg-white">
                <CardBody className="p-4 d-flex flex-column">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3 flex-grow-1 overflow-hidden">
                      <div className="rounded-circle bg-light-primary d-flex align-items-center justify-content-center img-40 img-h-40 flex-shrink-0">
                        <span className="fw-bold text-primary text-uppercase">
                          {getInitials(
                            advertiser.company_name || advertiser.alias,
                          )}
                        </span>
                      </div>

                      <div className="flex-grow-1 overflow-hidden ">
                        <Link
                          href={`/super-admin/advertisers/${advertiser.alias}`}
                          className="mb-1 fw-bold text-dark w-100 text_decoration_hover"
                        >
                          {advertiser.company_name || "Not provided"}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="border-top pt-3 mt-3 w-100">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="rounded-circle bg-light-primary d-flex align-items-center justify-content-center img-40 img-h-40 flex-shrink-0">
                        <FaEnvelope className="text-primary" />
                      </div>

                      <div className="flex-grow-1 overflow-hidden text-truncate">
                        <small className="text-muted d-block mb-1">Email</small>
                        {advertiser.contact_email ? (
                          advertiser.contact_email
                        ) : (
                          <small className="text-muted">Not provided</small>
                        )}
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-3">
                      <div className="rounded-circle bg-light-primary d-flex align-items-center justify-content-center img-40 img-h-40 flex-shrink-0">
                        <FaGlobe className="text-primary" />
                      </div>

                      <div className="flex-grow-1 overflow-hidden">
                        <small className="text-muted d-block mb-1 text-truncate">
                          Website
                        </small>
                        {advertiser.website ? (
                          <a
                            className="fw-medium text-dark text-decoration-none text-truncate d-block w-100"
                            href={toAbsoluteUrl(advertiser.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={advertiser.website}
                          >
                            {advertiser.website}
                          </a>
                        ) : (
                          <small className="text-muted">Not provided</small>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        )}

        {totalPages > 1 ? (
          <Col xs="12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 gap-3">
              <div className="px-2 text-center text-md-start">
                <p className="text-primary mb-0">
                  Showing{" "}
                  {totalCount === 0
                    ? "0"
                    : (currentPage - 1) * itemsPerPage + 1}{" "}
                  to{" "}
                  {advertisers.length === 0
                    ? 0
                    : (currentPage - 1) * itemsPerPage +
                      advertisers.length}{" "}
                  of {totalCount} Advertisers
                </p>
              </div>

              <Pagination className="d-flex justify-content-end p-2 mb-0 flex-wrap">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>

                {totalPages <= 7 ? (
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
                        (pageNumber) =>
                          pageNumber > 1 && pageNumber < totalPages,
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
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                      >
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
          </Col>
        ) : null}
      </Row>

      <AddAdvertiserModal
        isOpen={isAddAdvertiserOpen}
        toggleModal={toggleAddAdvertiserModal}
      />
    </>
  );
};

export default AdvertiserList;
