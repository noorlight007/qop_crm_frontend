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
  <h6 className="suitability-section-heading">
    {children}
  </h6>
);

interface ShortenedProductTransferProps {
  caseData: any;
  suitability: any;
}

const ShortenedProductTransfer: React.FC<ShortenedProductTransferProps> = ({
  caseData,
  suitability,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  const lender = caseData?.lender_name ?? "HSBC";

  const [selectedPTCostOption, setSelectedPTCostOption] = useState<
    number | null
  >(null);
  const [isPTCostOptionOpen, setIsPTCostOptionOpen] = useState(false);

  return (
    <>
      <SectionHeading>Shortened Product Transfer</SectionHeading>

      <p>
        Your current mortgage deal with{" "}
        <strong style={{ color: blue }}>{lender}</strong> expires / expired on{" "}
        <strong style={{ color: blue }}>
          {caseData?.current_deal_end_date ?? "01/01/0001"}
        </strong>
        . As there are no penalties for changing this mortgage product beyond
        this date, it allowed us to review your options.
      </p>

      <p className="fw-bold mb-1">These options were:</p>
      <ul className="mb-3">
        <li>
          Staying on standard variable rate (SVR) currently{" "}
          <strong style={{ color: blue }}>
            {caseData?.svr_rate ?? "X.XX%"}
          </strong>
        </li>
        <li>
          Moving to another deal from the lender&rsquo;s product range &mdash;
          known as a product transfer
        </li>
        <li>
          Moving your mortgage to a new lender &mdash; known as a remortgage
        </li>
      </ul>

      <p>It was your preference not to review remortgage options.</p>

      <AdvisorNote>
        (Please include any background about why the client preferred to proceed
        with a product transfer specifically, for example ease of process, speed
        of application etc.)
      </AdvisorNote>

      <p>
        You confirmed that since our last review of your mortgage there were no
        changes to your income or outgoings that would negatively affect your
        affordability, or other material changes to your circumstances.
      </p>

      <p>
        You also did not need to change any of the other details of the mortgage
        such as borrowing amount, mortgage term, repayment method etc.
      </p>

      <p>
        The product transfer recommended was{" "}
        <Dropdown
          isOpen={isPTCostOptionOpen}
          toggle={() => setIsPTCostOptionOpen((prev) => !prev)}
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
            {selectedPTCostOption === null && "select option..."}
            {selectedPTCostOption === 0 &&
              "the most cost-effective deal available, therefore there was no disadvantage to remaining with your current lender."}
            {selectedPTCostOption === 1 && (
              <>
                not the most cost-effective deal available, and will cost{" "}
                <strong style={{ color: blue }}>
                  {caseData?.pt_cost_difference
                    ? `£${Number(caseData.pt_cost_difference).toLocaleString("en-GB")}`
                    : "£0,000"}
                </strong>{" "}
                more during the initial product term. However, you were happy to
                forfeit this saving to proceed with a product transfer.
              </>
            )}
          </DropdownToggle>
          <DropdownMenu
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "400px",
            }}
          >
            <DropdownItem
              onClick={() => setSelectedPTCostOption(0)}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              the most cost-effective deal available, therefore there was no
              disadvantage to remaining with your current lender.
            </DropdownItem>
            <DropdownItem
              onClick={() => setSelectedPTCostOption(1)}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              not the most cost-effective deal available, and will cost{" "}
              <strong style={{ color: blue }}>
                {caseData?.pt_cost_difference
                  ? `£${Number(caseData.pt_cost_difference).toLocaleString("en-GB")}`
                  : "£0,000"}
              </strong>{" "}
              more during the initial product term. However, you were happy to
              forfeit this saving to proceed with a product transfer.
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </p>

      <p className="mt-3">
        You did not wish to leave the mortgage on standard variable rate as this
        was more expensive than completing a product transfer.
      </p>
    </>
  );
};

export default ShortenedProductTransfer;
