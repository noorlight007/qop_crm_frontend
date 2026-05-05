import { debtCostOptions } from "@/Data/Cases/SuitabilityData";
import {
  useCreateDebtSummaryRecommendationMutation,
  useUpdateDebtSummaryRecommendationMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Suitability/SuitabilityApi";
import {
  CreditCommitment,
  DebtConsolidationProps,
  DebtSummaryRowDraft,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Table,
} from "reactstrap";

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

const DebtConsolidation: React.FC<DebtConsolidationProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  // ── UI-only states ──
  const [isDebtsAroseEditing, setIsDebtsAroseEditing] = useState(false);
  const [isGoalEditing, setIsGoalEditing] = useState(false);
  const [isAlternativesEditing, setIsAlternativesEditing] = useState(false);
  const [isProceedEditing, setIsProceedEditing] = useState(false);
  const [isDebtCostOptionOpen, setIsDebtCostOptionOpen] = useState(false);
  const [isBalanceEditing, setIsBalanceEditing] = useState(false);
  const [balanceDraft, setBalanceDraft] = useState("");
  const [editingCell, setEditingCell] = useState<Record<string, boolean>>({});

  // ── Draft states ──
  const [debtsAroseDraft, setDebtsAroseDraft] = useState("");
  const [goalDraft, setGoalDraft] = useState("");
  const [alternativesDraft, setAlternativesDraft] = useState("");
  const [proceedDraft, setProceedDraft] = useState("");
  const [savingCell, setSavingCell] = useState<Record<string, boolean>>({});

  // ── Derived from formValues ──
  const selectedDebtCostOption =
    debtCostOptions.find((o) => o.value === formValues.debt_cost_comparison) ??
    null;

  const startBalanceEdit = () => {
    setBalanceDraft(formValues.outstanding_balance ?? "");
    setIsBalanceEditing(true);
  };
  const handleBalanceSave = () => {
    onFormChange({ outstanding_balance: balanceDraft });
    setIsBalanceEditing(false);
  };
  const handleBalanceCancel = () => {
    setBalanceDraft(formValues.outstanding_balance ?? "");
    setIsBalanceEditing(false);
  };

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

  const debts: CreditCommitment[] = s?.credit_commitments ?? [];

  // ── Row drafts ──
  const [rowDrafts, setRowDrafts] = useState<DebtSummaryRowDraft[]>([]);

  useEffect(() => {
    const recs = [...(s?.debt_summary_recommendations ?? [])].sort(
      (a: any, b: any) => a.id - b.id,
    );
    setRowDrafts(
      debts.map((_, i) => {
        const rec = recs[i];
        return {
          alias: rec?.alias ?? null,
          estimated_cost_text: rec?.estimated_cost_text ?? "",
          has_adding_the_debt_been_recommended:
            rec?.has_adding_the_debt_been_recommended ?? null,
          debt_summary_reason: rec?.debt_summary_reason ?? "",
        };
      }),
    );
  }, [suitability]);

  // ── Mutations ──
  const [createDebtSummaryRecommendation] =
    useCreateDebtSummaryRecommendationMutation();
  const [updateDebtSummaryRecommendation] =
    useUpdateDebtSummaryRecommendationMutation();

  // ── Update a single row's draft in state ──
  const updateRowDraft = (
    rowIndex: number,
    patch: Partial<DebtSummaryRowDraft>,
  ) => {
    setRowDrafts((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, ...patch } : row)),
    );
  };

  // ── Save handler
  const handleRowSave = async (
    rowIndex: number,
    patch?: Partial<DebtSummaryRowDraft>,
    cellKey?: string,
  ) => {
    if (cellKey) setSavingCell((prev) => ({ ...prev, [cellKey]: true }));
    try {
      const draft = patch
        ? { ...rowDrafts[rowIndex], ...patch }
        : rowDrafts[rowIndex];

      if (draft.alias == null) {
        const result = await createDebtSummaryRecommendation({
          case_alias: caseData.alias,
          payload: draft,
        }).unwrap();
        setRowDrafts((prev) =>
          prev.map((row, i) =>
            i === rowIndex ? { ...row, alias: result.alias } : row,
          ),
        );
      } else {
        await updateDebtSummaryRecommendation({
          case_alias: caseData.alias,
          alias: draft.alias,
          payload: draft,
        }).unwrap();
      }
    } finally {
      if (cellKey) setSavingCell((prev) => ({ ...prev, [cellKey]: false }));
    }
  };

  const cancelRowEdit = (rowIndex: number) => {
    const recs = [...(s?.debt_summary_recommendations ?? [])].sort(
      (a: any, b: any) => a.id - b.id,
    );
    const rec = recs[rowIndex];
    setRowDrafts((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              estimated_cost_text: rec?.estimated_cost_text ?? "",
              debt_summary_reason: rec?.debt_summary_reason ?? "",
            }
          : row,
      ),
    );
  };

  return (
    <>
      <SectionHeading>Debt Consolidation</SectionHeading>

      <p>
        During our discussions, we reviewed your existing unsecured debts. Based
        on the information you provided, the total outstanding balance is
        currently{" "}
        {isBalanceEditing ? (
          <span className="d-inline-flex align-items-center gap-2 ms-1">
            £
            <Input
              type="text"
              value={balanceDraft}
              onChange={(e) => setBalanceDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBalanceSave();
                if (e.key === "Escape") handleBalanceCancel();
              }}
              placeholder="e.g. 12,500.00"
              autoFocus
              style={{ width: "160px", display: "inline-block" }}
              className="p-1"
            />
            <Button
              color="light"
              className="text-dark"
              size="sm"
              onClick={handleBalanceSave}
            >
              Save
            </Button>
            <Button
              color="light"
              className="text-dark"
              size="sm"
              onClick={handleBalanceCancel}
            >
              Cancel
            </Button>
          </span>
        ) : (
          <span
            className="text-success fw-bold"
            style={{ cursor: "pointer" }}
            onClick={startBalanceEdit}
            title="Click to edit"
          >
            £{formValues.outstanding_balance || "click to add balance..."}
          </span>
        )}
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
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleDebtsAroseSave}
              >
                Save
              </Button>
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleDebtsAroseCancel}
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
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleGoalSave}
              >
                Save
              </Button>
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleGoalCancel}
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
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleAlternativesSave}
              >
                Save
              </Button>
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleAlternativesCancel}
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
            onClick={startAlternativesEdit}
            title="Click to edit"
          >
            {formValues.additional_risk_warnings_text ||
              "click to add reason..."}
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
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleProceedSave}
              >
                Save
              </Button>
              <Button
                color="light"
                className="text-dark"
                size="sm"
                onClick={handleProceedCancel}
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
            onClick={startProceedEdit}
            title="Click to edit"
          >
            {formValues.consolidation_proceed_reason ||
              "click to add reason..."}
          </span>
        )}
      </p>

      <p className="fw-bold mb-2 mt-3">Debt Summary and Recommendation</p>
      <p>
        A summary of the debts you wish to consolidate is shown in the table
        below.
      </p>

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
          {debts.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted fst-italic">
                No debt consolidation entries found.
              </td>
            </tr>
          ) : (
            debts.map((debt, i) => {
              const draft = rowDrafts[i] ?? {
                alias: null,
                estimated_cost_text: "",
                has_adding_the_debt_been_recommended: null,
                debt_summary_reason: "",
              };
              const costKey = `${i}_cost`;
              const reasonKey = `${i}_reason`;

              return (
                <tr key={i}>
                  {/* Lender & type */}
                  <td style={{ color: blue }}>
                    {debt.company} {debt.type ? `(${debt.type})` : ""}
                  </td>

                  {/* Balance / settlement figure */}
                  <td style={{ color: blue }}>
                    {debt.os_balance != null
                      ? `£${debt.os_balance.toFixed(2)}`
                      : "—"}
                    {debt.settlement_balance != null && (
                      <span
                        className="text-muted d-block"
                        style={{ fontSize: "0.78rem" }}
                      >
                        Settlement: £{debt.settlement_balance.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Monthly repayment */}
                  <td style={{ color: blue }}>
                    {debt.monthly_repayment != null
                      ? `£${debt.monthly_repayment.toFixed(2)}`
                      : "—"}
                  </td>

                  {/* Estimated cost — Done closes cell and triggers save */}
                  <td>
                    {editingCell[costKey] ? (
                      <>
                        £
                        <Input
                          type="textarea"
                          rows={3}
                          value={draft.estimated_cost_text}
                          autoFocus
                          onChange={(e) =>
                            updateRowDraft(i, {
                              estimated_cost_text: e.target.value,
                            })
                          }
                          className="w-100 p-1"
                          style={{ fontSize: "0.82rem" }}
                        />
                        <div className="d-flex gap-2 mt-1">
                          <Button
                            color="light"
                            className="text-dark"
                            size="sm"
                            disabled={savingCell[costKey]}
                            onClick={() => {
                              setEditingCell((prev) => ({
                                ...prev,
                                [costKey]: false,
                              }));
                              handleRowSave(i, undefined, costKey);
                            }}
                          >
                            {savingCell[costKey] ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            color="light"
                            className="text-dark"
                            size="sm"
                            disabled={savingCell[costKey]}
                            onClick={() => {
                              cancelRowEdit(i);
                              setEditingCell((prev) => ({
                                ...prev,
                                [costKey]: false,
                              }));
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <span
                        className="text-success fw-bold"
                        style={{
                          cursor: "pointer",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          fontSize: "0.82rem",
                        }}
                        onClick={() =>
                          setEditingCell((prev) => ({
                            ...prev,
                            [costKey]: true,
                          }))
                        }
                        title="Click to edit"
                      >
                        £{draft.estimated_cost_text || "click to add..."}
                      </span>
                    )}
                  </td>

                  {/* Has adding the debt been recommended — selecting triggers save */}
                  <td className="text-center align-middle">
                    <Dropdown
                      isOpen={editingCell[`${i}_recommended`] ?? false}
                      toggle={() =>
                        setEditingCell((prev) => ({
                          ...prev,
                          [`${i}_recommended`]: !prev[`${i}_recommended`],
                        }))
                      }
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
                        {draft.has_adding_the_debt_been_recommended === null
                          ? "Please select"
                          : draft.has_adding_the_debt_been_recommended
                            ? "Yes"
                            : "No"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => {
                            const patch = {
                              has_adding_the_debt_been_recommended: true,
                            };
                            updateRowDraft(i, patch);
                            handleRowSave(i, patch);
                          }}
                        >
                          Yes
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            const patch = {
                              has_adding_the_debt_been_recommended: false,
                            };
                            updateRowDraft(i, patch);
                            handleRowSave(i, patch);
                          }}
                        >
                          No
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>

                  {/* Reason — Done closes cell and triggers save */}
                  <td>
                    {editingCell[reasonKey] ? (
                      <>
                        <Input
                          type="textarea"
                          rows={3}
                          value={draft.debt_summary_reason}
                          autoFocus
                          onChange={(e) =>
                            updateRowDraft(i, {
                              debt_summary_reason: e.target.value,
                            })
                          }
                          className="w-100 p-1"
                          style={{ fontSize: "0.82rem" }}
                        />
                        <div className="d-flex gap-2 mt-1">
                          <Button
                            color="light"
                            className="text-dark"
                            size="sm"
                            disabled={savingCell[reasonKey]}
                            onClick={() => {
                              setEditingCell((prev) => ({
                                ...prev,
                                [reasonKey]: false,
                              }));
                              handleRowSave(i, undefined, reasonKey);
                            }}
                          >
                            {savingCell[reasonKey] ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            color="light"
                            className="text-dark"
                            size="sm"
                            disabled={savingCell[reasonKey]}
                            onClick={() => {
                              cancelRowEdit(i);
                              setEditingCell((prev) => ({
                                ...prev,
                                [reasonKey]: false,
                              }));
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <span
                        className="text-success fw-bold"
                        style={{
                          cursor: "pointer",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          fontSize: "0.82rem",
                        }}
                        onClick={() =>
                          setEditingCell((prev) => ({
                            ...prev,
                            [reasonKey]: true,
                          }))
                        }
                        title="Click to edit"
                      >
                        {draft.debt_summary_reason || "click to add reason..."}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
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
            {selectedDebtCostOption
              ? selectedDebtCostOption.label
              : "(select option...)"}
          </DropdownToggle>
          <DropdownMenu>
            {debtCostOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  onFormChange({ debt_cost_comparison: option.value })
                }
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
