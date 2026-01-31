import React from "react";

const Header = ({ name }) => {
  return (
    <header className="site-header">
      <div className="brand">
        <h1 className="title">A Scientific Calculator</h1>
        <p className="subtitle">Made by {name}</p>
      </div>
    </header>
  );
};

export default Header;
