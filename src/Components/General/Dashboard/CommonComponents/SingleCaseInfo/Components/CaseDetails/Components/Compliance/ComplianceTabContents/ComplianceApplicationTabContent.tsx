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

const ComplianceApplicationTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance
  );

  const applicationData = [
    {
      reference: "7.1",
      title: "Do the personal details match the factfind?",
      name: "personal_details_match_the_factfind",
      textName: "personal_details_match_the_factfind_text",
      answer:
        updatedComplianceData.personal_details_match_the_factfind !== undefined
          ? updatedComplianceData.personal_details_match_the_factfind
          : complianceData?.personal_details_match_the_factfind || null,
      comment:
        updatedComplianceData.personal_details_match_the_factfind_text !==
        undefined
          ? updatedComplianceData.personal_details_match_the_factfind_text
          : complianceData?.personal_details_match_the_factfind_text || null,
    },
    {
      reference: "7.2",
      title: "Does the employment and income details match the factfind?",
      name: "does_employment_and_income_details_match",
      textName: "does_employment_and_income_details_match_text",
      answer:
        updatedComplianceData.does_employment_and_income_details_match !==
        undefined
          ? updatedComplianceData.does_employment_and_income_details_match
          : complianceData?.does_employment_and_income_details_match || null,
      comment:
        updatedComplianceData.does_employment_and_income_details_match_text !==
        undefined
          ? updatedComplianceData.does_employment_and_income_details_match_text
          : complianceData?.does_employment_and_income_details_match_text ||
            null,
    },
    {
      reference: "7.3",
      title: "Does the property and loan details match the factfind?",
      name: "does_property_loan_details_match",
      textName: "does_property_loan_details_match_text",
      answer:
        updatedComplianceData.does_property_loan_details_match !== undefined
          ? updatedComplianceData.does_property_loan_details_match
          : complianceData?.does_property_loan_details_match || null,
      comment:
        updatedComplianceData.does_property_loan_details_match_text !==
        undefined
          ? updatedComplianceData.does_property_loan_details_match_text
          : complianceData?.does_property_loan_details_match_text || null,
    },
    {
      reference: "7.4",
      title:
        "Does the mortgage application confirm who submitted the application?",
      name: "does_mortgage_application_confirm",
      textName: "does_mortgage_application_confirm_text",
      answer:
        updatedComplianceData.does_mortgage_application_confirm !== undefined
          ? updatedComplianceData.does_mortgage_application_confirm
          : complianceData?.does_mortgage_application_confirm || null,
      comment:
        updatedComplianceData.does_mortgage_application_confirm_text !==
        undefined
          ? updatedComplianceData.does_mortgage_application_confirm_text
          : complianceData?.does_mortgage_application_confirm_text || null,
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
      {applicationData.map((item, index) => (
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

export default ComplianceApplicationTabContent;
