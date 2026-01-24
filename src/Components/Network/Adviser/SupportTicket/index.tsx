import Breadcrumbs from "../../../../../Common/Breadcrumbs/Breadcrumbs";
import SupportTicket from "../../../CommonComponents/SupportTicket/SupportTicket";

const SupportTicketContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Support Tickets"
        subTitle="This is the support ticket page"
        parent="Support Tickets"
      />
      <SupportTicket />
    </div>
  );
};

export default SupportTicketContainer;
