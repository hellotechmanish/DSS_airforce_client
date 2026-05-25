import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "../App";
import { routes } from "./RouterConfig";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
  },
]);

const AllRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AllRoutes;
