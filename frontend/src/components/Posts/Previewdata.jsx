import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Previewdata({ post, show, onHide }) {
  //   const post = {
  //     title: "Sample Post",
  //     price: "$20",
  //     content: "This is a sample content for the post."
  //   };

  return (
    <Modal
      className="postdetailsmodal text-capitalize"
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Post Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="postdetailsmodalbody">
        <p>
          <strong>Title:</strong> {post?.refId.title}
        </p>
        <p>
          <strong>Price:</strong> {post?.price}
        </p>
        <p>
          <strong>Content:</strong>
        </p>
        <div dangerouslySetInnerHTML={{ __html: post?.refId.description }} />
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
