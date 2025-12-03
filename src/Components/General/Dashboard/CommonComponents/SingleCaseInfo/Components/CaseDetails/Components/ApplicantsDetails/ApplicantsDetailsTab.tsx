import LoadingSpinner from "@/app/loading";
import { useGetApplicantsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { ApplicantProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
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

  // Function to validate if an applicant has all required fields filled
  const isApplicantValid = (applicant: ApplicantProps): boolean => {
    const requiredFields = [
      applicant.anticipated_retirement_age,
      applicant.mobile_phone,
      applicant.postcode,
      applicant.house_number_or_name,
      applicant.address_line1,
      applicant.city,
      applicant.country,
      applicant.effective_from,
      applicant.residential_status,
    ];

    return requiredFields.every((field) => {
      if (typeof field === "number") {
        return field !== null && field !== undefined && field > 0;
      }
      return field !== null && field !== undefined && field !== "";
    });
  };

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
    <Col xxl="12" className="px-1">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav className="nav-primary" pills>
              {applicantsData?.map(
                (applicantData: ApplicantProps, index: number) => {
                  const isPreviousValid =
                    index === 0 || isApplicantValid(applicantsData[index - 1]);
                  const isCurrentValid = isApplicantValid(applicantData);

                  return (
                    <NavItem key={applicantData.alias}>
                      <NavLink
                        className={`${
                          basicTab === applicantData.alias ? "active" : ""
                        } ${!isPreviousValid ? "disabled" : ""}`}
                        onClick={() => {
                          if (isPreviousValid) {
                            setBasicTab(applicantData.alias || null);
                          }
                        }}
                        style={{
                          cursor: isPreviousValid ? "pointer" : "not-allowed",
                          opacity: isPreviousValid ? 1 : 0.5,
                        }}
                        title={
                          !isPreviousValid
                            ? "Please complete the previous applicant's required fields first"
                            : isCurrentValid
                            ? "Applicant details completed"
                            : "Required fields incomplete"
                        }
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
                        {!isCurrentValid && isPreviousValid && (
                          <span className="text-danger ms-1">*</span>
                        )}
                        {isCurrentValid && (
                          <FaCheckCircle className="ms-1" size={16} />
                        )}
                      </NavLink>
                    </NavItem>
                  );
                }
              )}
            </Nav>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            <ApplicantsDetailsTabContent
              applicantsData={applicantsData}
              basicTab={basicTab || ""}
              onTabChange={setBasicTab}
              isApplicantValid={isApplicantValid}
            />
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};
