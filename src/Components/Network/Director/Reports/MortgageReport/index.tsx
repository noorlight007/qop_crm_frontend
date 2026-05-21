"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import MortgageReportContent from "./MortgageReportContent/MortgageReportContent";

const NetworkDirectorReportsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Network Director Reports"
        subTitle="Generate and analyze comprehensive organisation reports"
        items={[{ label: "Cases" }, { label: "Reports", active: true }]}
      />
      {/* Mortgage Report Content */}
      <MortgageReportContent />
    </div>
  );
};

export default NetworkDirectorReportsContainer;
