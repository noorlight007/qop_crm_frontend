import {
  useCalculateFeesQuery,
  useDownloadFeesSummaryQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Fees/FeesApi";
import { FeesTabContentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/FeeTypes";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { TbDownload } from "react-icons/tb";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import FeeInTable from "./FeesTabContents/FeesInTable";
import FeeOutTable from "./FeesTabContents/FeesOutTable";

export const FeesTabContent: FC<FeesTabContentProps> = ({ tabId }) => {
  const { casealias } = useParams();
  const [shouldDownload, setShouldDownload] = useState(false);
  const { data: feesCaculateData, isLoading: feesCalculateLoading } =
    useCalculateFeesQuery({
      case_alias: casealias,
    });

  const {
    data: feesSummaryBlob,
    isLoading: isFeesSummaryDownloading,
    isSuccess,
    isError,
  } = useDownloadFeesSummaryQuery(
    { case_alias: casealias },
    { skip: !shouldDownload || !casealias },
  );

  useEffect(() => {
    if (isSuccess && feesSummaryBlob && shouldDownload) {
      // Create download link
      const url = window.URL.createObjectURL(feesSummaryBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fees-summary-${casealias}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setShouldDownload(false);
    }
  }, [isSuccess, feesSummaryBlob, shouldDownload, casealias]);

  // Handle errors
  useEffect(() => {
    if (isError && shouldDownload) {
      toast.error("Failed to download fees summary. Please try again.");
      setShouldDownload(false);
    }
  }, [isError, shouldDownload]);

  const handleDownloadFeesSummary = () => {
    if (!casealias) {
      toast.error("Fees summary is not available for download.");
      return;
    }
    setShouldDownload(true);
  };

  const renderTabContent = () => {
    switch (tabId) {
      case "1":
        return <FeeInTable />;
      case "2":
        return <FeeOutTable />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {renderTabContent()}

      <Row>
        <Col>
          <div className="d-flex justify-content-end mt-2">
            <Button className="bg-secondary rounded">
              {isFeesSummaryDownloading ? (
                <>
                  <Spinner size="sm" color="light" className="me-2" />
                  Downloading...
                </>
              ) : (
                <div onClick={handleDownloadFeesSummary}>
                  <TbDownload size={20} className="me-2" />
                  Download Fees Summary
                </div>
              )}
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center gap-2 mt-3 bg-light-primary p-3 rounded">
            <h6 className="mb-0">Total Fees In:</h6>
            <h5>£{feesCaculateData?.total_fees_in || "0.00"}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center gap-2 mt-3 bg-light-info p-3 rounded">
            <h6 className="mb-0">Total Fees Out:</h6>
            <h5>£{feesCaculateData?.total_fees_out || "0.00"}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center gap-2 mt-3 bg-primary p-3 rounded">
            <h6 className="mb-0">Net Fees:</h6>
            <h5>£{feesCaculateData?.net_fees || "0.00"}</h5>
          </div>
        </Col>
      </Row>
    </div>
  );
};
