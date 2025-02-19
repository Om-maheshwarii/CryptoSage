import React from 'react'
import './styles.css'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import { convertNumber } from '../../../functions/convertNumber';


const List = ({ coin, delay }) => {
    return (
        <tr className='List-row'>
            <Tooltip title='coin-logo'>
                <td className='td-image '>  <img src={coin.image} className='coin-logo td-small-icon' /></td>
            </Tooltip>
            <Tooltip title='Coin Symbol & Name'>
                <td className="info-flex">
                    <div className='name-col'>
                        <p className='coin-symbol td-smaller'>{coin.symbol}</p>
                        <p className='coin-name td-smaller'>{coin.name}</p>
                    </div>
                </td>
            </Tooltip>
            <Tooltip title='24h Price Change'>
                <td className="chip-flex">
                    <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "price-chip-green td-smaller" : "price-chip-red td-smaller"}>{coin.price_change_percentage_24h.toFixed(3)}%</div>
                    <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "dsp-yes icon-green price-up" : "dsp-no"}><TrendingUpRoundedIcon /></div>
                    <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "dsp-no  " : "dsp-yes icon-red price-down"}><TrendingDownRoundedIcon /></div>
                </td>
            </Tooltip>
            <Tooltip title='Current Market Price'>
                <td className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "price-green td-right-align mkt-price " : "price-red td-right-align mkt-price "}>${coin.current_price.toLocaleString()}</td>
            </Tooltip>
            <Tooltip title='Market Cap'>
                <td className='td-right-align mkt-cap td-small'>${coin.market_cap.toLocaleString()}</td>
                <td className=' td-small mobile'>${convertNumber(coin.market_cap)}</td>
            </Tooltip>
            <Tooltip title='Total Volume'>
                <td className='td-right-align td-small ttl-vol'>${coin.total_volume.toLocaleString()}</td>
            </Tooltip>


        </tr>

    )
}

export default List
