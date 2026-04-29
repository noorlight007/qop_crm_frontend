import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useValidatePropertyMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/SecurityPropertyApi";
import {
  clearPropertyErrors,
  initializeForm,
  setPropertyErrors,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/SecurityPropertyFormSlice";
import { PropertyData } from "@/Types/Common/Cases/CaseDetails/CaseSections/SecurityPropertyTypes";
import { useParams } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, TabContent, TabPane } from "reactstrap";
import AdditionalInfo from "./Components/PropertyDetailsTabs/PropertyAdditionalInfo";
import AddressDetails from "./Components/PropertyDetailsTabs/PropertyAddress";
import PropertyDetails from "./Components/PropertyDetailsTabs/PropertyType";
import ValuationInfo from "./Components/PropertyDetailsTabs/PropertyValuation";
import { useIsLocked } from "./context/EditableContext";

interface SecurityPropertyTabContentProps {
  tabId: string;
  setTabId: (id: string) => void;
  propertyData?: PropertyData;
}

const SecurityPropertyTabContent: FC<SecurityPropertyTabContentProps> = ({
  tabId,
  setTabId,
  propertyData,
}) => {
  const dispatch = useDispatch();
  const isLocked = useIsLocked();
  // form refs for each tab so we can run HTML5 validation before navigating
  const formRef1 = useRef<HTMLFormElement | null>(null);
  const formRef2 = useRef<HTMLFormElement | null>(null);
  const formRef3 = useRef<HTMLFormElement | null>(null);
  const formRef4 = useRef<HTMLFormElement | null>(null);

  const params = useParams();
  const { casealias } = params;

  const propertyForm = useAppSelector((s) => s.propertyForm.Properties);
  const appDispatch = useAppDispatch();
  const [validateProperty, { isLoading: isValidating }] =
    useValidatePropertyMutation();

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const data = err?.data || (err?.error && err.error.data) || err;
    const recurse = (value: any, path: string[] = []) => {
      if (value == null) return;
      if (typeof value === "string") {
        out[path.join(".")] = value;
        return;
      }
      if (Array.isArray(value)) {
        out[path.join(".")] = value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(", ");
        return;
      }
      if (typeof value === "object") {
        for (const k of Object.keys(value)) recurse(value[k], path.concat(k));
        return;
      }
      out[path.join(".")] = String(value);
    };

    recurse(data, []);
    return out;
  };

  const findTabFromErrors = (errs: Record<string, string>): string | null => {
    const keys = Object.keys(errs || {});
    const tab1Fields = [
      "postcode",
      "house_name_or_number",
      "address_one",
      "address_two",
      "city",
      "county",
      "country",
      "latitude",
      "longitude",
    ];
    const tab2Fields = [
      "property_type",
      "house_type",
      "construction_of_walls",
      "construction_of_roof",
      "bedrooms",
      "bathrooms",
      "reception_rooms",
      "kitchens",
      "garages",
      "parking_spaces",
      "epc_rating",
      "floor",
      "flats",
      "year_built",
      "tenure",
    ];
    const tab3Fields = [
      "please_provide_further_details",
      "comments_details",
      "new_build_warranty_provider",
      "other_new_build_warranty_provider",
    ];
    const tab4Fields = [
      "valuation_type",
      "estimated_value",
      "property_purchase_price",
      "property_estimated_valuation",
    ];

    for (const k of keys) {
      const lower = k.toLowerCase();
      if (tab1Fields.some((f) => lower.includes(f))) return "1";
      if (tab2Fields.some((f) => lower.includes(f))) return "2";
      if (tab3Fields.some((f) => lower.includes(f))) return "3";
      if (tab4Fields.some((f) => lower.includes(f))) return "4";
    }
    return null;
  };

  const handleNext = async () => {
    const current =
      tabId === "1"
        ? formRef1.current
        : tabId === "2"
          ? formRef2.current
          : tabId === "3"
            ? formRef3.current
            : formRef4.current;
    if (current) {
      try {
        const ok = current.reportValidity();
        if (!ok) return;
      } catch (err) {
        console.warn("reportValidity failed", err);
      }
    }

    // Call server-side validation before moving to the next tab
    try {
      const propertyAlias = (propertyData as any)?.alias;
      if (!propertyAlias) {
        // If no alias, just proceed
        setTabId((parseInt(tabId) + 1).toString());
        return;
      }

      const res = await validateProperty({
        case_alias: casealias,
        property_alias: propertyAlias,
        updatedSecurityProperty: propertyForm,
      }).unwrap();

      // validation passed
      appDispatch(clearPropertyErrors());
      setTabId((parseInt(tabId) + 1).toString());
    } catch (err: any) {
      const parsed = parseApiErrors(err);
      // store parsed errors in the form slice for children to display
      appDispatch(setPropertyErrors(parsed));
      const target = findTabFromErrors(parsed);
      if (target) setTabId(target);
      const first = Object.values(parsed)[0];
      // keep user on current tab if no tab mapping found
      // show toast
      if (first) toast.error(first);
    }
  };

  useEffect(() => {
    if (propertyData) {
      dispatch(
        initializeForm({
          ...propertyData,
          other_new_build_warranty_provider: "",
        }),
      );
    }
  }, [propertyData, dispatch]);

  return (
    <div style={{ position: "relative" }}>
      {isLocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            cursor: "not-allowed",
            backgroundColor: "rgba(0,0,0,0.0001)",
          }}
          title="This case is not editable"
        />
      )}
      <div
        style={{
          opacity: isLocked ? 0.45 : 1,
          pointerEvents: isLocked ? "none" : "auto",
          transition: "opacity 0.2s ease",
          userSelect: isLocked ? "none" : "auto",
        }}
      >
        <TabContent activeTab={tabId} className="w-full">
          <TabPane tabId="1">
            <Form innerRef={formRef1}>
              <AddressDetails />
            </Form>
            <Button color="primary" onClick={handleNext} className="float-end">
              Next
            </Button>
          </TabPane>
          <TabPane tabId="2">
            <Form innerRef={formRef2}>
              <PropertyDetails />
            </Form>
            <Button color="primary" onClick={handleNext} className="float-end">
              Next
            </Button>
          </TabPane>
          <TabPane tabId="3">
            <Form innerRef={formRef3}>
              <AdditionalInfo />
            </Form>
            <Button color="primary" onClick={handleNext} className="float-end">
              Next
            </Button>
          </TabPane>
          <TabPane tabId="4">
            <Form innerRef={formRef4}>
              <ValuationInfo />
            </Form>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default SecurityPropertyTabContent;
