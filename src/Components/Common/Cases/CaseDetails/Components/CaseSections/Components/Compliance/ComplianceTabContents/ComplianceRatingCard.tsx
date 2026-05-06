// import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
// import { useGetComplianceQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceApi";
// import {
//   updateComplianceAnswer,
//   updateComplianceComment,
// } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceSlice";
// import { RootState } from "@/Redux/Store";
// import { ComplianceState } from "@/Types/Common/Cases/CaseDetails/CaseSections/ComplianceTypes";
// import { useParams } from "next/navigation";
// import React, { FC } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { FaCalendarAlt } from "react-icons/fa";
// import { Col, Container, FormGroup, Input, Label, Row } from "reactstrap";

// interface Checker {
//   id: string;
//   name: string;
// }

// const checkers: Checker[] = [
//   { id: "0", name: "No value selected" },
//   { id: "172407", name: "Beneco Compliance" },
//   { id: "166399", name: "Hemal Patel" },
//   { id: "167199", name: "Kanis Fatema Sima" },
//   { id: "167221", name: "Larry Test" },
//   { id: "166381", name: "Md Shahariar Sadat" },
//   { id: "8472", name: "Mostafizur Rahman" },
//   { id: "8456", name: "OMS Supervisor" },
//   { id: "168029", name: "Ruhul Alam" },
//   { id: "182235", name: "Salman Sarwar" },
//   { id: "41012", name: "Scott Test" },
//   { id: "167196", name: "Shaguffta Rahman" },
//   { id: "166382", name: "Vrutti Shah" },
// ];

// const ratingCriteria = {
//   green:
//     "(Grade 7) File demonstrates Suitability of Advice, KYC and TCF. Thorough factfind/record keeping, and/or suitability letter.",
//   yellow:
//     "(Grade 5-6) Weaknesses identified in fact find/record keeping, and/or suitability letter but advice seems acceptable on the face of it. Additional information will help avoid a complaint and meet KYC requirements.",
//   red: "(Grades 1-4) Serious weaknesses in fact find/record keeping and/or suitability letter. Significant doubts or difficult to prove whether customer has received suitable advice or been treated fairly.",
// };

// export const ComplianceRatingCard: FC = () => {
//   const { casealias } = useParams();
//   const { data: complianceData } = useGetComplianceQuery({
//     case_alias: casealias,
//   });
//   const dispatch = useAppDispatch();
//   const updatedComplianceData = useAppSelector(
//     (state: RootState) => state.compliance,
//   );

//   const formData: Partial<ComplianceState> = {
//     date_file_checked:
//       updatedComplianceData.date_file_checked !== undefined
//         ? updatedComplianceData.date_file_checked
//         : complianceData?.date_file_checked || "",
//     date_file_rechecked:
//       updatedComplianceData.date_file_rechecked !== undefined
//         ? updatedComplianceData.date_file_rechecked
//         : complianceData?.date_file_rechecked || "",
//     file_checked:
//       updatedComplianceData.file_checked !== undefined
//         ? updatedComplianceData.file_checked
//         : complianceData?.file_checked || "0",
//     remedial_actions_required:
//       updatedComplianceData.remedial_actions_required !== undefined
//         ? updatedComplianceData.remedial_actions_required
//         : complianceData?.remedial_actions_required || false,
//     remedial_actions_complete:
//       updatedComplianceData.remedial_actions_complete !== undefined
//         ? updatedComplianceData.remedial_actions_complete
//         : complianceData?.remedial_actions_complete || false,
//     comments:
//       updatedComplianceData.comments !== undefined
//         ? updatedComplianceData.comments
//         : complianceData?.comments || "",
//     rating_a:
//       updatedComplianceData.rating_a !== undefined
//         ? updatedComplianceData.rating_a
//         : complianceData?.rating_a || false,
//     rating_b:
//       updatedComplianceData.rating_b !== undefined
//         ? updatedComplianceData.rating_b
//         : complianceData?.rating_b || false,
//     rating_c:
//       updatedComplianceData.rating_c !== undefined
//         ? updatedComplianceData.rating_c
//         : complianceData?.rating_c || false,
//   };

