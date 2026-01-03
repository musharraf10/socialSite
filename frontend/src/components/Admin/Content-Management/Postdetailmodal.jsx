import React from "react";
import { Modal, Button, Accordion } from "react-bootstrap";
import "./postdetailmodal.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PostDetailsModal({ post, show, onHide }) {
  return (
    <Modal  className="postdetailsmodal text-capitalize" show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Post Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="postdetailsmodalbody">
        <p><strong>Title:</strong> {post.refId?.title || "Untitled"}</p>
        <p><strong>Author:</strong> {post.author?.username || "Unknown"}</p>
        <p><strong>Description:</strong> {post.refId?.description || "No description available"}</p>
        <p><strong>Status:</strong> {post.status || "N/A"}</p>
         
        {post.image && (
          <div className="card">
            <img className="imginmodal" src={post.refId.thumbnail} alt="Post" style={{  borderRadius: "10px" }} />
          </div>
        )}  
       
        <p className="mt-3"><strong>Created:</strong> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown"}</p>
        <p><strong>Updated:</strong> {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "Unknown"}</p>

        {post.status === "approved" && (
          <>
            <p><strong>Published Date :</strong>
            
             {/* {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : "Unknown"} */}
             {new Date(post.updatedAt).toLocaleDateString("en-GB")}
             
             
             </p>
            <p><strong>Likes:</strong> {post.likes?.length || 0}</p>
            <p><strong>View Count:</strong> {post.viewCount || 0}</p>
          </>
        )}

        {post.status === "approved" && post.comments?.length > 0 && (
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Comments</Accordion.Header>
              <Accordion.Body>
                <ul>
                  {post.comments.map((comment, index) => (
                    <li key={index}>
                      <strong>{comment.author?.username || "Anonymous"}:</strong> {comment.content || "No content"}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button  onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>

  );
}
