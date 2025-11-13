import ViewAdviserModal from "@/Components/General/Dashboard/CommonComponents/Directors/Advisers/Modals/ViewAdviserModal";
import { useGetOrgAdvisersQuery } from "@/Redux/Reducers/Network/Organisations/SingleOrganisation/OrgAdvisersApi";
import {
  AdviserInfoProps,
  AdvisersProps,
} from "@/Types/CommonComponents/Directors/AdviserTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
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

const OrgAdvisers: React.FC<AdvisersProps> = ({ advisersPerPage = 5 }) => {
  const { organisationslug } = useParams();
  const [advisers, setAdvisers] = useState<AdviserInfoProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: adviserData, isLoading } = useGetOrgAdvisersQuery(
    { organisationslug },
    {
      skip: !organisationslug,
    }
  );

  const [selectedAdviser, setSelectedAdviser] = useState<
    Partial<AdviserInfoProps>
  >({
    user: {
      id: 0,
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
    joining_date: "",
    gender: "",
  });

  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);

  useEffect(() => {
    if (adviserData) {
      const advisersArray: AdviserInfoProps[] = Array.isArray(adviserData)
        ? adviserData
        : adviserData.advisers;
      setAdvisers(advisersArray || []);
    }
  }, [adviserData]);

  const filteredAdvisers = advisers.filter((adviser) => {
    const fullName = `${adviser?.user?.title || ""} ${
      adviser?.user?.first_name || ""
    } ${adviser?.user?.middle_name || ""} ${
      adviser?.user?.last_name || ""
    }`.toLowerCase();

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      adviser?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastAdviser = currentPage * advisersPerPage;
  const indexOfFirstAdviser = indexOfLastAdviser - advisersPerPage;
  const currentAdvisers = filteredAdvisers.slice(
    indexOfFirstAdviser,
    indexOfLastAdviser
  );

  const totalPages = Math.ceil(filteredAdvisers.length / advisersPerPage);

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
                placeholder="Search by name or email... "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              ) : currentAdvisers.length > 0 ? (
                currentAdvisers.map((adviser) => (
                  <tr key={adviser.alias} className="text-center">
                    <td>
                      <span
                        className="text_decoration_hover"
                        onClick={() => {
                          setSelectedAdviser(adviser);
                          toggleViewModal();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {adviser.user?.title
                          ? formatChoiceFieldValue(adviser.user.title)
                          : ""}
                        {"."} {adviser?.user?.first_name}{" "}
                        {adviser?.user?.middle_name} {adviser?.user?.last_name}
                      </span>
                    </td>
                    <td>{adviser?.user?.email || "-"}</td>
                    <td>
                      {adviser?.user?.phone ? (
                        <a
                          href={`tel:${adviser?.user?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {adviser?.user?.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {adviser?.role
                        ? formatChoiceFieldValue(adviser.role)
                        : "-"}
                    </td>
                    <td>
                      <p className="m-0">
                        {adviser.created_by
                          ? `${
                              adviser.created_by?.title
                                ? formatChoiceFieldValue(
                                    adviser.created_by.title
                                  )
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
                    <td>{formatDateToDMYAndTime(adviser?.created_at)}</td>
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
              <p className="text-success">
                Showing{" "}
                {filteredAdvisers.length === 0 ? "0" : indexOfFirstAdviser + 1}{" "}
                to {Math.min(indexOfLastAdviser, filteredAdvisers.length)} of{" "}
                {filteredAdvisers.length} Advisers
              </p>
            </div>
            <Pagination>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first onClick={() => setCurrentPage(1)} />
              </PaginationItem>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>

              {totalPages <= advisersPerPage ? (
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
                      (pageNumber) => pageNumber > 1 && pageNumber < totalPages
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
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
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

        {/* modals */}
        <ViewAdviserModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedAdviser={selectedAdviser}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default OrgAdvisers;
