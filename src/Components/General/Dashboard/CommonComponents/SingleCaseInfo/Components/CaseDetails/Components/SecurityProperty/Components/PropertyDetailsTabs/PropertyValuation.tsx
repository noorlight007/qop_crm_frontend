import { updateProperty } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { useGetCaseUsersQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseUsers/CaseUsersApi";
import { RootState } from "@/Redux/Store";
import { ValuationInfoProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SecurityPropertyTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

const ValuationInfo: React.FC<ValuationInfoProps> = ({ propertyData }) => {
  const { casealias } = useParams();
  const dispatch = useDispatch();
  const propertyState = useSelector(
    (state: RootState) => state.propertyForm.Properties
  );

  const [autoFilled, setAutoFilled] = useState<boolean>(false);

  // Sample applicants - these would typically come from props or API
  const { data: caseUsers } = useGetCaseUsersQuery({
    case_alias: casealias,
  });

  useEffect(() => {
    const initialData = {
      valuation_type: null,
      select_applicant_list: "",
      contact_for_access: "",
      contacts_name: "",
      contacts_daytime_telephone: "",
      contacts_mobile_telephone: "",
      contacts_email_address: "",
    };

    dispatch(updateProperty({ ...initialData, ...propertyData }));
  }, [propertyData, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Special handling for applicant selection: autofill contact fields
    if (name === "select_applicant_list") {
      const selectedId = value;

      // Clear selection -> clear contact fields and unlock
      if (!selectedId || selectedId === "") {
        dispatch(
          updateProperty({
            select_applicant_list: "",
            contacts_name: "",
            contacts_mobile_telephone: "",
            contacts_email_address: "",
          })
        );
        setAutoFilled(false);
        return;
      }

      // Find user and autofill
      const user = caseUsers
        ? caseUsers.find((u: any) => String(u.id) === String(selectedId))
        : null;
      if (user) {
        const contacts_name = `${formatChoiceFieldValue(user.title) || ""} ${
          user.middle_name || ""
        } ${user.first_name || ""} ${user.last_name || ""}`
          .trim()
          .replace(/\s+/g, " ");
        const contacts_mobile_telephone = user.phone ?? user.mobile ?? "";
        const contacts_email_address = user.email ?? "";

        dispatch(
          updateProperty({
            select_applicant_list: selectedId,
            contacts_name,
            contacts_mobile_telephone,
            contacts_email_address,
          })
        );
        setAutoFilled(true);
        return;
      }

      // If no user found, just set the selection
      dispatch(updateProperty({ select_applicant_list: selectedId }));
      setAutoFilled(false);
      return;
    }

    let updatedValue: any = value;
    if (type === "radio") {
      updatedValue = value === "" ? null : Number(value);
    } else if (value === "" || value === "SELECT") {
      updatedValue = "";
    }

    dispatch(updateProperty({ [name]: updatedValue }));
  };

  const valuationTypes = [
    { value: "standard_val", label: "Standard Val" },
    { value: "homebuyers", label: "Homebuyers" },
    { value: "full_standard", label: "Full Standard Building Survey" },
    { value: "avm", label: "AVM" },
    { value: "drive_by", label: "Drive By" },
  ];

  return (
    <div className="valuation-info p-4">
      <Row className="d-flex justify-content-center">
        <Col sm={12} lg={8}>
          <div className="bg-white rounded-lg p-4">
            {/* Section: Valuation Information */}
            <div className="mb-4">
              <Row>
                {/* Valuation Type */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="mb-3">
                      <Col sm={3}>
                        <Label
                          className="mb-0 fw-medium text-muted"
                          htmlFor="valuation_type"
                        >
                          Valuation Type
                        </Label>
                      </Col>
                      <Col sm={9} className="d-flex flex-wrap gap-3">
                        {valuationTypes.map((type) => (
                          <div
                            className={`valuation-option ${
                              propertyState.valuation_type === type.value
                                ? "active"
                                : ""
                            }`}
                            key={type.value}
                            onClick={() => {
                              dispatch(
                                updateProperty({ valuation_type: type.value })
                              );
                            }}
                          >
                            <Input
                              type="radio"
                              name="valuation_type"
                              id={`valuation_type_${type.value}`}
                              value={type.value}
                              checked={
                                propertyState.valuation_type === type.value
                              }
                              className="position-absolute opacity-0"
                            />
                            <Label
                              className="d-flex align-items-center gap-2 m-0 py-2 px-3 rounded-3"
                              htmlFor={`valuation_type_${type.value}`}
                            >
                              <span className="radio-circle"></span>
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </Col>
                      <style jsx>{`
                        .valuation-option {
                          position: relative;
                          cursor: pointer;
                          transition: all 0.2s ease;
                        }
                        .valuation-option Label {
                          background: #f8f9fa;
                          border: 1px solid #dee2e6;
                          transition: all 0.2s ease;
                        }
                        .valuation-option:hover Label {
                          background: #e9ecef;
                          border-color: #ced4da;
                        }
                        .valuation-option.active Label {
                          background: #e7f1ff;
                          border-color: #0d6efd;
                          color: #0d6efd;
                        }
                        .radio-circle {
                          width: 16px;
                          height: 16px;
                          border: 2px solid #6c757d;
                          border-radius: 50%;
                          position: relative;
                        }
                        .active .radio-circle {
                          border-color: #0d6efd;
                        }
                        .active .radio-circle:after {
                          content: "";
                          position: absolute;
                          width: 8px;
                          height: 8px;
                          background: #0d6efd;
                          border-radius: 50%;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                        }
                      `}</style>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Applicant Information */}
                <Col sm={12}>
                  <h6 className="text-primary mb-3">Applicant Information</h6>

                  {/* Select Applicant List */}
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="select_applicant_list"
                        >
                          Select an applicant if they are the contact
                        </Label>
                      </Col>
                      <Col sm={5}>
                        <Input
                          type="select"
                          name="select_applicant_list"
                          id="select_applicant_list"
                          value={propertyState.select_applicant_list || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select...</option>
                          {caseUsers &&
                            caseUsers.map((user: any) => (
                              <option key={user.id} value={user.id}>
                                {formatChoiceFieldValue(user.title)}{" "}
                                {user.middle_name} {user.first_name}{" "}
                                {user.last_name}
                              </option>
                            ))}
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>

                  {/* Contact For Access */}
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="contact_for_access"
                        >
                          Contact For Access
                        </Label>
                      </Col>
                      <Col sm={5}>
                        <Input
                          type="text"
                          name="contact_for_access"
                          id="contact_for_access"
                          value={propertyState.contact_for_access || ""}
                          onChange={handleChange}
                          maxLength={512}
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  {/* Contacts Name */}
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label className="mb-0 fw-medium" for="contacts_name">
                          Contacts Name
                        </Label>
                      </Col>
                      <Col sm={5}>
                        <Input
                          type="text"
                          name="contacts_name"
                          id="contacts_name"
                          value={propertyState.contacts_name || ""}
                          onChange={handleChange}
                          disabled={autoFilled}
                          maxLength={256}
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  {/* Contacts Daytime Telephone */}
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="contacts_daytime_telephone"
                        >
                          Contacts Daytime Telephone
                        </Label>
                      </Col>
                      <Col sm={5}>
                        <Input
                          type="tel"
                          name="contacts_daytime_telephone"
                          id="contacts_daytime_telephone"
                          value={propertyState.contacts_daytime_telephone || ""}
                          onChange={handleChange}
                          maxLength={20}
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  {/* Contacts Mobile Telephone */}
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="contacts_mobile_telephone"
                        >
                          Contacts Mobile Telephone
                        </Label>
                      </Col>
                      <Col sm={5}>
                        <Input
                          type="tel"
                          name="contacts_mobile_telephone"
                          id="contacts_mobile_telephone"
                          value={propertyState.contacts_mobile_telephone || ""}
                          onChange={handleChange}
                          disabled={autoFilled}
                          maxLength={20}
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  {/* Contacts Email Address */}
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="contacts_email_address"
                        >
                          Contacts Email Address
                        </Label>
                      </Col>
                      <Col sm={5}>
                        <Input
                          type="email"
                          name="contacts_email_address"
                          id="contacts_email_address"
                          value={propertyState.contacts_email_address || ""}
                          onChange={handleChange}
                          disabled={autoFilled}
                          maxLength={320}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      <style>
        {`
          .valuation-info .form-group {
            margin-bottom: 1.5rem;
          }
          .valuation-info .form-check {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
          }
          .valuation-info .form-check:hover {
            background-color: #f8f9fa;
          }
          .valuation-info .text-primary {
            color: #0d6efd;
          }
          .valuation-info .border-bottom {
            border-color: #e9ecef !important;
          }
          .valuation-info .form-check-input {
            margin-right: 0.5rem;
            margin-left: 0.5rem;
          }
          .valuation-info .input-group {
            border-radius: 0.25rem;
            overflow: hidden;
          }
          .valuation-info textarea {
            min-height: 100px;
          }
        `}
      </style>
    </div>
  );
};

export default ValuationInfo;
