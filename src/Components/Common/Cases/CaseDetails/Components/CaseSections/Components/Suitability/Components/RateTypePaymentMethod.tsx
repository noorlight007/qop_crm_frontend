import { SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import React, { useState } from "react";
import { Button, Input } from "reactstrap";

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

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when the interest rate type string indicates a fixed rate.
 * Checks the dedicated `interest_rate_type` field first, then falls back to
 * scanning `initial_interest_rate` for the word "fixed".
 */
function isFixedRate(loanDetails: any): boolean {
  const rateType: string = (
    loanDetails?.interest_rate_type ?? ""
  ).toLowerCase();
  const initialRate: string = (
    loanDetails?.initial_interest_rate ?? ""
  ).toLowerCase();
  return rateType.includes("fixed") || initialRate.includes("fixed");
}

/**
 * Normalises the repayment method string coming from the API into one of two
 * canonical values used for conditional rendering.
 */
function getRepaymentMethod(
  loanDetails: any,
): "CAPITAL AND INTEREST" | "INTEREST ONLY" {
  const method: string = (loanDetails?.repayment_method ?? "").toLowerCase();
  if (method.includes("interest only") || method.includes("interest_only"))
    return "INTEREST ONLY";
  // Default / "capital and interest"
  return "CAPITAL AND INTEREST";
}

// ── Sub-components for conditional cell text ─────────────────────────────────

const InterestRateMeaning: React.FC<{ fixed: boolean }> = ({ fixed }) => (
  <td>
    {fixed
      ? "Your payments will not change during the initial period."
      : "Your payments can fluctuate during the initial deal period."}
  </td>
);

const RepaymentMethodMeaning: React.FC<{
  method: "CAPITAL AND INTEREST" | "INTEREST ONLY";
}> = ({ method }) => (
  <td>
    {method === "CAPITAL AND INTEREST" ? (
      "Your mortgage will be repaid by the end of its term, provided you make the required monthly payments when due."
    ) : (
      <>
        Your mortgage balance will <strong>not</strong> be repaid by the end of
        the term through making your monthly repayments. You will be responsible
        for paying the balance <strong>in full</strong> at the end of the term.
      </>
    )}
  </td>
);

// ── Inline-editable text cell ─────────────────────────────────────────────────

interface EditableCellProps {
  /** Fixed prefix sentence rendered before the editable span */
  prefix: React.ReactNode;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
  /** Optional advisor guidance note shown below the cell content */
  advisorNote?: React.ReactNode;
}

const EditableReasonCell: React.FC<EditableCellProps> = ({
  prefix,
  value,
  placeholder = "click to add reason...",
  onChange,
  advisorNote,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => {
    setDraft(value ?? "");
    setIsEditing(true);
  };
  const handleSave = () => {
    onChange(draft);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setDraft(value ?? "");
    setIsEditing(false);
  };

  return (
    <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
      {prefix}{" "}
      {isEditing ? (
        <span className="d-block w-100 mt-1">
          <Input
            type="textarea"
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Enter your reason..."
            autoFocus
            className="w-100 p-1"
          />
          <div className="d-flex gap-2 mt-2">
            <Button
              color="light"
              className="text-dark"
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              color="light"
              className="text-dark"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </span>
      ) : (
        <span
          className="d-inline text-success"
          style={{
            cursor: "pointer",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          onClick={startEdit}
          title="Click to edit"
        >
          {value || placeholder}
        </span>
      )}
      {advisorNote && <div className="mt-2">{advisorNote}</div>}
    </td>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

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
  const loanDetails = suitability?.loan_details ?? {};

  const fixed = isFixedRate(loanDetails);
  const repaymentMethod = getRepaymentMethod(loanDetails);

  // ── Recommendation display values (straight from the system) ──
  const interestRateRecommendation = loanDetails.interest_rate_type ?? "—";
  const repaymentMethodRecommendation = loanDetails.repayment_method ?? "—";

  // ── Prefix sentences for the "Why was this recommended?" column ──
  const interestRatePrefix = fixed
    ? "You wanted the certainty of knowing exactly what your monthly payments will be because"
    : "You did not need the certainty of knowing exactly what your monthly repayments will be and were satisfied with payments that have the ability to fluctuate because";

  const repaymentMethodPrefix: React.ReactNode =
    repaymentMethod === "CAPITAL AND INTEREST" ? (
      "You wanted the certainty of your mortgage being repaid by the end of the term through making your monthly repayments because"
    ) : (
      <>
        You wanted the certainty of your mortgage not being repaid by the end of
        the term through making your monthly repayments and you will be
        responsible for paying the balance <strong>in full</strong> at the end
        of the term because
      </>
    );

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

            {/* Recommendation – pulled directly from the system */}
            <td style={{ color: "blue" }}>{interestRateRecommendation}</td>

            {/* What does this mean? */}
            <InterestRateMeaning fixed={fixed} />

            {/* Why was this recommended? */}
            <EditableReasonCell
              prefix={interestRatePrefix}
              value={formValues.why_was_this_recommended_to_you ?? ""}
              onChange={(val) =>
                onFormChange({ why_was_this_recommended_to_you: val })
              }
              advisorNote={
                <AdvisorNote>
                  (there needs to be a &lsquo;why&rsquo; based answer for all
                  justifications. The client wants the payments to be the same
                  each month isn&rsquo;t enough by itself — the why answer
                  can&rsquo;t just be assumed, we need to document it.)
                </AdvisorNote>
              }
            />
          </tr>

          {/* ── Repayment Method row ── */}
          <tr>
            <td className="fw-bold">Repayment Method</td>

            {/* Recommendation – pulled directly from the system */}
            <td style={{ color: "blue" }}>{repaymentMethodRecommendation}</td>

            {/* What does this mean? */}
            <RepaymentMethodMeaning method={repaymentMethod} />

            {/* Why was this recommended? */}
            <EditableReasonCell
              prefix={repaymentMethodPrefix}
              value={formValues.repayment_method_recommended_text ?? ""}
              onChange={(val) =>
                onFormChange({ repayment_method_recommended_text: val })
              }
            />
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default RateTypePaymentMethod;
