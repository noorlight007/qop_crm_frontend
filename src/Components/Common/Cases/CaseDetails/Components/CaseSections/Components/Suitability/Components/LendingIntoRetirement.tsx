import { pensionOptions } from "@/Data/Cases/SuitabilityData";
import { LendingIntoRetirementProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

/* ── Pink: advisor guidance note ── */
const AdvisorNote = ({ children }: { children: React.ReactNode }) => (
  <p className="suitability-advisor-note rounded">{children}</p>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6 className="suitability-section-heading">{children}</h6>
);

const LendingIntoRetirement: React.FC<LendingIntoRetirementProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  // ── UI only ──
  const [isPensionOptionOpen, setIsPensionOptionOpen] = useState(false);

  // ── Derived from formValues — re-hydrates on page load if data exists ──
  const selectedPensionOption =
    pensionOptions.find(
      (o) => o.value === formValues.lending_into_retirement_type,
    ) ?? null;

  const mortgageTerm = s?.loan_details?.mortgage_term ?? "";

  return (
    <>
      <SectionHeading>Lending into Retirement</SectionHeading>

      <p>
        We agreed that this mortgage should be taken out over{" "}
        <strong style={{ color: blue }}>{mortgageTerm}</strong>. This was to
        ensure your payments are within the budget you provided following our
        analysis of your income and expenditure and therefore are affordable to
        you.
      </p>

      <p>
        The consequence of this is that the mortgage term extends beyond your
        intended retirement age, which carries certain risks.
      </p>

      <p>
        It is not usually our recommendation to arrange a mortgage that goes
        into retirement. However, given the importance of ensuring that your
        monthly repayments are affordable now, you have confirmed that you are
        comfortable funding the payments in the later years using income
        intended for retirement purposes.
      </p>

      {/* Purple: pension statements toggle */}
      <div className="suitability-purple-box p-3 my-3 rounded">
        <p className="fw-semibold mb-2 small" style={{ color: "#6a1b9a" }}>
          Select one of the following two pension statement options:
        </p>

        <Dropdown
          isOpen={isPensionOptionOpen}
          toggle={() => setIsPensionOptionOpen((prev) => !prev)}
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
            {selectedPensionOption ? (
              selectedPensionOption.label
            ) : (
              <span className="text-muted fst-italic">
                Select pension statement option...
              </span>
            )}
          </DropdownToggle>
          <DropdownMenu
            className="w-100"
            style={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {pensionOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  onFormChange({ lending_into_retirement_type: option.value })
                }
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Show content based on selected option value */}
        {selectedPensionOption !== null && (
          <div className="mt-3 small" style={{ color: "#6a1b9a" }}>
            {selectedPensionOption.value === "PENSION_STATEMENTS_REQUIRED" && (
              <>
                <p className="fw-semibold mb-1">
                  Option 1 – Pension statements required by lender:
                </p>
                <p className="mb-0">
                  We have carried out an assessment of your potential retirement
                  income and, based on your existing retirement provision (and
                  your continued contributions), we have been able to
                  demonstrate your ability to afford repayments into retirement.
                </p>
              </>
            )}

            {selectedPensionOption.value ===
              "PENSION_STATEMENTS_NOT_REQUIRED" && (
              <>
                <p className="fw-semibold mb-1">
                  Option 2 – Pension statements not required by lender:
                </p>
                <p className="mb-0">
                  It was not a requirement of your lender to provide pension
                  statements, as you are more than{" "}
                  <span style={{ color: blue }}>x</span> years away from
                  retirement. Therefore, they were satisfied that you are making
                  pension contributions. It is important you continue to make
                  these contributions throughout the term of the mortgage and
                  review your pension projections regularly.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <p>
        We also encourage you to review the mortgage term in the future and
        reduce it if it becomes affordable for you to do so. We further
        recommend that you consider making overpayments on the mortgage (within
        any applicable overpayment allowance or for larger sums outside of any
        early repayment charge period) to reduce the overall cost of the
        mortgage, lower your payments in retirement, or bring the term back
        within your intended retirement age.
      </p>

      <AdvisorNote>
        (Please type up any information relevant to the client's individual
        needs, circumstances and why the term was recommended into retirement)
      </AdvisorNote>
    </>
  );
};

export default LendingIntoRetirement;
