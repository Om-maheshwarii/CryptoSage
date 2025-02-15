import React from 'react'
import './styles.css'
const Button = ({ text, onCLick, outlined }) => {
    return (
        <div className={outlined ? "outline-btn" : "btn"} >
            {text}
        </div>
    )
}

export default Button
