import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
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
}

const RecommendationLetter: React.FC<RecommendationLetterProps> = ({
  caseData,
  suitability,
}) => {
  const blue = "#1565c0";
  const s = suitability;

  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);

  const advisorName = caseData?.advisor_name ?? "Faye Jennings";
  const advisorJobTitle = caseData?.advisor_job_title ?? "Mortgage Advisor";
  const advisorEmail = caseData?.advisor_email ?? "faye@cityplusnetwork.co.uk";
  const advisorPhone = caseData?.advisor_phone ?? "020 8050 2479";
  const companyName = caseData?.company_name ?? "Cityplus Network";
  const companyAddress =
    caseData?.company_address ?? "77 Marsh Wall\nLondon\nE14 9SH";
  const clientAddress =
    caseData?.client_address ?? "77 Client Street\nLondon\nE1X 9XX";
  const propertyAddress =
    caseData?.property_address ?? "77 Client Street, London, E1X 9XX";
  const additionalRecipients = caseData?.additional_recipients ?? "";

  const [selectedTransactionType, setSelectedTransactionType] = useState<
    string | null
  >(null);
  const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);
  const [lenderReason, setLenderReason] = useState("");
  const [savedLenderReason, setSavedLenderReason] = useState("");
  const [isLenderEditing, setIsLenderEditing] = useState(false);
  const [interestRateReason, setInterestRateReason] = useState("");
  const [savedInterestRateReason, setSavedInterestRateReason] = useState("");
  const [isInterestRateEditing, setIsInterestRateEditing] = useState(false);
  const [initialInterestRateReason, setInitialInterestRateReason] =
    useState("");
  const [savedInitialInterestRateReason, setSavedInitialInterestRateReason] =
    useState("");
  const [isInitialInterestRateEditing, setIsInitialInterestRateEditing] =
    useState(false);
  const [selectedMortgageOption, setSelectedMortgageOption] =
    useState<React.ReactNode | null>(null);
  const [isMortgageOptionOpen, setIsMortgageOptionOpen] = useState(false);
  const [selectedArrangementOption, setSelectedArrangementOption] =
    useState<React.ReactNode | null>(null);
  const [isArrangementOptionOpen, setIsArrangementOptionOpen] = useState(false);

  const [mortgageTermAdd, setMortgageTermAdd] = useState("");
  const [savedMortgageTerm, setSavedMortgageTerm] = useState("");
  const [isMortgageTermEditing, setIsMortgageTermEditing] = useState(false);

  const [selectedErcOption, setSelectedErcOption] =
    useState<React.ReactNode | null>(null);
  const [isErcOptionOpen, setIsErcOptionOpen] = useState(false);
  const [selectedErcMeaningOption, setSelectedErcMeaningOption] =
    useState<React.ReactNode | null>(null);
  const [isErcMeaningOptionOpen, setIsErcMeaningOptionOpen] = useState(false);
  const [selectedErcWhyOption, setSelectedErcWhyOption] =
    useState<React.ReactNode | null>(null);
  const [isErcWhyOptionOpen, setIsErcWhyOptionOpen] = useState(false);
  const [selectedPortableOption, setSelectedPortableOption] =
    useState<React.ReactNode | null>(null);
  const [isPortableOptionOpen, setIsPortableOptionOpen] = useState(false);
  const [selectedPortableMeaningOption, setSelectedPortableMeaningOption] =
    useState<React.ReactNode | null>(null);
  const [isPortableMeaningOptionOpen, setIsPortableMeaningOptionOpen] =
    useState(false);

  const [selectedPortableWhyOption, setSelectedPortableWhyOption] = useState<
    number | null
  >(null);
  const [isPortableWhyOptionOpen, setIsPortableWhyOptionOpen] = useState(false);

  const [portableWhyReason, setPortableWhyReason] = useState("");
  const [savedPortableWhyReason, setSavedPortableWhyReason] = useState("");
  const [isPortableWhyEditing, setIsPortableWhyEditing] = useState(false);
  const [selectedRateSwitchOption, setSelectedRateSwitchOption] = useState<
    number | null
  >(null);
  const [isRateSwitchOptionOpen, setIsRateSwitchOptionOpen] = useState(false);
  const [selectedProtectionOption, setSelectedProtectionOption] = useState<
    number | null
  >(null);
  const [isProtectionOptionOpen, setIsProtectionOptionOpen] = useState(false);

  const [protectionReason, setProtectionReason] = useState("");
  const [savedProtectionReason, setSavedProtectionReason] = useState("");
  const [isProtectionEditing, setIsProtectionEditing] = useState(false);
  const [selectedHomeInsuranceOption, setSelectedHomeInsuranceOption] =
    useState<React.ReactNode | null>(null);
  const [isHomeInsuranceOptionOpen, setIsHomeInsuranceOptionOpen] =
    useState(false);

  const handleLenderSave = () => {
    setSavedLenderReason(lenderReason);
    setIsLenderEditing(false);
  };

  const handleLenderCancel = () => {
    setLenderReason(savedLenderReason);
    setIsLenderEditing(false);
  };

  const handleInterestRateSave = () => {
    setSavedInterestRateReason(interestRateReason);
    setIsInterestRateEditing(false);
  };

  const handleInterestRateCancel = () => {
    setInterestRateReason(savedInterestRateReason);
    setIsInterestRateEditing(false);
  };

  const handleInitialInterestRateSave = () => {
    setSavedInitialInterestRateReason(initialInterestRateReason);
    setIsInitialInterestRateEditing(false);
  };

  const handleInitialInterestRateCancel = () => {
    setInitialInterestRateReason(savedInitialInterestRateReason);
    setIsInitialInterestRateEditing(false);
  };

  const handleMortgageTermSave = () => {
    setSavedMortgageTerm(mortgageTermAdd);
    setIsMortgageTermEditing(false);
  };

  const handleMortgageTermCancel = () => {
    setMortgageTermAdd(savedMortgageTerm);
    setIsMortgageTermEditing(false);
  };

  const handlePortableWhySave = () => {
    setSavedPortableWhyReason(portableWhyReason);
    setIsPortableWhyEditing(false);
  };

  const handlePortableWhyCancel = () => {
    setPortableWhyReason(savedPortableWhyReason);
    setIsPortableWhyEditing(false);
  };

  const protectionOptionsWithReason = [1, 2];

  const handleProtectionSave = () => {
    setSavedProtectionReason(protectionReason);
    setIsProtectionEditing(false);
  };

  const handleProtectionCancel = () => {
    setProtectionReason(savedProtectionReason);
    setIsProtectionEditing(false);
  };

  const transactionTypes = ["purchase", "remortgage", "product transfer"];

  const mortgageOptions = [
    "Your mortgage includes additional funds required for the home improvements detailed at the beginning of this letter.",
    "Your mortgage includes additional funds to repay debts. I have explained the disadvantages to adding debts to your mortgage in the 'important information' section of this letter. Please read this carefully.",
    "Your mortgage includes additional funds as per the reasons stated at the beginning of this letter.",
    "The mortgage amount I am recommending is equal to what is currently outstanding on the mortgage.",
    <>
      The mortgage amount is less than what you currently have outstanding on
      your mortgage, this is because you are making an overpayment of{" "}
      <span style={{ color: blue }}>[amount]</span>.
    </>,
    "Your mortgage is equal to the purchase price of the property, minus your deposit.",
  ];

  const arrangementOptions = [
    "You have chosen to add the arrangement fee to your mortgage. This will mean you incur interest on this amount for the duration of the mortgage. The mortgage illustration I have provided contains further details.",
    "Your preference was to pay the arrangement fee up front therefore, no fees were added to the loan.",
    "The recommended mortgage does not have an arrangement fee.",
  ];

  const ercOptions = [
    "Early repayment charges will apply during your initial rate period.",
    "Early repayment charges do not apply to your mortgage.",
  ];

  const ercMeaningOptions = [
    "Early repayment charges will apply during your initial rate period. Please see the mortgage illustration I provided for further details.",
    "Early repayment charges do not apply to your mortgage.",
  ];

  const ercWhyOptions = [
    "Charges will apply if you choose to repay all or part of your mortgage before the end of the initial deal period. Please see your mortgage illustration for details of any overpayment allowance.",
    "There are no early repayment charges associated with your recommended mortgage deal. However, the lender may charge an administration fee.",
    "You have no intention of moving or repaying the mortgage in part or in full during the initial deal period, so are happy to accept that the product has early repayment charges, to secure the deal.",
    "It was your preference to have the flexibility to repay the mortgage in part or in full during the initial deal period, without incurring early repayment charges for doing so.",
  ];

  const portableOptions = [
    "Your mortgage is portable",
    "Your mortgage is not portable",
  ];

  const portableMeaningOptions = [
    "Subject to lender agreement at the time, you may be able to transfer the mortgage to another property if you move home.",
    "If you move home, you will not be able to transfer the mortgage to a new property, you will need to repay it.",
  ];

  const portableWhyOptionTemplates = [
    "I recommended a mortgage which is portable because",
    "I recommended a mortgage which is not portable because",
  ];

  const rateSwitchOptions = [
    "Option 1 – Customer's responsibility",
    "Option 2 – AR informal / non-binding checks",
    "Option 3 – Committed service",
  ];

  const protectionOptionTemplates = [
    "I recommend you seek advice from a specialist protection advisor.",
    "You decided not to accept my protection recommendations because",
    "I am not recommending you take out any new protection policies because",
    "You will receive a further recommendation letter from me relating to the protection advice I have given.",
    "It is important we discuss protecting your mortgage & finances, please confirm when you are available to do so.",
  ];

  const homeInsuranceOptions = [
    "You will receive a further recommendation letter from me relating to your home insurance.",
    "It is important we discuss your home insurance before exchange of contracts, please confirm when you are available to do so.",
    "You have confirmed that you would prefer to arrange your own cover and do not need my advice on this matter.",
    "I recommend you seek advice from a specialist for this cover.",
  ];

  const clientName =
    caseData?.applicants
      ?.map((a: any) => `${a.title ?? ""} ${a.full_name ?? ""}`.trim())
      .filter(Boolean)
      .join(" & ") ?? "Mr & Mrs Client";

  const lender = caseData?.lender_name ?? "HSBC";
  const initialRate = caseData?.initial_rate ?? "3.86%";
  const rateType = caseData?.rate_type ?? "Fixed";
  const dealEndDate = caseData?.deal_end_date ?? "30/09/2030";
  const repaymentMethod = caseData?.repayment_method ?? "Repayment";
  const mortgageTerm = caseData?.mortgage_term ?? "20 years and 0 months";
  const maxERC = caseData?.max_erc ? `£${caseData.max_erc}` : "£X";

  const fmtGBP = (val: any) =>
    val
      ? `£${Number(val).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
      : null;

  const mortgageAmount = fmtGBP(caseData?.mortgage_amount) ?? "£110,000.00";
  const monthlyRepayment = fmtGBP(caseData?.monthly_repayment) ?? "£657.81";
  const arrangementFee = fmtGBP(caseData?.arrangement_fee) ?? "£X or N/A";

  const circumAnswers =
    s?.circumstances_objectives?.circumstances_type === "SHARIA"
      ? [
          s?.circumstances_objectives?.question_one_sharia,
          s?.circumstances_objectives?.question_two_sharia,
        ]
      : [
          s?.circumstances_objectives?.question_one_answer,
          s?.circumstances_objectives?.question_two_answer,
          s?.circumstances_objectives?.question_three_answer,
        ];

  const lenderAnswers =
    s?.recommending_mortgage_lender?.recommending_mortgage_lender_type ===
    "SHARIA"
      ? [s?.recommending_mortgage_lender?.question_one_sharia]
      : [
          s?.recommending_mortgage_lender?.question_one_answer,
          s?.recommending_mortgage_lender?.question_two_answer,
          s?.recommending_mortgage_lender?.question_three_answer,
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

  const termAnswers =
    s?.recommending_term?.recommending_term === "SHARIA"
      ? [s?.recommending_term?.question_one]
      : [s?.recommending_term?.question_one_answer];

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

  const protectionAnswers = [
    s?.protection?.question_one_answer,
    s?.protection?.question_two_answer,
    s?.protection?.question_three_answer,
    s?.protection?.question_four_answer,
    s?.protection?.question_one_sharia,
    s?.protection?.question_two,
    s?.protection?.question_three_sharia,
    s?.protection?.question_four_sharia,
  ];

  const buildingsAnswers = [
    s?.buildings_insurance?.question_one_answer,
    s?.buildings_insurance?.question_two_answer,
    s?.buildings_insurance?.question_three_answer,
    s?.buildings_insurance?.question_four_answer,
    s?.buildings_insurance?.question_one,
    s?.buildings_insurance?.question_two,
    s?.buildings_insurance?.question_three_sharia,
    s?.buildings_insurance?.question_five_sharia,
  ];

  const willsAnswers = [
    s?.wills?.question_one_answer,
    s?.wills?.question_two_answer,
    s?.wills?.question_three_answer,
    s?.wills?.question_one,
  ];

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
          Prepared for <strong style={{ color: blue }}>{clientName}</strong>
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
        Dear <span style={{ color: blue }}>{clientName}</span>,
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
        <Dropdown
          isOpen={isTransactionTypeOpen}
          toggle={() => setIsTransactionTypeOpen((prev) => !prev)}
          className="d-inline-block"
        >
          <DropdownToggle
            tag="span"
            style={{
              color: "#6a1b9a",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {selectedTransactionType ?? "(select type...)"}
          </DropdownToggle>
          <DropdownMenu>
            {transactionTypes.map((type, index) => (
              <DropdownItem
                key={index}
                onClick={() => setSelectedTransactionType(type)}
              >
                {type}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>{" "}
        of <strong style={{ color: blue }}>{propertyAddress}</strong>.
      </p>

      {circumAnswers.filter(Boolean).length > 0 ? (
        <div
          className="p-3 mb-3 rounded"
          style={{ background: "#f1f8e9", borderLeft: "4px solid #81c784" }}
        >
          <SuitAnswers answers={circumAnswers} />
        </div>
      ) : (
        <AdvisorNote>
          (add soft facts about the transaction / what the clients overall goals
          were that were relevant to the advice and any other general
          information you feel is important to build a picture of the advice you
          have given)
        </AdvisorNote>
      )}

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
            <td style={{ color: blue }}>
              {initialRate} {rateType} until {dealEndDate}
            </td>
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
              <span className="">
                I have recommended <strong>{lender}</strong> because{" "}
                {isLenderEditing ? (
                  <span className="d-block w-100 mt-1">
                    <Input
                      type="textarea"
                      rows={5}
                      value={lenderReason}
                      onChange={(e) => setLenderReason(e.target.value)}
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
                    onClick={() => setIsLenderEditing(true)}
                    title="Click to edit"
                  >
                    {savedLenderReason || "click to add reason..."}
                  </span>
                )}
              </span>
            </td>
          </tr>

          {/* ── 2. Interest Rate Type ── */}
          <tr>
            <td className="fw-bold">Interest Rate Type</td>
            <td style={{ color: blue }}>{rateType}</td>
            <td>Your payments will not change during the initial period.</td>
            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
              <span className="">
                You wanted the certainty of knowing exactly what your monthly
                payments will be because{" "}
                {isInterestRateEditing ? (
                  <span className="d-block w-100 mt-1">
                    <Input
                      type="textarea"
                      rows={5}
                      value={interestRateReason}
                      onChange={(e) => setInterestRateReason(e.target.value)}
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
                    onClick={() => setIsInterestRateEditing(true)}
                    title="Click to edit"
                  >
                    {savedInterestRateReason || "click to add reason..."}
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
              <span className="">
                I recommend a period of 5 years because{" "}
                {isInitialInterestRateEditing ? (
                  <span className="d-block w-100 mt-1">
                    <Input
                      type="textarea"
                      rows={5}
                      value={initialInterestRateReason}
                      onChange={(e) =>
                        setInitialInterestRateReason(e.target.value)
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
                    onClick={() => setIsInitialInterestRateEditing(true)}
                    title="Click to edit"
                  >
                    {savedInitialInterestRateReason || "click to add reason..."}
                  </span>
                )}
              </span>

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
                toggle={() => setIsMortgageOptionOpen((prev) => !prev)}
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
                  {selectedMortgageOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {mortgageOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => {
                        setSelectedMortgageOption(option);
                      }}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option}
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
                toggle={() => setIsArrangementOptionOpen((prev) => !prev)}
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
                  {selectedArrangementOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {arrangementOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => {
                        setSelectedArrangementOption(option);
                      }}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option}
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
              <span className="">
                The term has been recommended because{" "}
                {isMortgageTermEditing ? (
                  <span className="d-block w-100 mt-1">
                    <Input
                      type="textarea"
                      rows={5}
                      value={mortgageTermAdd}
                      onChange={(e) => setMortgageTermAdd(e.target.value)}
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
                    onClick={() => setIsMortgageTermEditing(true)}
                    title="Click to edit"
                  >
                    {savedMortgageTerm || "click to add reason..."}
                  </span>
                )}
              </span>
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
              <Dropdown
                isOpen={isErcOptionOpen}
                toggle={() => setIsErcOptionOpen((prev) => !prev)}
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
                  {selectedErcOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {ercOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedErcOption(option)}
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
                isOpen={isErcMeaningOptionOpen}
                toggle={() => setIsErcMeaningOptionOpen((prev) => !prev)}
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
                  {selectedErcMeaningOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {ercMeaningOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedErcMeaningOption(option)}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option}
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
              <Dropdown
                isOpen={isErcWhyOptionOpen}
                toggle={() => setIsErcWhyOptionOpen((prev) => !prev)}
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
                  {selectedErcWhyOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {ercWhyOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedErcWhyOption(option)}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option}
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
              <Dropdown
                isOpen={isPortableOptionOpen}
                toggle={() => setIsPortableOptionOpen((prev) => !prev)}
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
                  {selectedPortableOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {portableOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedPortableOption(option)}
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
                isOpen={isPortableMeaningOptionOpen}
                toggle={() => setIsPortableMeaningOptionOpen((prev) => !prev)}
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
                  {selectedPortableMeaningOption ?? (
                    <span className="text-muted fst-italic">
                      Click to choose an option...
                    </span>
                  )}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {portableMeaningOptions.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedPortableMeaningOption(option)}
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
              {/* Dropdown */}
              <Dropdown
                isOpen={isPortableWhyOptionOpen}
                toggle={() => setIsPortableWhyOptionOpen((prev) => !prev)}
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
                  {selectedPortableWhyOption !== null ? (
                    portableWhyOptionTemplates[selectedPortableWhyOption]
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
                  {portableWhyOptionTemplates.map((option, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => {
                        setSelectedPortableWhyOption(index);
                        setIsPortableWhyEditing(false);
                      }}
                      className="text-wrap"
                    >
                      <span className="me-1 fw-bolder">•</span>
                      {option} <span style={{ color: blue }}>[reason]</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Reason field — only shown after an option is selected */}
              {selectedPortableWhyOption !== null && (
                <span className="d-block mt-2">
                  {portableWhyOptionTemplates[selectedPortableWhyOption]}{" "}
                  {isPortableWhyEditing ? (
                    <span className="d-block w-100 mt-1">
                      <Input
                        type="textarea"
                        rows={5}
                        value={portableWhyReason}
                        onChange={(e) => setPortableWhyReason(e.target.value)}
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
                      onClick={() => setIsPortableWhyEditing(true)}
                      title="Click to edit"
                    >
                      {savedPortableWhyReason || "click to add reason..."}
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

        {/* Dropdown */}
        <Dropdown
          isOpen={isRateSwitchOptionOpen}
          toggle={() => setIsRateSwitchOptionOpen((prev) => !prev)}
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
            {selectedRateSwitchOption !== null ? (
              rateSwitchOptions[selectedRateSwitchOption]
            ) : (
              <span className="text-muted fst-italic">
                Select rate-switch option...
              </span>
            )}
          </DropdownToggle>
          <DropdownMenu
            className="w-100"
            style={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {rateSwitchOptions.map((option, index) => (
              <DropdownItem
                key={index}
                onClick={() => setSelectedRateSwitchOption(index)}
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Selected option content */}
        {selectedRateSwitchOption !== null && (
          <div className="mt-3 small" style={{ color: "#6a1b9a" }}>
            {selectedRateSwitchOption === 0 && (
              <>
                <p className="fw-semibold mb-1">
                  Option 1 – Customer&rsquo;s responsibility:
                </p>
                <p className="mb-0">
                  The recommended lender offers the opportunity for you to
                  switch to a lower, like-for-like mortgage deal, should one
                  become available prior to the completion. However, the lender
                  will <u>not</u> contact you to tell you if their rates reduce.
                  You should review published rates periodically to check if
                  they have reduced. Terms and conditions apply – including how
                  far in advance of the completion date your lender needs to
                  receive your instruction to change rate. Please ensure that
                  you check these to avoid missing any potential rate change
                  deadline.
                </p>
              </>
            )}

            {selectedRateSwitchOption === 1 && (
              <>
                <p className="fw-semibold mb-1">
                  Option 2 – AR informal / non-binding checks:
                </p>
                <p className="mb-0">
                  The recommended lender offers the opportunity for you to
                  switch to a lower, like-for-like mortgage deal, should one
                  become available prior to the completion. However, the lender
                  will <u>not</u> contact you to tell you if their rates reduce.
                  We will notify you <strong>if</strong> we identify that a
                  reduced rate is available. We do not guarantee to identify
                  every change in interest rates. It is important, therefore,
                  that you also check the lenders rates periodically between now
                  and the mortgage completion date. Please note that the timing
                  of your completion date may mean there is a final date when
                  changes to the rate can be made.
                </p>
              </>
            )}

            {selectedRateSwitchOption === 2 && (
              <>
                <p className="fw-semibold mb-1">
                  Option 3 – Committed service:
                </p>
                <p className="mb-0">
                  We will check the lender rates at least every{" "}
                  <span style={{ color: blue }}>(period)</span> and we will
                  notify you if we identify a lower interest rate. Please note
                  that the timing of your completion date may mean there is a
                  final date when changes can be made.
                </p>
              </>
            )}
          </div>
        )}
        {/* AdvisorNote always visible after any selection */}
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
      {/* Dropdown */}
      <Dropdown
        isOpen={isProtectionOptionOpen}
        toggle={() => setIsProtectionOptionOpen((prev) => !prev)}
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
          {selectedProtectionOption !== null ? (
            protectionOptionTemplates[selectedProtectionOption]
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
          {protectionOptionTemplates.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => {
                setSelectedProtectionOption(index);
                // Reset reason when switching options
                setProtectionReason("");
                setSavedProtectionReason("");
                setIsProtectionEditing(false);
              }}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              {option}{" "}
              {protectionOptionsWithReason.includes(index) && (
                <span style={{ color: blue }}>[reason]</span>
              )}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Reason field — only for options that require a reason */}
      {selectedProtectionOption !== null &&
        protectionOptionsWithReason.includes(selectedProtectionOption) && (
          <span className="d-block mt-2">
            {protectionOptionTemplates[selectedProtectionOption]}{" "}
            {isProtectionEditing ? (
              <span className="d-block w-100 mt-1">
                <Input
                  type="textarea"
                  rows={5}
                  value={protectionReason}
                  onChange={(e) => setProtectionReason(e.target.value)}
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
                onClick={() => setIsProtectionEditing(true)}
                title="Click to edit"
              >
                {savedProtectionReason || "click to add reason..."}
              </span>
            )}
          </span>
        )}

      {/* {protectionAnswers.filter(Boolean).length > 0 && (
        <div className="mt-2">
          <SuitAnswers answers={protectionAnswers} />
        </div>
      )} */}

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
        toggle={() => setIsHomeInsuranceOptionOpen((prev) => !prev)}
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
          {selectedHomeInsuranceOption ?? (
            <span className="text-muted fst-italic">
              Click to choose an option...
            </span>
          )}
        </DropdownToggle>
        <DropdownMenu
          className="w-100"
          style={{ whiteSpace: "normal", wordBreak: "break-word" }}
        >
          {homeInsuranceOptions.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => setSelectedHomeInsuranceOption(option)}
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              {option}
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

      {willsAnswers.filter(Boolean).length > 0 && (
        <SuitAnswers answers={willsAnswers} />
      )}

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
