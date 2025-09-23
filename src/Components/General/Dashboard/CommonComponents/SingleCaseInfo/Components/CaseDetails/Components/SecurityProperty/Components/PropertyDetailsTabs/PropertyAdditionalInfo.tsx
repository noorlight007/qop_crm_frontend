import { updateProperty } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { RootState } from "@/Redux/Store";
import { AdditionalInfoProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SecurityPropertyTypes";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ propertyData }) => {
  const dispatch = useDispatch();
  const propertyState = useSelector(
    (state: RootState) => state.propertyForm.Properties
  );

  useEffect(() => {
    const initialData = {
      is_the_property_a_listed_building: false,
      number_of_units: null,
      listed_status_of_the_building: "SELECT",
      listed_building_notes: null,
      do_you_or_will_you_own_part_or_all_of_the_freehold: false,
      is_the_property_part_of_a_help_to_buy_shared_ownership_scheme: false,
      is_the_property_above_or_near_commercial_premises: false,
      is_the_property_a_new_build: false,
      new_build_warranty_provider: "SELECT_WARRANTY_PROVIDER",
      other_new_build_warranty_provider: null,
      is_the_property_a_right_to_buy: false,
      date_of_purchase: null,
      discounted_price: 0.0,
      is_the_property_ex_local_authority: false,
      is_this_property_being_purchased_from_the_council_with_this_application:
        false,
      is_there_an_annexe_within_the_property: false,
      will_the_property_be_owner_occupied: false,
      please_provide_further_details: null,
      is_the_property_on_the_market: false,
      is_the_property_rented_out_to_be_rented_out: false,
      is_the_property_standard_construction: false,
      comments_details: null,
      does_the_property_have_solar_panels: false,
      do_you_own_the_solar_panels: false,
      is_the_property_used_purely_for_residential_purposes: false,
    };

    dispatch(updateProperty({ ...initialData, ...propertyData }));
  }, [propertyData, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let updatedValue: any = value;

    if (type === "radio") {
      updatedValue = value === "true";
    } else if (type === "number") {
      updatedValue = value === "" ? null : Number(value);
    }

    dispatch(updateProperty({ [name]: updatedValue }));
  };

  const warrantyProviders = [
    "NHBC",
    "LABC",
    "Premier Guarantee",
    "Checkmate",
    "Buildsafe",
    "Build-Zone",
    "ICW",
    "Protek",
    "Global",
    "Other",
  ];

  return (
    <div className="property-additional-info p-4">
      <Row className="d-flex justify-content-center">
        <Col sm={12} lg={8}>
          <div className="bg-white rounded-lg p-4">
            {/* Section: Basic Property Information */}
            <div className="mb-4">
              <h5 className="text-primary mb-3">Basic Property Information</h5>
              <Row>
                {/* Listed Building */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_a_listed_building"
                        >
                          Is the property a listed building?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_a_listed_building"
                            id="is_the_property_a_listed_building_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_a_listed_building ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_a_listed_building"
                            id="is_the_property_a_listed_building_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_a_listed_building ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {propertyState.is_the_property_a_listed_building && (
                  <div id="listedBuildingExtraFields">
                    <Row>
                      <Col sm={6}>
                        <FormGroup>
                          <Label for="listed_status_of_the_building">
                            Listed status of the building
                          </Label>
                          <Input
                            type="select"
                            name="listed_status_of_the_building"
                            id="listed_status_of_the_building"
                            value={
                              propertyState.listed_status_of_the_building ||
                              "SELECT"
                            }
                            onChange={handleChange}
                          >
                            <option value="SELECT">Select...</option>
                            <option value="GRADE_I">Grade I</option>
                            <option value="GRADE_II*">Grade II*</option>
                            <option value="GRADE_II">Grade II</option>
                            <option value="GRADE_A">Grade A</option>
                            <option value="GRADE_B">Grade B</option>
                            <option value="GRADE_C">Grade C</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col sm={12}>
                        <FormGroup>
                          <Label for="listed_building_notes">
                            Listed Building Notes
                          </Label>
                          <Input
                            type="textarea"
                            name="listed_building_notes"
                            id="listed_building_notes"
                            value={propertyState.listed_building_notes || ""}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Own Freehold */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="do_you_or_will_you_own_part_or_all_of_the_freehold"
                        >
                          Do you or will you own part or all of the freehold?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="do_you_or_will_you_own_part_or_all_of_the_freehold"
                            id="do_you_or_will_you_own_part_or_all_of_the_freehold_yes"
                            value="true"
                            checked={
                              propertyState.do_you_or_will_you_own_part_or_all_of_the_freehold ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="do_you_or_will_you_own_part_or_all_of_the_freehold"
                            id="do_you_or_will_you_own_part_or_all_of_the_freehold_no"
                            value="false"
                            checked={
                              propertyState.do_you_or_will_you_own_part_or_all_of_the_freehold ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Help to Buy/Shared Ownership */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_part_of_a_help_to_buy_shared_ownership_scheme"
                        >
                          Part of Help to Buy/Shared Ownership scheme?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_part_of_a_help_to_buy_shared_ownership_scheme"
                            id="help_to_buy_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_part_of_a_help_to_buy_shared_ownership_scheme ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_part_of_a_help_to_buy_shared_ownership_scheme"
                            id="help_to_buy_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_part_of_a_help_to_buy_shared_ownership_scheme ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Above/Near Commercial */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_above_or_near_commercial_premises"
                        >
                          Above or near commercial premises?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_above_or_near_commercial_premises"
                            id="commercial_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_above_or_near_commercial_premises ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_above_or_near_commercial_premises"
                            id="commercial_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_above_or_near_commercial_premises ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* New Build */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_a_new_build"
                        >
                          Is the property a new build?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_a_new_build"
                            id="new_build_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_a_new_build === true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_a_new_build"
                            id="new_build_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_a_new_build ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {propertyState.is_the_property_a_new_build && (
                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Label for="new_build_warranty_provider">
                          New Build Warranty Provider
                        </Label>
                        <Input
                          type="select"
                          name="new_build_warranty_provider"
                          id="new_build_warranty_provider"
                          value={
                            propertyState.new_build_warranty_provider ||
                            "SELECT_WARRANTY_PROVIDER"
                          }
                          onChange={handleChange}
                        >
                          <option value="SELECT_WARRANTY_PROVIDER">
                            Select...
                          </option>
                          {warrantyProviders.map((provider) => (
                            <option key={provider} value={provider}>
                              {provider}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    {propertyState.new_build_warranty_provider === "Other" && (
                      <Col sm={6}>
                        <FormGroup>
                          <Label for="other_new_build_warranty_provider">
                            Other Warranty Provider
                          </Label>
                          <Input
                            type="text"
                            name="other_new_build_warranty_provider"
                            id="other_new_build_warranty_provider"
                            value={
                              propertyState.other_new_build_warranty_provider ||
                              ""
                            }
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                )}

                {/* Right to Buy */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_a_right_to_buy"
                        >
                          Is the property a right to buy?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_a_right_to_buy"
                            id="right_to_buy_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_a_right_to_buy ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_a_right_to_buy"
                            id="right_to_buy_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_a_right_to_buy ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {propertyState.is_the_property_a_right_to_buy && (
                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Label for="date_of_purchase">Date of Purchase</Label>
                        <Input
                          type="date"
                          name="date_of_purchase"
                          id="date_of_purchase"
                          value={propertyState.date_of_purchase || ""}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label for="discounted_price">Discounted Price</Label>
                        <InputGroup>
                          <span className="input-group-text">£</span>
                          <Input
                            type="number"
                            name="discounted_price"
                            id="discounted_price"
                            value={propertyState.discounted_price ?? ""}
                            onChange={handleChange}
                            step="0.01"
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                )}

                {/* Ex-Local Authority */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_ex_local_authority"
                        >
                          Is the property ex-local authority?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_ex_local_authority"
                            id="ex_local_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_ex_local_authority ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_ex_local_authority"
                            id="ex_local_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_ex_local_authority ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {propertyState.is_the_property_ex_local_authority && (
                  <Col sm={12}>
                    <FormGroup className="mb-4 border-bottom pb-3">
                      <Row className="align-items-center">
                        <Col sm={7}>
                          <Label
                            className="mb-0 fw-medium"
                            for="is_this_property_being_purchased_from_the_council_with_this_application"
                          >
                            Purchased from council with this application?
                          </Label>
                        </Col>
                        <Col sm={5} className="radioBtnInputs d-flex gap-3">
                          <div className="form-check">
                            <Input
                              type="radio"
                              name="is_this_property_being_purchased_from_the_council_with_this_application"
                              id="council_purchase_yes"
                              value="true"
                              checked={
                                propertyState.is_this_property_being_purchased_from_the_council_with_this_application ===
                                true
                              }
                              onChange={handleChange}
                              className="form-check-input"
                            />
                            <Label className="form-check-label">Yes</Label>
                          </div>
                          <div className="form-check">
                            <Input
                              type="radio"
                              name="is_this_property_being_purchased_from_the_council_with_this_application"
                              id="council_purchase_no"
                              value="false"
                              checked={
                                propertyState.is_this_property_being_purchased_from_the_council_with_this_application ===
                                false
                              }
                              onChange={handleChange}
                              className="form-check-input"
                            />
                            <Label className="form-check-label">No</Label>
                          </div>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                )}

                {/* Annexe */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_there_an_annexe_within_the_property"
                        >
                          Is there an annexe within the property?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_there_an_annexe_within_the_property"
                            id="annexe_yes"
                            value="true"
                            checked={
                              propertyState.is_there_an_annexe_within_the_property ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_there_an_annexe_within_the_property"
                            id="annexe_no"
                            value="false"
                            checked={
                              propertyState.is_there_an_annexe_within_the_property ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Owner Occupied */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="will_the_property_be_owner_occupied"
                        >
                          Will the property be owner occupied?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="will_the_property_be_owner_occupied"
                            id="owner_occupied_yes"
                            value="true"
                            checked={
                              propertyState.will_the_property_be_owner_occupied ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="will_the_property_be_owner_occupied"
                            id="owner_occupied_no"
                            value="false"
                            checked={
                              propertyState.will_the_property_be_owner_occupied ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {!propertyState.will_the_property_be_owner_occupied && (
                  <Col sm={12}>
                    <FormGroup>
                      <Label for="please_provide_further_details">
                        Please provide further details
                      </Label>
                      <Input
                        type="textarea"
                        id="please_provide_further_details"
                        name="please_provide_further_details"
                        value={
                          propertyState.please_provide_further_details || ""
                        }
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                )}

                {/* On Market */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_on_the_market"
                        >
                          Is the property on the market?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_on_the_market"
                            id="on_market_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_on_the_market ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_on_the_market"
                            id="on_market_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_on_the_market ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Rented Out */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_rented_out_to_be_rented_out"
                        >
                          Is the property rented out/to be rented out?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_rented_out_to_be_rented_out"
                            id="rented_out_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_rented_out_to_be_rented_out ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_rented_out_to_be_rented_out"
                            id="rented_out_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_rented_out_to_be_rented_out ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Standard Construction */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_standard_construction"
                        >
                          Is the property standard construction?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_standard_construction"
                            id="standard_construction_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_standard_construction ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_standard_construction"
                            id="standard_construction_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_standard_construction ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {!propertyState.is_the_property_standard_construction && (
                  <Col sm={12}>
                    <FormGroup>
                      <Label for="comments_details">Construction Details</Label>
                      <Input
                        type="textarea"
                        id="comments_details"
                        name="comments_details"
                        value={propertyState.comments_details || ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                )}

                {/* Solar Panels */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="does_the_property_have_solar_panels"
                        >
                          Does the property have solar panels?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="does_the_property_have_solar_panels"
                            id="solar_panels_yes"
                            value="true"
                            checked={
                              propertyState.does_the_property_have_solar_panels ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="does_the_property_have_solar_panels"
                            id="solar_panels_no"
                            value="false"
                            checked={
                              propertyState.does_the_property_have_solar_panels ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {propertyState.does_the_property_have_solar_panels && (
                  <Col sm={12}>
                    <FormGroup className="mb-4 border-bottom pb-3">
                      <Row className="align-items-center">
                        <Col sm={7}>
                          <Label
                            className="mb-0 fw-medium"
                            for="do_you_own_the_solar_panels"
                          >
                            Do you own the solar panels?
                          </Label>
                        </Col>
                        <Col sm={5} className="radioBtnInputs d-flex gap-3">
                          <div className="form-check">
                            <Input
                              type="radio"
                              name="do_you_own_the_solar_panels"
                              id="own_solar_yes"
                              value="true"
                              checked={
                                propertyState.do_you_own_the_solar_panels ===
                                true
                              }
                              onChange={handleChange}
                              className="form-check-input"
                            />
                            <Label className="form-check-label">Yes</Label>
                          </div>
                          <div className="form-check">
                            <Input
                              type="radio"
                              name="do_you_own_the_solar_panels"
                              id="own_solar_no"
                              value="false"
                              checked={
                                propertyState.do_you_own_the_solar_panels ===
                                false
                              }
                              onChange={handleChange}
                              className="form-check-input"
                            />
                            <Label className="form-check-label">No</Label>
                          </div>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                )}

                {/* Residential Purposes */}
                <Col sm={12}>
                  <FormGroup className="mb-4 border-bottom pb-3">
                    <Row className="align-items-center">
                      <Col sm={7}>
                        <Label
                          className="mb-0 fw-medium"
                          for="is_the_property_used_purely_for_residential_purposes"
                        >
                          Used purely for residential purposes?
                        </Label>
                      </Col>
                      <Col sm={5} className="radioBtnInputs d-flex gap-3">
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_used_purely_for_residential_purposes"
                            id="residential_yes"
                            value="true"
                            checked={
                              propertyState.is_the_property_used_purely_for_residential_purposes ===
                              true
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">Yes</Label>
                        </div>
                        <div className="form-check">
                          <Input
                            type="radio"
                            name="is_the_property_used_purely_for_residential_purposes"
                            id="residential_no"
                            value="false"
                            checked={
                              propertyState.is_the_property_used_purely_for_residential_purposes ===
                              false
                            }
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <Label className="form-check-label">No</Label>
                        </div>
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
          .property-additional-info .form-group {
            margin-bottom: 1.5rem;
          }
          .property-additional-info .form-check {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
          }
          .property-additional-info .form-check:hover {
            background-color: #f8f9fa;
          }
          .property-additional-info .text-primary {
            color: #0d6efd;
          }
          .property-additional-info .border-bottom {
            border-color: #e9ecef !important;
          }
          .property-additional-info .form-check-input {
            margin-right: 0.5rem;
            margin-left: 0.5rem;
          }
          .property-additional-info .input-group {
            border-radius: 0.25rem;
            overflow: hidden;
          }
          .property-additional-info textarea {
            min-height: 100px;
          }
        `}
      </style>
    </div>
  );
};

export default AdditionalInfo;
