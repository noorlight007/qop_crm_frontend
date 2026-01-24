import { initializeForm } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { PropertyData } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SecurityPropertyTypes";
import { FC, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, TabContent, TabPane } from "reactstrap";
import AdditionalInfo from "./Components/PropertyDetailsTabs/PropertyAdditionalInfo";
import AddressDetails from "./Components/PropertyDetailsTabs/PropertyAddress";
import PropertyDetails from "./Components/PropertyDetailsTabs/PropertyType";
import ValuationInfo from "./Components/PropertyDetailsTabs/PropertyValuation";

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
  // form refs for each tab so we can run HTML5 validation before navigating
  const formRef1 = useRef<HTMLFormElement | null>(null);
  const formRef2 = useRef<HTMLFormElement | null>(null);
  const formRef3 = useRef<HTMLFormElement | null>(null);
  const formRef4 = useRef<HTMLFormElement | null>(null);

  const handleNext = () => {
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
    setTabId((parseInt(tabId) + 1).toString());
  };

  useEffect(() => {
    if (propertyData) {
      dispatch(
        initializeForm({
          ...propertyData,
          other_new_build_warranty_provider: "",
        })
      );
    }
  }, [propertyData, dispatch]);

  return (
    <div>
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
  );
};

export default SecurityPropertyTabContent;
