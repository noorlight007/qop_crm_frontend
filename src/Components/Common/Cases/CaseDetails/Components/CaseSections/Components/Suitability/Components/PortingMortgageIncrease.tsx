import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

/* ── Pink: advisor guidance note ── */
const AdvisorNote = ({ children }: { children: React.ReactNode }) => (
  <p
    className="fst-italic small mb-1 px-2 py-1 rounded"
    style={{
      background: "#fff0f3",
      color: "#b0004e",
      borderLeft: "3px solid #f48fb1",
    }}
  >
    {children}
  </p>
);

/* ── Purple: dropdown placeholder ── */
const PleaseSelect = ({ label }: { label?: string }) => (
  <span
    className="px-2 py-1 rounded small fst-italic d-inline-block"
    style={{
      background: "#f3e5f5",
      color: "#6a1b9a",
      border: "1px dashed #ab47bc",
    }}
  >
    {label ?? "Please Select"}
  </span>
);

/* ── Purple dropdown option list ── */
const DropdownOptions = ({
  label,
  options,
}: {
  label: string;
  options: React.ReactNode[];
}) => (
  <div className="mt-2 small" style={{ color: "#6a1b9a" }}>
    <p className="mb-1 fst-italic">{label}</p>
    <ol className="mb-0 ps-3">
      {options.map((opt, i) => (
        <li key={i}>{opt}</li>
      ))}
    </ol>
  </div>
);

/* ── Green: render a suitability answer line ── */
const SuitAnswer = ({ text }: { text?: string }) =>
  text ? (
    <p
      className="mb-1"
      style={{ color: "#2e7d32", whiteSpace: "pre-wrap", lineHeight: "1.7" }}
    >
      {text}
    </p>
  ) : null;

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3
    className="fw-bold px-3 py-2 mb-3"
    style={{ background: "#1a3c5e", color: "#fff", letterSpacing: "0.3px" }}
  >
    {children}
  </h3>
);

interface PortingMortgageIncreaseProps {
  caseData: any;
  suitability: any;
}

const PortingMortgageIncrease: React.FC<PortingMortgageIncreaseProps> = ({
  caseData,
  suitability,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  const [selectedNotRecommendedOption, setSelectedNotRecommendedOption] =
    useState<string | null>(null);
  const [isNotRecommendedOptionOpen, setIsNotRecommendedOptionOpen] =
    useState(false);

  const notRecommendedOptions = [
    "the interest rates currently available were higher than the rate on your existing mortgage product.",
    "the early repayment charge was greater than the savings you would have made from securing a lower rate with a new lender.",
  ];

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
            {selectedNotRecommendedOption ?? "select reason..."}
          </DropdownToggle>
          <DropdownMenu
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "400px",
            }}
          >
            {notRecommendedOptions.map((option, index) => (
              <DropdownItem
                key={index}
                onClick={() => setSelectedNotRecommendedOption(option)}
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option}
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

      {s?.porting?.additional_considerations ? (
        <div
          className="p-3 mb-3 rounded"
          style={{ background: "#f1f8e9", borderLeft: "4px solid #81c784" }}
        >
          <SuitAnswer text={s?.porting?.additional_considerations} />
        </div>
      ) : (
        <AdvisorNote>
          (Please expand and include any additional considerations throughout
          the process that helped you come to the recommendation of porting)
        </AdvisorNote>
      )}

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
