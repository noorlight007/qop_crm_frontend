import {
  useFetchSupportTicketCommentsQuery,
  useMakeSupportTicketCommentMutation,
  useMakeSupportTicketCommentReplyMutation,
} from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  FaFileAlt,
  FaPaperPlane,
  FaReply,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  Row,
  Spinner,
} from "reactstrap";

interface Author {
  id: number;
  alias: string;
  profile_image: string;
  name: string;
  email: string;
  user_type: string;
}

interface CommentFile {
  alias: string;
  file: string;
}

interface Reply {
  id: number;
  alias: string;
  message: string;
  parent: number;
  author: Author;
  files: CommentFile[];
  replies: Reply[];
  created_at: string;
}

interface Comment {
  id: number;
  alias: string;
  message: string;
  parent: number | null;
  author: Author;
  files: CommentFile[];
  replies: Reply[];
  created_at: string;
}

const SupportTicketComments: React.FC = () => {
  const { supportticketalias } = useParams();
  const { data: session } = useSession();

  const { data: comments, isLoading } = useFetchSupportTicketCommentsQuery(
    { ticket_alias: supportticketalias as string },
    { skip: !supportticketalias },
  );

  const [makeComment, { isLoading: isCommentLoading }] =
    useMakeSupportTicketCommentMutation();
  const [makeReply, { isLoading: isReplyLoading }] =
    useMakeSupportTicketCommentReplyMutation();

  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [replyFiles, setReplyFiles] = useState<{ [key: number]: File[] }>({});

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleReplyFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    commentId: number,
  ) => {
    if (e.target.files) {
      setReplyFiles((prev) => ({
        ...prev,
        [commentId]: Array.from(e.target.files || []),
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveReplyFile = (commentId: number, index: number) => {
    setReplyFiles((prev) => ({
      ...prev,
      [commentId]: prev[commentId]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.warning("Please enter a comment");
      return;
    }

    const formData = new FormData();
    formData.append("ticket_alias", supportticketalias as string);
    formData.append("message", newComment);

    selectedFiles.forEach((file) => {
      formData.append("upload_files", file);
    });

    try {
      await makeComment({
        payload: formData,
        ticket_alias: supportticketalias as string,
      }).unwrap();
      setNewComment("");
      setSelectedFiles([]);
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleSubmitReply = async (commentId: number) => {
    const replyMessage = replyText[commentId];
    if (!replyMessage?.trim()) {
      toast.warning("Please enter a reply");
      return;
    }

    const formData = new FormData();
    formData.append("ticket_alias", supportticketalias as string);
    formData.append("message", replyMessage);
    formData.append("parent", commentId.toString());

    const files = replyFiles[commentId] || [];
    files.forEach((file) => {
      formData.append("upload_files", file);
    });

    try {
      await makeReply({
        payload: formData,
        ticket_alias: supportticketalias as string,
      }).unwrap();
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setReplyFiles((prev) => ({ ...prev, [commentId]: [] }));
      setReplyTo(null);
      toast.success("Reply added successfully");
    } catch (error) {
      console.error("Failed to add reply:", error);
      toast.error("Failed to add reply");
    }
  };

  const formatUserType = (userType: string) => {
    return userType
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split("/").pop() || "Unknown file";
  };

  const renderReply = (reply: Reply, depth: number = 0) => (
    <div
      key={reply.id}
      className={`${depth > 0 ? "ms-4" : ""} mt-3`}
      style={{ borderLeft: "2px solid #e9ecef" }}
    >
      <div className="d-flex align-items-start gap-3 p-3 bg-light-dark rounded">
        <div className="flex-shrink-0">
          <img
            src={
              reply.author.profile_image ||
              "https://via.placeholder.com/40x40?text=User"
            }
            alt={reply.author.name}
            className="rounded-circle"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <strong className="text-dark">{reply.author.name}</strong>
            <Badge color="primary" pill>
              {formatUserType(reply.author.user_type)}
            </Badge>
            <small className="text-muted">
              {formatDateAndTime(reply.created_at)}
            </small>
          </div>
          <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>
            {reply.message}
          </p>
          {reply.files && reply.files.length > 0 && (
            <div className="mb-2">
              {reply.files.map((file) => (
                <a
                  key={file.alias}
                  href={file.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-inline-flex align-items-center gap-2 text-decoration-none border rounded px-3 py-2 me-2 mb-2 bg-white"
                  style={{ fontSize: "0.875rem" }}
                >
                  <FaFileAlt className="text-primary" />
                  <span>{getFileNameFromUrl(file.file)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      {reply.replies && reply.replies.length > 0 && (
        <div className="ms-3">
          {reply.replies.map((nestedReply) =>
            renderReply(nestedReply, depth + 1),
          )}
        </div>
      )}
    </div>
  );

  const renderComment = (comment: Comment) => (
    <Card key={comment.id} className="mb-3 shadow-sm">
      <CardBody>
        <div className="d-flex align-items-start gap-3">
          <div className="flex-shrink-0">
            <img
              src={
                comment.author.profile_image ||
                "https://via.placeholder.com/50x50?text=User"
              }
              alt={comment.author.name}
              className="rounded-circle"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <strong className="text-dark">{comment.author.name}</strong>
              <Badge color="primary" pill>
                {formatUserType(comment.author.user_type)}
              </Badge>
              <small className="text-muted">
                {formatDateAndTime(comment.created_at)}
              </small>
            </div>
            <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>
              {comment.message}
            </p>
            {comment.files && comment.files.length > 0 && (
              <div className="mb-3">
                {comment.files.map((file) => (
                  <a
                    key={file.alias}
                    href={file.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-inline-flex align-items-center gap-2 text-decoration-none border rounded px-3 py-2 me-2 mb-2 bg-white"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <FaFileAlt className="text-primary" />
                    <span>{getFileNameFromUrl(file.file)}</span>
                  </a>
                ))}
              </div>
            )}
            <div className="d-flex gap-2">
              <Button
                color="link"
                size="sm"
                className="text-decoration-none p-0"
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
              >
                <FaReply className="me-1" />
                Reply
              </Button>
            </div>

            {/* Reply Input */}
            {replyTo === comment.id && (
              <div className="mt-3 p-3 bg-light-dark rounded">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitReply(comment.id);
                  }}
                >
                  <Input
                    type="textarea"
                    rows={2}
                    placeholder="Write a reply..."
                    value={replyText[comment.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    className="mb-2"
                  />

                  {/* Reply Files Preview */}
                  {replyFiles[comment.id] &&
                    replyFiles[comment.id].length > 0 && (
                      <div className="mb-2">
                        {replyFiles[comment.id].map((file, index) => (
                          <div
                            key={index}
                            className="d-inline-flex align-items-center gap-2 border rounded px-2 py-1 me-2 mb-2 bg-white"
                            style={{ fontSize: "0.875rem" }}
                          >
                            <FaFileAlt className="text-muted" />
                            <span>{file.name}</span>
                            <FaTimes
                              className="text-danger cursor-pointer"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleRemoveReplyFile(comment.id, index)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="d-flex gap-2">
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleReplyFileSelect(e, comment.id)}
                      className="form-control-sm"
                      style={{ maxWidth: "200px" }}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <Button
                      color="primary"
                      size="sm"
                      type="submit"
                      disabled={
                        isReplyLoading || !replyText[comment.id]?.trim()
                      }
                    >
                      {isReplyLoading ? (
                        <FaSpinner className="fa-spin" />
                      ) : (
                        <>
                          <FaPaperPlane className="me-1" />
                          Send
                        </>
                      )}
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      outline
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText((prev) => ({ ...prev, [comment.id]: "" }));
                        setReplyFiles((prev) => ({
                          ...prev,
                          [comment.id]: [],
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                {comment.replies.map((reply) => renderReply(reply))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spinner color="primary" />
        <p className="text-muted mt-2">Loading comments...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Add New Comment Form */}
      <Card className="mb-4 shadow-sm border-primary">
        <CardBody>
          <Form onSubmit={handleSubmitComment}>
            <div className="d-flex align-items-start gap-3 mb-3">
              <div className="flex-shrink-0">
                <img
                  src={
                    session?.user?.profile_image ||
                    "https://via.placeholder.com/50x50?text=You"
                  }
                  alt="Your Avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </div>
              <div className="flex-grow-1">
                <Input
                  type="textarea"
                  rows={3}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-2">
                    <Row>
                      {selectedFiles.map((file, index) => (
                        <Col key={index} xs={12} sm={6} md={4} className="mb-2">
                          <div className="d-flex align-items-center gap-2 border rounded px-2 py-1 bg-light-dark">
                            <FaFileAlt className="text-muted" />
                            <span
                              className="text-truncate flex-grow-1"
                              style={{ fontSize: "0.875rem" }}
                            >
                              {file.name}
                            </span>
                            <FaTimes
                              className="text-danger cursor-pointer"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRemoveFile(index)}
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                <div className="d-flex gap-2 align-items-center">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="form-control-sm"
                    style={{ maxWidth: "250px" }}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <Button
                    color="primary"
                    type="submit"
                    disabled={isCommentLoading || !newComment.trim()}
                  >
                    {isCommentLoading ? (
                      <FaSpinner className="fa-spin me-1" />
                    ) : (
                      <FaPaperPlane className="me-1" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>

      {/* Comments List */}
      {comments && comments.length > 0 ? (
        <div>{comments.map((comment: Comment) => renderComment(comment))}</div>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportTicketComments;
