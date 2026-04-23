export const arrangementOptions: { value: string; label: string }[] = [
    {
      value: "ADDED_TO_MORTGAGE",
      label:
        "You have chosen to add the arrangement fee to your mortgage. This will mean you incur interest on this amount for the duration of the mortgage. The mortgage illustration I have provided contains further details.",
    },
    {
      value: "PAID_UPFRONT",
      label:
        "Your preference was to pay the arrangement fee up front therefore, no fees were added to the loan.",
    },
    {
      value: "NO_FEE",
      label: "The recommended mortgage does not have an arrangement fee.",
    },
  ];

export const ercOptions: { value: string; label: string }[] = [
    {
      value: "APPLIES_INITIAL_PERIOD",
      label:
        "Early repayment charges will apply during your initial rate period.",
    },
    {
      value: "DO_NOT_APPLY",
      label: "Early repayment charges do not apply to your mortgage.",
    },
  ];

  export const ercMeaningOptions: { value: string; label: string }[] = [
    {
      value: "APPLY_WITH_ALLOWANCE",
      label:
        "Charges will apply if you choose to repay all or part of your mortgage before the end of the initial deal period. Please see your mortgage illustration for details of any overpayment allowance.",
    },
    {
      value: "NO_ERC_ADMIN_FEE_POSSIBLE",
      label:
        "There are no early repayment charges associated with your recommended mortgage deal. However, the lender may charge an administration fee.",
    },
  ];

  export const ercWhyOptions: { value: string; label: string }[] = [
    {
      value: "CLIENT_ACCEPTS_ERC",
      label:
        "You have no intention of moving or repaying the mortgage in part or in full during the initial deal period, so are happy to accept that the product has early repayment charges, to secure the deal.",
    },
    {
      value: "CLIENT_PREFERS_NO_ERC",
      label:
        "It was your preference to have the flexibility to repay the mortgage in part or in full during the initial deal period, without incurring early repayment charges for doing so.",
    },
  ];

  export const portableOptions: { value: string; label: string }[] = [
    {
      value: "PORTABLE",
      label: "Your mortgage is portable",
    },
    {
      value: "NOT_PORTABLE",
      label: "Your mortgage is not portable",
    },
  ];

  export const portableMeaningOptions: { value: string; label: string }[] = [
    {
      value: "PORTABLE_SUBJECT",
      label:
        "Subject to lender agreement at the time, you may be able to transfer the mortgage to another property if you move home.",
    },
    {
      value: "NOT_PORTABLE_MUST_REPAY",
      label:
        "If you move home, you will not be able to transfer the mortgage to a new property, you will need to repay it.",
    },
  ];

  export const portableWhyOptionTemplates: { value: string; label: string }[] = [
    {
      value: "RECOMMENDED_PORTABLE",
      label: "I recommended a mortgage which is portable because",
    },
    {
      value: "RECOMMENDED_NOT_PORTABLE",
      label: "I recommended a mortgage which is not portable because",
    },
  ];

  export const rateSwitchOptions: {
    value: string;
    displayLabel: string;
    label: string;
  }[] = [
    {
      value: "CUSTOMER_RESPONSIBILITY",
      displayLabel: "Option 1 – Customer's responsibility",
      label:
        "The recommended lender offers the opportunity for you to switch to a lower, like-for-like mortgage deal, should one become available prior to the completion. However, the lender will not contact you to tell you if their rates reduce. You should review published rates periodically to check if they have reduced. Terms and conditions apply – including how far in advance of the completion date your lender needs to receive your instruction to change rate. Please ensure that you check these to avoid missing any potential rate change deadline.",
    },
    {
      value: "INFORMAL_NOTIFICATION",
      displayLabel: "Option 2 – AR informal / non-binding checks",
      label:
        "The recommended lender offers the opportunity for you to switch to a lower, like-for-like mortgage deal, should one become available prior to the completion. However, the lender will not contact you to tell you if their rates reduce. We will notify you if we identify that a reduced rate is available. We do not guarantee to identify every change in interest rates. It is important, therefore, that you also check the lenders rates periodically between now and the mortgage completion date. Please note that the timing of your completion date may mean there is a final date when changes to the rate can be made.",
    },
    {
      value: "COMMITTED_SERVICE",
      displayLabel: "Option 3 – Committed service",
      label:
        "The recommended lender offers the opportunity for you to switch to a lower, like-for-like mortgage deal, should one become available prior to the completion. However, the lender will not contact you to tell you if their rates reduce. We will check the lender rates at least every (period) and we will notify you if we identify a lower interest rate. Please note that the timing of your completion date may mean there is a final date when changes can be made.",
    },
  ];

  export const protectionOptionTemplates: {
    value: string;
    label: string;
    requiresReason: boolean;
  }[] = [
    {
      value: "SEEK_SPECIALIST",
      label:
        "I recommend you seek advice from a specialist protection advisor.",
      requiresReason: false,
    },
    {
      value: "CLIENT_DECLINED",
      label: "You decided not to accept my protection recommendations because",
      requiresReason: true,
    },
    {
      value: "NO_NEW_POLICIES",
      label:
        "I am not recommending you take out any new protection policies because",
      requiresReason: true,
    },
    {
      value: "FURTHER_LETTER",
      label:
        "You will receive a further recommendation letter from me relating to the protection advice I have given.",
      requiresReason: false,
    },
    {
      value: "DISCUSS_PENDING",
      label:
        "It is important we discuss protecting your mortgage & finances, please confirm when you are available to do so.",
      requiresReason: false,
    },
  ];

  export const homeInsuranceOptions: { value: string; label: string }[] = [
    {
      value: "FURTHER_LETTER",
      label:
        "You will receive a further recommendation letter from me relating to your home insurance.",
    },
    {
      value: "DISCUSS_PENDING",
      label:
        "It is important we discuss your home insurance before exchange of contracts, please confirm when you are available to do so.",
    },
    {
      value: "CLIENT_ARRANGING_OWN",
      label:
        "You have confirmed that you would prefer to arrange your own cover and do not need my advice on this matter.",
    },
    {
      value: "SEEK_SPECIALIST",
      label: "I recommend you seek advice from a specialist for this cover.",
    },
  ];