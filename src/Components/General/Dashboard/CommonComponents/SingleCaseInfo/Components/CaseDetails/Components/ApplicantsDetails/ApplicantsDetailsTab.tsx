import LoadingSpinner from "@/app/loading";
import { useGetApplicantsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { ApplicantProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";
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
import ApplicantsDetailsTabContent from "./ApplicantsDetailsTabContent";

export const ApplicantsDetailsTab = () => {
  const [basicTab, setBasicTab] = useState<string | null>(null);

  // Get case alias from URL params
  const params = useParams();
  const { casealias } = params;

  // Fetch applicants data
  const { data: applicantsData, isLoading } = useGetApplicantsQuery({
    case_alias: casealias,
  });

  // Set the first applicant's alias as default when data is available
  useEffect(() => {
    if (applicantsData?.length > 0 && !basicTab) {
      setBasicTab(applicantsData[0]?.alias || null);
    }
  }, [applicantsData, basicTab]);

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <Col xxl="12" className="px-5">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav className="nav-warning" pills>
              {applicantsData?.map((applicantData: ApplicantProps) => (
                <NavItem key={applicantData.alias}>
                  <NavLink
                    className={`${
                      basicTab === applicantData.alias ? "active" : ""
                    }`}
                    onClick={() => setBasicTab(applicantData.alias || null)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${
                      applicantData?.applicant?.title
                        ? applicantData?.applicant?.title[0].toUpperCase() +
                          applicantData?.applicant?.title
                            .slice(1)
                            .toLowerCase() +
                          ""
                        : ""
                    } ${applicantData?.applicant?.first_name} ${
                      applicantData?.applicant?.middle_name
                    } ${applicantData?.applicant?.last_name}`}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            <ApplicantsDetailsTabContent
              applicantsData={applicantsData}
              basicTab={basicTab || ""}
            />
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};
