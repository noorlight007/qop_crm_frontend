import { useGetLeadDetailsQuery } from "@/Redux/Reducers/CommonComponents/Directors/LeadDetalisApi";
import {
  LeadsInfo,
  LeadsProps,
} from "@/Types/CommonComponents/Directors/LeadTypes";
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
import AddLeadModal from "./Modals/AddLeadModal";
import DeleteLeadModal from "./Modals/DeleteLeadModal";
import UpdateLeadModal from "./Modals/UpdateLeadModal";
import ViewLeadModal from "./Modals/ViewLeadModal";

const Leads: React.FC<LeadsProps> = ({ leadsPerPage = 10 }) => {
  const [leads, setLeads] = useState<LeadsInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<LeadsInfo | null>(null);
  // rtk hooks
  const { data: leadData, isLoading } = useGetLeadDetailsQuery(undefined);

  const [selectedLead, setSelectedLead] = useState<Partial<LeadsInfo>>({
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
    reason_for_enquiry: "",
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const openDeleteModal = (lead: LeadsInfo) => {
    setLeadToDelete(lead);
    toggleDeleteModal();
  };

  useEffect(() => {
    if (leadData) {
      const leadsData = Array.isArray(leadData) ? leadData : leadData.leads;
      setLeads(leadsData || []);
    }
  }, [leadData]);

  // openmodals
  const openAddModal = () => {
    toggleModal();
  };

  const openUpdateModal = (lead: LeadsInfo) => {
    setSelectedLead(lead);
    toggleUpdateModal();
  };
  // openmodals end

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead?.user?.title || ""} ${
      lead?.user?.first_name || ""
    } ${lead?.user?.middle_name || ""} ${
      lead?.user?.last_name || ""
    }`.toLowerCase();

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      lead?.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

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
        <Row className="d-flex justify-content-between py-4">
          <Col md="3" xs="12">
            <h2>Leads</h2>
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
              <span>Add Lead</span>
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
                <th>Created By</th>
                <th>Created At</th>
                <th>Action</th>
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
              ) : currentLeads.length > 0 ? (
                currentLeads.map((lead) => (
                  <tr key={lead.alias} className="text-center">
                    <td>
                      <span
                        className="text_decoration_hover"
                        onClick={() => {
                          setSelectedLead(lead);
                          toggleViewModal();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {lead.user?.title
                          ? formatChoiceFieldValue(lead.user?.title)
                          : ""}{" "}
                        {lead?.user?.first_name} {lead?.user?.middle_name}{" "}
                        {lead?.user?.last_name}
                      </span>
                    </td>
                    <td>{lead?.user?.email || "-"}</td>
                    <td>
                      {lead?.user?.phone ? (
                        <a
                          href={`tel:${lead?.user?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {lead?.user?.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {lead?.role ? formatChoiceFieldValue(lead?.role) : "-"}
                    </td>
                    <td>
                      <p className="m-0">
                        {lead.created_by?.title
                          ? formatChoiceFieldValue(lead.created_by?.title)
                          : ""}{" "}
                        {lead?.created_by?.first_name}{" "}
                        {lead?.created_by?.middle_name}{" "}
                        {lead?.created_by?.last_name}
                      </p>
                      <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
                        (
                        {lead.created_by?.user_type
                          ? formatChoiceFieldValue(lead.created_by?.user_type)
                          : "N/A"}
                        )
                      </p>
                    </td>
                    <td>{formatDateToDMYAndTime(lead?.created_at)}</td>

                    <td>
                      <div className="d-flex justify-content-center gap-2 align-items-center">
                        <Button
                          color="success"
                          size="sm"
                          title="Update User"
                          onClick={() => openUpdateModal(lead)}
                        >
                          <i className="icon-pencil-alt"></i>
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          title="Delete User"
                          onClick={() => openDeleteModal(lead)}
                        >
                          <i className="icon-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No leads available.
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
                {filteredLeads.length === 0 ? "0" : indexOfFirstLead + 1} to{" "}
                {Math.min(indexOfLastLead, filteredLeads.length)} of{" "}
                {filteredLeads.length} Leads
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

              {totalPages <= leadsPerPage ? (
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

        {/* Modals */}
        <AddLeadModal isOpen={isModalOpen} toggle={toggleModal} />
        <ViewLeadModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedLead={selectedLead}
        />

        <UpdateLeadModal
          isOpen={isUpdateModalOpen}
          toggle={toggleUpdateModal}
          onSave={() => {
            toggleUpdateModal();
          }}
          selectedLead={selectedLead}
        />
        <DeleteLeadModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          leadAlias={leadToDelete?.alias}
          leadName={`${
            leadToDelete?.user?.title
              ? formatChoiceFieldValue(leadToDelete?.user?.title) + " "
              : ""
          }${leadToDelete?.user?.first_name} ${
            leadToDelete?.user?.middle_name
              ? leadToDelete?.user?.middle_name + " "
              : ""
          }${leadToDelete?.user?.last_name}`}
        />
        {/* modals end */}
      </CardBody>
    </Card>
  );
};

export default Leads;
