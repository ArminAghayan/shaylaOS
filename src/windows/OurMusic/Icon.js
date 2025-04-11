import React from "react";
import PropTypes from "prop-types";

export default function Icon({
  name,
  owner,
  avatar,
  highlighted,
  onSingleClick,
  onDoubleClick,
}) {
  return (
    <button
      data-name={name + owner}
      className={`trendingIcon${highlighted ? " -highlighted" : ""}`}
      onClick={onSingleClick}
      onDoubleClick={onDoubleClick}
    >
      <img 
        src={avatar} 
        alt={name}
        className="trendingIcon__image pixelated"
      />
      <p className="trendingIcon__name" title={name}>{name}</p>
    </button>
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  owner: PropTypes.string,
  avatar: PropTypes.string.isRequired,
  highlighted: PropTypes.bool.isRequired,
  onSingleClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

Icon.defaultProps = {
  owner: "",
}; 