import React, { useState, useEffect } from 'react';

const Router = ({ routes }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('popstate', onLocationChange);

    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  }

  const renderComponent = () => {
    const route = routes.find(route => {
      if (route.exact) {
        return route.path === currentPath;
      }
      return currentPath.startsWith(route.path);
    }) || routes.find(route => route.path === '*');

    const Component = route.component;
    return <Component navigate={navigate} />;
  }

  return renderComponent();
}

export default Router;