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
  <h6 className="suitability-section-heading">
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
  const [selectedRateTypeOption, setSelectedRateTypeOption] = useState<
    string | null
  >(null);
  const [isRateTypeOptionOpen, setIsRateTypeOptionOpen] = useState(false);
  const [selectedPaymentChangeOption, setSelectedPaymentChangeOption] =
    useState<string | null>(null);
  const [isPaymentChangeOptionOpen, setIsPaymentChangeOptionOpen] =
    useState(false);

  const [selectedFluctuateOption, setSelectedFluctuateOption] = useState<
    number | null
  >(null);
  const [isFluctuateOptionOpen, setIsFluctuateOptionOpen] = useState(false);

  const [fluctuateReason, setFluctuateReason] = useState("");
  const [savedFluctuateReason, setSavedFluctuateReason] = useState("");
  const [isFluctuateEditing, setIsFluctuateEditing] = useState(false);
  const [selectedRepaymentTypeOption, setSelectedRepaymentTypeOption] =
    useState<string | null>(null);
  const [isRepaymentTypeOptionOpen, setIsRepaymentTypeOptionOpen] =
    useState(false);

  const [selectedRepaymentStatusOption, setSelectedRepaymentStatusOption] =
    useState<number | null>(null);
  const [isRepaymentStatusOptionOpen, setIsRepaymentStatusOptionOpen] =
    useState(false);

  const [selectedRepaymentMethodOption, setSelectedRepaymentMethodOption] =
    useState<number | null>(null);
  const [isRepaymentMethodOptionOpen, setIsRepaymentMethodOptionOpen] =
    useState(false);

  const [repaymentMethodReason, setRepaymentMethodReason] = useState("");
  const [savedRepaymentMethodReason, setSavedRepaymentMethodReason] =
    useState("");
  const [isRepaymentMethodEditing, setIsRepaymentMethodEditing] =
    useState(false);

  const handleFluctuateSave = () => {
    setSavedFluctuateReason(fluctuateReason);
    setIsFluctuateEditing(false);
  };

  const handleFluctuateCancel = () => {
    setFluctuateReason(savedFluctuateReason);
    setIsFluctuateEditing(false);
  };

  const handleRepaymentMethodSave = () => {
    setSavedRepaymentMethodReason(repaymentMethodReason);
    setIsRepaymentMethodEditing(false);
  };

  const handleRepaymentMethodCancel = () => {
    setRepaymentMethodReason(savedRepaymentMethodReason);
    setIsRepaymentMethodEditing(false);
  };

  const rateTypeOptions = [
    "Fixed",
    "Tracker",
    "Discount",
    "Variable",
    "Capped",
    "Stepped",
  ];

  const repaymentTypeOptions = ["Repayment", "Interest Only"];

  const paymentChangeOptions = [
    "Your payments will not change during the initial period.",
    "Your payments can fluctuate during the initial deal period.",
  ];

  const fluctuateOptionTemplates = [
    "You did not need the certainty of knowing exactly what your monthly repayments will be and were satisfied with payments that have the ability to fluctuate because",
  ];

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
              <Dropdown
                isOpen={isRateTypeOptionOpen}
                toggle={() => setIsRateTypeOptionOpen((prev) => !prev)}
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
                  {selectedRateTypeOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {rateTypeOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedRateTypeOption(option)}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </td>
            <td>
              <Dropdown
                isOpen={isPaymentChangeOptionOpen}
                toggle={() => setIsPaymentChangeOptionOpen((prev) => !prev)}
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
                  {selectedPaymentChangeOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {paymentChangeOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedPaymentChangeOption(option)}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </td>
            <td>
              <Dropdown
                isOpen={isFluctuateOptionOpen}
                toggle={() => setIsFluctuateOptionOpen((prev) => !prev)}
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
                  {selectedFluctuateOption !== null ? (
                    fluctuateOptionTemplates[selectedFluctuateOption]
                  ) : (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {fluctuateOptionTemplates.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => {
                        setSelectedFluctuateOption(index);
                        setIsFluctuateEditing(false);
                      }}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option} <span style={{ color: "blue" }}>[reason]</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {selectedFluctuateOption !== null && (
                <span className="d-block mt-2">
                  {fluctuateOptionTemplates[selectedFluctuateOption]}{" "}
                  {isFluctuateEditing ? (
                    <span className="d-block w-100 mt-1">
                      <Input
                        type="textarea"
                        rows={5}
                        value={fluctuateReason}
                        onChange={(e) => setFluctuateReason(e.target.value)}
                        placeholder="Enter your reason..."
                        autoFocus
                        className="w-100 p-1"
                      />
                      <div className="d-flex gap-2 mt-2">
                        <Button
                          color="light"
                          className="text-dark"
                          size="sm"
                          onClick={handleFluctuateSave}
                        >
                          Save
                        </Button>
                        <Button
                          color="light"
                          className="text-dark"
                          size="sm"
                          onClick={handleFluctuateCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </span>
                  ) : (
                    <span
                      className="d-inline text-success"
                      style={{
                        cursor: "pointer",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                      onClick={() => setIsFluctuateEditing(true)}
                      title="Click to edit"
                    >
                      {savedFluctuateReason || "click to add reason..."}
                    </span>
                  )}
                </span>
              )}

              <div className="mt-2">
                <AdvisorNote>
                  (there needs to be a &lsquo;why&rsquo; based answer for all
                  justifications. The client wants the payments to be the same
                  each month isn&rsquo;t enough by itself — the why answer
                  can&rsquo;t just be assumed, we need to document it.)
                </AdvisorNote>
              </div>
            </td>
          </tr>

          {/* ── Repayment Method row ── */}
          <tr>
            <td className="fw-bold">Repayment Method</td>
            <td>
              <Dropdown
                isOpen={isRepaymentTypeOptionOpen}
                toggle={() => setIsRepaymentTypeOptionOpen((prev) => !prev)}
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
                  {selectedRepaymentTypeOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {repaymentTypeOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedRepaymentTypeOption(option)}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </td>
            <td>
              <Dropdown
                isOpen={isRepaymentStatusOptionOpen}
                toggle={() => setIsRepaymentStatusOptionOpen((prev) => !prev)}
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
                  {selectedRepaymentStatusOption === null && (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                  {selectedRepaymentStatusOption === 0 &&
                    "Your mortgage will be repaid by the end of its term, provided you make the required monthly payments when due."}
                  {selectedRepaymentStatusOption === 1 && (
                    <>
                      Your mortgage balance will <strong>not</strong> be repaid
                      by the end of the term through making your monthly
                      repayments. You will be responsible for paying the balance{" "}
                      <strong>in full</strong> at the end of the term.
                    </>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  <DropdownItem
                    onClick={() => setSelectedRepaymentStatusOption(0)}
                    className="text-wrap"
                  >
                    <span className="me-1 fw-bolder">•</span>
                    Your mortgage will be repaid by the end of its term,
                    provided you make the required monthly payments when due.
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => setSelectedRepaymentStatusOption(1)}
                    className="text-wrap"
                  >
                    <span className="me-1 fw-bolder">•</span>
                    Your mortgage balance will <strong>not</strong> be repaid by
                    the end of the term through making your monthly repayments.
                    You will be responsible for paying the balance{" "}
                    <strong>in full</strong> at the end of the term.
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td>
              <Dropdown
                isOpen={isRepaymentMethodOptionOpen}
                toggle={() => setIsRepaymentMethodOptionOpen((prev) => !prev)}
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
                  {selectedRepaymentMethodOption === null && (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                  {selectedRepaymentMethodOption === 0 &&
                    "You wanted to be certain that your entire mortgage balance is repaid by the end of the term."}
                  {selectedRepaymentMethodOption === 1 &&
                    "You did not need the certainty of your mortgage being repaid by the end of the term through making your monthly repayments because"}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  <DropdownItem
                    onClick={() => {
                      setSelectedRepaymentMethodOption(0);
                      setIsRepaymentMethodEditing(false);
                    }}
                    className="text-wrap"
                  >
                    <span className="me-1 fw-bolder">•</span>
                    You wanted to be certain that your entire mortgage balance
                    is repaid by the end of the term.
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setSelectedRepaymentMethodOption(1);
                      setRepaymentMethodReason("");
                      setSavedRepaymentMethodReason("");
                      setIsRepaymentMethodEditing(false);
                    }}
                    className="text-wrap"
                  >
                    <span className="me-1 fw-bolder">•</span>
                    You did not need the certainty of your mortgage being repaid
                    by the end of the term through making your monthly
                    repayments because{" "}
                    <span style={{ color: "blue" }}>[reason]</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {selectedRepaymentMethodOption === 1 && (
                <span className="d-block mt-2">
                  You did not need the certainty of your mortgage being repaid
                  by the end of the term through making your monthly repayments
                  because{" "}
                  {isRepaymentMethodEditing ? (
                    <span className="d-block w-100 mt-1">
                      <Input
                        type="textarea"
                        rows={5}
                        value={repaymentMethodReason}
                        onChange={(e) =>
                          setRepaymentMethodReason(e.target.value)
                        }
                        placeholder="Enter your reason..."
                        autoFocus
                        className="w-100 p-1"
                      />
                      <div className="d-flex gap-2 mt-2">
                        <Button
                          color="light"
                          className="text-dark"
                          size="sm"
                          onClick={handleRepaymentMethodSave}
                        >
                          Save
                        </Button>
                        <Button
                          color="light"
                          className="text-dark"
                          size="sm"
                          onClick={handleRepaymentMethodCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </span>
                  ) : (
                    <span
                      className="d-inline text-success"
                      style={{
                        cursor: "pointer",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                      onClick={() => setIsRepaymentMethodEditing(true)}
                      title="Click to edit"
                    >
                      {savedRepaymentMethodReason || "click to add reason..."}
                    </span>
                  )}
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default RateTypePaymentMethod;
