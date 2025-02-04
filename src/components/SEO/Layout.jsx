import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

const Layout = ({ title, description, keywords }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Optacloud" />
        <title>{title}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default Layout;
