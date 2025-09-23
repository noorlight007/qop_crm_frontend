import { initializeForm } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { PropertyData } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SecurityPropertyTypes";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, TabContent, TabPane } from "reactstrap";
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
  const handleNext = () => setTabId((parseInt(tabId) + 1).toString());

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
          <AddressDetails />
          <Button color="primary" onClick={handleNext} className="float-end">
            Next
          </Button>
        </TabPane>
        <TabPane tabId="2">
          <PropertyDetails />
          <Button color="primary" onClick={handleNext} className="float-end">
            Next
          </Button>
        </TabPane>
        <TabPane tabId="3">
          <AdditionalInfo />
          <Button color="primary" onClick={handleNext} className="float-end">
            Next
          </Button>
        </TabPane>
        <TabPane tabId="4">
          <ValuationInfo />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default SecurityPropertyTabContent;
