import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import Image from "next/image";
import { Card, CardBody } from "reactstrap";
import imageTwo from "../../../../../public/assets/images/logo/logo-dark.png";

const Info: React.FC = () => {
  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);
  return (
    <div className="sticky-top" style={{ top: "2rem" }}>
      <Card className="shadow bg-light-primary">
        <CardBody>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="pe-md-3">
              <h2 className="mb-2">Client Survey</h2>
              <p className="text-muted mb-3">
                Thanks for taking a moment to share your experience. Your
                feedback helps us improve our service.
              </p>
            </div>

            <div className="ms-md-3 d-flex align-items-center logo">
              <Image
                width={300}
                height={100}
                className="img-fluid for-dark mb-3"
                src={appearanceData?.logo || imageTwo}
                alt="company logo"
                priority
                style={{ width: "160px", height: "60px" }}
              />
            </div>
          </div>

          <div className="small text-muted mt-3">
            <div className="mb-2">
              Please answer honestly. Most questions are multiple-choice.
            </div>
            <div>
              Fields marked with <span className="text-danger">*</span> are
              required.
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Info;
