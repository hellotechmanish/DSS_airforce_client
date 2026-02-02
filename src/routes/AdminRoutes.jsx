//Sidebar Component Import
import HomePage from "../views/pages/HomePage";
import Alarm from "../views/pages/Alarm/Alarm";
import Setting from "../views/pages/Setting/Setting";
import UserMgt from "../views/pages/Managment/Usermgt/UserManagement";
import SitesMgt from "../views/pages/Managment/SitesMgt/SitesManagment";
import Resistence from "../views/pages/ResisteanceMonitoring/ResistanceTable";
import Temperature from "../views/pages/TemperatureMonitoring/TemperatureTable";
import SitesProfile from "../views/pages/Managment/SitesMgt/SitesProfile/sites-profile";
import TechnicianProfile from "../views/pages/Managment/Usermgt/UserTabs/TechProfile/TechnicianProfile";
import UserProfile from "../views/pages/Managment/Usermgt/UserTabs/UserProfile/UserProfile";
// Sidebar Icons Import
import dashLogo from "../assets/img/dash-logo.png";
import SettingLogo from "../assets/img/setting-logo.png";
import sitesLogo from "../assets/img/sites-logo.png";
import userLogo from "../assets/img/user-logo.png";
import AlarmLogo from "../assets/img/Alarm.png";
import RLogo from "../assets/img/R.png";
import TemoLogo from "../assets/img/temp.png";

const routes = [
  {
    invisible: false,
    link: "/dashboard",
    name: "Dashboard",
    icon: dashLogo,
    Element: <HomePage />,
  },
  {
    invisible: false,
    link: "/sites-mgt",
    name: "Site Management",
    icon: sitesLogo,
    Element: <SitesMgt />,
  },
  {
    invisible: false,
    link: "/user-management",
    Element: <UserMgt />,
    icon: userLogo,
    name: "User Management",
  },

  {
    invisible: false,
    link: "/resistence-monitoring",
    name: "Resistance Monitoring",
    icon: RLogo,
    Element: <Resistence />,
  },
  {
    invisible: false,
    link: "/temperature-monitoring",
    name: "Temperature Monitoring",
    icon: TemoLogo,
    Element: <Temperature />,
  },

  // {
  //   invisible: false,
  //   link: "/gn-monitoring",
  //   name: "GN Monitoring",
  //   icon: GnLogo,
  //   Element: <GnMonitoring />,
  // },
  // {
  //   invisible: false,
  //   link: "/spd-monitoring",
  //   name: "SPD Monitoring",
  //   icon: SpdLogo,
  //   Element: <SPDMonitoring />,
  // },
  // {
  //   invisible: false,
  //   link: "/phase-monitoring",
  //   name: "Phase Monitoring",
  //   icon: PhLogo,
  //   Element: <PhaseMonitoring />,
  // },
  {
    invisible: false,
    link: "/alarm",
    name: "Alarm",
    icon: AlarmLogo,
    Element: <Alarm />,
  },
  {
    invisible: false,
    link: "/setting",
    name: "Setting",
    icon: SettingLogo,
    Element: <Setting />,
  },
  {
    invisible: true,
    link: "/sites-profile",
    Element: <SitesProfile />,
  },
  {
    invisible: true,
    link: "/technician-profile",
    Element: <TechnicianProfile />,
  },
  {
    invisible: true,
    link: "/user-profile",
    Element: <UserProfile />,
  },
];

export default routes;
