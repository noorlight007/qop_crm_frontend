import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useGetCaseLoanDetailsQuery,
  useGetLoanDetailsQuery,
  useUpdateLoanDetailsMutation,
  useValidateLoanDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/LoanDetails/LoanDetailsApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { LoanDetailsTabContentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/LoanDetailsTypes";
import getCurrencySign from "@/utils/currency";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import LenderList from "@/utils/LenderList";
import { skipToken } from "@reduxjs/toolkit/query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

export const LoanDetailsTabContent: React.FC<LoanDetailsTabContentProps> = ({
  tabId,
  setTabId,
}) => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const { data, isLoading, isError } = useGetCaseLoanDetailsQuery(casealias);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<"save" | "save_next" | null>(
    null,
  );
  const [attemptedTabs, setAttemptedTabs] = useState<Set<string>>(new Set());

  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
    return undefined;
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const data = err?.data || (err?.error && err.error.data) || err;
    const recurse = (value: any, path: string[] = []) => {
      if (value == null) return;
      if (typeof value === "string") {
        out[path.join(".")] = value;
        return;
      }
      if (Array.isArray(value)) {
        out[path.join(".")] = value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(", ");
        return;
      }
      if (typeof value === "object") {
        for (const k of Object.keys(value)) {
          recurse(value[k], path.concat(k));
        }
        return;
      }
      out[path.join(".")] = String(value);
    };

    recurse(data, []);
    return out;
  };

  // Determine which tab contains an error based on the parsed error keys
  const findTabFromErrors = (
    errorsObj: Record<string, string>,
  ): string | null => {
    const keys = Object.keys(errorsObj || {});
    // prepare snake_case lists for each tab
    const tab1Fields = Object.keys(formDataTab1).map(camelToSnake);
    const tab2Fields = Object.keys(formDataTab2).map(camelToSnake);
    const tab3Fields = Object.keys(formDataTab3).map(camelToSnake);
    const tab4Fields = Object.keys(formDataTab4).map(camelToSnake);

    for (const k of keys) {
      const lower = k.toLowerCase();
      if (tab1Fields.some((f) => lower.includes(f))) return "1";
      if (tab2Fields.some((f) => lower.includes(f))) return "2";
      if (tab3Fields.some((f) => lower.includes(f))) return "3";
      if (tab4Fields.some((f) => lower.includes(f))) return "4";
    }
    return null;
  };

  // Ensure `data` exists and has elements before accessing `[0]`
  const loandetailsAlias =
    Array.isArray(data) && data.length > 0 ? data[0].alias : null;

  const { data: loandetailsData, isLoading: isLoandetailsDataLoading } =
    useGetLoanDetailsQuery(
      loandetailsAlias
        ? { case_alias: casealias, loanDetails_alias: loandetailsAlias }
        : skipToken,
    );
  const [updateLoanDetails, { isLoading: isUpdating }] =
    useUpdateLoanDetailsMutation();
  // Validation mutation (does not invalidate cache)
  const [validateLoanDetails, { isLoading: isValidating }] =
    useValidateLoanDetailsMutation();

  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  // Initialize form states with default values
  const [formDataTab1, setFormDataTab1] = useState({
    application_type: "",
    lenders_reference: "",
    mortgage_type: "",
    loan_purpose: "",
    borrower_type: "",
    interest_rate_type: "",
    interest_rate: 0,
    product_term: "",
    lender: "",
    other_lender_note: "",
    repayment_method: "",
    repayment_vehicle: "",
  });

  const [formDataTab2, setFormDataTab2] = useState({
    mortgage_type: "",
    property_valuation: 0,
    purchase_price: 0,
    loan_amount: 0,
    estimated_value: 0,
    ltv: null as string | null,
    term_years: 0,
    term_months: 0,
    interest_only_amount: null as string | null,
    outstanding_balance: "",
    deposit_amount: 0,
    deposit_source: null as string | null,
    current_monthly_payment: null as string | null,
    current_lender: "",
    current_lender_other_note: "",
    original_purchase_price: 0,
    date_of_purchase: null as string | null,
    advice_level: "",
  });

  const [formDataTab3, setFormDataTab3] = useState({
    dip_accept_date: null as string | null,
    dip_expiry_date: null as string | null,
    expected_completion_date: null as string | null,
    product_expiry_date: null as string | null,
    case_submitted: null as string | null,
    valuation_instructed_date: null as string | null,
    valuation_booked_date: null as string | null,
    valuation_received_date: null as string | null,
    valuation_expiry_date: null as string | null,
    case_offered_date: null as string | null,
    stage_expiry_date: null as string | null,
    legals_instructed_date: null as string | null,
    exchange_of_contracts_date: null as string | null,
    case_completed_date: null as string | null,
    review_date: null as string | null,
  });

  const [formDataTab4, setFormDataTab4] = useState({
    sale_type: "",
    introduction_type: "",
    lead_source: "",
    introducer_payment_terms: "",
    introducer_fee: null as string | null,
    reasons_for_capital_raising: "",
    accepted_or_declined_by_lender: false,
    case_summary: "",
    note: "",
  });

  // Update form data when `loandetailsData` is loaded
  useEffect(() => {
    if (loandetailsData) {
      setFormDataTab1({
        application_type: loandetailsData.application_type || "",
        lenders_reference: loandetailsData.lenders_reference || "",
        mortgage_type: loandetailsData.mortgage_type || "",
        loan_purpose: loandetailsData.loan_purpose || "",
        borrower_type: loandetailsData.borrower_type || "",
        interest_rate_type: loandetailsData.interest_rate_type || "",
        interest_rate: loandetailsData.interest_rate || 0,
        product_term: loandetailsData.product_term || "",
        lender: loandetailsData.lender || "",
        other_lender_note: loandetailsData.other_lender_note || "",
        repayment_method: loandetailsData.repayment_method || "",
        repayment_vehicle: loandetailsData.repayment_vehicle || "",
      });

      setFormDataTab2({
        mortgage_type: loandetailsData.mortgage_type || "",
        property_valuation: loandetailsData.property_valuation || 0,
        purchase_price: loandetailsData.purchase_price || 0,
        loan_amount: loandetailsData.loan_amount || 0,
        estimated_value: loandetailsData.estimated_value || 0,
        ltv: loandetailsData.ltv || null,
        term_years: loandetailsData.term_years || 0,
        term_months: loandetailsData.term_months || 0,
        interest_only_amount: loandetailsData.interest_only_amount || 0,
        outstanding_balance: loandetailsData.outstanding_balance || "",
        deposit_amount: loandetailsData.deposit_amount || 0,
        deposit_source: loandetailsData.deposit_source || null,
        current_monthly_payment:
          loandetailsData.current_monthly_payment || null,
        current_lender: loandetailsData.current_lender || "",
        current_lender_other_note:
          loandetailsData.current_lender_other_note || "",
        original_purchase_price: loandetailsData.original_purchase_price || 0,
        date_of_purchase: loandetailsData.date_of_purchase || null,
        advice_level: loandetailsData.advice_level || "",
      });

      setFormDataTab3({
        dip_accept_date: loandetailsData.dip_accept_date || null,
        dip_expiry_date: loandetailsData.dip_expiry_date || null,
        expected_completion_date:
          loandetailsData.expected_completion_date || null,
        product_expiry_date: loandetailsData.product_expiry_date || null,
        case_submitted: loandetailsData.case_submitted || null,
        valuation_instructed_date:
          loandetailsData.valuation_instructed_date || null,
        valuation_booked_date: loandetailsData.valuation_booked_date || null,
        valuation_received_date:
          loandetailsData.valuation_received_date || null,
        valuation_expiry_date: loandetailsData.valuation_expiry_date || null,
        case_offered_date: loandetailsData.case_offered_date || null,
        stage_expiry_date: loandetailsData.stage_expiry_date || null,
        legals_instructed_date: loandetailsData.legals_instructed_date || null,
        exchange_of_contracts_date:
          loandetailsData.exchange_of_contracts_date || null,
        case_completed_date: loandetailsData.case_completed_date || null,
        review_date: loandetailsData.review_date || null,
      });

      setFormDataTab4({
        sale_type: loandetailsData.sale_type || "",
        introduction_type: loandetailsData.introduction_type || "",
        lead_source: loandetailsData.lead_source || "",
        introducer_payment_terms:
          loandetailsData.introducer_payment_terms || "",
        introducer_fee: loandetailsData.introducer_fee || null,
        reasons_for_capital_raising:
          loandetailsData.reasons_for_capital_raising || "",
        accepted_or_declined_by_lender:
          loandetailsData.accepted_or_declined_by_lender || false,
        case_summary: loandetailsData.case_summary || "",
        note: loandetailsData.note || "",
      });
    }
  }, [loandetailsData]); // Only run effect when `loandetailsData` changes

  // Handle form changes
  const handleFormChange = (tab: number, name: string, value: any) => {
    switch (tab) {
      case 1:
        setFormDataTab1((prev) => ({ ...prev, [name]: value }));
        // Sync mortgage_type between tab1 and tab2
        if (name === "mortgage_type") {
          setFormDataTab2((prev) => ({ ...prev, mortgage_type: value }));
        }
        break;
      case 2:
        setFormDataTab2((prev) => ({ ...prev, [name]: value }));
        break;
      case 3:
        setFormDataTab3((prev) => ({ ...prev, [name]: value || null }));
        break;
      case 4:
        setFormDataTab4((prev) => ({ ...prev, [name]: value }));
        break;
    }
  };

  // LTV calculation used by Tab 2
  const calculateLTV = (): string => {
    const estimatedValue =
      parseFloat(String(formDataTab2.estimated_value)) || 0;
    const loanAmount = parseFloat(String(formDataTab2.loan_amount)) || 0;

    if (!estimatedValue || !loanAmount) return "";

    const ltv = (loanAmount / estimatedValue) * 100;
    return ltv.toFixed(2);
  };

  const isLoanExceedingBase = (): boolean => {
    const estimatedValue =
      parseFloat(String(formDataTab2.estimated_value)) || 0;
    const loanAmount = parseFloat(String(formDataTab2.loan_amount)) || 0;

    if (!loanAmount || !estimatedValue) return false;

    return loanAmount > estimatedValue;
  };

  // Sync calculated LTV into form state when relevant fields change
  useEffect(() => {
    const calculatedLTV = calculateLTV();
    if (calculatedLTV !== "" && calculatedLTV !== formDataTab2.ltv) {
      handleFormChange(2, "ltv", calculatedLTV);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formDataTab2.property_valuation,
    formDataTab2.purchase_price,
    formDataTab2.estimated_value,
    formDataTab2.loan_amount,
  ]);

  const isTab2Valid = () => {
    const isPropertyValuationVisible =
      formDataTab2.mortgage_type !== "PURCHASE";
    const isPurchasePriceVisible = formDataTab2.mortgage_type === "PURCHASE";

    const isPropertyValuationValid =
      isPropertyValuationVisible && formDataTab2.property_valuation > 0;
    const isPurchasePriceValid =
      isPurchasePriceVisible && formDataTab2.purchase_price > 0;

    return (
      (isPropertyValuationValid || isPurchasePriceValid) &&
      formDataTab2.loan_amount > 0 &&
      formDataTab2.estimated_value > 0
    );
  };

  // Refs to each tab form so HTML5 validation can be triggered
  const formRef1 = useRef<HTMLFormElement | null>(null);
  const formRef2 = useRef<HTMLFormElement | null>(null);
  const formRef3 = useRef<HTMLFormElement | null>(null);
  const formRef4 = useRef<HTMLFormElement | null>(null);

  const handleNext = async () => {
    const nextId = (parseInt(tabId) + 1).toString();

    // Mark this tab as attempted so inline warnings show
    setAttemptedTabs((prev) => new Set(prev).add(tabId));

    const currentForm =
      tabId === "1"
        ? formRef1.current
        : tabId === "2"
          ? formRef2.current
          : tabId === "3"
            ? formRef3.current
            : formRef4.current;

    if (currentForm) {
      try {
        const ok = currentForm.reportValidity();
        if (!ok) return;
      } catch (err) {
        console.warn("reportValidity failed", err);
      }
    }

    if (tabId === "2" && isLoanExceedingBase()) {
      toast.error("Loan Amount cannot be more than the Estimated Value");
      return;
    }

    try {
      const mergedData = {
        ...formDataTab1,
        ...formDataTab2,
        ...formDataTab3,
        ...formDataTab4,
      };

      const res = await validateLoanDetails({
        case_alias: casealias,
        loanDetails_alias: loandetailsAlias,
        mergedData,
      }).unwrap();

      setErrors({});
      setTabId(nextId);
    } catch (err: any) {
      const parsed = parseApiErrors(err);
      setErrors(parsed);
      const target = findTabFromErrors(parsed);
      if (target) setTabId(target);
      const firstMessage = Object.values(parsed)[0];
      toast.error(firstMessage || "Validation failed");
    }
  };

  const showFieldWarning = (tabId: string, value: any): boolean => {
    if (!attemptedTabs.has(tabId)) return false; // tab not submitted yet
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (typeof value === "number" && value <= 0) return true;
    return false;
  };

  const handleBack = () => setTabId((parseInt(tabId) - 1).toString());

  const handleSave = async (): Promise<boolean> => {
    const updatedLoanDetailsData = {
      ...formDataTab1,
      ...formDataTab2,
      ...formDataTab3,
      ...formDataTab4,
    };
    try {
      // Use unwrap so server-side validation errors are thrown and handled in catch
      const response = await updateLoanDetails({
        case_alias: casealias,
        loanDetails_alias: loandetailsAlias,
        mergedData: updatedLoanDetailsData,
      }).unwrap();

      // If unwrap succeeds, treat as success
      setErrors({});
      toast.success("Loan details updated successfully");
      try {
        await updateSectionCompleteStatus({
          case_alias: casealias,
          section_data: { is_loan_details: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }

      return true;
    } catch (error: any) {
      // API returned validation errors or other errors
      const parsed = parseApiErrors(error);
      if (Object.keys(parsed).length) {
        setErrors(parsed);
        const target = findTabFromErrors(parsed);
        if (target) setTabId(target);
        // Show first field message if present
        const firstMsg = Object.values(parsed)[0];
        toast.error(firstMsg || "Failed to update loan details");
        return false;
      }

      // Unexpected error
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
      return false;
    }
  };
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  if (isLoading || isLoandetailsDataLoading)
    return (
      <div className=" d-flex justify-content-center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>Error loading data</div>;
  return (
    <div>
      <TabContent activeTab={tabId} className="w-full">
        <TabPane tabId="1">
          <Form innerRef={formRef1}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Application Type</Label>
                  <Input
                    type="select"
                    name="application_type"
                    value={formDataTab1.application_type}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select......</option>
                    <option value="BUSINESS_LOAN">Business Loan</option>
                    <option value="BUY_TO_LET">Buy to Let Mortgage</option>
                    <option value="COMMERCIAL_MORTGAGE">
                      Commercial Mortgage
                    </option>
                    <option value="HMO_MORTGAGE">HMO Mortgage</option>
                    <option value="RESIDENTIAL_MORTGAGE">
                      Residential Mortgage
                    </option>
                    <option value="SECOND_CHARGE_MORTGAGE">
                      Second Charge Mortgage
                    </option>
                  </Input>
                  {getFieldError("application_type") && (
                    <FormText className="text-danger">
                      {getFieldError("application_type")}
                    </FormText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Mortgage Type</Label>
                  <Input
                    type="select"
                    name="mortgage_type"
                    value={formDataTab1.mortgage_type}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select......</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="REMORTGAGE">Remortgage</option>
                    <option value="SECURED_LOAN">Secured Loan</option>
                    <option value="FURTHER_ADVANCE">Further Advance</option>
                    <option value="PRODUCT_TRANSFER">Product Transfer</option>
                    <option value="OTHER">Other</option>
                    <option value="UNSECURED">Unsecured</option>
                    <option value="INVOICE_DISCOUNTING">
                      Invoice Discounting
                    </option>
                    <option value="ASSET_FINANCE">Asset Finance</option>
                  </Input>
                  {getFieldError("mortgage_type") && (
                    <FormText className="text-danger">
                      {getFieldError("mortgage_type")}
                    </FormText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Loan Purpose</Label>
                  <Input
                    type="select"
                    name="loan_purpose"
                    value={formDataTab1.loan_purpose}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select......</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="LIKE_FOR_LIKE_REMORTGAGE">
                      Like for Like Remortgage
                    </option>
                    <option value="BUSINESS_PURPOSES">Business Purposes</option>
                    <option value="DEBT_CONSOLIDATION">
                      Debt Consolidation
                    </option>
                    <option value="DIVORCE_SETTLEMENT">
                      Divorce Settlement
                    </option>
                    <option value="HOLIDAYS_CARS">Holidays/Cars</option>
                    <option value="HOME_IMPROVEMENTS">Home Improvements</option>
                    <option value="OTHER_PROPERTY_PURCHASE">
                      Other Property Purchase
                    </option>
                    <option value="SCHOOL_FEES">School Fees</option>
                    <option value="RATE_SWITCH">
                      Rate Switch (switch to better rate)
                    </option>
                    <option value="TAX_BILL">Tax Bill</option>
                  </Input>
                  {getFieldError("loan_purpose") && (
                    <FormText className="text-danger">
                      {getFieldError("loan_purpose")}
                    </FormText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Borrower Type</Label>
                  <Input
                    type="select"
                    name="borrower_type"
                    value={formDataTab1.borrower_type}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select......</option>
                    <option value="HOMEMOVER">Homemover</option>
                    <option value="FIRST_TIME_BUYER">First Time Buyer</option>
                    <option value="RE_MORTGAGE">Re-Mortgage</option>
                    <option value="CAPITAL_RAISE">Capital Raise</option>
                    <option value="HELP_TO_BUY">Help to Buy</option>
                    <option value="SHARED_OWNERSHIP">Shared Ownership</option>
                    <option value="RIGHT_TO_BUY">Right to Buy</option>
                    <option value="LATER_LIFE_LENDING">
                      Later Life Lending
                    </option>
                    <option value="EQUITY_RELEASE">Equity Release</option>
                    <option value="BUY_TO_LET">Buy to Let</option>
                    <option value="LET_TO_BUY">Let to Buy</option>
                    <option value="FIRST_TIME_LANDLORD">
                      First Time Landlord
                    </option>
                    <option value="PORTFOLIO_LANDLORD">
                      Portfolio Landlord
                    </option>
                    <option value="SHARED_EQUITY">Shared Equity</option>
                    <option value="ISLAMIC_MORTGAGE">Islamic Mortgage</option>
                  </Input>
                  {getFieldError("borrower_type") && (
                    <FormText className="text-danger">
                      {getFieldError("borrower_type")}
                    </FormText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Interest Rate Type</Label>
                  <Input
                    type="select"
                    name="interest_rate_type"
                    value={formDataTab1.interest_rate_type}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="FIXED">Fixed</option>
                    <option value="VARIABLE">Variable</option>
                    <option value="TRACKER">Tracker</option>
                    <option value="LIBOR_LINKED">Libor Linked</option>
                    <option value="DISCOUNT">Discount</option>
                    <option value="CAPPED">Capped</option>
                    <option value="ALL">All</option>
                  </Input>
                  {getFieldError("interest_rate_type") && (
                    <FormText className="text-danger">
                      {getFieldError("interest_rate_type")}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    Interest Rate{" "}
                    <small className="text-muted text-warning">
                      (This is Read-Only Field)
                    </small>
                  </Label>
                  <Input
                    type="text"
                    name="interest_rate"
                    readOnly
                    value={formDataTab1.interest_rate || 0}
                    placeholder="No value set yet"
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("interest_rate") && (
                    <FormText className="text-danger">
                      {getFieldError("interest_rate")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Product Term</Label>
                  <Input
                    type="select"
                    name="product_term"
                    value={formDataTab1.product_term}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="ONE_YEAR">1 Year</option>
                    <option value="TWO_YEARS">2 Years</option>
                    <option value="THREE_YEARS">3 Years</option>
                    <option value="FOUR_YEARS">4 Years</option>
                    <option value="FIVE_PLUS_YEARS">5+ Years</option>
                    <option value="FULL_TERM">Full Term</option>
                  </Input>
                  {getFieldError("product_term") && (
                    <FormText className="text-danger">
                      {getFieldError("product_term")}
                    </FormText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Lender</Label>
                  <Input
                    type="select"
                    name="lender"
                    value={formDataTab1.lender}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    {LenderList.map((lender) => (
                      <option key={lender.value} value={lender.value}>
                        {lender.label}
                      </option>
                    ))}
                  </Input>
                  {getFieldError("lender") && (
                    <FormText className="text-danger">
                      {getFieldError("lender")}
                    </FormText>
                  )}
                </FormGroup>
                {formDataTab1.lender === "OTHER" && (
                  <FormGroup>
                    <Label>Other Lender Note</Label>
                    <Input
                      type="text"
                      name="other_lender_note"
                      value={formDataTab1.other_lender_note}
                      onChange={(e) =>
                        handleFormChange(1, e.target.name, e.target.value)
                      }
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label>Repayment Method</Label>
                  <Input
                    type="select"
                    name="repayment_method"
                    value={formDataTab1.repayment_method}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="CAPITAL_AND_INTEREST">
                      Capital and Interest
                    </option>
                    <option value="INTEREST_ONLY">Interest Only</option>
                    <option value="PART_AND_PART">Part And Part</option>
                    {formDataTab1.borrower_type === "ISLAMIC_MORTGAGE" && (
                      <>
                        <option value="RENT_ONLY">Rent Only</option>
                        <option value="RENT_AND_ACQUISITION">
                          Rent And Acquisition
                        </option>
                      </>
                    )}
                  </Input>
                </FormGroup>

                {formDataTab1.repayment_method !== "CAPITAL_AND_INTEREST" && (
                  <FormGroup>
                    <Label>Repayment Vehicle</Label>
                    <Input
                      type="select"
                      name="repayment_vehicle"
                      value={formDataTab1.repayment_vehicle}
                      onChange={(e) =>
                        handleFormChange(1, e.target.name, e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="ENDOWMENT">Endowment</option>
                      <option value="INDIVIDUAL_SAVINGS_ACCOUNT">
                        Individual Savings Account
                      </option>
                      <option value="PENSION">Pension</option>
                      <option value="SALE_OF_MORTGAGED_PROPERTY">
                        Sale of Mortgaged Property
                      </option>
                      <option value="SALE_OF_OTHER_PROPERTY">
                        Sale of Other Property
                      </option>
                      <option value="INHERITANCE">Inheritance</option>
                      <option value="MORTGAGE_LINKED_INVESTMENT">
                        Mortgage-Linked Investment
                      </option>
                      <option value="REVERT_TO_CAPITAL_REPAYMENT">
                        Revert to Capital Repayment
                      </option>
                      <option value="SALE_OF_NON_PROPERTY_ASSETS">
                        Sale of non-Property Assets
                      </option>
                      <option value="OTHER">Other</option>
                    </Input>
                  </FormGroup>
                )}

                <FormGroup>
                  <Label>Lender's Reference</Label>
                  <Input
                    type="text"
                    name="lenders_reference"
                    value={formDataTab1.lenders_reference}
                    onChange={(e) =>
                      handleFormChange(1, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("lenders_reference") && (
                    <FormText className="text-danger">
                      {getFieldError("lenders_reference")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </Form>
          <Button color="primary" onClick={handleNext} className="float-end">
            {isValidating ? "Validating..." : "Next"}
          </Button>
        </TabPane>
        <TabPane tabId="2">
          <Form innerRef={formRef2}>
            <Row>
              {formDataTab2?.mortgage_type === "PURCHASE" ? (
                <Col md={6}>
                  <FormGroup>
                    <Label for="purchase_price">
                      Purchase Price({getCurrencySign()})
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="purchase_price"
                      placeholder="0"
                      required
                      min="0"
                      step="0.01"
                      value={formDataTab2.purchase_price || ""}
                      onInput={limitDecimalPlaces}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {showFieldWarning("2", formDataTab2.purchase_price) && (
                      <FormText className="text-danger">
                        Purchase Price is required
                      </FormText>
                    )}
                    {getFieldError("purchase_price") && (
                      <FormText className="text-danger">
                        {getFieldError("purchase_price")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              ) : (
                <Col md={6}>
                  <FormGroup>
                    <Label for="property_valuation">
                      Property Valuation({getCurrencySign()})
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="property_valuation"
                      placeholder="0"
                      required
                      min="0"
                      step="0.01"
                      value={formDataTab2.property_valuation || ""}
                      onInput={limitDecimalPlaces}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {showFieldWarning("2", formDataTab2.property_valuation) && (
                      <FormText className="text-danger">
                        Property Valuation is required
                      </FormText>
                    )}
                    {getFieldError("property_valuation") && (
                      <FormText className="text-danger">
                        {getFieldError("property_valuation")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              <Col md={6}>
                <FormGroup>
                  <Label for="loan_amount">
                    Loan Amount({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="loan_amount"
                    placeholder="0"
                    required
                    min="0"
                    step="0.01"
                    value={formDataTab2.loan_amount || ""}
                    onInput={limitDecimalPlaces}
                    onChange={(e) =>
                      handleFormChange(2, e.target.name, e.target.value)
                    }
                  />
                  <FormText className=" text-danger">
                    {isLoanExceedingBase() && (
                      <FormText className="text-danger">
                        Loan Amount cannot be more than the Estimated Value
                      </FormText>
                    )}
                  </FormText>
                  {showFieldWarning("2", formDataTab2.loan_amount) && (
                    <FormText className="text-danger">
                      Loan Amount is required
                    </FormText>
                  )}
                  {getFieldError("loan_amount") && (
                    <FormText className="text-danger">
                      {getFieldError("loan_amount")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="estimated_value">
                    Estimated Value({getCurrencySign()})
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="estimated_value"
                    placeholder="0"
                    required
                    min="0"
                    step="0.01"
                    value={formDataTab2.estimated_value || ""}
                    onInput={limitDecimalPlaces}
                    onChange={(e) =>
                      handleFormChange(2, e.target.name, e.target.value)
                    }
                  />
                  {showFieldWarning("2", formDataTab2.estimated_value) && (
                    <FormText className="text-danger">
                      Estimated Value is required
                    </FormText>
                  )}
                  {getFieldError("estimated_value") && (
                    <FormText className="text-danger">
                      {getFieldError("estimated_value")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="ltv">LTV(%)</Label>
                  <Input
                    type="text"
                    name="ltv"
                    placeholder="0.00"
                    value={calculateLTV()}
                    readOnly
                  />
                  <FormText>Calculated automatically</FormText>
                  <div>
                    {getFieldError("ltv") && (
                      <FormText className="text-danger">
                        {getFieldError("ltv")}
                      </FormText>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <Label for="term_years">
                  Term<span className="text-danger">*</span>
                </Label>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Input
                        type="number"
                        name="term_years"
                        placeholder="0"
                        required
                        min="0"
                        value={formDataTab2.term_years || ""}
                        onChange={(e) =>
                          handleFormChange(2, e.target.name, e.target.value)
                        }
                      />
                      <FormText>In years</FormText>
                      <div>
                        {showFieldWarning("2", formDataTab2.term_years) && (
                          <FormText className="text-danger">
                            Term (years) is required
                          </FormText>
                        )}
                      </div>
                      <div>
                        {getFieldError("term_years") && (
                          <FormText className="text-danger">
                            {getFieldError("term_years")}
                          </FormText>
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Input
                        type="number"
                        name="term_months"
                        placeholder="0"
                        required
                        min="0"
                        max="11"
                        value={formDataTab2.term_months || ""}
                        onChange={(e) =>
                          handleFormChange(2, e.target.name, e.target.value)
                        }
                      />
                      <FormText>In months (0-11)</FormText>
                      <div>
                        {showFieldWarning("2", formDataTab2.term_months) && (
                          <FormText className="text-danger">
                            Term (months) is required
                          </FormText>
                        )}
                      </div>
                      <div>
                        {getFieldError("term_months") && (
                          <FormText className="text-danger">
                            {getFieldError("term_months")}
                          </FormText>
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="interest_only_amount">Interest Only Amount</Label>
                  <Input
                    type="number"
                    name="interest_only_amount"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formDataTab2.interest_only_amount ?? ""}
                    onInput={limitDecimalPlaces}
                    onChange={(e) =>
                      handleFormChange(2, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("interest_only_amount") && (
                    <FormText className="text-danger">
                      {getFieldError("interest_only_amount")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>

              {(formDataTab2.mortgage_type === "PURCHASE" ||
                formDataTab2.mortgage_type === "OTHER") && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="deposit_amount">Deposit Amount</Label>
                    <Input
                      type="number"
                      name="deposit_amount"
                      min="0"
                      placeholder="0"
                      value={formDataTab2.deposit_amount ?? ""}
                      onInput={limitDecimalPlaces}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("deposit_amount") && (
                      <FormText className="text-danger">
                        {getFieldError("deposit_amount")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              {(formDataTab2.mortgage_type === "PURCHASE" ||
                formDataTab2.mortgage_type === "OTHER") && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="deposit_source">Deposit Source</Label>
                    <Input
                      type="text"
                      name="deposit_source"
                      value={formDataTab2.deposit_source || ""}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("deposit_source") && (
                      <FormText className="text-danger">
                        {getFieldError("deposit_source")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              {(formDataTab2.mortgage_type === "REMORTGAGE" ||
                formDataTab2.mortgage_type === "SECURED_LOAN" ||
                formDataTab2.mortgage_type === "FURTHER_ADVANCE" ||
                formDataTab2.mortgage_type === "PRODUCT_TRANSFER" ||
                formDataTab2.mortgage_type === "OTHER") && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="outstanding_balance">Outstanding Balance</Label>
                    <Input
                      type="number"
                      name="outstanding_balance"
                      min="0"
                      value={formDataTab2.outstanding_balance ?? ""}
                      onInput={limitDecimalPlaces}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("outstanding_balance") && (
                      <FormText className="text-danger">
                        {getFieldError("outstanding_balance")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              {(formDataTab2.mortgage_type === "REMORTGAGE" ||
                formDataTab2.mortgage_type === "SECURED_LOAN" ||
                formDataTab2.mortgage_type === "FURTHER_ADVANCE" ||
                formDataTab2.mortgage_type === "PRODUCT_TRANSFER" ||
                formDataTab2.mortgage_type === "OTHER") && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="current_monthly_payment">
                      Current Monthly Payment
                    </Label>
                    <Input
                      type="number"
                      name="current_monthly_payment"
                      min="0"
                      value={formDataTab2.current_monthly_payment ?? ""}
                      onInput={limitDecimalPlaces}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("current_monthly_payment") && (
                      <FormText className="text-danger">
                        {getFieldError("current_monthly_payment")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              {(formDataTab2.mortgage_type === "REMORTGAGE" ||
                formDataTab2.mortgage_type === "SECURED_LOAN" ||
                formDataTab2.mortgage_type === "FURTHER_ADVANCE" ||
                formDataTab2.mortgage_type === "PRODUCT_TRANSFER" ||
                formDataTab2.mortgage_type === "OTHER") && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="current_lender">Current Lender</Label>
                    <Input
                      type="select"
                      name="current_lender"
                      value={formDataTab2.current_lender}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {LenderList.map((lender) => (
                        <option key={lender.value} value={lender.value}>
                          {lender.label}
                        </option>
                      ))}
                    </Input>
                    {getFieldError("current_lender") && (
                      <FormText className="text-danger">
                        {getFieldError("current_lender")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              {formDataTab2.current_lender === "OTHER" && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="current_lender_other_note">
                      Other Current Lender Note
                    </Label>
                    <Input
                      type="text"
                      name="current_lender_other_note"
                      value={formDataTab2.current_lender_other_note || ""}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("current_lender_other_note") && (
                      <FormText className="text-danger">
                        {getFieldError("current_lender_other_note")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              {(formDataTab2.mortgage_type === "REMORTGAGE" ||
                formDataTab2.mortgage_type === "SECURED_LOAN" ||
                formDataTab2.mortgage_type === "FURTHER_ADVANCE" ||
                formDataTab2.mortgage_type === "PRODUCT_TRANSFER" ||
                formDataTab2.mortgage_type === "OTHER") && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="original_purchase_price">
                      Original Purchase Price
                    </Label>
                    <Input
                      type="number"
                      name="original_purchase_price"
                      min="0"
                      value={formDataTab2.original_purchase_price || 0}
                      onInput={limitDecimalPlaces}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("original_purchase_price") && (
                      <FormText className="text-danger">
                        {getFieldError("original_purchase_price")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              {formDataTab2.mortgage_type === "PURCHASE" || (
                <Col md={6}>
                  <FormGroup>
                    <Label for="date_of_purchase">Date Of Purchase</Label>
                    <Input
                      type="date"
                      name="date_of_purchase"
                      value={formDataTab2.date_of_purchase || ""}
                      onChange={(e) =>
                        handleFormChange(2, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("date_of_purchase") && (
                      <FormText className="text-danger">
                        {getFieldError("date_of_purchase")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
              <Col md={6}>
                <FormGroup>
                  <Label for="advice_level">Advice Level</Label>
                  <Input
                    type="select"
                    name="advice_level"
                    value={formDataTab2.advice_level}
                    onChange={(e) =>
                      handleFormChange(2, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="ADVISING">Advising</option>
                    <option value="EXECUTION_ONLY">Execution Only</option>
                  </Input>
                  {getFieldError("repayment_method") && (
                    <FormText className="text-danger">
                      {getFieldError("repayment_method")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-between">
            <Button color="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button
              color="primary"
              onClick={handleNext}
              className="ms-2"
              disabled={!isTab2Valid()}
            >
              {isValidating ? "Validating..." : "Next"}
            </Button>
          </div>
        </TabPane>
        <TabPane tabId="3">
          <Form innerRef={formRef3}>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="dip_accept_date">DIP Accept Date</Label>
                  <Input
                    type="date"
                    name="dip_accept_date"
                    value={formDataTab3.dip_accept_date || ""}
                    onChange={(e) =>
                      handleFormChange(3, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("dip_accept_date") && (
                    <FormText className="text-danger">
                      {getFieldError("dip_accept_date")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              {caseData?.case_stage === "RESEARCH_COMPLIANCE_CHECK" ||
              caseData?.case_stage === "DECISION_IN_PRINCIPLE" ||
              caseData?.case_stage === "FUTURE_OPPORTUNITY" ? (
                <Col md={4}>
                  <FormGroup>
                    <Label for="dip_expiry_date">DIP Expiry Date</Label>
                    <Input
                      type="date"
                      name="dip_expiry_date"
                      value={formDataTab3.dip_expiry_date || ""}
                      onChange={(e) =>
                        handleFormChange(3, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("dip_expiry_date") && (
                      <FormText className="text-danger">
                        {getFieldError("dip_expiry_date")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              ) : null}
              {caseData?.case_stage !== "ENQUIRY" &&
                caseData?.case_stage !== "FACT_FIND" &&
                caseData?.case_stage !== "RESEARCH_COMPLIANCE_CHECK" &&
                caseData?.case_stage !== "DECISION_IN_PRINCIPLE" && (
                  <>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="case_submitted">Case Submitted</Label>
                        <Input
                          type="date"
                          name="case_submitted"
                          value={formDataTab3.case_submitted || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("case_submitted") && (
                          <FormText className="text-danger">
                            {getFieldError("case_submitted")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="valuation_instructed_date">
                          Valuation Instructed Date
                        </Label>
                        <Input
                          type="date"
                          name="valuation_instructed_date"
                          value={formDataTab3.valuation_instructed_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("valuation_instructed_date") && (
                          <FormText className="text-danger">
                            {getFieldError("valuation_instructed_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="valuation_booked_date">
                          Valuation Booked Date
                        </Label>
                        <Input
                          type="date"
                          name="valuation_booked_date"
                          value={formDataTab3.valuation_booked_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("valuation_booked_date") && (
                          <FormText className="text-danger">
                            {getFieldError("valuation_booked_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="valuation_received_date">
                          Valuation Received Date
                        </Label>
                        <Input
                          type="date"
                          name="valuation_received_date"
                          value={formDataTab3.valuation_received_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("valuation_received_date") && (
                          <FormText className="text-danger">
                            {getFieldError("valuation_received_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="valuation_expiry_date">
                          Valuation Expiry Date
                        </Label>
                        <Input
                          type="date"
                          name="valuation_expiry_date"
                          value={formDataTab3.valuation_expiry_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("valuation_expiry_date") && (
                          <FormText className="text-danger">
                            {getFieldError("valuation_expiry_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="case_offered_date">Case Offered Date</Label>
                        <Input
                          type="date"
                          name="case_offered_date"
                          value={formDataTab3.case_offered_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("case_offered_date") && (
                          <FormText className="text-danger">
                            {getFieldError("case_offered_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="stage_expiry_date">Offer Expiry Date</Label>
                        <Input
                          type="date"
                          name="stage_expiry_date"
                          value={formDataTab3.stage_expiry_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("stage_expiry_date") && (
                          <FormText className="text-danger">
                            {getFieldError("stage_expiry_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="legals_instructed_date">
                          Legals Instructed Date
                        </Label>
                        <Input
                          type="date"
                          name="legals_instructed_date"
                          value={formDataTab3.legals_instructed_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("legals_instructed_date") && (
                          <FormText className="text-danger">
                            {getFieldError("legals_instructed_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="exchange_of_contracts_date">
                          Exchange of Contracts Date
                        </Label>
                        <Input
                          type="date"
                          name="exchange_of_contracts_date"
                          value={formDataTab3.exchange_of_contracts_date || ""}
                          onChange={(e) =>
                            handleFormChange(3, e.target.name, e.target.value)
                          }
                        />
                        {getFieldError("exchange_of_contracts_date") && (
                          <FormText className="text-danger">
                            {getFieldError("exchange_of_contracts_date")}
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                  </>
                )}
              <Col md={4}>
                <FormGroup>
                  <Label for="expected_completion_date">
                    Expected Completion Date
                  </Label>
                  <Input
                    type="date"
                    name="expected_completion_date"
                    value={formDataTab3.expected_completion_date || ""}
                    onChange={(e) =>
                      handleFormChange(3, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("expected_completion_date") && (
                    <FormText className="text-danger">
                      {getFieldError("expected_completion_date")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              {caseData?.case_stage !== "ENQUIRY" &&
                caseData?.case_stage !== "FACT_FIND" &&
                caseData?.case_stage !== "RESEARCH_COMPLIANCE_CHECK" &&
                caseData?.case_stage !== "DECISION_IN_PRINCIPLE" && (
                  <Col md={4}>
                    <FormGroup>
                      <Label for="case_completed_date">
                        Case Completed Date
                      </Label>
                      <Input
                        type="date"
                        name="case_completed_date"
                        value={formDataTab3.case_completed_date || ""}
                        onChange={(e) =>
                          handleFormChange(3, e.target.name, e.target.value)
                        }
                      />
                      {getFieldError("case_completed_date") && (
                        <FormText className="text-danger">
                          {getFieldError("case_completed_date")}
                        </FormText>
                      )}
                    </FormGroup>
                  </Col>
                )}
              <Col md={4}>
                <FormGroup>
                  <Label for="product_expiry_date">Product Expiry Date</Label>
                  <Input
                    type="date"
                    name="product_expiry_date"
                    value={formDataTab3.product_expiry_date || ""}
                    onChange={(e) =>
                      handleFormChange(3, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("product_expiry_date") && (
                    <FormText className="text-danger">
                      {getFieldError("product_expiry_date")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              {(caseData?.case_stage === "COMPLETION" ||
                caseData?.case_stage === "FULL_MORTGAGE_APPLICATION" ||
                caseData?.case_stage === "OFFER_FROM_BANK" ||
                caseData?.case_stage === "LEGAL" ||
                caseData?.case_stage === "FUTURE_OPPORTUNITY" ||
                caseData?.case_stage === "NOT_PROCEED") && (
                <Col md={4}>
                  <FormGroup>
                    <Label for="review_date">Review Date</Label>
                    <Input
                      type="date"
                      name="review_date"
                      value={formDataTab3.review_date || ""}
                      onChange={(e) =>
                        handleFormChange(3, e.target.name, e.target.value)
                      }
                    />
                    {getFieldError("review_date") && (
                      <FormText className="text-danger">
                        {getFieldError("review_date")}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              )}
            </Row>
          </Form>
          <div className="d-flex justify-content-between">
            <Button color="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button color="primary" onClick={handleNext} className="ms-2">
              {isValidating ? "Validating..." : "Next"}
            </Button>
          </div>
        </TabPane>
        <TabPane tabId="4">
          <Form innerRef={formRef4}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="sale_type">Sale Type</Label>
                  <Input
                    type="select"
                    name="sale_type"
                    value={formDataTab4.sale_type}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="UNKNOWN">Unknown</option>
                    <option value="FACE_TO_FACE">Face to Face</option>
                    <option value="TELEPHONE">Telephone</option>
                    <option value="INTERNET">Internet</option>
                    <option value="OTHER">Other</option>
                  </Input>
                  {getFieldError("sale_type") && (
                    <FormText className="text-danger">
                      {getFieldError("sale_type")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="introduction_type">Introduction Type</Label>
                  <Input
                    type="select"
                    name="introduction_type"
                    value={formDataTab4.introduction_type}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="DIRECT">Direct</option>
                    <option value="RDI">RDI</option>
                  </Input>
                  {getFieldError("introduction_type") && (
                    <FormText className="text-danger">
                      {getFieldError("introduction_type")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="lead_source">Lead Source</Label>
                  <Input
                    type="select"
                    name="lead_source"
                    value={formDataTab4.lead_source}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="ESTATE_AGENTS">Estate Agents</option>
                    <option value="TV3">TV3</option>
                    <option value="FAMILY">Family</option>
                    <option value="FRIENDS">Friends</option>
                    <option value="REFERRALS">Referrals</option>
                    <option value="WEBSITE">Website</option>
                  </Input>
                  {getFieldError("lead_source") && (
                    <FormText className="text-danger">
                      {getFieldError("lead_source")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="introducer_payment_terms">
                    Introducer Payment Terms
                  </Label>
                  <Input
                    type="select"
                    name="introducer_payment_terms"
                    value={formDataTab4.introducer_payment_terms}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="NOT_APPLICABLE">Not Applicable</option>
                    <option value="ON_APPLICATION">On Application</option>
                    <option value="ON_OFFER">On Offer</option>
                    <option value="ON_COMPLETION">On Completion</option>
                  </Input>
                  {getFieldError("introducer_payment_terms") && (
                    <FormText className="text-danger">
                      {getFieldError("introducer_payment_terms")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="introducer_fee">Introducer Fee</Label>
                  <Input
                    type="text"
                    name="introducer_fee"
                    value={formDataTab4.introducer_fee || ""}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("introducer_fee") && (
                    <FormText className="text-danger">
                      {getFieldError("introducer_fee")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="reasons_for_capital_raising">
                    Reasons for Capital Raising
                  </Label>
                  <Input
                    type="text"
                    name="reasons_for_capital_raising"
                    value={formDataTab4.reasons_for_capital_raising}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("reasons_for_capital_raising") && (
                    <FormText className="text-danger">
                      {getFieldError("reasons_for_capital_raising")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="is_mortgage_being_ported">
                    Has this been accepted or declined with any lender already?
                  </Label>
                  {["yes", "no"].map((value) => (
                    <div key={value}>
                      <Label className="me-2">
                        <Input
                          type="radio"
                          name="accepted_or_declined_by_lender"
                          className="me-1"
                          value={value}
                          checked={
                            formDataTab4.accepted_or_declined_by_lender ===
                            (value === "yes")
                          }
                          onChange={(e) =>
                            handleFormChange(
                              4,
                              "accepted_or_declined_by_lender",
                              e.target.value === "yes",
                            )
                          }
                        />
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </Label>
                      {getFieldError("accepted_or_declined_by_lender") && (
                        <FormText className="text-danger">
                          {getFieldError("accepted_or_declined_by_lender")}
                        </FormText>
                      )}
                    </div>
                  ))}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="case_summary">Case Summary</Label>
                  <Input
                    type="textarea"
                    name="case_summary"
                    value={formDataTab4.case_summary}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("case_summary") && (
                    <FormText className="text-danger">
                      {getFieldError("case_summary")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col sm={12}>
                <FormGroup>
                  <Label for="note">Note</Label>
                  <Input
                    type="textarea"
                    name="note"
                    value={formDataTab4.note}
                    onChange={(e) =>
                      handleFormChange(4, e.target.name, e.target.value)
                    }
                  />
                  {getFieldError("note") && (
                    <FormText className="text-danger">
                      {getFieldError("note")}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </Form>
          <div className=" d-flex justify-content-between gap-3 mt-2">
            <Button color="secondary" onClick={handleBack}>
              Back
            </Button>
            <div className="d-flex gap-3">
              <Button
                type="button"
                color="primary"
                onClick={async () => {
                  setSubmitting("save");
                  try {
                    await handleSave();
                  } finally {
                    setSubmitting(null);
                  }
                }}
                className=""
                disabled={
                  isLoading ||
                  isUpdating ||
                  (session?.user?.role === "APPLICANT" &&
                    loandetailsData?.updated_by !== null)
                }
              >
                {isUpdating && submitting === "save"
                  ? "Saving..."
                  : "Save Details"}
              </Button>
              <Button
                type="button"
                color="secondary"
                onClick={async () => {
                  // Validate tab 4 form before saving/navigating
                  if (formRef4.current) {
                    const ok = formRef4.current.reportValidity();
                    if (!ok) return;
                  }

                  if (
                    session?.user?.role === "APPLICANT" &&
                    loandetailsData?.updated_by !== null
                  ) {
                    handleNextTab();
                  } else {
                    setSubmitting("save_next");
                    try {
                      const ok = await handleSave();
                      if (ok) {
                        handleNextTab();
                      }
                    } catch (error) {
                      console.error("Save failed, not navigating to next tab");
                    } finally {
                      setSubmitting(null);
                    }
                  }
                }}
                disabled={isLoading || isUpdating}
              >
                {session?.user?.role === "APPLICANT" &&
                loandetailsData?.updated_by !== null
                  ? "Go To Next"
                  : isUpdating && submitting === "save_next"
                    ? "Saving..."
                    : "Save & Next"}
              </Button>
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};
