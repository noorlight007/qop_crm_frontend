import {
  useGetAppranceQuery,
  useUpdateAppearanceMutation,
} from "@/Redux/Reducers/Appearance/AppearanceApi";
import { PlusCircle } from "react-feather";
import { Button, Card, CardBody, CardHeader } from "reactstrap";

const About: React.FC = () => {
  const { data: appearanceData } = useGetAppranceQuery(undefined);
  const [updateAbout, { isLoading: isUpdatingAbout }] =
    useUpdateAppearanceMutation();
  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h3>About</h3>
        <Button
          color="primary"
          disabled={isUpdatingAbout}
          onClick={() => {
            updateAbout({
              about: appearanceData?.about || "",
            });
          }}
        >
          <PlusCircle className="me-1" size={18} />
          {isUpdatingAbout ? "Updating..." : "Update About Info"}
        </Button>
      </CardHeader>
      <CardBody>
        {appearanceData?.about ? (
          appearanceData.about
        ) : (
          <p className="text-muted">No about information available.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default About;
