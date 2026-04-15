import { useGetAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

const WelcomeMessage: React.FC = () => {
  const { data: appearanceData } = useGetAppranceQuery(undefined);

  return (
    <Card className="mb-4">
      {/* <CardHeader> */}
        <h4 className="text-primary p-3 mb-0">
          Welcome to {appearanceData?.site_title || "QOP"}!
        </h4>
      {/* </CardHeader> */}
      {/* <CardBody>
        {appearanceData?.about ? (
          <p className="text-muted">{appearanceData?.about}</p>
        ) : (
          <p className="text-muted">No information available.</p>
        )}
      </CardBody> */}
    </Card>
  );
};

export default WelcomeMessage;
