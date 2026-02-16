import { useFetchSupportTicketCommentsQuery } from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const SupportTicketComments: React.FC = () => {
  const { supportticketalias } = useParams();
  const { data: session } = useSession();

  const { data: comments, isLoading } = useFetchSupportTicketCommentsQuery(
    { ticket_alias: supportticketalias as string },
    { skip: !supportticketalias },
  );
  console.log("C::", comments);

  return <div>sdsd</div>;
};

export default SupportTicketComments;
