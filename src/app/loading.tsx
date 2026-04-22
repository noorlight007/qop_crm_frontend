import { Spinner } from "reactstrap";

const LoadingSpinner = () => {
  const spinnerColors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
  ] as const;

  return (
    <div className="d-flex justify-content-center align-items-center ">
      <div className="d-flex flex-column align-items-center gap-4 p-4 rounded-4 ">
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
          {spinnerColors.map((color, index) => (
            <Spinner
              key={color}
              color={color}
              type="grow"
              style={{
                width: index % 2 === 0 ? "0.9rem" : "1.35rem",
                height: index % 2 === 0 ? "0.9rem" : "1.35rem",
                animationDuration: index % 2 === 0 ? "0.9s" : "1.2s",
              }}
            >
              Loading...
            </Spinner>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
