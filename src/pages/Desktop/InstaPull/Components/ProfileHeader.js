import React from "react";
import { Image, Button, Row, Col, Badge } from "react-bootstrap";

const ProfileHeader = ({ profile }) => {
  const {
    full_name,
    username,
    profile_pic_url,
    is_verified,
    bio,
    followersCount,
    followingCount,
    postsCount,
  } = profile;

  return (
    <div className="mb-4">
      <Row className="align-items-center">
        <Col xs={12} md={4} className="text-center">
          <Image
            src={
              profile_pic_url ||
              "https://media.licdn.com/dms/image/v2/D4D03AQFOlMrVmzf8Zg/profile-displayphoto-shrink_400_400/B4DZOnDVWOHoAo-/0/1733674489988?e=1740009600&v=beta&t=0Bp0rCygKyXDsWcHAK6vHqS1YE_DOfVhVf-c6cj7yMo"
            }
            alt={`${username} profile`}
            roundedCircle
            width="150"
            height="150"
            className="mb-3 mb-md-0"
          />
        </Col>
        <Col xs={12} md={8}>
          <div className="d-flex align-items-center mb-3">
            <h2 className="me-3 mb-0">
              {username} {is_verified && <Badge bg="primary">✔️</Badge>}
            </h2>
            <Button variant="outline-primary" className="me-2">
              Follow
            </Button>
            <Button variant="outline-secondary">Message</Button>
          </div>
          <div className="d-flex mb-3">
            <div className="me-4">
              <strong>{postsCount}</strong> posts
            </div>
            <div className="me-4">
              <strong>{followersCount}</strong> followers
            </div>
            <div>
              <strong>{followingCount}</strong> following
            </div>
          </div>
          <div className="mb-1">
            <strong>{full_name}</strong>
          </div>
          <div>{bio}</div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileHeader;
