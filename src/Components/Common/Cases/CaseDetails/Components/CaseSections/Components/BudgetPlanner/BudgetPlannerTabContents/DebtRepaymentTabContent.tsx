import { useGetCaseBudgetPlannerQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";
import { DebtRepaymentTabContentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/BudgetPlannerTypes";
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

const DebtRepaymentTabContent: FC<DebtRepaymentTabContentProps> = ({
  updateField,
  errors,
}) => {
  const { casealias } = useParams();
  const { data, isLoading, refetch } = useGetCaseBudgetPlannerQuery(
    { case_alias: casealias as string },
    {
      skip: !casealias,
      refetchOnMountOrArgChange: true, // Force refetch on component mount
      refetchOnReconnect: true,
      refetchOnFocus: true,
    },
  );

  // Use the first item from the API data array - SAME AS HOUSEHOLD INCOME
  const budgetPlannerData = data?.[0] ?? {
    current_debt_repayments: {},
    post_debt_repayments: {},
    current_priority_debt: {},
    post_priority_debt: {},
    current_unsecured_borrowing: {},
    post_unsecured_borrowing: {},
  };

  const [currentValues, setCurrentValues] = useState<Record<string, string>>(
    {},
  );
  const [postValues, setPostValues] = useState<Record<string, string>>({});

  const debtRepaymentFieldMappings = {
    "Mortgage/Rent - Monthly": "mortgage_rent",
    "Second Mortgage - Monthly": "second_mortgage",
    "Shared Ownership Rental - Monthly": "shared_ownership_rental",
  };

  const priorityDebtFieldMappings = {
    "Mortgage Arrears - Monthly": "mortgage_arrears",
    "Gas Arrears - Monthly": "gas_arrears",
    "Maintenance Arrears - Monthly": "maintenance_arrears",
    "Defaults - Monthly": "defaults",
    "CCJs - Monthly": "ccjs",
    "Debt Management Plans - Monthly": "debt_management_plans",
    "Magistrate Court Fines - Monthly": "magistrate_court_fines",
    "Council Tax Arrears - Monthly": "council_tax_arrears",
  };

  const unsecuredBorrowingFieldMappings = {
    "Credit Cards - Monthly": "credit_cards",
    "Loans - Monthly": "loans",
    "Car Finance - Monthly": "car_finance",
    "Overdraft - Monthly": "overdraft",
    "Store Cards - Monthly": "store_cards",
    "Student Loans - Monthly": "student_loans",
    "Other Borrowing - Monthly": "other_borrowing",
  };

  // Enforce positive numeric input
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
      // console.log("Forcing API refetch for debt repayment, case:", casealias);
      refetch();
    }
  }, [casealias, refetch]);

  // Initialize local state with direct API data
  useEffect(() => {
    if (
      !budgetPlannerData?.current_debt_repayments ||
      !budgetPlannerData?.post_debt_repayments
    ) {
      // console.log("❌ No debt repayment data available for initialization");
      return;
    }

    // console.log("🔄 Initializing debt repayment state with API data...");

    const initialCurrentValues: Record<string, string> = {};
    const initialPostValues: Record<string, string> = {};

    // Current Debt Repayments
    Object.entries(debtRepaymentFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.current_debt_repayments?.[
          key as keyof typeof budgetPlannerData.current_debt_repayments
        ] ?? 0;
      initialCurrentValues[`CurrentBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      // console.log(
      //   `Current ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialCurrentValues[`CurrentBudgetPlanner.${field}`],
      // );
    });

    // Post Debt Repayments
    Object.entries(debtRepaymentFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.post_debt_repayments?.[
          key as keyof typeof budgetPlannerData.post_debt_repayments
        ] ?? 0;
      initialPostValues[`PostCompletionBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      // console.log(
      //   `Post ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialPostValues[`PostCompletionBudgetPlanner.${field}`],
      // );
    });

    // Current Priority Debt
    Object.entries(priorityDebtFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.current_priority_debt?.[
          key as keyof typeof budgetPlannerData.current_priority_debt
        ] ?? 0;
      initialCurrentValues[`CurrentBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      // console.log(
      //   `Current Priority ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialCurrentValues[`CurrentBudgetPlanner.${field}`],
      // );
    });

    // Post Priority Debt
    Object.entries(priorityDebtFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.post_priority_debt?.[
          key as keyof typeof budgetPlannerData.post_priority_debt
        ] ?? 0;
      initialPostValues[`PostCompletionBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      // console.log(
      //   `Post Priority ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialPostValues[`PostCompletionBudgetPlanner.${field}`],
      // );
    });

    // Current Unsecured Borrowing
    Object.entries(unsecuredBorrowingFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.current_unsecured_borrowing?.[
          key as keyof typeof budgetPlannerData.current_unsecured_borrowing
        ] ?? 0;
      initialCurrentValues[`CurrentBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      // console.log(
      //   `Current Unsecured ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialCurrentValues[`CurrentBudgetPlanner.${field}`],
      // );
    });

    // Post Unsecured Borrowing
    Object.entries(unsecuredBorrowingFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.post_unsecured_borrowing?.[
          key as keyof typeof budgetPlannerData.post_unsecured_borrowing
        ] ?? 0;
      initialPostValues[`PostCompletionBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";

      // console.log(
      //   `Post Unsecured ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialPostValues[`PostCompletionBudgetPlanner.${field}`],
      // );
    });

    // console.log("📝 Setting debt repayment state...");
    // console.log("Initial current values:", initialCurrentValues);
    // console.log("Initial post values:", initialPostValues);

    setCurrentValues(initialCurrentValues);
    setPostValues(initialPostValues);

    // console.log("✅ Debt repayment state setting completed");
  }, [budgetPlannerData]);

  // Update parent modal with current values
  useEffect(() => {
    const formatValues = (
      values: Record<string, string>,
      mappings: Record<string, string>,
      section: string,
    ) => {
      const formatted = Object.entries(values)
        .filter(([key]) => key.startsWith("CurrentBudgetPlanner"))
        .reduce(
          (acc, [key, value]) => {
            const fieldName = key.split(".")[1];
            const reduxFieldName = mappings[fieldName as keyof typeof mappings];
            if (reduxFieldName) {
              acc[reduxFieldName] = value === "" ? 0 : parseFloat(value);
            }
            return acc;
          },
          {} as Record<string, number | 0>,
        );
      formatted.total_debt_repayment =
        parseFloat(
          calculateSectionTotal(
            values,
            Object.keys(mappings),
            "CurrentBudgetPlanner",
          ),
        ) || 0;
      updateField(section, formatted);
    };

    formatValues(
      currentValues,
      debtRepaymentFieldMappings,
      "current_debt_repayments",
    );
    formatValues(
      currentValues,
      priorityDebtFieldMappings,
      "current_priority_debt",
    );
    formatValues(
      currentValues,
      unsecuredBorrowingFieldMappings,
      "current_unsecured_borrowing",
    );
  }, [currentValues, updateField]);

  // Update parent modal with post values
  useEffect(() => {
    const formatValues = (
      values: Record<string, string>,
      mappings: Record<string, string>,
      section: string,
    ) => {
      const formatted = Object.entries(values)
        .filter(([key]) => key.startsWith("PostCompletionBudgetPlanner"))
        .reduce(
          (acc, [key, value]) => {
            const fieldName = key.split(".")[1];
            const reduxFieldName = mappings[fieldName as keyof typeof mappings];
            if (reduxFieldName) {
              acc[reduxFieldName] = value === "" ? 0 : parseFloat(value);
            }
            return acc;
          },
          {} as Record<string, number | 0>,
        );
      formatted.total_debt_repayment =
        parseFloat(
          calculateSectionTotal(
            values,
            Object.keys(mappings),
            "PostCompletionBudgetPlanner",
          ),
        ) || 0;
      updateField(section, formatted);
    };

    formatValues(
      postValues,
      debtRepaymentFieldMappings,
      "post_debt_repayments",
    );
    formatValues(postValues, priorityDebtFieldMappings, "post_priority_debt");
    formatValues(
      postValues,
      unsecuredBorrowingFieldMappings,
      "post_unsecured_borrowing",
    );
  }, [postValues, updateField]);

  // Keep Monthly Sub-Total in sync for Debt Repayments (Current + Post)
  useEffect(() => {
    if (Object.keys(currentValues).length === 0) return;

    const currentTotal =
      parseFloat(
        calculateSectionTotal(
          currentValues,
          Object.keys(debtRepaymentFieldMappings),
          "CurrentBudgetPlanner",
        ),
      ) +
      parseFloat(
        calculateSectionTotal(
          currentValues,
          Object.keys(priorityDebtFieldMappings),
          "CurrentBudgetPlanner",
        ),
      ) +
      parseFloat(
        calculateSectionTotal(
          currentValues,
          Object.keys(unsecuredBorrowingFieldMappings),
          "CurrentBudgetPlanner",
        ),
      );
    if (!isNaN(currentTotal)) {
      updateField("current_sub_total", {
        total_debt_repayment: Number(currentTotal.toFixed(2)),
      });
    }
  }, [currentValues, updateField]);

  useEffect(() => {
    if (Object.keys(postValues).length === 0) return;

    const postTotal =
      parseFloat(
        calculateSectionTotal(
          postValues,
          Object.keys(debtRepaymentFieldMappings),
          "PostCompletionBudgetPlanner",
        ),
      ) +
      parseFloat(
        calculateSectionTotal(
          postValues,
          Object.keys(priorityDebtFieldMappings),
          "PostCompletionBudgetPlanner",
        ),
      ) +
      parseFloat(
        calculateSectionTotal(
          postValues,
          Object.keys(unsecuredBorrowingFieldMappings),
          "PostCompletionBudgetPlanner",
        ),
      );
    if (!isNaN(postTotal)) {
      updateField("post_sub_total", {
        total_debt_repayment: Number(postTotal.toFixed(2)),
      });
    }
  }, [postValues, updateField]);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    if (errors[name.replace(/\./g, "_")])
      return errors[name.replace(/\./g, "_")];
    const leaf = (name.split(".").pop() || name).replace(/\s|\//g, "");
    if (errors[leaf]) return errors[leaf];
    return undefined;
  };

  const renderForm = (
    prefix: string,
    fields: string[],
    mappings: Record<string, string>,
  ) => (
    <Form>
      {fields.map((field) => {
        const fieldName = `${prefix}.${field}`;
        const reduxFieldName = mappings[field];
        return (
          <FormGroup row key={field} className="mb-2">
            <Label
              for={`${prefix}_${reduxFieldName}`}
              sm={6}
              style={{ fontSize: "0.9rem" }}
            >
              {field}
            </Label>
            <Col sm={6}>
              <InputGroup>
                <InputGroupText>£</InputGroupText>
                <Input
                  type="number"
                  name={fieldName}
                  id={`${prefix}_${reduxFieldName}`}
                  className="numeric-decimal debt-repayment"
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
              {getFieldError(fieldName) && (
                <><h6>Error</h6><div className="text-danger small mt-1">
                  {getFieldError(fieldName)}
                </div></>
              )}
            </Col>
          </FormGroup>
        );
      })}
    </Form>
  );

  const calculateSectionTotal = (
    values: Record<string, string>,
    fields: string[],
    prefix: string,
  ) => {
    return fields
      .reduce((sum, field) => {
        const fieldName = `${prefix}.${field}`;
        return sum + (parseFloat(values[fieldName]) || 0);
      }, 0)
      .toFixed(2);
  };

  const calculateOverallTotal = (
    values: Record<string, string>,
    prefix: string,
  ) => {
    const debtTotal = calculateSectionTotal(
      values,
      Object.keys(debtRepaymentFieldMappings),
      prefix,
    );
    const priorityTotal = calculateSectionTotal(
      values,
      Object.keys(priorityDebtFieldMappings),
      prefix,
    );
    const unsecuredTotal = calculateSectionTotal(
      values,
      Object.keys(unsecuredBorrowingFieldMappings),
      prefix,
    );
    return (
      parseFloat(debtTotal) +
      parseFloat(priorityTotal) +
      parseFloat(unsecuredTotal)
    ).toFixed(2);
  };

  const handleCopyFromCurrent = (prefix: string) => {
    const newPostValues: Record<string, string> = {};
    Object.keys(currentValues).forEach((key) => {
      if (key.startsWith("CurrentBudgetPlanner")) {
        const newKey = key.replace("CurrentBudgetPlanner", prefix);
        newPostValues[newKey] = currentValues[key];
      }
    });
    setPostValues((prev) => ({ ...prev, ...newPostValues }));
  };

  const renderSection = (
    title: string,
    prefix: string,
    fields: string[],
    mappings: Record<string, string>,
    hasCalculate?: boolean,
    showCopyButton?: boolean,
  ) => (
    <div className="col-md-6">
      <h4 className="text-center mb-3">
        {title === "Total Debt Repayment" ? "" : title}
      </h4>
      <div
        className={`panel-default panel panel-primary border rounded-3 shadow-sm ${
          title === "Total Debt Repayment" ? "no-padding-vr no-border" : ""
        }`}
      >
        <div
          className={`bg-light border-bottom p-3 ${
            showCopyButton
              ? "d-flex justify-content-between align-items-center"
              : ""
          }`}
        >
          {title !== "Total Debt Repayment" && (
            <span className="fw-bold text-primary">
              {title === "Debt Repayments"
                ? "Debt Repayments"
                : title === "Priority Debt"
                  ? "Priority Debt"
                  : "Unsecured Borrowing"}
            </span>
          )}
          {showCopyButton && (
            <Button
              color="primary"
              size="sm"
              onClick={() => handleCopyFromCurrent(prefix)}
            >
              Copy from Current
            </Button>
          )}
        </div>
        <div className="p-3">
          {title === "Total Debt Repayment" ? (
            <FormGroup row className="mb-2">
              <Label
                for={`${prefix}_TotalDebtRepayment`}
                sm={6}
                style={{ fontSize: "0.9rem" }}
              >
                Total Debt Repayment - Monthly
              </Label>
              <Col sm={6}>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    type="number"
                    name={`${prefix}.TotalDebtRepayment`}
                    id={`${prefix}_TotalDebtRepayment`}
                    className="numeric-decimal fw-bold"
                    readOnly
                    placeholder="0.00"
                    value={calculateOverallTotal(
                      prefix === "CurrentBudgetPlanner"
                        ? currentValues
                        : postValues,
                      prefix,
                    )}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
          ) : (
            renderForm(prefix, fields, mappings)
          )}
        </div>
        {hasCalculate && (
          <div className="p-3 bg-light border-top">
            <FormGroup row className="mb-0">
              <Label
                className="control-label fw-bold text-primary"
                for={`${prefix}_TotalDebt`}
                sm={6}
                style={{ fontSize: "0.9rem" }}
              >
                Total {title}
              </Label>
              <Col sm={6}>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    type="number"
                    name={`${prefix}.TotalDebt`}
                    id={`${prefix}_TotalDebt`}
                    className="numeric-decimal fw-bold"
                    readOnly
                    placeholder="0.00"
                    value={calculateSectionTotal(
                      prefix === "CurrentBudgetPlanner"
                        ? currentValues
                        : postValues,
                      fields,
                      prefix,
                    )}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {isLoading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading debt repayment data...
            </span>
          </div>
          <p className="mt-3 text-muted">Loading debt repayment data...</p>
        </div>
      ) : (
        <>
          <p className="fs-9">
            <small>
              Add debt repayments like credit card minimum payments here. Do not
              include regular credit card spending - that goes in living costs.
            </small>
          </p>
          <Row>
            {renderSection(
              "Current",
              "CurrentBudgetPlanner",
              Object.keys(debtRepaymentFieldMappings),
              debtRepaymentFieldMappings,
              true,
            )}
            {renderSection(
              "Post Completion",
              "PostCompletionBudgetPlanner",
              Object.keys(debtRepaymentFieldMappings),
              debtRepaymentFieldMappings,
              true,
              true,
            )}
          </Row>
          <Row className="mt-4">
            {renderSection(
              "Priority Debt",
              "CurrentBudgetPlanner",
              Object.keys(priorityDebtFieldMappings),
              priorityDebtFieldMappings,
            )}
            {renderSection(
              "Priority Debt",
              "PostCompletionBudgetPlanner",
              Object.keys(priorityDebtFieldMappings),
              priorityDebtFieldMappings,
              false,
              true,
            )}
          </Row>
          <Row className="mt-4">
            {renderSection(
              "Unsecured Borrowing",
              "CurrentBudgetPlanner",
              Object.keys(unsecuredBorrowingFieldMappings),
              unsecuredBorrowingFieldMappings,
              true,
            )}
            {renderSection(
              "Unsecured Borrowing",
              "PostCompletionBudgetPlanner",
              Object.keys(unsecuredBorrowingFieldMappings),
              unsecuredBorrowingFieldMappings,
              true,
              true,
            )}
          </Row>
          <Row className="mt-4">
            {renderSection(
              "Total Debt Repayment",
              "CurrentBudgetPlanner",
              [],
              {},
            )}
            {renderSection(
              "Total Debt Repayment",
              "PostCompletionBudgetPlanner",
              [],
              {},
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default DebtRepaymentTabContent;
