import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import {
  useDownloadSuitabilityPdfMutation,
  useGetSuitabilityQuery,
  useUpdateSuitabilityMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Suitability/SuitabilityApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Container } from "reactstrap";
import DebtConsolidation from "./Components/DebtConsolidation";
import HighLoanToValue from "./Components/HighLoanToValue";
import IslamicMortgage from "./Components/IslamicMortgage";
import LendingIntoRetirement from "./Components/LendingIntoRetirement";
import ProductTransfer from "./Components/ProductTransfer";
import RecommendationLetter from "./Components/RecommendationLetter";

const Divider = () => <hr className="my-4" />;

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Suitability: React.FC = () => {
  const { casealias } = useParams();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState<"save" | "next" | null>(null);

  const { data: caseData, isLoading: isCaseLoading } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const { data: suitability, isLoading: isSuitLoading } =
    useGetSuitabilityQuery({ case_alias: casealias }, { skip: !casealias });

  const [updateSuitability, { isLoading: isUpdatingSuitability }] =
    useUpdateSuitabilityMutation();

  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [downloadSuitabilityPdf, { isLoading: isDownloadingPdf }] =
    useDownloadSuitabilityPdfMutation();

  const [formValues, setFormValues] = useState<SuitabilityData>({
    lender_text: "",
    initial_interest_rate_text: "",
    initial_interest_rate_deal_period_text: "",
    mortgage_term_text: "",
    repayment_method_recommended_text: "",
    mortgage_amount_type: null,
    arrangement_fee_type: null,
    early_repayment_charges_reason: null,
    early_repayment_charges_meaning: null,
    portability_recommendation: null,
    portability_suggestion: null,
    early_repayment_charges_recommendation: null,
    portability_meaning: null,
    protection: null,
    protection_reason: null,
    portability_reason: null,
    home_insurance: null,
    residential_mortgages_type: null,
    additional_risk_warnings_text: "",
    debts_explanation: "",
    financial_goal: "",
    consolidation_proceed_reason: "",
    debt_cost_comparison: null,
    new_lender_not_recommended_reason: null,
    islamic_mortgages_purchase_plan: null,
    home_purchase_plan: "",
    why_was_this_recommended_to_you: "",
    what_does_this_mean: "",
    why_was_this_recommended: "",
    product_transfer_reason: null,
    product_transfer_recommended: "",
    arrangement_fee: null,
    lending_into_retirement_type: null,
    overpayment_type: null,
    repayment_status_type: null,
    max_erc: null,
    email: null,
    address:null,
    outstanding_balance: null,
    interest_rate_type: null,
    repayment_method_type: null,
    repayment_charge: null,
    the_end_date_of_existing_product: null,
    the_end_date_of_new_product: null,
    product_transfer_expired_date: null,
    product_transfer_standard_variable_rate: null,
    shortened_product_transfer_expired_date: null,
    shortened_product_transfer_standard_variable_rate: null,
    product_transfer_recommended_was: null,
  });

  // Pre-populate from API response
  useEffect(() => {
    if (suitability) {
      setFormValues((prev) => ({ ...prev, ...suitability }));
    }
  }, [suitability]);

  const handleFormChange = (updates: Partial<SuitabilityData>) => {
    setFormValues((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async (
    action: "save" | "next" = "save",
  ): Promise<boolean> => {
    setSubmitting(action);
    try {
      const payload = {
        lender_text: formValues.lender_text,
        initial_interest_rate_text: formValues.initial_interest_rate_text,
        initial_interest_rate_deal_period_text:
          formValues.initial_interest_rate_deal_period_text,
        mortgage_term_text: formValues.mortgage_term_text,
        repayment_method_recommended_text:
          formValues.repayment_method_recommended_text,
        mortgage_amount_type: formValues.mortgage_amount_type,
        arrangement_fee_type: formValues.arrangement_fee_type,
        early_repayment_charges_reason:
          formValues.early_repayment_charges_reason,
        portability_recommendation: formValues.portability_recommendation,
        portability_reason: formValues.portability_reason,
        home_insurance: formValues.home_insurance,
        residential_mortgages_type: formValues.residential_mortgages_type,
        additional_risk_warnings_text: formValues.additional_risk_warnings_text,
        debts_explanation: formValues.debts_explanation,
        financial_goal: formValues.financial_goal,
        consolidation_proceed_reason: formValues.consolidation_proceed_reason,
        debt_cost_comparison: formValues.debt_cost_comparison,
        new_lender_not_recommended_reason:
          formValues.new_lender_not_recommended_reason,
        islamic_mortgages_purchase_plan:
          formValues.islamic_mortgages_purchase_plan,
        home_purchase_plan: formValues.home_purchase_plan,
        why_was_this_recommended_to_you:
          formValues.why_was_this_recommended_to_you,
        what_does_this_mean: formValues.what_does_this_mean,
        why_was_this_recommended: formValues.why_was_this_recommended,
        product_transfer_reason: formValues.product_transfer_reason,
        product_transfer_recommended: formValues.product_transfer_recommended,
        arrangement_fee: formValues.arrangement_fee,
        early_repayment_charges_meaning:
          formValues.early_repayment_charges_meaning,
        early_repayment_charges_recommendation:
          formValues.early_repayment_charges_recommendation,
        portability_meaning: formValues.portability_meaning,
        protection: formValues.protection,
        protection_reason: formValues.protection_reason,
        portability_suggestion: formValues.portability_suggestion,
        lending_into_retirement_type: formValues.lending_into_retirement_type,
        overpayment_type: formValues.overpayment_type,
        repayment_status_type: formValues.repayment_status_type,
        max_erc: formValues.max_erc,
        email: formValues.email,
        address: formValues.address,
        outstanding_balance: formValues.outstanding_balance,
        interest_rate_type: formValues.interest_rate_type,
        repayment_method_type: formValues.repayment_method_type,
        repayment_charge: formValues.repayment_charge,
        the_end_date_of_existing_product:
          formValues.the_end_date_of_existing_product,
        the_end_date_of_new_product: formValues.the_end_date_of_new_product,
        product_transfer_expired_date: formValues.product_transfer_expired_date,
        product_transfer_standard_variable_rate:
          formValues.product_transfer_standard_variable_rate,
        shortened_product_transfer_expired_date:
          formValues.shortened_product_transfer_expired_date,
        shortened_product_transfer_standard_variable_rate:
          formValues.shortened_product_transfer_standard_variable_rate,
        product_transfer_recommended_was:
          formValues.product_transfer_recommended_was,
      };

      const response = await updateSuitability({
        case_alias: casealias,
        payload,
      }).unwrap();

      if (response) {
        toast.success("Suitability updated successfully");
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_suitability: true },
          });
          return true;
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        return false;
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save changes");
      return false;
    } finally {
      setSubmitting(null);
    }
    return false;
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

  const handleSaveAndNext = async () => {
    const success = await handleSave("next");
    if (success) {
      handleNextTab();
    }
  };

  if (isCaseLoading || isSuitLoading) return <LoadingGrow />;

  const handleDownloadPdf = async () => {
    try {
      const response = await downloadSuitabilityPdf({
        case_alias: casealias,
      }).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `suitability-${casealias}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <Container fluid className="py-4 px-2 px-md-4">
      <div className="d-flex justify-content-between mb-3 p-3 bg-light rounded">
        <h5 className="text-body mb-0 fw-bold">Download Suitability Letter</h5>
        <Button
          color="primary"
          onClick={handleDownloadPdf}
          disabled={isDownloadingPdf}
        >
          {isDownloadingPdf ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Downloading...
            </>
          ) : (
            <>
              <i className="fa fa-file-pdf-o me-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>
      <Divider />
      <div className="suitability-letter">
        <RecommendationLetter
          caseData={caseData}
          suitability={suitability}
          formValues={formValues}
          onFormChange={handleFormChange}
        />
        {suitability?.is_debt_consolidation_applicable && (
          <>
            <Divider />
            <DebtConsolidation
              caseData={caseData}
              suitability={suitability}
              formValues={formValues}
              onFormChange={handleFormChange}
            />
          </>
        )}
        {suitability?.is_lending_into_retirement_applicable && (
          <>
            <Divider />
            <LendingIntoRetirement
              caseData={caseData}
              suitability={suitability}
              formValues={formValues}
              onFormChange={handleFormChange}
            />
          </>
        )}
        {/* <Divider />
        <PortingMortgageIncrease
          caseData={caseData}
          suitability={suitability}
          formValues={formValues}
          onFormChange={handleFormChange}
        /> */}
        {suitability?.is_islamic_mortgage_applicable && (
          <>
            <Divider />
            <IslamicMortgage
              caseData={caseData}
              suitability={suitability}
              formValues={formValues}
              onFormChange={handleFormChange}
            />
          </>
        )}
        {suitability?.is_product_transfer_applicable && (
          <>
            <Divider />
            <ProductTransfer
              caseData={caseData}
              suitability={suitability}
              formValues={formValues}
              onFormChange={handleFormChange}
            />
          </>
        )}
        {/* <Divider />
        <ShortenedProductTransfer
          caseData={caseData}
          suitability={suitability}
          formValues={formValues}
          onFormChange={handleFormChange}
        /> */}
        {suitability?.is_high_loan_to_value_applicable && (
          <>
            <Divider />
            <HighLoanToValue />
          </>
        )}
        {/* ── Footer ── */}
        <div className="mt-5 pt-3 border-top text-center">
          <small className="text-muted">
            This letter is generated as part of your mortgage advice record.
            Please retain it for your records.
          </small>
        </div>
      </div>
      <Divider />
      <div className="d-flex justify-content-end mt-4 gap-2">
        <Button
          color="primary"
          onClick={() => handleSave("save")}
          disabled={isUpdatingSuitability}
        >
          {isUpdatingSuitability && submitting === "save" ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>

        <Button
          type="button"
          color="secondary"
          disabled={isUpdatingSuitability}
          onClick={handleSaveAndNext}
        >
          {isUpdatingSuitability && submitting === "next" ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Saving...
            </>
          ) : (
            "Save & Next"
          )}
        </Button>
      </div>
    </Container>
  );
};

export default Suitability;
