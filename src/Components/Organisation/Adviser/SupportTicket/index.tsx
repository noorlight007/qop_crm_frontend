import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { SupportTicket } from "@/Constant";

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
