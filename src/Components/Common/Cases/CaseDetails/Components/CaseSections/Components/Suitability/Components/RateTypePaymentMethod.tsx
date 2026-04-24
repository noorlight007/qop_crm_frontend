import { SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
} from "reactstrap";

/* ── Pink: advisor guidance note ── */
const AdvisorNote = ({ children }: { children: React.ReactNode }) => (
  <p className="suitability-advisor-note rounded">{children}</p>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6 className="suitability-section-heading">{children}</h6>
);

const thStyle: React.CSSProperties = {
  background: "#1a3c5e",
  color: "#fff",
  fontSize: "0.84rem",
  fontWeight: 600,
};

const repaymentStatusOptions: { value: string; label: React.ReactNode }[] = [
  {
    value: "REPAID_BY_END",
    label: "Your mortgage will be repaid by the end of its term, provided you make the required monthly payments when due.",
  },
  {
    value: "NOT_REPAID_BY_END",
    label: (
      <>
        Your mortgage balance will <strong>not</strong> be repaid by the end of
        the term through making your monthly repayments. You will be responsible
        for paying the balance <strong>in full</strong> at the end of the term.
      </>
    ),
  },
];

interface RateTypePaymentMethodProps {
  caseData: any;
  suitability: any;
  formValues: SuitabilityData;
  onFormChange: (updates: Partial<SuitabilityData>) => void;
}

