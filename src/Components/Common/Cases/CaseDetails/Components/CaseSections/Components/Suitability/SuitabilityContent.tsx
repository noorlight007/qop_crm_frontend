import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetSuitabilityQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Suitability/SuitabilityApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { useParams } from "next/navigation";
import React from "react";
import { Container } from "reactstrap";
import DebtConsolidation from "./Components/DebtConsolidation";
import HighLoanToValue from "./Components/HighLoanToValue";
import IslamicMortgage from "./Components/IslamicMortgage";
import LendingIntoRetirement from "./Components/LendingIntoRetirement";
import PortingMortgageIncrease from "./Components/PortingMortgageIncrease";
import ProductTransfer from "./Components/ProductTransfer";
import RateTypePaymentMethod from "./Components/RateTypePaymentMethod";
import RecommendationLetter from "./Components/RecommendationLetter";
import ShortenedProductTransfer from "./Components/ShortenedProductTransfer";

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

  if (isCaseLoading || isSuitLoading) return <LoadingGrow />;

  return (
    <Container
      fluid
      className="py-4 px-2 px-md-4 suitability-page-bg" // ← class replaces inline style
    >
      <h1 className="mb-4 text-danger text-center fw-bold">
        This page is under Development
      </h1>
      <div className="suitability-letter">
        <RecommendationLetter caseData={caseData} suitability={suitability} />
        <Divider />
        <DebtConsolidation caseData={caseData} suitability={suitability} />
        <Divider />
        <LendingIntoRetirement caseData={caseData} suitability={suitability} />
        <Divider />
        <PortingMortgageIncrease
          caseData={caseData}
          suitability={suitability}
        />
        <Divider />
        <IslamicMortgage caseData={caseData} suitability={suitability} />
        <Divider />
        <RateTypePaymentMethod caseData={caseData} suitability={suitability} />
        <Divider />
        <ProductTransfer caseData={caseData} suitability={suitability} />
        <Divider />
        <ShortenedProductTransfer
          caseData={caseData}
          suitability={suitability}
        />
        <Divider />
        <HighLoanToValue caseData={caseData} />
      </div>
    </Container>
  );
};

export default Suitability;
