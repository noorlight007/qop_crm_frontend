import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import SupportTicketDetails from "@/Components/General/Dashboard/CommonComponents/SupportTicket/SupportTicketDetails/SupportTicketDetails";

const SupportTicketDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Support Tickets"
        subTitle="This is the support ticket details page"
        parent="Support Tickets"
        child="Support Tickets Details"
      />
      <SupportTicketDetails />
    </div>
  );
};

export default SupportTicketDetailsContainer;
