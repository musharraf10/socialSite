import React from "react";
import ContentTable from "./ContentTable";

const Videos = ({ statusFilter, handleStatusChange }) => {
  const rows = [
    {
      title: "React Video Tutorial",
      description: "Introduction to React fundamentals.",
      videoLink: "https://example.com/react-video",
      user: { name: "John Doe", id: "12345", role: "Admin" },
      status: "Posted",
    },
    {
      title: "Node.js Video Guide",
      description: "Deep dive into Node.js.",
      videoLink: "https://example.com/nodejs-video",
      user: { name: "Jane Smith", id: "67890", role: "Editor" },
      status: "Verified",
    },
    {
      title: "CSS Video Tricks",
      description: "Advanced CSS techniques.",
      videoLink: "https://youtu.be/1Sw7modBwsM?si=wi6lrgk-GOi7WINg",
      user: { name: "Alice Johnson", id: "11223", role: "Contributor" },
      status: "Rejected",
    },
    {
      title: "JavaScript ES6 Video",
      description: "New features in ES6.",
      videoLink: "https://example.com/js-es6-video",
      user: { name: "Bob Brown", id: "44556", role: "Admin" },
      status: "Posted",
    },
  ];

  return <ContentTable rows={rows} statusFilter={statusFilter} handleStatusChange={handleStatusChange} />;
};

export default Videos;