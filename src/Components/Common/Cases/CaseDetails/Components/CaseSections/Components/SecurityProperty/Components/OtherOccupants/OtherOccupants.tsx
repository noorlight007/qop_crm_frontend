import { useGetOtherOccupantsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/OtherOccupantsApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { OtherOccupantsTypes } from "@/Types/Common/Cases/CaseDetails/CaseSections/OtherOccupantsTypes";
import { formatDate } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue, { calculateAge } from "@/utils/formatters";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import { Button, Spinner, Table } from "reactstrap";
import { useIsLocked } from "../../context/EditableContext";
import AddOtherOccupantModal from "./Modals/AddOtherOccupantModal";
import DeleteOtherOccupantModal from "./Modals/DeleteOtherOccupantModal";
import UpdateOtherOccupantModal from "./Modals/UpdateOtherOccupantModal";

export const DependantsTable: React.FC = () => {
  const { casealias } = useParams();
  const isLocked = useIsLocked();
  const [isAddOtherOccupantModalOpen, setIsAddOtherOccupantModalOpen] =
    useState(false);
  const [isUpdateOtherOccupantModalOpen, setIsUpdateOtherOccupantModalOpen] =
    useState(false);
  const [isDeleteOtherOccupantModalOpen, setIsDeleteOtherOccupantModalOpen] =
    useState(false);
  const [selectedOtherOccupant, setSelectedOtherOccupant] =
    useState<OtherOccupantsTypes | null>(null);

  const { data: OtherOccupantsData, isLoading } = useGetOtherOccupantsQuery({
    case_alias: casealias,
  });

  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  return (
    <div style={{ position: "relative" }}>
      {isLocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            cursor: "not-allowed",
            backgroundColor: "rgba(0,0,0,0.0001)",
          }}
          title="This case is not editable"
        />
      )}
      <div
        style={{
          opacity: isLocked ? 0.45 : 1,
          pointerEvents: isLocked ? "none" : "auto",
          transition: "opacity 0.2s ease",
          userSelect: isLocked ? "none" : "auto",
        }}
      >
        <div className=" mb-4">
          <div className="d-flex justify-content-between my-2">
            <h3>Other Occupants</h3>
            <Button
              color="primary"
              onClick={() => setIsAddOtherOccupantModalOpen(true)}
            >
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
                    <td>{formatChoiceFieldValue(o.relationship) || "-"}</td>
                    <td>{formatDate(o.created_at)}</td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedOtherOccupant(o || null);
                            setIsUpdateOtherOccupantModalOpen(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setSelectedOtherOccupant(o || null);
                            setIsDeleteOtherOccupantModalOpen(true);
                          }}
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
          {/* Modals for Add, Update, Delete would go here */}
          <AddOtherOccupantModal
            isOpen={isAddOtherOccupantModalOpen}
            toggle={() =>
              setIsAddOtherOccupantModalOpen(!isAddOtherOccupantModalOpen)
            }
          />
          <UpdateOtherOccupantModal
            isOpen={isUpdateOtherOccupantModalOpen}
            toggle={() =>
              setIsUpdateOtherOccupantModalOpen(!isUpdateOtherOccupantModalOpen)
            }
            selectedOccupant={selectedOtherOccupant || undefined}
          />
          <DeleteOtherOccupantModal
            isOpen={isDeleteOtherOccupantModalOpen}
            toggle={() =>
              setIsDeleteOtherOccupantModalOpen(!isDeleteOtherOccupantModalOpen)
            }
            selectedOccupant={selectedOtherOccupant || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default DependantsTable;
