import { useGetNotesQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/NotesApi";
import { NoteProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesTypes";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "react-feather";
import { Button, Col, Container, Input, Row, Table } from "reactstrap";
import AddNoteModal from "./Modals/AddNoteModal";

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

// Reusable table column definitions
const TABLE_COLUMNS = [
  { key: "category", label: "Category", width: "200px", textAlign: "left" },
  {
    key: "created_at",
    label: "Activity Date",
    width: "150px",
    textAlign: "left",
  },
  { key: "case_stage", label: "Stage", width: "200px", textAlign: "left" },
  { key: "user", label: "User", width: "200px", textAlign: "left" },
  { key: "note", label: "Information", width: "400px", textAlign: "left" },
  {
    key: "introducer",
    label: "Introducer Visible",
    width: "150px",
    textAlign: "left",
  },
  { key: "client", label: "Client Visible", width: "150px", textAlign: "left" },
  { key: "actions", label: "Actions", width: "100px", textAlign: "center" },
] as const;

const Notes: React.FC = () => {
  const { casealias } = useParams();
  const [isOpenAddNoteModal, setIsOpenAddNoteModal] = useState(false);

  const { data: notesData, isLoading } = useGetNotesQuery({
    case_alias: casealias,
  });

  const toggleAddNoteModal = () => setIsOpenAddNoteModal(!isOpenAddNoteModal);

  return (
    <Container fluid className="py-4">
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <div className="input-group">
            <Input type="select">
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.display}
                </option>
              ))}
            </Input>
            <Button color="primary" className="ms-2">
              Filter
            </Button>
          </div>
        </Col>
        <Col md={8} className="text-end ">
          <Button color="primary" onClick={toggleAddNoteModal}>
            <i className="fa-solid fa-circle-plus"></i> Add New Note
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              {TABLE_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  style={{
                    minWidth: column.width,
                    textAlign: column?.textAlign || "left",
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : notesData && notesData.length > 0 ? (
              notesData.map((note: NoteProps) => (
                <tr key={note.alias}>
                  <td>
                    {note.category
                      ?.split("_")
                      .map(
                        (word: any) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </td>
                  <td>{formatDateToDMYAndTime(note.created_at)}</td>
                  <td>
                    {note.case.case_stage
                      ?.split("_")
                      .map(
                        (word: any) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </td>
                  <td>
                    {note?.user?.title
                      ? note?.user?.title.charAt(0).toUpperCase() +
                        note?.user?.title?.charAt(1).toLowerCase()
                      : null}{" "}
                    {note?.user?.first_name} {note?.user?.middle_name}{" "}
                    {note?.user?.last_name}
                  </td>
                  <td>{note.note}</td>
                  <td>{note.note_visible_to_introducer ? "Yes" : "No"}</td>
                  <td>{note.note_visible_to_client ? "Yes" : "No"}</td>
                  <td className="text-center">
                    <Button color="link" className="p-0">
                      <Trash2 size={16} className="text-danger" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="text-center">
                  No notes found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Row className="mt-3 align-items-center">
        <Col sm={5}>
          <div className="text-muted">Showing {notesData?.length} entries</div>
        </Col>
      </Row>
      {/* Add Note Modal */}
      <AddNoteModal isOpen={isOpenAddNoteModal} toggle={toggleAddNoteModal} />
    </Container>
  );
};

export default Notes;
