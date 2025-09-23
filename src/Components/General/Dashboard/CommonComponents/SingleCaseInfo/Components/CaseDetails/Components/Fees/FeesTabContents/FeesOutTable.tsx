import LoadingSpinner from "@/app/loading";
import { useGetFeesOutDetailsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Fees/FeesApi";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import AddFeeOutModal from "./FeesModals/AddFeeOutModal";

const FeeOutTable = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const { data: feesOutDetails, isLoading } = useGetFeesOutDetailsQuery({
    case_alias: casealias,
  });

  useEffect(() => {
    if (feesOutDetails?.length > 0) {
      const formattedFees = feesOutDetails.map((fee: any, index: number) => ({
        id: fee.alias || "",
        index: index,
        isDeleted: false,
        feeInFeeOutId: fee.case?.alias || "",
        caseType: fee.case?.case_category || "",
        propertyName: "List_Fees_Out",
        paymentLink: "",
        fee: fee.amount || "",
        feeType: fee.fee_out_type || "",
        method: fee.method || "",
        notes: fee.notes || "",
        feeDate: fee.date_paid_out || "",
      }));
      setFees(formattedFees);
    }
  }, [feesOutDetails]);

  const [fees, setFees] = useState([
    {
      id: "",
      index: 0,
      isDeleted: false,
      feeInFeeOutId: "",
      caseType: "",
      propertyName: "List_Fees_Out",
      paymentLink: "",
      fee: "",
      feeType: "",
      method: "",
      notes: "",
      feeDate: "",
    },
  ]);

  const feeTypes = [
    { title: "Unknown", value: "UNKNOWN" },
    {
      title: "Commission (Proc Fee Share)",
      value: "COMMISSION_PROC_FEE_SHARE",
    },
  ];

  const methods = [
    { title: "Credit / Debit Card", value: "CREDIT_DEBIT_CARD" },
    { title: "Bacs", value: "BACS" },
    { title: "Cheque", value: "CHEQUE" },
    { title: "Cash", value: "CASH" },
    { title: "Online", value: "ONLINE" },
    { title: "Other", value: "OTHER" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleAddFee = (newFee: any) => {
    setFees([...fees, { ...newFee, index: fees.length }]);
    toggleModal();
  };

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  return (
    <>
      <Row className="mb-3">
        <Col sm={12} className="d-flex justify-content-end align-items-center">
          <Button
            color="primary"
            className="addFee d-flex align-items-center gap-2"
            onClick={toggleModal}
            disabled={session?.user?.user_type === "CLIENT"}
          >
            Add New Fee Out
            <i className="fa-solid fa-circle-plus"></i>
          </Button>
        </Col>
      </Row>

      <AddFeeOutModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSubmit={handleAddFee}
        feeTypes={feeTypes}
        methods={methods}
        caseAlias={casealias}
      />
      <Row>
        <Col sm={12} className="form-group" id="FeeOut">
          <div className="table-responsive shadow-sm rounded">
            <Table hover bordered className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-center" style={{ width: "5%" }}>
                    #
                  </th>
                  <th className="text-center" style={{ width: "20%" }}>
                    Amount
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Fee Type
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Method
                  </th>
                  <th className="text-center" style={{ width: "25%" }}>
                    Notes
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Date Paid Out
                  </th>
                  <th className="text-center" style={{ width: "5%" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {feesOutDetails?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No fees available
                    </td>
                  </tr>
                ) : (
                  fees.map(
                    (fee, index) =>
                      !fee.isDeleted && (
                        <tr
                          key={fee.id || index}
                          className="feeTableRow feeRowOut"
                        >
                          <td className="text-center align-middle">
                            <span className="fw-bold">{index + 1}</span>
                          </td>
                          <td className="text-center align-middle">
                            £{fee.fee || "0.00"}
                          </td>
                          <td className="text-center align-middle">
                            {feeTypes.find((type) => type.value === fee.feeType)
                              ?.title || "-"}
                          </td>
                          <td className="text-center align-middle">
                            {methods.find(
                              (method) => method.value === fee.method
                            )?.title || "-"}
                          </td>
                          <td className="text-center align-middle">
                            {fee.notes || "-"}
                          </td>
                          <td className="text-center align-middle">
                            {fee.feeDate || "-"}
                          </td>
                          <td className="text-center align-middle">
                            <Button
                              color="danger"
                              size="sm"
                              outline
                              className="removeFee"
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      )
                  )
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default FeeOutTable;
