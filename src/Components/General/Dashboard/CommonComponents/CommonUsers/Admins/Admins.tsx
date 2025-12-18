import { useGetAuthUsersQuery } from "@/Redux/Reducers/CommonComponents/CommonUsers/AuthUsersApi";

const Admins: React.FC = () => {
  const { data: authUsersData, isLoading } = useGetAuthUsersQuery({
    organization_users__role: "ORGANISATION_ADMIN",
  });
  console.log("USERS::", authUsersData);
  
  return <div>{/* JSX here */}</div>;
};

export default Admins;
