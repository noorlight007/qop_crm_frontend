import LoadingSpinner from "@/app/loading";
import { useGetAdverseDetailsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { AdverseProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/AdverseTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import AdverseTabContent from "./AdverseTabContent";

export const AdverseTab = () => {
  // Get case alias from URL params
  const params = useParams();
  const { casealias } = params;

  // Fetch applicants data
  const { data: adverseData, isLoading } = useGetAdverseDetailsQuery({
    case_alias: casealias,
  });
  const [basicTab, setBasicTab] = useState<string | null>(null);
  useEffect(() => {
    if (adverseData?.length > 0) {
      setBasicTab(adverseData[0].alias);
    }
  }, [adverseData]);

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  if (!adverseData || adverseData.length === 0) {
    return (
      <Col xxl="12" className="px-5">
        <h1 className="text-center text-warning">No Adverse Data Available</h1>
      </Col>
    );
  }

  return (
    <Col xxl="12" className="px-5">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav className="nav-warning" pills>
              {adverseData?.map((adverse: AdverseProps) => (
                <NavItem key={adverse.alias}>
                  <NavLink
                    className={`${basicTab === adverse.alias ? "active" : ""}`}
                    onClick={() => setBasicTab(adverse.alias || null)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${
                      adverse?.customer?.title
                        ? formatChoiceFieldValue(adverse.customer.title)
                        : ""
                    } ${adverse?.customer?.first_name} ${
                      adverse?.customer?.middle_name
                    } ${adverse?.customer?.last_name}`}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            {basicTab && <AdverseTabContent basicTab={basicTab} />}
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};
