import { useGetAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { Card } from "reactstrap";

const LogoAndFavIconChanger: React.FC = () => {
  const { data: appearanceData } = useGetAppranceQuery(undefined);
  return <Card>{/* JSX here */}</Card>;
};

export default LogoAndFavIconChanger;
