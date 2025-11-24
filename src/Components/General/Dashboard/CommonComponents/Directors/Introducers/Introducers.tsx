import { useGetIntroducerDetailsQuery } from "@/Redux/Reducers/CommonComponents/Directors/IntroducerDetailsApi";
import {
  IntroducerInfoProps,
  IntroducersProps,
} from "@/Types/CommonComponents/Directors/IntroducerTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
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
  Table,
} from "reactstrap";
import AddIntroducerModal from "./Modals/AddIntroducerModal";
import DeleteIntroducerModal from "./Modals/DeleteIntroducerModal";
import UpdateIntroducerModal from "./Modals/UpdateIntroducerModal";
import ViewIntroducerModal from "./Modals/ViewIntroducerModal";

const Introducers: React.FC<IntroducersProps> = ({
  introducersPerPage = 10,
}) => {
  const [introducers, setIntroducers] = useState<IntroducerInfoProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [introducerToDelete, setIntroducerToDelete] =
    useState<IntroducerInfoProps | null>(null);
  // Query with server-side pagination and search (debounced)
  const { data: introduceData, isLoading } = useGetIntroducerDetailsQuery({
    page: currentPage,
    page_size: introducersPerPage,
    search: debouncedSearch || undefined,
  });
  const [selectedIntroducer, setSelectedIntroducer] = useState<
    Partial<IntroducerInfoProps>
  >({
    user: {
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

  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const openDeleteModal = (introducer: IntroducerInfoProps) => {
    setIntroducerToDelete(introducer);
    toggleDeleteModal();
  };

  useEffect(() => {
    if (introduceData) {
      if (Array.isArray(introduceData)) {
        setIntroducers(introduceData || []);
        setTotalCount(introduceData.length || 0);
      } else if ((introduceData as any).results) {
        setIntroducers((introduceData as any).results || []);
        setTotalCount((introduceData as any).count || 0);
      } else if ((introduceData as any).introducers) {
        setIntroducers((introduceData as any).introducers || []);
        setTotalCount(((introduceData as any).introducers || []).length || 0);
      } else {
        setIntroducers([]);
        setTotalCount(0);
      }
    }
  }, [introduceData]);

  // Debounce search input to avoid excessive requests
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // openaddmodals
  const openAddModal = () => {
    toggleModal();
  };

  const openUpdateModal = (introducer: IntroducerInfoProps) => {
    setSelectedIntroducer(introducer);
    toggleUpdateModal();
  };
  // openaddmodals end

  // Server-side pagination: `introducers` contains current page results
  const currentIntroducers = introducers;
  const totalPages = Math.ceil(totalCount / introducersPerPage) || 1;

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
            <Button
              color="primary"
              onClick={openAddModal}
              className="d-flex justify-content-center align-items-center gap-1"
            >
              <TbCirclePlus size={18} />
              <span>Add Introducer</span>
            </Button>
          </Col>
        </Row>
        <Row>
          <Table hover responsive>
            <thead className="thead-light">
              <tr className="text-center">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
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
              ) : currentIntroducers.length > 0 ? (
                currentIntroducers.map((introducer) => (
                  <tr key={introducer.alias} className="text-center">
                    <td>
                      <span
                        className="text_decoration_hover"
                        onClick={() => {
                          setSelectedIntroducer(introducer);
                          toggleViewModal();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {introducer.user?.title
                          ? formatChoiceFieldValue(introducer.user?.title)
                          : ""}{" "}
                        {introducer?.user?.first_name}{" "}
                        {introducer?.user?.middle_name}{" "}
                        {introducer?.user?.last_name}
                      </span>
                    </td>
                    <td>{introducer?.user?.email || "-"}</td>
                    <td>
                      {introducer?.user?.phone ? (
                        <a
                          href={`tel:${introducer?.user?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {introducer?.user?.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {introducer?.role
                        ? formatChoiceFieldValue(introducer.role)
                        : "-"}
                    </td>
                    <td>
                      {introducer?.joining_date &&
                      !isNaN(Date.parse(introducer.joining_date))
                        ? formatDateToDMYAndTime(introducer.joining_date)
                        : "-"}
                    </td>
                    <td>
                      <p className="m-0">
                        {introducer.created_by?.title
                          ? formatChoiceFieldValue(introducer.created_by?.title)
                          : ""}{" "}
                        {introducer?.created_by?.first_name}{" "}
                        {introducer?.created_by?.middle_name}{" "}
                        {introducer?.created_by?.last_name}
                      </p>
                      <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
                        (
                        {introducer.created_by?.user_type
                          ? formatChoiceFieldValue(
                              introducer.created_by?.user_type
                            )
                          : ""}
                        )
                      </p>
                    </td>
                    <td>{formatDateToDMYAndTime(introducer?.created_at)}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2 align-items-center">
                        <Button
                          color="success"
                          size="sm"
                          title="Update User"
                          onClick={() => openUpdateModal(introducer)}
                        >
                          <i className="icon-pencil-alt"></i>
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          title="Delete User"
                          onClick={() => openDeleteModal(introducer)}
                        >
                          <i className="icon-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
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
              <p className="text-success">
                Showing{" "}
                {totalCount === 0
                  ? "0"
                  : (currentPage - 1) * introducersPerPage + 1}{" "}
                to{" "}
                {currentIntroducers.length === 0
                  ? 0
                  : (currentPage - 1) * introducersPerPage +
                    currentIntroducers.length}{" "}
                of {totalCount} Introducers
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
        <AddIntroducerModal isOpen={isModalOpen} toggle={toggleModal} />
        <ViewIntroducerModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedIntroducer={selectedIntroducer}
        />
        <UpdateIntroducerModal
          isOpen={isUpdateModalOpen}
          toggle={toggleUpdateModal}
          onSave={() => {
            toggleUpdateModal(); // Close the modal
          }}
          selectedIntroducer={selectedIntroducer}
        />
        <DeleteIntroducerModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          introducerAlias={introducerToDelete?.alias}
          introducerName={
            `${
              introducerToDelete?.user?.title
                ? formatChoiceFieldValue(introducerToDelete?.user?.title) + " "
                : ""
            }` +
            `${introducerToDelete?.user?.first_name || ""} ` +
            `${
              introducerToDelete?.user?.middle_name
                ? introducerToDelete?.user?.middle_name + " "
                : ""
            }` +
            `${introducerToDelete?.user?.last_name || ""}`
          }
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default Introducers;
