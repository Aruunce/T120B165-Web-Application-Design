import React from 'react';

const Tweet = ({ content }) => {
  return (
    <div className="tweet">
      <p>{content}</p>
    </div>
  );
};

export default Tweet;