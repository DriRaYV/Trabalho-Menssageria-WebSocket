import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
  const isAuthenticated = sessionStorage.getItem("user");

  return isAuthenticated ? (
    React.cloneElement(element as React.ReactElement, { ...rest })
  ) : (
    <Navigate to="/ " />
  );
};

export default PrivateRoute;
