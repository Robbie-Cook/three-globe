import React from "react";

const Basic: React.FC<{ function: React.EffectCallback }> = (props) => {
  React.useEffect(props.function, []);

  return <div id="globeViz"></div>;
};

export default Basic;
