import LoadingGrow from '@/CommonComponent/LoadingGrow/LoadingGrow';
import {
  useDownloadInvoiceMutation,
  useGetFeesOutDetailsQuery,
} from '@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi';
import getCurrencySign from '@/utils/currency';
import { formatDate } from '@/utils/dateAndTimeFormatter';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Button, Col, Row, Table } from 'reactstrap';
import AddFeeOutModal from './FeesModals/AddFeeOutModal';
import DeleteFeeModal from './FeesModals/DeleteFeeModal';
import EditFeeOutModal from './FeesModals/EditFeeOutModal';

const FeeOutTable = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any | null>(null);

  const [page, setPage] = useState<number>(1);
  const { data: feesOutDetails, isLoading } = useGetFeesOutDetailsQuery({
    case_alias: casealias,
    page,
  });

  const [downloadInvoice] = useDownloadInvoiceMutation();
  const [downloadingAlias, setDownloadingAlias] = useState<string | null>(null);

  const handleInvoiceDownload = async (fee: any) => {
    if (!fee?.alias) {
      toast.error('Unable to download invoice: fee not found.');
      return;
    }

    setDownloadingAlias(fee.alias);
    try {
      const blob = await downloadInvoice({
        case_alias: casealias,
        fee_alias: fee.alias,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fee-invoice.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingAlias(null);
    }
  };

  useEffect(() => {
    const results = feesOutDetails?.results ?? [];
    if (results.length > 0) {
      const formattedFees = results.map((fee: any, index: number) => ({
        alias: fee.alias || '',
        index: index,
        caseId: fee.case?.name || '',
        feeInFeeOutId: fee.case?.alias || '',
        caseType: fee.case?.case_category || '',
        propertyName: 'List_Fees_Out',
        paymentLink: '',
        fee: fee.amount || '',
        feeType: fee.fee_out_type || '',
        method: fee.method || '',
        notes: fee.notes || '',
        feeDate: fee.date_paid_out || '',
      }));
      setFeesOut(formattedFees);
    } else {
      setFeesOut([]);
    }
  }, [feesOutDetails]);

  const [feesOut, setFeesOut] = useState<any[]>([]);

  const totalCount = feesOutDetails?.count ?? 0;
  const pageSize = feesOutDetails?.results?.length ?? feesOut.length ?? 0;
  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;

  const feeTypes = [
    { title: 'Procuration Fee', value: 'PROCURATION_FEE' },
    {
      title: 'Broker Fee',
      value: 'BROKER_FEE',
    },
    {
      title: 'Other',
      value: 'OTHER',
    },
  ];

  const methods = [
    { title: 'Credit / Debit Card', value: 'CREDIT_DEBIT_CARD' },
    { title: 'Bacs', value: 'BACS' },
    { title: 'Cheque', value: 'CHEQUE' },
    { title: 'Cash', value: 'CASH' },
    { title: 'Online', value: 'ONLINE' },
    { title: 'Other', value: 'OTHER' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleAddFee = (newFee: any) => {
    setPage(1);
    toggleModal();
  };

  const handleFeeEdit = (fee: any) => {
    setSelectedFee(fee);
    setIsEditModalOpen(true);
  };

  const handleEditFee = (_updatedFee: any) => {
    setPage(1);
    setIsEditModalOpen(false);
  };
  const handleFeeDelete = (fee: any) => {
    setSelectedFee(fee);
    setIsDeleteModalOpen(true);
  };

  if (isLoading)
    return (
      <div>
        <LoadingGrow />
      </div>
    );
  return (
    <>
      <Row className='mb-3'>
        <Col sm={12} className='d-flex justify-content-end align-items-center'>
          <Button
            color='primary'
            className='addFee d-flex align-items-center gap-2'
            onClick={toggleModal}
            disabled={session?.user?.role === 'APPLICANT'}
          >
            <i className='fa-solid fa-circle-plus'></i>
            Add New Fee Out
          </Button>
        </Col>
      </Row>

      <Row>
        <Col sm={12} className='form-group' id='FeeOut'>
          <div className='table-responsive shadow-sm rounded'>
            <Table hover bordered className='mb-0'>
              <thead className='bg-light'>
                <tr>
                  <th className='text-center' style={{ width: '5%' }}>
                    #
                  </th>
                  <th className='text-center' style={{ width: '20%' }}>
                    Amount
                  </th>
                  <th className='text-center' style={{ width: '15%' }}>
                    Fee Type
                  </th>
                  <th className='text-center' style={{ width: '15%' }}>
                    Method
                  </th>
                  <th className='text-center' style={{ width: '15%' }}>
                    Date Paid Out
                  </th>
                  <th className='text-center' style={{ width: '25%' }}>
                    Notes
                  </th>

                  <th className='text-center' style={{ width: '5%' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {feesOut.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='text-center py-4'>
                      No fees available
                    </td>
                  </tr>
                ) : (
                  feesOut.map((feeOut, index) => (
                    <tr
                      key={feeOut.alias || index}
                      className='feeTableRow feeRowOut'
                    >
                      <td className='text-center align-middle'>
                        <span className='fw-bold'>{index + 1}</span>
                      </td>
                      <td className='text-center align-middle'>
                        {getCurrencySign()}
                        {feeOut.fee || '0.00'}
                      </td>
                      <td className='text-center align-middle'>
                        {feeTypes.find((type) => type.value === feeOut.feeType)
                          ?.title || '-'}
                      </td>
                      <td className='text-center align-middle'>
                        {methods.find(
                          (method) => method.value === feeOut.method,
                        )?.title || '-'}
                      </td>
                      <td className='text-center align-middle'>
                        {formatDate(feeOut.feeDate) || '-'}
                      </td>{' '}
                      <td className='text-center align-middle'>
                        {feeOut.notes || '-'}
                      </td>
                      <td className='text-center align-middle'>
                        <div className='d-flex justify-content-center gap-2'>
                          <Button
                            color='secondary'
                            title='Download Invoice'
                            size='sm'
                            outline
                            disabled={session?.user?.role === 'APPLICANT'}
                            onClick={() => handleInvoiceDownload(feeOut)}
                          >
                            {downloadingAlias === feeOut.alias ? (
                              <span className='spinner-border spinner-border-sm'></span>
                            ) : (
                              <FaDownload />
                            )}
                          </Button>
                          <Button
                            color='primary'
                            size='sm'
                            outline
                            disabled={session?.user?.role === 'APPLICANT'}
                            onClick={() => handleFeeEdit(feeOut)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            color='danger'
                            size='sm'
                            outline
                            className='removeFee'
                            disabled={session?.user?.role === 'APPLICANT'}
                            onClick={() => handleFeeDelete(feeOut)}
                          >
                            <FaTrash />
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

      <Row className='mt-3'>
        <Col
          sm={12}
          className='d-flex justify-content-between align-items-center'
        >
          <div>
            Page {page} of {totalPages} (Total {totalCount})
          </div>
          <div>
            <Button
              color='secondary'
              size='sm'
              outline
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <i className='fa fa-chevron-left'></i> Prev
            </Button>
            <Button
              color='secondary'
              size='sm'
              outline
              className='ms-2'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Next <i className='fa fa-chevron-right'></i>
            </Button>
          </div>
        </Col>
      </Row>

      {/*  Fee Modal can be added here */}
      <AddFeeOutModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSubmit={handleAddFee}
        feeTypes={feeTypes}
        methods={methods}
        caseAlias={casealias}
      />
      <EditFeeOutModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(!isEditModalOpen)}
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

export default FeeOutTable;
