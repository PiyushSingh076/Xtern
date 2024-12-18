import React from "react";
import { Card, Badge } from "react-bootstrap";
import "./Post.css";

const Post = ({ post }) => {
  const formatTimestamp = (timestamp) => {
    const postDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return postDate.toLocaleDateString();
  };

  const renderPostContent = () => {
    switch (post.type) {
      case "Image":
        return (
          <Card.Img
            variant="top"
            src={post.displayUrl}
            alt={post.caption}
            className="post-img"
          />
        );
      case "Video":
        return (
          <video controls className="w-100">
            <source src={post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "Sidecar":
        return (
          <div className="d-flex flex-wrap">
            {post.childPosts.slice(0, 4).map((childPost, index) => (
              <div key={childPost.id} className="w-50 p-1 position-relative">
                <img
                  src={childPost.displayUrl}
                  alt={childPost.caption}
                  className="img-fluid rounded"
                />
                {index === 3 && post.childPosts.length > 4 && (
                  <div className="overlay">
                    <Badge bg="secondary">+{post.childPosts.length - 4}</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm h-100">
      <div className="position-relative">
        {renderPostContent()}
        {(post.type === "Image" || post.type === "Sidecar") && (
          <div className="position-absolute top-0 end-0 p-2">
            <span role="img" aria-label="likes">
              ❤️
            </span>{" "}
            {post.likesCount}
          </div>
        )}
      </div>
      <Card.Body>
        <Card.Text>
          <strong>{post.ownerUsername}</strong> {post.caption}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <span>❤️ {post.likesCount} likes</span>
          <span>{formatTimestamp(post.timestamp)}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
