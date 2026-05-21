import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useGetFeesInDetailsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi";
import getCurrencySign from "@/utils/currency";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import AddFeeInModal from "./FeesModals/AddFeeInModal";
import DeleteFeeModal from "./FeesModals/DeleteFeeModal";
import EditFeeInModal from "./FeesModals/EditFeeInModal";
import { formatDate } from "@/utils/dateAndTimeFormatter";

const FeeInTable = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any | null>(null);

  const [page, setPage] = useState<number>(1);
  const { data: feesInDetails, isLoading } = useGetFeesInDetailsQuery({
    case_alias: casealias,
    page,
  });

  useEffect(() => {
    const results = feesInDetails?.results ?? [];
    if (results.length > 0) {
      const formattedFees = results.map((fee: any, index: number) => ({
        alias: fee.alias || "",
        index: index,
        feeInFeeOutId: fee.case?.alias || "",
        caseType: fee.case?.case_category || "",
        propertyName: "List_Fees_In",
        paymentLink: "",
        fee: fee.amount || "",
        feeType: fee.fee_in_type || "",
        method: fee.method || "",
        notes: fee.notes || "",
        feeDate: fee.date_received || "",
      }));
      setFeesIn(formattedFees);
    } else {
      setFeesIn([]);
    }
  }, [feesInDetails]);

  const [feesIn, setFeesIn] = useState<any[]>([]);

  const totalCount = feesInDetails?.count ?? 0;
  const pageSize = feesInDetails?.results?.length ?? feesIn.length ?? 0;
  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;

  const feeTypes = [
    { title: "Broker/Commitment Fee", value: "BROKER_COMMITMENT_FEE" },
    { title: "Procuration Fee", value: "PROCURATION_FEE" },
    { title: "Mortgage OfferFee", value: "MORTGAGE_OFFER_FEE" },
    { title: "BrokerFee", value: "BROKER_FEE" },
    { title: "Other", value: "OTHER" },
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
    // rely on server-side fetch after mutation; show first page where new entries usually appear
    setPage(1);
    toggleModal();
  };

  const handleEditFee = (_updatedFee: any) => {
    // rely on server-side fetch after mutation; keep user on current view
    setPage(1);
    setIsEditModalOpen(false);
  };
  const handleFeeDelete = (fee: any) => {
    setSelectedFee(fee);
    setIsDeleteModalOpen(true);
  };

  const handleFeeEdit = (fee: any) => {
    setSelectedFee(fee);
    setIsEditModalOpen(true);
  };

  if (isLoading)
    return (
      <div>
        <LoadingGrow />
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
            disabled={session?.user?.role === "APPLICANT"}
          >
            <i className="fa-solid fa-circle-plus"></i>
            Add New Fee In
          </Button>
        </Col>
      </Row>

      <Row>
        <Col sm={12} className="form-group" id="FeeIn">
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
                  <th className="text-center" style={{ width: "15%" }}>
                    Date Received
                  </th>{" "}
                  <th className="text-center" style={{ width: "25%" }}>
                    Notes
                  </th>
                  <th className="text-center" style={{ width: "5%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {feesIn.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No fees available
                    </td>
                  </tr>
                ) : (
                  feesIn.map((feeIn, index) => (
                    <tr
                      key={feeIn.alias || index}
                      className="feeTableRow feeRowIn"
                    >
                      <td className="text-center align-middle">
                        <span className="fw-bold">{index + 1}</span>
                      </td>
                      <td className="text-center align-middle">
                        {getCurrencySign()}
                        {feeIn.fee || "0.00"}
                      </td>
                      <td className="text-center align-middle">
                        {feeTypes.find((type) => type.value === feeIn.feeType)
                          ?.title || "-"}
                      </td>
                      <td className="text-center align-middle">
                        {methods.find((method) => method.value === feeIn.method)
                          ?.title || "-"}
                      </td>
                      <td className="text-center align-middle">
                        {formatDate(feeIn.feeDate) || "-"}
                      </td>
                      <td className="text-center align-middle">
                        {feeIn.notes || "-"}
                      </td>
                      <td className="text-center align-middle">
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <Button
                            color="primary"
                            size="sm"
                            outline
                            onClick={() => handleFeeEdit(feeIn)}
                          >
                            <i className="fa fa-edit"></i>
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            outline
                            className="removeFee"
                            onClick={() => handleFeeDelete(feeIn)}
                          >
                            <i className="fa fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col
          sm={12}
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            Page {page} of {totalPages} (Total {totalCount})
          </div>
          <div>
            <Button
              color="secondary"
              size="sm"
              outline
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <i className="fa fa-chevron-left"></i> Prev
            </Button>
            <Button
              color="secondary"
              size="sm"
              outline
              className="ms-2"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Next <i className="fa fa-chevron-right"></i>
            </Button>
          </div>
        </Col>
      </Row>
      {/* Fee Modal can be added here */}
      <AddFeeInModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSubmit={handleAddFee}
        feeTypes={feeTypes}
        methods={methods}
        caseAlias={casealias}
      />
      <EditFeeInModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(false)}
        onSubmit={handleEditFee}
        feeTypes={feeTypes}
        methods={methods}
        caseAlias={casealias}
        initialData={selectedFee}
      />

      <DeleteFeeModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        feeData={selectedFee}
      />
    </>
  );
};

export default FeeInTable;
