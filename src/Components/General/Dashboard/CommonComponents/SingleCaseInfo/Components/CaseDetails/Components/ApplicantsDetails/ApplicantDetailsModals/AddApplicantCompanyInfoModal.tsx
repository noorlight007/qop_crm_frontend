import LoadingSpinner from "@/app/loading";
import {
  useAddCompanyDetailsMutation,
  useGetCompanyDetailsQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantsDetailsApi";
import {
  AddCompanyDetailsFormModalProps,
  ApplicantCompanyProps,
} from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const AddCompanyDetailsFormModal: React.FC<AddCompanyDetailsFormModalProps> = ({
  isOpen,
  toggle,
  case_alias,
  applicantDetails_alias,
}) => {
  const { data, isLoading, isError } = useGetCompanyDetailsQuery({
    case_alias,
    applicantDetails_alias,
  });
  const [addCompanyDetails, { isLoading: isCompanyDetailsAdding }] =
    useAddCompanyDetailsMutation();

  const [formData, setFormData] = useState<ApplicantCompanyProps>({
    company_name: "",
    company_registration_number: "",
    date_of_incorporation: null,
    company_type: "PRIVATE_LIMITED",
    trade_business_type: "",
    sic_code: "",
    is_spv: false,
    postcode: "",
    house_number_or_name: "",
    address_line1: "",
    city: "",
    county: "",
    country: "",
  });

  useEffect(() => {
    if (data && data[0]) {
      setFormData({
        company_name: data[0].company_name || "",
        company_registration_number: data[0].company_registration_number || "",
        date_of_incorporation: data[0].date_of_incorporation || null,
        company_type: data[0].company_type || "PRIVATE_LIMITED",
        trade_business_type: data[0].trade_business_type || "",
        sic_code: data[0].sic_code || "",
        is_spv: data[0].is_spv || false,
        postcode: data[0].postcode || "",
        house_number_or_name: data[0].house_number_or_name || "",
        address_line1: data[0].address_line1 || "",
        city: data[0].city || "",
        county: data[0].county || "",
        country: data[0].country || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await addCompanyDetails({
        case_alias,
        applicantDetails_alias,
        CompanyDetails: formData,
      }).unwrap();
      toast.success("Company details added successfully");
      toggle();
    } catch (error) {
      toast.error("Failed to add company details");
    }
  };

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>Error fetching data</div>;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h2 className="text-primary fw-bold">Company Applicant</h2>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} className="p-2">
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Company Name*</Label>
                <Input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Company Registration Number*</Label>
                <Input
                  type="text"
                  name="company_registration_number"
                  value={formData.company_registration_number}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Date of Incorporation</Label>
                <Input
                  type="date"
                  name="date_of_incorporation"
                  value={formData.date_of_incorporation || ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Company Type</Label>
                <Input
                  type="select"
                  name="company_type"
                  value={formData.company_type}
                  onChange={handleChange}
                >
                  <option value="PRIVATE_LIMITED">
                    Private Limited Company
                  </option>
                  <option value="PUBLIC_LIMITED">Public Limited Company</option>
                  <option value="SOLE_TRADER">Sole Trader</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="LIMITED_LIABILITY_PARTNERSHIP">
                    Limited Liability Partnership
                  </option>
                  <option value="OTHER">Other</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Trade Business Type</Label>
                <Input
                  type="text"
                  name="trade_business_type"
                  value={formData.trade_business_type}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="small">SIC Code</Label>
                <Input
                  type="text"
                  name="sic_code"
                  value={formData.sic_code}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup check>
            <Label check className="small">
              <Input
                type="checkbox"
                name="is_spv"
                checked={formData.is_spv}
                onChange={handleChange}
              />
              Is SPV
            </Label>
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Postcode</Label>
                <Input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="small">House Number or Name</Label>
                <Input
                  type="text"
                  name="house_number_or_name"
                  value={formData.house_number_or_name}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <FormGroup>
                <Label className="small">Address Line 1</Label>
                <Input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={7}>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label className="small">City</Label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label className="small">County</Label>
                    <Input
                      type="text"
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label className="small">Country</Label>
                    <Input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={6}></Col>
            <Col md={6}></Col>
          </Row>
          <div className="d-flex justify-content-end mt-4 gap-2">
            <div title={data?.[0] ? "Data already added" : ""}>
              <Button color="warning" onClick={toggle} className="me-2">
                Cancel
              </Button>
              <Button color="primary" type="submit" disabled={!!data?.[0]}>
                {isCompanyDetailsAdding ? "Adding..." : "Submit"}
              </Button>
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddCompanyDetailsFormModal;
