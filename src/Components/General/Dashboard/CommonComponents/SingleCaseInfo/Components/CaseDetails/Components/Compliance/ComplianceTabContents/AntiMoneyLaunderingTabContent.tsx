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

const AntiMoneyLaunderingTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance
  );

  const amlData = [
    {
      reference: "3.1",
      title: "Nivo IDV check (Run & Completed)",
      name: "nivo_idv_check",
      textName: "nivo_idv_check_text",
      answer:
        updatedComplianceData.nivo_idv_check !== undefined
          ? updatedComplianceData.nivo_idv_check
          : complianceData?.nivo_idv_check || null,
      comment:
        updatedComplianceData.nivo_idv_check_text !== undefined
          ? updatedComplianceData.nivo_idv_check_text
          : complianceData?.nivo_idv_check_text || null,
    },
    {
      reference: "3.2",
      title:
        "Financial Sanctions checked and copy on file (dated prior to research)",
      name: "financial_sanctions_checked",
      textName: "financial_sanctions_checked_text",
      answer:
        updatedComplianceData.financial_sanctions_checked !== undefined
          ? updatedComplianceData.financial_sanctions_checked
          : complianceData?.financial_sanctions_checked || null,
      comment:
        updatedComplianceData.financial_sanctions_checked_text !== undefined
          ? updatedComplianceData.financial_sanctions_checked_text
          : complianceData?.financial_sanctions_checked_text || null,
    },
    {
      reference: "3.3",
      title: "Proof of ID (In Date & Certified)",
      name: "proof_of_id",
      textName: "proof_of_id_text",
      answer:
        updatedComplianceData.proof_of_id !== undefined
          ? updatedComplianceData.proof_of_id
          : complianceData?.proof_of_id || null,
      comment:
        updatedComplianceData.proof_of_id_text !== undefined
          ? updatedComplianceData.proof_of_id_text
          : complianceData?.proof_of_id_text || null,
    },
    {
      reference: "3.4",
      title: "Proof of Address (In Date & Certified)",
      name: "proof_of_address",
      textName: "proof_of_address_text",
      answer:
        updatedComplianceData.proof_of_address !== undefined
          ? updatedComplianceData.proof_of_address
          : complianceData?.proof_of_address || null,
      comment:
        updatedComplianceData.proof_of_address_text !== undefined
          ? updatedComplianceData.proof_of_address_text
          : complianceData?.proof_of_address_text || null,
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
      {amlData.map((item, index) => (
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

export default AntiMoneyLaunderingTabContent;
