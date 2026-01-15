import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import Image from "next/image";
import Link from "next/link";
import { Card } from "reactstrap";
import imageTwo from "../../../../public/assets/images/logo/logo-dark.png";

const AboutOrg: React.FC = () => {
  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);

  return (
    <Card className="p-3 mb-3">
      <div className="d-flex justify-content-center">
        <Link className="logo" href="/">
          <Image
            width={300}
            height={100}
            className="img-fluid for-dark mb-3"
            src={appearanceData?.logo || imageTwo}
            alt="login page"
            priority
            style={{ width: "160px", height: "60px", objectFit: "cover" }}
          />
        </Link>
      </div>
      <h4>About Test Company</h4>
      <p className="text-title-gray">
        This section contains information about the organization. Please review
        the details before proceeding with your enquiry.
      </p>
      <div className="d-flex justify-content-center">
        <Image
        src="/assets/images/building.png"
        alt="Organization"
        width={250}
        height={150}
        className="img-fluid"
      />
      </div>
      
    </Card>
  );
};

export default AboutOrg;
