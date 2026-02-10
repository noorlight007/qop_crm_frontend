import LoadingSpinner from "@/app/loading";
import {
  useAddCompanyDetailsMutation,
  useGetCompanyDetailsByRegistrationQuery,
  useGetCompanyDetailsQuery,
  useUpdateCompanyDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ApplicantsDetails/ApplicantsDetailsApi";
import {
  AddCompanyDetailsFormModalProps,
  ApplicantCompanyProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/ApplicantsDetailsTypes";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
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
  const [updateCompanyDetails, { isLoading: isCompanyDetailsUpdating }] =
    useUpdateCompanyDetailsMutation();

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
    directors_shareholders: [],
  });

  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const {
    data: companyDetails,
    isLoading: isFetchingCompanyDetails,
    error,
  } = useGetCompanyDetailsByRegistrationQuery(
    {
      case_alias,
      applicantDetails_alias,
      company_registration_number: formData.company_registration_number,
    },
    { skip: !shouldFetch || !formData.company_registration_number },
  );

  useEffect(() => {
    if (data && data[0]) {
      const loadedDirectors = Array.isArray(data[0].directors_shareholders)
        ? data[0].directors_shareholders.map((d: any) => ({
            ...d,
          }))
        : [];
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
        directors_shareholders: loadedDirectors,
        number_of_directors_shareholders: loadedDirectors.length,
      });
      setNumberOfDirectors(String(loadedDirectors.length));
    }
  }, [data]);

  const [numberOfDirectors, setNumberOfDirectors] = useState<string>("0");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
    return undefined;
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const data = err?.data || (err?.error && err.error.data) || err;

    const sanitize = (msg: string) => msg.replace(/^\d+[,\s]*/, "");

    const recurse = (value: any, path: string[] = []) => {
      if (value == null) return;
      if (typeof value === "string") {
        out[path.join(".")] = sanitize(value);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v, idx) => recurse(v, path.concat(String(idx))));
        return;
      }
      if (typeof value === "object") {
        for (const k of Object.keys(value)) {
          recurse(value[k], path.concat(k));
        }
        return;
      }
      out[path.join(".")] = String(value);
    };

    recurse(data, []);
    return out;
  };

  useEffect(() => {
    // if existing data has directors_shareholders, reflect that count
    if (data && data[0] && Array.isArray(data[0].directors_shareholders)) {
      setNumberOfDirectors(String(data[0].directors_shareholders.length));
    }
  }, [data]);

  useEffect(() => {
    // ensure directors_shareholders array length matches numberOfDirectors (parsed)
    const count = parseInt(numberOfDirectors, 10);
    const target = isNaN(count) || count < 0 ? 0 : count;
    setFormData((prev) => {
      const directors_shareholders = prev.directors_shareholders
        ? [...prev.directors_shareholders]
        : [];
      if (target > directors_shareholders.length) {
        for (let i = directors_shareholders.length; i < target; i++) {
          directors_shareholders.push({
            full_name: "",
            percentage_share: "",
            role: "",
          });
        }
      } else if (target < directors_shareholders.length) {
        directors_shareholders.splice(target);
      }
      return {
        ...prev,
        directors_shareholders,
        number_of_directors_shareholders: target,
      };
    });
  }, [numberOfDirectors]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // keep the raw string so the user can clear the field
    setNumberOfDirectors(e.target.value);
  };

  const handleDirectorChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => {
      const directors_shareholders = prev.directors_shareholders
        ? [...prev.directors_shareholders]
        : [];
      directors_shareholders[index] = {
        ...directors_shareholders[index],
        [name]: value,
      } as any;
      return { ...prev, directors_shareholders };
    });
  };

  const validateDirectors = (): Record<string, string> => {
    const out: Record<string, string> = {};
    const list = formData.directors_shareholders || [];
    list.forEach((d: any, i: number) => {
      if (!d || !String(d.full_name || "").trim()) {
        out[`directors_shareholders.${i}.full_name`] = "Full name is required";
      }
      if (
        d == null ||
        d.percentage_share === "" ||
        d.percentage_share == null ||
        isNaN(Number(d.percentage_share))
      ) {
        out[`directors_shareholders.${i}.percentage_share`] =
          "Percentage share is required";
      }
    });
    return out;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateDirectors();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    try {
      const response = await addCompanyDetails({
        case_alias,
        applicantDetails_alias,
        company_name: formData.company_name,
        CompanyDetails: formData,
      }).unwrap();
      // If the API returned the saved company name/alias, make sure formData reflects it
      const returnedName =
        response?.company_name ||
        response?.data?.company_name ||
        (data && data[0] && data[0].company_name) ||
        formData.company_name;
      if (returnedName) {
        setFormData((prev) => ({ ...prev, company_name: returnedName }));
      }
      setErrors({});
      toast.success("Company details added successfully");
      toggle();
    } catch (error) {
      const parsed = parseApiErrors(error);
      setErrors(parsed);
      const first = Object.values(parsed)[0];
      const message =
        first || getErrorMessage(error) || "Failed to add company details";
      toast.error(message);
    }
  };

  const handleUpdate = async () => {
    // Guard: company_name is required for the update endpoint path
    const targetName = data && data[0] && data[0].company_name;
    if (!targetName) {
      toast.error("Company name is missing — cannot perform update");
      return;
    }

    const validationErrors = validateDirectors();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    try {
      await updateCompanyDetails({
        case_alias,
        applicantDetails_alias,
        company_name: targetName,
        CompanyDetails: formData,
      }).unwrap();
      setErrors({});
      toast.success("Company details updated successfully");
      toggle();
    } catch (error) {
      const parsed = parseApiErrors(error);
      setErrors(parsed);
      const first = Object.values(parsed)[0];
      const message =
        first || getErrorMessage(error) || "Failed to update company details";
      toast.error(message);
    }
  };

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";

    if (typeof err === "string") return err;

    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];

      if (typeof value === "string") return [value];

      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
        );

      if (typeof value === "object") {
        try {
          return Object.values(value).flatMap((v) => collect(v));
        } catch {
          return [String(value)];
        }
      }

      return [String(value)];
    };

    if (err?.data?.message) return String(err.data.message);

    if (err?.data && typeof err.data === "object") {
      const msgs = collect(err.data);

      if (msgs.length) return msgs.join(", ");
    }

    if (err?.error) return String(err.error);

    if (err?.message) {
      if (/status code/i.test(err.message)) return "Server returned an error";

      return String(err.message);
    }

    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const fetchCompanyDetails = () => {
    try {
      if (!formData.company_registration_number) {
        toast.error("Please enter a company registration number");
        return;
      }

      // Don't clear existing directors immediately — only update them if the
      // API returns explicit officer/count data. This prevents losing previously
      // entered directors when the external API has no officers info.
      setShouldFetch(true);
    } catch (err: any) {
      console.log("Setup Error:", err);
      const errorMsg = getErrorMessage(err.response || err);
      toast.error(errorMsg);
    }
  };

  // Map company type from API to your form values
  const mapCompanyType = (apiCompanyType: string): string => {
    if (!apiCompanyType) return "PRIVATE_LIMITED";

    const typeMapping: Record<string, string> = {
      "Public Limited Company": "PUBLIC_LIMITED",
      "Private Limited Company": "PRIVATE_LIMITED",
      "Limited Liability Partnership": "LIMITED_LIABILITY_PARTNERSHIP",
      Partnership: "PARTNERSHIP",
      "Sole Trader": "SOLE_TRADER",
    };

    return typeMapping[apiCompanyType] || "PRIVATE_LIMITED";
  };

  useEffect(() => {
    if (companyDetails && shouldFetch) {
      // Normalize various API shapes for officer/count information
      // Possible shapes handled:
      // - { number_of_directors_shareholders: { officers: [...] } }
      // - { number_of_directors_shareholders: [...] }
      // - { officers: [...] }
      // - { number_of_directors_shareholders: <number> }

      const candidates: any =
        companyDetails.number_of_directors_shareholders ||
        companyDetails.officers ||
        undefined;

      let mappedDirectors: any[] = [];

      if (Array.isArray(candidates)) {
        // direct array of officers
        mappedDirectors = candidates.map((officer: any) => ({
          full_name: officer?.name || "",
          percentage_share: "",
          role: officer?.role || "",
        }));
      } else if (candidates && Array.isArray(candidates.officers)) {
        mappedDirectors = candidates.officers.map((officer: any) => ({
          full_name: officer?.name || "",
          percentage_share: "",
          role: officer?.role || "",
        }));
      } else if (candidates != null && !Array.isArray(candidates)) {
        // Possibly a numeric count
        const count = parseInt(String(candidates), 10);
        if (!isNaN(count) && count > 0) {
          mappedDirectors = Array.from({ length: count }, () => ({
            full_name: "",
            percentage_share: "",
            role: "",
          }));
        }
      }

      // Fallback: sometimes companyDetails may have a top-level 'officers' array
      if (
        mappedDirectors.length === 0 &&
        Array.isArray(companyDetails.officers)
      ) {
        mappedDirectors = companyDetails.officers.map((officer: any) => ({
          full_name: officer?.name || "",
          percentage_share: "",
          role: officer?.role || "",
        }));
      }

      const directorCount = mappedDirectors.length;

      // Merge incoming company details into existing form data. Only
      // overwrite directors fields when the API provided officers or a
      // numeric count.
      const updated: any = {
        company_name: companyDetails.company_name || "",
        company_registration_number: formData.company_registration_number,
        date_of_incorporation: companyDetails.date_of_incorporation || null,
        company_type:
          mapCompanyType(companyDetails.company_type) || "PRIVATE_LIMITED",
        trade_business_type: companyDetails.trade_business_type || "",
        sic_code: companyDetails.sic_codes?.join(", ") || "",
        is_spv: formData.is_spv, // Keep this as user might have set it
        postcode: companyDetails.postcode || "",
        house_number_or_name: companyDetails.house_number_or_name || "",
        address_line1: companyDetails.address_line1 || "",
        city: companyDetails.city || "",
        county: companyDetails.county || "",
        country: companyDetails.country || "",
      };

      if (mappedDirectors.length > 0) {
        updated.directors_shareholders = mappedDirectors;
        updated.number_of_directors_shareholders = directorCount;
        setNumberOfDirectors(String(directorCount));
      }

      setFormData((prev) => ({ ...prev, ...updated }));

      setShouldFetch(false);
    }
  }, [companyDetails, shouldFetch]);

  useEffect(() => {
    if (error && shouldFetch) {
      console.error("Error detected:", error);
      const errMessage = getErrorMessage(error);
      toast.error(errMessage);

      setShouldFetch(false);
    }
  }, [error, shouldFetch]);

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>Error fetching data</div>;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
      <ModalHeader toggle={toggle}>
        <h2 className="text-primary fw-bold">Company Applicant</h2>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} className="p-2">
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Company Registration Number*</Label>
                <InputGroup>
                  <Input
                    type="text"
                    name="company_registration_number"
                    value={formData.company_registration_number}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    color="primary"
                    type="button"
                    className="mx-2 rounded"
                    onClick={fetchCompanyDetails}
                    disabled={
                      isFetchingCompanyDetails ||
                      !formData.company_registration_number
                    }
                  >
                    {isFetchingCompanyDetails ? "Fetching..." : "Get Details"}
                  </Button>
                </InputGroup>
                {getFieldError("company_registration_number") && (
                  <div className="text-danger small">
                    {getFieldError("company_registration_number")}
                  </div>
                )}
              </FormGroup>
            </Col>
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
                {getFieldError("company_name") && (
                  <div className="text-danger small">
                    {getFieldError("company_name")}
                  </div>
                )}
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
                {getFieldError("date_of_incorporation") && (
                  <div className="text-danger small">
                    {getFieldError("date_of_incorporation")}
                  </div>
                )}
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
                {getFieldError("company_type") && (
                  <div className="text-danger small">
                    {getFieldError("company_type")}
                  </div>
                )}
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
                {getFieldError("trade_business_type") && (
                  <div className="text-danger small">
                    {getFieldError("trade_business_type")}
                  </div>
                )}
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
                {getFieldError("sic_code") && (
                  <div className="text-danger small">
                    {getFieldError("sic_code")}
                  </div>
                )}
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
                className="border-primary"
              />
              Is SPV
            </Label>
            {getFieldError("is_spv") && (
              <div className="text-danger small">{getFieldError("is_spv")}</div>
            )}
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="small">Postcode</Label>
                <Input
                  type="text"
                  name="postcode"
                  className="border-primary"
                  value={formData.postcode}
                  onChange={handleChange}
                />
                {getFieldError("postcode") && (
                  <div className="text-danger small">
                    {getFieldError("postcode")}
                  </div>
                )}
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
                {getFieldError("house_number_or_name") && (
                  <div className="text-danger small">
                    {getFieldError("house_number_or_name")}
                  </div>
                )}
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
                {getFieldError("address_line1") && (
                  <div className="text-danger small">
                    {getFieldError("address_line1")}
                  </div>
                )}
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
                    {getFieldError("city") && (
                      <div className="text-danger small">
                        {getFieldError("city")}
                      </div>
                    )}
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
                    {getFieldError("county") && (
                      <div className="text-danger small">
                        {getFieldError("county")}
                      </div>
                    )}
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
                    {getFieldError("country") && (
                      <div className="text-danger small">
                        {getFieldError("country")}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label className="small">
                  Number of Directors/Shareholders
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  name="numberOfDirectors"
                  value={numberOfDirectors}
                  onChange={handleNumberChange}
                />
                {getFieldError("numberOfDirectors") && (
                  <div className="text-danger small">
                    {getFieldError("numberOfDirectors")}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          {formData.directors_shareholders &&
            formData.directors_shareholders.length > 0 && (
              <div className="mt-2">
                {formData.directors_shareholders.map((d, i) => (
                  <Row key={i} className="align-items-start mb-2">
                    <Col md={6}>
                      <FormGroup>
                        <Label className="small">
                          Full Name <small className="text-danger">*</small>
                        </Label>
                        <Input
                          type="text"
                          name="full_name"
                          value={d.full_name}
                          onChange={(e) => handleDirectorChange(i, e)}
                          required
                        />
                        {getFieldError(
                          `directors_shareholders.${i}.full_name`,
                        ) && (
                          <div className="text-danger small mt-1">
                            {getFieldError(
                              `directors_shareholders.${i}.full_name`,
                            )}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label className="small">
                          Percentage Share
                          <small className="text-danger">*</small>
                        </Label>
                        <InputGroup>
                          <Input
                            type="number"
                            name="percentage_share"
                            value={d.percentage_share as any}
                            onChange={(e) => handleDirectorChange(i, e)}
                            step="any"
                            required
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">%</span>
                          </div>
                        </InputGroup>
                        {getFieldError(
                          `directors_shareholders.${i}.percentage_share`,
                        ) && (
                          <div className="text-danger small mt-1">
                            {getFieldError(
                              `directors_shareholders.${i}.percentage_share`,
                            )}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label className="small">Role</Label>
                        <Input
                          type="text"
                          name="role"
                          value={d.role}
                          onChange={(e) => handleDirectorChange(i, e)}
                        />
                        {getFieldError(`directors_shareholders.${i}.role`) && (
                          <div className="text-danger small">
                            {getFieldError(`directors_shareholders.${i}.role`)}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                ))}
              </div>
            )}
          <div className="d-flex justify-content-end mt-4 gap-2">
            <div title={data?.[0] ? "Data already added" : ""}>
              <Button color="warning" onClick={toggle} className="me-2">
                Cancel
              </Button>
              {data?.[0] ? (
                <Button
                  color="primary"
                  type="button"
                  onClick={handleUpdate}
                  disabled={isCompanyDetailsUpdating}
                >
                  {isCompanyDetailsUpdating ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button color="primary" type="submit">
                  {isCompanyDetailsAdding ? "Adding..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddCompanyDetailsFormModal;
