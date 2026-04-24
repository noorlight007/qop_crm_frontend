import { notRecommendedOptions } from "@/Data/Cases/SuitabilityData";
import { SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
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



interface PortingMortgageIncreaseProps {
  caseData: any;
  suitability: any;
  formValues: SuitabilityData;
  onFormChange: (updates: Partial<SuitabilityData>) => void;
}

const PortingMortgageIncrease: React.FC<PortingMortgageIncreaseProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  // ── UI only ──
  const [isNotRecommendedOptionOpen, setIsNotRecommendedOptionOpen] = useState(false);

  // ── Derived from formValues ──
  const selectedNotRecommendedOption =
    notRecommendedOptions.find((o) => o.value === formValues.new_lender_not_recommended_reason) ?? null;

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
        <strong style={{ color: blue }}>
          {caseData?.porting_erc
            ? `£${Number(caseData.porting_erc).toLocaleString("en-GB")}`
            : "£0,000"}
        </strong>{" "}
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
                onClick={() => onFormChange({ new_lender_not_recommended_reason: option.value })}
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
        <strong style={{ color: blue }}>
          {caseData?.porting_existing_product_end_date ?? "01/01/0001"}
        </strong>
        , and the end date of your new product is{" "}
        <strong style={{ color: blue }}>
          {caseData?.porting_new_product_end_date ?? "01/01/0001"}
        </strong>
        .
      </p>
    </>
  );
};

export default PortingMortgageIncrease;