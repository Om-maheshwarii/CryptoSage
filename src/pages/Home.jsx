import React, { useState, useEffect } from 'react'
import Header from '../components/Common/Header/Header'
import MainComponent from '../components/LandingPage/MainComponent/MainComponent'
import Grid from '../components/Dashboard/Grid/Grid'
import axios from "axios"
import './home.css'


const HomePage = () => {
    const [coins, setCoins] = useState([])

    useEffect(() => {
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
            .then((response) => {
                console.log(response)
                setCoins(response.data)
            })
            .catch((error) => {

            })
    }, []);

    return (
        <div>
            <Header />
            <MainComponent />
            <div className='grid-flex' style={{ marginTop: "10rem" }}>
                {coins.map((coin, i) => {
                    return <Grid coin={coin} key={i} />
                })}
            </div>

        </div>
    )
}

export default HomePage
