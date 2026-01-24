import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetComplianceQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Compliance/ComplianceApi";
import {
  updateComplianceAnswer,
  updateComplianceComment,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Compliance/ComplianceSlice";
import { RootState } from "@/Redux/Store";
import { ComplianceState } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ComplianceTypes";
import { useParams } from "next/navigation";
import { FC } from "react";
import { DisclosureItem } from "./components/DisclosureItem";

const ComplianceSuitabilityTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance
  );

  const suitabilityData = [
    {
      reference: "8.1",
      title:
        "Has the Suitability letter been generated and sent to the client within 5 working days?",
      name: "has_suitability_letter_been_generated",
      textName: "has_suitability_letter_been_generated_text",
      answer:
        updatedComplianceData.has_suitability_letter_been_generated !==
        undefined
          ? updatedComplianceData.has_suitability_letter_been_generated
          : complianceData?.has_suitability_letter_been_generated || null,
      comment:
        updatedComplianceData.has_suitability_letter_been_generated_text !==
        undefined
          ? updatedComplianceData.has_suitability_letter_been_generated_text
          : complianceData?.has_suitability_letter_been_generated_text || null,
    },
    {
      reference: "8.11",
      title:
        "Post Application changes - has an addendum letter been issued or suitability letter amended and reissued?",
      name: "post_application_changes",
      textName: "post_application_changes_text",
      answer:
        updatedComplianceData.post_application_changes !== undefined
          ? updatedComplianceData.post_application_changes
          : complianceData?.post_application_changes || null,
      comment:
        updatedComplianceData.post_application_changes_text !== undefined
          ? updatedComplianceData.post_application_changes_text
          : complianceData?.post_application_changes_text || null,
    },
    {
      reference: "8.12",
      title:
        "If the applicants live at separate addresses, Is there confirmation a copy has been sent to both clients?",
      name: "is_applicants_live_at_separate_addresses",
      textName: "is_applicants_live_at_separate_addresses_text",
      answer:
        updatedComplianceData.is_applicants_live_at_separate_addresses !==
        undefined
          ? updatedComplianceData.is_applicants_live_at_separate_addresses
          : complianceData?.is_applicants_live_at_separate_addresses || null,
      comment:
        updatedComplianceData.is_applicants_live_at_separate_addresses_text !==
        undefined
          ? updatedComplianceData.is_applicants_live_at_separate_addresses_text
          : complianceData?.is_applicants_live_at_separate_addresses_text ||
            null,
    },
    {
      reference: "8.13",
      title:
        "If this is a replacement suitability letter, has the statement ' This Suitability letter replaces the previous one sent to you on XX/XX/XX because...'?",
      name: "is_replacement_suitability_letter",
      textName: "is_replacement_suitability_letter_text",
      answer:
        updatedComplianceData.is_replacement_suitability_letter !== undefined
          ? updatedComplianceData.is_replacement_suitability_letter
          : complianceData?.is_replacement_suitability_letter || null,
      comment:
        updatedComplianceData.is_replacement_suitability_letter_text !==
        undefined
          ? updatedComplianceData.is_replacement_suitability_letter_text
          : complianceData?.is_replacement_suitability_letter_text || null,
    },
    {
      reference: "8.2",
      title: "Has the reasons for mortgage been personalised",
      name: "has_reasons_for_mortgage_been_personalised",
      textName: "has_reasons_for_mortgage_been_personalised_text",
      answer:
        updatedComplianceData.has_reasons_for_mortgage_been_personalised !==
        undefined
          ? updatedComplianceData.has_reasons_for_mortgage_been_personalised
          : complianceData?.has_reasons_for_mortgage_been_personalised || null,
      comment:
        updatedComplianceData.has_reasons_for_mortgage_been_personalised_text !==
        undefined
          ? updatedComplianceData.has_reasons_for_mortgage_been_personalised_text
          : complianceData?.has_reasons_for_mortgage_been_personalised_text ||
            null,
    },
    {
      reference: "8.21",
      title: "Has the meeting discussion been personalised?",
      name: "has_meeting_discussion_been_personalised",
      textName: "has_meeting_discussion_been_personalised_text",
      answer:
        updatedComplianceData.has_meeting_discussion_been_personalised !==
        undefined
          ? updatedComplianceData.has_meeting_discussion_been_personalised
          : complianceData?.has_meeting_discussion_been_personalised || null,
      comment:
        updatedComplianceData.has_meeting_discussion_been_personalised_text !==
        undefined
          ? updatedComplianceData.has_meeting_discussion_been_personalised_text
          : complianceData?.has_meeting_discussion_been_personalised_text ||
            null,
    },
    {
      reference: "8.22",
      title:
        "Has 'your circumstances and objectives been personalised'? including justification if objectives have not been met and why? / If client is paying ERC, has this been fully justified including calculations? Is the transaction suitable & TCF? (COBS 9.4.8)",
      name: "has_circumstances_objectives_personalised",
      textName: "has_circumstances_objectives_personalised_text",
      answer:
        updatedComplianceData.has_circumstances_objectives_personalised !==
        undefined
          ? updatedComplianceData.has_circumstances_objectives_personalised
          : complianceData?.has_circumstances_objectives_personalised || null,
      comment:
        updatedComplianceData.has_circumstances_objectives_personalised_text !==
        undefined
          ? updatedComplianceData.has_circumstances_objectives_personalised_text
          : complianceData?.has_circumstances_objectives_personalised_text ||
            null,
    },
    {
      reference: "8.23",
      title:
        "Has Budget and Affordability been personalised? and irrelevant sections removed?",
      name: "has_budget_affordability_been_personalised",
      textName: "has_budget_affordability_been_personalised_text",
      answer:
        updatedComplianceData.has_budget_affordability_been_personalised !==
        undefined
          ? updatedComplianceData.has_budget_affordability_been_personalised
          : complianceData?.has_budget_affordability_been_personalised || null,
      comment:
        updatedComplianceData.has_budget_affordability_been_personalised_text !==
        undefined
          ? updatedComplianceData.has_budget_affordability_been_personalised_text
          : complianceData?.has_budget_affordability_been_personalised_text ||
            null,
    },
    {
      reference: "8.3",
      title: "Has new mortgage details been completed?",
      name: "has_new_mortgage_details_been_completed",
      textName: "has_new_mortgage_details_been_complete_text",
      answer:
        updatedComplianceData.has_new_mortgage_details_been_completed !==
        undefined
          ? updatedComplianceData.has_new_mortgage_details_been_completed
          : complianceData?.has_new_mortgage_details_been_completed || null,
      comment:
        updatedComplianceData.has_new_mortgage_details_been_complete_text !==
        undefined
          ? updatedComplianceData.has_new_mortgage_details_been_complete_text
          : complianceData?.has_new_mortgage_details_been_complete_text || null,
    },
    {
      reference: "8.31",
      title: "Has Recommended Mortgage Section 1 been personalised?",
      name: "has_mortgage_section_one_personalised",
      textName: "has_mortgage_section_one_personalised_text",
      answer:
        updatedComplianceData.has_mortgage_section_one_personalised !==
        undefined
          ? updatedComplianceData.has_mortgage_section_one_personalised
          : complianceData?.has_mortgage_section_one_personalised || null,
      comment:
        updatedComplianceData.has_mortgage_section_one_personalised_text !==
        undefined
          ? updatedComplianceData.has_mortgage_section_one_personalised_text
          : complianceData?.has_mortgage_section_one_personalised_text || null,
    },
    {
      reference: "8.32",
      title: "Has Recommended mortgage section 2 been personalised?",
      name: "has_mortgage_section_two_personalised",
      textName: "has_mortgage_section_two_personalised_text",
      answer:
        updatedComplianceData.has_mortgage_section_two_personalised !==
        undefined
          ? updatedComplianceData.has_mortgage_section_two_personalised
          : complianceData?.has_mortgage_section_two_personalised || null,
      comment:
        updatedComplianceData.has_mortgage_section_two_personalised_text !==
        undefined
          ? updatedComplianceData.has_mortgage_section_two_personalised_text
          : complianceData?.has_mortgage_section_two_personalised_text || null,
    },
    {
      reference: "8.33",
      title:
        "Has 'Why are we recommending this repayment method' been completed? (Does it match 'Your Needs?') / If I/O - does it state 2 KFI's have been provided for comparison? Is there evidence of the repayment vehicle - where applicable.",
      name: "are_we_recommending_repayment_method",
      textName: "are_we_recommending_repayment_method_text",
      answer:
        updatedComplianceData.are_we_recommending_repayment_method !== undefined
          ? updatedComplianceData.are_we_recommending_repayment_method
          : complianceData?.are_we_recommending_repayment_method || null,
      comment:
        updatedComplianceData.are_we_recommending_repayment_method_text !==
        undefined
          ? updatedComplianceData.are_we_recommending_repayment_method_text
          : complianceData?.are_we_recommending_repayment_method_text || null,
    },
    {
      reference: "8.34",
      title:
        "Has 'Why are we recommending this mortgage type' been completed? Is there confirmation that the mortgage is affordable during and after the initial benefit rate period?",
      name: "are_we_recommending_mortgage_type",
      textName: "are_we_recommending_mortgage_type_text",
      answer:
        updatedComplianceData.are_we_recommending_mortgage_type !== undefined
          ? updatedComplianceData.are_we_recommending_mortgage_type
          : complianceData?.are_we_recommending_mortgage_type || null,
      comment:
        updatedComplianceData.are_we_recommending_mortgage_type_text !==
        undefined
          ? updatedComplianceData.are_we_recommending_mortgage_type_text
          : complianceData?.are_we_recommending_mortgage_type_text || null,
    },
    {
      reference: "8.35",
      title:
        "Has 'Why are we recommending this mortgage term' been completed? (If the shortest term has not been recommended (as per clients disposable income), has justification been included with the warning of increased cost? If I/O - ensure that the term has not been linked to affordability",
      name: "are_we_recommending_mortgage_term",
      textName: "are_we_recommending_mortgage_term_text",
      answer:
        updatedComplianceData.are_we_recommending_mortgage_term !== undefined
          ? updatedComplianceData.are_we_recommending_mortgage_term
          : complianceData?.are_we_recommending_mortgage_term || null,
      comment:
        updatedComplianceData.are_we_recommending_mortgage_term_text !==
        undefined
          ? updatedComplianceData.are_we_recommending_mortgage_term_text
          : complianceData?.are_we_recommending_mortgage_term_text || null,
    },
    {
      reference: "8.36",
      title:
        "Has 'Why are we recommending this mortgage lender' been completed? including if the cheapest product on EOR has not been recommended, has this been justified?",
      name: "are_we_recommending_mortgage_lender",
      textName: "are_we_recommending_mortgage_lender_text",
      answer:
        updatedComplianceData.are_we_recommending_mortgage_lender !== undefined
          ? updatedComplianceData.are_we_recommending_mortgage_lender
          : complianceData?.are_we_recommending_mortgage_lender || null,
      comment:
        updatedComplianceData.are_we_recommending_mortgage_lender_text !==
        undefined
          ? updatedComplianceData.are_we_recommending_mortgage_lender_text
          : complianceData?.are_we_recommending_mortgage_lender_text || null,
    },
    {
      reference: "8.37",
      title:
        "Has 'Why are we recommending this mortgage amount' been completed? If Debt Con - is there justification why this is suitable?",
      name: "are_we_recommending_mortgage_amount",
      textName: "are_we_recommending_mortgage_amount_text",
      answer:
        updatedComplianceData.are_we_recommending_mortgage_amount !== undefined
          ? updatedComplianceData.are_we_recommending_mortgage_amount
          : complianceData?.are_we_recommending_mortgage_amount || null,
      comment:
        updatedComplianceData.are_we_recommending_mortgage_amount_text !==
        undefined
          ? updatedComplianceData.are_we_recommending_mortgage_amount_text
          : complianceData?.are_we_recommending_mortgage_amount_text || null,
    },
    {
      reference: "8.4",
      title: "Has 'What are the cost and fees' been completed?",
      name: "are_cost_and_fees_been_completed",
      textName: "are_cost_and_fees_been_complete_text",
      answer:
        updatedComplianceData.are_cost_and_fees_been_completed !== undefined
          ? updatedComplianceData.are_cost_and_fees_been_completed
          : complianceData?.are_cost_and_fees_been_completed || null,
      comment:
        updatedComplianceData.are_cost_and_fees_been_complete_text !== undefined
          ? updatedComplianceData.are_cost_and_fees_been_complete_text
          : complianceData?.are_cost_and_fees_been_complete_text || null,
    },
    {
      reference: "8.5",
      title:
        "Has 'What are the disadvantages and risks' been selected as per the type of case?",
      name: "are_disadvantages_risks_been_selected",
      textName: "are_disadvantages_risks_been_selected_text",
      answer:
        updatedComplianceData.are_disadvantages_risks_been_selected !==
        undefined
          ? updatedComplianceData.are_disadvantages_risks_been_selected
          : complianceData?.are_disadvantages_risks_been_selected || null,
      comment:
        updatedComplianceData.are_disadvantages_risks_been_selected_text !==
        undefined
          ? updatedComplianceData.are_disadvantages_risks_been_selected_text
          : complianceData?.are_disadvantages_risks_been_selected_text || null,
    },
    {
      reference: "8.6",
      title: "Has the adviser personalised 'What is the cost of our advice'?",
      name: "has_adviser_personalised",
      textName: "has_adviser_personalised_text",
      answer:
        updatedComplianceData.has_adviser_personalised !== undefined
          ? updatedComplianceData.has_adviser_personalised
          : complianceData?.has_adviser_personalised || null,
      comment:
        updatedComplianceData.has_adviser_personalised_text !== undefined
          ? updatedComplianceData.has_adviser_personalised_text
          : complianceData?.has_adviser_personalised_text || null,
    },
    {
      reference: "8.61",
      title: "Has the adviser included 'Right of Reflection'?",
      name: "has_adviser_included",
      textName: "has_adviser_included_text",
      answer:
        updatedComplianceData.has_adviser_included !== undefined
          ? updatedComplianceData.has_adviser_included
          : complianceData?.has_adviser_included || null,
      comment:
        updatedComplianceData.has_adviser_included_text !== undefined
          ? updatedComplianceData.has_adviser_included_text
          : complianceData?.has_adviser_included_text || null,
    },
    {
      reference: "8.62",
      title: "Has the Protection section been personalised?",
      name: "has_protection_section_personalised",
      textName: "has_protection_section_personalised_text",
      answer:
        updatedComplianceData.has_protection_section_personalised !== undefined
          ? updatedComplianceData.has_protection_section_personalised
          : complianceData?.has_protection_section_personalised || null,
      comment:
        updatedComplianceData.has_protection_section_personalised_text !==
        undefined
          ? updatedComplianceData.has_protection_section_personalised_text
          : complianceData?.has_protection_section_personalised_text || null,
    },
    {
      reference: "8.63",
      title: "Has the B&C section been personalised?",
      name: "has_b_and_c_section_personalised",
      textName: "has_b_and_c_section_personalised_text",
      answer:
        updatedComplianceData.has_b_and_c_section_personalised !== undefined
          ? updatedComplianceData.has_b_and_c_section_personalised
          : complianceData?.has_b_and_c_section_personalised || null,
      comment:
        updatedComplianceData.has_b_and_c_section_personalised_text !==
        undefined
          ? updatedComplianceData.has_b_and_c_section_personalised_text
          : complianceData?.has_b_and_c_section_personalised_text || null,
    },
    {
      reference: "8.64",
      title: "Has the Wills section been personalised and included?",
      name: "has_wills_section_personalised",
      textName: "has_wills_section_personalised_text",
      answer:
        updatedComplianceData.has_wills_section_personalised !== undefined
          ? updatedComplianceData.has_wills_section_personalised
          : complianceData?.has_wills_section_personalised || null,
      comment:
        updatedComplianceData.has_wills_section_personalised_text !== undefined
          ? updatedComplianceData.has_wills_section_personalised_text
          : complianceData?.has_wills_section_personalised_text || null,
    },
    {
      reference: "8.7",
      title:
        "Does the recommended product, interest rate type & initial benefit period match the 'Your Needs' section?",
      name: "does_recommended_product_match_your_needs_section",
      textName: "does_recommended_product_match_your_needs_section_text",
      answer:
        updatedComplianceData.does_recommended_product_match_your_needs_section !==
        undefined
          ? updatedComplianceData.does_recommended_product_match_your_needs_section
          : complianceData?.does_recommended_product_match_your_needs_section ||
            null,
      comment:
        updatedComplianceData.does_recommended_product_match_your_needs_section_text !==
        undefined
          ? updatedComplianceData.does_recommended_product_match_your_needs_section_text
          : complianceData?.does_recommended_product_match_your_needs_section_text ||
            null,
    },
  ];

  const handleAnswerChange = (name: string, value: string) => {
    dispatch(
      updateComplianceAnswer({ field: name as keyof ComplianceState, value })
    );
  };

  const handleCommentChange = (name: string, value: string | null) => {
    dispatch(
      updateComplianceComment({ field: name as keyof ComplianceState, value })
    );
  };

  return (
    <div>
      {suitabilityData.map((item, index) => (
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

export default ComplianceSuitabilityTabContent;
