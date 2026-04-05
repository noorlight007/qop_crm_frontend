// import { defaultAnswersData } from "@/Data/Cases/SuitabilityData";
// import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
// import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
// import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
// import {
//   useGetExtraAnswerQuery,
//   useGetSuitabilityQuery,
//   useUpdateSuitabilityMutation,
// } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Suitability/SuitabilityApi";
// import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
// import LoadingSpinner from "@/app/loading";
// import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
// import { useSession } from "next-auth/react";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Col,
//   Form,
//   FormGroup,
//   Input,
//   Label,
// } from "reactstrap";
// import ExtraAnswerModal from "./Modals/ExtraAnswerModal";

// const getErrorMessage = (err: any) => {
//   if (!err) return "Unknown error";
//   if (typeof err === "string") return err;
//   if (typeof err?.data === "string") return err.data;

//   const collect = (value: any): string[] => {
//     if (value == null) return [];
//     if (typeof value === "string") return [value];
//     if (Array.isArray(value))
//       return value.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
//     if (typeof value === "object") {
//       try {
//         return Object.values(value).flatMap((v) => collect(v));
//       } catch {
//         return [String(value)];
//       }
//     }
//     return [String(value)];
//   };

//   if (err?.data?.message) return String(err.data.message);

//   if (err?.data && typeof err.data === "object") {
//     const msgs = collect(err.data);
//     if (msgs.length) return msgs.join(", ");
//   }

//   if (err?.error) return String(err.error);
//   if (err?.message) {
//     if (/status code/i.test(err.message)) return "Server returned an error";
//     return String(err.message);
//   }

//   try {
//     return JSON.stringify(err);
//   } catch {
//     return String(err);
//   }
// };

// const SuitabilityContent: React.FC = () => {
//   const { data: session } = useSession();
//   const { casealias } = useParams();
//   const dispatch = useAppDispatch();
//   const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
//     { case_alias: casealias },
//     { skip: !casealias },
//   );
//   const [defaultAnswers, setDefaultAnswers] = useState(defaultAnswersData);
//   // Modal State
//   const [isExtraAnswerModalOpen, setIsExtraAnswerModalOpen] = useState(false);

//   const [submitting, setSubmitting] = useState<"save" | "save_next" | null>(
//     null,
//   );

//   // Form State
//   const [formValue, setFormValue] = useState({
//     circumstances_objectives: {
//       circumstances_type: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_one_sharia: "",
//       question_two_sharia: "",
//     },
//     budget_affordability: {
//       budget_affordability_type: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_one_sharia: "",
//       question_two_sharia: "",
//     },
//     new_mortgage_details: {
//       new_mortgage_details_type: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_one_sharia: "",
//       question_two_sharia: "",
//     },
//     recommending_repayment_method: {
//       recommending_repayment_method_type: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_four_answer: "",
//       question_five_answer: "",
//       question_one_sharia: "",
//       question_two_sharia: "",
//     },
//     recommending_mortgage_type: {
//       recommending_mortgage_type: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_four_answer: "",
//       question_one_sharia: "",
//       question_two_sharia: "",
//     },
//     recommending_term: {
//       recommending_term: "",
//       question_one_answer: "",
//       question_one: "",
//     },
//     recommending_mortgage_lender: {
//       recommending_mortgage_lender_type: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_one_sharia: "",
//     },
//     recommending_mortgage_amount: {
//       recommending_mortgage_amount: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_one_sharia: "",
//     },
//     costs_fees: {
//       costs_fees: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_one_sharia: "",
//     },
//     disadvantage_risks: {
//       disadvantage_risks: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_four_answer: "",
//       question_five_answer: "",
//       question_six_answer: "",
//       question_seven_answer: "",
//       question_eight_answer: "",
//       question_nine_answer: "",
//       question_one_sharia: "",
//       question_two: "",
//     },
//     cost_advice: {
//       cost_advice: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_one_sharia: "",
//       question_two_sharia: "",
//     },
//     protection: {
//       protection: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_four_answer: "",
//       question_one_sharia: "",
//       question_two: "",
//       question_three_sharia: "",
//       question_four_sharia: "",
//     },
//     buildings_insurance: {
//       buildings_insurance: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_four_answer: "",
//       question_one: "",
//       question_two: "",
//       question_three_sharia: "",
//       question_five_sharia: "",
//     },
//     wills: {
//       wills: "",
//       question_one_answer: "",
//       question_two_answer: "",
//       question_three_answer: "",
//       question_one: "",
//     },
//   });

//   // Handle modal change
//   const toggleExtraAnswerModal = () => {
//     setIsExtraAnswerModalOpen(!isExtraAnswerModalOpen);
//   };

//   // RTK hooks
//   const { data: suitabilityData, isLoading } = useGetSuitabilityQuery({
//     case_alias: casealias,
//   });
//   const [updateSuitability, { isLoading: isUpdating }] =
//     useUpdateSuitabilityMutation();
//   const [updateSectionCompleteStatus] =
//     useUpdateSectionCompleteStatusMutation();
//   const { data: extraAnswersData, isLoading: isExtraAnswerLoading } =
//     useGetExtraAnswerQuery({
//       case_alias: casealias,
//     });

