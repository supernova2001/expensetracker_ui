import React from 'react';

const Link = ({ to, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <a href={to} onClick={handleClick} style={{color: "black", textDecoration: "none"}}>
      {children}
    </a>
  );
}

export default Link;