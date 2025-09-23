import Loading from "@/app/loading";
import { useGetDependantsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import { ApplicantDependantsViewModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";

import { useParams } from "next/navigation";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ApplicantDependantsViewModal: React.FC<
  ApplicantDependantsViewModalProps
> = ({ isOpen, toggle, applicantAlias }) => {
  const params = useParams();
  const { casealias } = params;
  const { data: applicantDependantsData, isLoading } = useGetDependantsQuery({
    case_alias: casealias,
    applicantDetails_alias: applicantAlias,
  });

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      {/* Modal Header */}
      <ModalHeader toggle={toggle}>
        <h2>Applicant Dependants</h2>
      </ModalHeader>

      {/* Modal Body */}
      <ModalBody>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="text-primary">Serial No</th>
                <th className="text-primary">Name</th>
                <th className="text-primary">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {applicantDependantsData?.length > 0 ? (
                applicantDependantsData.map(
                  (
                    dependant: { name: any; date_of_birth: any },
                    index: number
                  ) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{dependant.name || "-"}</td>
                      <td>{dependant.date_of_birth || "-"}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    No dependants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ModalBody>

      {/* Modal Footer */}
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ApplicantDependantsViewModal;