//   const handleAnswerChange = (field: keyof ComplianceState, value: any) => {
//     if (field === "date_file_checked" || field === "date_file_rechecked") {
//       // Convert Date object to YYYY-MM-DD format
//       const formattedDate =
//         value instanceof Date ? value.toISOString().split("T")[0] : value;
//       dispatch(updateComplianceAnswer({ field, value: formattedDate }));
//     } else {
//       dispatch(updateComplianceAnswer({ field, value }));
//     }
//   };

//   const handleCommentChange = (field: keyof ComplianceState, value: string) => {
//     dispatch(updateComplianceComment({ field, value }));
//   };

//   const CustomInput = React.forwardRef(
//     ({ value, onClick, id }: any, ref: any) => (
//       <div className="position-relative">
//         <input
//           id={id}
//           value={value}
//           className="form-control form-control-sm pe-4"
//           onClick={onClick}
//           readOnly
//           ref={ref}
//         />
//         <FaCalendarAlt
//           className="position-absolute text-muted cursor-pointer"
//           style={{ right: "10px", top: "50%", transform: "translateY(-50%)" }}
//           onClick={onClick}
//         />
//       </div>
//     ),
//   );

//   return (
//     <Container fluid className="p-4 bg-white shadow rounded">
//       <Row className="align-items-end g-3">
//         <Col xs={12} lg={2}>
//           <FormGroup>
//             <Label
//               for="date_file_checked"
//               className="fw-medium text-muted small mb-1"
//             >
//               Date File Checked
//             </Label>
//             <DatePicker
//               id="date_file_checked"
//               selected={
//                 formData.date_file_checked
//                   ? new Date(formData.date_file_checked)
//                   : null
//               }
//               onChange={(date: Date) =>
//                 handleAnswerChange("date_file_checked", date)
//               }
//               dateFormat="dd/MM/yyyy"
//               customInput={<CustomInput />}
//             />
//           </FormGroup>
//         </Col>
//         <Col xs={12} lg={2}>
//           <FormGroup>
//             <Label
//               for="date_file_rechecked"
//               className="fw-medium text-muted small mb-1"
//             >
//               Date File Rechecked
//             </Label>
//             <DatePicker
//               id="date_file_rechecked"
//               selected={
//                 formData.date_file_rechecked
//                   ? new Date(formData.date_file_rechecked)
//                   : null
//               }
//               onChange={(date: Date) =>
//                 handleAnswerChange("date_file_rechecked", date)
//               }
//               dateFormat="dd/MM/yyyy"
//               customInput={<CustomInput />}
//             />
//           </FormGroup>
//         </Col>
//         <Col xs={12} lg={3}>
//           <FormGroup>
//             <Label
//               for="file_checked"
//               className="fw-medium text-muted small mb-1"
//             >
//               File Checked By
//             </Label>
//             <Input
//               type="select"
//               bsSize="sm"
//               id="file_checked"
//               value={formData.file_checked ?? ""}
//               onChange={(e) =>
//                 handleAnswerChange("file_checked", e.target.value)
//               }
//             >
//               {checkers.map((checker) => (
//                 <option key={checker.id} value={checker.id}>
//                   {checker.name}
//                 </option>
//               ))}
//             </Input>
//           </FormGroup>
//         </Col>
//         <Col xs={12} lg={2}>
//           <FormGroup className="mb-0">
//             <Label className="fw-medium text-muted small mb-1">
//               Remedial Actions Required
//             </Label>
//             <Input
//               type="select"
//               bsSize="sm"
//               value={
//                 formData.remedial_actions_required === "YES" ? "YES" : "NO"
//               }
//               onChange={(e) =>
//                 handleAnswerChange("remedial_actions_required", e.target.value)
//               }
//             >
//               <option value="YES">Yes</option>
//               <option value="NO">No</option>
//             </Input>
//           </FormGroup>
//         </Col>
//         <Col xs={12} lg={2}>
//           <FormGroup className="mb-0">
//             <Label className="fw-medium text-muted small mb-1">
//               Remedial Actions Complete
//             </Label>
//             <Input
//               type="select"
//               bsSize="sm"
//               value={
//                 formData.remedial_actions_complete === "YES" ? "YES" : "NO"
//               }
//               onChange={(e) =>
//                 handleAnswerChange("remedial_actions_complete", e.target.value)
//               }
//             >
//               <option value="YES">Yes</option>
//               <option value="NO">No</option>
//             </Input>
//           </FormGroup>
//         </Col>
//       </Row>

