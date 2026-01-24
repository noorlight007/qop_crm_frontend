import { useGetCaseBudgetPlannerQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";
import { HouseHoldIncomeTabContentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/BudgetPlannerTypes";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";

const HouseHoldIncomeTabContent: FC<HouseHoldIncomeTabContentProps> = ({
  updateField,
}) => {
  const { casealias } = useParams();
  const { data, isLoading, error, refetch } = useGetCaseBudgetPlannerQuery(
    { case_alias: casealias as string },
    {
      skip: !casealias,
      refetchOnMountOrArgChange: true, // Force refetch on component mount
      refetchOnReconnect: true,
      refetchOnFocus: true,
    },
  );

  // Use the first item from the API data array
  const budgetPlannerData = data?.[0] ?? {
    current_income: {},
    post_income: {},
  };

  const [currentValues, setCurrentValues] = useState<Record<string, string>>(
    {},
  );
  const [postValues, setPostValues] = useState<Record<string, string>>({});

  const incomeFieldMappings = {
    "Applicant 1 Net Monthly Income": "applicant_one_net_monthly_income",
    "Applicant 2 Net Monthly Income": "applicant_two_net_monthly_income",
    "Rental Income": "rental_income",
    "Part Time Income": "part_time_income",
    "Jobseeker's Allowance": "jobseekers_allowance",
    "Child Benefit": "child_benefit",
    "Tax Credits": "tax_credits",
    "Working Tax Credits": "working_tax_credits",
    Maintenance: "maintenance",
    Pension: "pension",
    "Other Benefits": "other_benefits",
  };

  // Prevent typing negative/exponential signs and sanitize negatives
  const blockInvalidChar = (e: any) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };
  const sanitizeNumberInput = (v: string) => {
    if (v === "") return "";
    const n = parseFloat(v);
    return isNaN(n) || n < 0 ? "0" : v;
  };

  // Force a refetch when component mounts or casealias changes
  useEffect(() => {
    if (casealias && refetch) {
      // console.log("Forcing API refetch for household income, case:", casealias);
      refetch();
    }
  }, [casealias, refetch]);

  // Initialize local state with direct API data
  useEffect(() => {
    if (!budgetPlannerData?.current_income || !budgetPlannerData?.post_income) {
      // console.log("❌ No income data available for initialization");
      return;
    }

    // console.log("🔄 Initializing household income state with API data...");

    const initialCurrentValues: Record<string, string> = {};
    const initialPostValues: Record<string, string> = {};

    // Current Income - Read from API data
    Object.entries(incomeFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.current_income?.[
          key as keyof typeof budgetPlannerData.current_income
        ] ?? 0;
      initialCurrentValues[`CurrentBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      // console.log(
      //   `Current ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialCurrentValues[`CurrentBudgetPlanner.${field}`]
      // );
    });

    // Post Income - Read from API data
    Object.entries(incomeFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.post_income?.[
          key as keyof typeof budgetPlannerData.post_income
        ] ?? 0;
      initialPostValues[`PostCompletionBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      console.log(
        `Post ${field} (${key}):`,
        value,
        "->",
        initialPostValues[`PostCompletionBudgetPlanner.${field}`],
      );
    });

    // console.log("📝 Setting household income state...");
    // console.log("Initial current values:", initialCurrentValues);
    // console.log("Initial post values:", initialPostValues);

    setCurrentValues(initialCurrentValues);
    setPostValues(initialPostValues);

    // console.log("✅ Household income state setting completed");
  }, [budgetPlannerData]);

  // Update parent modal with current values
  useEffect(() => {
    if (Object.keys(currentValues).length === 0) return;

    const formattedCurrentValues = {
      ...Object.entries(currentValues).reduce(
        (acc, [key, value]) => {
          const fieldName = key.split(".")[1];
          const reduxFieldName =
            incomeFieldMappings[fieldName as keyof typeof incomeFieldMappings];
          if (reduxFieldName) {
            acc[reduxFieldName] = value === "" ? 0 : parseFloat(value);
          }
          return acc;
        },
        {} as Record<string, number>,
      ),
      total_income: parseFloat(calculateTotal(currentValues)) || 0,
    };

    updateField("current_income", formattedCurrentValues);
    // Keep sub_total in sync (merge-safe)
    // Only update the field we own to avoid overwriting other sub-totals
    updateField("current_sub_total", {
      total_income: formattedCurrentValues.total_income || 0,
    });
  }, [currentValues, updateField]);

  // Update parent modal with post values
  useEffect(() => {
    if (Object.keys(postValues).length === 0) return;

    const formattedPostValues = {
      ...Object.entries(postValues).reduce(
        (acc, [key, value]) => {
          const fieldName = key.split(".")[1];
          const reduxFieldName =
            incomeFieldMappings[fieldName as keyof typeof incomeFieldMappings];
          if (reduxFieldName) {
            acc[reduxFieldName] = value === "" ? 0 : parseFloat(value);
          }
          return acc;
        },
        {} as Record<string, number>,
      ),
      total_income: parseFloat(calculateTotal(postValues)) || 0,
    };

    updateField("post_income", formattedPostValues);
    // Keep sub_total in sync (merge-safe)
    // Only update the field we own to avoid overwriting other sub-totals
    updateField("post_sub_total", {
      total_income: formattedPostValues.total_income || 0,
    });
  }, [postValues, updateField]);

  const renderForm = (prefix: string, className: string) => (
    <Form>
      {Object.entries(incomeFieldMappings).map(([label, fieldKey]) => {
        const fieldName = `${prefix}.${label}`;
        return (
          <FormGroup row key={fieldKey}>
            <Label
              for={`${prefix}_${fieldKey}`}
              sm={6}
              style={{ fontSize: "0.9rem" }}
            >
              {label}
            </Label>
            <Col sm={6}>
              <InputGroup>
                <InputGroupText>£</InputGroupText>
                <Input
                  type="number"
                  name={fieldName}
                  id={`${prefix}_${fieldKey}`}
                  className={`numeric-decimal ${className}`}
                  placeholder="0.00"
                  step="0.01"
                  min={0}
                  inputMode="decimal"
                  onKeyDown={blockInvalidChar}
                  onInput={limitDecimalPlaces}
                  value={
                    prefix === "CurrentBudgetPlanner"
                      ? currentValues[fieldName] || ""
                      : postValues[fieldName] || ""
                  }
                  onChange={(e) => {
                    const safe = sanitizeNumberInput(e.target.value);
                    const newValues =
                      prefix === "CurrentBudgetPlanner"
                        ? { ...currentValues, [fieldName]: safe }
                        : { ...postValues, [fieldName]: safe };
                    prefix === "CurrentBudgetPlanner"
                      ? setCurrentValues(newValues)
                      : setPostValues(newValues);
                  }}
                />
              </InputGroup>
            </Col>
          </FormGroup>
        );
      })}
    </Form>
  );

  // Handle copy from current button click
  const handleCopyFromCurrent = () => {
    const newPostValues: Record<string, string> = {};
    Object.keys(currentValues).forEach((key) => {
      const newKey = key.replace(
        "CurrentBudgetPlanner",
        "PostCompletionBudgetPlanner",
      );
      newPostValues[newKey] = currentValues[key];
    });
    setPostValues(newPostValues);
  };

  // Calculate totals
  const calculateTotal = (values: Record<string, string>) => {
    return Object.values(values)
      .reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
      .toFixed(2);
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading household income data...
            </span>
          </div>
          <p className="mt-3 text-muted">Loading household income data...</p>
        </div>
      ) : (
        <>
          <p className="fs-9">
            <small>
              List all monthly household income after tax and deductions.
            </small>
          </p>
          <Row className="g-4">
            <Col md={6}>
              <h4 className="text-center mb-3">Current</h4>
              <div className="border rounded-3 shadow-sm">
                <div className="bg-light border-bottom p-3">
                  <span className="fw-bold text-primary">Income</span>
                </div>
                <div className="p-3">
                  {renderForm("CurrentBudgetPlanner", "living-expense")}
                </div>
                <div className="p-3 bg-light border-top">
                  <FormGroup row>
                    <Label
                      for="CurrentBudgetPlanner_TotalIncome"
                      sm={6}
                      className="fw-bold text-primary"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Total Income
                    </Label>
                    <Col sm={6}>
                      <InputGroup>
                        <InputGroupText>£</InputGroupText>
                        <Input
                          type="number"
                          name="CurrentBudgetPlanner.TotalIncome"
                          id="CurrentBudgetPlanner_TotalIncome"
                          className="numeric-decimal fw-bold"
                          readOnly
                          value={calculateTotal(currentValues)}
                          step="0.01"
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <h4 className="text-center mb-3">Post Completion</h4>
              <div className="border rounded-3 shadow-sm">
                <div className="bg-light border-bottom p-3 d-flex justify-content-between">
                  <span className="fw-bold text-primary">Income</span>
                  <Button
                    color="primary"
                    size="sm"
                    id="copyFromCurrentButton"
                    onClick={handleCopyFromCurrent}
                  >
                    Copy from Current
                  </Button>
                </div>
                <div className="p-3">
                  {renderForm(
                    "PostCompletionBudgetPlanner",
                    "living-expensePC",
                  )}
                </div>
                <div className="p-3 bg-light border-top">
                  <FormGroup row>
                    <Label
                      for="PostCompletionBudgetPlanner_TotalIncome"
                      sm={6}
                      className="fw-bold text-primary"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Total Income
                    </Label>
                    <Col sm={6}>
                      <InputGroup>
                        <InputGroupText>£</InputGroupText>
                        <Input
                          type="number"
                          name="PostCompletionBudgetPlanner.TotalIncome"
                          id="PostCompletionBudgetPlanner_TotalIncome"
                          className="numeric-decimal"
                          readOnly
                          value={calculateTotal(postValues)}
                          step="0.01"
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default HouseHoldIncomeTabContent;
