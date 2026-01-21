import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import Image from "next/image";
import { Card } from "reactstrap";
import imageTwo from "../../../../public/assets/images/logo/logo-dark.png";

const AboutOrg: React.FC = () => {
  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);

  return (
    <Card className="p-3 mb-3">
      <div className="d-flex justify-content-center">
        <div className="logo">
          <Image
            width={300}
            height={100}
            className="img-fluid for-dark mb-3"
            src={appearanceData?.logo || imageTwo}
            alt="login page"
            priority
            style={{ width: "160px", height: "60px" }}
          />
        </div>
      </div>
      <h4>
        About Our <b>{appearanceData?.site_title || "Company"}</b>
      </h4>
      <p className="text-title-gray">
        {appearanceData?.about
          ? appearanceData.about
          : "No description available."}
      </p>
      <div className="d-flex justify-content-center mt-4">
        <Image
          src="/assets/images/building.svg"
          alt={appearanceData?.site_title || "Company"}
          width={250}
          height={150}
          className="img-fluid"
        />
      </div>
    </Card>
  );
};

export default AboutOrg;
