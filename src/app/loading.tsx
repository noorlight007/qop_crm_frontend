import { Spinner } from "reactstrap";

const LoadingSpinner = () => {
  return (
    <div className="d-flex h-100 justify-content-center align-items-center">
      <Spinner color="primary">Loading...</Spinner>
    </div>
  );
};

export default LoadingSpinner;