const RateTypePaymentMethod: React.FC<RateTypePaymentMethodProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  // ── UI-only states ──
  const [isRepaymentStatusOptionOpen, setIsRepaymentStatusOptionOpen] = useState(false);
  const [isInterestRateReasonEditing, setIsInterestRateReasonEditing] = useState(false);
  const [interestRateReasonDraft, setInterestRateReasonDraft] = useState("");
  const [isRepaymentReasonEditing, setIsRepaymentReasonEditing] = useState(false);
  const [repaymentReasonDraft, setRepaymentReasonDraft] = useState("");

  // ── Derived from formValues ──
  const selectedRepaymentStatusOption =
    repaymentStatusOptions.find((o) => o.value === formValues.repayment_status_type) ?? null;

  // ── Interest rate reason handlers ──
  const startInterestRateReasonEdit = () => {
    setInterestRateReasonDraft(formValues.why_was_this_recommended_to_you ?? "");
    setIsInterestRateReasonEditing(true);
  };
  const handleInterestRateReasonSave = () => {
    onFormChange({ why_was_this_recommended_to_you: interestRateReasonDraft });
    setIsInterestRateReasonEditing(false);
  };
  const handleInterestRateReasonCancel = () => {
    setInterestRateReasonDraft(formValues.why_was_this_recommended_to_you ?? "");
    setIsInterestRateReasonEditing(false);
  };

  // ── Repayment method reason handlers ──
  const startRepaymentReasonEdit = () => {
    setRepaymentReasonDraft(formValues.repayment_method_recommended_text ?? "");
    setIsRepaymentReasonEditing(true);
  };
  const handleRepaymentReasonSave = () => {
    onFormChange({ repayment_method_recommended_text: repaymentReasonDraft });
    setIsRepaymentReasonEditing(false);
  };
  const handleRepaymentReasonCancel = () => {
    setRepaymentReasonDraft(formValues.repayment_method_recommended_text ?? "");
    setIsRepaymentReasonEditing(false);
  };

  return (
    <>
      <SectionHeading>Interest Rate Type</SectionHeading>

      <table className="table table-bordered table-sm mb-3">
        <thead>
          <tr>
            <th style={{ ...thStyle, width: "13%" }}>Feature</th>
            <th style={{ ...thStyle, width: "15%" }}>Recommendation</th>
            <th style={{ ...thStyle, width: "30%" }}>What does this mean?</th>
            <th style={thStyle}>Why was this recommended to you?</th>
          </tr>
        </thead>
        <tbody>

          {/* ── Interest Rate Type row ── */}
          <tr>
            <td className="fw-bold">Interest Rate Type</td>
            <td style={{ color: "blue" }}>Available from System</td>
            <td style={{ color: "blue" }}>Available from System</td>
            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
              You did not need the certainty of knowing exactly what your monthly
              repayments will be and were satisfied with payments that have the
              ability to fluctuate because{" "}
              {isInterestRateReasonEditing ? (
                <span className="d-block w-100 mt-1">
                  <Input
                    type="textarea"
                    rows={5}
                    value={interestRateReasonDraft}
                    onChange={(e) => setInterestRateReasonDraft(e.target.value)}
                    placeholder="Enter your reason..."
                    autoFocus
                    className="w-100 p-1"
                  />
                  <div className="d-flex gap-2 mt-2">
                    <Button color="light" className="text-dark" size="sm" onClick={handleInterestRateReasonSave}>
                      Save
                    </Button>
                    <Button color="light" className="text-dark" size="sm" onClick={handleInterestRateReasonCancel}>
                      Cancel
                    </Button>
                  </div>
                </span>
              ) : (
                <span
                  className="d-inline text-success"
                  style={{ cursor: "pointer", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  onClick={startInterestRateReasonEdit}
                  title="Click to edit"
                >
                  {formValues.why_was_this_recommended_to_you || "click to add reason..."}
                </span>
              )}
              <div className="mt-2">
                <AdvisorNote>
                  (there needs to be a &lsquo;why&rsquo; based answer for all
                  justifications. The client wants the payments to be the same
                  each month isn&rsquo;t enough by itself — the why answer
                  can&rsquo;t just be assumed, we need to document it.)
                </AdvisorNote>
              </div>
            </td>
          </tr>

          {/* ── Repayment Method row ── */}
          <tr>
            <td className="fw-bold">Repayment Method</td>
            <td style={{ color: "blue" }}>Available from System</td>
            <td>
              {/* Dropdown for repayment status */}
              <Dropdown
                isOpen={isRepaymentStatusOptionOpen}
                toggle={() => setIsRepaymentStatusOptionOpen((prev) => !prev)}
              >
                <DropdownToggle
                  color="light"
                  className="text-start w-100 border"
                  style={{ whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.4" }}
                  caret
                >
                  {selectedRepaymentStatusOption ? (
                    selectedRepaymentStatusOption.label
                  ) : (
                    <span className="text-muted fst-italic">Click to choose an option...</span>
                  )}
                </DropdownToggle>
                <DropdownMenu className="w-100" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                  {repaymentStatusOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() => onFormChange({ repayment_status_type: option.value })}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </td>
            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
              You did not need the certainty of your mortgage being repaid by the
              end of the term through making your monthly repayments because{" "}
              {isRepaymentReasonEditing ? (
                <span className="d-block w-100 mt-1">
                  <Input
                    type="textarea"
                    rows={5}
                    value={repaymentReasonDraft}
                    onChange={(e) => setRepaymentReasonDraft(e.target.value)}
                    placeholder="Enter your reason..."
                    autoFocus
                    className="w-100 p-1"
                  />
                  <div className="d-flex gap-2 mt-2">
                    <Button color="light" className="text-dark" size="sm" onClick={handleRepaymentReasonSave}>
                      Save
                    </Button>
                    <Button color="light" className="text-dark" size="sm" onClick={handleRepaymentReasonCancel}>
                      Cancel
                    </Button>
                  </div>
                </span>
              ) : (
                <span
                  className="d-inline text-success"
                  style={{ cursor: "pointer", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  onClick={startRepaymentReasonEdit}
                  title="Click to edit"
                >
                  {formValues.repayment_method_recommended_text || "click to add reason..."}
                </span>
              )}
            </td>
          </tr>

        </tbody>
      </table>
    </>
  );
};

export default RateTypePaymentMethod;