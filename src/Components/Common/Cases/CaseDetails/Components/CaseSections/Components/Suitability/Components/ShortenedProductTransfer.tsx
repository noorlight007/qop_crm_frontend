import React from "react";

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
  <h6
    className="fw-bold px-3 py-2 mb-3"
    style={{ background: "#1a3c5e", color: "#fff", letterSpacing: "0.3px" }}
  >
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

      {s?.product_transfer?.preference_reason ? (
        <div
          className="p-3 mb-3 rounded"
          style={{ background: "#f1f8e9", borderLeft: "4px solid #81c784" }}
        >
          <SuitAnswer text={s?.product_transfer?.preference_reason} />
        </div>
      ) : (
        <AdvisorNote>
          (Please include any background about why the client preferred to
          proceed with a product transfer specifically, for example ease of
          process, speed of application etc.)
        </AdvisorNote>
      )}

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
        The product transfer recommended was <PleaseSelect label="Please Select" />
      </p>
      <DropdownOptions
        label="Options:"
        options={[
          "the most cost-effective deal available, therefore there was no disadvantage to remaining with your current lender.",
          <>
            not the most cost-effective deal available, and will cost{" "}
            <strong style={{ color: blue }}>
              {caseData?.pt_cost_difference
                ? `£${Number(caseData.pt_cost_difference).toLocaleString("en-GB")}`
                : "£0,000"}
            </strong>{" "}
            more during the initial product term. However, you were happy to
            forfeit this saving to proceed with a product transfer.
          </>,
        ]}
      />

      <p className="mt-3">
        You did not wish to leave the mortgage on standard variable rate as this
        was more expensive than completing a product transfer.
      </p>
    </>
  );
};

export default ShortenedProductTransfer;