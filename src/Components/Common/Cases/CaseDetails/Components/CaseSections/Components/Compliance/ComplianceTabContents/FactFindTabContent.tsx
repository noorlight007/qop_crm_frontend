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

const FactFindTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance,
  );

  const factFindData = [
    {
      reference: "4.1",
      title: "Loan details fully completed",
      name: "loan_details_fully_completed",
      textName: "loan_details_fully_completed_text",
      answer:
        updatedComplianceData.loan_details_fully_completed !== undefined
          ? updatedComplianceData.loan_details_fully_completed
          : complianceData?.loan_details_fully_completed || null,
      comment:
        updatedComplianceData.loan_details_fully_completed_text !== undefined
          ? updatedComplianceData.loan_details_fully_completed_text
          : complianceData?.loan_details_fully_completed_text || null,
    },
    {
      reference: "4.11",
      title: "Has source of lead been recorded",
      name: "has_source_of_lead_been_recorded",
      textName: "has_source_of_lead_been_recorded_text",
      answer:
        updatedComplianceData.has_source_of_lead_been_recorded !== undefined
          ? updatedComplianceData.has_source_of_lead_been_recorded
          : complianceData?.has_source_of_lead_been_recorded || null,
      comment:
        updatedComplianceData.has_source_of_lead_been_recorded_text !==
        undefined
          ? updatedComplianceData.has_source_of_lead_been_recorded_text
          : complianceData?.has_source_of_lead_been_recorded_text || null,
    },
    {
      reference: "4.12",
      title:
        "Is the client located in close/realistic proximity to the advisor? If not, has this been justified in the notes stating what due diligence has been carried out by the adviser?",
      name: "realistic_proximity_to_the_advisor",
      textName: "realistic_proximity_to_the_advisor_text",
      answer:
        updatedComplianceData.realistic_proximity_to_the_advisor !== undefined
          ? updatedComplianceData.realistic_proximity_to_the_advisor
          : complianceData?.realistic_proximity_to_the_advisor || null,
      comment:
        updatedComplianceData.realistic_proximity_to_the_advisor_text !==
        undefined
          ? updatedComplianceData.realistic_proximity_to_the_advisor_text
          : complianceData?.realistic_proximity_to_the_advisor_text || null,
    },
    {
      reference: "4.2",
      title:
        "Personal details fully completed for all clients (including details of dependents and 3 year address history)",
      name: "personal_details",
      textName: "personal_details_text",
      answer:
        updatedComplianceData.personal_details !== undefined
          ? updatedComplianceData.personal_details
          : complianceData?.personal_details || null,
      comment:
        updatedComplianceData.personal_details_text !== undefined
          ? updatedComplianceData.personal_details_text
          : complianceData?.personal_details_text || null,
    },
    {
      reference: "4.21",
      title:
        "If retirement age is over state retirement age, has adviser put notes for the plausibility of working to such age.",
      name: "retirement_age",
      textName: "retirement_age_text",
      answer:
        updatedComplianceData.retirement_age !== undefined
          ? updatedComplianceData.retirement_age
          : complianceData?.retirement_age || null,
      comment:
        updatedComplianceData.retirement_age_text !== undefined
          ? updatedComplianceData.retirement_age_text
          : complianceData?.retirement_age_text || null,
    },
    {
      reference: "4.22",
      title: "Does the occupation compared to retirement age seem realistic?",
      name: "does_the_occupation_compared",
      textName: "does_the_occupation_compared_text",
      answer:
        updatedComplianceData.does_the_occupation_compared !== undefined
          ? updatedComplianceData.does_the_occupation_compared
          : complianceData?.does_the_occupation_compared || null,
      comment:
        updatedComplianceData.does_the_occupation_compared_text !== undefined
          ? updatedComplianceData.does_the_occupation_compared_text
          : complianceData?.does_the_occupation_compared_text || null,
    },
    {
      reference: "4.3",
      title: "Employment details fully completed for all clients",
      name: "employment_details",
      textName: "employment_details_text",
      answer:
        updatedComplianceData.employment_details !== undefined
          ? updatedComplianceData.employment_details
          : complianceData?.employment_details || null,
      comment:
        updatedComplianceData.employment_details_text !== undefined
          ? updatedComplianceData.employment_details_text
          : complianceData?.employment_details_text || null,
    },
    {
      reference: "4.31",
      title:
        "Has due diligence been completed on FPI, <6 months new job, second jobs including HMRC reference check.",
      name: "has_due_diligence_been_completed",
      textName: "has_due_diligence_been_completed_text",
      answer:
        updatedComplianceData.has_due_diligence_been_completed !== undefined
          ? updatedComplianceData.has_due_diligence_been_completed
          : complianceData?.has_due_diligence_been_completed || null,
      comment:
        updatedComplianceData.has_due_diligence_been_completed_text !==
        undefined
          ? updatedComplianceData.has_due_diligence_been_completed_text
          : complianceData?.has_due_diligence_been_completed_text || null,
    },
    {
      reference: "4.32",
      title:
        "Does the stated income seem reasonable for the occupation/employment type?",
      name: "does_the_stated_income",
      textName: "does_the_stated_income_text",
      answer:
        updatedComplianceData.does_the_stated_income !== undefined
          ? updatedComplianceData.does_the_stated_income
          : complianceData?.does_the_stated_income || null,
      comment:
        updatedComplianceData.does_the_stated_income_text !== undefined
          ? updatedComplianceData.does_the_stated_income_text
          : complianceData?.does_the_stated_income_text || null,
    },
    {
      reference: "4.33",
      title:
        "Does the stated net income seem reasonable for the occupation/employment type?",
      name: "does_the_stated_net_income",
      textName: "does_the_stated_net_income_text",
      answer:
        updatedComplianceData.does_the_stated_net_income !== undefined
          ? updatedComplianceData.does_the_stated_net_income
          : complianceData?.does_the_stated_net_income || null,
      comment:
        updatedComplianceData.does_the_stated_net_income_text !== undefined
          ? updatedComplianceData.does_the_stated_net_income_text
          : complianceData?.does_the_stated_net_income_text || null,
    },
    {
      reference: "4.34",
      title:
        "Is the client in an occupation where you would expect employee benefits and has this been documented?",
      name: "is_the_client_in_an_occupation",
      textName: "is_the_client_in_an_occupation_text",
      answer:
        updatedComplianceData.is_the_client_in_an_occupation !== undefined
          ? updatedComplianceData.is_the_client_in_an_occupation
          : complianceData?.is_the_client_in_an_occupation || null,
      comment:
        updatedComplianceData.is_the_client_in_an_occupation_text !== undefined
          ? updatedComplianceData.is_the_client_in_an_occupation_text
          : complianceData?.is_the_client_in_an_occupation_text || null,
    },
    {
      reference: "4.4",
      title:
        "Has the property portfolio tab been fully completed if clients own more than 1 property?",
      name: "has_property_portfolio_fully_completed",
      textName: "has_property_portfolio_fully_completed_text",
      answer:
        updatedComplianceData.has_property_portfolio_fully_completed !==
        undefined
          ? updatedComplianceData.has_property_portfolio_fully_completed
          : complianceData?.has_property_portfolio_fully_completed || null,
      comment:
        updatedComplianceData.has_property_portfolio_fully_completed_text !==
        undefined
          ? updatedComplianceData.has_property_portfolio_fully_completed_text
          : complianceData?.has_property_portfolio_fully_completed_text || null,
    },
    {
      reference: "4.5",
      title: "Has proposed property details been fully completed?",
      name: " has_proposed_property_details_fully_completed",
      textName: " has_proposed_property_details_fully_completed_text",
      answer:
        updatedComplianceData.has_proposed_property_details_fully_completed !==
        undefined
          ? updatedComplianceData.has_proposed_property_details_fully_completed
          : complianceData?.has_proposed_property_details_fully_completed ||
            null,
      comment:
        updatedComplianceData.has_proposed_property_details_fully_completed_text !==
        undefined
          ? updatedComplianceData.has_proposed_property_details_fully_completed_text
          : complianceData?.has_proposed_property_details_fully_completed_text ||
            null,
    },
    {
      reference: "4.6",
      title:
        "Has the 'Your Needs' section been fully completed and is it clear what the clients preferences are? (inc Reasons for length of fix, length of term and additional features)",
      name: "has_your_needs_fully_completed",
      textName: "has_your_needs_fully_completed_text",
      answer:
        updatedComplianceData.has_your_needs_fully_completed !== undefined
          ? updatedComplianceData.has_your_needs_fully_completed
          : complianceData?.has_your_needs_fully_completed || null,
      comment:
        updatedComplianceData.has_your_needs_fully_completed_text !== undefined
          ? updatedComplianceData.has_your_needs_fully_completed_text
          : complianceData?.has_your_needs_fully_completed_text || null,
    },
    {
      reference: "4.61",
      title:
        "If I/O, has a repayment vehicle been recorded and does this seem feasible? (if overpayments, have figures been recorded within the budget planner)",
      name: "has_repayment_vehicle_recorded",
      textName: "has_repayment_vehicle_recorded_text",
      answer:
        updatedComplianceData.has_repayment_vehicle_recorded !== undefined
          ? updatedComplianceData.has_repayment_vehicle_recorded
          : complianceData?.has_repayment_vehicle_recorded || null,
      comment:
        updatedComplianceData.has_repayment_vehicle_recorded_text !== undefined
          ? updatedComplianceData.has_repayment_vehicle_recorded_text
          : complianceData?.has_repayment_vehicle_recorded_text || null,
    },
    {
      reference: "4.62",
      title:
        "If capital raising, have figures been input and has this been detailed in the notes section?",
      name: "have_figures_been_input",
      textName: "have_figures_been_input_text",
      answer:
        updatedComplianceData.have_figures_been_input !== undefined
          ? updatedComplianceData.have_figures_been_input
          : complianceData?.have_figures_been_input || null,
      comment:
        updatedComplianceData.have_figures_been_input_text !== undefined
          ? updatedComplianceData.have_figures_been_input_text
          : complianceData?.have_figures_been_input_text || null,
    },
    {
      reference: "4.63",
      title:
        "If deposit is to come from sale of property/ equity do the figures make sense?",
      name: "is_deposit_come_from_sale_of_property",
      textName: "is_deposit_come_from_sale_of_property_text",
      answer:
        updatedComplianceData.is_deposit_come_from_sale_of_property !==
        undefined
          ? updatedComplianceData.is_deposit_come_from_sale_of_property
          : complianceData?.is_deposit_come_from_sale_of_property || null,
      comment:
        updatedComplianceData.is_deposit_come_from_sale_of_property_text !==
        undefined
          ? updatedComplianceData.is_deposit_come_from_sale_of_property_text
          : complianceData?.is_deposit_come_from_sale_of_property_text || null,
    },
    {
      reference: "4.64",
      title:
        "If consolidating, has the adviser completed the debt con calculator, before & after illustration and recorded detailed notes)",
      name: "has_adviser_completed_calculator",
      textName: "has_adviser_completed_calculator_text",
      answer:
        updatedComplianceData.has_adviser_completed_calculator !== undefined
          ? updatedComplianceData.has_adviser_completed_calculator
          : complianceData?.has_adviser_completed_calculator || null,
      comment:
        updatedComplianceData.has_adviser_completed_calculator_text !==
        undefined
          ? updatedComplianceData.has_adviser_completed_calculator_text
          : complianceData?.has_adviser_completed_calculator_text || null,
    },
    {
      reference: "4.7",
      title: "Has Accountant / Solicitor details been confirmed?",
      name: "has_accountant_solicitor_details_confirmed",
      textName: "has_accountant_solicitor_details_confirmed_text",
      answer:
        updatedComplianceData.has_accountant_solicitor_details_confirmed !==
        undefined
          ? updatedComplianceData.has_accountant_solicitor_details_confirmed
          : complianceData?.has_accountant_solicitor_details_confirmed || null,
      comment:
        updatedComplianceData.has_accountant_solicitor_details_confirmed_text !==
        undefined
          ? updatedComplianceData.has_accountant_solicitor_details_confirmed_text
          : complianceData?.has_accountant_solicitor_details_confirmed_text ||
            null,
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
      {factFindData.map((item, index) => (
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

export default FactFindTabContent;
