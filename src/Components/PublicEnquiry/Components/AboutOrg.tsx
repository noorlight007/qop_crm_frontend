import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import Image from "next/image";
import { useState } from "react";
import { Card, CardBody } from "reactstrap";
import imageTwo from "../../../../public/assets/images/logo/logo-dark.png";

const MAX_CHARS = 180;

const AboutOrg: React.FC = () => {
  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);
  const [expanded, setExpanded] = useState(false);

  const description = appearanceData?.about || "No description available.";
  const isLong = description.length > MAX_CHARS;
  const displayText =
    !isLong || expanded ? description : description.slice(0, MAX_CHARS) + "...";

  return (
    <Card
      className="shadow-lg border-0"
      style={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardBody
        className="p-4"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        {/* Logo */}
        <div className="d-flex justify-content-center mb-3">
          <Image
            width={300}
            height={100}
            className="img-fluid for-dark"
            src={appearanceData?.logo || imageTwo}
            alt="Company logo"
            priority
            style={{ width: "160px", height: "60px", objectFit: "contain" }}
          />
        </div>

        {/* Company Name — centered */}
        <h4 className="text-center mb-2">
          About Our <b>{appearanceData?.site_title || "Company"}</b>
        </h4>

        {/* Divider */}
        <hr className="my-3" />

        {/* Description — justified with truncation */}
        <p
          className="text-muted mb-1"
          style={{ textAlign: "justify", lineHeight: "1.7" }}
        >
          {displayText}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="btn btn-link p-0 text-primary"
            style={{ fontSize: "0.875rem", textDecoration: "none" }}
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}

        {/* Illustration — pushed to bottom */}
        <div className="d-flex justify-content-center mt-auto pt-4">
          <Image
            src="/assets/images/building.svg"
            alt={appearanceData?.site_title || "Company"}
            width={250}
            height={150}
            className="img-fluid"
            style={{ opacity: 0.85 }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default AboutOrg;