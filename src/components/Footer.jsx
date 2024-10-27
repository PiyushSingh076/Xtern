import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ link, type }) => {
  return (
    <>
      <footer id="let-you-footer">
        <div className="block-footer">
          {type === "signin" ? (
            <p>
              Don’t have an account? <Link to={link}>Sign Up</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link to={link}>Sign In</Link>
            </p>
          )}
        </div>
      </footer>
    </>
  );
};
export default Footer;
