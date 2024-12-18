import React from "react";
import Post from "./Post";
import { Row, Col } from "react-bootstrap";

const PostsGrid = ({ posts }) => {
  return (
    <Row>
      {posts.map((post) => (
        <Col key={post.id} lg={4} md={6} sm={12} className="mb-4">
          <Post post={post} />
        </Col>
      ))}
    </Row>
  );
};

export default PostsGrid;
