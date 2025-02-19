import React, { useState } from "react";
import "./search.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const Search = ({ search, onSearchChange }) => {

    return (
        <div className="search-flex">
            <SearchRoundedIcon className="search-icon" />
            <input
                id="search"
                placeholder="Search"
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e)}
            />
        </div>
    );
};

export default Search;
