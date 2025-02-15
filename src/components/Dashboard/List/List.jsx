import React from 'react'
import './styles.css'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";


const List = ({ coin, delay }) => {
    return (
        <motion.div className='list-container'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay }}
        >
            <div className="name-col-flex">
                <Tooltip title="coin image">
                    <img src={coin.image} className='coin-icon' />
                </Tooltip>
                <Tooltip title="coin info">
                    <div className="coin-info">
                        <p className='coin-symbol'>{coin.symbol}</p>
                        <p className='coin-name'>{coin.name}</p>
                    </div>
                </Tooltip>
            </div>
            <Tooltip title="price change info in last 24h">
                <div className='list-chip-flex'>

                    <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "price-chip-green" : "price-chip-red"}>{coin.price_change_percentage_24h.toFixed(3)}%</div>
                    <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "dsp-yes icon-green" : "dsp-no"}><TrendingUpRoundedIcon /></div>
                    <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "dsp-no " : "dsp-yes icon-red"}><TrendingDownRoundedIcon /></div>
                    <div className="current-price">${coin.current_price.toLocaleString()}</div>

                </div>
            </Tooltip>

            <div className="extra-info-coin">
                <Tooltip title="Total Volume">
                    <p className='coin-volume'>${coin.total_volume.toLocaleString()}</p>
                </Tooltip>
                <Tooltip title="Total Market Cap">
                    <p className='coin-marketCap'>${coin.market_cap.toLocaleString()}</p>
                </Tooltip>
            </div>
        </motion.div>
    )
}

export default List
