import React from "react";
import ContentTable from "./ContentTable";

const TutorialsGuides = ({ statusFilter, handleStatusChange }) => {
  const rows = [
    {
      title: "React Tutorial",
      description: "Introduction to React fundamentals.",
      image: "https://via.placeholder.com/100",
      user: { name: "John Doe", id: "12345", role: "Admin" },
      status: "Posted",
    },
    {
      title: "Node.js Guide",
      description: "Deep dive into Node.js.",
      image: "https://via.placeholder.com/100",
      user: { name: "Jane Smith", id: "67890", role: "Editor" },
      status: "Verified",
    },
    {
      title: "CSS Tricks Guide",
      description: "Advanced CSS techniques.",
      image: "https://via.placeholder.com/100",
      user: { name: "Alice Johnson", id: "11223", role: "Contributor" },
      status: "Rejected",
    },
    {
      title: "JavaScript ES6 Guide",
      description: "New features in ES6.",
      image: "https://via.placeholder.com/100",
      user: { name: "Bob Brown", id: "44556", role: "Admin" },
      status: "Posted",
    },
  ];

  return <ContentTable rows={rows} statusFilter={statusFilter} handleStatusChange={handleStatusChange} />;
};

export default TutorialsGuides;