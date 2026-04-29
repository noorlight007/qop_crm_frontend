import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetNotesQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Notes/NotesApi";
import { NoteProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/NotesAndTaskTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Edit, Trash2, X } from "react-feather";
import { FaFilter, FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import {
  Button,
  Col,
  Container,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import AddNoteModal from "./Modals/AddNoteModal";
import DeleteNoteModal from "./Modals/DeleteNoteModal";
import UpdateNoteModal from "./Modals/UpdateNoteModal";
import "./notes.css";

// Categories constant
const CATEGORIES = [
  { display: "All Categories", value: "" },
  { display: "Uncategorised", value: "UNCATEGORISED" },
  { display: "Email Correspondence", value: "EMAIL_CORRESPONDENCE" },
  { display: "Telephone Conversation", value: "TELEPHONE_CONVERSATION" },
  { display: "Lender Correspondence", value: "LENDER_CORRESPONDENCE" },
  { display: "Solicitor Correspondence", value: "SOLICITOR_CORRESPONDENCE" },
  { display: "Compliance Correspondence", value: "COMPLIANCE_CORRESPONDENCE" },
] as const;

const Notes: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const caseAlias = Array.isArray(casealias) ? casealias[0] : (casealias ?? "");
  const [isOpenAddNoteModal, setIsOpenAddNoteModal] = useState(false);
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteProps | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const [appliedCategory, setAppliedCategory] = useState<string>("");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const { data: notesData, isLoading } = useGetNotesQuery({
    case_alias: caseAlias,
    page,
    category: appliedCategory || undefined,
  });

  // Reset page when the case alias changes
  useEffect(() => {
    setPage(1);
  }, [caseAlias]);

  // Infer pageSize from the results when available (used to compute totalPages)
  useEffect(() => {
    const resultsLength =
      (notesData as any)?.results?.length ??
      (Array.isArray(notesData) ? notesData.length : undefined);
    if (resultsLength && !pageSize) {
      setPageSize(resultsLength);
    }
  }, [notesData, pageSize]);

  useEffect(() => {
    // Use event delegation on the table container to handle image clicks
    const tableContainer = document.querySelector(".table-responsive");

    if (!tableContainer) return;

    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" && target.closest(".note-content")) {
        e.preventDefault();
        setLightboxSrc((target as HTMLImageElement).src);
      }
    };

    // Attach the delegated event listener
    tableContainer.addEventListener("click", handleImageClick);

    // Set cursor for all images in note content
    const images = document.querySelectorAll(".note-content img");
    images.forEach((img) => {
      (img as HTMLImageElement).style.cursor = "zoom-in";
    });

    return () => {
      tableContainer.removeEventListener("click", handleImageClick);
    };
  }, [notesData, expandedNotes]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxSrc]);

  const toggleAddNoteModal = () => setIsOpenAddNoteModal(!isOpenAddNoteModal);
  const toggleEditNoteModal = () =>
    setIsEditNoteModalOpen(!isEditNoteModalOpen);
  const toggleDeleteNoteModal = () =>
    setIsDeleteNoteModalOpen(!isDeleteNoteModalOpen);

  const handleEditClick = (note: NoteProps) => {
    setSelectedNote(note);
    setIsEditNoteModalOpen(true);
  };

  const handleDeleteClick = (note: NoteProps) => {
    setSelectedNote(note);
    setIsDeleteNoteModalOpen(true);
  };

  const applyFilter = () => {
    setAppliedCategory(category);
    setPage(1);
  };

  const clearFilter = () => {
    setCategory("");
    setAppliedCategory("");
    setPage(1);
  };

  const toggleNoteExpansion = (noteAlias: string) => {
    setExpandedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noteAlias)) {
        newSet.delete(noteAlias);
      } else {
        newSet.add(noteAlias);
      }
      return newSet;
    });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <div className="d-flex gap-1">
            <Input
              type="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.display}
                </option>
              ))}
            </Input>
            <Button
              color="primary"
              className="d-flex gap-1"
              onClick={applyFilter}
            >
              <FaFilter size={12} />
              Filter
            </Button>
            <Button
              color="danger"
              className="d-flex gap-1"
              onClick={clearFilter}
            >
              <X size={14} />
              Clear
            </Button>
          </div>
        </Col>
        <Col md={6} className="text-end ">
          {session?.user?.role !== "APPLICANT" && (
            <Button color="primary" onClick={toggleAddNoteModal}>
              <i className="fa-solid fa-circle-plus"></i> Add New Note
            </Button>
          )}
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th style={{ minWidth: "100px", textAlign: "left" }}>Category</th>
              <th style={{ minWidth: "150px", textAlign: "left" }}>
                Activity Date
              </th>
              <th style={{ minWidth: "100px", textAlign: "left" }}>Stage</th>
              <th style={{ minWidth: "100px", textAlign: "left" }}>
                Created By
              </th>
              <th style={{ minWidth: "600px", textAlign: "left" }}>
                Information
              </th>
              {session?.user?.role !== "APPLICANT" && (
                <>
                  <th style={{ minWidth: "100px", textAlign: "center" }}>
                    Introducer Visible
                  </th>
                  <th style={{ minWidth: "100px", textAlign: "center" }}>
                    Client Visible
                  </th>
                </>
              )}

              {session?.user?.role &&
                ((session.user.is_network &&
                  (session.user.role === "DIRECTOR" ||
                    session.user.role === "COMPLIANCE")) ||
                  (!session.user.is_network &&
                    session.user.role === "DIRECTOR")) && (
                  <th style={{ minWidth: "100px", textAlign: "center" }}>
                    Actions
                  </th>
                )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center">
                  <LoadingGrow />
                </td>
              </tr>
            ) : notesData &&
              (notesData.results?.length ?? (notesData as any)?.length) > 0 ? (
              // support old non-paginated array response and new paginated response
              (notesData.results ?? notesData)
                .filter((note: NoteProps) => {
                  if (session?.user?.role === "APPLICANT") {
                    return (
                      (note as any).is_visible_to_client ??
                      (note as any).note_visible_to_client
                    );
                  } else if (session?.user?.role === "INTRODUCER") {
                    return (
                      (note as any).is_visible_to_introducer ??
                      (note as any).is_visible_to_introducer
                    );
                  }
                  // For other users, show all notes
                  return true;
                })
                .map((note: NoteProps) => (
                  <tr key={note.alias} className="small">
                    <td
                      className={`${
                        note.status === "DELETED" ? "opacity-50" : ""
                      }`}
                    >
                      {formatChoiceFieldValue(note.category || "-")}
                    </td>
                    <td
                      className={`${
                        note.status === "DELETED" ? "opacity-50" : ""
                      }`}
                    >
                      {formatDateAndTime(note.created_at || "-")}
                    </td>
                    <td
                      className={`${
                        note.status === "DELETED" ? "opacity-50" : ""
                      }`}
                    >
                      {formatChoiceFieldValue(note.case.case_stage || "-")}
                    </td>
                    <td
                      className={`${
                        note.status === "DELETED" ? "opacity-50" : ""
                      }`}
                    >
                      {formatChoiceFieldValue(note?.user?.title)}{" "}
                      {note?.user?.first_name} {note?.user?.middle_name}{" "}
                      {note?.user?.last_name}
                    </td>
                    <td
                      className={`${
                        note.status === "DELETED" ? "opacity-50" : ""
                      }`}
                    >
                      <div
                        className={`note-content ${
                          expandedNotes.has(note.alias) ? "" : "collapsed"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: note.note || "-",
                        }}
                      />
                      {note.note && note.note.length > 200 && (
                        <Button
                          color="link"
                          size="sm"
                          className="note-show-more-btn p-0"
                          onClick={() => toggleNoteExpansion(note.alias)}
                        >
                          {expandedNotes.has(note.alias)
                            ? "Show less"
                            : "Show more"}
                        </Button>
                      )}
                    </td>
                    {session?.user?.role !== "APPLICANT" && (
                      <>
                        <td
                          className={`text-center ${
                            note.status === "DELETED" ? "opacity-50" : ""
                          }`}
                        >
                          {
                            // support both old and new API boolean fields
                            ((note as any).note_visible_to_introducer ??
                            (note as any).is_visible_to_introducer) ? (
                              <FaRegCheckCircle
                                size={16}
                                className="text-primary"
                              />
                            ) : (
                              <FaRegTimesCircle
                                size={16}
                                className="text-danger"
                              />
                            )
                          }
                        </td>
                        <td
                          className={`text-center ${
                            note.status === "DELETED" ? "opacity-50" : ""
                          }`}
                        >
                          {((note as any).note_visible_to_client ??
                          (note as any).is_visible_to_client) ? (
                            <FaRegCheckCircle
                              size={16}
                              className="text-primary"
                            />
                          ) : (
                            <FaRegTimesCircle
                              size={16}
                              className="text-danger"
                            />
                          )}
                        </td>
                      </>
                    )}

                    {session?.user?.role &&
                      ((session.user.is_network &&
                        (session.user.role === "DIRECTOR" ||
                          session.user.role === "COMPLIANCE")) ||
                        (!session.user.is_network &&
                          session.user.role === "DIRECTOR")) && (
                        <td
                          className={`text-center ${note.status === "DELETED" ? "opacity-50" : ""}`}
                        >
                          {note.status === "ACTIVE" ? (
                            <div className="d-flex justify-content-center gap-1">
                              <Button
                                color="primary"
                                className="p-1"
                                onClick={() => handleEditClick(note)}
                              >
                                <Edit size={20} />
                              </Button>
                              <Button
                                color="danger"
                                className="p-1"
                                onClick={() => handleDeleteClick(note)}
                              >
                                <Trash2 size={20} />
                              </Button>
                            </div>
                          ) : (
                            <small className="text-danger">Deleted</small>
                          )}
                        </td>
                      )}
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No notes found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Row className="mt-3 align-items-center">
        <Col sm={6}>
          <div className="text-muted">
            Showing {(notesData?.results ?? notesData)?.length ?? 0} entries
            {notesData && (notesData as any).count
              ? ` of ${(notesData as any).count}`
              : ""}
          </div>
        </Col>
        <Col sm={6} className="text-end">
          {notesData && (notesData as any).count ? (
            (() => {
              const count = (notesData as any).count as number;
              const pageSizeInferred = pageSize ?? 1;
              const totalPages = Math.max(
                1,
                Math.ceil(count / pageSizeInferred),
              );
              const leadsPerPage = 5; // max page links to show in compact mode

              return (
                <Pagination className="d-flex justify-content-end p-2">
                  <PaginationItem disabled={page === 1}>
                    <PaginationLink first onClick={() => setPage(1)} />
                  </PaginationItem>
                  <PaginationItem disabled={page === 1}>
                    <PaginationLink
                      previous
                      onClick={() => setPage(Math.max(1, page - 1))}
                    />
                  </PaginationItem>

                  {totalPages <= leadsPerPage ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <PaginationItem
                          key={pageNumber}
                          active={pageNumber === page}
                        >
                          <PaginationLink onClick={() => setPage(pageNumber)}>
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )
                  ) : (
                    <>
                      <PaginationItem active={page === 1}>
                        <PaginationLink onClick={() => setPage(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>

                      {page > 3 && (
                        <PaginationItem disabled>
                          <PaginationLink>...</PaginationLink>
                        </PaginationItem>
                      )}

                      {Array.from({ length: 3 }, (_, i) => page - 1 + i)
                        .filter(
                          (pageNumber) =>
                            pageNumber > 1 && pageNumber < totalPages,
                        )
                        .map((pageNumber) => (
                          <PaginationItem
                            key={pageNumber}
                            active={pageNumber === page}
                          >
                            <PaginationLink onClick={() => setPage(pageNumber)}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                      {page < totalPages - 2 && (
                        <PaginationItem disabled>
                          <PaginationLink>...</PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem active={page === totalPages}>
                        <PaginationLink onClick={() => setPage(totalPages)}>
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem disabled={page === totalPages}>
                    <PaginationLink
                      next
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                    />
                  </PaginationItem>
                  <PaginationItem disabled={page === totalPages}>
                    <PaginationLink last onClick={() => setPage(totalPages)} />
                  </PaginationItem>
                </Pagination>
              );
            })()
          ) : (
            // Fallback simple prev/next when count is not available
            <div className="btn-group">
              <Button
                color="light"
                disabled={!notesData || !(notesData as any).previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button color="light" disabled>
                Page {page}
              </Button>
              <Button
                color="light"
                disabled={!notesData || !(notesData as any).next}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {/* Add Note Modal */}
      <AddNoteModal isOpen={isOpenAddNoteModal} toggle={toggleAddNoteModal} />
      {/* Edit Note Modal */}
      <UpdateNoteModal
        isOpen={isEditNoteModalOpen}
        toggle={toggleEditNoteModal}
        selectedNote={selectedNote}
      />
      {/* Delete Note Modal */}
      <DeleteNoteModal
        isOpen={isDeleteNoteModalOpen}
        toggle={toggleDeleteNoteModal}
        caseAlias={caseAlias}
        selectedNote={selectedNote}
      />

      {/* Image Lightbox */}
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxSrc(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 32,
              lineHeight: 1,
              cursor: "pointer",
              zIndex: 10000,
            }}
            aria-label="Close"
          >
            &times;
          </button>

          <img
            src={lightboxSrc}
            alt="Full size preview"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}
    </Container>
  );
};

export default Notes;
