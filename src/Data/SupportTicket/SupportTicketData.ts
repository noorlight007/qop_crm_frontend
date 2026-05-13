import {
  Priority,
  TicketStatus,
  TicketType,
} from "@/Types/Common/SupportTicket/SupportTicketTypes";
import type { IconType } from "react-icons";
import { FaCheck, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { TbChecks, TbX } from "react-icons/tb";

export const statusOptions = [
  {
    value: "OPEN" as TicketStatus,
    label: "Open",
    description: "Ticket has been submitted and is awaiting action.",
  },
  {
    value: "IN_PROGRESS" as TicketStatus,
    label: "In Progress",
    description: "Ticket is currently being worked on by our team.",
  },
  {
    value: "COMPLETED" as TicketStatus,
    label: "Completed",
    description: "The issue has been fixed and is under review.",
  },
  {
    value: "RESOLVED" as TicketStatus,
    label: "Resolved",
    description: "The issue has been fixed and everything is working.",
  },
  {
    value: "CLOSED" as TicketStatus,
    label: "Closed",
    description:
      "The ticket has been closed and no further action is required.",
  },
];

export const ticketTypeColorMap: Record<TicketType, string> = {
  FEEDBACK: "success",
  BUG_REPORT: "warning",
  FEATURE_REQUEST: "info",
};

export const statusColorMap: Record<TicketStatus, string> = {
  OPEN: "danger",
  IN_PROGRESS: "warning",
  COMPLETED: "info",
  RESOLVED: "success",
  CLOSED: "dark",
};

export const priorityColorMap: Record<Priority, string> = {
  URGENT: "danger",
  MEDIUM: "warning",
  NORMAL: "info",
  WHEN_POSSIBLE: "dark",
};

export const statusIconMap: Record<TicketStatus, IconType> = {
  OPEN: FaExclamationCircle,
  IN_PROGRESS: FaSpinner,
  COMPLETED: FaCheck,
  RESOLVED: TbChecks,
  CLOSED: TbX,
};

export const supportTicketPriorityFilters = [
  { value: "URGENT", label: "Urgent" },
  { value: "MEDIUM", label: "Medium" },
  { value: "NORMAL", label: "Normal" },
  { value: "WHEN_POSSIBLE", label: "When Possible" },
];
export const supportTicketStatusFilters = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];
export const supportTicketTypeFilters = [
  { value: "FEEDBACK", label: "Feedback" },
  { value: "BUG_REPORT", label: "Bug Report" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
];
