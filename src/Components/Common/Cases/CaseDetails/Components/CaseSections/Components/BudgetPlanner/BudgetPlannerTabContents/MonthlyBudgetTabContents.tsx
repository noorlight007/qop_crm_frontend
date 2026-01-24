import { RootState } from "@/Redux/Store";
import { MonthlyBudgetTabContentsProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/BudgetPlannerTypes";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";

const MonthlyBudgetTabContents: FC<MonthlyBudgetTabContentsProps> = ({
  updateField,
}) => {
  const budgetPlannerData = useSelector(
    (state: RootState) => state.budgetPlanner,
  );
  const [currentValues, setCurrentValues] = useState<Record<string, string>>(
    {},
  );
  const [postValues, setPostValues] = useState<Record<string, string>>({});

  const subtotalFieldMappings = {
    TotalIncome: "total_income",
    TotalDebtRepayment: "total_debt_repayment",
    TotalHome: "total_living_expenses",
    AvailableIncome: "available_income",
  };

  // Initialize local state with Redux data (once)
  useEffect(() => {
    if (Object.keys(currentValues).length || Object.keys(postValues).length)
      return;

    const initialCurrentValues: Record<string, string> = {};
    const initialPostValues: Record<string, string> = {};

    // Current Sub Totals - Read from store totals first, fallback to empty
    Object.entries(subtotalFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.current_sub_total?.[
          key as keyof typeof budgetPlannerData.current_sub_total
        ] ?? 0;
      initialCurrentValues[`CurrentBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";
    });

    // Post Sub Totals - Read from store totals first, fallback to empty
    Object.entries(subtotalFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.post_sub_total?.[
          key as keyof typeof budgetPlannerData.post_sub_total
        ] ?? 0;
      initialPostValues[`PostCompletionBudgetPlanner.${field}`] =
        value !== 0 ? String(value) : "";
    });

    setCurrentValues((prev) => ({ ...prev, ...initialCurrentValues }));
    setPostValues((prev) => ({ ...prev, ...initialPostValues }));
  }, [budgetPlannerData]);

  // Update parent modal with current values (only Available Income; keep other totals from store)
  useEffect(() => {
    if (
      !budgetPlannerData ||
      !currentValues ||
      Object.keys(currentValues).length === 0
    )
      return;

    const computed =
      parseFloat(
        calculateAvailableIncome(currentValues, "CurrentBudgetPlanner"),
      ) || 0;
    const prev = budgetPlannerData?.current_sub_total?.available_income || 0;

    if (Math.abs(Number(prev) - computed) > 0.01) {
      // Only update if difference > 1 cent
      // Only update our own key to avoid clobbering other sub-total fields
      updateField("current_sub_total", { available_income: computed });
    }
  }, [
    currentValues,
    updateField,
    budgetPlannerData?.current_sub_total?.total_income,
    budgetPlannerData?.current_sub_total?.total_debt_repayment,
    budgetPlannerData?.current_sub_total?.total_living_expenses,
  ]);

  // Update parent modal with post values (only Available Income; keep other totals from store)
  useEffect(() => {
    if (
      !budgetPlannerData ||
      !postValues ||
      Object.keys(postValues).length === 0
    )
      return;

    const computed =
      parseFloat(
        calculateAvailableIncome(postValues, "PostCompletionBudgetPlanner"),
      ) || 0;
    const prev = budgetPlannerData?.post_sub_total?.available_income || 0;

    if (Math.abs(Number(prev) - computed) > 0.01) {
      // Only update if difference > 1 cent
      // Only update our own key to avoid clobbering other sub-total fields
      updateField("post_sub_total", { available_income: computed });
    }
  }, [
    postValues,
    updateField,
    budgetPlannerData?.post_sub_total?.total_income,
    budgetPlannerData?.post_sub_total?.total_debt_repayment,
    budgetPlannerData?.post_sub_total?.total_living_expenses,
  ]);

  const subtotalFields = [
    {
      label: "Total Income",
      id: "TotalIncome",
      inputId: "TotalIncomeSubTotal",
    },
    {
      label: "Total Debt Repayment - Monthly",
      id: "TotalDebtRepayment",
      inputId: "TotalDebtRepaymentSubTotal",
    },
    {
      label: "Total Living Expenses",
      id: "TotalHome",
      inputId: "TotalHomeSubTotal",
    },
  ];

  const availableIncomeField = {
    label: "Available Income",
    id: "AvailableIncome",
    inputId: "CurrentBudgetPlanner_AvailableIncome",
  };

  // Calculate Available Income using store values if local values are empty
  const calculateAvailableIncome = (
    values: Record<string, string>,
    prefix: string,
  ) => {
    const isPost = prefix.includes("PostCompletion");
    const storeData = isPost
      ? budgetPlannerData?.post_sub_total
      : budgetPlannerData?.current_sub_total;

    const totalIncome =
      parseFloat(values[`${prefix}.TotalIncome`]) ||
      storeData?.total_income ||
      0;
    const totalDebt =
      parseFloat(values[`${prefix}.TotalDebtRepayment`]) ||
      storeData?.total_debt_repayment ||
      0;
    const totalLiving =
      parseFloat(values[`${prefix}.TotalHome`]) ||
      storeData?.total_living_expenses ||
      0;

    return (totalIncome - totalDebt - totalLiving).toFixed(2);
  };

  const renderColumn = (
    title: string,
    prefix: string,
    // showCopyButton?: boolean
  ) => (
    <div className="col-md-6">
      <h4 className="text-center mb-3">{title}</h4>
      <div className="border rounded-3 shadow-sm">
        <div className={`bg-light border-bottom p-3`}>
          <span className="fw-bold text-primary">Sub-Totals</span>
        </div>
        <div className="p-3">
          {subtotalFields.map((field) => (
            <FormGroup row className="mb-2" key={field.id}>
              <Label
                style={{ fontSize: "0.9rem" }}
                for={`${prefix}_${field.id}`}
                sm={6}
                className="control-label"
              >
                {field.label}
                <span className="required" style={{ visibility: "hidden" }}>
                  *
                </span>
              </Label>
              <Col sm={6}>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    type="number"
                    name={`${prefix}.${field.id}`}
                    id={
                      prefix === "CurrentBudgetPlanner"
                        ? field.inputId
                        : `Post_${field.inputId}`
                    }
                    className="subtotal form-control fw-bold"
                    readOnly
                    value={
                      prefix === "CurrentBudgetPlanner"
                        ? currentValues[`${prefix}.${field.id}`] ||
                          budgetPlannerData?.current_sub_total?.[
                            subtotalFieldMappings[
                              field.id as keyof typeof subtotalFieldMappings
                            ] as keyof typeof budgetPlannerData.current_sub_total
                          ] ||
                          ""
                        : postValues[`${prefix}.${field.id}`] ||
                          budgetPlannerData?.post_sub_total?.[
                            subtotalFieldMappings[
                              field.id as keyof typeof subtotalFieldMappings
                            ] as keyof typeof budgetPlannerData.post_sub_total
                          ] ||
                          ""
                    }
                    onChange={(e) => {
                      const newValues =
                        prefix === "CurrentBudgetPlanner"
                          ? {
                              ...currentValues,
                              [`${prefix}.${field.id}`]: e.target.value,
                            }
                          : {
                              ...postValues,
                              [`${prefix}.${field.id}`]: e.target.value,
                            };
                      prefix === "CurrentBudgetPlanner"
                        ? setCurrentValues(newValues)
                        : setPostValues(newValues);
                    }}
                  />
                </InputGroup>
                <span
                  className="field-validation-valid"
                  data-valmsg-for={`${prefix}.${field.id}`}
                  data-valmsg-replace="true"
                ></span>
              </Col>
            </FormGroup>
          ))}
        </div>
        <div className="bg-light border-top p-3">
          <FormGroup row className="mb-0">
            <Label
              style={{ fontSize: "0.9rem" }}
              for={
                prefix === "CurrentBudgetPlanner"
                  ? availableIncomeField.inputId
                  : `PostCompletionBudgetPlanner_${availableIncomeField.id}`
              }
              sm={6}
              className="control-label text-primary"
            >
              {availableIncomeField.label}
            </Label>
            <Col sm={6}>
              <InputGroup>
                <InputGroupText>£</InputGroupText>
                <Input
                  type="number"
                  name={`${prefix}.${availableIncomeField.id}`}
                  id={
                    prefix === "CurrentBudgetPlanner"
                      ? availableIncomeField.inputId
                      : `PostCompletionBudgetPlanner_${availableIncomeField.id}`
                  }
                  className="availableIncome form-control fw-bold"
                  readOnly
                  placeholder="0.00"
                  value={
                    prefix === "CurrentBudgetPlanner"
                      ? calculateAvailableIncome(currentValues, prefix)
                      : calculateAvailableIncome(postValues, prefix)
                  }
                />
              </InputGroup>
              <span
                className="field-validation-valid"
                data-valmsg-for={`${prefix}.${availableIncomeField.id}`}
                data-valmsg-replace="true"
              ></span>
            </Col>
          </FormGroup>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <p>
        <small>
          A positive difference between Income and Outgoings is favorable, but
          verify all expenses are included. For negative differences, explore
          income maximization or expense reduction options.
        </small>
      </p>
      <section className="row mt-4">
        {renderColumn("Current", "CurrentBudgetPlanner")}
        {renderColumn("Post Completion", "PostCompletionBudgetPlanner")}
      </section>
    </div>
  );
};

export default MonthlyBudgetTabContents;
