import airforceLogo from "../assets/img/Airforce-logo.png";
import dssLogo from "../assets/img/dss-logo.png";

const configuredLogo = process.env.REACT_APP_VITE_NAVBAR_LOGO;
const bundledLogos = {
  "/src/assets/img/Airforce-logo.png": airforceLogo,
  "/src/assets/img/dss-logo.png": dssLogo,
};

export const navbarLogo = bundledLogos[configuredLogo] || configuredLogo || dssLogo;
export const navbarTitle = process.env.REACT_APP_VITE_NAVBAR_TITLE || "DSS";
export const navbarSubtitle =
  process.env.REACT_APP_VITE_NAVBAR_SUBTITLE || "ONLINE MONITORING SYSTEM";
