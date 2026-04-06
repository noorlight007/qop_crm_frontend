import { useGetSuitabilityQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Suitability/SuitabilityApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import LoadingSpinner from "@/app/loading";
import { useParams } from "next/navigation";
import React from "react";
import { Container } from "reactstrap";
import RecommendationLetter from "./Components/RecommendationLetter";
import DebtConsolidation from "./Components/DebtConsolidation";
import LendingIntoRetirement from "./Components/LendingIntoRetirement";
import PortingMortgageIncrease from "./Components/PortingMortgageIncrease";
import IslamicMortgage from "./Components/IslamicMortgage";
import RateTypePaymentMethod from "./Components/RateTypePaymentMethod";
import ProductTransfer from "./Components/ProductTransfer";
import ShortenedProductTransfer from "./Components/ShortenedProductTransfer";
import HighLoanToValue from "./Components/HighLoanToValue";



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

  if (isCaseLoading || isSuitLoading) return <LoadingSpinner />;

  const letterStyle: React.CSSProperties = {
    background: "#fff",
    boxShadow: "0 4px 28px rgba(0,0,0,0.15)",
    maxWidth: 920,
    margin: "0 auto",
    padding: "48px 60px 60px",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "0.92rem",
    color: "#1a1a1a",
    lineHeight: "1.7",
  };

  return (
    <Container
      fluid
      className="py-4 px-2 px-md-4"
      style={{ background: "#e4e4e4", minHeight: "100vh" }}
    >
      <div style={letterStyle}>

        {/* 1. Recommendation Letter */}
        <RecommendationLetter caseData={caseData} suitability={suitability} />

        {/* 2. Debt Consolidation */}
        <Divider />
        <DebtConsolidation caseData={caseData} suitability={suitability} />

        {/* 3. Lending into Retirement */}
        <Divider />
        <LendingIntoRetirement caseData={caseData} suitability={suitability} />

        {/* 4. Porting Mortgage Increase */}
        <Divider />
        <PortingMortgageIncrease caseData={caseData} suitability={suitability} />

        {/* 5. Islamic Mortgage */}
        <Divider />
        <IslamicMortgage caseData={caseData} suitability={suitability} />

        {/* 6. Rate Type & Payment Method */}
        <Divider />
        <RateTypePaymentMethod caseData={caseData} suitability={suitability} />

        {/* 7. Product Transfer */}
        <Divider />
        <ProductTransfer caseData={caseData} suitability={suitability} />

        {/* 8. Shortened Product Transfer */}
        <Divider />
        <ShortenedProductTransfer caseData={caseData} suitability={suitability} />

        {/* 9. High Loan to Value */}
        <Divider />
        <HighLoanToValue caseData={caseData} />

      </div>
    </Container>
  );
};

export default Suitability;