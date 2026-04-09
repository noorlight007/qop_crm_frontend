import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SupportTicket from "@/Components/Common/SupportTicket/SupportTicket";

const SupportTicketContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Support Ticket Overview"
        subTitle="Welcome back! Check all the Support Tickets"
        items={[{ label: "Support Tickets", active: true }]}
      />
      <SupportTicket />
    </>
  );
};

export default SupportTicketContainer;
