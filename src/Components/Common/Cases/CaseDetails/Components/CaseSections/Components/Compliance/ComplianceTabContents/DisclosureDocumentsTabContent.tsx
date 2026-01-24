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

const DisclosureDocumentsTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance,
  );

  const disclosureData = [
    {
      reference: "1.1",
      title: "Terms of Business (Signed & Dated)",
      name: "terms_of_business",
      textName: "terms_of_business_text",
      answer:
        updatedComplianceData.terms_of_business !== undefined
          ? updatedComplianceData.terms_of_business
          : complianceData?.terms_of_business || null,
      comment:
        updatedComplianceData.terms_of_business_text !== undefined
          ? updatedComplianceData.terms_of_business_text
          : complianceData?.terms_of_business_text || null,
    },
    {
      reference: "1.2",
      title: "Privacy Notice (Signed & Dated)",
      name: "privacy_notice",
      textName: "privacy_notice_text",
      answer:
        updatedComplianceData.privacy_notice !== undefined
          ? updatedComplianceData.privacy_notice
          : complianceData?.privacy_notice || null,
      comment:
        updatedComplianceData.privacy_notice_text !== undefined
          ? updatedComplianceData.privacy_notice_text
          : complianceData?.privacy_notice_text || null,
    },
    {
      reference: "1.3",
      title:
        "Fee Agreement (Signed & Dated) - are fees reasonable and in line with approved fee statement?",
      name: "fee_agreement",
      textName: "fee_agreement_text",
      answer:
        updatedComplianceData.fee_agreement !== undefined
          ? updatedComplianceData.fee_agreement
          : complianceData?.fee_agreement || null,
      comment:
        updatedComplianceData.fee_agreement_text !== undefined
          ? updatedComplianceData.fee_agreement_text
          : complianceData?.fee_agreement_text || null,
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
      {disclosureData.map((item, index) => (
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

export default DisclosureDocumentsTabContent;
