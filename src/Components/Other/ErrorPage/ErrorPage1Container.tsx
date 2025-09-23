import { Error1 } from "@/Data/Pages/PagesSvgIcons";
import CommonErrorPage from "./Common/CommonErrorPage";

const ErrorPage1Container = () => {
  return (
    <CommonErrorPage
      title="Error Occurred"
      subTitle="Oops! An unexpected error occurred. Our team has been notified and is working to fix this issue. Please try again later or contact support if the problem persists."
      errorIcon={<Error1 />}
    />
  );
};
export default ErrorPage1Container;
