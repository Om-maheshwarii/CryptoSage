import * as React from "react";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import './pagination.css'

export default function PaginationComponent({ page, handlePageChange }) {


    return (
        <div className="pagination-div">
            <Pagination
                sx={{
                    "& .MuiPaginationItem-text": {
                        color: "#fff !important",
                        border: "1px solid var(--lightpurple)",
                    },
                    "& .MuiPaginationItem-text:hover": {
                        backgroundColor: "transparent !important",
                    },
                    "& .Mui-selected  ": {
                        backgroundColor: "var(--lightpurple)",
                        borderColor: "var(--lightpurple)",
                    },
                    "& .MuiPaginationItem-ellipsis": {
                        border: "none",
                    },
                }}
                count={10}
                page={page}
                onChange={handlePageChange}
            />



        </div>
    );
}
