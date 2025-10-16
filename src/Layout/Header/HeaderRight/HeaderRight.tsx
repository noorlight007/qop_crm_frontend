import DarkMode from "./DarkMode/DarkMode";
import MaximizeScreen from "./MaximizeScreen/MaximizeScreen";
import NotificationHeader from "./NotificationHeader/NotificationHeader";
import Profile from "./Profile/Profile";
import ResponsiveSearch from "./ResponsiveSearch/ResponsiveSearch";

const HeaderRight = () => {
  return (
    <div className="nav-right">
      <ul className="header-right">
        <ResponsiveSearch />
        <DarkMode />
        {/* <NotificationHeader /> */}
        <MaximizeScreen />
        <Profile />
      </ul>
    </div>
  );
};

export default HeaderRight;
