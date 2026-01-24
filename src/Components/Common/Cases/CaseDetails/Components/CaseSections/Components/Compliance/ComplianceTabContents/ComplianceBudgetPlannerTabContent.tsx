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

const ComplianceBudgetPlannerTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance,
  );
  const budgetPlannerData = [
    {
      reference: "5.1",
      title:
        "Has the credit commitments section been fully completed? (+ cross checked with credit report)",
      name: "has_credit_commitments_fully_completed",
      textName: "has_credit_commitments_fully_completed_text",
      answer:
        updatedComplianceData.has_credit_commitments_fully_completed !==
        undefined
          ? updatedComplianceData.has_credit_commitments_fully_completed
          : complianceData?.has_credit_commitments_fully_completed || null,
      comment:
        updatedComplianceData.has_credit_commitments_fully_completed_text !==
        undefined
          ? updatedComplianceData.has_credit_commitments_fully_completed_text
          : complianceData?.has_credit_commitments_fully_completed_text || null,
    },
    {
      reference: "5.11",
      title:
        "If any credit commitments, is it clear if the commitments will continue or are being repaid? (debts with less 12 months to run, less than £500 or 0% interest free can not be consolidated)",
      name: "is_any_credit_commitments",
      textName: "is_any_credit_commitments_text",
      answer:
        updatedComplianceData.is_any_credit_commitments !== undefined
          ? updatedComplianceData.is_any_credit_commitments
          : complianceData?.is_any_credit_commitments || null,
      comment:
        updatedComplianceData.is_any_credit_commitments_text !== undefined
          ? updatedComplianceData.is_any_credit_commitments_text
          : complianceData?.is_any_credit_commitments_text || null,
    },
    {
      reference: "5.2",
      title:
        "If the client has adverse credit, has it been fully documented? (additional notes to confirm how it occurred)",
      name: "has_client_adverse_credit",
      textName: "has_client_adverse_credit_text",
      answer:
        updatedComplianceData.has_client_adverse_credit !== undefined
          ? updatedComplianceData.has_client_adverse_credit
          : complianceData?.has_client_adverse_credit || null,
      comment:
        updatedComplianceData.has_client_adverse_credit_text !== undefined
          ? updatedComplianceData.has_client_adverse_credit_text
          : complianceData?.has_client_adverse_credit_text || null,
    },
    {
      reference: "5.3",
      title:
        "Has the budget planner been completed in full and does the figures seem reasonable? (information to be compared to bank statements)",
      name: "has_budget_planner_been_completed",
      textName: "has_budget_planner_been_completed_text",
      answer:
        updatedComplianceData.has_budget_planner_been_completed !== undefined
          ? updatedComplianceData.has_budget_planner_been_completed
          : complianceData?.has_budget_planner_been_completed || null,
      comment:
        updatedComplianceData.has_budget_planner_been_completed_text !==
        undefined
          ? updatedComplianceData.has_budget_planner_been_completed_text
          : complianceData?.has_budget_planner_been_completed_text || null,
    },
    {
      reference: "5.31",
      title:
        "Has all direct debits and liabilities been recorded? (cross reference bank statements to liabilities)",
      name: "has_all_direct_debits_been_recorded",
      textName: "has_all_direct_debits_been_recorded_text",
      answer:
        updatedComplianceData.has_all_direct_debits_been_recorded !== undefined
          ? updatedComplianceData.has_all_direct_debits_been_recorded
          : complianceData?.has_all_direct_debits_been_recorded || null,
      comment:
        updatedComplianceData.has_all_direct_debits_been_recorded_text !==
        undefined
          ? updatedComplianceData.has_all_direct_debits_been_recorded_text
          : complianceData?.has_all_direct_debits_been_recorded_text || null,
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
      {budgetPlannerData.map((item, index) => (
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

export default ComplianceBudgetPlannerTabContent;
