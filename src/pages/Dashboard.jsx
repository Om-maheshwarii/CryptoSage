import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header/Header";
import TabsComponent from "../components/Dashboard/Tabs/Tabs";
import axios from "axios";
import Search from "../components/Dashboard/Searcch/Search";
import NoResults from "../components/Dashboard/NoResult/NoResult";
import Pagination from "../components/Dashboard/Pagination/Pagination";
import LoaderComponent from "../components/Common/Loader/Loader";

const DashboardPage = () => {
    const [coins, setCoins] = useState([]);
    const [paginatedCoins, setPaginatedCoins] = useState([])
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true)
    const handlePageChange = (event, value) => {
        setPage(value);
        var previousIndex = (value - 1) * 10;
        setPaginatedCoins(coins.slice(previousIndex, previousIndex + 10))
    };



    const onSearchChange = (e) => {
        // console.log(search)
        setSearch(e.target.value);
    };

    const clearSearch = () => {
        setSearch("");
    };

    var filteredCoins = coins.filter(
        (coin) =>
            coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
    );


    useEffect(() => {
        axios
            .get(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
            )
            .then((response) => {
                console.log(response);
                setCoins(response.data);
                setPaginatedCoins(response.data.slice(0, 10))
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
            });
    }, []);

    return (
        <>
            <Header />
            {isLoading ? (<LoaderComponent />) : (
                <div>

                    <Search search={search} onSearchChange={onSearchChange} />
                    {search.trim() !== "" && filteredCoins.length === 0 ? (
                        <NoResults clearSearch={clearSearch} />
                    ) : (
                        <TabsComponent coins={search ? filteredCoins : paginatedCoins} />
                    )}
                    {!search && (
                        <Pagination
                            page={page}
                            handlePageChange={handlePageChange} />
                    )}
                </div>
            )}
        </>

    );
};

export default DashboardPage;
