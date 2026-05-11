import { useUpdateCompanyInfoMutation } from "@/Redux/Reducers/CompanyInfo/CompanyInfoApi";
import { UpdateCompanyInfoModalProps } from "@/Types/CompanyInfo/CompanyInfoTypes";
import { countries } from "@/utils/Countries";
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

const getErrorMessage = (err: any) => {
  if (!err) return "Failed to update address.";
  if (typeof err === "string") return err;
  if (typeof err?.data === "string") return err.data;

  const collectMessages = (value: any): string[] => {
    if (value == null) return [];
    if (typeof value === "string") return [value];
    if (Array.isArray(value))
      return value.flatMap((item) => collectMessages(item));
    if (typeof value === "object") {
      return Object.values(value).flatMap((item) => collectMessages(item));
    }
    return [String(value)];
  };

  if (err?.data) {
    const dataMessages = collectMessages(err.data);
    if (dataMessages.length) return dataMessages.join(", ");
  }

  if (err?.error) return String(err.error);
  if (err?.message) return String(err.message);

  try {
    return JSON.stringify(err);
  } catch {
    return "Failed to update address.";
  }
};

const parseApiErrors = (errorData: any): Record<string, string[]> => {
  if (!errorData || typeof errorData !== "object") return {};

  const result: Record<string, string[]> = {};

  const addError = (key: string, value: any) => {
    if (value == null) return;
    if (typeof value === "string") {
      result[key] = [value];
      return;
    }
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? item : JSON.stringify(item),
      );
      return;
    }
    if (typeof value === "object") {
      const nested = Object.values(value)
        .flatMap((item) =>
          Array.isArray(item)
            ? item.map((nestedItem) =>
                typeof nestedItem === "string"
                  ? nestedItem
                  : JSON.stringify(nestedItem),
              )
            : typeof item === "string"
              ? [item]
              : [JSON.stringify(item)],
        )
        .filter(Boolean);
      if (nested.length) {
        result[key] = nested;
      }
    }
  };

  Object.entries(errorData).forEach(([key, value]) => addError(key, value));

  return result;
};

const UpdateAddressModal: React.FC<UpdateCompanyInfoModalProps> = ({
  isOpen,
  toggle,
  companyInfo,
}) => {
  const [updateCompanyAddress, { isLoading: isUpdating }] =
    useUpdateCompanyInfoMutation();

  const [formData, setFormData] = useState({
    address: {
      postcode: "",
      house_name_or_number: "",
      address_line_1: "",
      city: "",
      country: "",
    },
  });

  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (companyInfo && isOpen) {
      setFormData({
        address: {
          postcode: companyInfo.address?.postcode ?? "",
          house_name_or_number: companyInfo.address?.house_name_or_number ?? "",
          address_line_1: companyInfo.address?.address_line_1 ?? "",
          city: companyInfo.address?.city ?? "",
          country: companyInfo.address?.country ?? "",
        },
      });
    }
  }, [companyInfo, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiErrors({});

    try {
      await updateCompanyAddress({
        payload: formData,
      }).unwrap();
      toast.success("Address updated successfully");
      toggle();
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
      setApiErrors(parseApiErrors(error?.data?.errors ?? error?.data));
      console.error("Failed to update address:", error);
      try {
        console.error(
          "Failed to update address details:",
          JSON.stringify(error, null, 2),
        );
      } catch {
        console.error("Failed to stringify update address error", error);
      }
    }
  };

  const handlePostcodeLookup = () => {
    toast.info("Postcode lookup is not implemented in this demo.");
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h4 className="text-primary">Update Address</h4>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="postcode">
                  Postcode<span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <Input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.address.postcode}
                    onChange={handleInputChange}
                    placeholder="Enter postcode"
                    className="rounded-end-0"
                    required
                  />
                  <Button
                    color="info"
                    type="button"
                    className="text-nowrap rounded-start-0"
                    onClick={handlePostcodeLookup}
                  >
                    Lookup
                  </Button>
                </InputGroup>
                {apiErrors["address.postcode"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.postcode"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="house_name_or_number">
                  House Name / Numbers <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="house_name_or_number"
                  id="house_name_or_number"
                  value={formData.address.house_name_or_number}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors["address.house_name_or_number"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.house_name_or_number"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="address_line_1">
                  Address Line 1 <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="address_line_1"
                  id="address_line_1"
                  value={formData.address.address_line_1}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors["address.address_line_1"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.address_line_1"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="city">
                  City <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors["address.city"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.city"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  type="select"
                  name="country"
                  id="country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Input>
                {apiErrors["address.country"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.country"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-end">
              <Button
                color="secondary"
                onClick={toggle}
                disabled={isUpdating}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Address"}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateAddressModal;