//       <Row className="mt-4">
//         <Col xs={12}>
//           <h3 className="fw-semibold pb-2 mb-4">Rating</h3>
//         </Col>
//       </Row>

//       <Row>
//         <Col xs={12} md={8}>
//           {[
//             { rating: "green", field: "rating_a" },
//             { rating: "yellow", field: "rating_b" },
//             { rating: "red", field: "rating_c" },
//           ].map(({ rating, field }) => (
//             <div key={rating} className="d-flex align-items-start mb-4">
//               <div
//                 className="d-flex align-items-center justify-content-center text-white fw-bold fs-4 me-3 rounded"
//                 style={{
//                   width: "55px",
//                   height: "55px",
//                   minWidth: "55px",
//                   backgroundColor:
//                     rating === "green"
//                       ? "#198754"
//                       : rating === "yellow"
//                         ? "#ffd63a"
//                         : "#dc3545",
//                 }}
//               >
//                 {rating === "green" ? "G" : rating === "yellow" ? "A" : "R"}
//               </div>
//               <div className="d-flex align-items-start gap-3">
//                 <FormGroup check className="mt-2 mb-0">
//                   <Input
//                     type="radio"
//                     name="rating"
//                     checked={formData[field as keyof ComplianceState] === true}
//                     onChange={() => {
//                       handleAnswerChange("rating_a", rating === "green");
//                       handleAnswerChange("rating_b", rating === "yellow");
//                       handleAnswerChange("rating_c", rating === "red");
//                     }}
//                   />
//                 </FormGroup>
//                 <p className="mb-0 mt-1" style={{ fontSize: "0.9rem" }}>
//                   {ratingCriteria[rating as keyof typeof ratingCriteria]}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </Col>
//         <Col xs={12} md={4}>
//           <FormGroup>
//             <Label className="fw-semibold pb-2 mb-3 d-block">
//               Comments & Any Remedial Action
//             </Label>
//             <Input
//               type="textarea"
//               id="comments"
//               value={formData.comments ?? ""}
//               onChange={(e) => handleCommentChange("comments", e.target.value)}
//               className="form-control"
//               style={{ minHeight: "190px" }}
//               placeholder="Enter comments here..."
//             />
//           </FormGroup>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ComplianceRatingCard;

import RoleSwitching from "@/Components/Common/UserProfile/RoleSwitching/RoleSwitching";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetComplianceQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceApi";
import {
  ComplianceStage,
  hydrateReviews,
  ReviewStageState,
  updateReviewField,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceSlice";
import { useGetAuthUsersQuery } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import { RootState } from "@/Redux/Store";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import {
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";

// ─── Constants ───────────────────────────────────────────────────────────────

const GRADE_OPTIONS = [
  { value: "", label: "Select Grade" },
  { value: "SUITABLE", label: "Suitable" },
  { value: "SUITABLE_WITH_DEVELOPMENT", label: "Suitable with Development" },
  { value: "UNSUITABLE", label: "Unsuitable" },
];

const TABS: { id: ComplianceStage; label: string }[] = [
  { id: "PRE_SUBMISSION", label: "Pre Submission Check" },
  { id: "POST_SUBMISSION", label: "Post Submission Check" },
  { id: "POST_COMPLETION", label: "Post Completion Check" },
];

const DATE_FIELDS: {
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

// ─── Main Component ───────────────────────────────────────────────────────────

export const ComplianceRatingCard: FC = () => {
  const { casealias } = useParams();
  const dispatch = useAppDispatch();

  const [activeStage, setActiveStage] =
    useState<ComplianceStage>("PRE_SUBMISSION");

  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });

   const { data: authUsersData, isLoading } = useGetAuthUsersQuery({
    role: "COMPLIANCE",
   })
   console.log("compliance list: ", authUsersData);

  // Hydrate Redux with API data on load
  useEffect(() => {
    if (complianceData?.reviews) {
      dispatch(hydrateReviews(complianceData.reviews));
    }
  }, [complianceData, dispatch]);

  const reviews = useAppSelector(
    (state: RootState) => state.compliance.reviews,
  );

  // Merge API data with Redux state for the active stage
  // Redux takes precedence for touched fields
  const getStageData = (stage: ComplianceStage): ReviewStageState => {
    const reduxStage = reviews[stage];
    const apiStage = complianceData?.reviews?.[stage];

    if (!apiStage) return reduxStage;
    if (reduxStage._touched) return reduxStage;

    return {
      ...apiStage,
      _touched: false,
    };
  };

  const stageData = getStageData(activeStage);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleDateChange = (
    field: keyof Pick<
      ReviewStageState,
      | "file_review_request_date"
      | "file_reviewed_date"
      | "remedial_actions_due_date"
      | "compliance_sign_off_date"
    >,
    value: string,
  ) => {
    dispatch(
      updateReviewField({ stage: activeStage, field, value: value || null }),
    );
  };

  const handleFieldChange = (
    field: keyof Omit<ReviewStageState, "_touched">,
    value: any,
  ) => {
    dispatch(updateReviewField({ stage: activeStage, field, value }));
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Container className="p-0">
      {/* ── Stage Tabs ── */}
      <Nav
        className="nav-primary d-flex justify-content-center align-items-center flex-wrap gap-1 pb-2 mb-4"
        pills
      >
        {TABS.map((tab) => (
          <NavItem
            key={tab.id}
            className="d-flex justify-content-center"
            style={{ flex: "1 1 auto", maxWidth: "250px", cursor: "pointer" }}
          >
            <NavLink
              className={`${activeStage === tab.id ? "active" : ""} m-2 border border-primary d-flex justify-content-center rounded p-2 text-center w-100`}
              onClick={() => setActiveStage(tab.id)}
              style={{ cursor: "pointer" }}
            >
              {tab.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      {/* ── Tab Content ── */}
      <div
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        {/* ── Date Pickers Row ── */}
        <Row className="g-3 mb-4">
          {DATE_FIELDS.map(({ field, label }) => (
            <Col key={field} xs={12} sm={6} lg={3}>
              <FormGroup className="mb-0">
                <Label
                  for={`${activeStage}_${field}`}
                  className="fw-medium text-muted small mb-1"
                >
                  {label}
                </Label>
                <Input
                  type="date"
                  bsSize="sm"
                  id={`${activeStage}_${field}`}
                  value={stageData[field] ?? ""}
                  onChange={(e) => handleDateChange(field, e.target.value)}
                />
              </FormGroup>
            </Col>
          ))}
        </Row>

        {/* ── Grades + Comments (flex side by side) ── */}
        <div className="d-flex gap-4">
          {/* Dropdowns */}
          <div style={{ flex: "1 1 280px", maxWidth: "300px" }}>
            <FormGroup className="mb-3">
              <Label
                for={`${activeStage}_admin_grade`}
                className="fw-medium text-muted small mb-1"
              >
                Admin Grade
              </Label>
              <Input
                type="select"
                bsSize="sm"
                id={`${activeStage}_admin_grade`}
                value={stageData.admin_grade ?? ""}
                onChange={(e) =>
                  handleFieldChange(
                    "admin_grade",
                    e.target.value === "" ? null : e.target.value,
                  )
                }
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup className="mb-0">
              <Label
                for={`${activeStage}_advice_grade`}
                className="fw-medium text-muted small mb-1"
              >
                Adviser Grade
              </Label>
              <Input
                type="select"
                bsSize="sm"
                id={`${activeStage}_advice_grade`}
                value={stageData.advice_grade ?? ""}
                onChange={(e) =>
                  handleFieldChange(
                    "advice_grade",
                    e.target.value === "" ? null : e.target.value,
                  )
                }
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>

          {/* Comments */}
          <div style={{ flex: "3 1 320px" }}>
            <FormGroup className="mb-0">
              <Label
                for={`${activeStage}_comments`}
                className="fw-medium text-muted small mb-1"
              >
                Comments &amp; Any Remedial Action
              </Label>
              <Input
                type="textarea"
                id={`${activeStage}_comments`}
                value={stageData.comments ?? ""}
                onChange={(e) =>
                  handleFieldChange("comments", e.target.value || null)
                }
                className="form-control"
                style={{ minHeight: "120px", resize: "vertical" }}
                placeholder="Enter comments here..."
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ComplianceRatingCard;
