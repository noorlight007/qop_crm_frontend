import React from "react";
import { Card } from "reactstrap";

// Define the comment structure
interface Comment {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  title: string;
  content: string;
  document?: string;
  replies?: Comment[];
}

// Sample Data Matching Your Image
const commentsData: Comment[] = [
  {
    id: "1",
    author: "Admin Team",
    role: "Admin",
    timestamp: "30 minutes ago",
    title: "Case Update: New admin comment",
    content: "Iklk",
    replies: [
      {
        id: "1.1",
        author: "Sarah Johnson",
        role: "Adviser",
        timestamp: "15/01/2024 at 21:15",
        title: "",
        content:
          "I'll review the documents again and cross-reference with the latest P60. There might be a bonus payment included that wasn't initially declared.",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: "Admin Team",
    role: "Admin",
    timestamp: "15/01/2024 at 20:30",
    title: "Document Upload: Tech Solutions Ltd - Income Verification",
    content:
      "@SarahJohnson Can you please verify the income documents for Tech Solutions? The figures seem inconsistent with their bank statements.",
    document: "Tech Solutions Ltd - Income Verification",
    replies: [],
  },
  {
    id: "3",
    author: "Michael Chen",
    role: "Adviser",
    timestamp: "15/01/2024 at 17:20",
    title: "Case Update: Global Investments - Application Progress",
    content:
      "Case status updated - client has provided all required documentation. Moving to lender submission stage.",
    replies: [],
  },
];

const CommentCards: React.FC = () => {
  // Recursive function to render comments and nested replies
  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => (
      <Card key={comment.id} className="shadow p-3 mb-3 position-relative">
        {/* Avatar & Header */}
        <div className="d-flex align-items-start mb-2">
          {/* Avatar */}
          <div
            className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold me-3"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#308e87",
              fontSize: "14px",
            }}
          >
            {comment.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>

          {/* Author Info */}
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <strong>{comment.author}</strong>
              <span
                className={`badge ${
                  comment.role === "Admin" ? "bg-primary" : "bg-success"
                }`}
              >
                {comment.role}
              </span>
              <small className="text-muted">{comment.timestamp}</small>
            </div>

            {/* Title */}
            {comment.title && (
              <p className="text-muted mb-1 mt-1 small">{comment.title}</p>
            )}

            {/* Document Upload Indicator */}
            {comment.document && (
              <p className="mb-1">
                <i className="far fa-file-alt text-info me-1"></i>
                <small>
                  <strong>Document Upload:</strong> {comment.document}
                </small>
              </p>
            )}

            {/* Comment Content */}
            <p className="mb-2">{comment.content}</p>

            {/* Action Buttons */}
            <div>
              <button className="btn btn-link btn-sm p-0 me-3 text-decoration-none">
                <i className="fas fa-reply me-1"></i> Reply
              </button>
              <button className="btn btn-success btn-sm">Resolve</button>
            </div>
          </div>
        </div>

        {/* Nested Replies (Indented) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ms-5 mt-3 pt-2">
            {renderComments(comment.replies)}
          </div>
        )}
      </Card>
    ));
  };

  return <div>{renderComments(commentsData)}</div>;
};

export default CommentCards;
