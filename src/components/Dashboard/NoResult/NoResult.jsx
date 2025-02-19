import React from 'react';
import "./noResult.css";

const NoResults = ({ clearSearch }) => {
    return (
        <div className="no-results-container">
            <h2 className="no-results-text">
                Sorry, no matching cryptocurrencies found
            </h2>
            <button
                onClick={clearSearch}
                className="clear-search-button"
            >
                Clear Search
            </button>
        </div>
    );
};

export default NoResults;