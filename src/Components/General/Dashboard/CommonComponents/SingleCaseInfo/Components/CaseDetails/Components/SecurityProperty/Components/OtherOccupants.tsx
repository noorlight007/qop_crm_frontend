import { useGetOtherOccupantsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/OtherOccupantsApi";
import { OtherOccupantsTypes } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/OtherOccupantsTypes";
import { formatDateToDMY } from "@/utils/dateAndTimeFormatter";
import { calculateAge } from "@/utils/formatters";
import { useParams } from "next/navigation";
import React from "react";
import { TbCirclePlus } from "react-icons/tb";
import { Button, Spinner, Table } from "reactstrap";

// const calcAge = (dob?: string | null) => {
//   if (!dob) return "";
//   const birth = new Date(dob);
//   if (isNaN(birth.getTime())) return "";
//   const today = new Date();
//   let years = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
//     years--;
//   }
//   return years >= 0 ? `${years}` : "";
// };

export const DependantsTable: React.FC = () => {
  const { casealias } = useParams();
  const { data: OtherOccupantsData, isLoading } = useGetOtherOccupantsQuery({
    case_alias: casealias,
  });
  return (
    <div className=" mb-4">
      <div className="d-flex justify-content-end my-2">
        <Button color="primary">
          <TbCirclePlus className="me-1" size={18} />
          Add Other Occupant
        </Button>
      </div>
      <Table responsive bordered hover>
        <thead className="table-light text-center small">
          <tr>
            <th style={{ width: 60 }}>#</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>Relationship</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                <Spinner size="sm" color="primary" className="me-2" />
                Loading...
              </td>
            </tr>
          ) : OtherOccupantsData && OtherOccupantsData.length > 0 ? (
            OtherOccupantsData.map((o: OtherOccupantsTypes, i: number) => (
              <tr key={o.alias || i} className="text-center">
                <td>{i + 1}</td>
                <td className="text-start">{o.full_name || "-"}</td>
                <td>{o.date_of_birth || "-"}</td>
                <td>
                  {calculateAge(o.date_of_birth)
                    ? `${calculateAge(o.date_of_birth)} y`
                    : "-"}
                </td>
                <td>{o.relationship || "-"}</td>
                <td>{formatDateToDMY(o.created_at)}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DependantsTable;
