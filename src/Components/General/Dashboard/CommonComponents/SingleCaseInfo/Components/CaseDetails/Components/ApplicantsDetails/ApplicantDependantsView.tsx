import Loading from "@/app/loading";
import {
  useAddDependantsMutation,
  useGetDependantsQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { ApplicantDependantsViewModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";

import { useParams } from "next/navigation";
import { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import AddDependantFormModal from "./ApplicantDetailsModals/AddApplicantDependantsModal";

const ApplicantDependantsView: React.FC<ApplicantDependantsViewModalProps> = ({
  applicantAlias,
  applicantsData,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [isDependantsModalOpen, setIsDependantsModalOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const { data: applicantDependantsData, isLoading } = useGetDependantsQuery({
    case_alias: casealias,
    applicantDetails_alias: applicantAlias,
  });

  // Get first applicant's dependants
  const firstApplicant = applicantsData?.[0];
  const { data: firstApplicantDependants } = useGetDependantsQuery(
    firstApplicant?.alias && firstApplicant?.alias !== applicantAlias
      ? {
          case_alias: casealias,
          applicantDetails_alias: firstApplicant.alias,
        }
      : { case_alias: "", applicantDetails_alias: "" }
  );

  const [addDependants] = useAddDependantsMutation();

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

  const handleCopyDependants = async () => {
    try {
      setIsCopying(true);

      if (!firstApplicant || firstApplicant.alias === applicantAlias) {
        toast.warning("Cannot copy from the same applicant");
        return;
      }

      if (!firstApplicantDependants || firstApplicantDependants.length === 0) {
        toast.info("First applicant has no dependants to copy");
        return;
      }

      // Copy each dependant to current applicant
      for (const dependant of firstApplicantDependants) {
        await addDependants({
          case_alias: casealias,
          applicantDetails_alias: applicantAlias,
          dependantsInfo: {
            name: dependant.name,
            date_of_birth: dependant.date_of_birth,
          },
        });
      }

      toast.success(
        `Successfully copied ${firstApplicantDependants.length} dependant(s)`
      );
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to copy dependants";
      toast.error(errorMessage);
    } finally {
      setIsCopying(false);
    }
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
      <CardHeader className="d-flex align-items-center justify-content-between">
        <h2>Applicant Dependants</h2>
        <div className="d-flex justify-content-end gap-2">
          <Button
            color="info"
            outline
            onClick={handleCopyDependants}
            disabled={
              isCopying || !applicantsData || applicantsData.length <= 1
            }
            title={
              !applicantsData || applicantsData.length <= 1
                ? "Only available for non-first applicants"
                : ""
            }
          >
            <i className="fa fa-copy me-2"></i>
            Copy Dependants from first Applicant
          </Button>
          <Button onClick={() => setIsDependantsModalOpen(true)}>
            <TbCirclePlus size={20} className="me-1" />
            Add Dependant
          </Button>
        </div>
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
