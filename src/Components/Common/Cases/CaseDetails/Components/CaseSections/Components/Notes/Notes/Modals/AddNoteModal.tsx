import { useAddNotesMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Notes/NotesApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { AddNoteModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/NotesAndTaskTypes";
import DOMPurify from "isomorphic-dompurify";
import { useParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddNoteModal: FC<AddNoteModalProps> = ({ isOpen, toggle }) => {
  const { casealias } = useParams();
  const caseAlias = Array.isArray(casealias) ? casealias[0] : (casealias ?? "");
  const [brokerVisible, setBrokerVisible] = useState(false);
  const [clientVisible, setClientVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [comments, setComments] = useState("");
  const [addNotes, { isLoading }] = useAddNotesMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const editorRef = useRef<HTMLDivElement | null>(null);

  const resetForm = () => {
    setBrokerVisible(false);
    setClientVisible(false);
    setCategory("");
    setComments("");
  };

  useEffect(() => {
    if (!isOpen) resetForm();
    // When modal opens, ensure editor content reflects current state
    if (isOpen && editorRef.current) {
      editorRef.current.innerHTML = comments || "";
    }
  }, [isOpen]);

  const categories = [
    "Uncategorised",
    "Email Correspondence",
    "Telephone conversation",
    "Lender Correspondence",
    "Solicitor Correspondence",
    "Compliance Correspondence",
  ];

  // Sanitizer using DOMPurify: preserve rich formatting incl. images, background-color, line-height, tables
  const sanitizeHtml = (html: string) => {
    try {
      const cleaned = DOMPurify.sanitize(html, {
        // Allow a broad set of HTML elements similar to email/Gmail content
        ALLOWED_TAGS: [
          "a",
          "abbr",
          "acronym",
          "b",
          "blockquote",
          "code",
          "em",
          "i",
          "strong",
          "u",
          "s",
          "sub",
          "sup",
          "p",
          "br",
          "div",
          "span",
          "pre",
          "hr",
          "ul",
          "ol",
          "li",
          "table",
          "thead",
          "tbody",
          "tfoot",
          "tr",
          "th",
          "td",
          "img",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
        ],
        ALLOWED_ATTR: [
          // global
          "title",
          "id",
          "class",
          "dir",
          "lang",
          // styling
          "style",
          // links
          "href",
          "target",
          "rel",
          "name",
          // images
          "src",
          "alt",
          "width",
          "height",
          // tables
          "align",
          "valign",
          "colspan",
          "rowspan",
          "cellpadding",
          "cellspacing",
          "border",
          // misc
          "type",
        ],
        ALLOW_DATA_ATTR: true, // keep data-* attributes
        // Allow data: URIs for images plus normal protocols for links
        ALLOWED_URI_REGEXP:
          /^(?:(?:https?|mailto|tel|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
        KEEP_CONTENT: true,
        USE_PROFILES: { html: true },
      });

      // Enforce safe link targets
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleaned, "text/html");
      doc.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href") || "";
        const safe = /^(https?:|mailto:|tel:|data:)/i.test(href);
        if (!safe) a.removeAttribute("href");
        if (a.getAttribute("href")) {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      });

      return doc.body.innerHTML;
    } catch {
      return html;
    }
  };

  const getPlainText = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleEditorInput = () => {
    const html = editorRef.current?.innerHTML || "";
    // Do not mutate DOM mid-typing to avoid caret jumps; sanitize on submit as well
    setComments(html);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Preserve formatting like Gmail: insert sanitized HTML when available
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    if (html) {
      const cleaned = sanitizeHtml(html);
      if (
        document.queryCommandSupported &&
        document.queryCommandSupported("insertHTML")
      ) {
        document.execCommand("insertHTML", false, cleaned);
      } else {
        // Fallback: manual range insertion
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const temp = document.createElement("div");
          temp.innerHTML = cleaned;
          const frag = document.createDocumentFragment();
          while (temp.firstChild) frag.appendChild(temp.firstChild);
          range.insertNode(frag);
          // Move caret to end
          sel.collapseToEnd();
        }
      }
    } else if (text) {
      document.execCommand("insertText", false, text);
    }
  };

  const changeSelectionFontSize = (delta: number) => {
    const editor = editorRef.current;
    if (!editor) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      // No selection — change editor base font size
      const current = parseInt(window.getComputedStyle(editor).fontSize) || 14;
      editor.style.fontSize = `${Math.max(8, current + delta)}px`;
      editor.focus();
      handleEditorInput();
      return;
    }

    const range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      // Selection outside editor — do nothing
      return;
    }

    // Determine current font size from start container
    let startEl: HTMLElement | null = null;
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      startEl = (range.startContainer as Text).parentElement as HTMLElement;
    } else if (range.startContainer instanceof HTMLElement) {
      startEl = range.startContainer as HTMLElement;
    }

    const base = startEl
      ? parseInt(window.getComputedStyle(startEl).fontSize) || 14
      : parseInt(window.getComputedStyle(editor).fontSize) || 14;

    const newSize = Math.max(8, base + delta);

    const span = document.createElement("span");
    span.style.fontSize = `${newSize}px`;

    try {
      range.surroundContents(span);
    } catch (err) {
      // Surround may fail on partial node selections — use extract/insert fallback
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }

    // Move selection to the newly inserted span
    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.addRange(newRange);

    editor.focus();
    handleEditorInput();
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (url) applyFormat("createLink", url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitized = sanitizeHtml(comments || "");
    const plain = getPlainText(sanitized).trim();
    if (!plain) {
      toast.error("Comments cannot be empty");
      return;
    }

    const apiPayload = {
      is_visible_to_introducer: !!brokerVisible,
      is_visible_to_client: !!clientVisible,
      category: category ? category.toUpperCase().replace(/ /g, "_") : null,
      note: sanitized,
    };

    const response = await addNotes({
      case_alias: caseAlias,
      note: apiPayload,
    });
    if (response.data) {
      try {
        await updateSectionCompleteStatus({
          case_alias: caseAlias,
          section_data: { is_notes: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }
      toast.success("Note added successfully");
      // reset form then close modal
      resetForm();
      toggle();
    } else if (response.error) {
      const errorMessage =
        (response.error as any)?.data?.detail || "Failed to add note";
      toast.error(errorMessage);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader
        toggle={toggle}
        className="d-flex justify-content-between align-items-center"
      >
        Create Note
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <FormGroup className="d-flex justify-content-between align-items-center mb-2">
                    <Label check>Note visible to introducer?</Label>
                    <Input
                      type="switch"
                      checked={brokerVisible}
                      className="border-primary"
                      onChange={(e) => setBrokerVisible(e.target.checked)}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup className="d-flex justify-content-between align-items-center">
                    <Label check>Note visible to client?</Label>
                    <Input
                      type="switch"
                      checked={clientVisible}
                      className="border-primary"
                      onChange={(e) => setClientVisible(e.target.checked)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="category">
                  Category <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>
              Comments <span className="text-danger">*</span>
            </Label>
            {/* Simple toolbar */}
            <div className="mb-2 d-flex flex-wrap gap-1">
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("bold")}
              >
                B
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                title="Increase font size"
                onClick={() => changeSelectionFontSize(2)}
              >
                A+
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                title="Decrease font size"
                onClick={() => changeSelectionFontSize(-2)}
              >
                A-
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("italic")}
              >
                <em>I</em>
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("underline")}
              >
                <u>U</u>
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("strikeThrough")}
              >
                <s>S</s>
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("insertUnorderedList")}
              >
                • List
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("insertOrderedList")}
              >
                1. List
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("formatBlock", "BLOCKQUOTE")}
              >
                ❝ Quote
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("formatBlock", "PRE")}
              >
                {"</>"} Code
              </Button>
              <Button outline color="dark" size="sm" onClick={insertLink}>
                🔗 Link
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("removeFormat")}
              >
                Clear
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("undo")}
              >
                Undo
              </Button>
              <Button
                outline
                color="dark"
                size="sm"
                onClick={() => applyFormat("redo")}
              >
                Redo
              </Button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              onPaste={handlePaste}
              className="form-control"
              style={{
                height: "350px",
                marginBottom: "12px",
                overflowY: "auto",
                backgroundColor: "#fff",
              }}
              suppressContentEditableWarning
              aria-label="Rich text editor"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Create"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddNoteModal;
