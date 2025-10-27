import { NotesViewTabProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesAndTaskTypes";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { Trash2 } from "react-feather";
import { Button, Col, Container, Input, Row, Table } from "reactstrap";
import CreateTaskNoteModal from "../NotesModals/AddNewNoteModal";
import { NoteTask } from "../NotesTabContent";

// Reusable table column definitions
const TABLE_COLUMNS = [
  { key: "actions", label: "Actions", width: "100px" },
  { key: "category", label: "Category", width: "100px" },
  { key: "created_at", label: "Activity Date", width: "150px" },
  { key: "case_stage", label: "Stage", width: "150px" },
  { key: "user", label: "User", width: "200px" },
  { key: "note", label: "Information", width: "400px" },
  { key: "introducer", label: "Introducer Visible", width: "150px" },
  { key: "client", label: "Client Visible", width: "150px" },
] as const;

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

// Reusable cell renderer
const renderCell = (
  note: NoteTask,
  column: (typeof TABLE_COLUMNS)[number],
  handleDelete: (alias: string) => void
) => {
  switch (column.key) {
    case "actions":
      return (
        <div className="d-flex justify-content-start align-items-center">
          <Button
            color="danger"
            size="sm"
            onClick={() => handleDelete(note.alias)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    case "category":
      return (
        CATEGORIES.find((cat) => cat.value === note.category)?.display ||
        "Uncategorised"
      );
    case "created_at":
      return formatDateToDMYAndTime(note.created_at);
    case "case_stage":
      return note.case.case_stage
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    case "user":
      return `${note.created_by.first_name} ${note.created_by.last_name}`;
    case "note":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: note.note || "" }}
          style={{ wordBreak: "break-word", maxWidth: "400px" }}
        />
      );
    case "introducer":
      return (
        <div className="d-flex justify-content-center fs-4">
          {note.note_visible_to_introducer ? (
            <i className="fa-solid fa-circle-check text-success"></i>
          ) : (
            <i className="fa-solid fa-circle-xmark text-danger"></i>
          )}
        </div>
      );
    case "client":
      return (
        <div className="d-flex justify-content-center fs-4">
          {note.note_visible_to_client ? (
            <i className="fa-solid fa-circle-check text-success"></i>
          ) : (
            <i className="fa-solid fa-circle-xmark text-danger"></i>
          )}
        </div>
      );
    // case "actions":
    //   return (
    //     <Button
    //       color="danger"
    //       size="sm"
    //       onClick={() => handleDelete(note.alias)}
    //     >
    //       <Trash2 size={16} />
    //     </Button>
    //   );
    default:
      return null;
  }
};

const NotesViewTab: FC<NotesViewTabProps> = ({ notes }) => {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeleteNote = (alias: string) => {
    console.log(`Delete note ${alias}`);
  };

  const filteredNotes = selectedCategory
    ? notes.filter((note) => note.category === selectedCategory)
    : notes;

  return (
    <Container fluid className="py-4">
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <div className="input-group">
            <Input
              type="select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.display}
                </option>
              ))}
            </Input>
            <Button color="primary" className="ms-2">
              Search
            </Button>
          </div>
        </Col>
        <Col md={8} className="text-end">
          <Button
            color="primary"
            onClick={() => setModalOpen(true)}
            disabled={session?.user?.user_type === "CLIENT" && notes.length > 0}
          >
            Add New Note/Task
            <i className="fa-solid fa-circle-plus ms-1"></i>
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              {TABLE_COLUMNS.map((column) => (
                <th key={column.key} style={{ minWidth: column.width }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredNotes?.map((note) => (
              <tr key={note.alias}>
                {TABLE_COLUMNS?.map((column) => (
                  <td key={`${note.alias}-${column.key}`}>
                    {renderCell(note, column, handleDeleteNote)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Row className="mt-3 align-items-center">
        <Col sm={5}>
          <div className="text-muted">
            Showing {filteredNotes?.length} entries
          </div>
        </Col>
      </Row>

      <CreateTaskNoteModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
      />
    </Container>
  );
};

export default NotesViewTab;
