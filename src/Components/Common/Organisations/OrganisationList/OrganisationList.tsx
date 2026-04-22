import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetOrganisationListQuery } from "@/Redux/Reducers/Common/Organisations/OrganisationListApi";
import { SingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import { getOrganisationUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
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
  UncontrolledPopover,
} from "reactstrap";
import AddOrganisationModal from "../Modals/AddOrganisationModal";

type OrganisationListProps = {
  maxItems?: number;
};

const OrganisationList: React.FC<OrganisationListProps> = ({ maxItems }) => {
  const pathname = window.location.pathname;
  const { data: session } = useSession();
  const [organisations, setOrganisations] = useState<SingleOrganisationProps[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  //RTK Hooks
  const {
    data: organisationList,
    isLoading,
    error,
  } = useGetOrganisationListQuery({
    search: searchQuery,
    page: currentPage,
    page_size: maxItems,
  });

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Fetch organisations when the search query changes
  useEffect(() => {
    try {
      if (organisationList) {
        setOrganisations(
          (organisationList as any).results ?? (organisationList as any),
        );
      }
    } catch (error) {
      console.error("Error fetching organisations:", error);
    }
  }, [organisationList]);

  // Pagination logic
  const itemsPerPage = maxItems ?? (organisationList as any)?.page_size ?? 12;
  // Ensure we only render up to `itemsPerPage` items even if the API returned more
  const currentOrganisations = organisations?.slice(0, itemsPerPage) ?? [];
  const totalCount = (organisationList as any)?.count ?? organisations.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // Ensure currentPage is always within the valid range when totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Extract API error detail (if any) for display
  const apiErrorDetail: string | null = (() => {
    if (!error) return null;
    // RTK Query error can be an object with `data` or a string
    const data = (error as any)?.data ?? (error as any);
    const detail = data?.detail ?? data?.message ?? data;
    if (!detail) return JSON.stringify(error);
    return typeof detail === "string" ? detail : JSON.stringify(detail);
  })();

  return (
    <Card>
      <Row>
        <Col md="12" className="px-4">
          <Row className="flex justify-content-between py-4">
            <Col md="3">
              <h4 className="mb-4 fw-bold">Organisations</h4>
            </Col>
            <Col md={3} xs="12">
              <InputGroup className="position-relative">
                <FaSearch
                  className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                  style={{ zIndex: 10, pointerEvents: "none" }}
                />
                <Input
                  type="text"
                  placeholder="Search Organisation... "
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ padding: "10px 10px 10px 25px" }}
                  className="rounded-end-1"
                />
                <FaInfoCircle
                  id="OrgListSearchSuggestion"
                  className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                  style={{ cursor: "pointer", zIndex: 10 }}
                />

                <UncontrolledPopover
                  placement="right"
                  target="OrgListSearchSuggestion"
                  trigger="hover"
                >
                  <PopoverBody className="bg-white rounded text-dark p-3 small">
                    🔍 You can search using Organisation Name.
                  </PopoverBody>
                </UncontrolledPopover>
              </InputGroup>
            </Col>
            <Col
              md="3"
              xs="12"
              className="text-md-end text-center mt-2 mt-md-0"
            >
              {session?.user.role &&
                session.user.is_network &&
                (session.user.role === "DIRECTOR" ||
                  session.user.role === "COMPLIANCE") && (
                  <Button color="primary" onClick={toggleModal}>
                    <TbCirclePlus size={18} className="me-1" />
                    Add Organisation
                  </Button>
                )}
            </Col>
          </Row>
          <Row>
            {isLoading ? (
              <Row className="pb-4 d-flex justify-content-center">
                <LoadingGrow />
              </Row>
            ) : currentOrganisations && currentOrganisations?.length > 0 ? (
              currentOrganisations.map((item: any) => (
                <Col
                  sm="6"
                  xxl="3"
                  lg="4"
                  xl="4"
                  className="col-ed-4 box-col-4"
                  key={item.slug}
                >
                  <Card className="bg-white border organisation_card opacity-100  p-3 position-relative">
                    {session?.user.role &&
                      session.user.is_network &&
                      (session.user.role === "DIRECTOR" ||
                        session.user.role === "COMPLIANCE") && (
                        <Link
                          href={`${getOrganisationUrl(session)}/${item.slug}`}
                          title="Website"
                          className="text-muted position-absolute top-0 end-0 p-3"
                        >
                          <i
                            style={{ fontSize: "10px" }}
                            className="fa-solid fa-up-right-from-square"
                          ></i>
                        </Link>
                      )}
                    <CardBody className="p-0 ">
                      <div className="d-flex gap-2">
                        <div className="mt-0 rounded-circle overflow-hidden border-1 border-primary">
                          <Image
                            width="28"
                            height="28"
                            className="object-fit-cover"
                            src={item.logo || "/assets/images/network/logo.jpg"}
                            alt="Organisation"
                          />
                        </div>
                        <h5 className="mb-1">
                          {session?.user.role &&
                          session.user.is_network &&
                          (session.user.role === "DIRECTOR" ||
                            session.user.role === "COMPLIANCE") ? (
                            <Link
                              className="text-black fw-bold text_decoration_hover"
                              href={`${getOrganisationUrl(session)}/${item.slug}`}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <span className="text-black fw-bold">
                              {item.name}
                            </span>
                          )}
                        </h5>
                      </div>
                      <div className="mt-2 mb-4 text-truncate">
                        {item.email}
                      </div>
                      <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                        <Col className="border-end">
                          <div className="text-center ">
                            <h5 className="mb-0">{item.total_cases}</h5>
                            <span className="text-primary small">Cases</span>
                          </div>
                        </Col>
                        <Col className="border-end">
                          <div className="text-center">
                            <h5 className="mb-0">{item.total_advisers}</h5>
                            <span className="text-primary small">Advisers</span>
                          </div>
                        </Col>
                        <Col className="">
                          <div className="text-center">
                            <h5 className="mb-0">{item.total_introducers}</h5>
                            <span className="text-primary small">
                              Introducers
                            </span>
                          </div>
                        </Col>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))
            ) : (
              <Row className="text-center">
                <p>Organisations not found!</p>
                {apiErrorDetail ? (
                  <p className="text-danger">{apiErrorDetail}</p>
                ) : (
                  <p className="text-muted">
                    No organisations match the search.
                  </p>
                )}
              </Row>
            )}
          </Row>
          {/* Pagination and total organisations */}
          {pathname === "/network/director/dashboard" ||
          pathname === "/network/adviser/dashboard" ? (
            <div className="d-flex justify-content-end">
              <Button
                color="link"
                className="text-primary p-0 mb-4"
                href={`${getOrganisationUrl(session)}`}
              >
                View All Organisations
              </Button>
            </div>
          ) : (
            <Row>
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="px-2">
                  <p className="text-primary">
                    Showing{" "}
                    {totalCount === 0
                      ? "0"
                      : (currentPage - 1) * itemsPerPage + 1}{" "}
                    to{" "}
                    {currentOrganisations.length === 0
                      ? 0
                      : (currentPage - 1) * itemsPerPage +
                        currentOrganisations.length}{" "}
                    of {totalCount} Organisations
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
            </Row>
          )}
          {/* Add Organisation Modal */}
          <AddOrganisationModal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default OrganisationList;
