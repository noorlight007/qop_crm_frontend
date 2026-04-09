import React, { useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Table } from "reactstrap";

/* ── Pink: advisor guidance note ── */
const AdvisorNote = ({ children }: { children: React.ReactNode }) => (
  <p className="suitability-advisor-note rounded">
    {children}
  </p>
);

/* ── Purple: dropdown placeholder ── */
const PleaseSelect = ({ label }: { label?: string }) => (
  <span
    className="px-2 py-1 rounded small fst-italic d-inline-block"
    style={{
      background: "#f3e5f5",
      color: "#6a1b9a",
      border: "1px dashed #ab47bc",
    }}
  >
    {label ?? "Please Select"}
  </span>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6 className="suitability-section-heading">
    {children}
  </h6>
);

const thStyle: React.CSSProperties = {
  background: "#1a3c5e",
  color: "#fff",
  fontSize: "0.84rem",
  fontWeight: 600,
};

interface DebtConsolidationProps {
  caseData: any;
  suitability: any;
}

const DebtConsolidation: React.FC<DebtConsolidationProps> = ({
  caseData,
  suitability,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  const [debtsAroseReason, setDebtsAroseReason] = useState("");
  const [savedDebtsAroseReason, setSavedDebtsAroseReason] = useState("");
  const [isDebtsAroseEditing, setIsDebtsAroseEditing] = useState(false);
  const [goalReason, setGoalReason] = useState("");
  const [savedGoalReason, setSavedGoalReason] = useState("");
  const [isGoalEditing, setIsGoalEditing] = useState(false);
  const [alternativesReason, setAlternativesReason] = useState("");
  const [savedAlternativesReason, setSavedAlternativesReason] = useState("");
  const [isAlternativesEditing, setIsAlternativesEditing] = useState(false);
  const [proceedReason, setProceedReason] = useState("");
  const [savedProceedReason, setSavedProceedReason] = useState("");
  const [isProceedEditing, setIsProceedEditing] = useState(false);
  const [selectedDebtCostOption, setSelectedDebtCostOption] = useState<
    string | null
  >(null);
  const [isDebtCostOptionOpen, setIsDebtCostOptionOpen] = useState(false);

  const debtCostOptions = ["less", "more"];

  const handleDebtsAroseSave = () => {
    setSavedDebtsAroseReason(debtsAroseReason);
    setIsDebtsAroseEditing(false);
  };

  const handleDebtsAroseCancel = () => {
    setDebtsAroseReason(savedDebtsAroseReason);
    setIsDebtsAroseEditing(false);
  };

  const handleGoalSave = () => {
    setSavedGoalReason(goalReason);
    setIsGoalEditing(false);
  };

  const handleGoalCancel = () => {
    setGoalReason(savedGoalReason);
    setIsGoalEditing(false);
  };

  const handleAlternativesSave = () => {
    setSavedAlternativesReason(alternativesReason);
    setIsAlternativesEditing(false);
  };

  const handleAlternativesCancel = () => {
    setAlternativesReason(savedAlternativesReason);
    setIsAlternativesEditing(false);
  };

  const handleProceedSave = () => {
    setSavedProceedReason(proceedReason);
    setIsProceedEditing(false);
  };

  const handleProceedCancel = () => {
    setProceedReason(savedProceedReason);
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

      <p>
        You explained that these debts arose because{" "}
        {isDebtsAroseEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={debtsAroseReason}
              onChange={(e) => setDebtsAroseReason(e.target.value)}
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
            onClick={() => setIsDebtsAroseEditing(true)}
            title="Click to edit"
          >
            {savedDebtsAroseReason || "click to add reason..."}
          </span>
        )}
      </p>

      <p>
        You told me your goal is to{" "}
        {isGoalEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={goalReason}
              onChange={(e) => setGoalReason(e.target.value)}
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
            onClick={() => setIsGoalEditing(true)}
            title="Click to edit"
          >
            {savedGoalReason || "click to add goal..."}
          </span>
        )}
      </p>

      <p>
        For this reason, you asked us to explore consolidating these debts into
        your mortgage.
      </p>

      <p>
        Alternative forms of finance were considered but not appropriate because{" "}
        {isAlternativesEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={alternativesReason}
              onChange={(e) => setAlternativesReason(e.target.value)}
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
            onClick={() => setIsAlternativesEditing(true)}
            title="Click to edit"
          >
            {savedAlternativesReason || "click to add reason..."}
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
      <ul className="mb-3">
        <li className="mb-1">
          You may repay more interest overall because the debt is repaid over a
          longer period.
        </li>
        <li className="mb-1">
          Previously unsecured debts will become secured against your home.
        </li>
        <li className="mb-1">
          Your property may be repossessed if you do not maintain mortgage
          repayments. This risk does not apply to unsecured borrowing such as
          credit cards or personal loans.
        </li>
      </ul>

      <p>
        I have explained these risks and disadvantages to you in full. Despite
        these considerations, you confirmed that you wish to proceed with
        consolidation because{" "}
        {isProceedEditing ? (
          <span className="d-block w-100 mt-1">
            <Input
              type="textarea"
              rows={5}
              value={proceedReason}
              onChange={(e) => setProceedReason(e.target.value)}
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
            onClick={() => setIsProceedEditing(true)}
            title="Click to edit"
          >
            {savedProceedReason || "click to add reason..."}
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
          <tr>
            <td style={{ color: blue }}>Barclays credit card</td>
            <td style={{ color: blue }}>£7,300</td>
            <td style={{ color: blue }}>£73</td>
            <td>
              <AdvisorNote>
                + _ x Possibly — discuss if debt con calculator can be built in
              </AdvisorNote>
            </td>
            <td>
              <PleaseSelect label="Y / N" />
            </td>
            <td style={{ color: "#2e7d32" }}>[reason]</td>
          </tr>
          <tr>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td></td>
            <td>
              <PleaseSelect label="Y / N" />
            </td>
            <td style={{ color: "#2e7d32" }}>[reason]</td>
          </tr>
          <tr>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td style={{ color: blue }}></td>
            <td></td>
            <td>
              <PleaseSelect label="Y / N" />
            </td>
            <td style={{ color: "#2e7d32" }}>[reason]</td>
          </tr>
        </tbody>
      </Table>

      <p>
        This assessment also illustrates whether adding each debt to the
        mortgage increases or reduces the total cost of repayment compared with
        your current arrangements.
      </p>

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
            {selectedDebtCostOption ?? "(select option...)"}
          </DropdownToggle>
          <DropdownMenu>
            {debtCostOptions.map((option, index) => (
              <DropdownItem
                key={index}
                onClick={() => setSelectedDebtCostOption(option)}
              >
                {option}
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
