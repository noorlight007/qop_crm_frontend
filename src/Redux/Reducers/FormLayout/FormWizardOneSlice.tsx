import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  numberLevel: 1,
  basicInputFormValue: { email: "", firstName: "", password: "", confirmPassword: "", agreeTerms: false, placeHolderName: "", cardNumber: "", expiration: "", cvvNumber: "", uploadDocumentation: "", informationCheckBox: false, linkedInLink: "", gitHubLink: "", giveFeedBack: "", state: "", agreeConditions: false },
  showFinish: false,
  studentLevel: 1,
  studentValidationForm: { name: "", email: "", password: "", confirmPassWord: "", portfolioURL: "", projectDescription: "", imageUpload: "", twitterUrl: "", gitHubUrl: "", studentFile: "", positions: "", positionQuestion: "" },
  netBankingFormValues: { bankName: "", feedBack: "" },
  open: "",
};

const FormWizardOneSlice = createSlice({
  name: "FormWizardOneSlice",
  initialState,
  reducers: {
    setBasicInputFormValue: (state, action) => {
      state.basicInputFormValue = action.payload;
    },
    setShowFinish: (state, action) => {
      state.showFinish = action.payload;
    },
    handleBackButton: (state) => {
      state.showFinish = false;
      if (state.numberLevel === 2) state.numberLevel = state.numberLevel - 1;
      if (state.numberLevel === 3) state.numberLevel = state.numberLevel - 1;
      if (state.numberLevel === 4) state.numberLevel = state.numberLevel - 1;
    },
    handleNextButton: (state) => {
      if (state.basicInputFormValue.email !== "" && state.basicInputFormValue.firstName !== "" && state.basicInputFormValue.password !== "" && state.basicInputFormValue.confirmPassword !== "" && state.basicInputFormValue.agreeTerms !== false && state.numberLevel === 1) state.numberLevel = 2;
      else if (state.basicInputFormValue.placeHolderName !== "" && state.basicInputFormValue.cardNumber !== "" && state.basicInputFormValue.expiration !== "" && state.basicInputFormValue.cvvNumber !== "" && state.basicInputFormValue.informationCheckBox !== false && state.basicInputFormValue.uploadDocumentation !== "" && state.numberLevel === 2) state.numberLevel = 3;
      else if (state.basicInputFormValue.linkedInLink !== "" && state.basicInputFormValue.gitHubLink !== "" && state.basicInputFormValue.giveFeedBack !== "" && state.basicInputFormValue.state !== "" && state.basicInputFormValue.agreeConditions !== false && state.numberLevel === 3) {
        state.numberLevel = 4;
        state.showFinish = true;
      } else toast.error("Please fill all field after press next button");
    },
    setStudentValidationForm: (state, action) => {
      state.studentValidationForm = action.payload;
    },
    setStudentLevel: (state, action) => {
      state.studentLevel = action.payload;
    },
    handleStudentBackButton: (state) => {
      if (state.studentLevel === 2) state.studentLevel = state.studentLevel - 1;
      if (state.studentLevel === 3) state.studentLevel = state.studentLevel - 1;
      if (state.studentLevel === 4) state.studentLevel = state.studentLevel - 1;
    },
    handleStudentNextButton: (state) => {
      if (state.studentValidationForm.name !== "" && state.studentValidationForm.email !== "" && state.studentValidationForm.password !== "" && state.studentValidationForm.confirmPassWord !== "" && state.studentLevel === 1) state.studentLevel = 2;
      if (state.studentValidationForm.projectDescription !== "" && state.studentValidationForm.portfolioURL !== "" && state.studentValidationForm.imageUpload !== "") state.studentLevel = 3;
      if (state.studentValidationForm.twitterUrl !== "" && state.studentValidationForm.gitHubUrl !== "" && state.studentValidationForm.studentFile !== "" && state.studentValidationForm.positions !== "" && state.studentValidationForm.positionQuestion !== "") state.studentLevel = 4;
    },
    setNetBankingForm: (state, action) => {
      state.netBankingFormValues = action.payload;
    },
    bankingNextHandler: (state) => {
      if (state.netBankingFormValues.bankName !== "" && state.netBankingFormValues.feedBack !== "") toast.info("Form successfully submitted");
      else toast.error("Please fill all field after press next button");
    },
  },
});

export const { setBasicInputFormValue, setShowFinish, handleBackButton, handleNextButton, setStudentLevel, setStudentValidationForm, handleStudentBackButton, handleStudentNextButton ,setNetBankingForm, bankingNextHandler} = FormWizardOneSlice.actions;

export default FormWizardOneSlice.reducer;
