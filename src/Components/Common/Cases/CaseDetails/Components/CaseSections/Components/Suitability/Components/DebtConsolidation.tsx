import React from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";

export interface DebtItem {
  id: string;
  lender_type: string;
  balance: string;
  monthly_repayment: string;
  adding_recommended: string;
  reason: string;
}

export interface DebtConsolidationData {
  is_applicable: string; // YES | NO
  total_outstanding: string;
  how_debts_arose: string;
  client_goal: string;
  alternative_finance_considered: string;
  debts: DebtItem[];
  overall_cost_comparison: string; // LESS | MORE
  why_more_still_recommended: string;
  financial_difficulty_acknowledged: string; // YES | NO
  wants_debt_advice_info: string; // YES | NO
  client_confirmation_reason: string;
}

interface Props {
  data: DebtConsolidationData;
  onChange: (field: keyof DebtConsolidationData, value: any) => void;
}

const emptyDebt = (): DebtItem => ({
  id: Math.random().toString(36).slice(2),
  lender_type: "",
  balance: "",
  monthly_repayment: "",
  adding_recommended: "",
  reason: "",
});

const Tab5_DebtConsolidation: React.FC<Props> = ({ data, onChange }) => {
  const updateDebt = (id: string, field: keyof DebtItem, value: string) => {
    onChange(
      "debts",
      data.debts.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const addDebt = () => onChange("debts", [...data.debts, emptyDebt()]);

  const removeDebt = (id: string) =>
    onChange("debts", data.debts.filter((d) => d.id !== id));

  if (data.is_applicable === "NO") {
    return (
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Debt Consolidation</h5>
          <Input
            type="select"
            className="w-auto"
            value={data.is_applicable}
            onChange={(e) => onChange("is_applicable", e.target.value)}
          >
            <option value="YES">Applicable to this case</option>
            <option value="NO">Not applicable to this case</option>
          </Input>
        </CardHeader>
        <CardBody>
          <Alert color="secondary">
            Debt consolidation section is marked as not applicable and will be excluded from the letter.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Debt Consolidation</h5>
          <Input
            type="select"
            className="w-auto"
            value={data.is_applicable}
            onChange={(e) => onChange("is_applicable", e.target.value)}
          >
            <option value="YES">Applicable to this case</option>
            <option value="NO">Not applicable to this case</option>
          </Input>
        </CardHeader>
        <CardBody>
          <Alert color="warning" className="py-2">
            <strong>Important:</strong> The letter will include standard regulatory risk disclosures about debt consolidation — secured vs unsecured debt, repossession risk, and total interest over term.
          </Alert>
          <Row className="g-3">
            <Col md={4}>
              <FormGroup>
                <Label>Total Outstanding Balance (£)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 12,500"
                  value={data.total_outstanding}
                  onChange={(e) => onChange("total_outstanding", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>How did these debts arise?</Label>
                <Input
                  type="textarea"
                  rows={3}
                  value={data.how_debts_arose}
                  onChange={(e) => onChange("how_debts_arose", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>What is the client's goal?</Label>
                <Input
                  type="textarea"
                  rows={3}
                  value={data.client_goal}
                  onChange={(e) => onChange("client_goal", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>
                  Alternative finance considered but not appropriate
                  <small className="text-muted ms-2">0% balance transfer, unsecured loan, second charge, etc.</small>
                </Label>
                <Input
                  type="textarea"
                  rows={3}
                  value={data.alternative_finance_considered}
                  onChange={(e) => onChange("alternative_finance_considered", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Debt Summary Table */}
      <Card className="border border-success">
        <CardHeader className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-success">Debt Summary</h5>
          <Button color="success" size="sm" onClick={addDebt}>+ Add Debt</Button>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table bordered className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Lender &amp; Type</th>
                  <th>Balance / Settlement (£)</th>
                  <th>Monthly Repayment (£)</th>
                  <th>Adding Recommended?</th>
                  <th>Reason</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.debts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-3">
                      No debts added yet. Click &quot;+ Add Debt&quot; to begin.
                    </td>
                  </tr>
                )}
                {data.debts.map((debt) => (
                  <tr key={debt.id}>
                    <td>
                      <Input
                        type="text"
                        placeholder="e.g. Barclays credit card"
                        bsSize="sm"
                        value={debt.lender_type}
                        onChange={(e) => updateDebt(debt.id, "lender_type", e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="e.g. 7,300"
                        bsSize="sm"
                        value={debt.balance}
                        onChange={(e) => updateDebt(debt.id, "balance", e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="e.g. 73"
                        bsSize="sm"
                        value={debt.monthly_repayment}
                        onChange={(e) => updateDebt(debt.id, "monthly_repayment", e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        type="select"
                        bsSize="sm"
                        value={debt.adding_recommended}
                        onChange={(e) => updateDebt(debt.id, "adding_recommended", e.target.value)}
                      >
                        <option value="">—</option>
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="Reason..."
                        bsSize="sm"
                        value={debt.reason}
                        onChange={(e) => updateDebt(debt.id, "reason", e.target.value)}
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        color="danger"
                        size="sm"
                        outline
                        onClick={() => removeDebt(debt.id)}
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Cost Comparison & Confirmation */}
      <Card className="border border-secondary">
        <CardHeader className="bg-secondary bg-opacity-10">
          <h5 className="mb-0">Overall Assessment & Client Confirmation</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup>
                <Label>Overall cost of adding debts to mortgage vs. current arrangements</Label>
                <Input
                  type="select"
                  value={data.overall_cost_comparison}
                  onChange={(e) => onChange("overall_cost_comparison", e.target.value)}
                >
                  <option value="">— Please select —</option>
                  <option value="LESS">Less — consolidation reduces overall cost</option>
                  <option value="MORE">More — consolidation increases overall cost</option>
                </Input>
              </FormGroup>
            </Col>

            {data.overall_cost_comparison === "MORE" && (
              <Col md={12}>
                <FormGroup>
                  <Label>
                    If more costly overall, explain why consolidation was still recommended
                  </Label>
                  <Input
                    type="textarea"
                    rows={4}
                    value={data.why_more_still_recommended}
                    onChange={(e) => onChange("why_more_still_recommended", e.target.value)}
                  />
                </FormGroup>
              </Col>
            )}

            <Col md={12}>
              <FormGroup>
                <Label>
                  Client confirmed they wish to proceed with consolidation because
                </Label>
                <Input
                  type="textarea"
                  rows={3}
                  value={data.client_confirmation_reason}
                  onChange={(e) => onChange("client_confirmation_reason", e.target.value)}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Client wishes to receive information about independent debt advice?</Label>
                <Input
                  type="select"
                  value={data.wants_debt_advice_info}
                  onChange={(e) => onChange("wants_debt_advice_info", e.target.value)}
                >
                  <option value="">— Please select —</option>
                  <option value="YES">Yes — provide information</option>
                  <option value="NO">No — not required at this time</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tab5_DebtConsolidation;