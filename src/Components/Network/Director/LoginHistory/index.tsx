import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LoginHistory from "@/Components/Common/LoginHistory/LoginHistory";

const LoginHistoryContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Login Overview"
        subTitle="View the login history of users."
        items={[{ label: "Login History", active: true }]}
      />
      <LoginHistory />
    </div>
  );
};

export default LoginHistoryContainer;
