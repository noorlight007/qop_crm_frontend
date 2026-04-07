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

interface IslamicMortgageProps {
  caseData: any;
  suitability: any;
}

const IslamicMortgage: React.FC<IslamicMortgageProps> = ({
  caseData,
  suitability,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  const lender = caseData?.lender_name ?? "HSBC";

  const [selectedShariaMethod, setSelectedShariaMethod] = useState<
    string | null
  >(null);
  const [isShariaMethodOpen, setIsShariaMethodOpen] = useState(false);
  const [selectedShariaDetailOption, setSelectedShariaDetailOption] = useState<
    number | null
  >(null);
  const [isShariaDetailOptionOpen, setIsShariaDetailOptionOpen] =
    useState(false);
  const [selectedOverpaymentOption, setSelectedOverpaymentOption] = useState<
    number | null
  >(null);
  const [isOverpaymentOptionOpen, setIsOverpaymentOptionOpen] = useState(false);

  const shariaMethods = ["Ijara", "Musharaka", "Murabaha"];

  const shariaDetailOptions = [
    "Option 1 – Ijara",
    "Option 2 – Musharaka",
    "Option 3 – Murabaha",
  ];

  return (
    <>
      <SectionHeading>Islamic Mortgage</SectionHeading>

      <p>
        You need to raise the funds to purchase a property in such a way that is
        acceptable under Sharia Law. As such, you require a product which does
        not involve the payment of interest to the provider. I therefore
        recommend that you take out a Home Purchase Plan using the{" "}
        <Dropdown
          isOpen={isShariaMethodOpen}
          toggle={() => setIsShariaMethodOpen((prev) => !prev)}
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
            {selectedShariaMethod ?? "(select method...)"}
          </DropdownToggle>
          <DropdownMenu>
            {shariaMethods.map((method, index) => (
              <DropdownItem
                key={index}
                onClick={() => setSelectedShariaMethod(method)}
              >
                {method}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>{" "}
        method.
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
            {selectedShariaDetailOption !== null ? (
              shariaDetailOptions[selectedShariaDetailOption]
            ) : (
              <span className="text-muted fst-italic">Select method...</span>
            )}
          </DropdownToggle>
          <DropdownMenu
            className="w-100"
            style={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {shariaDetailOptions.map((option, index) => (
              <DropdownItem
                key={index}
                onClick={() => setSelectedShariaDetailOption(index)}
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {selectedShariaDetailOption !== null && (
          <div className="mt-3 small" style={{ color: "#6a1b9a" }}>
            {selectedShariaDetailOption === 0 && (
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

            {selectedShariaDetailOption === 1 && (
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

            {selectedShariaDetailOption === 2 && (
              <>
                <p className="fw-semibold mb-1">Option 3 – Murabaha:</p>
                <p className="mb-0">
                  Under the Murabaha method, the provider buys the property and
                  immediately sells it to you for a higher price (original cost
                  plus an agreed profit level). You pay this higher price on a
                  deferred basis by making regular payments to the provider in
                  line with a fixed repayment schedule.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <p>
        A feature of this plan means that if you are in a position to contribute
        additional funds you can do so{" "}
        <Dropdown
          isOpen={isOverpaymentOptionOpen}
          toggle={() => setIsOverpaymentOptionOpen((prev) => !prev)}
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
            {selectedOverpaymentOption === null && "select option..."}
            {selectedOverpaymentOption === 0 && "without penalty at any time."}
            {selectedOverpaymentOption === 1 && (
              <>
                provided you do not exceed{" "}
                <strong style={{ color: blue }}>
                  {caseData?.hpp_overpayment_limit ?? "XX"}%
                </strong>{" "}
                of the total Home Purchase Plan amount during any annual period.
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
              onClick={() => setSelectedOverpaymentOption(0)}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              without penalty at any time.
            </DropdownItem>
            <DropdownItem
              onClick={() => setSelectedOverpaymentOption(1)}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              provided you do not exceed{" "}
              <strong style={{ color: blue }}>
                {caseData?.hpp_overpayment_limit ?? "XX"}%
              </strong>{" "}
              of the total Home Purchase Plan amount during any annual period.
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </p>

      <p className="mt-3">
        I researched all Home Purchase Plan providers and products, with the
        exception of those that are only available to you direct, and I
        recommend <strong style={{ color: blue }}>{lender}</strong> for the
        following reasons:
      </p>

      {s?.islamic_mortgage?.recommendation_reason ? (
        <div
          className="p-3 mb-3 rounded"
          style={{ background: "#f1f8e9", borderLeft: "4px solid #81c784" }}
        >
          <SuitAnswer text={s?.islamic_mortgage?.recommendation_reason} />
        </div>
      ) : (
        <AdvisorNote>
          (Explain why this provider and product was the best Home Purchase Plan
          for the client based on their individual needs and circumstances)
        </AdvisorNote>
      )}
    </>
  );
};

export default IslamicMortgage;
