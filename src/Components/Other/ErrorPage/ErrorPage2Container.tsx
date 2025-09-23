import { Error2 } from "@/Data/Pages/PagesSvgIcons";
import CommonErrorPage from "./Common/CommonErrorPage";

const ErrorPage2Container = () => {
  return (
    <CommonErrorPage
      title="Oops! This Page is Not Found."
      subTitle="The page you are attempting to reach is currently not available. This may be because the page does not exist or has been moved."
      errorIcon={<Error2 />}
    />
  );
};
export default ErrorPage2Container;
