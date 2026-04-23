import {
  arrangementOptions,
  ercMeaningOptions,
  ercOptions,
  ercWhyOptions,
  homeInsuranceOptions,
  portableMeaningOptions,
  portableOptions,
  portableWhyOptionTemplates,
  protectionOptionTemplates,
  rateSwitchOptions,
} from "@/Data/Cases/SuitabilityData";
import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import Image from "next/image";
import React, { useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Table,
} from "reactstrap";

/* ── Pink: advisor guidance note ── */
const AdvisorNote = ({ children }: { children: React.ReactNode }) => (
  <p className="suitability-advisor-note rounded">{children}</p>
);

const Divider = () => <hr className="my-4" />;

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6 className="suitability-section-heading">{children}</h6>
);

const thStyle: React.CSSProperties = {
  background: "#1a3c5e",
  color: "#fff",
  fontSize: "0.84rem",
  fontWeight: 600,
};

interface RecommendationLetterProps {
  caseData: any;
  suitability: any;
  formValues: SuitabilityData;
  onFormChange: (updates: Partial<SuitabilityData>) => void;
}

const RecommendationLetter: React.FC<RecommendationLetterProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);

  // ── Read-only display values from API ──
  const advisorName = s?.adviser?.name ?? "";
  const advisorJobTitle = s?.adviser?.user_type ?? "";
  const advisorEmail = s?.adviser?.email ?? "";
  const advisorPhone = s?.adviser?.phone ?? "";
  const companyName = s?.adviser?.company ?? "";
  const companyAddress =
    caseData?.company_address ?? "77 Marsh Wall\nLondon\nE14 9SH";

  const clientName = s?.applicant?.name;
  const jointApplicantNames = s?.joint_applicants || [];
  const allApplicantNames = [clientName, ...jointApplicantNames]
    .filter(Boolean)
    .join(", ")
    .replace(/,([^,]*)$/, " &$1");

  const lender = s?.loan_details?.lender ?? "";
  const initialRate = s?.loan_details?.initial_interest_rate ?? "";
  const rateType = s?.loan_details?.interest_rate_type ?? "";
  const dealEndDate = caseData?.deal_end_date ?? "";
  const repaymentMethod = s?.loan_details?.repayment_method ?? "";
  const mortgageTerm = s?.loan_details?.mortgage_term ?? "";
  const mortgageType = s?.loan_details?.mortgage_type ?? "";
  const maxERC = caseData?.max_erc ? `£${caseData.max_erc}` : "£X";

  const fmtGBP = (val: any) =>
    val
      ? `£${Number(val).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
      : null;

  const mortgageAmount = s?.loan_details?.mortgage_amount ?? "";
  const monthlyRepayment = s?.loan_details?.monthly_repayment ?? "£657.81";
  const arrangementFee = fmtGBP(caseData?.arrangement_fee) ?? "£X or N/A";

  const { house_number_or_name, city, post_code } = s?.applicant ?? {};
  const clientAddress = [house_number_or_name, city, post_code]
    .filter(Boolean)
    .join("\n");
  const property = caseData?.property_details;

  const propertyAddress = property
    ? `${property.house_name_or_number}, ${property.city}, ${property.postcode}`
    : "";
  const additionalRecipients = caseData?.additional_recipients ?? "";

  // ══════════════════════════════════════════════════════════
  // LOCAL UI-ONLY STATES (dropdown open/close + edit toggles)
  // These never go to the backend — purely for UI behaviour
  // ══════════════════════════════════════════════════════════
  const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);
  const [isLenderEditing, setIsLenderEditing] = useState(false);
  const [isInterestRateEditing, setIsInterestRateEditing] = useState(false);
  const [isInitialInterestRateEditing, setIsInitialInterestRateEditing] =
    useState(false);
  const [isMortgageOptionOpen, setIsMortgageOptionOpen] = useState(false);
  const [isArrangementOptionOpen, setIsArrangementOptionOpen] = useState(false);
  const [isMortgageTermEditing, setIsMortgageTermEditing] = useState(false);
  const [isErcOptionOpen, setIsErcOptionOpen] = useState(false);
  const [isErcMeaningOptionOpen, setIsErcMeaningOptionOpen] = useState(false);
  const [isErcWhyOptionOpen, setIsErcWhyOptionOpen] = useState(false);
  const [isPortableOptionOpen, setIsPortableOptionOpen] = useState(false);
  const [isPortableMeaningOptionOpen, setIsPortableMeaningOptionOpen] =
    useState(false);
  const [isPortableWhyOptionOpen, setIsPortableWhyOptionOpen] = useState(false);
  const [isPortableWhyEditing, setIsPortableWhyEditing] = useState(false);
  const [isRateSwitchOptionOpen, setIsRateSwitchOptionOpen] = useState(false);
  const [isProtectionOptionOpen, setIsProtectionOptionOpen] = useState(false);
  const [isProtectionEditing, setIsProtectionEditing] = useState(false);
  const [isHomeInsuranceOptionOpen, setIsHomeInsuranceOptionOpen] =
    useState(false);

  // ══════════════════════════════════════════════════════════
  // LOCAL DRAFT STATES
  // These hold the in-progress textarea value while editing.
  // On Save → pushed to parent via onFormChange.
  // On Cancel → reset back to formValues (the last saved value).
  // ══════════════════════════════════════════════════════════
  const [lenderDraft, setLenderDraft] = useState("");
  const [interestRateDraft, setInterestRateDraft] = useState("");
  const [initialInterestRateDraft, setInitialInterestRateDraft] = useState("");
  const [mortgageTermDraft, setMortgageTermDraft] = useState("");
  const [portableWhyDraft, setPortableWhyDraft] = useState("");
  const [protectionDraft, setProtectionDraft] = useState("");

  // ══════════════════════════════════════════════════════════
  // DROPDOWN OPTION LISTS
  // ══════════════════════════════════════════════════════════
  const mortgageOptions: { value: string; label: React.ReactNode }[] = [
    {
      value: "HOME_IMPROVEMENTS",
      label:
        "Your mortgage includes additional funds required for the home improvements detailed at the beginning of this letter.",
    },
    {
      value: "DEBT_REPAYMENT",
      label:
        "Your mortgage includes additional funds to repay debts. I have explained the disadvantages to adding debts to your mortgage in the 'important information' section of this letter. Please read this carefully.",
    },
    {
      value: "OTHER_REASON",
      label:
        "Your mortgage includes additional funds as per the reasons stated at the beginning of this letter.",
    },
    {
      value: "EQUAL_OUTSTANDING",
      label:
        "The mortgage amount I am recommending is equal to what is currently outstanding on the mortgage.",
    },
    {
      value: "LESS_THAN_OUTSTANDING",
      label: (
        <>
          The mortgage amount is less than what you currently have outstanding
          on your mortgage, this is because you are making an overpayment of{" "}
          <span style={{ color: blue }}>{mortgageAmount}</span>.
        </>
      ),
    },
    {
      value: "PURCHASE_MINUS_DEPOSIT",
      label:
        "Your mortgage is equal to the purchase price of the property, minus your deposit.",
    },
  ];

  // ── Helpers: find full option object from stored .value string ──
  // Used to re-hydrate dropdown display label from formValues on page load
  const selectedMortgageOption =
    mortgageOptions.find((o) => o.value === formValues.mortgage_amount_type) ??
    null;
  const selectedArrangementOption =
    arrangementOptions.find(
      (o) => o.value === formValues.arrangement_fee_type,
    ) ?? null;
  const selectedErcOption =
    ercOptions.find(
      (o) => o.value === formValues.early_repayment_charges_recommendation,
    ) ?? null;
  const selectedErcMeaningOption =
    ercMeaningOptions.find(
      (o) => o.value === formValues.early_repayment_charges_meaning,
    ) ?? null;
  const selectedErcWhyOption =
    ercWhyOptions.find(
      (o) => o.value === formValues.early_repayment_charges_reason,
    ) ?? null;
  const selectedPortableOption =
    portableOptions.find(
      (o) => o.value === formValues.portability_recommendation,
    ) ?? null;
  const selectedPortableMeaningOption =
    portableMeaningOptions.find(
      (o) => o.value === formValues.portability_meaning,
    ) ?? null;
  const selectedPortableWhyOption =
    portableWhyOptionTemplates.find(
      (o) => o.value === formValues.portability_reason,
    ) ?? null;
  const selectedRateSwitchOption =
    rateSwitchOptions.find(
      (o) => o.value === formValues.residential_mortgages_type,
    ) ?? null;
  const selectedProtectionOption =
    protectionOptionTemplates.find(
      (o) => o.value === formValues.protection,
    ) ?? null;
  const selectedHomeInsuranceOption =
    homeInsuranceOptions.find((o) => o.value === formValues.home_insurance) ??
    null;

  // ══════════════════════════════════════════════════════════
  // SAVE / CANCEL HANDLERS FOR TEXTAREA FIELDS
  // ══════════════════════════════════════════════════════════

  const handleLenderSave = () => {
    onFormChange({ lender_text: lenderDraft });
    setIsLenderEditing(false);
  };
  const handleLenderCancel = () => {
    setLenderDraft(formValues.lender_text ?? "");
    setIsLenderEditing(false);
  };
  const startLenderEdit = () => {
    setLenderDraft(formValues.lender_text ?? "");
    setIsLenderEditing(true);
  };

  const handleInterestRateSave = () => {
    onFormChange({ initial_interest_rate_text: interestRateDraft });
    setIsInterestRateEditing(false);
  };
  const handleInterestRateCancel = () => {
    setInterestRateDraft(formValues.initial_interest_rate_text ?? "");
    setIsInterestRateEditing(false);
  };
  const startInterestRateEdit = () => {
    setInterestRateDraft(formValues.initial_interest_rate_text ?? "");
    setIsInterestRateEditing(true);
  };

  const handleInitialInterestRateSave = () => {
    onFormChange({
      initial_interest_rate_deal_period_text: initialInterestRateDraft,
    });
    setIsInitialInterestRateEditing(false);
  };
  const handleInitialInterestRateCancel = () => {
    setInitialInterestRateDraft(
      formValues.initial_interest_rate_deal_period_text ?? "",
    );
    setIsInitialInterestRateEditing(false);
  };
  const startInitialInterestRateEdit = () => {
    setInitialInterestRateDraft(
      formValues.initial_interest_rate_deal_period_text ?? "",
    );
    setIsInitialInterestRateEditing(true);
  };

  const handleMortgageTermSave = () => {
    onFormChange({ repayment_method_why_text: mortgageTermDraft });
    setIsMortgageTermEditing(false);
  };
  const handleMortgageTermCancel = () => {
    setMortgageTermDraft(formValues.repayment_method_why_text ?? "");
    setIsMortgageTermEditing(false);
  };
  const startMortgageTermEdit = () => {
    setMortgageTermDraft(formValues.repayment_method_why_text ?? "");
    setIsMortgageTermEditing(true);
  };

  const handlePortableWhySave = () => {
    onFormChange({ portability_suggestion: portableWhyDraft });
    setIsPortableWhyEditing(false);
  };
  const handlePortableWhyCancel = () => {
    setPortableWhyDraft(formValues.portability_suggestion ?? "");
    setIsPortableWhyEditing(false);
  };
  const startPortableWhyEdit = () => {
    setPortableWhyDraft(formValues.portability_suggestion ?? "");
    setIsPortableWhyEditing(true);
  };

  const handleProtectionSave = () => {
    onFormChange({ protection_reason: protectionDraft });
    setIsProtectionEditing(false);
  };
  const handleProtectionCancel = () => {
    setProtectionDraft(formValues.protection_reason ?? "");
    setIsProtectionEditing(false);
  };
  const startProtectionEdit = () => {
    setProtectionDraft(formValues.protection_reason ?? "");
    setIsProtectionEditing(true);
  };

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════
  return (
    <>
      {/* ══════════════════════════════
          LETTERHEAD
      ══════════════════════════════ */}
      <Row className="mb-5 d-flex align-items-start justify-content-between">
        <Col xs="auto" className="align-self-start">
          {appearanceData?.logo && (
            <Image
              width={200}
              height={70}
              className="img-fluid for-light"
              src={appearanceData.logo}
              alt="suitability page"
              priority
              style={{ width: "130px", height: "50px" }}
            />
          )}
        </Col>
        <Col xs={12} md={5} className="text-end">
          <p className="mb-0 fw-bold" style={{ color: blue }}>
            {advisorName}
          </p>
          <p className="mb-0" style={{ color: blue }}>
            {companyName}
          </p>
          <p className="mb-0" style={{ whiteSpace: "pre-line", color: blue }}>
            {companyAddress}
          </p>
          <p className="mb-0" style={{ color: blue }}>
            <a
              href={`mailto:${advisorEmail}`}
              style={{ color: blue, textDecoration: "underline" }}
            >
              {advisorEmail}
            </a>
          </p>
          <p className="mb-0" style={{ color: blue }}>
            {advisorPhone}
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} md={6} className="text-start">
          <p className="mb-0 fw-semibold" style={{ color: blue }}>
            {clientName}
          </p>
          <p className="mb-0" style={{ whiteSpace: "pre-line", color: blue }}>
            {clientAddress}
          </p>
        </Col>
      </Row>

      <Divider />

      {/* ══════════════════════════════
          LETTER TITLE
      ══════════════════════════════ */}
      <div className="text-center mb-4">
        <h4 className="fw-bold mb-1" style={{ textDecoration: "underline" }}>
          Recommendation Letter
        </h4>
        <p className="fw-bold mb-1">Summary of your Mortgage Recommendation</p>
        <p className="mb-0">
          Prepared for{" "}
          <strong style={{ color: blue }}>{allApplicantNames}</strong>
        </p>
        <p className="mb-0">
          By <strong style={{ color: blue }}>{advisorName}</strong>
        </p>
      </div>

      <Divider />

      {/* ══════════════════════════════
          OPENING
      ══════════════════════════════ */}
      <p>
        Dear <span style={{ color: blue }}>{allApplicantNames}</span>,
      </p>
      <p>
        This letter explains the advice I have given you regarding your mortgage
        following our recent discussions about your needs and circumstances.
      </p>
      <p>
        Please take the time to read it carefully, alongside all other documents
        relating to the mortgage, if you need clarification on anything, please
        contact me and we can arrange a time to discuss any questions or queries
        that you have.
      </p>
      <p>
        During our discussion you asked me to provide advice on your{" "}
        <span style={{ color: blue }}>{mortgageType}</span> of{" "}
        <strong style={{ color: blue }}>{propertyAddress}</strong>.
      </p>

      <div className="mb-3">
        <AdvisorNote>
          (add soft facts about the transaction / what the clients overall goals
          were that were relevant to the advice and any other general
          information you feel is important to build a picture of the advice you
          have given)
        </AdvisorNote>
      </div>

      <p>
        It is important to us that you can access and understand the information
        that we provide, in the way that is most suitable to you. If you need
        any extra support to help you understand this letter or require the
        information in an alternative format, please let me know.
      </p>

      <p>Warm regards,</p>
      <p className="mb-0 fw-semibold" style={{ color: blue }}>
        {advisorName}
      </p>
      <p className="mb-0" style={{ color: blue }}>
        {advisorJobTitle}
      </p>
      <p style={{ color: blue }}>{companyName}</p>

      <Divider />

      {/* ══════════════════════════════
          RECOMMENDATION SUMMARY TABLE
      ══════════════════════════════ */}
      <SectionHeading>What have I recommended and why?</SectionHeading>
      <p>I have recommended the following mortgage:</p>

      <Table bordered responsive size="sm" className="mb-3">
        <thead>
          <tr>
            <th style={thStyle}>Lender</th>
            <th style={thStyle}>Initial interest rate, type &amp; period</th>
            <th style={thStyle}>Repayment method</th>
            <th style={thStyle}>Mortgage amount (including any added fees)</th>
            <th style={thStyle}>Mortgage term</th>
            <th style={thStyle}>Monthly repayment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-semibold" style={{ color: blue }}>
              {lender}
            </td>
            <td style={{ color: blue }}>{initialRate}</td>
            <td style={{ color: blue }}>{repaymentMethod}</td>
            <td className="fw-semibold" style={{ color: blue }}>
              {mortgageAmount}
            </td>
            <td style={{ color: blue }}>{mortgageTerm}</td>
            <td className="fw-semibold" style={{ color: blue }}>
              {monthlyRepayment}
            </td>
          </tr>
        </tbody>
      </Table>

      <p className="fw-bold">
        Your property can be repossessed if you do not keep up your payments.
      </p>

      <Divider />

      {/* ══════════════════════════════
          FEATURES TABLE
      ══════════════════════════════ */}
      <SectionHeading>What features were recommended and why?</SectionHeading>
      <p>
        The main features of the mortgage and the reasons for my recommendation
        are explained in the table below.
      </p>

      <Table bordered responsive size="sm" className="mb-3">
        <thead>
          <tr>
            <th style={{ ...thStyle, width: "13%" }}>Feature</th>
            <th style={{ ...thStyle, width: "15%" }}>Recommendation</th>
            <th style={{ ...thStyle, width: "30%" }}>What does this mean?</th>
            <th style={thStyle}>Why was this recommended to you?</th>
          </tr>
        </thead>
        <tbody>
          {/* ── 1. Lender ── */}
          <tr>
            <td className="fw-bold">Lender</td>
            <td style={{ color: blue }}>{lender}</td>
            <td>This is the lender who will provide your mortgage.</td>
            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
              I have recommended <strong>{lender}</strong> because{" "}
              {isLenderEditing ? (
                <span className="d-block w-100 mt-1">
                  <Input
                    type="textarea"
                    rows={5}
                    value={lenderDraft}
                    onChange={(e) => setLenderDraft(e.target.value)}
                    placeholder="Enter your reason..."
                    autoFocus
                    className="w-100 p-1"
                  />
                  <div className="d-flex gap-2 mt-2">
                    <Button
                      color="light"
                      className="text-dark"
                      size="sm"
                      onClick={handleLenderSave}
                    >
                      Save
                    </Button>
                    <Button
                      color="light"
                      className="text-dark"
                      size="sm"
                      onClick={handleLenderCancel}
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
                  onClick={startLenderEdit}
                  title="Click to edit"
                >
                  {formValues.lender_text || "click to add reason..."}
                </span>
              )}
            </td>
          </tr>

          {/* ── 2. Interest Rate Type ── */}
          <tr>
            <td className="fw-bold">Interest Rate Type</td>
            <td style={{ color: blue }}>{rateType}</td>
            <td>Your payments will not change during the initial period.</td>
            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
              You wanted the certainty of knowing exactly what your monthly
              payments will be because{" "}
              {isInterestRateEditing ? (
                <span className="d-block w-100 mt-1">
                  <Input
                    type="textarea"
                    rows={5}
                    value={interestRateDraft}
                    onChange={(e) => setInterestRateDraft(e.target.value)}
                    placeholder="Enter your reason..."
                    autoFocus
                    className="w-100 p-1"
                  />
                  <div className="d-flex gap-2 mt-2">
                    <Button
                      color="light"
                      className="text-dark"
                      size="sm"
                      onClick={handleInterestRateSave}
                    >
                      Save
                    </Button>
                    <Button
                      color="light"
                      className="text-dark"
                      size="sm"
                      onClick={handleInterestRateCancel}
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
                  onClick={startInterestRateEdit}
                  title="Click to edit"
                >
                  {formValues.initial_interest_rate_text ||
                    "click to add reason..."}
                </span>
              )}
              <span className="mt-2">
                <AdvisorNote>
                  (there needs to be a &lsquo;why&rsquo; based answer for all
                  justifications. The client wants the payments to be the same
                  each month, isn&rsquo;t enough by itself, the why answer
                  can&rsquo;t just be assumed we need to document it.)
                </AdvisorNote>
              </span>
            </td>
          </tr>

          {/* ── 3. Initial interest rate / deal period ── */}
          <tr>
            <td className="fw-bold">Initial interest rate / deal period</td>
            <td>
              The recommended deal period will apply until{" "}
              <strong style={{ color: blue }}>{dealEndDate}</strong>
            </td>
            <td>
              <p className="mb-2 fw-bold">
                At the end of the initial deal period the interest rate will
                change to the lender&rsquo;s standard variable rate (SVR). We
                have given you an example of their current standard variable
                rate in your mortgage illustration, please note this may differ
                to the standard variable rate when your deal expires, therefore
                the cost after expiry could be higher.
              </p>
              <p className="mb-0">
                We recommend you start to review your mortgage deal 6 months in
                advance of the end date.
              </p>
            </td>
            <td>
              <p className="mb-1">
                We discussed that lenders offer different deals for varying
                lengths of time and reviewed the options that are available to
                you.
              </p>
              <p className="mb-2">
                We also discussed your personal circumstances and the future
                goals &amp; plans that are important in advising what is the
                most suitable deal period for you.
              </p>
              I recommend a period of{" "}
              <span style={{ color: blue }}>{mortgageTerm}</span> because{" "}
              {isInitialInterestRateEditing ? (
                <span className="d-block w-100 mt-1">
                  <Input
                    type="textarea"
                    rows={5}
                    value={initialInterestRateDraft}
                    onChange={(e) =>
                      setInitialInterestRateDraft(e.target.value)
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
                      onClick={handleInitialInterestRateSave}
                    >
                      Save
                    </Button>
                    <Button
                      color="light"
                      className="text-dark"
                      size="sm"
                      onClick={handleInitialInterestRateCancel}
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
                  onClick={startInitialInterestRateEdit}
                  title="Click to edit"
                >
                  {formValues.initial_interest_rate_deal_period_text ||
                    "click to add reason..."}
                </span>
              )}
              <span className="mt-2">
                <AdvisorNote>
                  (Always discount <strong>both</strong> shorter and longer term
                  options, based on the clients <strong>individual</strong>{" "}
                  circumstances, needs and preferences. There are so many
                  different possible reasons that feed into this part of the
                  advice, we need to evidence those reasons in a clear way so if
                  the client looks back they fully understand why it was best
                  for <strong>them specifically</strong>)
                </AdvisorNote>
              </span>
            </td>
          </tr>

          {/* ── 4. Repayment Method ── */}
          <tr>
            <td className="fw-bold">Repayment Method</td>
            <td style={{ color: blue }}>{repaymentMethod}</td>
            <td>
              Your mortgage will be repaid by the end of its term, provided you
              make the required monthly payments when due.
            </td>
            <td>
              <span>
                You wanted to be certain that your entire mortgage balance is
                repaid by the end of the term.
              </span>
            </td>
          </tr>

          {/* ── 5. Mortgage Amount ── */}
          <tr>
            <td className="fw-bold">Mortgage Amount</td>
            <td style={{ color: blue }}>{mortgageAmount}</td>
            <td>
              This is the total amount borrowed. If fees have been added to the
              mortgage, they are included within this figure.
            </td>
            <td>
              <Dropdown
                isOpen={isMortgageOptionOpen}
                toggle={() => setIsMortgageOptionOpen((p) => !p)}
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
                  {selectedMortgageOption ? (
                    selectedMortgageOption.label
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
                  {mortgageOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        onFormChange({ mortgage_amount_type: option.value })
                      }
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </td>
          </tr>

          {/* ── 6. Arrangement Fee ── */}
          <tr>
            <td className="fw-bold">Arrangement Fee</td>
            <td style={{ color: blue }}>{arrangementFee}</td>
            <td>
              <p className="mb-1">
                Your mortgage may have fees and charges payable.
              </p>
              <p className="mb-0 fw-bold">
                Please refer to the mortgage illustration for full details.
              </p>
            </td>
            <td>
              <Dropdown
                isOpen={isArrangementOptionOpen}
                toggle={() => setIsArrangementOptionOpen((p) => !p)}
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
                  {selectedArrangementOption ? (
                    selectedArrangementOption.label
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
                  {arrangementOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        onFormChange({ arrangement_fee_type: option.value })
                      }
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <span className="mt-2 w-100">
                <AdvisorNote>
                  (Where fees added, include the reason why)
                </AdvisorNote>
              </span>
            </td>
          </tr>

          {/* ── 7. Mortgage Term ── */}
          <tr>
            <td className="fw-bold">Mortgage Term</td>
            <td style={{ color: blue }}>{mortgageTerm}</td>
            <td>
              This is the term over which you will repay back your mortgage.
            </td>
            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
              The term has been recommended because{" "}
              {isMortgageTermEditing ? (
                <span className="d-block w-100 mt-1">
                  <Input
                    type="textarea"
                    rows={5}
                    value={mortgageTermDraft}
                    onChange={(e) => setMortgageTermDraft(e.target.value)}
                    placeholder="Enter your reason..."
                    autoFocus
                    className="w-100 p-1"
                  />
                  <div className="d-flex gap-2 mt-2">
                    <Button
                      color="light"
                      className="text-dark"
                      size="sm"
                      onClick={handleMortgageTermSave}
                    >
                      Save
                    </Button>
                    <Button
                      color="light"
                      className="text-dark"
                      size="sm"
                      onClick={handleMortgageTermCancel}
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
                  onClick={startMortgageTermEdit}
                  title="Click to edit"
                >
                  {formValues.repayment_method_why_text ||
                    "click to add reason..."}
                </span>
              )}
              <span className="mt-2">
                <AdvisorNote>
                  (If past retirement age, fully cover the reason why,
                  feasibility etc)
                </AdvisorNote>
              </span>
            </td>
          </tr>

          {/* ── 8. Early Repayment Charges ── */}
          <tr>
            <td className="fw-bold">Early Repayment Charges</td>
            <td>
              {/* Recommendation column — which ERC option applies */}
              <Dropdown
                isOpen={isErcOptionOpen}
                toggle={() => setIsErcOptionOpen((p) => !p)}
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
                  {selectedErcOption ? (
                    selectedErcOption.label
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
                  {ercOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        onFormChange({
                          early_repayment_charges_recommendation: option.value,
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
            </td>
            <td>
              {/* What does this mean column */}
              <Dropdown
                isOpen={isErcMeaningOptionOpen}
                toggle={() => setIsErcMeaningOptionOpen((p) => !p)}
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
                  {selectedErcMeaningOption ? (
                    selectedErcMeaningOption.label
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
                  {ercMeaningOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        onFormChange({
                          early_repayment_charges_meaning: option.value,
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
              <p className="mt-2 mb-0">
                The Maximum Early Repayment Charge that could apply is{" "}
                <strong style={{ color: blue }}>{maxERC}</strong>
              </p>
            </td>
            <td>
              {/* Why recommended column */}
              <Dropdown
                isOpen={isErcWhyOptionOpen}
                toggle={() => setIsErcWhyOptionOpen((p) => !p)}
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
                  {selectedErcWhyOption ? (
                    selectedErcWhyOption.label
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
                  {ercWhyOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        onFormChange({
                          early_repayment_charges_reason: option.value,
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
            </td>
          </tr>

          {/* ── 9. Portability ── */}
          <tr>
            <td className="fw-bold">Portability</td>
            <td>
              {/* Recommendation — portable yes/no */}
              <Dropdown
                isOpen={isPortableOptionOpen}
                toggle={() => setIsPortableOptionOpen((p) => !p)}
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
                  {selectedPortableOption ? (
                    selectedPortableOption.label
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
                  {portableOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        onFormChange({
                          portability_recommendation: option.value,
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
            </td>
            <td>
              {/* What does this mean */}
              <Dropdown
                isOpen={isPortableMeaningOptionOpen}
                toggle={() => setIsPortableMeaningOptionOpen((p) => !p)}
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
                  {selectedPortableMeaningOption ? (
                    selectedPortableMeaningOption.label
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
                  {portableMeaningOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        onFormChange({ portability_meaning: option.value })
                      }
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </td>
            <td>
              {/* Why recommended — dropdown + optional text reason */}
              <Dropdown
                isOpen={isPortableWhyOptionOpen}
                toggle={() => setIsPortableWhyOptionOpen((p) => !p)}
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
                  {selectedPortableWhyOption ? (
                    selectedPortableWhyOption.label
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
                  {portableWhyOptionTemplates.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() => {
                        onFormChange({ portability_reason: option.value });
                        setIsPortableWhyEditing(false);
                      }}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option.label}{" "}
                      <span style={{ color: blue }}>[reason]</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Reason field — only shown after an option is selected */}
              {selectedPortableWhyOption !== null && (
                <span className="d-block mt-2">
                  {selectedPortableWhyOption.label}{" "}
                  {isPortableWhyEditing ? (
                    <span className="d-block w-100 mt-1">
                      <Input
                        type="textarea"
                        rows={5}
                        value={portableWhyDraft ?? ""}
                        onChange={(e) => setPortableWhyDraft(e.target.value)}
                        placeholder="Enter your reason..."
                        autoFocus
                        className="w-100 p-1"
                      />
                      <div className="d-flex gap-2 mt-2">
                        <Button
                          color="light"
                          className="text-dark"
                          size="sm"
                          onClick={handlePortableWhySave}
                        >
                          Save
                        </Button>
                        <Button
                          color="light"
                          className="text-dark"
                          size="sm"
                          onClick={handlePortableWhyCancel}
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
                      onClick={startPortableWhyEdit}
                      title="Click to edit"
                    >
                      {formValues.portability_suggestion ||
                        "click to add reason..."}
                    </span>
                  )}
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </Table>

      <AdvisorNote>
        (Add any additional notes here if there is further justification or
        explanation needed on anything relating to the advice. This includes any
        further background information you feel supports how you reached your
        recommendation that you have not covered in the table above.)
      </AdvisorNote>

      {/* ── Purple: Rate switch section ── */}
      <div className="suitability-purple-box p-3 my-3 rounded">
        <p className="fw-semibold mb-2 small" style={{ color: "#6a1b9a" }}>
          <strong>For residential Mortgages</strong> – where rate switches are
          allowed post application, select one of the following 3 paragraphs:
        </p>

        <Dropdown
          isOpen={isRateSwitchOptionOpen}
          toggle={() => setIsRateSwitchOptionOpen((p) => !p)}
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
            {selectedRateSwitchOption ? (
              selectedRateSwitchOption.displayLabel
            ) : (
              <span className="text-muted fst-italic">
                Select rate switch option...
              </span>
            )}
          </DropdownToggle>
          <DropdownMenu
            className="w-100"
            style={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {rateSwitchOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  onFormChange({ residential_mortgages_type: option.value })
                }
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option.displayLabel}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {selectedRateSwitchOption && (
          <div className="mt-3 small" style={{ color: "#6a1b9a" }}>
            <p className="fw-semibold mb-1">
              {selectedRateSwitchOption.displayLabel}
            </p>
            <p className="mb-0">{selectedRateSwitchOption.label}</p>
          </div>
        )}

        <div className="mt-2">
          <AdvisorNote>
            (if there is a charge associated with the service, outline what this
            is, <strong>must be included on IDD</strong>)
          </AdvisorNote>
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════
          WHAT ELSE DO YOU NEED TO KNOW?
      ══════════════════════════════ */}
      <SectionHeading>What else do you need to know?</SectionHeading>
      <p>
        The following section contains important additional information about
        the recommendations I have made. Where relevant, it also explains
        potential risks of the mortgage.
      </p>
      <AdvisorNote>
        (Include details here if initial recommendation was rejected by the
        customer(s). This should include information as to the initial
        recommendation and why it was suitable, as well as the final
        recommendation and why it was felt the reasons for changing it were
        appropriate and suitable for the clients needs and preferences.)
      </AdvisorNote>
      <AdvisorNote>
        (Any additional risk warnings as detailed in the first page, are to be
        generated here.)
      </AdvisorNote>

      <Divider />

      {/* ══════════════════════════════
          IS THERE ANYTHING ELSE?
      ══════════════════════════════ */}
      <SectionHeading>
        Is there anything else you need to think about?
      </SectionHeading>

      {/* ── Protection ── */}
      <p className="fw-bold mb-1">Protection</p>
      <p>
        Your mortgage is a large financial commitment, please consider how you
        would be able to manage your mortgage payments if you were no longer
        able to work due to accident / illness / injury, or the impact of if you
        were to suffer a critical illness or die during the{" "}
        <span style={{ color: blue }}>{mortgageTerm}</span> mortgage term.
      </p>

      <Dropdown
        isOpen={isProtectionOptionOpen}
        toggle={() => setIsProtectionOptionOpen((p) => !p)}
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
          {selectedProtectionOption ? (
            selectedProtectionOption.label
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
          {protectionOptionTemplates.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => {
                onFormChange({
                  protection: option.value,
                  protection_reason: "",
                });
                setProtectionDraft("");
                setIsProtectionEditing(false);
              }}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              {option.label}{" "}
              {option.requiresReason && (
                <span style={{ color: blue }}>[reason]</span>
              )}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {selectedProtectionOption?.requiresReason && (
        <span className="d-block mt-2">
          {selectedProtectionOption.label}{" "}
          {isProtectionEditing ? (
            <span className="d-block w-100 mt-1">
              <Input
                type="textarea"
                rows={5}
                value={protectionDraft}
                onChange={(e) => setProtectionDraft(e.target.value)}
                placeholder="Enter your reason..."
                autoFocus
                className="w-100 p-1"
              />
              <div className="d-flex gap-2 mt-2">
                <Button
                  color="light"
                  className="text-dark"
                  size="sm"
                  onClick={handleProtectionSave}
                >
                  Save
                </Button>
                <Button
                  color="light"
                  className="text-dark"
                  size="sm"
                  onClick={handleProtectionCancel}
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
              onClick={startProtectionEdit}
              title="Click to edit"
            >
              {formValues.protection_reason || "click to add reason..."}
            </span>
          )}
        </span>
      )}

      <div className="mt-2">
        <AdvisorNote>
          (Where you have not recommended new policies or advice has been
          rejected, please include as much detail as possible. If they have
          existing policies that are adequate please attach policy documents to
          QOP. Where advice has been rejected please ensure protection
          declaration is on file also.)
        </AdvisorNote>
      </div>

      {/* ── Lasting Power of Attorney ── */}
      <p className="fw-bold mb-1 mt-4">Lasting Power of Attorney (LPOA)</p>
      <p>
        A Lasting Power of Attorney, registered with the appropriate authority,
        means somebody else can act for you, if you can&rsquo;t act for
        yourself. If you own a property and have a Lasting Power of Attorney in
        place I recommend you seek independent legal advice.
      </p>

      {/* ── Buildings Insurance ── */}
      <p className="fw-bold mb-1 mt-3">Buildings Insurance</p>
      <p>
        It is a condition of the mortgage that you have appropriate and adequate
        buildings insurance in place. Where you are purchasing a home, the
        policy should be put in place at exchange of contracts. A copy of the
        insurance certificate will be required by your solicitor.
      </p>
      <p>We discussed your building insurance requirements.</p>

      <Dropdown
        isOpen={isHomeInsuranceOptionOpen}
        toggle={() => setIsHomeInsuranceOptionOpen((p) => !p)}
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
          {selectedHomeInsuranceOption ? (
            selectedHomeInsuranceOption.label
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
          {homeInsuranceOptions.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => onFormChange({ home_insurance: option.value })}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      <div className="mt-2">
        <AdvisorNote>
          (Where recommendation is declined, please include the reason)
        </AdvisorNote>
      </div>

      {/* ── Wills ── */}
      <p className="fw-bold mb-1 mt-3">Wills</p>
      <p>
        Owning a property impacts your overall financial wealth and your wishes
        for the property upon death should be detailed in a legal will. If you
        don&rsquo;t have a will, I recommend you speak to a solicitor to create
        one and keep it updated on a regular basis.
      </p>

      <Divider />

      {/* ══════════════════════════════
          HELP US IMPROVE
      ══════════════════════════════ */}
      <p className="fw-bold mb-1">Help us to improve our service</p>
      <p>
        We would love to know what you think about our service. This helps us to
        better understand our customers and improve the way we work.{" "}
        <span style={{ color: blue }}>{companyName}</span> will send you an
        email link to complete a short survey. We appreciate you taking the time
        to complete this.
      </p>

      <Divider />

      {/* ══════════════════════════════
          SIGNATURE
      ══════════════════════════════ */}
      <p>Yours sincerely,</p>
      <p className="mb-0 fw-bold" style={{ color: blue }}>
        {advisorName}
      </p>
      <p style={{ color: blue }}>{companyName}</p>

      <AdvisorNote>
        (This Recommendation letter must be sent to all parties to the mortgage,
        including any Guarantors. Please evidence this and attach the screen
        shot to QOP)
      </AdvisorNote>

      <p className="mt-3 mb-0">If applicable:</p>
      <p className="mb-0">
        This Recommendation Letter is also being sent by email/post to:
      </p>
      <p style={{ color: "#2e7d32" }}>
        {additionalRecipients || "[Insert email / address]"}
      </p>
    </>
  );
};

export default RecommendationLetter;
