import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SupportTicketDetails from "@/Components/General/Dashboard/CommonComponents/SupportTicket/SupportTicketDetails/SupportTicketDetails";

const SupportTicketDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Support Ticket Details"
        subTitle="This is the support ticket details page"
        parent="Support Tickets"
        child="Support Ticket Details"
      />
      <SupportTicketDetails />
    </div>
  );
};

export default SupportTicketDetailsContainer;
