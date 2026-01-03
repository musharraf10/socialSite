import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";
import { Navigate } from "react-router-dom";
import AuthCheckingComponent from "../Templates/AuthCheckingComponent";

const AuthRoute = ({ children, allowedRoles }) => {
  const queryClient = useQueryClient(); // React Query client instance

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
    refetchOnWindowFocus: true,
    staleTime: 0,  
    cacheTime: 0,  
  });

  console.log("userdata",data)
  useEffect(() => {
    refetch(); // Ensure fresh authentication data when component mounts
  }, [refetch]);

  if (isLoading) return <AuthCheckingComponent />;

  if (!data) return <Navigate to="/login" />;

  const userRole = data?.role;
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRoute;
