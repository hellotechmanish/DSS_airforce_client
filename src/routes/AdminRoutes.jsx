// Sidebar Component Import
import dashLogo from "../assets/img/dash-logo.png";
import SettingLogo from "../assets/img/setting-logo.png";
import sitesLogo from "../assets/img/sites-logo.png";
import userLogo from "../assets/img/user-logo.png";
import AlarmLogo from "../assets/img/Alarm.png";
import RLogo from "../assets/img/R.png";
import TemoLogo from "../assets/img/temp.png";
import { RiUserLocationFill } from "react-icons/ri";

const routes = [

  // ================= DASHBOARD =================
  {
    id: "dashboard",
    invisible: false,
    link: "/dashboard",
    name: "Dashboard",
    icon: dashLogo,
  },

  // ================= MANAGEMENT =================
  {
    id: "site-management",
    invisible: false,
    link: "/sites-mgt",
    name: "Site Management",
    icon: sitesLogo,
  },

  {
    id: "user-management",
    invisible: false,
    link: "/user-management",
    name: "User Management",
    icon: userLogo,
  },

  // ================= MONITORING =================
  {
    id: "resistance-Centralized-monitoring",
    invisible: false,
    link: "/resistance-Centralized-monitoring", // ⚠️ router file me bhi same hona chahiye
    name: "Resistance Centralized",
    icon: RLogo,
  },
  // ================= MONITORING =================
  {
    id: "resistance-monitoring",
    invisible: false,
    link: "/resistance-monitoring", // ⚠️ router file me bhi same hona chahiye
    name: "Resistance Monitoring",
    icon: RLogo,
  },

  {
    id: "temperature-monitoring",
    invisible: false,
    link: "/temperature-monitoring",
    name: "Temperature Monitoring",
    icon: TemoLogo,
  },

  // ================= SYSTEM =================
  {
    id: "alarm",
    invisible: false,
    link: "/alarm",
    name: "Alarm",
    icon: AlarmLogo,
  },

  {
    id: "setting",
    invisible: false,
    link: "/setting",
    name: "Settings",
    icon: SettingLogo,
  },

  // ================= HIDDEN ROUTES =================
  {
    id: "sites-profile",
    invisible: true,
    link: "/sites-profile",
    name: "sites-profile",
    icon: SettingLogo,
  },

  {
    id: "technician-profile",
    invisible: true,
    link: "/technician-profile",
    name: "technician-profile",
    icon: SettingLogo,
  },

  {
    id: "user-profile",
    invisible: true,
    link: "/user-profile",
    name: "user-profile",
    icon: RiUserLocationFill,
  },

];

export default routes;