export const ANSWER_OPTIONS = [
  { label: "Strongly Disagree", value: "STRONGLY_DISAGREE" },
  { label: "Disagree", value: "DISAGREE" },
  { label: "Neutral", value: "NEUTRAL" },
  { label: "Agree", value: "AGREE" },
  { label: "Strongly Agree", value: "STRONGLY_AGREE" },
];

export const ClientSurveyQuestions: Array<{
  id: string;
  label: string;
  type: "radio" | "textarea" | "text";
  placeholder?: string;
  required?: boolean;
}> = [
  {
    id: "adviserName",
    label: "Your Adviser Name",
    type: "text",
    placeholder: "Enter adviser name",
    required: true,
  },
  {
    id: "question1",
    label:
      "1. Throughout the process, I was made to feel valued by my adviser.",
    type: "radio",
  },
  {
    id: "question2",
    label: "2. Throughout the process, I was made to feel valued by the firm.",
    type: "radio",
  },
  {
    id: "question3",
    label:
      "3. My adviser communicated with me in a way that felt clear and easy to understand.",
    type: "radio",
  },
  {
    id: "question4",
    label:
      "4. The firm communicated with me in a way that felt clear and easy to understand.",
    type: "radio",
  },
  {
    id: "question5",
    label: "5. I feel that my advisor treated me fairly.",
    type: "radio",
  },
  {
    id: "question6",
    label: "6. I feel that the firm treated me fairly.",
    type: "radio",
  },
  {
    id: "question7",
    label:
      "7. The information about the firm's fees and charges was made clear to me from the outset.",
    type: "radio",
  },
  {
    id: "question8",
    label: "8. I received a disclosure document confirming these details.",
    type: "radio",
  },
  {
    id: "question9",
    label:
      "9. My advisor clearly explained the potential risks and impacts of interest rate changes once my deal expires.",
    type: "radio",
  },
  {
    id: "question10",
    label:
      "10. I am confident that the mortgage was tailored to my personal circumstances and understand why this specific mortgage was recommended to me.",
    type: "radio",
  },
  {
    id: "question11",
    label:
      "11. I received a letter of recommendation detailing how the mortgage was right based on my circumstances, within a week of the application being submitted.",
    type: "radio",
  },
  {
    id: "question12",
    label:
      "12. I was provided the opportunity to protect my mortgage my mortgage and home.",
    type: "radio",
  },
  {
    id: "question13",
    label: "13. Overall I am satisfied with the advice process.",
    type: "radio",
  },
  {
    id: "question14",
    label: "14. Overall I am satisfied with the service provided.",
    type: "radio",
  },
  {
    id: "question15",
    label:
      "15. Based on my experience I would recommend the adviser to my friends and family.",
    type: "radio",
  },
  {
    id: "question16",
    label:
      "16. Based on my experience I would recommend the firm to my friends and family.",
    type: "radio",
  },
  {
    id: "question17",
    label:
      "17. Do you feel the broker fee paid represents fair value for the service you received?",
    type: "textarea",
    placeholder: "Please describe any suggestions for improving the service",
  },
  {
    id: "question18",
    label: "18. Was the explanation of broker fees including refund policy?",
    type: "textarea",
    placeholder: "Please provide any feedback on strengths of the service",
  },
];
