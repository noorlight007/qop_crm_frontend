import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import {
  useGetSuitabilityQuery,
  useUpdateSuitabilityMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Suitability/SuitabilityApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { SuitabilityData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Container } from "reactstrap";
import DebtConsolidation from "./Components/DebtConsolidation";
import HighLoanToValue from "./Components/HighLoanToValue";
import IslamicMortgage from "./Components/IslamicMortgage";
import LendingIntoRetirement from "./Components/LendingIntoRetirement";
import PortingMortgageIncrease from "./Components/PortingMortgageIncrease";
import ProductTransfer from "./Components/ProductTransfer";
import RateTypePaymentMethod from "./Components/RateTypePaymentMethod";
import RecommendationLetter from "./Components/RecommendationLetter";
import ShortenedProductTransfer from "./Components/ShortenedProductTransfer";

const Divider = () => <hr className="my-4" />;

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Suitability: React.FC = () => {
  const { casealias } = useParams();

  const { data: caseData, isLoading: isCaseLoading } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const { data: suitability, isLoading: isSuitLoading } =
    useGetSuitabilityQuery({ case_alias: casealias }, { skip: !casealias });
  console.log("Suitability Data:", suitability);

  const [updateSuitability, { isLoading: isUpdatingSuitability }] =
    useUpdateSuitabilityMutation();

  const [formValues, setFormValues] = useState<SuitabilityData>({
    lender_text: "",
    initial_interest_rate_text: "",
    initial_interest_rate_deal_period_text: "",
    repayment_method_why_text: "",
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
    x: "",
    arrangement_fee: null,
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

  const handleSave = async () => {
    try {
      const payload = {
        lender_text: formValues.lender_text,
        initial_interest_rate_text: formValues.initial_interest_rate_text,
        initial_interest_rate_deal_period_text:
          formValues.initial_interest_rate_deal_period_text,
        repayment_method_why_text: formValues.repayment_method_why_text,
        repayment_method_recommended_text:
          formValues.repayment_method_recommended_text,
        mortgage_amount_type: formValues.mortgage_amount_type,
        arrangement_fee_type: formValues.arrangement_fee_type,
        early_repayment_charges_reason: formValues.early_repayment_charges_reason,
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
        x: formValues.x,
        arrangement_fee: formValues.arrangement_fee,
        // fields added by us not in original backend spec
        early_repayment_charges_meaning: formValues.early_repayment_charges_meaning,
        early_repayment_charges_recommendation: formValues.early_repayment_charges_recommendation,
        portability_meaning: formValues.portability_meaning,
        protection: formValues.protection,
        protection_reason: formValues.protection_reason,
        portability_suggestion: formValues.portability_suggestion,
      };

      console.log("Suitability Payload:", JSON.stringify(payload, null, 2));

      await updateSuitability({
        case_alias: casealias,
        payload,
      }).unwrap();
      toast.success("Changes saved successfully");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save changes");
    }
  };

  if (isCaseLoading || isSuitLoading) return <LoadingGrow />;

  return (
    <Container
      fluid
      className="py-4 px-2 px-md-4 suitability-page-bg" // ← class replaces inline style
    >
      <h1 className="mb-4 text-danger text-center fw-bold">
        This page is under Development
      </h1>
      <div className="suitability-letter">
        <RecommendationLetter
          caseData={caseData}
          suitability={suitability}
          formValues={formValues}
          onFormChange={handleFormChange}
        />
        <Divider />
        <DebtConsolidation caseData={caseData} suitability={suitability} />
        <Divider />
        <LendingIntoRetirement caseData={caseData} suitability={suitability} />
        <Divider />
        <PortingMortgageIncrease
          caseData={caseData}
          suitability={suitability}
        />
        <Divider />
        <IslamicMortgage caseData={caseData} suitability={suitability} />
        <Divider />
        <RateTypePaymentMethod caseData={caseData} suitability={suitability} />
        <Divider />
        <ProductTransfer caseData={caseData} suitability={suitability} />
        <Divider />
        <ShortenedProductTransfer
          caseData={caseData}
          suitability={suitability}
        />
        <Divider />
        <HighLoanToValue caseData={caseData} />
      </div>
      <div className="d-flex justify-content-end mt-4">
        <Button
          color="primary"
          onClick={handleSave}
          disabled={isUpdatingSuitability}
        >
          {isUpdatingSuitability ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </Container>
  );
};

export default Suitability;
