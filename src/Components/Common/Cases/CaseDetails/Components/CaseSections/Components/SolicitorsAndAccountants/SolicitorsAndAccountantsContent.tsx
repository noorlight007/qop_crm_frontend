import Accountant from "./Accountant/Accountant";
import Solicitor from "./Solicitor/Solicitor";

interface SolicitorsAndAccountantsContentProps {
  activeTab: string;
}

const SolicitorsAndAccountantsContent: React.FC<
  SolicitorsAndAccountantsContentProps
> = ({ activeTab }) => {
  return (
    <div>
      {activeTab === "solicitor" && <Solicitor />}
      {activeTab === "accountant" && <Accountant />}
    </div>
  );
};

export default SolicitorsAndAccountantsContent;
