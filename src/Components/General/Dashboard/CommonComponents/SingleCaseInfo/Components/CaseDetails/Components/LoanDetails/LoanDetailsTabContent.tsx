import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useGetCaseLoanDetailsQuery,
  useGetLoanDetailsQuery,
  useUpdateLoanDetailsMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/LoanDetails/LoanDetailsApi";
import { LoanDetailsTabContentProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/LoanDetailsTypes";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { skipToken } from "@reduxjs/toolkit/query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, TabContent, TabPane } from "reactstrap";
import LoanDetailsFormTab1 from "./LoanDetailsFormTabs/LoanDetailsFormTab1";
import LoanDetailsFormTab2 from "./LoanDetailsFormTabs/LoanDetailsFormTab2";
import LoanDetailsFormTab3 from "./LoanDetailsFormTabs/LoanDetailsFormTab3";
import LoanDetailsFormTab4 from "./LoanDetailsFormTabs/LoanDetailsFormTab4";

export const LoanDetailsTabContent: React.FC<LoanDetailsTabContentProps> = ({
  tabId,
  setTabId,
}) => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const { data, isLoading, isError } = useGetCaseLoanDetailsQuery(casealias);
  const dispatch = useAppDispatch();

  // Ensure `data` exists and has elements before accessing `[0]`
  const loandetailsAlias =
    Array.isArray(data) && data.length > 0 ? data[0].alias : null;

  const { data: loandetailsData, isLoading: isLoandetailsDataLoading } =
    useGetLoanDetailsQuery(
      loandetailsAlias
        ? { case_alias: casealias, loanDetails_alias: loandetailsAlias }
        : skipToken
    );
  const [updateLoanDetails, { isLoading: isUpdating }] =
    useUpdateLoanDetailsMutation();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
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

  const handleNext = () => setTabId((parseInt(tabId) + 1).toString());
  const handleBack = () => setTabId((parseInt(tabId) - 1).toString());

  const handleSave = async () => {
    const updatedLoanDetailsData = {
      ...formDataTab1,
      ...formDataTab2,
      ...formDataTab3,
      ...formDataTab4,
    };
    try {
      const response = await updateLoanDetails({
        case_alias: casealias,
        loanDetails_alias: loandetailsAlias,
        mergedData: updatedLoanDetailsData,
      });

      if (response.data) {
        toast.success("Loan details updated successfully");
      } else if (response.error) {
        // Extract backend error message - prioritize details field
        const errorMessage =
          (response.error as any)?.data?.detail ||
          "Failed to update loan details!";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to update loan details!!!!");
      }
    } catch (error: any) {
      // Handle any unexpected errors
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };
  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
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
          <LoanDetailsFormTab1
            formData={formDataTab1}
            handleFormChange={(name, value) => handleFormChange(1, name, value)}
          />
          <Button color="primary" onClick={handleNext} className="float-end">
            Next
          </Button>
        </TabPane>
        <TabPane tabId="2">
          <LoanDetailsFormTab2
            formData={formDataTab2}
            handleFormChange={(name, value) => handleFormChange(2, name, value)}
          />
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
              Next
            </Button>
          </div>
        </TabPane>
        <TabPane tabId="3">
          <LoanDetailsFormTab3
            formData={formDataTab3}
            caseStage={caseData?.case_stage}
            handleFormChange={(name, value) => handleFormChange(3, name, value)}
          />
          <div className="d-flex justify-content-between">
            <Button color="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button color="primary" onClick={handleNext} className="ms-2">
              Next
            </Button>
          </div>
        </TabPane>
        <TabPane tabId="4">
          <LoanDetailsFormTab4
            formData={formDataTab4}
            handleFormChange={(name, value) => handleFormChange(4, name, value)}
          />
          <div className=" d-flex justify-content-between gap-3 mt-2">
            <Button color="secondary" onClick={handleBack}>
              Back
            </Button>
            <div className="d-flex gap-3">
              <Button
                type="submit"
                color="primary"
                onClick={handleSave}
                className=""
                disabled={
                  isLoading ||
                  isUpdating ||
                  (session?.user?.user_type === "CLIENT" &&
                    loandetailsData?.updated_by !== null)
                }
              >
                {isUpdating ? "Saving..." : "Save Details"}
              </Button>
              <Button
                type="submit"
                color="secondary"
                onClick={async () => {
                  if (
                    session?.user?.user_type === "CLIENT" &&
                    loandetailsData?.updated_by !== null
                  ) {
                    handleNextTab();
                  } else {
                    try {
                      await handleSave();
                      handleNextTab();
                    } catch (error) {
                      // Error is already handled in handleSave, just prevent navigation
                      console.error("Save failed, not navigating to next tab");
                    }
                  }
                }}
                disabled={isLoading || isUpdating}
              >
                {session?.user?.user_type === "CLIENT" &&
                loandetailsData?.updated_by !== null
                  ? "Go To Next"
                  : "Save & Next"}
              </Button>
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};
