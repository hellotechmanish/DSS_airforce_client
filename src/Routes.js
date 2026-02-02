import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeApp from "./App";
import { routes } from "./RouterConfig";

export function Fallback() {
  return <p>Loading</p>;
}

let router = createBrowserRouter([
  {
    path: "/",
    element: <HomeApp />,
    children: routes,
  },
]);

const AllRoutes = () => {
  return (
    <RouterProvider router={router} fallbackElement={<Fallback />}>
      <HomeApp />
    </RouterProvider>
  );
};
export default AllRoutes;
