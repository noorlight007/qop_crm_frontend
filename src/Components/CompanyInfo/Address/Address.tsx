import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { ContactInfoProps } from "@/Types/CompanyInfo/CompanyInfoTypes";
import { countries } from "@/utils/Countries";
import { useState } from "react";
import { Edit } from "react-feather";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import UpdateAddressModal from "./Modals/UpdateAddressModal";

const Address: React.FC<ContactInfoProps> = ({ companyInfo, isLoading }) => {
  const [isUpdateAddressModalOpen, setIsUpdateAddressModalOpen] =
    useState(false);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="card-title">Address</h4>
        <Button
          color="primary"
          size="sm"
          onClick={() => setIsUpdateAddressModalOpen(true)}
        >
          <Edit size={14} className="me-1" />
          Edit
        </Button>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="text-center py-5">
            <LoadingGrow />
          </div>
        ) : companyInfo ? (
          <div className="row gy-3">
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3 bg-light-primary">
                <small className="text-muted">House Name / Number</small>
                <div className="fw-semibold">
                  {companyInfo?.address?.house_name_or_number || "N/A"}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3 bg-light-primary">
                <small className="text-muted">Address Line 1</small>
                <div className="fw-semibold">
                  {companyInfo?.address?.address_line_1 || "N/A"}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3 rounded-3 bg-light-primary">
                <small className="text-muted">City</small>
                <div className="fw-semibold">
                  {companyInfo?.address?.city || "N/A"}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3 rounded-3 bg-light-primary">
                <small className="text-muted">Postcode</small>
                <div className="fw-semibold">
                  {companyInfo?.address?.postcode || "N/A"}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3 rounded-3 bg-light-primary">
                <small className="text-muted">Country</small>
                <div className="fw-semibold">
                  {countries.find(
                    (c) => c.code === companyInfo?.address?.country,
                  )?.name ||
                    companyInfo?.address?.country ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted">
            No address information available.
          </p>
        )}
      </CardBody>
      <UpdateAddressModal
        isOpen={isUpdateAddressModalOpen}
        toggle={() => setIsUpdateAddressModalOpen(false)}
        companyInfo={companyInfo}
      />
    </Card>
  );
};

export default Address;