//   // Set initial form data when API data is available
//   useEffect(() => {
//     if (
//       suitabilityData?.circumstances_objectives ||
//       suitabilityData?.budget_affordability ||
//       suitabilityData?.new_mortgage_details ||
//       suitabilityData?.recommending_repayment_method ||
//       suitabilityData?.recommending_mortgage_type ||
//       suitabilityData?.recommending_term ||
//       suitabilityData?.recommending_mortgage_lender ||
//       suitabilityData?.recommending_mortgage_amount ||
//       suitabilityData?.costs_fees ||
//       suitabilityData?.disadvantage_risks ||
//       suitabilityData?.cost_advice ||
//       suitabilityData?.protection ||
//       suitabilityData?.buildings_insurance ||
//       suitabilityData?.wills
//     ) {
//       setFormValue({
//         ...formValue,
//         circumstances_objectives: {
//           circumstances_type:
//             suitabilityData.circumstances_objectives.circumstances_type ||
//             "GENERAL",
//           question_one_answer:
//             suitabilityData.circumstances_objectives.question_one_answer ||
//             defaultAnswers.circumstancesAndObjectives_G_A1,
//           question_two_answer:
//             suitabilityData.circumstances_objectives.question_two_answer ||
//             defaultAnswers.circumstancesAndObjectives_G_A2,
//           question_three_answer:
//             suitabilityData.circumstances_objectives.question_three_answer ||
//             defaultAnswers.circumstancesAndObjectives_G_A3,
//           question_one_sharia:
//             suitabilityData.circumstances_objectives.question_one_sharia ||
//             defaultAnswers.circumstancesAndObjectives_S_A1,
//           question_two_sharia:
//             suitabilityData.circumstances_objectives.question_two_sharia ||
//             defaultAnswers.circumstancesAndObjectives_S_A2,
//         },
//         budget_affordability: {
//           budget_affordability_type:
//             suitabilityData.budget_affordability.budget_affordability_type ||
//             "GENERAL",
//           question_one_answer:
//             suitabilityData.budget_affordability.question_one_answer ||
//             defaultAnswers.budgetAndAffordability_G_A1,
//           question_two_answer:
//             suitabilityData.budget_affordability.question_two_answer ||
//             defaultAnswers.budgetAndAffordability_G_A2,
//           question_one_sharia:
//             suitabilityData.budget_affordability.question_one_sharia ||
//             defaultAnswers.budgetAndAffordability_S_A1,
//           question_two_sharia:
//             suitabilityData.budget_affordability.question_two_sharia ||
//             defaultAnswers.budgetAndAffordability_S_A2,
//         },
//         new_mortgage_details: {
//           new_mortgage_details_type:
//             suitabilityData.new_mortgage_details.new_mortgage_details_type ||
//             "GENERAL",
//           question_one_answer:
//             suitabilityData.new_mortgage_details.question_one_answer ||
//             defaultAnswers.newMortgageDetails_G_A1,
//           question_two_answer:
//             suitabilityData.new_mortgage_details.question_two_answer ||
//             defaultAnswers.newMortgageDetails_G_A2,
//           question_one_sharia:
//             suitabilityData.new_mortgage_details.question_one_sharia ||
//             defaultAnswers.newMortgageDetails_S_A1,
//           question_two_sharia:
//             suitabilityData.new_mortgage_details.question_two_sharia ||
//             defaultAnswers.newMortgageDetails_S_A2,
//         },
//         recommending_repayment_method: {
//           recommending_repayment_method_type:
//             suitabilityData.recommending_repayment_method
//               .recommending_repayment_method_type || "GENERAL",
//           question_one_answer:
//             suitabilityData.recommending_repayment_method.question_one_answer ||
//             defaultAnswers.recommendingRepaymentMethod_G_A1,
//           question_two_answer:
//             suitabilityData.recommending_repayment_method.question_two_answer ||
//             defaultAnswers.recommendingRepaymentMethod_G_A2,
//           question_three_answer:
//             suitabilityData.recommending_repayment_method
//               .question_three_answer ||
//             defaultAnswers.recommendingRepaymentMethod_G_A3,
//           question_four_answer:
//             suitabilityData.recommending_repayment_method
//               .question_four_answer ||
//             defaultAnswers.recommendingRepaymentMethod_G_A4,
//           question_five_answer:
//             suitabilityData.recommending_repayment_method
//               .question_five_answer ||
//             defaultAnswers.recommendingRepaymentMethod_G_A5,
//           question_one_sharia:
//             suitabilityData.recommending_repayment_method.question_one_sharia ||
//             defaultAnswers.recommendingRepaymentMethod_S_A1,
//           question_two_sharia:
//             suitabilityData.recommending_repayment_method.question_two_sharia ||
//             defaultAnswers.recommendingRepaymentMethod_S_A2,
//         },
//         recommending_mortgage_type: {
//           recommending_mortgage_type:
//             suitabilityData.recommending_mortgage_type
//               .recommending_mortgage_type || "GENERAL",
//           question_one_answer:
//             suitabilityData.recommending_mortgage_type.question_one_answer ||
//             defaultAnswers.recommendingMortgageType_G_A1,
//           question_two_answer:
//             suitabilityData.recommending_mortgage_type.question_two_answer ||
//             defaultAnswers.recommendingMortgageType_G_A2,
//           question_three_answer:
//             suitabilityData.recommending_mortgage_type.question_three_answer ||
//             defaultAnswers.recommendingMortgageType_G_A3,
//           question_four_answer:
//             suitabilityData.recommending_mortgage_type.question_four_answer ||
//             defaultAnswers.recommendingMortgageType_G_A4,
//           question_one_sharia:
//             suitabilityData.recommending_mortgage_type.question_one_sharia ||
//             defaultAnswers.recommendingMortgageType_S_A1,
//           question_two_sharia:
//             suitabilityData.recommending_mortgage_type.question_two_sharia ||
//             defaultAnswers.recommendingMortgageType_S_A2,
//         },
//         recommending_term: {
//           recommending_term:
//             suitabilityData.recommending_term.recommending_term || "GENERAL",
//           question_one_answer:
//             suitabilityData.recommending_term.question_one_answer ||
//             defaultAnswers.recommendingTerm_G_A1,
//           question_one:
//             suitabilityData.recommending_term.question_one ||
//             defaultAnswers.recommendingTerm_S_A1,
//         },
//         recommending_mortgage_lender: {
//           recommending_mortgage_lender_type:
//             suitabilityData.recommending_mortgage_lender
//               .recommending_mortgage_lender_type || "GENERAL",
//           question_one_answer:
//             suitabilityData.recommending_mortgage_lender.question_one_answer ||
//             defaultAnswers.recommendingMortgageLender_G_A1,
//           question_two_answer:
//             suitabilityData.recommending_mortgage_lender.question_two_answer ||
//             defaultAnswers.recommendingMortgageLender_G_A2,
//           question_three_answer:
//             suitabilityData.recommending_mortgage_lender
//               .question_three_answer ||
//             defaultAnswers.recommendingMortgageLender_G_A3,
//           question_one_sharia:
//             suitabilityData.recommending_mortgage_lender.question_one_sharia ||
//             defaultAnswers.recommendingMortgageLender_S_A1,
//         },
//         recommending_mortgage_amount: {
//           recommending_mortgage_amount:
//             suitabilityData.recommending_mortgage_amount
//               .recommending_mortgage_amount || "GENERAL",
//           question_one_answer:
//             suitabilityData.recommending_mortgage_amount.question_one_answer ||
//             defaultAnswers.recommendingMortgageAmount_G_A1,
//           question_two_answer:
//             suitabilityData.recommending_mortgage_amount.question_two_answer ||
//             defaultAnswers.recommendingMortgageAmount_G_A2,
//           question_three_answer:
//             suitabilityData.recommending_mortgage_amount
//               .question_three_answer ||
//             defaultAnswers.recommendingMortgageAmount_G_A3,
//           question_one_sharia:
//             suitabilityData.recommending_mortgage_amount.question_one_sharia ||
//             defaultAnswers.recommendingMortgageAmount_S_A1,
//         },
//         costs_fees: {
//           costs_fees: suitabilityData.costs_fees.costs_fees_type || "GENERAL",
//           question_one_answer:
//             suitabilityData.costs_fees.question_one_answer ||
//             defaultAnswers.costsAndFees_G_A1,
//           question_two_answer:
//             suitabilityData.costs_fees.question_two_answer ||
//             defaultAnswers.costsAndFees_G_A2,
//           question_three_answer:
//             suitabilityData.costs_fees.question_three_answer ||
//             defaultAnswers.costsAndFees_G_A3,
//           question_one_sharia:
//             suitabilityData.costs_fees.question_one_sharia ||
//             defaultAnswers.costsAndFees_S_A1,
//         },
//         disadvantage_risks: {
//           disadvantage_risks:
//             suitabilityData.disadvantage_risks.disadvantage_risks || "GENERAL",
//           question_one_answer:
//             suitabilityData.disadvantage_risks.question_one_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A1,
//           question_two_answer:
//             suitabilityData.disadvantage_risks.question_two_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A2,
//           question_three_answer:
//             suitabilityData.disadvantage_risks.question_three_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A3,
//           question_four_answer:
//             suitabilityData.disadvantage_risks.question_four_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A4,
//           question_five_answer:
//             suitabilityData.disadvantage_risks.question_five_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A5,
//           question_six_answer:
//             suitabilityData.disadvantage_risks.question_six_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A6,
//           question_seven_answer:
//             suitabilityData.disadvantage_risks.question_seven_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A7,
//           question_eight_answer:
//             suitabilityData.disadvantage_risks.question_eight_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A8,
//           question_nine_answer:
//             suitabilityData.disadvantage_risks.question_nine_answer ||
//             defaultAnswers.disadvantageAndRisks_G_A9,
//           question_one_sharia:
//             suitabilityData.disadvantage_risks.question_one_sharia ||
//             defaultAnswers.disadvantageAndRisks_S_A1,
//           question_two:
//             suitabilityData.disadvantage_risks.question_two ||
//             defaultAnswers.disadvantageAndRisks_S_A2,
//         },
//         cost_advice: {
//           cost_advice: suitabilityData.cost_advice.cost_advice || "GENERAL",
//           question_one_answer:
//             suitabilityData.cost_advice.question_one_answer ||
//             defaultAnswers.costAdvice_G_A1,
//           question_two_answer:
//             suitabilityData.cost_advice.question_two_answer ||
//             defaultAnswers.costAdvice_G_A2,
//           question_one_sharia:
//             suitabilityData.cost_advice.question_one_sharia ||
//             defaultAnswers.costAdvice_S_A1,
//           question_two_sharia:
//             suitabilityData.cost_advice.question_two_sharia ||
//             defaultAnswers.costAdvice_S_A2,
//         },
//         protection: {
//           protection: suitabilityData.protection.protection || "GENERAL",
//           question_one_answer:
//             suitabilityData.protection.question_one_answer ||
//             defaultAnswers.protection_G_A1,
//           question_two_answer:
//             suitabilityData.protection.question_two_answer ||
//             defaultAnswers.protection_G_A2,
//           question_three_answer:
//             suitabilityData.protection.question_three_answer ||
//             defaultAnswers.protection_G_A3,
//           question_four_answer:
//             suitabilityData.protection.question_four_answer ||
//             defaultAnswers.protection_G_A4,
//           question_one_sharia:
//             suitabilityData.protection.question_one_sharia ||
//             defaultAnswers.protection_S_A1,
//           question_two:
//             suitabilityData.protection.question_two ||
//             defaultAnswers.protection_S_A2,
//           question_three_sharia:
//             suitabilityData.protection.question_three_sharia ||
//             defaultAnswers.protection_S_A3,
//           question_four_sharia:
//             suitabilityData.protection.question_four_sharia ||
//             defaultAnswers.protection_S_A4,
//         },
//         buildings_insurance: {
//           buildings_insurance:
//             suitabilityData.buildings_insurance.buildings_insurance ||
//             "GENERAL",
//           question_one_answer:
//             suitabilityData.buildings_insurance.question_one_answer ||
//             defaultAnswers.buildingsInsurance_G_A1,
//           question_two_answer:
//             suitabilityData.buildings_insurance.question_two_answer ||
//             defaultAnswers.buildingsInsurance_G_A2,
//           question_three_answer:
//             suitabilityData.buildings_insurance.question_three_answer ||
//             defaultAnswers.buildingsInsurance_G_A3,
//           question_four_answer:
//             suitabilityData.buildings_insurance.question_four_answer ||
//             defaultAnswers.buildingsInsurance_G_A4,
//           question_one:
//             suitabilityData.buildings_insurance.question_one ||
//             defaultAnswers.buildingsInsurance_S_A1,
//           question_two:
//             suitabilityData.buildings_insurance.question_two ||
//             defaultAnswers.buildingsInsurance_S_A2,
//           question_three_sharia:
//             suitabilityData.buildings_insurance.question_three_sharia ||
//             defaultAnswers.buildingsInsurance_S_A3,
//           question_five_sharia:
//             suitabilityData.buildings_insurance.question_five_sharia ||
//             defaultAnswers.buildingsInsurance_S_A4,
//         },
//         wills: {
//           wills: suitabilityData.wills.wills || "GENERAL",
//           question_one_answer:
//             suitabilityData.wills.question_one_answer ||
//             defaultAnswers.wills_G_A1,
//           question_two_answer:
//             suitabilityData.wills.question_two_answer ||
//             defaultAnswers.wills_G_A2,
//           question_three_answer:
//             suitabilityData.wills.question_three_answer ||
//             defaultAnswers.wills_G_A3,
//           question_one:
//             suitabilityData.wills.question_one || defaultAnswers.wills_S_A1,
//         },
//       });
//     }
//   }, [suitabilityData]);

