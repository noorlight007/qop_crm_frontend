import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./Api/BaseApi";
import { publicBaseApi } from "./Api/PublicBaseApi";
import CustomTabReducer from "./CustomTabSlice";
import appearanceReducer from "./Reducers/Appearance/AppearanceSlice";
import budgetPlannerReducer from "./Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerFormSlice";
import CaseSectionsTabIndicatorReducer from "./Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import ComplianceReducer from "./Reducers/Common/Cases/CaseDetails/CaseSections/Compliance/ComplianceSlice";
import propertyFormReducer from "./Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/SecurityPropertyFormSlice";
import FormWizardOne from "./Reducers/FormLayout/FormWizardOneSlice";
import FormWizardTwoSlice from "./Reducers/FormLayout/FormWizardTwoSlice";
import TwoFactorSlice from "./Reducers/FormLayout/TwoFactorSlice";
import LayoutSlice from "./Reducers/LayoutSlice";
import ThemeCustomizerReducer from "./Reducers/ThemeCustomizerReducer";

const Store = configureStore({
  reducer: {
    [publicBaseApi.reducerPath]: publicBaseApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    appearance: appearanceReducer,
    layout: LayoutSlice,
    twoFactor: TwoFactorSlice,
    formWizardTwo: FormWizardTwoSlice,
    formWizardOne: FormWizardOne,
    themeCustomizer: ThemeCustomizerReducer,
    caseSections: CaseSectionsTabIndicatorReducer,
    organisationDetailsTabs: CustomTabReducer,
    propertyForm: propertyFormReducer,
    budgetPlanner: budgetPlannerReducer,
    compliance: ComplianceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(publicBaseApi.middleware, baseApi.middleware),
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
