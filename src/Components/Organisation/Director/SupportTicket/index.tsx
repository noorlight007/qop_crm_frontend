import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SupportTicket from "@/Components/Common/SupportTicket/SupportTicket";

const SupportTicketContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Support Tickets"
        subTitle="This is the support ticket page"
        items={[{ label: "Support Tickets", active: true }]}
      />
      <SupportTicket />
    </div>
  );
};

export default SupportTicketContainer;
