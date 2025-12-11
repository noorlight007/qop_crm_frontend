import LoadingSpinner from "@/app/loading";
import { useGetPropertiesQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyApi";
import { initializeForm } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardBody, CardHeader, Nav, NavItem, NavLink } from "reactstrap";
import FoundProperty from "./Components/FoundProperty";
import NoteForProperty from "./Components/NoteForProperty";
import OtherOccupants from "./Components/OtherOccupants";
import PropertyValuationCard from "./Components/PropertyValuationCard";
import SecurityPropertyTabContent from "./SecurityPropertyTabContent";

const propertyContentTabs = [
  { id: "1", title: "Property Address" },
  { id: "2", title: "Property Type" },
  { id: "3", title: "Additional Info" },
  { id: "4", title: "Valuation/Access Details" },
];

const SecurityProperty: React.FC = () => {
  const { casealias } = useParams();
  const dispatch = useDispatch();
  const [activeContentTab, setActiveContentTab] = useState("1");
  const { data: properties, isLoading } = useGetPropertiesQuery({
    case_alias: casealias,
  });
  const [isPropertyFound, setIsPropertyFound] = useState(false);

  useEffect(() => {
    if (properties && properties.length > 0) {
      setIsPropertyFound(properties[0].have_you_found_a_property_yet);
      dispatch(initializeForm(properties[0]));
    }
  }, [properties, dispatch]);

  if (isLoading || !properties || properties.length === 0) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <PropertyValuationCard />
      <FoundProperty
        property={properties[0]}
        onPropertyFound={(value) => setIsPropertyFound(value)}
      />
      {isPropertyFound && (
        <>
          <section>
            <Card className="shadow-sm">
              <CardHeader className="bg-white border-bottom">
                <Nav
                  className="nav-primary d-flex justify-content-center align-items-center"
                  pills
                  style={{ gap: "0.5rem" }}
                >
                  {propertyContentTabs.map((tab) => (
                    <NavItem key={tab.id}>
                      <NavLink
                        className={activeContentTab === tab.id ? "active" : ""}
                        onClick={() => setActiveContentTab(tab.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {tab.title}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </CardHeader>
              <CardBody>
                <SecurityPropertyTabContent
                  tabId={activeContentTab}
                  setTabId={setActiveContentTab}
                  propertyData={properties[0]}
                />
              </CardBody>
            </Card>
          </section>
          <hr />
          <section>
            <OtherOccupants />
          </section>
        </>
      )}
      <NoteForProperty property_alias={properties[0].alias} />
    </div>
  );
};

export default SecurityProperty;
