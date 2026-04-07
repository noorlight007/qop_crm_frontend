import React from "react";

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6 className="suitability-section-heading">
    {children}
  </h6>
);

interface HighLoanToValueProps {
  caseData: any;
}

const HighLoanToValue: React.FC<HighLoanToValueProps> = ({ caseData }) => {
  const companyName = caseData?.company_name ?? "Cityplus Network";

  return (
    <>
      <SectionHeading>High Loan to Value</SectionHeading>

      <p>
        The loan-to-value ratio on your mortgage is high. This puts you at
        greater risk of negative equity if property values fall. Negative equity
        is when you owe more on the property than it is worth, which can affect
        your ability to change your mortgage deal. Using a higher deposit can
        reduce this risk and may give you access to more cost-effective interest
        rates, which could save you money. High loan-to-value mortgages are also
        associated with a higher risk of repossession, please consider these
        risks carefully.
      </p>

      {/* ── Footer ── */}
      <div className="mt-5 pt-3 border-top text-center">
        <small className="text-muted">
          {companyName} &mdash; This letter is generated as part of your
          mortgage advice record. Please retain it for your records.
        </small>
      </div>
    </>
  );
};

export default HighLoanToValue;
