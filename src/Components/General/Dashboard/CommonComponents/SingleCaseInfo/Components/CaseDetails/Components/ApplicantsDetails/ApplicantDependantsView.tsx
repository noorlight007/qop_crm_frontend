import Loading from "@/app/loading";
import { useGetDependantsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { ApplicantDependantsViewModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";

import { useParams } from "next/navigation";
import { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import AddDependantFormModal from "./ApplicantDetailsModals/AddApplicantDependantsModal";

const ApplicantDependantsView: React.FC<ApplicantDependantsViewModalProps> = ({
  applicantAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [isDependantsModalOpen, setIsDependantsModalOpen] = useState(false);

  const { data: applicantDependantsData, isLoading } = useGetDependantsQuery({
    case_alias: casealias,
    applicantDetails_alias: applicantAlias,
  });

  const calcAge = (dob?: string | null) => {
    if (!dob) return "";
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return "";
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    return years >= 0 ? String(years) : "";
  };

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <Card>
      {/* Modal Header */}
      <CardHeader className="d-flex align-items-center justify-content-between gap-1">
        <h2>Applicant Dependants</h2>
        <Button onClick={() => setIsDependantsModalOpen(true)}>
          <TbCirclePlus size={20} className="me-1" />
          Add Dependant
        </Button>
      </CardHeader>

      {/* Modal Body */}
      <CardBody>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr className="text-center text-primary small">
                <th>Serial No</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {applicantDependantsData && applicantDependantsData.length > 0 ? (
                applicantDependantsData.map(
                  (
                    dependant: { name: any; date_of_birth: any },
                    index: number
                  ) => (
                    <tr className="text-center" key={index}>
                      <td>{index + 1}</td>
                      <td>{dependant.name || "-"}</td>
                      <td>{dependant.date_of_birth || "-"}</td>
                      <td>{calcAge(dependant.date_of_birth) || "0"} y</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No dependants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
      {/* Dependants of Applicant Modal */}
      <AddDependantFormModal
        isOpen={isDependantsModalOpen}
        toggle={() => setIsDependantsModalOpen(false)}
        case_alias={casealias as string}
        applicantDetails_alias={applicantAlias as string}
      />
    </Card>
  );
};

export default ApplicantDependantsView;
