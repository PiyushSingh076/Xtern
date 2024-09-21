import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ link }) => {
  return (
    <>
      <footer id="let-you-footer">
        <div className="block-footer">
          {link === "/signin" ? (
            <p>
              Already have an account? <Link to={link}>Sign In</Link>
            </p>
          ) : (
            <p>
              Don’t have an account? <Link to={link}>Sign Up</Link>
            </p>
          )}
        </div>
      </footer>
    </>
  );
};
export default Footer;
