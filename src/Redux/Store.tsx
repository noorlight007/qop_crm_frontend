import { configureStore } from "@reduxjs/toolkit";
import { authBaseApi } from "./Api/AuthBaseApi";
import { baseApi } from "./Api/BaseApi";
import budgetPlannerReducer from "./Reducers/CommonComponents/SingleCaseInfo/CaseDetails/BudgetPlanner/BudgetPlannerFormSlice";
import CaseDetailsTabIndicatorReducer from "./Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import ComplianceReducer from "./Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Compliance/ComplianceSlice";
import propertyFormReducer from "./Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import FormWizardOne from "./Reducers/FormLayout/FormWizardOneSlice";
import FormWizardTwoSlice from "./Reducers/FormLayout/FormWizardTwoSlice";
import TwoFactorSlice from "./Reducers/FormLayout/TwoFactorSlice";
import LayoutSlice from "./Reducers/LayoutSlice";
import ThemeCustomizerReducer from "./Reducers/ThemeCustomizerReducer";

const Store = configureStore({
  reducer: {
    [authBaseApi.reducerPath]: authBaseApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    layout: LayoutSlice,
    twoFactor: TwoFactorSlice,
    formWizardTwo: FormWizardTwoSlice,
    formWizardOne: FormWizardOne,
    themeCustomizer: ThemeCustomizerReducer,
    caseDetails: CaseDetailsTabIndicatorReducer,
    propertyForm: propertyFormReducer,
    budgetPlanner: budgetPlannerReducer,
    compliance: ComplianceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
