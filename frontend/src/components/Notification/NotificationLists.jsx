
import React, { useState } from "react";
import {
  fetchNotificationsAPI,
  readNotificationAPI,
} from "../../APIServices/notifications/nofitificationsAPI";
import { useMutation, useQuery } from "@tanstack/react-query";

const Notifications = () => {
  const { data, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsAPI,
  });

  const [showRead, setShowRead] = useState(false);

  // Filter notifications
  const unreadNotifications = data?.notifications?.filter(
    (notification) => !notification.isRead
  );
  const readNotifications = data?.notifications?.filter(
    (notification) => notification.isRead
  );

  // Mutation for marking notifications as read
  const mutation = useMutation({
    mutationKey: ["read-notification"],
    mutationFn: readNotificationAPI,
  });

  // Read notification handler
  const readNotificationHandler = (id) => {
    mutation
      .mutateAsync(id)
      .then(() => {
        refetch();
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="flex justify-center items-start h-screen bg-gray-100">
      <div className="max-w-md w-full mt-5 bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
          <span>Notifications</span>
          <button
            onClick={() => setShowRead(!showRead)}
            className="text-xs bg-white text-[#1E3A8A] px-2 py-1 rounded-md hover:bg-gray-200 transition"
          >
            {showRead ? "View Unread Messages" : "View Read Messages"}
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 mt-3 overflow-auto">
          {showRead ? (
            readNotifications?.length === 0 ? (
              <p className="text-center text-gray-600 py-4">
                No read notifications
              </p>
            ) : (
              readNotifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b border-gray-200 px-4 py-3 bg-gray-200 flex items-center gap-3"
                >
                  <img
                    src={notification.userId.profilePicture || "/default-profile.png"}
                    alt="Sender Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-bold">{notification.message}</p>
                    <p className="text-xs text-black mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : unreadNotifications?.length === 0 ? (
            <p className="text-center text-gray-600 py-4">No new notifications</p>
          ) : (
            unreadNotifications?.map((notification) => (
              <div
                key={notification.id}
                onClick={() => readNotificationHandler(notification._id)}
                className="border-b cursor-pointer border-gray-200 px-4 py-3 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#CBD5E1] hover:to-[#93C5FD] hover:text-black flex items-center gap-3"
              >
                <img
                  src={notification.senderProfilePic || "/default-profile.png"}
                  alt="Sender Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
                <div>
                  <p className="text-sm font-bold">{notification.message}</p>
                  <p className="text-xs text-black mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
