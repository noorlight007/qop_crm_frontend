import { useUpdateNotesMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Notes/NotesApi";
import { UpdateNoteModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/NotesAndTaskTypes";
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

const CATEGORIES = [
  "Uncategorised",
  "Email Correspondence",
  "Telephone conversation",
  "Lender Correspondence",
  "Solicitor Correspondence",
  "Compliance Correspondence",
];

const UpdateNoteModal: FC<UpdateNoteModalProps> = ({
  isOpen,
  toggle,
  selectedNote,
}) => {
  // console.log("Selected note for editing:", selectedNote);
  const { casealias } = useParams();
  const caseAlias = Array.isArray(casealias) ? casealias[0] : (casealias ?? "");
  const [brokerVisible, setBrokerVisible] = useState(false);
  const [clientVisible, setClientVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateNote, { isLoading }] = useUpdateNotesMutation();
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && selectedNote) {
      setBrokerVisible(
        (selectedNote as any).is_visible_to_introducer ??
          (selectedNote as any).note_visible_to_introducer ??
          false,
      );
      setClientVisible(
        (selectedNote as any).is_visible_to_client ??
          (selectedNote as any).note_visible_to_client ??
          false,
      );

      const rawCategory = selectedNote.category || "";
      const matched = CATEGORIES.find(
        (c) => c.toUpperCase().replace(/ /g, "_") === rawCategory.toUpperCase(),
      );
      setCategory(matched ?? "");
      setComments(selectedNote.note || "");
      setErrors({});
      // ← no innerHTML here anymore
    }

    if (!isOpen) resetForm();
  }, [isOpen, selectedNote]);

  const resetForm = () => {
    setBrokerVisible(false);
    setClientVisible(false);
    setCategory("");
    setComments("");
    setErrors({});
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!err) return out;
    const sanitize = (msg: any) => {
      if (msg == null) return "";
      let s = String(msg);
      s = s.replace(/^\s*\d+,\s*/g, "");
      return s;
    };
    if (typeof err === "string") {
      out["non_field_errors"] = sanitize(err);
      return out;
    }
    if (err && typeof err === "object") {
      if (err.detail) out["non_field_errors"] = sanitize(err.detail);
      for (const [k, v] of Object.entries(err)) {
        if (v == null) continue;
        if (typeof v === "string") out[k] = sanitize(v);
        else if (Array.isArray(v))
          out[k] = sanitize(
            v
              .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
              .join(", "),
          );
        else if (typeof v === "object") {
          const vals: string[] = [];
          for (const vv of Object.values(v)) {
            if (vv == null) continue;
            if (Array.isArray(vv)) vals.push(...vv.map((x) => String(x)));
            else vals.push(String(vv));
          }
          if (vals.length) out[k] = sanitize(vals.join(", "));
        } else out[k] = sanitize(String(v));
      }
      return out;
    }
    out["non_field_errors"] = sanitize(String(err));
    return out;
  };

  const sanitizeHtml = (html: string) => {
    try {
      const cleaned = DOMPurify.sanitize(html, {
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
          "title",
          "id",
          "class",
          "dir",
          "lang",
          "style",
          "href",
          "target",
          "rel",
          "name",
          "src",
          "alt",
          "width",
          "height",
          "align",
          "valign",
          "colspan",
          "rowspan",
          "cellpadding",
          "cellspacing",
          "border",
          "type",
        ],
        ALLOW_DATA_ATTR: true,
        ALLOWED_URI_REGEXP:
          /^(?:(?:https?|mailto|tel|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
        KEEP_CONTENT: true,
        USE_PROFILES: { html: true },
      });
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
    setComments(html);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const items = Array.from(e.clipboardData.items);

    // Check for image items first (handles screenshots)
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const img = `<img src="${base64}" alt="pasted-image" style="max-width:100%; height:auto;" />`;

        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const temp = document.createElement("div");
          temp.innerHTML = img;
          const frag = document.createDocumentFragment();
          while (temp.firstChild) frag.appendChild(temp.firstChild);
          range.insertNode(frag);
          sel.collapseToEnd();
        }

        handleEditorInput(); // sync state
      };
      reader.readAsDataURL(file);
      return; // skip HTML/text handling
    }

    // Existing HTML paste logic
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
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const temp = document.createElement("div");
          temp.innerHTML = cleaned;
          const frag = document.createDocumentFragment();
          while (temp.firstChild) frag.appendChild(temp.firstChild);
          range.insertNode(frag);
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
      const current = parseInt(window.getComputedStyle(editor).fontSize) || 14;
      editor.style.fontSize = `${Math.max(8, current + delta)}px`;
      editor.focus();
      handleEditorInput();
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;
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
    } catch {
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
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

    try {
      const response = await updateNote({
        case_alias: caseAlias,
        note_alias: selectedNote?.alias ?? "",
        note: apiPayload,
      });

      if ((response as any)?.data) {
        setErrors({});
        toast.success("Note updated successfully");
        resetForm();
        toggle();
      } else if ((response as any)?.error) {
        const errData =
          (response as any).error?.data || (response as any).error || {};
        const parsed = parseApiErrors(errData);
        setErrors(parsed);
        const first = Object.values(parsed)[0] || "Failed to update note";
        toast.error(String(first));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      const parsed = parseApiErrors(
        (error as any)?.data || (error as any) || error,
      );
      setErrors(parsed);
      const first = Object.values(parsed)[0] || "Failed to update note";
      toast.error(String(first));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      centered
      fade={false}
      onOpened={() => {
        if (editorRef.current && selectedNote) {
          editorRef.current.innerHTML = selectedNote.note || "";
        }
      }}
    >
      <ModalHeader
        toggle={toggle}
        className="d-flex justify-content-between align-items-center"
      >
        Edit Note
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
                  {errors.is_visible_to_introducer && (
                    <div className="text-danger">
                      {errors.is_visible_to_introducer}
                    </div>
                  )}
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
                  {errors.is_visible_to_client && (
                    <div className="text-danger">
                      {errors.is_visible_to_client}
                    </div>
                  )}
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
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Input>
                {errors.category && (
                  <div className="text-danger">{errors.category}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>
              Comments <span className="text-danger">*</span>
            </Label>
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
                {`</>`} Code
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
              }}
              suppressContentEditableWarning
              aria-label="Rich text editor"
            />
            {errors.note && <div className="text-danger">{errors.note}</div>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Update"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateNoteModal;
