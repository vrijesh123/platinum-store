import { ChevronLeft } from '@mui/icons-material'
import React from 'react'

const Cart = () => {
    return (
        <>
            <div className="cart-container">
                <div className="cart-heading">
                    <p>My Cart</p>

                    <div className="back">
                        <ChevronLeft />
                        Back
                    </div>
                </div>

                <div className="container">

                </div>
            </div>
        </>
    )
}

export default Cart