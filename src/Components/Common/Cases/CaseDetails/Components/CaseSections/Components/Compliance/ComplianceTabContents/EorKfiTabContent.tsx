import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetComplianceQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceApi";
import {
  updateComplianceAnswer,
  updateComplianceComment,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceSlice";
import { RootState } from "@/Redux/Store";
import { ComplianceState } from "@/Types/Common/Cases/CaseDetails/CaseSections/ComplianceTypes";
import { useParams } from "next/navigation";
import { FC } from "react";
import { DisclosureItem } from "./components/DisclosureItem";

const EorKfiTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance,
  );

  const eorKfiData = [
    {
      reference: "6.11",
      title:
        "Has the adviser sourced in line with mortgage requirements? E.g No fees / Fix",
      name: "has_adviser_sourced_mortgage_requirements",
      textName: "has_adviser_sourced_mortgage_requirement_text",
      answer:
        updatedComplianceData.has_adviser_sourced_mortgage_requirements !==
        undefined
          ? updatedComplianceData.has_adviser_sourced_mortgage_requirements
          : complianceData?.has_adviser_sourced_mortgage_requirements || null,
      comment:
        updatedComplianceData.has_adviser_sourced_mortgage_requirement_text !==
        undefined
          ? updatedComplianceData.has_adviser_sourced_mortgage_requirement_text
          : complianceData?.has_adviser_sourced_mortgage_requirement_text ||
            null,
    },
    {
      reference: "6.12",
      title:
        "Does the loan term, amount and property value match the figures stated in Mortgage Requirements",
      name: "does_figures_stated_in_mortgage_requirements",
      textName: "does_figures_stated_in_mortgage_requirements_text",
      answer:
        updatedComplianceData.does_figures_stated_in_mortgage_requirements !==
        undefined
          ? updatedComplianceData.does_figures_stated_in_mortgage_requirements
          : complianceData?.does_figures_stated_in_mortgage_requirements ||
            null,
      comment:
        updatedComplianceData.does_figures_stated_in_mortgage_requirements_text !==
        undefined
          ? updatedComplianceData.does_figures_stated_in_mortgage_requirements_text
          : complianceData?.does_figures_stated_in_mortgage_requirements_text ||
            null,
    },
    {
      reference: "6.13",
      title:
        "Are the results stored in order of client preference (E.g True Cost / Total Monthly Cost / Other)",
      name: "are_results_stored_in_order_of_client_preference",
      textName: "are_results_stored_in_order_of_client_preference_text",
      answer:
        updatedComplianceData.are_results_stored_in_order_of_client_preference !==
        undefined
          ? updatedComplianceData.are_results_stored_in_order_of_client_preference
          : complianceData?.are_results_stored_in_order_of_client_preference ||
            null,
      comment:
        updatedComplianceData.are_results_stored_in_order_of_client_preference_text !==
        undefined
          ? updatedComplianceData.are_results_stored_in_order_of_client_preference_text
          : complianceData?.are_results_stored_in_order_of_client_preference_text ||
            null,
    },
    {
      reference: "6.14",
      title: "Is the recommended product showing on the Evidence of Research?",
      name: "is_recommended_product_showing_evidence_research",
      textName: "is_recommended_product_showing_evidence_research_text",
      answer:
        updatedComplianceData.is_recommended_product_showing_evidence_research !==
        undefined
          ? updatedComplianceData.is_recommended_product_showing_evidence_research
          : complianceData?.is_recommended_product_showing_evidence_research ||
            null,
      comment:
        updatedComplianceData.is_recommended_product_showing_evidence_research_text !==
        undefined
          ? updatedComplianceData.is_recommended_product_showing_evidence_research_text
          : complianceData?.is_recommended_product_showing_evidence_research_text ||
            null,
    },
    {
      reference: "6.21",
      title: "Is the address on the KFI correct?",
      name: "is_the_address_on_the_kfi_correct",
      textName: "is_the_address_on_the_kfi_correct_text",
      answer:
        updatedComplianceData.is_the_address_on_the_kfi_correct !== undefined
          ? updatedComplianceData.is_the_address_on_the_kfi_correct
          : complianceData?.is_the_address_on_the_kfi_correct || null,
      comment:
        updatedComplianceData.is_the_address_on_the_kfi_correct_text !==
        undefined
          ? updatedComplianceData.is_the_address_on_the_kfi_correct_text
          : complianceData?.is_the_address_on_the_kfi_correct_text || null,
    },
    {
      reference: "6.22",
      title:
        "Does the figures, term, repayment method and additional features match the mortgage requirements",
      name: "does_figures_features_mortgage_requirements",
      textName: "does_figures_features_mortgage_requirement_text",
      answer:
        updatedComplianceData.does_figures_features_mortgage_requirements !==
        undefined
          ? updatedComplianceData.does_figures_features_mortgage_requirements
          : complianceData?.does_figures_features_mortgage_requirements || null,
      comment:
        updatedComplianceData.does_figures_features_mortgage_requirement_text !==
        undefined
          ? updatedComplianceData.does_figures_features_mortgage_requirement_text
          : complianceData?.does_figures_features_mortgage_requirement_text ||
            null,
    },
    {
      reference: "6.23",
      title: "Does the monthly payment fit within disposable income?",
      name: "does_monthly_payment_fit_within_disposable_income",
      textName: "does_monthly_payment_fit_within_disposable_income_text",
      answer:
        updatedComplianceData.does_monthly_payment_fit_within_disposable_income !==
        undefined
          ? updatedComplianceData.does_monthly_payment_fit_within_disposable_income
          : complianceData?.does_monthly_payment_fit_within_disposable_income ||
            null,
      comment:
        updatedComplianceData.does_monthly_payment_fit_within_disposable_income_text !==
        undefined
          ? updatedComplianceData.does_monthly_payment_fit_within_disposable_income_text
          : complianceData?.does_monthly_payment_fit_within_disposable_income_text ||
            null,
    },
    {
      reference: "6.24",
      title:
        "Are fees disclosed correctly and support those in the disclosure documents?",
      name: "are_fees_disclosed_correctly",
      textName: "are_fees_disclosed_correctly_text",
      answer:
        updatedComplianceData.are_fees_disclosed_correctly !== undefined
          ? updatedComplianceData.are_fees_disclosed_correctly
          : complianceData?.are_fees_disclosed_correctly || null,
      comment:
        updatedComplianceData.are_fees_disclosed_correctly_text !== undefined
          ? updatedComplianceData.are_fees_disclosed_correctly_text
          : complianceData?.are_fees_disclosed_correctly_text || null,
    },
    {
      reference: "6.25",
      title:
        "Lender Fees Added? 2 Illustrations Needed - One with fees added, one with fees paid upfront",
      name: "lender_fees_added",
      textName: "lender_fees_added_text",
      answer:
        updatedComplianceData.lender_fees_added !== undefined
          ? updatedComplianceData.lender_fees_added
          : complianceData?.lender_fees_added || null,
      comment:
        updatedComplianceData.lender_fees_added_text !== undefined
          ? updatedComplianceData.lender_fees_added_text
          : complianceData?.lender_fees_added_text || null,
    },
    {
      reference: "6.26",
      title:
        "Has Illustration been produced at the correct time (after sourcing and prior to application)",
      name: "has_illustration_been_produced",
      textName: "has_illustration_been_produced_text",
      answer:
        updatedComplianceData.has_illustration_been_produced !== undefined
          ? updatedComplianceData.has_illustration_been_produced
          : complianceData?.has_illustration_been_produced || null,
      comment:
        updatedComplianceData.has_illustration_been_produced_text !== undefined
          ? updatedComplianceData.has_illustration_been_produced_text
          : complianceData?.has_illustration_been_produced_text || null,
    },
    {
      reference: "6.27",
      title:
        "Interest only? Requires Repayment Illustration comparison (+If Int only with fees added, require Repayment comparison with fees added)",
      name: "interest_only",
      textName: "interest_only_text",
      answer:
        updatedComplianceData.interest_only !== undefined
          ? updatedComplianceData.interest_only
          : complianceData?.interest_only || null,
      comment:
        updatedComplianceData.interest_only_text !== undefined
          ? updatedComplianceData.interest_only_text
          : complianceData?.interest_only_text || null,
    },
    {
      reference: "6.3",
      title: "Has the product tab been fully completed with product details",
      name: "has_product_been_fully_completed",
      textName: "has_product_been_fully_completed_text",
      answer:
        updatedComplianceData.has_product_been_fully_completed !== undefined
          ? updatedComplianceData.has_product_been_fully_completed
          : complianceData?.has_product_been_fully_completed || null,
      comment:
        updatedComplianceData.has_product_been_fully_completed_text !==
        undefined
          ? updatedComplianceData.has_product_been_fully_completed_text
          : complianceData?.has_product_been_fully_completed_text || null,
    },
  ];

  const handleAnswerChange = (name: string, value: string) => {
    dispatch(
      updateComplianceAnswer({ field: name as keyof ComplianceState, value }),
    );
  };

  const handleCommentChange = (name: string, value: string | null) => {
    dispatch(
      updateComplianceComment({ field: name as keyof ComplianceState, value }),
    );
  };
  return (
    <div>
      {eorKfiData.map((item, index) => (
        <DisclosureItem
          key={item.reference}
          name={item.name}
          textName={item.textName}
          reference={item.reference}
          title={item.title}
          answer={item.answer}
          comment={item.comment}
          index={index}
          onAnswerChange={handleAnswerChange}
          onCommentChange={handleCommentChange}
        />
      ))}
    </div>
  );
};

export default EorKfiTabContent;
