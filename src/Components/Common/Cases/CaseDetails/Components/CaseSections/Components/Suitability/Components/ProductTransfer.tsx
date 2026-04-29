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

const productTransferOptions: { value: string; label: string }[] = [
  {
    value: "MORE_COST_EFFECTIVE",
    label: "this was more cost effective than the cheapest remortgage deal available.",
  },
  {
    value: "TIME_RESTRAINTS",
    label: "time restraints meant that a remortgage may not complete in time for the end of your current product, and you did not want to roll onto the standard variable rate.",
  },
  {
    value: "SIMPLER_PROCESS",
    label: "it was your preference to go through a simpler application process and not have to complete steps such as a lender remortgage questionnaire and the legal work involved in transferring the mortgage to a new lender.",
  },
];

interface ProductTransferProps {
  caseData: any;
  suitability: any;
  formValues: SuitabilityData;
  onFormChange: (updates: Partial<SuitabilityData>) => void;
}

const ProductTransfer: React.FC<ProductTransferProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;
  const lender = s?.loan_details?.lender ?? "";

  // ── UI only ──
  const [isProductTransferOptionOpen, setIsProductTransferOptionOpen] = useState(false);

  // ── Derived from formValues ──
  const selectedProductTransferOption =
    productTransferOptions.find((o) => o.value === formValues.product_transfer_reason) ?? null;

  return (
    <>
      <SectionHeading>Product Transfer</SectionHeading>

      <p>
        Your current mortgage deal with{" "}
        <strong style={{ color: blue }}>{lender}</strong> expires / expired on{" "}
        <strong style={{ color: blue }}>
          {caseData?.current_deal_end_date ?? "01/01/0001"}
        </strong>
        . As there are no penalties for changing this mortgage product beyond
        this date, it allows us to review your options.
      </p>

      <p className="fw-bold mb-1">These options included:</p>
      <ul className="mb-3" style={{ listStyle: "none", paddingLeft: "1rem" }}>
        <li>
          <span className="me-2">•</span>
          Staying on standard variable rate (SVR){" "}
          <strong style={{ color: blue }}>
            {caseData?.svr_rate ?? "X.XX%"}
          </strong>
        </li>
        <li>
          <span className="me-2">•</span>
          Moving to another deal from the lender&rsquo;s product range &mdash;
          known as a product transfer
        </li>
        <li>
          <span className="me-2">•</span>
          Moving your mortgage to a new lender &mdash; known as a remortgage
        </li>
      </ul>

      <p>
        Having reviewed your circumstances and discussed your needs, I then
        compared the available products, and I recommend a product transfer
        because{" "}
        <Dropdown
          isOpen={isProductTransferOptionOpen}
          toggle={() => setIsProductTransferOptionOpen((prev) => !prev)}
          className="d-inline"
          style={{ display: "inline" }}
        >
          <DropdownToggle
            tag="span"
            style={{
              color: "#6a1b9a",
              cursor: "pointer",
              textDecoration: "underline dotted",
            }}
          >
            {selectedProductTransferOption
              ? selectedProductTransferOption.label
              : "select reason..."}
          </DropdownToggle>
          <DropdownMenu
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "400px",
            }}
          >
            {productTransferOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => onFormChange({ product_transfer_reason: option.value })}
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </p>

      <AdvisorNote>
        (If there are client-specific reasons as to why they wanted a simpler
        process, e.g. busy work life, family commitments etc., please include
        details here to make the suitability letter as personalised as
        possible.)
      </AdvisorNote>
    </>
  );
};

export default ProductTransfer;