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

const DataProtectionTabContent: FC = () => {
  const { casealias } = useParams();
  const { data: complianceData } = useGetComplianceQuery({
    case_alias: casealias,
  });
  const dispatch = useAppDispatch();
  const updatedComplianceData = useAppSelector(
    (state: RootState) => state.compliance
  );

  const dataProtectionData = [
    {
      reference: "2.1",
      title: "Factfind Filled",
      name: "factfind_filled",
      textName: "factfind_filled_text",
      answer:
        updatedComplianceData.factfind_filled !== undefined
          ? updatedComplianceData.factfind_filled
          : complianceData?.factfind_filled || null,
      comment:
        updatedComplianceData.factfind_filled_text !== undefined
          ? updatedComplianceData.factfind_filled_text
          : complianceData?.factfind_filled_text || null,
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
      {dataProtectionData.map((item, index) => (
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

export default DataProtectionTabContent;
