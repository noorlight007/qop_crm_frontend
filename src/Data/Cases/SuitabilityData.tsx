import getCurrencySign from "@/utils/currency";

export const defaultAnswersData = {
  // circumstancesAndObjectives
  circumstancesAndObjectives_G_A1: `During our Factfind, you told me your aims and objectives of this transaction are:
1. 
2.`,
  circumstancesAndObjectives_G_A2: `Consolidating debts You have accumulated a significant level of debt and you wished to reduce the overall cost of repaying this over the long termreduce your monthly payments reduce your monthly expenditure reduce the interest rates that you are paying in order to insert reason for consolidating debt.
1. `,
  circumstancesAndObjectives_G_A3: `Remortgage Your current mortgage is with {current-lender} . You have an outstanding balance of approximately ${getCurrencySign()}{current-balance} on a {repayment-method} basis, over a remaining term of {mortgage-term}{term-months}. Early repayment charges may apply to your current mortgage and we have taken these into consideration when recommending your new deal. We have decided to pay the early repayment charge because: 
1. 
There are no early repayment charges connected to your existing mortgage, however your lender may charge you an administration fee which you have confirmed you are happy to pay.`,
  circumstancesAndObjectives_S_A1: `During our Factfind, you told me your aims and objectives of this transaction are:
1. You are a first time buyer
2. You are buying this home to live in 
3. The term recommended falls within your affordability`,
  circumstancesAndObjectives_S_A2: `During our Factfind, you told me your aims and objectives of this transaction are:
1. 90 % FTV (finance to value) 
2. 25 years finance term
3. 2 year fixed rate product

You wanted to refinance a property that you currently own. 

Your current finance is with XXXX. You have an outstanding balance of approximately ${getCurrencySign()}xxx on a Diminishing Musharakah (acquisition) and Ijara (rent) or Ijara (rent only). 

There are no early repayment charges connected to your existing finance, however your lender may charge you an administration fee which you have confirmed you are happy to pay.`,
  // Budget and affordability
  budgetAndAffordability_G_A1: `We discussed your income and expenditure in detail and recorded this in full. From these discussions we established you have a budget of ${getCurrencySign()} per month to meet the mortgage payments and associated costs.

We also considered if this was likely to change in the foreseeable future and you have confirmed this amount remains readily available. 

We discussed the impact that interest rate increases may have on your monthly mortgage payments as detailed in the Mortgage Illustration and on your cost of living in general. You have confirmed to me that you do not expect to see any future changes at this time. `,
  budgetAndAffordability_G_A2: `Buy to Let As part of its decision on the buy-to-let mortgage application, the lender will assess whether the mortgage is affordable. This will be determined based on your net income, and the rent you are going to charge. Each lender has their own ICR calculation and it may be determined on your tax status.`,
  budgetAndAffordability_S_A1: `We discussed your income and expenditure in detail and recorded this in full. From these discussions we established you have a budget of ${getCurrencySign()}xxx per month to meet the finance payments and associated costs.  

We also considered if this was likely to change in the foreseeable future.  
You have confirmed to me that you do not expect any significant changes now or in the foreseeable future. 

We discussed the impact that rental rate increases may have on your monthly finance payments as detailed in the finance Illustration and on your cost of living in general.`,
  budgetAndAffordability_S_A2: `Buy to Let
As part of its decision on the buy-to-let finance application, the bank / financier will assess whether the finance is affordable. This will be determined based on your net income, and the rent you are going to charge. 

In your case, the bank / financier requires this to be 145% of the finance payment for a 2 year fix. 

OR
In your case, the bank/financier does not stress test the finance payment like it would a 2 year product  as this finance product has been arranged on a 5 year fixed rate. `,
  // New Mortgage Details
  newMortgageDetails_G_A1: `You confirmed you wish to pay a deposit of ${getCurrencySign()}xxx in relation to the new mortgage.

You provided evidence of the source of the deposit through your savings account statement/bank account statements/a letter from each family member who has contributed to the deposit/a letter from your family/other.`,
  newMortgageDetails_G_A2: `You confirmed the deposit for the new mortgage is coming from equity within your current property`,
  newMortgageDetails_S_A1: `You confirmed you wish to pay a deposit of ${getCurrencySign()}xxx in relation to the new finance agreement. The deposit was set at this level because XXXXXXX

You provided evidence of the source of the deposit by providing your personal bank statement/gift declaration form along with giftors 6 months bank statement insert other, as appropriate.`,
  newMortgageDetails_S_A2: `You confirmed the deposit for the new finance agreement is coming from equity within your current property.`,
  // Why are we recommending this repayment method
  recommendingRepaymentMethod_G_A1: `REPAYMENT MORTGAGE

I explained the different repayment methods to you. You told me that you want to be certain that your entire mortgage is repaid by the end of the mortgage term.  Therefore I have recommended that your mortgage is arranged on a capital and interest repayment basis. This will give you the certainty of your mortgage being repaid by the end of its term provided that you make the required monthly payments when due.`,
  recommendingRepaymentMethod_G_A2: `Residential interest-only 
I provided you with two Key Facts Illustrations, one for the mortgage on a capital and interest repayment basis and one for interest-only. We discussed the differences in cost. It is your intention to use (insert details to repay your mortgage balance at the end of the term). Based on this, I have recommended an interest-only mortgage.

As part of the application, you will have to demonstrate to the lender that you have a clearly understood and credible repayment strategy in place.

If your circumstances change you must review your mortgage repayment strategy immediately to ensure your home is not at risk.

It is important to note, lenders may change their acceptance criteria for interest-only repayment strategies, which may impact on your ability to switch your mortgage in the future.`,
  recommendingRepaymentMethod_G_A3: `Interest Only 
I explained that your monthly payments to the lender will only consist of interest. The amount of your loan will not go down and the outstanding amount will be repayable in full at the end of the mortgage term.

It is your responsibility to ensure that your mortgage is repaid at the end of the term. You are aware that you will need to show the lender that you have a clearly understood and credible strategy in place to ensure that you can repay the loan.

As part of the application, you will have to demonstrate to the lender that you have a clearly understood and credible repayment strategy in place.

If your circumstances change you must review your mortgage repayment strategy immediately to ensure your home is not at risk.

It is important to note, lenders may change their acceptance criteria for interest-only repayment strategies, which may impact on your ability to switch your mortgage in the future.`,
  recommendingRepaymentMethod_G_A4: `Part Interest Only, Part Repayment Mortgage

I provided you with two Key Facts Illustrations, one for the whole mortgage on a capital and interest repayment basis and one part repayment and part interest-only. We discussed the differences in the cost. Based on our discussion I have recommended a combination of repayment methods because you intend to repay part of the loan with insert details of repayment vehicle. 

Therefore ${getCurrencySign()}Repayment Loan Amount of your mortgage will be on a capital and interest repayment basis. This amount is guaranteed to be repaid by the end of the mortgage term provided you make the required monthly payments when due. 

${getCurrencySign()}interest Only Loan Amount of your mortgage will be on an interest-only basis. I explained that for this portion of your loan, your monthly payments to the lender will only consist of interest.

The amount of your loan will not go down and the outstanding amount will be repayable in full at the end of the mortgage term. 

As part of the application, you will have to demonstrate to the lender that you have a clearly understood and credible repayment strategy in place.

If your circumstances change you must review your mortgage repayment strategy immediately to ensure your home is not at risk.

It is important to note, lenders may change their acceptance criteria for interest-only repayment strategies, which may impact on your ability to switch your mortgage in the future.`,
  recommendingRepaymentMethod_G_A5: `Retirement Interest Only
In taking out a retirement interest-only mortgage, unless it carries a term like a regular mortgage, you accept that you must repay the outstanding capital when any one of the three specified life events occurs. This can be when you decide to sell the property, when you move into care, or on your death.`,
  recommendingRepaymentMethod_S_A1: `Diminishing Musharakah (acquisition) and Ijara (rent)

I explained the different repayment methods to you. You told me that you want to be certain that your entire finance contract is repaid by the end of the term.  Therefore I have recommended that your finance contract is arranged on an Ijara and Diminishing Musharakah (capital and rent repayment basis). This will give you the certainty of your finance is repaid by the end of its term provided that you make the required monthly payments when due.`,
  recommendingRepaymentMethod_S_A2: `Ijara Only

I explained that your monthly payments to the bank / financier will only consist of rent only. The amount of your finance will not go down and the outstanding amount will be repayable in full at the end of the finance  term.

It is your responsibility to ensure that your finance contract is repaid at the end of the term. You are aware that you will need to show the bank/financier that you have a clearly understood and credible strategy in place to ensure that you can repay the loan.

As part of the application, you have mentioned that on maturity you will be either selling the property or you will refinance with a different lender to clear the balance.`,
  // Why are we recommending this mortgage type
  recommendingMortgageType_G_A1: `Fixed Rate
Having discussed the interest rate options available, I recommended a fixed rate product. A fixed rate mortgage provides you with the certainty of knowing exactly what your monthly repayments will be during the fixed rate period and that they will not vary or increase. I recommended you take out a  mortgage with a fixed period of {product-initial-rate-period} months. 

I have recommended a fixed rate because a fixed rate will protect you from increases in interest rates and enables you to budget effectively, however if interest rates fall during your fixed period, your payment will stay the same and not reduce. I recommend that you contact me before the initial rate ends to review your mortgage arrangements.`,
  recommendingMortgageType_G_A2: `Tracker Rate
Having discussed the interest rate options available, I recommended a tracker rate product.

With this type of mortgage, the interest rate that you will be charged by your lender is linked to the Bank of England base rate during the scheme period. Therefore your monthly repayments are subject to fluctuation in line with the base rate. This means your monthly repayments will reduce if the base rate drops but, will increase if it rises. A tracker mortgage usually provide some of the lowest rates available, but they come with the risk that your payments might increase.

I recommend a tracker period of {product-initial-rate-period}  years.

I have recommended a tracker rate because

I recommend that you contact me before the initial interest rate period ends to review your mortgage arrangements.`,
  recommendingMortgageType_G_A3: `Variable Rate
Having discussed the interest rate options available, I recommended a variable rate product

I have recommended a variable rate because 

Please note your monthly payments are subject to fluctuation in line with the lender’s standard variable rate. This means your payments could increase as well as reduce.`,
  recommendingMortgageType_G_A4: `If recommending no ERC product

Early repayment charges are not applicable to the mortgage product I recommended. This means that if you wish to repay all or part of the loan at any time, your lender will not charge you for doing so. It was important for you to have a loan with no early repayment charges because insert reasons. Please note that an exit fee/redemption fee will usually be chargeable. Please refer to your Mortgage Illustration for full details.`,
  recommendingMortgageType_S_A1: `Fixed Rate
Having discussed the rental rate options available, I recommended a fixed rate product. A fixed rate provides you with the certainty of knowing exactly what your monthly repayments will be during the fixed rate period and that they will not vary or increase. I recommended you take out a finance contract with a fixed period of {product-initial-rate-period} years. 

I have recommended a fixed rate because 

A fixed rate will protect you from increases in rental rates and enables you to budget effectively, however if rental rates fall during your fixed period, your payment will stay the same and not reduce. I recommend that you contact me before the initial rate ends to review your finance arrangements.

Early repayment charges are not applicable to the finance product I recommended. This means that if you wish to repay all of the loan at any time, your bank/financier will not charge you for doing so. It was important for you to have a finance with no early repayment charges because your finance needs to be Sharia Compliant. 

Please note that an exit fee/redemption fee will usually be chargeable. Please refer to your Key Facts Illustration (KFI) for full details.`,
  recommendingMortgageType_S_A2: `Variable Rate
Having discussed the rental rate options available, I recommended a variable rate product.

I have recommended a variable rate because 

Please note your monthly payments are subject to fluctuation in line with the lender’s standard variable rate. This means your payments could increase as well as reduce.

Early repayment charges are not applicable to the finance product I recommended. This means that if you wish to repay all of the loan at any time, your bank/financier  will not charge you for doing so. It was important for you to have a finance with no early repayment charges because your finance needs to be Sharia Compliant.  
Please note that an exit fee/redemption fee will usually be chargeable. Please refer to your Key Facts Illustration (KFI) for full details.`,
  // Why are you recommending this term
  recommendingTerm_G_A1: `I have recommended the term of XX  years because this fits within your chosen monthly budget.`,
  recommendingTerm_S_A1: `I have recommended the term of XX  years because this fits within your chosen monthly budget.`,
  // Why are we recommending this mortgage Lender
  recommendingMortgageLender_G_A1: `We are recommending {lender-name} because XXXXX`,
  recommendingMortgageLender_G_A2: `Mortgage Packager

We are recommending that your mortgage application is submitted via PACKAGER NAME. This is a mortgage packaging company which processes applications on behalf of {lender-name} . 

I am recommending we submit this application via the use of a mortgage packager because`,
  recommendingMortgageLender_G_A3: `Where second change mortgage recommended

I have recommended a second charge mortgage because 

I am recommending a loan which will be secured on the same property as your existing mortgage from XXXX.  The second lender will notify the first lender of the existence of a second loan and will create a charge on the property. If you fail to make the payments required under the terms of the mortgage and the mortgage goes into default the lender has the right to take action to recover the debt. In this situation the first lender would take what was legally due to it and the balance of any monies would be passed to the second lender who would take what was due to it. When the amounts payable to all lenders have been satisfied, the balance, if any, would be passed to the borrower.`,
  recommendingMortgageLender_S_A1: `We are recommending {lender-name} because
1. Your main preference was for a Sharia Compliant Finance
2. No Early Repayment Charges
3. Allowing you to make additional lump sum payments after initial 2/5 years without any penalties (small admin charge may apply).`,
  // Why are we recommending this mortgage amount
  recommendingMortgageAmount_G_A1: `This is the amount you need in order to complete on your property transaction taking into account the deposit you have put towards this transaction.`,
  recommendingMortgageAmount_G_A2: `This mortgage application has an element of debt consolidation

I have carefully considered your position prior to the further advance/remortgage/ second charge mortgage, fully reviewing your expenditure and bank statements. To meet your needs I recommended you consolidate the debts described below into your mortgage. Based on the information provided by you the total value of these outstanding debts is approximately ${getCurrencySign()}xxx.

I made you aware of the impact of consolidating these debts into the new mortgage, increasing the term of the interest over a longer period and the implications and risks of securing a previously unsecured loan against your property.  

I have provided you with a copy of the debt consolidation calculator and also provided you with, and discussed with you an mortgage illustration of the before and after effect of debt consolidating. 

Your lender may require these debts to be repaid as a condition of the loan agreement. They may also instruct the appointed conveyancing solicitor to repay the outstanding balances directly to the creditor(s).

THINK CAREFULLY BEFORE SECURING OTHER DEBTS AGAINST YOUR HOME. YOUR HOME MAY BE REPOSSESSED IF YOU DO NOT KEEP UP REPAYMENTS ON YOUR MORTGAGE OR ANY OTHER DEBTS SECURED ON IT.
`,
  recommendingMortgageAmount_G_A3: `Debt Consolidation on a Buy to Let transaction

I have carefully considered your position prior to the further advance/remortgage/ second charge mortgage, fully reviewing your expenditure and bank statements. To meet your needs I recommended you consolidate the debts described below into your mortgage. Based on the information provided by you the total value of these outstanding debts is approximately ${getCurrencySign()}xxx.

I made you aware of the impact of consolidating these debts into the new mortgage, increasing the term of the interest over a longer period and the implications and risks of securing a previously unsecured loan against your property.  

I have provided you with a copy of the debt consolidation calculator and also provided you with, and discussed with you an mortgage illustration of the before and after effect of debt consolidating. 

Your lender may require these debts to be repaid as a condition of the loan agreement. They may also instruct the appointed conveyancing solicitor to repay the outstanding balances directly to the creditor(s).

THINK CAREFULLY BEFORE SECURING OTHER DEBTS AGAINST YOUR PROPERTY. YOUR PROPERTY MAY BE REPOSSESSED IF YOU DO NOT KEEP UP REPAYMENTS ON YOUR MORTGAGE OR ANY OTHER DEBTS SECURED ON IT`,
  recommendingMortgageAmount_S_A1: `We are recommending the finance amount of ${getCurrencySign()}{loan-amount} because your income/rental income allows you to support this or it falls within your budget of xx and xx amount.`,
  // What are the costs and fees?
  costsAndFees_G_A1: `The costs in relation to your mortgage application are included in your Mortgage Illustration.

We discussed whether you should pay the fees and charges associated with the mortgage up-front or whether you should add them to your mortgage loan. 

You have chosen to add fees to the loan amount because you wanted to keep your upfront costs down. I have provided you with a comparative mortgage illustration with the fee paid upfront. 

You should be aware that interest will be charged on these for the term of the loan. Please refer to your comparative mortgage Illustration for full details.`,
  costsAndFees_G_A2: `You preferred to pay the lender arrangement fees directly, so no fees have been added to your loan.`,
  costsAndFees_G_A3: `There was a deal with (LENDER) with no lender arrangement fee which was X.XX% and ${getCurrencySign()}XXX.XX per month. When comparing the difference in monthly cost to this deal, it was a difference of ${getCurrencySign()}XX.XX per month. Over (months of fixed deal, e.g 24) months this equates to ${getCurrencySign()}XXX.XX in extra payments. You saw the benefit of paying ${getCurrencySign()}(LENDER ARR FEE) to save ${getCurrencySign()}XXX.XX in extra payments.`,
  costsAndFees_S_A1: `Any associated fees and charges, which you are happy to pay upfront as the bank/financier will not allow to add this to the finance application.`,
  // What are the disadvantages and risks
  disadvantageAndRisks_G_A1: `No Portability Option
This mortgage product is not portable. This means that you will incur the early repayment charges shown on your Mortgage Illustration if you move during the period where early repayment charges would apply. You have confirmed that you do not intend to move during this period and are therefore comfortable to have a mortgage product that has early repayment charges`,
  disadvantageAndRisks_G_A2: `Interest-Only

If your repayment vehicle is insufficient to repay the mortgage, the property may have to be sold or other capital used to repay the mortgage at the end of the term. If you convert to a repayment mortgage in the future, there will be a reduced term to repay the loan. This means that your monthly payments will increase.  If you extend the term of your mortgage to reduce the monthly payments, the overall cost will be higher as you will be paying interest on the loan for a longer period of time.`,
  disadvantageAndRisks_G_A3: `Lending Into Retirement

The mortgage is due to be repaid after your selected retirement age(s) as recorded within our factfind. The reason for recommending a mortgage term into retirement is because

Before making this recommendation I have taken account of the following information which you provided:

Detail the factors. This should include: confirmation of the customer’s occupation, and their age when they plan to retire.  Include the reasons why the customer wishes to retire at the age selected and whether they have flexibility to choose to retire later, if they wish. You should comment on whether the retirement age appears realistic for their occupation. You should also record the earliest date when the state pensions are estimated to become payable as shown below

You supplied copies of projections for your pensions.  These illustrate the initial income that could be paid at your target retirement age of xxx, based on the assumptions contained in the provider’s illustrations. You have also supplied a copy of your state pension forecast.

In addition you stated that you expect to receive other income from insert source of income, for example, income from your portfolio of buy-to-let properties or investment income when you have retired.

It is important to note, your actual pension income could be higher or lower than any projections produced by your pension providers. These are not guaranteed.

You stated you believe you will be able to afford the mortgage payments in retirement and to the end of the term. As part of your application you have supplied information about your projected income in retirement to the lender. I recommended you contact your existing provider(s) periodically, to establish your pension arrangement(s) are on track to meet your needs.`,
  disadvantageAndRisks_G_A4: `Debt Consolidation 

I made you aware of the impact of consolidating the debts identified into the new mortgage.  I also made you aware of increasing the term of the interest over a longer period and the implications of securing a previously unsecured loan and the risks of doing so. 

We have discussed you adopting a new strict approach to managing your debts. In doing so you should not be tempted by the availability of easy credit as the focus needs to be on getting rid of debt, rather than adding to it.  If you still hold credit cards it is advisable to cancel them.

Once you consolidate your debt, don’t borrow more until you are sure you can afford it.`,
  disadvantageAndRisks_G_A5: `Shared Equity – including Help-to-Buy

You are making use of a shared equity scheme. I have not provided you with advice on the shared equity scheme itself. I have, however, explained the basic operation of the scheme and its risks. 

With Shared Equity, you will own all of the property from the start but you will have to repay a proportion of its value when you sell it – equivalent to the proportion of equity you took from the shared equity loan provider. If your property rises in value, the amount that you will have to pay back will be higher than the original amount of the equity loan.  

The equity loan represents xx% of the purchase price. You will have the option to make part repayments to the Shared Equity Loan, subject to the scheme terms and conditions. Interest may also be payable on the loan. 

The scheme will usually charge administration fees if you want to repay your loan or make alterations or improvements to your property. 

Please refer to the Scheme Details for further information and the full terms and conditions of the scheme. If you are still unsure about any elements of the scheme, you should discuss these with your solicitor before you proceed.`,
  disadvantageAndRisks_G_A6: `Help to Buy Further Information

This Help to Buy Mortgage is only available on a repayment basis.  This means each monthly repayment you make to the lender will contain an element of capital in addition to the interest payable on the loan.  The proportion of capital repaid increases with each monthly repayment.  As long as all the repayments due to the lender are made in full and on time, the mortgage will be repaid at the end of the term.

You don’t pay any interest or fees on the government’s equity loan for the first five years. In the sixth year, you will be charged 1.75%.  After that, the fee rises by inflation based on the Retail Price Index (RPI) plus 1% each year. RPI figures are put together by the Office for National Statistics. Your forecasted monthly repayment in Year 6 will be ${getCurrencySign()}XX.XX.  This payment could go up or down dependent on RPI. This still fits within your specified budget when paying the lender’s current standard variable rate.   

The equity loan must be repaid after 25 years or earlier if you sell your home. You must repay the same percentage of the proceeds of the sale as the initial equity loan (i.e. if you received an equity loan for 20% of the purchase price of your home, you must repay 20% of the proceeds of the sale).  Please refer to your Loan Agreement from the Agency.                                                                                                                       
I have discussed the features of the Help to Buy scheme. However I have not given you any advice as to the suitability of the scheme.  You should discuss the scheme with your Legal Adviser if you are in any doubt about the features or its suitability for you.  `,
  disadvantageAndRisks_G_A7: `Shared Ownership

You are making use of a shared ownership scheme. This means that you will only own a share of the property. The remainder will be owned by a housing association or similar body, who will charge you rent on their share.

I have not provided you with advice on the shared ownership scheme itself. I have, however, explained the basic operation of the scheme and its risks.  

Your property interest is Leasehold. The percentage share to be purchased is xx% and the percentage share to be rented is xx%. You may have the option to increase your share of the property ownership, subject to the scheme terms and conditions. 

The amount of rent initially payable will be ${getCurrencySign()}xx. This this will be reviewed on a please insert timescale/date basis.

You will not own the property outright at the end of the mortgage term if you do not increase your ownership to 100% during the term of the mortgage. The scheme will usually charge administration fees if you want to increase your ownership share or make alterations or improvements to your property. 

Please refer to the Scheme Details for further information and the full terms and conditions relating to the amount of the share payable. If you are still unsure about any elements of the scheme, you should discuss these with your solicitor before you proceed.`,
  disadvantageAndRisks_G_A8: `Right to Buy

(Details the risks to entitlement to benefits, the repossession risk, and the risk of being considered intentionally homeless.)`,
  disadvantageAndRisks_G_A9: `(IF NONE APPLY - DELETE THIS TEXT AND SELECT ANSWER SO FORMATTING IS CORRECT)`,
  disadvantageAndRisks_S_A1: `No Portability Option
This product is not portable due to the lenders interest in the property as you have undertaken Sharia Compliant finance. You have confirmed that you do not intend to move during this period. As a feature of this finance product, there are no early repayment charges associated with this finance agreement like traditional mortgages.`,
  disadvantageAndRisks_S_A2: `Ijara Only (Rent Only)

If your repayment vehicle is insufficient to repay the finance, the property may have to be sold or other capital used to repay the finance agreement at the end of the term. If you convert to an Ijara with Diminishing Musharakah finance agreement in the future, there may be a reduced term to repay the loan. This means that your monthly payments will increase.  If you extend the term of your finance agreement to reduce the monthly payments, the overall cost will be higher as you will be paying more rent on the finance agreement for a longer period of time.`,
  // What is the cost of our advice
  costAdvice_G_A1: `The costs in relation to our advice are included in your Mortgage Illustration and I detailed in the fee agreement that we discussed and you signed at our initial meeting.

You have the right to ask us for information about the levels of commission payable to us by the lenders whose products we offer. I provided you with this information following your request. Please contact me if you would like this information`,
  costAdvice_G_A2: `I will not be charging a fee for my services; however I will receive commission from the lender.
You have the right to ask us for information about the levels of commission payable to us by the lenders whose products we offer. I provided you with this information following your request. Please contact me if you would like this information`,
  costAdvice_S_A1: `The costs in relation to our advice are included in your terms of business and fee agreement that we discussed and you signed at our initial meeting.

You have the right to ask us for information about the levels of commission payable to us by the bank/financier whose products we offer. Please contact me if you would like this information.`,
  costAdvice_S_A2: `I will not be charging a fee for my services; however I will receive commission from the bank/financier.
You have the right to ask us for information about the levels of commission payable to us by the lenders whose products we offer. Please contact me if you would like this information`,
  // Protection
  protection_G_A1: `We discussed your protection / personal insurance requirements.

I recommended you seek separate advice from an adviser who specialises in this area.`,
  protection_G_A2: `We discussed your protection / personal insurance requirements.

We will arrange a meeting to review this after your mortgage application has been processed.`,
  protection_G_A3: `We discussed your protection / personal insurance requirements.

You have received my recommendation(s) for Life Protection/Critical Illness/Income Protection / Building and Contents/Accident Sickness and Unemployment Cover, but you decided not to accept my recommendation(s) because`,
  protection_G_A4: `We discussed your protection / personal insurance requirements.

I am not recommending you take out any new policies because`,
  protection_S_A1: `We discussed your protection / personal insurance requirements.

I recommended you seek separate advice from an adviser who specialises in this area.`,
  protection_S_A2: `We discussed your protection / personal insurance requirements.

We will arrange a meeting to review this after your mortgage application has been processed.`,
  protection_S_A3: `We discussed your protection / personal insurance requirements.

You have received my recommendation(s) for Life Protection/Critical Illness/Income Protection / Building and Contents/Accident Sickness and Unemployment Cover, but you decided not to accept my recommendation(s) because`,
  protection_S_A4: `We discussed your protection / personal insurance requirements.

I am not recommending you take out any new policies because`,
  // Buildings and Insurance
  buildingsInsurance_G_A1: `We discussed your buildings insurance requirements.

I recommended you seek separate advice from an adviser who specialises in this area.`,
  buildingsInsurance_G_A2: `We discussed your buildings insurance requirements.

We will arrange a meeting to review this after your mortgage application has been processed.`,
  buildingsInsurance_G_A3: `We discussed your buildings insurance requirements.

You have received my recommendation(s) for buildings insurance but you have decided not to accept my recommendation(s) because:`,
  buildingsInsurance_G_A4: `We discussed your buildings insurance requirements.

You have confirmed that you are going to arrange your own cover and do not need my advice with regard to this matter.`,
  buildingsInsurance_S_A1: `We discussed your buildings insurance requirements.

I recommended you seek separate advice from an adviser who specialises in this area.`,
  buildingsInsurance_S_A2: `We discussed your buildings insurance requirements.

We will arrange a meeting to review this after your mortgage application has been processed.`,
  buildingsInsurance_S_A3: `We discussed your buildings insurance requirements.

You have received my recommendation(s) for buildings insurance but you have decided not to accept my recommendation(s) because:`,
  buildingsInsurance_S_A4: `We discussed your buildings insurance requirements.

You have confirmed that you are going to arrange your own cover and do not need my advice with regard to this matter.`,
  // Wills
  wills_G_A1: `You do not currently have a Will. I recommend that you seek advice from a solicitor with regard to this matter. There can be tax-planning advantages from having a will written and this can ensure that as much as possible of your estate goes to those intended. `,
  wills_G_A2: `You do not currently have a Will. I recommend that you seek advice and have referred you to detail company name who specialise in providing Will writing services. If you decide to proceed, I shall receive a fee of ${getCurrencySign()}xxx from the above company.`,
  wills_G_A3: `You confirmed you have a Will in place. I emphasised that it is important that revisions are made whenever significant changes occur in your personal or financial situation or your intentions.`,
  wills_S_A1: `You do not currently have a Will. I recommend that you seek advice from a solicitor or qualified will writer with regards to this matter. There can be tax-planning advantages from having a will written and this can ensure that as much as possible of your estate goes to those intended. `,
};
