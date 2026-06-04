import Breadcrumbs from '@/Components/Common/Breadcrumbs/Breadcrumbs';
import SupportTicket from '@/Components/Common/SupportTicket/SupportTicket';

const SupportTicketContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title='Support Tickets'
        subTitle='View and manage your support tickets'
        items={[{ label: 'Support Tickets', active: true }]}
      />
      <SupportTicket />
    </div>
  );
};

export default SupportTicketContainer;
