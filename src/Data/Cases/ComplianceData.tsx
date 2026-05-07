import { ComplianceStage, ReviewStageState } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceSlice";

export const GRADE_OPTIONS = [
  { value: "", label: "Select Grade" },
  { value: "SUITABLE", label: "Suitable" },
  { value: "SUITABLE_WITH_DEVELOPMENT", label: "Suitable with Development" },
  { value: "UNSUITABLE", label: "Unsuitable" },
];

export const TABS: { id: ComplianceStage; label: string }[] = [
  { id: "PRE_SUBMISSION", label: "Pre Submission Check" },
  { id: "POST_SUBMISSION", label: "Post Submission Check" },
  { id: "POST_COMPLETION", label: "Post Completion Check" },
];

export const DATE_FIELDS: {
  field: keyof Pick<
    ReviewStageState,
    | "file_review_request_date"
    | "file_reviewed_date"
    | "remedial_actions_due_date"
    | "compliance_sign_off_date"
  >;
  label: string;
}[] = [
  { field: "file_review_request_date", label: "File Review Request Date" },
  { field: "file_reviewed_date", label: "File Reviewed Date" },
  { field: "remedial_actions_due_date", label: "Remedial Actions Due Date" },
  { field: "compliance_sign_off_date", label: "Compliance Sign Off Date" },
];