import React from "./React.js";

// console.log("React", React);

const reactDom = {
  createRoot(container) {
    return {
      render(APP) {
        React.render(APP, container);
      },
    };
  },
};

export default reactDom;
