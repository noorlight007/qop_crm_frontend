import { updateProperty } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/SecurityPropertyFormSlice";
import { RootState } from "@/Redux/Store";
import { PropertyDetailsProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SecurityPropertyTypes";
import getCurrencySign from "@/utils/currency";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyData }) => {
  const dispatch = useDispatch();
  const propertyState = useSelector(
    (state: RootState) => state.propertyForm.Properties,
  );

  useEffect(() => {
    if (propertyData) {
      dispatch(
        updateProperty({
          property_type: propertyData.property_type || null,
          house_type: propertyData.house_type || null,
          flat_type: propertyData.flat_type || null,
          construction_of_walls: propertyData.construction_of_walls || null,
          construction_of_roof: propertyData.construction_of_roof || null,
          number_of_storeys_in_the_building:
            propertyData.number_of_storeys_in_the_building || null,
          year_built: propertyData.year_built || null,
          epc_rating: propertyData.epc_rating || null,
          tenure: propertyData.tenure || null,
          property_lease_term: propertyData.property_lease_term || null,
          service_charge_per_month:
            propertyData.service_charge_per_month || null,
          ground_rent_per_annum: propertyData.ground_rent_per_annum || null,
          estimated_value: propertyData.estimated_value || null,
          bedrooms: propertyData.bedrooms || null,
          bathrooms: propertyData.bathrooms || null,
          reception_rooms: propertyData.reception_rooms || null,
          kitchens: propertyData.kitchens || null,
          garages: propertyData.garages || null,
          parking_spaces: propertyData.parking_spaces || null,
          floor: propertyData.floor || null,
          flats: propertyData.flats || null,
          number_of_units: propertyData.number_of_units || null,
          charge_type: propertyData.charge_type || null,
        }),
      );
    }
  }, [propertyData, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updatedValue =
      value === ""
        ? null
        : [
              "number_of_storeys_in_the_building",
              "year_built",
              "property_lease_term",
              "service_charge_per_month",
              "ground_rent_per_annum",
              "estimated_value",
              "bedrooms",
              "bathrooms",
              "reception_rooms",
              "kitchens",
              "garages",
              "parking_spaces",
              "floor",
              "flats",
              "number_of_units",
            ].includes(name)
          ? Number(value)
          : value;
    dispatch(updateProperty({ [name]: updatedValue }));
  };

  const propertyTypes = [
    { value: "HOUSE", label: "House" },
    { value: "FLAT", label: "Flat" },
    { value: "MAISONETTE", label: "Maisonette" },
    { value: "BUNGALOW", label: "Bungalow" },
    { value: "WAREHOUSE", label: "Warehouse" },
    { value: "LAND", label: "Land" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "SEMI_COMMERCIAL", label: "Semi-Commercial" },
    { value: "MULTI_UNIT_BLOCK", label: "Multi-Unit Block (MUB)" },
    { value: "HMO", label: "HMO" },
  ];

  const houseTypes = [
    { value: "DETACHED", label: "Detached" },
    { value: "SEMI_DETACHED", label: "Semi-Detached" },
    { value: "MID_TERRACED", label: "Mid-Terraced" },
    { value: "END_TERRACED", label: "End-Terraced" },
    { value: "TOWN_HOUSE", label: "Town House" },
  ];

  const flatTypes = [
    { value: "PURPOSE_BUILT", label: "Purpose Built" },
    { value: "CONVERTED", label: "Converted" },
    { value: "STUDIO", label: "Studio" },
  ];

  const constructionTypes = [
    { value: "CONCRETE", label: "Concrete" },
    { value: "TIMBER_FRAMED", label: "Timber Framed" },
    { value: "STEEL_FRAMED", label: "Steel Framed" },
    { value: "BRICK", label: "Brick" },
    { value: "MUNDIC_BLOCK", label: "Mundic Block" },
    {
      value: "PRC_REPAIR_WITH_CERTIFICATE",
      label: "PRC Repair with Certificate",
    },
    { value: "STONE", label: "Stone" },
    { value: "COB", label: "Cob" },
  ];

  const roofTypes = [
    { value: "TILE_ANY_TYPE", label: "Tile (Any Type)" },
    { value: "CLAY_TILE", label: "Clay Tile" },
    { value: "SLATE_TILE", label: "Slate Tile" },
    { value: "CONCRETE_TILE", label: "Concrete Tile" },
    { value: "FLAT", label: "Flat" },
    { value: "THATCHED", label: "Thatched" },
    { value: "METAL", label: "Metal" },
    { value: "WOOD", label: "Wood" },
    {
      value: "PLASTIC_EG_EPDM_PVC_CPE",
      label: "Plastic (e.g. EPDM, PVC, CPE)",
    },
    { value: "BITUMEN", label: "Bitumen" },
    { value: "GREEN_ROOF", label: "Green Roof" },
    { value: "SHINGLES", label: "Shingles" },
    { value: "OTHER", label: "Other" },
  ];

  const chargeTypes = [
    { value: "ONE", label: "1st" },
    { value: "TWO", label: "2nd" },
    { value: "THREE", label: "3rd" },
    { value: "FOUR", label: "4th" },
    { value: "FIVE", label: "5th" },
    { value: "SIX", label: "6th" },
    { value: "SEVEN", label: "7th" },
    { value: "EIGHT", label: "8th" },
    { value: "NINE", label: "9th" },
    { value: "TEN", label: "10th" },
  ];

  return (
    <Row>
      <Col sm={12}>
        <Row>
          <Col sm={6}>
            <FormGroup>
              <Label for="property_type">Property Type</Label>
              <Input
                type="select"
                id="property_type"
                name="property_type"
                value={propertyState.property_type || ""}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Input>
              {propertyState?.api_errors?.property_type && (
                <div className="text-danger">
                  {propertyState.api_errors.property_type}
                </div>
              )}
            </FormGroup>
          </Col>

          {(propertyState.property_type === "HOUSE" ||
            propertyState.property_type === "BUNGALOW") && (
            <Col sm={6}>
              <FormGroup>
                <Label for="house_type">
                  House Type <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="house_type"
                  name="house_type"
                  value={propertyState.house_type || "SELECT"}
                  onChange={handleChange}
                >
                  <option value="SELECT">Select...</option>
                  {houseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Input>
                {propertyState?.api_errors?.house_type && (
                  <div className="text-danger">
                    {propertyState.api_errors.house_type}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}

          {propertyState.property_type === "FLAT" && (
            <Col sm={6}>
              <FormGroup>
                <Label for="flat_type">Flat Type</Label>
                <Input
                  type="select"
                  id="flat_type"
                  name="flat_type"
                  value={propertyState.flat_type || ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  {flatTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Input>
                {propertyState?.api_errors?.flat_type && (
                  <div className="text-danger">
                    {propertyState.api_errors.flat_type}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>

        <Row>
          <Col sm={6}>
            <FormGroup>
              <Label for="construction_of_walls">Construction of Walls</Label>
              <Input
                type="select"
                id="construction_of_walls"
                name="construction_of_walls"
                value={propertyState.construction_of_walls || ""}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {constructionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Input>
              {propertyState?.api_errors?.construction_of_walls && (
                <div className="text-danger">
                  {propertyState.api_errors.construction_of_walls}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="construction_of_roof">Construction of Roof</Label>
              <Input
                type="select"
                id="construction_of_roof"
                name="construction_of_roof"
                value={propertyState.construction_of_roof || ""}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {roofTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Input>
              {propertyState?.api_errors?.construction_of_roof && (
                <div className="text-danger">
                  {propertyState.api_errors.construction_of_roof}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <FormGroup>
              <Label for="number_of_storeys_in_the_building">
                Number of Storeys in the Building{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                type="number"
                id="number_of_storeys_in_the_building"
                name="number_of_storeys_in_the_building"
                placeholder="0"
                value={propertyState.number_of_storeys_in_the_building || ""}
                onChange={handleChange}
              />
              {propertyState?.api_errors?.number_of_storeys_in_the_building && (
                <div className="text-danger">
                  {propertyState.api_errors.number_of_storeys_in_the_building}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="year_built">Year Built</Label>
              <Input
                type="number"
                id="year_built"
                name="year_built"
                placeholder="0"
                value={propertyState.year_built || ""}
                onChange={handleChange}
                maxLength={4}
              />
              {propertyState?.api_errors?.year_built && (
                <div className="text-danger">
                  {propertyState.api_errors.year_built}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <FormGroup>
              <Label for="tenure">Tenure</Label>
              <Input
                type="select"
                id="tenure"
                name="tenure"
                value={propertyState.tenure || ""}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="FREEHOLD">Freehold</option>
                <option value="LEASEHOLD">Leasehold</option>
                <option value="COMMONHOLD">Commonhold</option>
                <option value="FEUDAL">Feudal</option>
              </Input>
              {propertyState?.api_errors?.tenure && (
                <div className="text-danger">
                  {propertyState.api_errors.tenure}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>

        {propertyState.tenure === "LEASEHOLD" && (
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="property_lease_term">
                  Property Lease Term <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <Input
                    type="number"
                    id="property_lease_term"
                    name="property_lease_term"
                    placeholder="0"
                    value={propertyState.property_lease_term || ""}
                    onChange={handleChange}
                  />
                  {propertyState?.api_errors?.property_lease_term && (
                    <div className="text-danger">
                      {propertyState.api_errors.property_lease_term}
                    </div>
                  )}
                  <span className="input-group-text">Years</span>
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="service_charge_per_month">
                  Service Charge per Month
                </Label>
                <InputGroup>
                  <span className="input-group-text">{getCurrencySign()}</span>
                  <Input
                    type="number"
                    id="service_charge_per_month"
                    name="service_charge_per_month"
                    placeholder="0"
                    value={propertyState.service_charge_per_month || ""}
                    onChange={handleChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
                  {propertyState?.api_errors?.service_charge_per_month && (
                    <div className="text-danger">
                      {propertyState.api_errors.service_charge_per_month}
                    </div>
                  )}
                </InputGroup>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <Label for="ground_rent_per_annum">Ground Rent per Annum</Label>
                <InputGroup>
                  <span className="input-group-text">{getCurrencySign()}</span>
                  <Input
                    type="number"
                    id="ground_rent_per_annum"
                    name="ground_rent_per_annum"
                    placeholder="0"
                    value={propertyState.ground_rent_per_annum || ""}
                    onChange={handleChange}
                    step="0.01"
                    inputMode="decimal"
                    onInput={limitDecimalPlaces}
                  />
                  {propertyState?.api_errors?.ground_rent_per_annum && (
                    <div className="text-danger">
                      {propertyState.api_errors.ground_rent_per_annum}
                    </div>
                  )}
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        )}

        <Row>
          <Col sm={6}>
            <FormGroup>
              <Label for="estimated_value">Estimated Value</Label>
              <InputGroup>
                <span className="input-group-text">{getCurrencySign()}</span>
                <Input
                  type="number"
                  id="estimated_value"
                  name="estimated_value"
                  placeholder="0"
                  value={propertyState.estimated_value || ""}
                  onChange={handleChange}
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
                {propertyState?.api_errors?.estimated_value && (
                  <div className="text-danger">
                    {propertyState.api_errors.estimated_value}
                  </div>
                )}
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <FormGroup>
              <Label for="bedrooms">Bedrooms</Label>
              <Input
                type="number"
                id="bedrooms"
                name="bedrooms"
                placeholder="0"
                value={propertyState.bedrooms || ""}
                onChange={handleChange}
              />
              {propertyState?.api_errors?.bedrooms && (
                <div className="text-danger">
                  {propertyState.api_errors.bedrooms}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="bathrooms">Bathrooms</Label>
              <Input
                type="number"
                id="bathrooms"
                name="bathrooms"
                placeholder="0"
                value={propertyState.bathrooms || ""}
                onChange={handleChange}
              />
              {propertyState?.api_errors?.bathrooms && (
                <div className="text-danger">
                  {propertyState.api_errors.bathrooms}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="reception_rooms">Reception Rooms</Label>
              <Input
                type="number"
                id="reception_rooms"
                name="reception_rooms"
                placeholder="0"
                value={propertyState.reception_rooms || ""}
                onChange={handleChange}
              />
              {propertyState?.api_errors?.reception_rooms && (
                <div className="text-danger">
                  {propertyState.api_errors.reception_rooms}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="kitchens">Kitchens</Label>
              <Input
                type="number"
                id="kitchens"
                name="kitchens"
                placeholder="0"
                value={propertyState.kitchens || ""}
                onChange={handleChange}
              />
              {propertyState?.api_errors?.kitchens && (
                <div className="text-danger">
                  {propertyState.api_errors.kitchens}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="garages">Garages</Label>
              <Input
                type="number"
                id="garages"
                name="garages"
                placeholder="0"
                value={propertyState.garages || ""}
                onChange={handleChange}
              />
              {propertyState?.api_errors?.garages && (
                <div className="text-danger">
                  {propertyState.api_errors.garages}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="parking_spaces">Parking Spaces</Label>
              <Input
                type="number"
                id="parking_spaces"
                name="parking_spaces"
                placeholder="0"
                value={propertyState.parking_spaces || ""}
                onChange={handleChange}
              />
              {propertyState?.api_errors?.parking_spaces && (
                <div className="text-danger">
                  {propertyState.api_errors.parking_spaces}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="charge_type">Charge Type</Label>
              <Input
                type="select"
                id="charge_type"
                name="charge_type"
                value={propertyState.charge_type || ""}
                onChange={handleChange}
              >
                {chargeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Input>
              {propertyState?.api_errors?.charge_type && (
                <div className="text-danger">
                  {propertyState.api_errors.charge_type}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup>
              <Label for="epc_rating">EPC Rating</Label>
              <InputGroup style={{ width: "100%" }}>
                <Input
                  type="text"
                  id="epc_rating"
                  name="epc_rating"
                  className=""
                  value={propertyState.epc_rating || ""}
                  onChange={handleChange}
                ></Input>
                {propertyState?.api_errors?.epc_rating && (
                  <div className="text-danger">
                    {propertyState.api_errors.epc_rating}
                  </div>
                )}
              </InputGroup>
              {propertyState.address_one && !propertyState.epc_rating && (
                <small
                  className="text-danger"
                  style={{ marginTop: "5px", display: "block" }}
                >
                  No EPC rating found for this address.
                </small>
              )}
            </FormGroup>
          </Col>

          {propertyState.property_type === "FLAT" && (
            <>
              <Col sm={6}>
                <FormGroup>
                  <Label for="floor">Floor</Label>
                  <Input
                    type="number"
                    id="floor"
                    name="floor"
                    placeholder="0"
                    value={propertyState.floor || ""}
                    onChange={handleChange}
                  />
                  {propertyState?.api_errors?.floor && (
                    <div className="text-danger">
                      {propertyState.api_errors.floor}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label for="flats">Flats</Label>
                  <Input
                    type="number"
                    id="flats"
                    name="flats"
                    placeholder="0"
                    value={propertyState.flats || ""}
                    onChange={handleChange}
                  />
                  {propertyState?.api_errors?.flats && (
                    <div className="text-danger">
                      {propertyState.api_errors.flats}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </>
          )}

          {propertyState.property_type === "MULTI_UNIT_BLOCK" && (
            <Col sm={6}>
              <FormGroup>
                <Label for="number_of_units">Number of Units</Label>
                <Input
                  type="number"
                  id="number_of_units"
                  name="number_of_units"
                  placeholder="0"
                  value={propertyState.number_of_units || ""}
                  onChange={handleChange}
                />
                {propertyState?.api_errors?.number_of_units && (
                  <div className="text-danger">
                    {propertyState.api_errors.number_of_units}
                  </div>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default PropertyDetails;
