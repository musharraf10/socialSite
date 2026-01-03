import React from "react";
import ContentTable from "./ContentTable";

const Articles = ({ statusFilter, handleStatusChange }) => {
  const rows = [
    {
      title: "React Basics",
      description: "Introduction to React fundamentals.",
      image: "https://images.search.yahoo.com/search/images?p=sample+images&fr=mcafee&type=E210US885G91852&imgurl=https%3A%2F%2Fi2.wp.com%2Fthenewcamera.com%2Fwp-content%2Fuploads%2F2016%2F01%2FNikon-D500-Sample-Image-3.jpg#id=0&iurl=https%3A%2F%2Fi2.wp.com%2Fthenewcamera.com%2Fwp-content%2Fuploads%2F2016%2F01%2FNikon-D500-Sample-Image-3.jpg&action=click",
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
      title: "CSS Tricks",
      description: "Advanced CSS techniques.",
      image: "https://via.placeholder.com/100",
      user: { name: "Alice Johnson", id: "11223", role: "Contributor" },
      status: "Rejected",
    },
    {
      title: "JavaScript ES6",
      description: "New features in ES6.",
      image: "https://via.placeholder.com/100",
      user: { name: "Bob Brown", id: "44556", role: "Admin" },
      status: "Posted",
    },
  ];

  return <ContentTable rows={rows} statusFilter={statusFilter} handleStatusChange={handleStatusChange} />;
};

export default Articles;