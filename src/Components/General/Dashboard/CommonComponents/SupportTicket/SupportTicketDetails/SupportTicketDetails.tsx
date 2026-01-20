import { useParams } from "next/navigation";

const SupportTicketDetails: React.FC = () => {
  const { supportticketalias } = useParams();

  return (
    <div>
      {/* JSX here */}
      <h1>Support Ticket Details</h1>
    </div>
  );
};

export default SupportTicketDetails;
