import { SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Table,
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

const debtCostOptions: { value: string; label: string }[] = [
  { value: "LESS", label: "less" },
  { value: "MORE", label: "more" },
];

interface DebtConsolidationProps {
  caseData: any;
  suitability: any;
  formValues: SuitabilityData;
  onFormChange: (updates: Partial<SuitabilityData>) => void;
}

const DebtConsolidation: React.FC<DebtConsolidationProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";

  // ── UI-only states ──
  const [isDebtsAroseEditing, setIsDebtsAroseEditing] = useState(false);
  const [isGoalEditing, setIsGoalEditing] = useState(false);
  const [isAlternativesEditing, setIsAlternativesEditing] = useState(false);
  const [isProceedEditing, setIsProceedEditing] = useState(false);
  const [isDebtCostOptionOpen, setIsDebtCostOptionOpen] = useState(false);

  // ── Draft states ──
  const [debtsAroseDraft, setDebtsAroseDraft] = useState("");
  const [goalDraft, setGoalDraft] = useState("");
  const [alternativesDraft, setAlternativesDraft] = useState("");
  const [proceedDraft, setProceedDraft] = useState("");

  // ── Derived from formValues ──
  const selectedDebtCostOption =
    debtCostOptions.find((o) => o.value === formValues.debt_cost_comparison) ?? null;

  // ── Debts arose handlers ──
  const startDebtsAroseEdit = () => {
    setDebtsAroseDraft(formValues.debts_explanation ?? "");
    setIsDebtsAroseEditing(true);
  };
  const handleDebtsAroseSave = () => {
    onFormChange({ debts_explanation: debtsAroseDraft });
    setIsDebtsAroseEditing(false);
  };
  const handleDebtsAroseCancel = () => {
    setDebtsAroseDraft(formValues.debts_explanation ?? "");
    setIsDebtsAroseEditing(false);
  };

  // ── Goal handlers ──
  const startGoalEdit = () => {
    setGoalDraft(formValues.financial_goal ?? "");
    setIsGoalEditing(true);
  };
  const handleGoalSave = () => {
    onFormChange({ financial_goal: goalDraft });
    setIsGoalEditing(false);
  };
  const handleGoalCancel = () => {
    setGoalDraft(formValues.financial_goal ?? "");
    setIsGoalEditing(false);
  };

  // ── Alternatives handlers ──
  // NOTE: no dedicated backend field yet — mapped to `x` as placeholder
  // Update the field name once backend confirms the key
  const startAlternativesEdit = () => {
    setAlternativesDraft(formValues.additional_risk_warnings_text ?? "");
    setIsAlternativesEditing(true);
  };
  const handleAlternativesSave = () => {
    onFormChange({ additional_risk_warnings_text: alternativesDraft });
    setIsAlternativesEditing(false);
  };
  const handleAlternativesCancel = () => {
    setAlternativesDraft(formValues.additional_risk_warnings_text ?? "");
    setIsAlternativesEditing(false);
  };

  // ── Proceed handlers ──
  const startProceedEdit = () => {
    setProceedDraft(formValues.consolidation_proceed_reason ?? "");
    setIsProceedEditing(true);
  };
  const handleProceedSave = () => {
    onFormChange({ consolidation_proceed_reason: proceedDraft });
    setIsProceedEditing(false);
  };
  const handleProceedCancel = () => {
    setProceedDraft(formValues.consolidation_proceed_reason ?? "");
    setIsProceedEditing(false);
  };

  return (
    <>
      <SectionHeading>Debt Consolidation</SectionHeading>

      <p>
        During our discussions, we reviewed your existing unsecured debts. Based
        on the information you provided, the total outstanding balance is
        currently <strong style={{ color: blue }}>£00,000.00</strong>
      </p>

      <p>
        These figures were obtained directly by you from the credit provider(s).
        I have relied on these figures and current mortgage interest rates to
        formulate my advice.
      </p>

      {/* ── Debts arose ── */}
      <p>
        You explained that these debts arose because{" "}
        {isDebtsAroseEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={debtsAroseDraft}
              onChange={(e) => setDebtsAroseDraft(e.target.value)}
              placeholder="Enter your reason..."
              autoFocus
              className="w-100 p-1"
            />
            <div className="d-flex gap-2 mt-2">
              <Button color="light" className="text-dark" size="sm" onClick={handleDebtsAroseSave}>Save</Button>
              <Button color="light" className="text-dark" size="sm" onClick={handleDebtsAroseCancel}>Cancel</Button>
            </div>
          </span>
        ) : (
          <span
            className="d-inline text-success"
            style={{ cursor: "pointer", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            onClick={startDebtsAroseEdit}
            title="Click to edit"
          >
            {formValues.debts_explanation || "click to add reason..."}
          </span>
        )}
      </p>

      {/* ── Goal ── */}
      <p>
        You told me your goal is to{" "}
        {isGoalEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              placeholder="Enter client's goal..."
              autoFocus
              className="w-100 p-1"
            />
            <div className="d-flex gap-2 mt-2">
              <Button color="light" className="text-dark" size="sm" onClick={handleGoalSave}>Save</Button>
              <Button color="light" className="text-dark" size="sm" onClick={handleGoalCancel}>Cancel</Button>
            </div>
          </span>
        ) : (
          <span
            className="d-inline text-success"
            style={{ cursor: "pointer", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            onClick={startGoalEdit}
            title="Click to edit"
          >
            {formValues.financial_goal || "click to add goal..."}
          </span>
        )}
      </p>

      <p>
        For this reason, you asked us to explore consolidating these debts into
        your mortgage.
      </p>

      {/* ── Alternatives ── */}
      <p>
        Alternative forms of finance were considered but not appropriate because{" "}
        {isAlternativesEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={alternativesDraft}
              onChange={(e) => setAlternativesDraft(e.target.value)}
              placeholder="Enter your reason..."
              autoFocus
              className="w-100 p-1"
            />
            <div className="d-flex gap-2 mt-2">
              <Button color="light" className="text-dark" size="sm" onClick={handleAlternativesSave}>Save</Button>
              <Button color="light" className="text-dark" size="sm" onClick={handleAlternativesCancel}>Cancel</Button>
            </div>
          </span>
        ) : (
          <span
            className="d-inline text-success"
            style={{ cursor: "pointer", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            onClick={startAlternativesEdit}
            title="Click to edit"
          >
            {formValues.additional_risk_warnings_text || "click to add reason..."}
          </span>
        )}
      </p>

      <AdvisorNote>
        (please indicate what has been considered, 0% balance transfer,
        unsecured consolidation loan, second charge etc)
      </AdvisorNote>

      <p className="fw-bold mb-2 mt-3">Important Considerations</p>
      <p>
        Consolidating debts into your mortgage can reduce monthly payments.
        However, it is important to understand that:
      </p>
      <ul className="mb-3" style={{ listStyle: "none", paddingLeft: "1rem" }}>
        <li className="mb-1">
          <span className="me-2">•</span>
          You may repay more interest overall because the debt is repaid over a
          longer period.
        </li>
        <li className="mb-1">
          <span className="me-2">•</span>
          Previously unsecured debts will become secured against your home.
        </li>
        <li className="mb-1">
          <span className="me-2">•</span>
          Your property may be repossessed if you do not maintain mortgage
          repayments. This risk does not apply to unsecured borrowing such as
          credit cards or personal loans.
        </li>
      </ul>

      {/* ── Proceed ── */}
      <p>
        I have explained these risks and disadvantages to you in full. Despite
        these considerations, you confirmed that you wish to proceed with
        consolidation because{" "}
        {isProceedEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={proceedDraft}
              onChange={(e) => setProceedDraft(e.target.value)}
              placeholder="Enter reason for proceeding..."
              autoFocus
              className="w-100 p-1"
            />
            <div className="d-flex gap-2 mt-2">
              <Button color="light" className="text-dark" size="sm" onClick={handleProceedSave}>Save</Button>
              <Button color="light" className="text-dark" size="sm" onClick={handleProceedCancel}>Cancel</Button>
            </div>
          </span>
        ) : (
          <span
            className="d-inline text-success"
            style={{ cursor: "pointer", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            onClick={startProceedEdit}
            title="Click to edit"
          >
            {formValues.consolidation_proceed_reason || "click to add reason..."}
          </span>
        )}
      </p>

      <p className="fw-bold mb-2 mt-3">Debt Summary and Recommendation</p>
      <p>A summary of the debts you wish to consolidate is shown in the table below.</p>

      <Table bordered responsive size="sm" className="mb-3">
        <thead>
          <tr>
            <th style={thStyle}>Lender &amp; type</th>
            <th style={thStyle}>Balance / settlement figure</th>
            <th style={thStyle}>Currently monthly repayment</th>
            <th style={thStyle}>Estimated cost of adding it to the mortgage</th>
            <th style={thStyle}>Has adding the debt been recommended</th>
            <th style={thStyle}>Reason</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ color: blue }}>Barclays credit card</td>
            <td style={{ color: blue }}>£7,300</td>
            <td style={{ color: blue }}>£73</td>
            <td>
              <AdvisorNote>
                + _ x Possibly — discuss if debt con calculator can be built in
              </AdvisorNote>
            </td>
            <td style={{ color: blue }}>Y / N</td>
            <td style={{ color: "#2e7d32" }}>[reason]</td>
          </tr>
          <tr>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td></td>
            <td style={{ color: blue }}>Y / N</td>
            <td style={{ color: "#2e7d32" }}>[reason]</td>
          </tr>
          <tr>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td></td>
            <td style={{ color: blue }}>Y / N</td>
            <td style={{ color: "#2e7d32" }}>[reason]</td>
          </tr>
        </tbody>
      </Table>

      <p>
        This assessment also illustrates whether adding each debt to the
        mortgage increases or reduces the total cost of repayment compared with
        your current arrangements.
      </p>

      {/* ── Debt cost dropdown ── */}
      <p>
        Overall, adding these debts to your mortgage is estimated to cost{" "}
        <Dropdown
          isOpen={isDebtCostOptionOpen}
          toggle={() => setIsDebtCostOptionOpen((prev) => !prev)}
          className="d-inline-block"
        >
          <DropdownToggle
            tag="span"
            style={{
              color: "#6a1b9a",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {selectedDebtCostOption ? selectedDebtCostOption.label : "(select option...)"}
          </DropdownToggle>
          <DropdownMenu>
            {debtCostOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => onFormChange({ debt_cost_comparison: option.value })}
              >
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>{" "}
        than continuing with the current arrangements.
      </p>

      <AdvisorNote>
        (If it costs more overall to add the debts to the mortgage, please
        summarise here why, on balance, it was recommended for the consolidation
        to take place)
      </AdvisorNote>

      <p>
        If credit is regularly being used to meet essential household
        expenditure, this can indicate financial difficulty. Debt consolidation
        may not be the solution to this and puts your home at greater risk. It
        is important that you are comfortable the new mortgage payments will
        remain affordable both now and in the future.
      </p>

      <p>
        Should you wish, I can provide information about independent debt advice
        charities and organisations that can assist with budgeting or
        alternative forms of debt management support.
      </p>

      <p>Please let me know if you would like this information.</p>
    </>
  );
};

export default DebtConsolidation;