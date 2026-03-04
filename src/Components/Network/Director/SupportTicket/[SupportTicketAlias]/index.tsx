import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SupportTicketDetails from "@/Components/Common/SupportTicket/SupportTicketDetails/SupportTicketDetails";

const SupportTicketDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Support Ticket Details"
        subTitle="This is the support ticket details page"
        items={[
          { label: "Support Tickets" },
          { label: "Support Ticket Details", active: true },
        ]}
      />
      <SupportTicketDetails />
    </div>
  );
};

export default SupportTicketDetailsContainer;
