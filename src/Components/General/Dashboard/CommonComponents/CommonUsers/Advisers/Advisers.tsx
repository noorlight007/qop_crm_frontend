import { useGetAdviserDetailsQuery } from "@/Redux/Reducers/CommonComponents/CommonUsers/AdvisersApi";
import {
  AdviserInfoProps,
  AdvisersProps,
} from "@/Types/CommonComponents/CommonUsers/AdviserTypes";
import LoadingSpinner from "@/app/loading";
import { formatDate, formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { FaSearch } from "react-icons/fa";
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
  Table,
} from "reactstrap";
import AddAdviserModal from "../../CommonUsers/Advisers/Modals/AddAdviserModal";
import DeleteAdviserModal from "../../CommonUsers/Advisers/Modals/DeleteAdviserModal";
import UpdateAdviserModal from "../../CommonUsers/Advisers/Modals/UpdateAdviserModal";
import ViewAdviserModal from "../../CommonUsers/Advisers/Modals/ViewAdviserModal";

const Advisers: React.FC<AdvisersProps> = ({ advisersPerPage = 10 }) => {
  const { data: session } = useSession();
  const [advisers, setAdvisers] = useState<AdviserInfoProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adviserToDelete, setAdviserToDelete] =
    useState<AdviserInfoProps | null>(null);

  const { data: adviserData, isLoading } = useGetAdviserDetailsQuery({
    page: currentPage,
    page_size: advisersPerPage,
    search: debouncedSearch || undefined,
  });

  const [selectedAdviser, setSelectedAdviser] = useState<
    Partial<AdviserInfoProps>
  >({
    user: {
      id: 0,
      title: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      profile_image: "",
      user_type: "",
    },
    role: "",
    gender: "",
    joining_date: "",
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const openDeleteModal = (adviser: AdviserInfoProps) => {
    setAdviserToDelete(adviser);
    toggleDeleteModal();
  };

  useEffect(() => {
    if (adviserData) {
      if (Array.isArray(adviserData)) {
        setAdvisers(adviserData || []);
        setTotalCount(adviserData.length || 0);
      } else if ((adviserData as any).results) {
        setAdvisers((adviserData as any).results || []);
        setTotalCount((adviserData as any).count || 0);
      } else if ((adviserData as any).advisers) {
        setAdvisers((adviserData as any).advisers || []);
        setTotalCount(((adviserData as any).advisers || []).length || 0);
      } else {
        setAdvisers([]);
        setTotalCount(0);
      }
    }
  }, [adviserData]);

  // openmodals
  const openAddModal = () => {
    toggleModal();
  };

  const openUpdateModal = (adviser: AdviserInfoProps) => {
    setSelectedAdviser(adviser);
    toggleUpdateModal();
  };
  // openmodals end

  // Server-side search/pagination. `advisers` already contains current page results.
  const currentAdvisers = advisers;
  const totalPages = Math.ceil(totalCount / advisersPerPage) || 1;

  // Debounce search input so we don't fire API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

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
          <Col md={3}>
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
              />
            </InputGroup>
          </Col>
          <Col
            md="3"
            xs="12"
            className="d-flex justify-content-end mt-sm-0 mt-2"
          >
            {/* {session?.user?.user_type !== "NETWORK_COMPLIANCE_ASSISTANT" && (
              <Button
                color="primary"
                onClick={openAddModal}
                className="d-flex justify-content-center align-items-center gap-1"
              >
                <TbCirclePlus size={18} />
                <span>Add adviser</span>
              </Button>
            )} */}
          </Col>
        </Row>
        <Row>
          <Table hover responsive>
            <thead className="thead-light">
              <tr className="text-center">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Joining Date</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner color="primary" />
                    </div>
                  </td>
                </tr>
              ) : currentAdvisers.length > 0 ? (
                currentAdvisers.map((adviser) => (
                  <tr key={adviser.alias} className="text-center">
                    <td className="d-flex justify-content-center align-items-center gap-1 text-truncate">
                      <span
                        className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                        style={{ width: 40, height: 40 }}
                      >
                        {adviser.user?.profile_image ? (
                          <Image
                            src={adviser.user.profile_image}
                            alt="Profile"
                            width={35}
                            height={35}
                            className="rounded-circle"
                          />
                        ) : (
                          <User size={35} className="text-secondary" />
                        )}
                      </span>
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
                          : ""}{" "}
                        {adviser?.user?.first_name} {adviser?.user?.middle_name}{" "}
                        {adviser?.user?.last_name}
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
                      {adviser?.gender
                        ? formatChoiceFieldValue(adviser.gender)
                        : "-"}
                    </td>
                    <td>
                      {adviser?.joining_date &&
                      !isNaN(Date.parse(adviser.joining_date))
                        ? formatDate(adviser.joining_date)
                        : "-"}
                    </td>
                    <td>
                      <p className="m-0">
                        {adviser.created_by
                          ? `${
                              adviser.created_by?.title
                                ? formatChoiceFieldValue(
                                    adviser.created_by.title
                                  ) + " "
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
                      <div className="d-flex justify-content-center gap-2 align-items-center">
                        <Button
                          color="primary"
                          size="sm"
                          title="Update User"
                          onClick={() => openUpdateModal(adviser)}
                        >
                          <i className="icon-pencil-alt"></i>
                        </Button>
                        {/* <Button
                          color="danger"
                          size="sm"
                          title="Delete User"
                          onClick={() => openDeleteModal(adviser)}
                        >
                          <i className="icon-trash"></i>
                        </Button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
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
                  : (currentPage - 1) * advisersPerPage + 1}{" "}
                to{" "}
                {currentAdvisers.length === 0
                  ? 0
                  : (currentPage - 1) * advisersPerPage +
                    currentAdvisers.length}{" "}
                of {totalCount} Advisers
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
        <AddAdviserModal isOpen={isModalOpen} toggle={toggleModal} />
        <ViewAdviserModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedAdviser={selectedAdviser}
        />
        <UpdateAdviserModal
          isOpen={isUpdateModalOpen}
          toggle={toggleUpdateModal}
          onSave={() => {
            toggleUpdateModal();
          }}
          selectedAdviser={selectedAdviser}
        />
        <DeleteAdviserModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          adviserAlias={adviserToDelete?.alias || ""}
          adviserName={`${
            adviserToDelete?.user?.title
              ? formatChoiceFieldValue(adviserToDelete?.user?.title) + " "
              : ""
          }${adviserToDelete?.user?.first_name || ""}${
            adviserToDelete?.user?.middle_name
              ? " " + adviserToDelete.user.middle_name
              : ""
          }${
            adviserToDelete?.user?.last_name
              ? " " + adviserToDelete.user.last_name
              : ""
          }`}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default Advisers;
