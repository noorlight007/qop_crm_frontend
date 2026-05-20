import { useAddAdvertiserAdMutation } from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";

const AddNewAdModal: React.FC = () => {
    const [addAd, { isLoading }] = useAddAdvertiserAdMutation();
    
  return (
    <div>
      {/* JSX here */}
    </div>
  );
};

export default AddNewAdModal;