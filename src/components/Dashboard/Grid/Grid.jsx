import React from 'react'
import './style.css'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { motion } from "framer-motion";

const Grid = ({ coin }) => {


    return (
        <motion.div
            className="grid-container"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={
                {

                    scale: 1.05,
                    transition: { duration: 0.25, ease: 'circInOut' },
                    border: `2px solid ${coin.price_change_percentage_24h > 0 ? "var(--green)" : "var(--red)"}`

                }
            }

        >
            <div className="info-flex">
                <img src={coin.image} className='coin-logo' />
                <div className='name-col'>
                    <p className='coin-symbol'>{coin.symbol}</p>
                    <p className='coin-name'>{coin.name}</p>
                </div>
            </div>
            <div className="chip-flex">
                <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "price-chip-green" : "price-chip-red"}>{coin.price_change_percentage_24h.toFixed(3)}%</div>
                <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "dsp-yes icon-green" : "dsp-no"}><TrendingUpRoundedIcon /></div>
                <div className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "dsp-no " : "dsp-yes icon-red"}><TrendingDownRoundedIcon /></div>
            </div>
            <h3 className={coin.price_change_percentage_24h.toFixed(3) > 0 ? "price-green" : "price-red"}>${coin.current_price.toLocaleString()}</h3>
            <div className="extra-info">
                <p>Total Volume:${coin.total_volume.toLocaleString()}</p>
                <p>Market Cap:${coin.market_cap.toLocaleString()}</p>
            </div>
        </motion.div>
    )
}

export default Grid
