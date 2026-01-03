// import { useQuery } from "@tanstack/react-query";
// import React from "react";
// import { IoMdNotifications } from "react-icons/io";
// import { Link } from "react-router-dom";
// import { fetchNotificationsAPI } from "../../APIServices/notifications/nofitificationsAPI";

// const NotificationCounts = ({userRole}) => {
//   const { data } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: fetchNotificationsAPI,
//   });
//   //filter unread notifications
//   console.log("Notification",data)
//   const unreadNotifications = data?.notifications?.filter(
//     (notification) => !notification.isRead
//   );
  

//   return (
//     <Link to={`/subscriber/notifications`}>
//       <div className="relative inline-block">
//         <IoMdNotifications className="text-2xl text-gray-700" />{" "}
//         <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full -translate-y-1/3 translate-x-1/3">
//           {unreadNotifications?.length || 0}
//         </span>
//       </div>
//     </Link>
//   );
// };

// export default NotificationCounts;
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { IoMdNotifications } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { fetchNotificationsAPI } from "../../APIServices/notifications/nofitificationsAPI";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";

const NotificationCounts = () => {

  const { isLoading, data: user } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
    refetchOnWindowFocus: true, 
  });
  
  const userRole = user?.role; 
  

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsAPI,
  });

  // Filter unread notifications
  const unreadNotifications = data?.notifications?.filter(
    (notification) => !notification.isRead
  );

  return (
    <Link to={`/${userRole}/notifications`}>
      <div className="relative inline-block">
        <div className="p-2 rounded-md bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white hover:bg-gradient-to-r hover:from-[#1E40AF] hover:to-[#2563EB] hover:text-black transition-all duration-300 ease-in-out shadow-md flex items-center justify-center">
          <IoMdNotifications className="text-2xl" />
        </div>
        {unreadNotifications?.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full -translate-y-1/3 translate-x-1/3 shadow-lg animate-bounce">
            {unreadNotifications?.length}
          </span>
        )}
      </div>
    </Link>
  );
};

export default NotificationCounts;
