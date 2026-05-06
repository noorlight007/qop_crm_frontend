import { notRecommendedOptions } from "@/Data/Cases/SuitabilityData";
import { PortingMortgageIncreaseProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
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

const PortingMortgageIncrease: React.FC<PortingMortgageIncreaseProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";

  // ── Dropdown UI ──
  const [isNotRecommendedOptionOpen, setIsNotRecommendedOptionOpen] =
    useState(false);

  // ── Editing states ──
  const [isRepaymentChargeEditing, setIsRepaymentChargeEditing] =
    useState(false);
  const [repaymentChargeDraft, setRepaymentChargeDraft] = useState<string>("");

  const [isExistingEndDateEditing, setIsExistingEndDateEditing] =
    useState(false);
  const [existingEndDateDraft, setExistingEndDateDraft] = useState<string>("");

  const [isNewEndDateEditing, setIsNewEndDateEditing] = useState(false);
  const [newEndDateDraft, setNewEndDateDraft] = useState<string>("");

  // ── Dropdown derived ──
  const selectedNotRecommendedOption =
    notRecommendedOptions.find(
      (o) => o.value === formValues.new_lender_not_recommended_reason,
    ) ?? null;

  // ── Repayment Charge handlers ──
  const startRepaymentChargeEdit = () => {
    setRepaymentChargeDraft(formValues.repayment_charge ?? "");
    setIsRepaymentChargeEditing(true);
  };
  const handleRepaymentChargeSave = () => {
    onFormChange({ repayment_charge: repaymentChargeDraft });
    setIsRepaymentChargeEditing(false);
  };
  const handleRepaymentChargeCancel = () => {
    setIsRepaymentChargeEditing(false);
  };

  // ── Existing End Date handlers ──
  const startExistingEndDateEdit = () => {
    setExistingEndDateDraft(formValues.the_end_date_of_existing_product ?? "");
    setIsExistingEndDateEditing(true);
  };
  const handleExistingEndDateSave = () => {
    onFormChange({ the_end_date_of_existing_product: existingEndDateDraft });
    setIsExistingEndDateEditing(false);
  };
  const handleExistingEndDateCancel = () => {
    setIsExistingEndDateEditing(false);
  };

  // ── New End Date handlers ──
  const startNewEndDateEdit = () => {
    setNewEndDateDraft(formValues.the_end_date_of_new_product ?? "");
    setIsNewEndDateEditing(true);
  };
  const handleNewEndDateSave = () => {
    onFormChange({ the_end_date_of_new_product: newEndDateDraft });
    setIsNewEndDateEditing(false);
  };
  const handleNewEndDateCancel = () => {
    setIsNewEndDateEditing(false);
  };

  // ── Shared inline edit renderer ──
  const renderInlineEdit = ({
    isEditing,
    draft,
    setDraft,
    onSave,
    onCancel,
    onStart,
    value,
    inputType = "text",
    placeholder,
    emptyLabel,
    prefix,
  }: {
    isEditing: boolean;
    draft: string;
    setDraft: (v: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onStart: () => void;
    value?: string;
    inputType?: "text" | "number" | "date" | "email" | "password";
    placeholder?: string;
    emptyLabel: string;
    prefix?: string;
  }) => {
    if (isEditing) {
      return (
        <span className="d-inline-flex align-items-center gap-1 flex-wrap">
          {prefix && <strong style={{ color: blue }}>{prefix}</strong>}
          <Input
            type={inputType as any}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            autoFocus
            bsSize="sm"
            style={{
              width: inputType === "date" ? "155px" : "100px",
              display: "inline-block",
            }}
          />
          <Button
            color="light"
            className="text-dark"
            size="sm"
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            color="light"
            className="text-dark"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </span>
      );
    }

    return (
      <span
        style={{ cursor: "pointer" }}
        className={value ? "fw-bold text-success" : "text-success"}
        onClick={onStart}
        title="Click to edit"
      >
        {value ? `${prefix ?? ""}${value}` : emptyLabel}
      </span>
    );
  };

  return (
    <>
      <SectionHeading>Porting</SectionHeading>

      <p>
        You are moving home and need to increase the size of your mortgage. To
        find the most suitable option based on your needs and circumstances, we
        considered several ways in which you could obtain the additional funds.
      </p>

      <p>
        One of the features of your existing mortgage is that you can
        &lsquo;port&rsquo; it to a different property. Porting means you keep
        your current mortgage product, and it is transferred to your new home.
      </p>

      <p className="fw-bold mb-1">
        The other options we considered were as follows:
      </p>

      <p>
        We assessed whether using a new lender would have been more
        cost-effective. However, this would have incurred an early repayment
        charge of{" "}
        {renderInlineEdit({
          isEditing: isRepaymentChargeEditing,
          draft: repaymentChargeDraft,
          setDraft: setRepaymentChargeDraft,
          onSave: handleRepaymentChargeSave,
          onCancel: handleRepaymentChargeCancel,
          onStart: startRepaymentChargeEdit,
          value: (formValues.repayment_charge ?? undefined) as
            | string
            | undefined,
          inputType: "number",
          placeholder: "e.g. 5000",
          emptyLabel: "＋ add repayment charge",
          prefix: "£",
        })}{" "}
        with your current lender.
      </p>

      <p>
        This course of action was not recommended because{" "}
        <Dropdown
          isOpen={isNotRecommendedOptionOpen}
          toggle={() => setIsNotRecommendedOptionOpen((prev) => !prev)}
          className="d-inline"
          style={{ display: "inline" }}
        >
          <DropdownToggle
            tag="span"
            style={{
              color: "#6a1b9a",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {selectedNotRecommendedOption
              ? selectedNotRecommendedOption.label
              : "select reason..."}
          </DropdownToggle>
          <DropdownMenu
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "400px",
            }}
          >
            {notRecommendedOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  onFormChange({
                    new_lender_not_recommended_reason: option.value,
                  })
                }
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </p>

      <p className="mt-3">
        We also considered arranging a second charge mortgage. However, this was
        not required, as we were able to complete the mortgage on a first charge
        basis with your existing lender.
      </p>

      <AdvisorNote>
        (Please expand and include any additional considerations throughout the
        process that helped you come to the recommendation of porting)
      </AdvisorNote>

      <p>This meant that porting was the most suitable option.</p>

      <p>
        Please bear in mind that the additional funds you require will be on a
        separate product to your existing mortgage, as detailed in the porting
        illustration provided.
      </p>

      <p>
        The end date of your existing product being transferred is{" "}
        {renderInlineEdit({
          isEditing: isExistingEndDateEditing,
          draft: existingEndDateDraft,
          setDraft: setExistingEndDateDraft,
          onSave: handleExistingEndDateSave,
          onCancel: handleExistingEndDateCancel,
          onStart: startExistingEndDateEdit,
          value: (formValues.the_end_date_of_existing_product ?? undefined) as
            | string
            | undefined,
          inputType: "date",
          emptyLabel: "＋ add existing product end date",
        })}
        , and the end date of your new product is{" "}
        {renderInlineEdit({
          isEditing: isNewEndDateEditing,
          draft: newEndDateDraft,
          setDraft: setNewEndDateDraft,
          onSave: handleNewEndDateSave,
          onCancel: handleNewEndDateCancel,
          onStart: startNewEndDateEdit,
          value: (formValues.the_end_date_of_new_product ?? undefined) as
            | string
            | undefined,
          inputType: "date",
          emptyLabel: "＋ add new product end date",
        })}
        .
      </p>
    </>
  );
};

export default PortingMortgageIncrease;
