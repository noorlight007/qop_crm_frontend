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

const MandatoryDocumentationTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance
  );

  const mandatoryDocData = [
    {
      reference: "4.1",
      title:
        "Proof of Income (Latest 3 months Payslips + P60 / 2 Years SA302 and TYO)",
      name: "proof_of_income",
      textName: "proof_of_income_text",
      answer:
        updatedComplianceData.proof_of_income !== undefined
          ? updatedComplianceData.proof_of_income
          : complianceData?.proof_of_income || null,
      comment:
        updatedComplianceData.proof_of_income_text !== undefined
          ? updatedComplianceData.proof_of_income_text
          : complianceData?.proof_of_income_text || null,
    },
    {
      reference: "4.2",
      title:
        "Proof of Deposit (Latest mortgage statement for Remo / Gifted Deposit / Bank Statement)",
      name: "proof_of_deposit",
      textName: "proof_of_deposit_text",
      answer:
        updatedComplianceData.proof_of_deposit !== undefined
          ? updatedComplianceData.proof_of_deposit
          : complianceData?.proof_of_deposit || null,
      comment:
        updatedComplianceData.proof_of_deposit_text !== undefined
          ? updatedComplianceData.proof_of_deposit_text
          : complianceData?.proof_of_deposit_text || null,
    },
    {
      reference: "4.3",
      title: "Bank statements (Latest 3 months showing inc & exp)",
      name: "bank_statements",
      textName: "bank_statements_text",
      answer:
        updatedComplianceData.bank_statements !== undefined
          ? updatedComplianceData.bank_statements
          : complianceData?.bank_statements || null,
      comment:
        updatedComplianceData.bank_statements_text !== undefined
          ? updatedComplianceData.bank_statements_text
          : complianceData?.bank_statements_text || null,
    },
    {
      reference: "4.4",
      title: "Credit Reports",
      name: "credit_reports",
      textName: "credit_reports_text",
      answer:
        updatedComplianceData.credit_reports !== undefined
          ? updatedComplianceData.credit_reports
          : complianceData?.credit_reports || null,
      comment:
        updatedComplianceData.credit_reports_text !== undefined
          ? updatedComplianceData.credit_reports_text
          : complianceData?.credit_reports_text || null,
    },
    {
      reference: "4.5",
      title: "Affordability Calculator (Selected Lender)",
      name: "affordability_calculator",
      textName: "affordability_calculator_text",
      answer:
        updatedComplianceData.affordability_calculator !== undefined
          ? updatedComplianceData.affordability_calculator
          : complianceData?.affordability_calculator || null,
      comment:
        updatedComplianceData.affordability_calculator_text !== undefined
          ? updatedComplianceData.affordability_calculator_text
          : complianceData?.affordability_calculator_text || null,
    },
    {
      reference: "4.6",
      title:
        "Evidence of Research (Showing Selected Lender) + Mortgage Illustration(/s)",
      name: "evidence_of_research",
      textName: "evidence_of_research_text",
      answer:
        updatedComplianceData.evidence_of_research !== undefined
          ? updatedComplianceData.evidence_of_research
          : complianceData?.evidence_of_research || null,
      comment:
        updatedComplianceData.evidence_of_research_text !== undefined
          ? updatedComplianceData.evidence_of_research_text
          : complianceData?.evidence_of_research_text || null,
    },
    {
      reference: "4.7",
      title: "Agreement in Principle",
      name: "agreement_in_principle",
      textName: "agreement_in_principle_text",
      answer:
        updatedComplianceData.agreement_in_principle !== undefined
          ? updatedComplianceData.agreement_in_principle
          : complianceData?.agreement_in_principle || null,
      comment:
        updatedComplianceData.agreement_in_principle_text !== undefined
          ? updatedComplianceData.agreement_in_principle_text
          : complianceData?.agreement_in_principle_text || null,
    },
    {
      reference: "4.8",
      title: "Signed Application Form",
      name: "signed_application",
      textName: "signed_application_text",
      answer:
        updatedComplianceData.signed_application !== undefined
          ? updatedComplianceData.signed_application
          : complianceData?.signed_application || null,
      comment:
        updatedComplianceData.signed_application_text !== undefined
          ? updatedComplianceData.signed_application_text
          : complianceData?.signed_application_text || null,
    },
    {
      reference: "4.9",
      title: "Suitability Letter - Signed",
      name: "suitability_letter",
      textName: "suitability_letter_text",
      answer:
        updatedComplianceData.suitability_letter !== undefined
          ? updatedComplianceData.suitability_letter
          : complianceData?.suitability_letter || null,
      comment:
        updatedComplianceData.suitability_letter_text !== undefined
          ? updatedComplianceData.suitability_letter_text
          : complianceData?.suitability_letter_text || null,
    },
    {
      reference: "4.91",
      title: "Mortgage Offer",
      name: "mortgage_offer",
      textName: "mortgage_offer_text",
      answer:
        updatedComplianceData.mortgage_offer !== undefined
          ? updatedComplianceData.mortgage_offer
          : complianceData?.mortgage_offer || null,
      comment:
        updatedComplianceData.mortgage_offer_text !== undefined
          ? updatedComplianceData.mortgage_offer_text
          : complianceData?.mortgage_offer_text || null,
    },
    {
      reference: "4.92",
      title: "Debt Consolidation Calculator (+Before & After Illustrations)",
      name: "debt_consolidation_calculator",
      textName: "debt_consolidation_calculator_text",
      answer:
        updatedComplianceData.debt_consolidation_calculator !== undefined
          ? updatedComplianceData.debt_consolidation_calculator
          : complianceData?.debt_consolidation_calculator || null,
      comment:
        updatedComplianceData.debt_consolidation_calculator_text !== undefined
          ? updatedComplianceData.debt_consolidation_calculator_text
          : complianceData?.debt_consolidation_calculator_text || null,
    },
    {
      reference: "4.93",
      title: "Shared Equity Documentation",
      name: "shared_equity_documentation",
      textName: "shared_equity_documentation_text",
      answer:
        updatedComplianceData.shared_equity_documentation !== undefined
          ? updatedComplianceData.shared_equity_documentation
          : complianceData?.shared_equity_documentation || null,
      comment:
        updatedComplianceData.shared_equity_documentation_text !== undefined
          ? updatedComplianceData.shared_equity_documentation_text
          : complianceData?.shared_equity_documentation_text || null,
    },
    {
      reference: "4.94",
      title: "Proof of Lending into Retirement (if applicable for Resi)",
      name: "proof_of_lending",
      textName: "proof_of_lending_text",
      answer:
        updatedComplianceData.proof_of_lending !== undefined
          ? updatedComplianceData.proof_of_lending
          : complianceData?.proof_of_lending || null,
      comment:
        updatedComplianceData.proof_of_lending_text !== undefined
          ? updatedComplianceData.proof_of_lending_text
          : complianceData?.proof_of_lending_text || null,
    },
    {
      reference: "4.95",
      title:
        "Proof of Repayment Vehicle (for Resi Int only OR BTL int only unless sale of security property)",
      name: "proof_of_repayment",
      textName: "proof_of_repayment_text",
      answer:
        updatedComplianceData.proof_of_repayment !== undefined
          ? updatedComplianceData.proof_of_repayment
          : complianceData?.proof_of_repayment || null,
      comment:
        updatedComplianceData.proof_of_repayment_text !== undefined
          ? updatedComplianceData.proof_of_repayment_text
          : complianceData?.proof_of_repayment_text || null,
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
      {mandatoryDocData.map((item, index) => (
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

export default MandatoryDocumentationTabContent;
