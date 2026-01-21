import { useFetchSupportTicketQuery } from "@/Redux/Reducers/CommonComponents/SupportTicket/SupportTicketApi";
import { SupportTicketFormData } from "@/Types/CommonComponents/SupportTicket/SupportTicketTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { getSupportTicketUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { TbCirclePlus, TbLink } from "react-icons/tb";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import AddSupportTicketModal from "./SupportTicketDetails/Modals/AddSupportTicketModal";
import DeleteSupportTicketModal from "./SupportTicketDetails/Modals/DeleteSupportTicketModal";
import UpdateSupportTicketModal from "./SupportTicketDetails/Modals/UpdateSuppotTicketModal";

const SupportTicket: React.FC = () => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] =
    useState<SupportTicketFormData | null>(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const userType = session?.user?.user_type;

  const { data: supportTicketData, isLoading } = useFetchSupportTicketQuery({
    page: currentPage,
  });

  const [ticketData, setTicketData] = useState<Partial<SupportTicketFormData>>({
    ticket_type: "",
    subject: "",
    message: "",
    files: [],
  });

  const formatChoiceFieldValue = (value: string) => {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const tickets = supportTicketData?.results || [];
  const totalCount = supportTicketData?.count || 0;
  const ticketsPerPage = 10;
  const totalPages = Math.ceil(totalCount / ticketsPerPage);

  const openUpdateModal = (ticket: SupportTicketFormData) => {
    setTicketData(ticket);
    toggleUpdateModal();
  };

  const openDeleteModal = (ticket: SupportTicketFormData) => {
    setTicketToDelete(ticket);
    toggleDeleteModal();
  };

  return (
    <Row>
      <Col>
        <Card className="shadow-sm">
          <CardBody>
            <Row className="d-flex justify-content-between align-items-center py-4">
              <Col md="3" xs="6">
                <h2 className="mb-0 h4 h2-md">Support Tickets</h2>
              </Col>
              <Col
                md="3"
                xs="6"
                className="d-flex justify-content-end mt-sm-0 mt-2"
              >
                <Button
                  color="primary"
                  onClick={toggleModal}
                  className="d-flex justify-content-center align-items-center gap-1"
                >
                  <TbCirclePlus size={18} />
                  <span>Create Support Ticket</span>
                </Button>
              </Col>
            </Row>

            <Row>
              <Table hover responsive>
                <thead className="thead-light">
                  <tr className="text-center">
                    <th>Ticket ID</th>
                    <th>Ticket Type</th>
                    <th>Status</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Files</th>
                    <th>Created By</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Spinner color="primary" />
                        </div>
                      </td>
                    </tr>
                  ) : tickets.length > 0 ? (
                    tickets.map((ticket: any) => (
                      <tr key={ticket.alias} className="text-center">
                        <td>{ticket.id}</td>
                        <td>
                          <span
                            className={`badge ${
                              ticket.ticket_type === "BUG_REPORT"
                                ? "bg-danger"
                                : ticket.ticket_type === "FEATURE_REQUEST"
                                  ? "bg-info"
                                  : "bg-success"
                            }`}
                          >
                            {formatChoiceFieldValue(ticket.ticket_type)}
                          </span>
                        </td>
                        <td>
                          <span>
                            {ticket.is_resolved ? (
                              <Badge
                                color="success"
                                className="d-flex align-items-center gap-1"
                              >
                                <FaCheckCircle />
                                Resolved
                              </Badge>
                            ) : (
                              <Badge
                                color="warning"
                                className="d-flex align-items-center gap-1"
                              >
                                <FaExclamationCircle />
                                Open
                              </Badge>
                            )}
                          </span>
                        </td>
                        <td>
                          <span>{ticket.subject}</span>
                        </td>
                        <td>
                          <div
                            style={{
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ticket.message}
                          </div>
                        </td>
                        <td>
                          {ticket.files.length > 0 ? (
                            <div>{ticket.files.length} file(s)</div>
                          ) : (
                            <span className="text-muted">No files</span>
                          )}
                        </td>
                        <td>
                          <p className="m-0">
                            {ticket.created_by?.title
                              ? formatChoiceFieldValue(ticket.created_by?.title)
                              : ""}{" "}
                            {ticket.created_by?.first_name}{" "}
                            {ticket.created_by?.middle_name}{" "}
                            {ticket.created_by?.last_name}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            {ticket.created_by?.email}
                          </p>
                          <p
                            className="m-0 opacity-75"
                            style={{ fontSize: "9px" }}
                          >
                            (
                            {formatChoiceFieldValue(
                              ticket.created_by?.user_type,
                            )}
                            )
                          </p>
                        </td>
                        <td>{formatDateAndTime(ticket.created_at)}</td>

                        <td>
                          <div className="d-flex justify-content-center gap-2 align-items-center">
                            <Link
                              href={`${getSupportTicketUrl(ticket.alias, userType as string)}`}
                            >
                              <Button
                                color="primary"
                                size="sm"
                                title="View Ticket"
                              >
                                <TbLink size={18} />
                              </Button>
                            </Link>
                            <Button
                              color="secondary"
                              size="sm"
                              title="View Ticket"
                              onClick={() => openUpdateModal(ticket)}
                            >
                              <i className="icon-pencil-alt"></i>
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              title="Mark as Resolved"
                              disabled={ticket.is_resolved}
                              onClick={() => openDeleteModal(ticket)}
                            >
                              <i className="icon-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No support tickets available.
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
                      : (currentPage - 1) * ticketsPerPage + 1}{" "}
                    to{" "}
                    {tickets.length === 0
                      ? 0
                      : (currentPage - 1) * ticketsPerPage +
                        tickets.length}{" "}
                    of {totalCount} Tickets
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
          </CardBody>
        </Card>

        {/* Support Ticket Modal */}
        <AddSupportTicketModal isOpen={isModalOpen} toggle={toggleModal} />

        <UpdateSupportTicketModal
          isOpen={isUpdateModalOpen}
          toggle={toggleUpdateModal}
          onSave={() => {
            toggleUpdateModal();
          }}
          selected={ticketData}
        />

        <DeleteSupportTicketModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          ticketAlias={ticketToDelete?.alias}
        />
      </Col>
    </Row>
  );
};

export default SupportTicket;
