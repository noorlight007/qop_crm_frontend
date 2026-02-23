import { useUpdatePropertyMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/SecurityPropertyApi";
import { FoundPropertyProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SecurityPropertyTypes";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

const FoundProperty: React.FC<FoundPropertyProps> = ({
  onPropertyFound,
  property,
}) => {
  const { casealias } = useParams();
  const propertyAlias = property.alias;
  const { data: session } = useSession();

  // RTK Hooks
  const [updateSingleProperty, { isLoading }] = useUpdatePropertyMutation();

  const [foundProperty, setFoundProperty] = useState<boolean>(
    Boolean(property.have_you_found_a_property_yet),
  );

  useEffect(() => {
    setFoundProperty(Boolean(property.have_you_found_a_property_yet));
  }, [property.have_you_found_a_property_yet]);

  const handlePropertyFound = async (value: boolean) => {
    setFoundProperty(value);
    onPropertyFound(value);
    await updateSingleProperty({
      case_alias: casealias,
      property_alias: propertyAlias,
      updatedSecurityProperty: {
        have_you_found_a_property_yet: value,
      },
    });
  };

  return (
    <>
      <Card className="mb-2">
        <CardHeader className="py-3">
          <Row className="align-items-center">
            <Col lg={12}>
              <div className="d-flex align-items-center">
                <Label
                  className="mb-0 fw-semibold me-4"
                  style={{ fontSize: "15px" }}
                  for="have_you_found_a_property_yet"
                >
                  Is a property being insured? If so, do you know which property
                  is covered by this policy?
                  <span
                    className="text-danger"
                    style={{ visibility: "hidden" }}
                  >
                    *
                  </span>
                </Label>
                <div className="d-flex align-items-center gap-3">
                  <FormGroup check className="mb-0">
                    <Input
                      type="radio"
                      id="FoundPrimaryPropertyYes"
                      name="have_you_found_a_property_yet"
                      value="true"
                      checked={foundProperty === true}
                      onChange={() => handlePropertyFound(true)}
                      className="cursor-pointer me-2"
                      disabled={session?.user?.user_type === "CLIENT"}
                    />
                    <Label
                      for="FoundPrimaryPropertyYes"
                      check
                      className="cursor-pointer mb-0"
                    >
                      Yes
                    </Label>
                  </FormGroup>
                  <FormGroup check className="mb-0">
                    <Input
                      type="radio"
                      id="FoundPrimaryPropertyNo"
                      name="have_you_found_a_property_yet"
                      value="false"
                      checked={foundProperty === false}
                      onChange={() => handlePropertyFound(false)}
                      className="cursor-pointer me-2"
                      disabled={session?.user?.user_type === "CLIENT"}
                    />
                    <Label
                      for="FoundPrimaryPropertyNo"
                      check
                      className="cursor-pointer mb-0"
                    >
                      No
                    </Label>
                  </FormGroup>
                </div>
              </div>
            </Col>
          </Row>
        </CardHeader>
      </Card>
    </>
  );
};

export default FoundProperty;
