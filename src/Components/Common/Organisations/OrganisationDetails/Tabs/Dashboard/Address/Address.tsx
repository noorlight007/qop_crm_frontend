import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { SingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import { countries } from "@/utils/Countries";
import { useState } from "react";
import { Edit } from "react-feather";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import UpdateOrganisationAddressModal from "../../../Modals/UpdateOrganisationAddressModal";

interface AddressProps {
  singleOrgInfo?: SingleOrganisationProps;
  isLoading?: boolean;
}
const Address: React.FC<AddressProps> = ({ singleOrgInfo, isLoading }) => {
  const [addressUpdateModalIsOpen, setaddressUpdateModalIsOpen] =
    useState(false);
  const address = singleOrgInfo?.address;

  {
    isLoading && (
      <div className="d-flex align-items-center gap-2 text-muted">
        <LoadingGrow />
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardBody className="p-4 bg-white">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <CardTitle tag="h5" className="mb-0">
            Address
          </CardTitle>
          <Button
            color="primary"
            size="sm"
            outline
            onClick={() => setaddressUpdateModalIsOpen(true)}
          >
            <Edit size={16} className="me-1" />
            Edit
          </Button>
        </div>

        <div className="row gy-3">
          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 bg-light-primary">
              <small className="text-muted">House Name / Number</small>
              <div className="fw-semibold">
                {address?.house_name_or_number || "N/A"}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 bg-light-primary">
              <small className="text-muted">Address Line 1</small>
              <div className="fw-semibold">
                {address?.address_line_1 || "N/A"}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 bg-light-primary">
              <small className="text-muted">City</small>
              <div className="fw-semibold">{address?.city || "N/A"}</div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 bg-light-primary">
              <small className="text-muted">Postcode</small>
              <div className="fw-semibold">{address?.postcode || "N/A"}</div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 bg-light-primary">
              <small className="text-muted">Country</small>
              <div className="fw-semibold">
                {countries.find((c) => c.code === address?.country)?.name ||
                  address?.country ||
                  "N/A"}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <UpdateOrganisationAddressModal
        isOpen={addressUpdateModalIsOpen}
        toggle={() => setaddressUpdateModalIsOpen(false)}
        slug={singleOrgInfo?.organization?.slug ?? singleOrgInfo?.slug}
        organisationData={singleOrgInfo}
      />
    </Card>
  );
};

export default Address;
