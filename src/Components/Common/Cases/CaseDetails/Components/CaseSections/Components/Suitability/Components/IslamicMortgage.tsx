import { shariaDetailOptions } from "@/Data/Cases/SuitabilityData";
import { IslamicMortgageProps, SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
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





const IslamicMortgage: React.FC<IslamicMortgageProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;
  const lender = s?.loan_details?.lender ?? "";

  // ── UI-only states ──
  const [isShariaDetailOptionOpen, setIsShariaDetailOptionOpen] =
    useState(false);
  const [isOverpaymentOptionOpen, setIsOverpaymentOptionOpen] = useState(false);
  const [isLenderReasonEditing, setIsLenderReasonEditing] = useState(false);
  const [lenderReasonDraft, setLenderReasonDraft] = useState("");

  // ── Derived from formValues ──
  const selectedShariaOption =
    shariaDetailOptions.find(
      (o) => o.value === formValues.islamic_mortgages_purchase_plan,
    ) ?? null;
  const selectedOverpaymentOption = formValues.overpayment_type ?? null;

  // ── Textarea save/cancel handlers ──
  const startLenderReasonEdit = () => {
    setLenderReasonDraft(formValues.home_purchase_plan ?? "");
    setIsLenderReasonEditing(true);
  };
  const handleLenderReasonSave = () => {
    onFormChange({ home_purchase_plan: lenderReasonDraft });
    setIsLenderReasonEditing(false);
  };
  const handleLenderReasonCancel = () => {
    setLenderReasonDraft(formValues.home_purchase_plan ?? "");
    setIsLenderReasonEditing(false);
  };

  return (
    <>
      <SectionHeading>Islamic Mortgage</SectionHeading>

      <p>
        You need to raise the funds to purchase a property in such a way that is
        acceptable under Sharia Law. As such, you require a product which does
        not involve the payment of interest to the provider. I therefore
        recommend that you take out a Home Purchase Plan using the{" "}
        <span style={{ color: blue }}>
          {selectedShariaOption?.label ?? "selected method"}
        </span>
        .
      </p>

      {/* Purple: method selection block */}
      <div className="suitability-purple-box p-3 my-3 rounded">
        <p className="fw-semibold mb-2 small" style={{ color: "#6a1b9a" }}>
          Select one of the following three methods to include in the letter:
        </p>

        <Dropdown
          isOpen={isShariaDetailOptionOpen}
          toggle={() => setIsShariaDetailOptionOpen((prev) => !prev)}
        >
          <DropdownToggle
            color="light"
            className="text-start w-100 border"
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.4",
            }}
            caret
          >
            {selectedShariaOption ? (
              selectedShariaOption.label
            ) : (
              <span className="text-muted fst-italic">Select method...</span>
            )}
          </DropdownToggle>
          <DropdownMenu
            className="w-100"
            style={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {shariaDetailOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  onFormChange({
                    islamic_mortgages_purchase_plan: option.value,
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

        {selectedShariaOption !== null && (
          <div className="mt-3 small" style={{ color: "#6a1b9a" }}>
            {selectedShariaOption.value === "IJARA" && (
              <>
                <p className="fw-semibold mb-1">Option 1 – Ijara:</p>
                <p className="mb-0">
                  The Ijara method is a long-term sale and leaseback
                  arrangement. The provider buys the property, becomes the legal
                  owner and enters into a lease agreement with you. This gives
                  you the right to rent the property for the full term of the
                  plan. During this period, you make regular payments to the
                  provider consisting partly of the rental payment and partly
                  towards the purchase of the property. At the end of the term,
                  when all payments have been made, the legal ownership of the
                  property is transferred to you.
                </p>
              </>
            )}
            {selectedShariaOption.value === "MUSHARAKA" && (
              <>
                <p className="fw-semibold mb-1">Option 2 – Musharaka:</p>
                <p className="mb-0">
                  The Musharaka method is a co-ownership agreement; you fund the
                  initial deposit and the provider purchases the remainder of
                  the property. You make monthly payments to the provider which
                  consists of part rent and part capital repayment, meaning that
                  your stake in the property increases over time. As your stake
                  grows the provider&rsquo;s stake shrinks, which reduces the
                  amount of rent you then have to pay for use of the
                  provider&rsquo;s share of the property. At the end of the
                  term, when all payments have been made, full legal ownership
                  of the property is transferred to you.
                </p>
              </>
            )}
            {selectedShariaOption.value === "MURABAHA" && (
              <>
                <p className="fw-semibold mb-1">Option 3 – Murabaha:</p>
                <p className="mb-0">
                  Under the Murabaha method, the provider buys the property and
                  immediately sells it to you for a higher price (original cost
                  plus an agreed profit level). You pay this higher price on a
                  deferred basis by making regular payments to the provider in
                  line with a fixed repayment schedule. <br /> <br />A feature of this plan
                  means that if you are in a position to contribute additional
                  funds you can do so without penalty at anytime or you do not
                  exceed the total Home Purchase Plan amount during any annual
                  period.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Lender reason ── */}
      <p className="mt-3">
        I researched all Home Purchase Plan providers and products, with the
        exception of those that are only available to you direct, and I
        recommend <strong style={{ color: blue }}>{lender}</strong> for the
        following reasons:
      </p>

      {isLenderReasonEditing ? (
        <div className="w-100">
          <Input
            type="textarea"
            rows={5}
            value={lenderReasonDraft}
            onChange={(e) => setLenderReasonDraft(e.target.value)}
            placeholder="Enter your reason..."
            autoFocus
            className="w-100 p-1"
          />
          <div className="d-flex gap-2 mt-2">
            <Button
              color="light"
              className="text-dark"
              size="sm"
              onClick={handleLenderReasonSave}
            >
              Save
            </Button>
            <Button
              color="light"
              className="text-dark"
              size="sm"
              onClick={handleLenderReasonCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <span
          className="d-block text-success"
          style={{
            cursor: "pointer",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          onClick={startLenderReasonEdit}
          title="Click to edit"
        >
          {formValues.home_purchase_plan || "click to add reason..."}
        </span>
      )}

      <div className="mt-3">
        <AdvisorNote>
          (Explain why this provider and product was the best Home Purchase Plan
          for the client based on their individual needs and circumstances)
        </AdvisorNote>
      </div>
    </>
  );
};

export default IslamicMortgage;
