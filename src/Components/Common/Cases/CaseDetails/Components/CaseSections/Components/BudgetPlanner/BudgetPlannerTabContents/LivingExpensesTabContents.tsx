import { useGetCaseBudgetPlannerQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";
import { LivingExpensesTabContentsProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/BudgetPlannerTypes";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
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

const LivingExpensesTabContents: FC<LivingExpensesTabContentsProps> = ({
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
    current_living_cost: {},
    post_living_cost: {},
    current_insurance: {},
    post_insurance: {},
  };

  const [visibleNotes, setVisibleNotes] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [currentValues, setCurrentValues] = useState<Record<string, string>>(
    {},
  );
  const [postValues, setPostValues] = useState<Record<string, string>>({});

  const getFieldError = (name: string) => {
    const errs = (errors as Record<string, string>) || {};
    if (!errs) return undefined;
    if (errs[name]) return errs[name];
    if (errs[name.replace(/\./g, "_")]) return errs[name.replace(/\./g, "_")];
    const leaf = (name.split(".").pop() || name).replace(/\s|\//g, "");
    if (errs[leaf]) return errs[leaf];
    return undefined;
  };

  const livingCostFieldMappings = {
    Electricity: "electricity",
    Gas: "gas",
    Water: "water",
    "Landline/Mobile Phones": "landline_mobile_phone",
    "TV Licence": "tv_license",
    "Council Tax": "council_tax",
    "Ground Rent & Service Charges": "ground_rent_service_charges",
    "Buildings & Contents": "buildings_contents",
    "Mortgage Payment Protection": "mortgage_payment_protection",
    Endowment: "endowment",
    "Pension Contribution": "pension_contribution",
    Childcare: "childcare",
    Maintenance: "maintenance",
    Food: "food",
    "Car Maintenance": "car_maintenance",
    Fuel: "fuel",
    "Public Transport": "public_transport",
    "TV Broadband": "tv_broadband",
    "Recreation/Holidays": "recreation_holidays",
    Clothing: "clothing",
    "Medical Expenses": "medical_expenses",
    Education: "education",
    "Other Living Costs": "other_living_costs",
  };

  const insuranceFieldMappings = {
    "Motor Insurance": "motor_insurance",
    "Health Insurance": "health_insurance",
    "Payment Protection": "payment_protection",
    "Life Insurance": "life_insurance",
    "Dental Insurance": "dental_insurance",
    "Other Insurance": "other_insurance",
    "Buildings Insurance": "buildings_insurance",
    "Contents Insurance": "contents_insurance",
    "Buildings & Contents Insurance": "building_content_insurance",
    "Total Insurance Expenses": "total_insurance_expenses",
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
      // console.log("Forcing API refetch for living expenses, case:", casealias);
      refetch();
    }
  }, [casealias, refetch]);

  // Initialize local state with direct API data
  useEffect(() => {
    if (
      !budgetPlannerData?.current_living_cost ||
      !budgetPlannerData?.post_living_cost
    ) {
      // console.log("❌ No living expenses data available for initialization");
      return;
    }

    // console.log("🔄 Initializing living expenses state with API data...");

    const initialCurrentValues: Record<string, string> = {};
    const initialPostValues: Record<string, string> = {};

    // Current Living Costs
    Object.entries(livingCostFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.current_living_cost?.[
          key as keyof typeof budgetPlannerData.current_living_cost
        ] ?? 0;
      initialCurrentValues[
        `CurrentBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      ] = value !== 0 ? String(value) : "";

      // console.log(
      //   `Current Living ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialCurrentValues[
      //     `CurrentBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      //   ],
      // );
    });

    // Post Living Costs
    Object.entries(livingCostFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.post_living_cost?.[
          key as keyof typeof budgetPlannerData.post_living_cost
        ] ?? 0;
      initialPostValues[
        `PostCompletionBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      ] = value !== 0 ? String(value) : "";

      // console.log(
      //   `Post Living ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialPostValues[
      //     `PostCompletionBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      //   ],
      // );
    });

    // Current Insurance
    Object.entries(insuranceFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.current_insurance?.[
          key as keyof typeof budgetPlannerData.current_insurance
        ] ?? 0;
      initialCurrentValues[
        `CurrentBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      ] = value !== 0 ? String(value) : "";

      // console.log(
      //   `Current Insurance ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialCurrentValues[
      //     `CurrentBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      //   ],
      // );
    });

    // Post Insurance
    Object.entries(insuranceFieldMappings).forEach(([field, key]) => {
      const value =
        budgetPlannerData?.post_insurance?.[
          key as keyof typeof budgetPlannerData.post_insurance
        ] ?? 0;
      initialPostValues[
        `PostCompletionBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      ] = value !== 0 ? String(value) : "";

      // console.log(
      //   `Post Insurance ${field} (${key}):`,
      //   value,
      //   "->",
      //   initialPostValues[
      //     `PostCompletionBudgetPlanner.${field.replace(/[\s/&]/g, "")}`
      //   ],
      // );
    });

    // console.log("📝 Setting living expenses state...");
    // console.log("Initial current values:", initialCurrentValues);
    // console.log("Initial post values:", initialPostValues);

    setCurrentValues(initialCurrentValues);
    setPostValues(initialPostValues);

    // console.log("✅ Living expenses state setting completed");
  }, [budgetPlannerData]);

  // Update parent modal with current values
  useEffect(() => {
    const formatValues = (
      values: Record<string, string>,
      mappings: Record<string, string>,
      section: string,
    ) => {
      const formatted = Object.entries(values)
        .filter(
          ([key]) =>
            key.startsWith("CurrentBudgetPlanner") && !key.includes("_Notes"),
        )
        .reduce(
          (acc, [key, value]) => {
            const fieldName = key.split(".")[1];
            // fieldName is a sanitized id (spaces/& removed). Find the API key by matching sanitized label.
            const reduxFieldName = Object.entries(mappings).find(
              ([label]) => label.replace(/[\s/&]/g, "") === fieldName,
            )?.[1] as string | undefined;
            if (reduxFieldName) {
              acc[reduxFieldName] = value === "" ? 0 : parseFloat(value);
            }
            return acc;
          },
          {} as Record<string, number | 0>,
        );
      formatted.total_living_expenses =
        parseFloat(
          calculateTotal(values, Object.keys(mappings), "CurrentBudgetPlanner"),
        ) || 0;
      updateField(section, formatted);
    };

    formatValues(currentValues, livingCostFieldMappings, "current_living_cost");
    formatValues(currentValues, insuranceFieldMappings, "current_insurance");
  }, [currentValues, updateField]);

  // Update parent modal with post values
  useEffect(() => {
    const formatValues = (
      values: Record<string, string>,
      mappings: Record<string, string>,
      section: string,
    ) => {
      const formatted = Object.entries(values)
        .filter(
          ([key]) =>
            key.startsWith("PostCompletionBudgetPlanner") &&
            !key.includes("_Notes"),
        )
        .reduce(
          (acc, [key, value]) => {
            const fieldName = key.split(".")[1];
            // fieldName is a sanitized id (spaces/& removed). Find the API key by matching sanitized label.
            const reduxFieldName = Object.entries(mappings).find(
              ([label]) => label.replace(/[\s/&]/g, "") === fieldName,
            )?.[1] as string | undefined;
            if (reduxFieldName) {
              acc[reduxFieldName] = value === "" ? 0 : parseFloat(value);
            }
            return acc;
          },
          {} as Record<string, number | 0>,
        );
      formatted.total_living_expenses =
        parseFloat(
          calculateTotal(
            values,
            Object.keys(mappings),
            "PostCompletionBudgetPlanner",
          ),
        ) || 0;
      updateField(section, formatted);
    };

    formatValues(postValues, livingCostFieldMappings, "post_living_cost");
    formatValues(postValues, insuranceFieldMappings, "post_insurance");
  }, [postValues, updateField]);

  // Keep Monthly Sub-Total in sync for Living Expenses (Current + Post)
  useEffect(() => {
    if (Object.keys(currentValues).length === 0) return;

    const currentTotal =
      parseFloat(
        calculateTotal(
          currentValues,
          Object.keys(livingCostFieldMappings),
          "CurrentBudgetPlanner",
        ),
      ) +
      parseFloat(
        calculateTotal(
          currentValues,
          Object.keys(insuranceFieldMappings),
          "CurrentBudgetPlanner",
        ),
      );
    if (!isNaN(currentTotal)) {
      updateField("current_sub_total", {
        total_living_expenses: Number(currentTotal.toFixed(2)),
      });
    }
  }, [currentValues, updateField]);

  useEffect(() => {
    if (Object.keys(postValues).length === 0) return;

    const postTotal =
      parseFloat(
        calculateTotal(
          postValues,
          Object.keys(livingCostFieldMappings),
          "PostCompletionBudgetPlanner",
        ),
      ) +
      parseFloat(
        calculateTotal(
          postValues,
          Object.keys(insuranceFieldMappings),
          "PostCompletionBudgetPlanner",
        ),
      );
    if (!isNaN(postTotal)) {
      updateField("post_sub_total", {
        total_living_expenses: Number(postTotal.toFixed(2)),
      });
    }
  }, [postValues, updateField]);

  const toggleNotes = (event: React.MouseEvent, noteId: string) => {
    event.preventDefault();
    setVisibleNotes((prev) => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  const renderFields = (
    prefix: string,
    fields: string[],
    mappings: Record<string, string>,
  ) => (
    <Form>
      {fields.map((field) => {
        const id = field.replace(/[\s/&]/g, "");
        const fieldName = `${prefix}.${id}`;
        const reduxFieldName = mappings[field];
        return (
          <div key={id}>
            <FormGroup row className="mb-2">
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
                    className="numeric-decimal living-cost"
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
                  <InputGroupText
                    className="penNoteIcon_Holder"
                    onClick={(e) =>
                      toggleNotes(
                        e,
                        `${
                          prefix === "CurrentBudgetPlanner" ? "" : "Post_"
                        }${reduxFieldName}_Notes`,
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <FaEdit />
                  </InputGroupText>
                </InputGroup>{" "}
                {getFieldError(fieldName) && (
                  <div className="text-danger small mt-1">
                    {getFieldError(fieldName)}
                  </div>
                )}{" "}
              </Col>
            </FormGroup>
            <FormGroup
              className={`${reduxFieldName}_Notes_Holder mb-2`}
              style={{
                display: visibleNotes[
                  `${
                    prefix === "CurrentBudgetPlanner" ? "" : "Post_"
                  }${reduxFieldName}_Notes`
                ]
                  ? "block"
                  : "none",
              }}
            >
              <Label
                for={`${prefix}_${reduxFieldName}_Notes`}
                style={{ fontSize: "0.9rem" }}
              >
                Notes
              </Label>
              <Input
                type="textarea"
                name={`${prefix}.${reduxFieldName}_Notes`}
                id={`${prefix}_${reduxFieldName}_Notes`}
                className="textAreaRestrictions form-control"
                value={
                  prefix === "CurrentBudgetPlanner"
                    ? currentValues[`${prefix}.${reduxFieldName}_Notes`] || ""
                    : postValues[`${prefix}.${reduxFieldName}_Notes`] || ""
                }
                onChange={(e) => {
                  const newValues =
                    prefix === "CurrentBudgetPlanner"
                      ? {
                          ...currentValues,
                          [`${prefix}.${reduxFieldName}_Notes`]: e.target.value,
                        }
                      : {
                          ...postValues,
                          [`${prefix}.${reduxFieldName}_Notes`]: e.target.value,
                        };
                  prefix === "CurrentBudgetPlanner"
                    ? setCurrentValues(newValues)
                    : setPostValues(newValues);
                }}
              />
            </FormGroup>
          </div>
        );
      })}
    </Form>
  );

  const calculateTotal = (
    values: Record<string, string>,
    fields: string[],
    prefix: string,
  ) => {
    return fields
      .reduce((sum, field) => {
        const fieldName = `${prefix}.${field.replace(/[\s/&]/g, "")}`;
        return sum + (parseFloat(values[fieldName]) || 0);
      }, 0)
      .toFixed(2);
  };

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

  const renderSection = (
    title: string,
    prefix: string,
    fields?: string[],
    mappings?: Record<string, string>,
    isTotal?: boolean,
  ) => (
    <div className="col-md-6">
      {!isTotal && <h4 className="text-center mb-3">{title}</h4>}
      <div
        className={`border rounded-3 shadow-sm ${
          isTotal ? "no-padding-vr no-border" : ""
        }`}
      >
        {!isTotal && (
          <div
            className={`bg-light border-bottom p-3 ${
              title === "Post Completion"
                ? "d-flex justify-content-between align-items-center"
                : ""
            }`}
          >
            <span className="fw-bold text-primary">
              {fields && Object.keys(insuranceFieldMappings).includes(fields[0])
                ? "Insurances"
                : "Living Costs"}
            </span>
            {title === "Post Completion" && (
              <Button color="primary" size="sm" onClick={handleCopyFromCurrent}>
                Copy from Current
              </Button>
            )}
          </div>
        )}
        <div className={`p-3 ${isTotal ? "no-padding-vr no-border" : ""}`}>
          {isTotal ? (
            <FormGroup row className="mb-2">
              <Label
                for={`${prefix}_TotalHome`}
                sm={6}
                style={{ fontSize: "0.9rem" }}
              >
                Total Living Expenses
              </Label>
              <Col sm={6}>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    type="number"
                    name={`${prefix}.TotalHome`}
                    id={`${prefix}_TotalHome`}
                    className="numeric-decimal fw-bold"
                    readOnly
                    placeholder="0.00"
                    step="0.01"
                    value={
                      prefix === "CurrentBudgetPlanner"
                        ? (
                            parseFloat(
                              calculateTotal(
                                currentValues,
                                Object.keys(livingCostFieldMappings),
                                prefix,
                              ),
                            ) +
                            parseFloat(
                              calculateTotal(
                                currentValues,
                                Object.keys(insuranceFieldMappings),
                                prefix,
                              ),
                            )
                          ).toFixed(2)
                        : (
                            parseFloat(
                              calculateTotal(
                                postValues,
                                Object.keys(livingCostFieldMappings),
                                prefix,
                              ),
                            ) +
                            parseFloat(
                              calculateTotal(
                                postValues,
                                Object.keys(insuranceFieldMappings),
                                prefix,
                              ),
                            )
                          ).toFixed(2)
                    }
                  />
                  <InputGroupText
                    className="penNoteIcon_Holder"
                    onClick={(e) =>
                      toggleNotes(
                        e,
                        `${
                          prefix === "CurrentBudgetPlanner" ? "" : "Post_"
                        }TotalHome_Notes`,
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <FaEdit />
                  </InputGroupText>
                </InputGroup>
              </Col>
            </FormGroup>
          ) : (
            renderFields(prefix, fields!, mappings!)
          )}
          {isTotal && (
            <FormGroup
              className="TotalHome_Notes_Holder mb-2"
              style={{
                display: visibleNotes[
                  `${
                    prefix === "CurrentBudgetPlanner" ? "" : "Post_"
                  }TotalHome_Notes`
                ]
                  ? "block"
                  : "none",
              }}
            >
              <Label
                for={`${prefix}_TotalHome_Notes`}
                style={{ fontSize: "0.9rem" }}
              >
                Notes
              </Label>
              <Input
                type="textarea"
                name={`${prefix}.TotalHome_Notes`}
                id={`${prefix}_TotalHome_Notes`}
                className="textAreaRestrictions form-control"
                value={
                  prefix === "CurrentBudgetPlanner"
                    ? currentValues[`${prefix}.TotalHome_Notes`] || ""
                    : postValues[`${prefix}.TotalHome_Notes`] || ""
                }
                onChange={(e) => {
                  const newValues =
                    prefix === "CurrentBudgetPlanner"
                      ? {
                          ...currentValues,
                          [`${prefix}.TotalHome_Notes`]: e.target.value,
                        }
                      : {
                          ...postValues,
                          [`${prefix}.TotalHome_Notes`]: e.target.value,
                        };
                  prefix === "CurrentBudgetPlanner"
                    ? setCurrentValues(newValues)
                    : setPostValues(newValues);
                }}
              />
            </FormGroup>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {isLoading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading living expenses data...
            </span>
          </div>
          <p className="mt-3 text-muted">Loading living expenses data...</p>
        </div>
      ) : (
        <>
          <p>
            <small>
              Please enter all monthly living costs accurately. Convert
              non-monthly expenses: multiply weekly by 4.3, divide quarterly by
              3, annual by 12.
            </small>
          </p>
          <Row>
            {renderSection(
              "Current",
              "CurrentBudgetPlanner",
              Object.keys(livingCostFieldMappings),
              livingCostFieldMappings,
            )}
            {renderSection(
              "Post Completion",
              "PostCompletionBudgetPlanner",
              Object.keys(livingCostFieldMappings),
              livingCostFieldMappings,
            )}
          </Row>
          <Row className="mt-4">
            {renderSection(
              "Current",
              "CurrentBudgetPlanner",
              Object.keys(insuranceFieldMappings),
              insuranceFieldMappings,
            )}
            {renderSection(
              "Post Completion",
              "PostCompletionBudgetPlanner",
              Object.keys(insuranceFieldMappings),
              insuranceFieldMappings,
            )}
          </Row>
          <Row className="mt-4">
            {renderSection("", "CurrentBudgetPlanner", [], {}, true)}
            {renderSection("", "PostCompletionBudgetPlanner", [], {}, true)}
          </Row>
        </>
      )}
    </div>
  );
};

export default LivingExpensesTabContents;
