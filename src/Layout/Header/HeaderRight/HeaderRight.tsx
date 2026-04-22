import DarkMode from "./DarkMode/DarkMode";
import NotificationHeader from "./NotificationHeader/NotificationHeader";
import Profile from "./Profile/Profile";

const HeaderRight = () => {
  return (
    <div className="nav-right">
      <ul className="header-right">
        <DarkMode />
        <NotificationHeader />
        <Profile />
      </ul>
    </div>
  );
};

export default HeaderRight;
