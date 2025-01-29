import React from "react";
import { Helmet } from "react-helmet";

const Layout = ({ title, description, keywords }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={"Optacloud"} />
        <title>{title}</title>
      </Helmet>
      
    </div>
  );
};

export default Layout;
