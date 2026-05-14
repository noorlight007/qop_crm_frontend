export type TicketType = "FEEDBACK" | "BUG_REPORT" | "FEATURE_REQUEST";
export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "RESOLVED"
  | "CLOSED";
export type Priority = "URGENT" | "MEDIUM" | "NORMAL" | "WHEN_POSSIBLE";

export interface SupportTicketFormData {
  alias: string;
  ticket_type: string;
  priority?: string;
  status?: string;
  subject: string;
  message?: string;
  files: File[];
  created_by?: {
    profile_image?: string;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    name?: string;
    email?: string;
  };
  created_at?: string;
}

export interface AddSupportTicketFormData {
  ticket_type: string;
  priority: string;
  subject: string;
  message: string;
  files: File[];
}

export interface AddSupportTicketModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface UpdateSupportTicketModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (ticket: Partial<SupportTicketFormData>) => void;
  selected: Partial<SupportTicketFormData>;
}

export interface DeleteSupportTicketModalProps {
  isOpen: boolean;
  toggle: () => void;
  ticketAlias?: string;
}

export interface SupportTicketProps {
  initialIsRemoved?: string;
}

export type SupportTicketFilters = {
  ticket_type: string[];
  status: string[];
  priority: string[];
  network: string;
  organisation: string;
  created_by: string;
  is_removed: string;
};

interface SupportTicketCommentAuthor {
  id: number;
  alias: string;
  profile_image: string;
  name: string;
  email: string;
}

interface SupportTicketCommentFile {
  alias: string;
  file: string;
}

export interface SupportTicketCommentReply {
  id: number;
  alias: string;
  message: string;
  parent: number;
  author: SupportTicketCommentAuthor;
  files: SupportTicketCommentFile[];
  replies: SupportTicketCommentReply[];
  created_at: string;
}

export interface SupportTicketComment {
  id: number;
  alias: string;
  message: string;
  parent: number | null;
  author: SupportTicketCommentAuthor;
  files: SupportTicketCommentFile[];
  replies: SupportTicketCommentReply[];
  created_at: string;
}