//   // Handle input changes for nested state
//   const handleChange = <T extends keyof typeof formValue>(
//     section: T,
//     field: keyof (typeof formValue)[T],
//     value: string,
//   ) => {
//     setFormValue((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//   };

//   // Local errors state + helpers
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const parseApiErrors = (err: any): Record<string, string> => {
//     if (!err) return {};
//     const out: Record<string, string> = {};

//     const collect = (value: any): string[] => {
//       if (value == null) return [];
//       if (typeof value === "string") return [value];
//       if (Array.isArray(value))
//         return value.map((v) =>
//           typeof v === "string" ? v : JSON.stringify(v),
//         );
//       if (typeof value === "object") {
//         try {
//           return Object.values(value).flatMap((v) => collect(v));
//         } catch {
//           return [String(value)];
//         }
//       }
//       return [String(value)];
//     };

//     const recurse = (value: any, path: string[]) => {
//       if (value == null) return;
//       if (typeof value === "string") {
//         out[path.join(".")] = value;
//         return;
//       }
//       if (Array.isArray(value)) {
//         const msgs = value.map((v) =>
//           typeof v === "string" ? v : JSON.stringify(v),
//         );
//         out[path.join(".")] = msgs.join(", ");
//         return;
//       }
//       if (typeof value === "object") {
//         for (const k of Object.keys(value)) {
//           recurse(value[k], path.concat(k));
//         }
//         return;
//       }
//       out[path.join(".")] = String(value);
//     };

//     const data = err?.data || err;
//     if (data && typeof data === "object") recurse(data, []);
//     return out;
//   };

//   const scrollToFirstError = (errorsObj: Record<string, string>) => {
//     try {
//       const keys = Object.keys(errorsObj || {});
//       if (!keys.length) return;

//       for (const rawKey of keys) {
//         const candidates = [
//           rawKey,
//           rawKey.replace(/\./g, "_"),
//           rawKey.replace(/_/g, "."),
//           (rawKey.split(".").pop() as string) || rawKey,
//         ];

//         for (const id of candidates) {
//           if (!id) continue;
//           const elById = document.getElementById(id);
//           if (elById) {
//             (elById as HTMLElement).scrollIntoView({
//               behavior: "smooth",
//               block: "center",
//             });
//             try {
//               (elById as HTMLElement).focus();
//             } catch {}
//             return;
//           }

//           const elByName = document.querySelector(`[name="${id}"]`);
//           if (elByName) {
//             (elByName as HTMLElement).scrollIntoView({
//               behavior: "smooth",
//               block: "center",
//             });
//             try {
//               (elByName as HTMLElement).focus();
//             } catch {}
//             return;
//           }
//         }
//       }
//     } catch (e) {
//       // non-fatal
//       // eslint-disable-next-line no-console
//       console.warn("scrollToFirstError failed", e);
//     }
//   };

//   // Handle form submission (returns true on success)
//   const handleSubmit = async (
//     e: React.FormEvent,
//     action: "save" | "save_next" = "save",
//   ): Promise<boolean> => {
//     e.preventDefault();

//     setSubmitting(action);
//     const payload = {
//       alias: casealias,
//       circumstances_objectives: {
//         ...formValue.circumstances_objectives,
//       },
//       budget_affordability: {
//         ...formValue.budget_affordability,
//       },
//       new_mortgage_details: {
//         ...formValue.new_mortgage_details,
//       },
//       recommending_repayment_method: {
//         ...formValue.recommending_repayment_method,
//       },
//       recommending_mortgage_type: {
//         ...formValue.recommending_mortgage_type,
//       },
//       recommending_term: {
//         ...formValue.recommending_term,
//       },
//       recommending_mortgage_lender: {
//         ...formValue.recommending_mortgage_lender,
//       },
//       recommending_mortgage_amount: {
//         ...formValue.recommending_mortgage_amount,
//       },
//       costs_fees: {
//         ...formValue.costs_fees,
//       },
//       disadvantage_risks: {
//         ...formValue.disadvantage_risks,
//       },
//       cost_advice: {
//         ...formValue.cost_advice,
//       },
//       protection: {
//         ...formValue.protection,
//       },
//       buildings_insurance: {
//         ...formValue.buildings_insurance,
//       },
//       wills: {
//         ...formValue.wills,
//       },
//     };

//     try {
//       const res = await updateSuitability({
//         payload: payload,
//         case_alias: casealias,
//       });
//       if (res.data) {
//         toast.success("Changes saved successfully!");
//         setErrors({});
//         try {
//           await updateSectionCompleteStatus({
//             case_alias: casealias,
//             section_data: { is_suitability: true },
//           });
//         } catch (err) {
//           console.error("Failed to update section complete status:", err);
//         }
//         return true;
//       } else if (res.error) {
//         const parsed = parseApiErrors(res.error);
//         if (Object.keys(parsed).length) {
//           setErrors(parsed);
//           scrollToFirstError(parsed);
//           toast.error(Object.values(parsed)[0]);
//         } else {
//           const errorMessage =
//             getErrorMessage(res.error) || "Failed to save changes";
//           toast.error(errorMessage);
//         }
//         return false;
//       } else {
//         toast.error("Failed to save changes. Please try again!");
//         return false;
//       }
//     } catch (error) {
//       console.error("Failed to update suitability:", error);
//       const parsed = parseApiErrors((error as any)?.data || error);
//       if (Object.keys(parsed).length) {
//         setErrors(parsed);
//         scrollToFirstError(parsed);
//         toast.error(Object.values(parsed)[0]);
//         return false;
//       }
//       const errorMessage =
//         getErrorMessage(error) || "Failed to save changes. Please try again.";
//       toast.error(errorMessage);
//       return false;
//     } finally {
//       setSubmitting(null);
//     }
//   };

//   const currentTab: string | null = useAppSelector(
//     (state) => state.caseSections.basicTabId,
//   );

//   const handleNextTab = () => {
//     const nextTabNav: string | null = getNextTabNav(
//       caseData?.case_stage,
//       caseData?.case_category,
//       currentTab!,
//     );
//     if (nextTabNav) {
//       dispatch(basicTabIndicator(nextTabNav));
//     } else {
//       toast.warning("This is the last tab.");
//     }
//   };

//   if (isLoading || isExtraAnswerLoading) {
//     return (
//       <div>
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <>
//       <Form
//         onSubmit={(e) => {
//           void handleSubmit(e, "save");
//         }}
//       >
//         {/* Your circumstances and objectives */}
//         <Card className="border-1 border-success">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>Your circumstances and objectives</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="circumstances_type"
//                   value={formValue.circumstances_objectives.circumstances_type}
//                   onChange={(e) =>
//                     handleChange(
//                       "circumstances_objectives",
//                       "circumstances_type",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.circumstances_objectives.circumstances_type ===
//               "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={
//                       formValue.circumstances_objectives.question_one_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "circumstances_objectives",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={
//                       formValue.circumstances_objectives.question_two_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "circumstances_objectives",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={
//                       formValue.circumstances_objectives.question_three_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "circumstances_objectives",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.circumstances_objectives.circumstances_type ===
//               "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="6"
//                     value={
//                       formValue.circumstances_objectives.question_one_sharia
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "circumstances_objectives",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={
//                       formValue.circumstances_objectives.question_two_sharia
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "circumstances_objectives",
//                         "question_two_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>

//         {/* Budget and affordability */}
//         <Card className="border-1 border-secondary mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>Budget and affordability</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="budget_affordability_type"
//                   value={
//                     formValue.budget_affordability.budget_affordability_type
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "budget_affordability",
//                       "budget_affordability_type",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.budget_affordability.budget_affordability_type ===
//               "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.budget_affordability.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "budget_affordability",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.budget_affordability.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "budget_affordability",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.budget_affordability.budget_affordability_type ===
//               "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={formValue.budget_affordability.question_one_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "budget_affordability",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={formValue.budget_affordability.question_two_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "budget_affordability",
//                         "question_two_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* New mortgage details */}
//         <Card className="border-1 border-success mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>New mortgage details</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="new_mortgage_details_type"
//                   value={
//                     formValue.new_mortgage_details.new_mortgage_details_type
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "new_mortgage_details",
//                       "new_mortgage_details_type",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.new_mortgage_details.new_mortgage_details_type ===
//               "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.new_mortgage_details.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "new_mortgage_details",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.new_mortgage_details.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "new_mortgage_details",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.new_mortgage_details.new_mortgage_details_type ===
//               "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={formValue.new_mortgage_details.question_one_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "new_mortgage_details",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={formValue.new_mortgage_details.question_two_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "new_mortgage_details",
//                         "question_two_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* Recommending repayment method */}
//         <Card className="border-1 border-secondary mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>Why are we recommending this repayment method?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="recommending_repayment_method_type"
//                   value={
//                     formValue.recommending_repayment_method
//                       .recommending_repayment_method_type
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_repayment_method",
//                       "recommending_repayment_method_type",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.recommending_repayment_method
//               .recommending_repayment_method_type === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_repayment_method
//                         .question_one_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_repayment_method",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_repayment_method
//                         .question_two_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_repayment_method",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_repayment_method
//                         .question_three_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_repayment_method",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 4</Label>
//                   <Input
//                     type="textarea"
//                     name="question_four_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_repayment_method
//                         .question_four_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_repayment_method",
//                         "question_four_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.recommending_repayment_method
//               .recommending_repayment_method_type === "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={
//                       formValue.recommending_repayment_method
//                         .question_one_sharia
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_repayment_method",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={
//                       formValue.recommending_repayment_method
//                         .question_two_sharia
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_repayment_method",
//                         "question_two_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* recommending_mortgage_type */}
//         <Card className="border-1 border-success mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>Why are we recommending this mortgage type?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="recommending_mortgage_type_type"
//                   value={
//                     formValue.recommending_mortgage_type
//                       .recommending_mortgage_type
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_mortgage_type",
//                       "recommending_mortgage_type",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.recommending_mortgage_type.recommending_mortgage_type ===
//               "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_type.question_one_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_type",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_type.question_two_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_type",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_type.question_three_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_type",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 4</Label>
//                   <Input
//                     type="textarea"
//                     name="question_four_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_type.question_four_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_type",
//                         "question_four_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.recommending_mortgage_type.recommending_mortgage_type ===
//               "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_type.question_one_sharia
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_type",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_type.question_two_sharia
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_type",
//                         "question_two_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* recommending_term */}
//         <Card className="border-1 border-secondary mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>Why are you recommending this term?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="recommending_term_type"
//                   value={formValue.recommending_term.recommending_term}
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_term",
//                       "recommending_term",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.recommending_term.recommending_term === "GENERAL" && (
//               <FormGroup>
//                 <Label>Answer 1</Label>
//                 <Input
//                   type="textarea"
//                   name="question_one_answer"
//                   rows="3"
//                   value={formValue.recommending_term.question_one_answer}
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_term",
//                       "question_one_answer",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </FormGroup>
//             )}
//             {formValue.recommending_term.recommending_term === "SHARIA" && (
//               <FormGroup>
//                 <Label>Answer 1</Label>
//                 <Input
//                   type="textarea"
//                   name="question_one_sharia"
//                   rows="3"
//                   value={formValue.recommending_term.question_one}
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_term",
//                       "question_one",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </FormGroup>
//             )}
//           </CardBody>
//         </Card>
//         {/* recommending_mortgage_lender  */}
//         <Card className="border-1 border-success mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>Why are we recommending this mortgage Lender?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="recommending_mortgage_lender_type"
//                   value={
//                     formValue.recommending_mortgage_lender
//                       .recommending_mortgage_lender_type
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_mortgage_lender",
//                       "recommending_mortgage_lender_type",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.recommending_mortgage_lender
//               .recommending_mortgage_lender_type === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_lender.question_one_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_lender",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_lender.question_two_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_lender",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_lender
//                         .question_three_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_lender",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.recommending_mortgage_lender
//               .recommending_mortgage_lender_type === "SHARIA" && (
//               <FormGroup>
//                 <Label>Answer 1</Label>
//                 <Input
//                   type="textarea"
//                   name="question_one_sharia"
//                   rows="3"
//                   value={
//                     formValue.recommending_mortgage_lender.question_one_sharia
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_mortgage_lender",
//                       "question_one_sharia",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </FormGroup>
//             )}
//           </CardBody>
//         </Card>
//         {/* recommending_mortgage_amount  */}
//         <Card className="border-1 border-secondary mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>Why are we recommending this mortgage amount?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="recommending_mortgage_amount_type"
//                   value={
//                     formValue.recommending_mortgage_amount
//                       .recommending_mortgage_amount
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_mortgage_amount",
//                       "recommending_mortgage_amount",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.recommending_mortgage_amount
//               .recommending_mortgage_amount === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_amount.question_one_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_amount",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_amount.question_two_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_amount",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={
//                       formValue.recommending_mortgage_amount
//                         .question_three_answer
//                     }
//                     onChange={(e) =>
//                       handleChange(
//                         "recommending_mortgage_amount",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.recommending_mortgage_amount
//               .recommending_mortgage_amount === "SHARIA" && (
//               <FormGroup>
//                 <Label>Answer 1</Label>
//                 <Input
//                   type="textarea"
//                   name="question_one_sharia"
//                   rows="3"
//                   value={
//                     formValue.recommending_mortgage_amount.question_one_sharia
//                   }
//                   onChange={(e) =>
//                     handleChange(
//                       "recommending_mortgage_amount",
//                       "question_one_sharia",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </FormGroup>
//             )}
//           </CardBody>
//         </Card>
//         {/* costs_fees */}
//         <Card className="border-1 border-success mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>What are the costs and fees?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="costs_fees_type"
//                   value={formValue.costs_fees.costs_fees}
//                   onChange={(e) =>
//                     handleChange("costs_fees", "costs_fees", e.target.value)
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.costs_fees.costs_fees === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.costs_fees.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "costs_fees",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.costs_fees.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "costs_fees",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={formValue.costs_fees.question_three_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "costs_fees",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.costs_fees.costs_fees === "SHARIA" && (
//               <FormGroup>
//                 <Label>Answer 1</Label>
//                 <Input
//                   type="textarea"
//                   name="question_one_sharia"
//                   rows="3"
//                   value={formValue.costs_fees.question_one_sharia}
//                   onChange={(e) =>
//                     handleChange(
//                       "costs_fees",
//                       "question_one_sharia",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </FormGroup>
//             )}
//           </CardBody>
//         </Card>
//         {/* disadvantage_risks  */}
//         <Card className="border-1 border-secondary mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>What are the disadvantages and risks?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="disadvantageAndRisks_type"
//                   value={formValue.disadvantage_risks.disadvantage_risks}
//                   onChange={(e) =>
//                     handleChange(
//                       "disadvantage_risks",
//                       "disadvantage_risks",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.disadvantage_risks.disadvantage_risks === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_three_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 4</Label>
//                   <Input
//                     type="textarea"
//                     name="question_four_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_four_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_four_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 5</Label>
//                   <Input
//                     type="textarea"
//                     name="question_five_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_five_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_five_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 6</Label>
//                   <Input
//                     type="textarea"
//                     name="question_six_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_six_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_six_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 7</Label>
//                   <Input
//                     type="textarea"
//                     name="question_seven_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_seven_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_seven_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 8</Label>
//                   <Input
//                     type="textarea"
//                     name="question_eight_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_eight_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_eight_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 9</Label>
//                   <Input
//                     type="textarea"
//                     name="question_nine_answer"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_nine_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_nine_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.disadvantage_risks.disadvantage_risks === "SHARIA" && (
//               <>
//                 {" "}
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_one_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={formValue.disadvantage_risks.question_two}
//                     onChange={(e) =>
//                       handleChange(
//                         "disadvantage_risks",
//                         "question_two",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* cost_advice */}
//         <Card className="border-1 border-success mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>What is the cost of our advice?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="cost_advice_type"
//                   value={formValue.cost_advice.cost_advice}
//                   onChange={(e) =>
//                     handleChange("cost_advice", "cost_advice", e.target.value)
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.cost_advice.cost_advice === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.cost_advice.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "cost_advice",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.cost_advice.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "cost_advice",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.cost_advice.cost_advice === "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={formValue.cost_advice.question_one_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "cost_advice",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={formValue.cost_advice.question_two_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "cost_advice",
//                         "question_two_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* protection */}
//         <Card className="border-1 border-secondary mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>What is the protection?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="protection_type"
//                   value={formValue.protection.protection}
//                   onChange={(e) =>
//                     handleChange("protection", "protection", e.target.value)
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.protection.protection === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.protection.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "protection",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.protection.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "protection",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={formValue.protection.question_three_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "protection",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 4</Label>
//                   <Input
//                     type="textarea"
//                     name="question_four_answer"
//                     rows="3"
//                     value={formValue.protection.question_four_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "protection",
//                         "question_four_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.protection.protection === "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={formValue.protection.question_one_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "protection",
//                         "question_one_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={formValue.protection.question_two}
//                     onChange={(e) =>
//                       handleChange("protection", "question_two", e.target.value)
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_sharia"
//                     rows="3"
//                     value={formValue.protection.question_three_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "protection",
//                         "question_three_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 4</Label>
//                   <Input
//                     type="textarea"
//                     name="question_four_sharia"
//                     rows="3"
//                     value={formValue.protection.question_four_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "protection",
//                         "question_four_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* buildings_insurance */}
//         <Card className="border-1 border-success mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>What is the buildings insurance?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="buildings_insurance_type"
//                   value={formValue.buildings_insurance.buildings_insurance}
//                   onChange={(e) =>
//                     handleChange(
//                       "buildings_insurance",
//                       "buildings_insurance",
//                       e.target.value,
//                     )
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.buildings_insurance.buildings_insurance ===
//               "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_three_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 4</Label>
//                   <Input
//                     type="textarea"
//                     name="question_four_answer"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_four_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_four_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.buildings_insurance.buildings_insurance === "SHARIA" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_sharia"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_one}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_one",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_sharia"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_two}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_two",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_sharia"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_three_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_three_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 4</Label>
//                   <Input
//                     type="textarea"
//                     name="question_four_sharia"
//                     rows="3"
//                     value={formValue.buildings_insurance.question_five_sharia}
//                     onChange={(e) =>
//                       handleChange(
//                         "buildings_insurance",
//                         "question_five_sharia",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         {/* wills  */}
//         <Card className="border-1 border-secondary mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <Col md={6}>
//               <h4>What is the wills?</h4>
//             </Col>
//             <Col md={4}>
//               <FormGroup>
//                 <Input
//                   type="select"
//                   name="wills_type"
//                   value={formValue.wills.wills}
//                   onChange={(e) =>
//                     handleChange("wills", "wills", e.target.value)
//                   }
//                 >
//                   <option value="GENERAL">General</option>
//                   <option value="SHARIA">Sharia</option>
//                 </Input>
//               </FormGroup>
//             </Col>
//           </CardHeader>
//           <CardBody>
//             {formValue.wills.wills === "GENERAL" && (
//               <>
//                 <FormGroup>
//                   <Label>Answer 1</Label>
//                   <Input
//                     type="textarea"
//                     name="question_one_answer"
//                     rows="3"
//                     value={formValue.wills.question_one_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "wills",
//                         "question_one_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 2</Label>
//                   <Input
//                     type="textarea"
//                     name="question_two_answer"
//                     rows="3"
//                     value={formValue.wills.question_two_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "wills",
//                         "question_two_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label>Answer 3</Label>
//                   <Input
//                     type="textarea"
//                     name="question_three_answer"
//                     rows="3"
//                     value={formValue.wills.question_three_answer}
//                     onChange={(e) =>
//                       handleChange(
//                         "wills",
//                         "question_three_answer",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </FormGroup>
//               </>
//             )}
//             {formValue.wills.wills === "SHARIA" && (
//               <FormGroup>
//                 <Label>Answer 1</Label>
//                 <Input
//                   type="textarea"
//                   name="question_one_sharia"
//                   rows="3"
//                   value={formValue.wills.question_one}
//                   onChange={(e) =>
//                     handleChange("wills", "question_one", e.target.value)
//                   }
//                 />
//               </FormGroup>
//             )}
//           </CardBody>
//         </Card>
//         {/* Extra question answer  */}
//         <Card className="border-1 border-info mt-3">
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <h4>
//               Extra Question Answers(
//               <small className="text-danger opacity-75">
//                 These fields are read-only
//               </small>
//               )
//             </h4>
//           </CardHeader>
//           <CardBody>
//             {extraAnswersData?.length > 0 ? (
//               extraAnswersData.map((extraAnswer: any) => (
//                 <FormGroup key={extraAnswer?.alias}>
//                   <Label>
//                     <strong>Question Name:</strong>{" "}
//                     {extraAnswer?.section_choices ===
//                       "YOUR_CIRCUMSTANCES_AND_OBJECTIVES" &&
//                       "Your circumstances and objectives"}
//                     {extraAnswer?.section_choices ===
//                       "BUDGET_AND_AFFORDABILITY" && "Budget and affordability"}
//                     {extraAnswer?.section_choices === "NEW_MORTGAGE_DETAILS" &&
//                       "New mortgage details"}
//                     {extraAnswer?.section_choices ===
//                       "RECOMMENDED_REPAYMENT_METHOD" &&
//                       "Why are we recommending this repayment method?"}
//                     {extraAnswer?.section_choices ===
//                       "RECOMMENDED_MORTGAGE_TYPE" &&
//                       "Why are we recommending this mortgage type?"}
//                     {extraAnswer?.section_choices === "RECOMMENDED_TERM" &&
//                       "Why are we recommending this term?"}
//                     {extraAnswer?.section_choices === "RECOMMENDED_LENDER" &&
//                       "Why are we recommending this mortgage lender?"}
//                     {extraAnswer?.section_choices === "RECOMMENDED_AMOUNT" &&
//                       "Why are we recommending this mortgage amount?"}
//                     {extraAnswer?.section_choices === "COSTS_AND_FEES" &&
//                       "What are the costs and fees?"}
//                     {extraAnswer?.section_choices ===
//                       "DISADVANTAGES_AND_RISKS" &&
//                       "What are the disadvantages and risks?"}
//                     {extraAnswer?.section_choices === "COST_OF_ADVICE" &&
//                       "What is the cost of our advice?"}
//                     {extraAnswer?.section_choices === "PROTECTION" &&
//                       "What is the protection?"}
//                     {extraAnswer?.section_choices === "BUILDINGS_INSURANCE" &&
//                       "What is the buildings insurance?"}
//                     {extraAnswer?.section_choices === "WILLS" &&
//                       "What is the wills?"}
//                   </Label>
//                   <Input
//                     type="textarea"
//                     readOnly
//                     name="question_one_answer"
//                     rows="5"
//                     value={extraAnswer?.answer}
//                   />
//                 </FormGroup>
//               ))
//             ) : (
//               <div className="text-center text-muted">
//                 No extra answers found
//               </div>
//             )}

//             <div className="d-flex justify-content-start align-items-center">
//               <Button
//                 color="info"
//                 onClick={toggleExtraAnswerModal}
//                 disabled={isUpdating || session?.user?.user_type === "CLIENT"}
//               >
//                 Add More Answer
//               </Button>
//             </div>
//           </CardBody>
//         </Card>

//         {/* Buttons */}
//         <div className="d-flex justify-content-end mt-3 mb-0 gap-2">
//           <Button
//             color="primary"
//             type="button"
//             disabled={
//               submitting !== null ||
//               isUpdating ||
//               session?.user?.user_type === "CLIENT"
//             }
//             onClick={(e) => {
//               void handleSubmit(e, "save");
//             }}
//           >
//             {submitting === "save" ? "Saving..." : "Save Changes"}
//           </Button>
//           <Button
//             color="secondary"
//             type="button"
//             disabled={submitting !== null || isUpdating}
//             onClick={async (e) => {
//               if (session?.user?.user_type === "CLIENT") {
//                 handleNextTab();
//               } else {
//                 const ok = await handleSubmit(e, "save_next");
//                 if (ok) handleNextTab();
//               }
//             }}
//           >
//             {session?.user?.user_type === "CLIENT"
//               ? "Go To Next"
//               : submitting === "save_next"
//                 ? "Saving..."
//                 : "Save & Next"}
//           </Button>
//         </div>
//       </Form>
//       {/* Modal Components */}
//       <ExtraAnswerModal
//         isOpen={isExtraAnswerModalOpen}
//         toggle={toggleExtraAnswerModal}
//       />
//     </>
//   );
// };

// export default SuitabilityContent;

import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import {
  useGetRecommendationLetterQuery,
  useUpdateRecommendationLetterMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Suitability/SuitabilityApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import LoadingSpinner from "@/app/loading";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

import Tab5_DebtConsolidation, {
  DebtConsolidationData,
} from "./Components/DebtConsolidation";
import Tab6_IslamicMortgage, {
  IslamicMortgageData,
} from "./Components/IslamicMortgage";
import Tab7_LendingIntoRetirement, {
  LendingIntoRetirementData,
} from "./Components/LendingIntoRetirement";
import Tab1_MortgageDetails, {
  MortgageDetailsData,
} from "./Components/MortgageDetails";
import Tab4_Porting, { PortingData } from "./Components/Porting";
import Tab3_ProductTransfer, {
  ProductTransferData,
} from "./Components/ProductTransfer";
import Tab9_ProtectionInsurance, {
  ProtectionInsuranceData,
} from "./Components/ProtectionInsurance";
import Tab2_RateRepayment, {
  RateRepaymentData,
} from "./Components/RateRepayment";
import Tab8_RiskWarnings, { RiskWarningsData } from "./Components/RiskWarnings";

// ─── Error helpers ────────────────────────────────────────────────────────────

const getErrorMessage = (err: any): string => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err?.data?.message) return String(err.data.message);
  if (err?.error) return String(err.error);
  if (err?.message) return String(err.message);
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};

const parseApiErrors = (err: any): Record<string, string> => {
  const out: Record<string, string> = {};
  const recurse = (value: any, path: string[]) => {
    if (value == null) return;
    if (typeof value === "string") {
      out[path.join(".")] = value;
      return;
    }
    if (Array.isArray(value)) {
      out[path.join(".")] = value.map(String).join(", ");
      return;
    }
    if (typeof value === "object") {
      for (const k of Object.keys(value)) recurse(value[k], path.concat(k));
    }
  };
  recurse(err?.data || err, []);
  return out;
};

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "1", label: "Mortgage Details" },
  { id: "2", label: "Rate & Justification" },
  { id: "3", label: "Product Transfer" },
  { id: "4", label: "Porting" },
  { id: "5", label: "Debt Consolidation" },
  { id: "6", label: "Islamic Mortgage" },
  { id: "7", label: "Lending Into Retirement" },
  { id: "8", label: "Risk Warnings" },
  { id: "9", label: "Protection & Insurance" },
];

// ─── Full form state ──────────────────────────────────────────────────────────

interface FormState {
  tab1: MortgageDetailsData;
  tab2: RateRepaymentData;
  tab3: ProductTransferData;
  tab4: PortingData;
  tab5: DebtConsolidationData;
  tab6: IslamicMortgageData;
  tab7: LendingIntoRetirementData;
  tab8: RiskWarningsData;
  tab9: ProtectionInsuranceData;
}

const INITIAL_STATE: FormState = {
  tab1: {
    advisor_details: {
      advisor_name: "",
      firm_name: "",
      role: "Mortgage Advisor",
      address_line_1: "",
      city: "",
      postcode: "",
      email: "",
      phone: "",
    },
    client_details: {
      salutation: "Mr",
      first_name: "",
      last_name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postcode: "",
      is_joint: "NO",
      salutation_2: "Mrs",
      first_name_2: "",
      last_name_2: "",
    },
    property_transaction: {
      property_address: "",
      transaction_type: "PURCHASE",
      soft_facts_type: "GENERAL",
      question_one_answer: "",
      question_one_sharia: "",
    },
    mortgage_details: {
      lender: "",
      initial_rate: "",
      rate_type: "FIXED",
      deal_period_end: "",
      repayment_method: "REPAYMENT",
      mortgage_amount: "",
      arrangement_fee_amount: "",
      term_years: "",
      term_months: "0",
      monthly_repayment: "",
    },
  },
  tab2: {
    recommending_lender: {
      recommending_lender_type: "GENERAL",
      question_one_answer: "",
      question_one_sharia: "",
    },
    recommending_rate_type: {
      recommending_rate_type: "GENERAL",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    recommending_deal_period: {
      recommending_deal_period_type: "GENERAL",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_one_sharia: "",
    },
    recommending_repayment: {
      recommending_repayment_type: "GENERAL",
      question_one_answer: "",
      question_one_sharia: "",
    },
    mortgage_amount_selection: { selection: "" },
    arrangement_fee_selection: { selection: "" },
    recommending_term: {
      recommending_term_type: "GENERAL",
      question_one_answer: "",
      question_one_sharia: "",
    },
    erc_selection: { selection: "", max_erc_amount: "" },
    portability_selection: { selection: "" },
    rate_switch_selection: { selection: "" },
    additional_information: {
      additional_information_type: "GENERAL",
      question_one_answer: "",
      question_one_sharia: "",
    },
  },
  tab3: {
    is_applicable: "NO",
    process_type: "FULL",
    lender: "",
    expiry_date: "",
    svr_rate: "",
    recommendation_reason: "",
    client_preference_detail: "",
    shortened_client_reason: "",
    no_material_changes_confirmed: "",
    cost_comparison: "",
    cost_difference: "",
    additional_notes: "",
  },
  tab4: {
    is_applicable: "NO",
    existing_product_end_date: "",
    new_product_end_date: "",
    erc_amount: "",
    new_lender_assessed: "",
    new_lender_not_recommended_reason: "",
    second_charge_considered: "",
    second_charge_not_needed_reason: "",
    additional_considerations: "",
  },
  tab5: {
    is_applicable: "NO",
    total_outstanding: "",
    how_debts_arose: "",
    client_goal: "",
    alternative_finance_considered: "",
    debts: [],
    overall_cost_comparison: "",
    why_more_still_recommended: "",
    financial_difficulty_acknowledged: "",
    wants_debt_advice_info: "",
    client_confirmation_reason: "",
  },
  tab6: {
    is_applicable: "NO",
    method: "",
    provider: "",
    overpayment_type: "",
    overpayment_limit_percent: "",
    recommendation_reason: "",
    additional_notes: "",
  },
  tab7: {
    is_applicable: "NO",
    mortgage_term_years: "",
    pension_statement_required: "",
    years_to_retirement: "",
    client_specific_notes: "",
  },
  tab8: {
    high_ltv_applicable: "NO",
    extending_term_applicable: "NO",
    shared_ownership_applicable: "NO",
    first_homes_scheme_applicable: "NO",
    buy_to_let_applicable: "NO",
    jbsp_applicable: "NO",
    additional_risk_notes: "",
  },
  tab9: {
    protection: {
      protection_type: "GENERAL",
      protection_option: "",
      question_one_answer: "",
      question_two_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    buildings_insurance: {
      buildings_insurance_type: "GENERAL",
      insurance_option: "",
      question_one_answer: "",
      question_one_sharia: "",
    },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SuitabilityContent: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();

  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const { data: letterData, isLoading } = useGetRecommendationLetterQuery({
    case_alias: casealias,
  });
  const [updateRecommendationLetter, { isLoading: isUpdating }] =
    useUpdateRecommendationLetterMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [activeTab, setActiveTab] = useState("1");
  const [submitting, setSubmitting] = useState<"save" | "save_next" | null>(
    null,
  );
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  // ─── Hydrate from API ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!letterData) return;
    setForm((prev) => ({
      tab1: {
        advisor_details: {
          ...prev.tab1.advisor_details,
          ...letterData.advisor_details,
        },
        client_details: {
          ...prev.tab1.client_details,
          ...letterData.client_details,
        },
        property_transaction: {
          ...prev.tab1.property_transaction,
          ...letterData.property_transaction,
        },
        mortgage_details: {
          ...prev.tab1.mortgage_details,
          ...letterData.mortgage_details,
        },
      },
      tab2: {
        recommending_lender: {
          ...prev.tab2.recommending_lender,
          ...letterData.recommending_lender,
        },
        recommending_rate_type: {
          ...prev.tab2.recommending_rate_type,
          ...letterData.recommending_rate_type,
        },
        recommending_deal_period: {
          ...prev.tab2.recommending_deal_period,
          ...letterData.recommending_deal_period,
        },
        recommending_repayment: {
          ...prev.tab2.recommending_repayment,
          ...letterData.recommending_repayment,
        },
        mortgage_amount_selection: {
          ...prev.tab2.mortgage_amount_selection,
          ...letterData.mortgage_amount_selection,
        },
        arrangement_fee_selection: {
          ...prev.tab2.arrangement_fee_selection,
          ...letterData.arrangement_fee_selection,
        },
        recommending_term: {
          ...prev.tab2.recommending_term,
          ...letterData.recommending_term,
        },
        erc_selection: {
          ...prev.tab2.erc_selection,
          ...letterData.erc_selection,
        },
        portability_selection: {
          ...prev.tab2.portability_selection,
          ...letterData.portability_selection,
        },
        rate_switch_selection: {
          ...prev.tab2.rate_switch_selection,
          ...letterData.rate_switch_selection,
        },
        additional_information: {
          ...prev.tab2.additional_information,
          ...letterData.additional_information,
        },
      },
      tab3: { ...prev.tab3, ...(letterData.product_transfer || {}) },
      tab4: { ...prev.tab4, ...(letterData.porting || {}) },
      tab5: { ...prev.tab5, ...(letterData.debt_consolidation || {}) },
      tab6: { ...prev.tab6, ...(letterData.islamic_mortgage || {}) },
      tab7: { ...prev.tab7, ...(letterData.lending_into_retirement || {}) },
      tab8: { ...prev.tab8, ...(letterData.risk_warnings || {}) },
      tab9: {
        protection: { ...prev.tab9.protection, ...letterData.protection },
        buildings_insurance: {
          ...prev.tab9.buildings_insurance,
          ...letterData.buildings_insurance,
        },
      },
    }));
  }, [letterData]);

  // ─── Typed section-level change handlers ─────────────────────────────────────

  const handleTab1Change = <S extends keyof MortgageDetailsData>(
    section: S,
    field: keyof MortgageDetailsData[S],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      tab1: {
        ...prev.tab1,
        [section]: { ...(prev.tab1[section] as any), [field]: value },
      },
    }));
  };

  const handleTab2Change = <S extends keyof RateRepaymentData>(
    section: S,
    field: keyof RateRepaymentData[S],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      tab2: {
        ...prev.tab2,
        [section]: { ...(prev.tab2[section] as any), [field]: value },
      },
    }));
  };

  const handleTab3Change = (field: keyof ProductTransferData, value: string) =>
    setForm((prev) => ({ ...prev, tab3: { ...prev.tab3, [field]: value } }));

  const handleTab4Change = (field: keyof PortingData, value: string) =>
    setForm((prev) => ({ ...prev, tab4: { ...prev.tab4, [field]: value } }));

  const handleTab5Change = (field: keyof DebtConsolidationData, value: any) =>
    setForm((prev) => ({ ...prev, tab5: { ...prev.tab5, [field]: value } }));

  const handleTab6Change = (field: keyof IslamicMortgageData, value: string) =>
    setForm((prev) => ({ ...prev, tab6: { ...prev.tab6, [field]: value } }));

  const handleTab7Change = (
    field: keyof LendingIntoRetirementData,
    value: string,
  ) => setForm((prev) => ({ ...prev, tab7: { ...prev.tab7, [field]: value } }));

  const handleTab8Change = (field: keyof RiskWarningsData, value: string) =>
    setForm((prev) => ({ ...prev, tab8: { ...prev.tab8, [field]: value } }));

  const handleTab9Change = <S extends keyof ProtectionInsuranceData>(
    section: S,
    field: keyof ProtectionInsuranceData[S],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      tab9: {
        ...prev.tab9,
        [section]: { ...(prev.tab9[section] as any), [field]: value },
      },
    }));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (
    e: React.MouseEvent,
    action: "save" | "save_next" = "save",
  ): Promise<boolean> => {
    e.preventDefault();
    setSubmitting(action);

    const payload = {
      alias: casealias,
      ...form.tab1,
      ...form.tab2,
      product_transfer: form.tab3,
      porting: form.tab4,
      debt_consolidation: form.tab5,
      islamic_mortgage: form.tab6,
      lending_into_retirement: form.tab7,
      risk_warnings: form.tab8,
      protection: form.tab9.protection,
      buildings_insurance: form.tab9.buildings_insurance,
    };

    try {
      const res = await updateRecommendationLetter({
        payload,
        case_alias: casealias,
      });
      if (res.data) {
        toast.success("Changes saved successfully!");
        await updateSectionCompleteStatus({
          case_alias: casealias,
          section_data: { is_recommendation_letter: true },
        }).catch(console.error);
        return true;
      }
      const parsed = parseApiErrors(res.error);
      toast.error(
        Object.values(parsed)[0] ||
          getErrorMessage(res.error) ||
          "Failed to save changes",
      );
      return false;
    } catch (error) {
      toast.error(
        getErrorMessage(error) || "Failed to save changes. Please try again.",
      );
      return false;
    } finally {
      setSubmitting(null);
    }
  };

  // ─── Navigation ───────────────────────────────────────────────────────────────

  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) dispatch(basicTabIndicator(nextTabNav));
    else toast.warning("This is the last tab.");
  };

  const goToInnerTab = (id: string) => setActiveTab(id);

  if (isLoading) return <LoadingSpinner />;

  const isClient = session?.user?.user_type === "CLIENT";

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Inner Tab Navigation ── */}
      <Nav tabs className="mb-0 flex-nowrap overflow-auto suitability-tabs">
        {TABS.map((tab) => (
          <NavItem key={tab.id} className="flex-shrink-0">
            <NavLink
              active={activeTab === tab.id}
              onClick={() => goToInnerTab(tab.id)}
              className="cursor-pointer text-nowrap"
            >
              {tab.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      {/* ── Tab Content ── */}
      <div className="border border-top-0 rounded-bottom p-3 bg-white">
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Tab1_MortgageDetails
              data={form.tab1}
              onChange={handleTab1Change}
            />
          </TabPane>
          <TabPane tabId="2">
            <Tab2_RateRepayment
              data={form.tab2}
              rateType={form.tab1.mortgage_details.rate_type}
              repaymentMethod={form.tab1.mortgage_details.repayment_method}
              onChange={handleTab2Change}
            />
          </TabPane>
          <TabPane tabId="3">
            <Tab3_ProductTransfer
              data={form.tab3}
              onChange={handleTab3Change}
            />
          </TabPane>
          <TabPane tabId="4">
            <Tab4_Porting data={form.tab4} onChange={handleTab4Change} />
          </TabPane>
          <TabPane tabId="5">
            <Tab5_DebtConsolidation
              data={form.tab5}
              onChange={handleTab5Change}
            />
          </TabPane>
          <TabPane tabId="6">
            <Tab6_IslamicMortgage
              data={form.tab6}
              onChange={handleTab6Change}
            />
          </TabPane>
          <TabPane tabId="7">
            <Tab7_LendingIntoRetirement
              data={form.tab7}
              onChange={handleTab7Change}
            />
          </TabPane>
          <TabPane tabId="8">
            <Tab8_RiskWarnings data={form.tab8} onChange={handleTab8Change} />
          </TabPane>
          <TabPane tabId="9">
            <Tab9_ProtectionInsurance
              data={form.tab9}
              onChange={handleTab9Change}
            />
          </TabPane>
        </TabContent>

        {/* ── Inner tab prev/next ── */}
        <div className="d-flex justify-content-between mt-3">
          <Button
            color="light"
            outline
            disabled={activeTab === "1"}
            onClick={() => goToInnerTab(String(Number(activeTab) - 1))}
          >
            ← Previous
          </Button>
          {activeTab !== "9" ? (
            <Button
              color="light"
              outline
              onClick={() => goToInnerTab(String(Number(activeTab) + 1))}
            >
              Next →
            </Button>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* ── Save / Save & Next ── */}
      <div className="d-flex justify-content-end mt-3 gap-2">
        <Button
          color="primary"
          disabled={submitting !== null || isUpdating || isClient}
          onClick={(e) => {
            void handleSubmit(e, "save");
          }}
        >
          {submitting === "save" ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          color="secondary"
          disabled={submitting !== null || isUpdating}
          onClick={async (e) => {
            if (isClient) {
              handleNextTab();
              return;
            }
            const ok = await handleSubmit(e, "save_next");
            if (ok) handleNextTab();
          }}
        >
          {isClient
            ? "Go To Next"
            : submitting === "save_next"
              ? "Saving..."
              : "Save & Next"}
        </Button>
      </div>
    </div>
  );
};

export default SuitabilityContent;
