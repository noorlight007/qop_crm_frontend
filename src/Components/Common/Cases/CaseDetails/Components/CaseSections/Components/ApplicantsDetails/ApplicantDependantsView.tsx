import Loading from "@/app/loading";

import {
  useAddDependantsMutation,
  useGetDependantsQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ApplicantsDetails/ApplicantsDetailsApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import {
  ApplicantDependantsProps,
  ApplicantDependantsViewModalProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/ApplicantsDetailsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import AddDependantFormModal from "./ApplicantDetailsModals/AddApplicantDependantsModal";
import DeleteApplicantDependantModal from "./ApplicantDetailsModals/DeleteApplicantDependantModal";
import { formatDate } from "@/utils/dateAndTimeFormatter";

const ApplicantDependantsView: React.FC<ApplicantDependantsViewModalProps> = ({
  applicantAlias,
  applicantsData,
}) => {
  const params = useParams();
  const { data: session } = useSession();
  const { casealias } = params;
  const [isDependantsModalOpen, setIsDependantsModalOpen] = useState(false);
  const [isDependantDeleteModalOpen, setIsDependantDeleteModalOpen] = useState<
    string | null
  >(null);
  const [isCopying, setIsCopying] = useState(false);

  const { data: applicantDependantsData, isLoading } = useGetDependantsQuery({
    case_alias: casealias,
    applicantDetails_alias: applicantAlias,
  });

  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  // Get first applicant's dependants
  const firstApplicant = applicantsData?.[0];
  const shouldFetchFirstApplicantDependants =
    firstApplicant?.alias && firstApplicant?.alias !== applicantAlias;

  const { data: firstApplicantDependants } = useGetDependantsQuery(
    shouldFetchFirstApplicantDependants
      ? {
          case_alias: casealias,
          applicantDetails_alias: firstApplicant.alias,
        }
      : null,
    { skip: !shouldFetchFirstApplicantDependants },
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
            relationship: dependant.relationship,
            other_relationship: dependant.other_relationship,
            date_of_birth: dependant.date_of_birth,
          },
        });
      }

      toast.success(
        `Successfully copied ${firstApplicantDependants.length} dependant(s)`,
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
          {applicantsData &&
            applicantsData.length > 0 &&
            applicantsData[0]?.alias !== applicantAlias && (
              <Button
                color="info"
                outline
                onClick={handleCopyDependants}
                disabled={isCopying}
                title="Copy dependants from the first applicant"
              >
                <i className="fa fa-copy me-2"></i>
                Copy Dependants from first Applicant
              </Button>
            )}
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
                <th>Relationship</th>
                <th>Date of Birth</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicantDependantsData && applicantDependantsData.length > 0 ? (
                applicantDependantsData.map(
                  (dependant: ApplicantDependantsProps, index: number) => (
                    <tr className="text-center" key={dependant.id}>
                      <td>{index + 1}</td>
                      <td>{dependant.name || "-"}</td>
                      <td>
                        {dependant.relationship === "OTHER"
                          ? dependant.other_relationship || "-"
                          : formatChoiceFieldValue(dependant.relationship) ||
                            "-"}
                      </td>
                      <td>{formatDate(dependant.date_of_birth) || "-"}</td>
                      <td>{calcAge(dependant.date_of_birth) || "0"} y</td>

                      <td>
                        <Button
                          color="danger"
                          outline
                          size="sm"
                          onClick={() =>
                            setIsDependantDeleteModalOpen(
                              dependant?.id != null
                                ? String(dependant.id)
                                : null,
                            )
                          }
                          title="Delete dependant"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
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
      {/* Delete Dependant Modal */}
      <DeleteApplicantDependantModal
        isOpen={Boolean(isDependantDeleteModalOpen)}
        onClose={() => setIsDependantDeleteModalOpen(null)}
        applicantAlias={applicantAlias as string}
        dependantId={isDependantDeleteModalOpen ?? ""}
      />
    </Card>
  );
};

export default ApplicantDependantsView;
