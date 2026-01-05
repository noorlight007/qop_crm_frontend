import { useGetOrganisationListQuery } from "@/Redux/Reducers/Network/Director/Organisations/OrganisationListApi";
import { SingleOrganisationProps } from "@/Types/Network/Director/OrganisationsTypes";
import { getOrganisationUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
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
  Row,
  Spinner,
} from "reactstrap";
import AddOrganisationModal from "../Modals/AddOrganisationModal";
import "../Organisations.css";

type OrganisationListProps = {
  maxItems?: number;
};

const OrganisationList: React.FC<OrganisationListProps> = ({ maxItems }) => {
  const { data: session } = useSession();
  const [organisations, setOrganisations] = useState<SingleOrganisationProps[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // If a caller passes `maxItems`, use it as the items per page; otherwise default to 12
  const itemsPerPage = maxItems ?? 12;

  //RTK Hooks
  const { data: organisationList, isLoading } = useGetOrganisationListQuery({
    search: searchQuery,
  });

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Fetch organisations when the search query changes
  useEffect(() => {
    try {
      if (organisationList) {
        setOrganisations(organisationList);
      }
    } catch (error) {
      console.error("Error fetching organisations:", error);
    }
  }, [organisationList]);

  // Pagination logic
  const totalPages = Math.ceil(organisations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrganisations = organisations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: "10px 10px 10px 25px" }}
                />
              </InputGroup>
            </Col>
            <Col
              md="3"
              xs="12"
              className="text-md-end text-center mt-2 mt-md-0"
            >
              {session?.user.user_type === "NETWORK_DIRECTOR" && (
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
                <Spinner color="primary" />
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
                    <Link
                      href={`${getOrganisationUrl(session)}/${item.slug}`}
                      target="_blank"
                      title="Website"
                      className="text-muted position-absolute top-0 end-0 p-3"
                    >
                      <i
                        style={{ fontSize: "10px" }}
                        className="fa-solid fa-up-right-from-square"
                      ></i>
                    </Link>
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
                          <Link
                            className="text-black fw-bold text_decoration_hover"
                            href={`${getOrganisationUrl(session)}/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </h5>
                      </div>
                      <div className="mt-2 mb-4">{item.email}</div>
                      <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                        <Col className="border-end">
                          <div className="text-center ">
                            <h5 className="mb-0">{item.total_cases}</h5>
                            <span className="text-primary small">Cases</span>
                          </div>
                        </Col>
                        <Col className="border-end">
                          <div className="text-center ">
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
              </Row>
            )}
          </Row>
          {/* Pagination and total organisations */}
          <Row>
            <div className="d-flex justify-content-between align-items-center px-3 pb-3">
              <div className="px-2">
                <p className="text-primary">
                  Showing 1 to{" "}
                  {Math.min(itemsPerPage, currentOrganisations?.length || 0)} of{" "}
                  {organisations?.length || 0} Organisations
                </p>
              </div>

              {organisations.length > itemsPerPage && (
                <Pagination className="d-flex justify-content-end align-items-center">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink first onClick={() => setCurrentPage(1)} />
                  </PaginationItem>
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink
                      previous
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                  </PaginationItem>

                  {totalPages <= 5 ? (
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
                          (pageNumber) =>
                            pageNumber > 1 && pageNumber < totalPages
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
              )}
            </div>
          </Row>

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
