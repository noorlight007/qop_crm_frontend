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

/* ── Render array of green answers ── */
const SuitAnswers = ({ answers }: { answers: (string | undefined)[] }) => (
  <>
    {answers.filter(Boolean).map((a, i) => (
      <SuitAnswer key={i} text={a} />
    ))}
  </>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6
    className="fw-bold px-3 py-2 mb-3"
    style={{ background: "#1a3c5e", color: "#fff", letterSpacing: "0.3px" }}
  >
    {children}
  </h6>
);

interface RateTypePaymentMethodProps {
  caseData: any;
  suitability: any;
}

const RateTypePaymentMethod: React.FC<RateTypePaymentMethodProps> = ({
  caseData,
  suitability,
}) => {
  const s = suitability;

  const rateTypeAnswers =
    s?.recommending_mortgage_type?.recommending_mortgage_type === "SHARIA"
      ? [
          s?.recommending_mortgage_type?.question_one_sharia,
          s?.recommending_mortgage_type?.question_two_sharia,
        ]
      : [
          s?.recommending_mortgage_type?.question_one_answer,
          s?.recommending_mortgage_type?.question_two_answer,
          s?.recommending_mortgage_type?.question_three_answer,
          s?.recommending_mortgage_type?.question_four_answer,
        ];

  const repaymentAnswers =
    s?.recommending_repayment_method?.recommending_repayment_method_type ===
    "SHARIA"
      ? [
          s?.recommending_repayment_method?.question_one_sharia,
          s?.recommending_repayment_method?.question_two_sharia,
        ]
      : [
          s?.recommending_repayment_method?.question_one_answer,
          s?.recommending_repayment_method?.question_two_answer,
          s?.recommending_repayment_method?.question_three_answer,
          s?.recommending_repayment_method?.question_four_answer,
          s?.recommending_repayment_method?.question_five_answer,
        ];

  return (
    <>
      <SectionHeading>Interest Rate Type</SectionHeading>

      {/* ── Interest Rate Type row ── */}
      <table className="table table-bordered table-sm mb-3">
        <thead>
          <tr>
            <th
              style={{
                background: "#1a3c5e",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 600,
                width: "13%",
              }}
            >
              Feature
            </th>
            <th
              style={{
                background: "#1a3c5e",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 600,
                width: "15%",
              }}
            >
              Recommendation
            </th>
            <th
              style={{
                background: "#1a3c5e",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 600,
                width: "30%",
              }}
            >
              What does this mean?
            </th>
            <th
              style={{
                background: "#1a3c5e",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 600,
              }}
            >
              Why was this recommended to you?
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-bold">Interest Rate Type</td>
            <td>
              <PleaseSelect label="Please Select" />
              <DropdownOptions
                label="Options:"
                options={[
                  "Fixed",
                  "Tracker",
                  "Discount",
                  "Variable",
                  "Capped",
                  "Sonia Linked",
                  "Stepped",
                ]}
              />
            </td>
            <td>
              <PleaseSelect label="Please Select" />
              <DropdownOptions
                label="Options:"
                options={[
                  "Your payments will not change during the initial period.",
                  "Your payments can fluctuate during the initial deal period.",
                ]}
              />
            </td>
            <td>
              {rateTypeAnswers.filter(Boolean).length > 0 ? (
                <SuitAnswers answers={rateTypeAnswers} />
              ) : (
                <>
                  <PleaseSelect label="Please Select" />
                  <DropdownOptions
                    label="Options:"
                    options={[
                      <>
                        You did not need the certainty of knowing exactly what
                        your monthly repayments will be and were satisfied with
                        payments that have the ability to fluctuate because{" "}
                        <span style={{ color: "#2e7d32" }}>
                          {s?.recommending_mortgage_type?.variable_reason ??
                            "[reason]"}
                        </span>
                      </>,
                    ]}
                  />
                  <AdvisorNote>
                    (there needs to be a &lsquo;why&rsquo; based answer for all
                    justifications. The client wants the payments to be the same
                    each month isn&rsquo;t enough by itself — the why answer
                    can&rsquo;t just be assumed, we need to document it.)
                  </AdvisorNote>
                </>
              )}
            </td>
          </tr>

          {/* ── Repayment Method row ── */}
          <tr>
            <td className="fw-bold">Repayment Method</td>
            <td>
              <PleaseSelect label="Please Select" />
              <DropdownOptions
                label="Options:"
                options={["Repayment", "Interest Only"]}
              />
            </td>
            <td>
              <PleaseSelect label="Please Select" />
              <DropdownOptions
                label="Options:"
                options={[
                  "Your mortgage will be repaid by the end of its term, provided you make the required monthly payments when due.",
                  <>
                    Your mortgage balance will <strong>not</strong> be repaid by
                    the end of the term through making your monthly repayments.
                    You will be responsible for paying the balance{" "}
                    <strong>in full</strong> at the end of the term.
                  </>,
                ]}
              />
            </td>
            <td>
              {repaymentAnswers.filter(Boolean).length > 0 ? (
                <SuitAnswers answers={repaymentAnswers} />
              ) : (
                <>
                  <PleaseSelect label="Please Select" />
                  <DropdownOptions
                    label="Options:"
                    options={[
                      "You wanted to be certain that your entire mortgage balance is repaid by the end of the term.",
                      <>
                        You did not need the certainty of your mortgage being
                        repaid by the end of the term through making your monthly
                        repayments because{" "}
                        <span style={{ color: "#2e7d32" }}>
                          {s?.recommending_repayment_method
                            ?.interest_only_reason ?? "[reason]"}
                        </span>
                      </>,
                    ]}
                  />
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default RateTypePaymentMethod;