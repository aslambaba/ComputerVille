import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { loadStripe } from "@stripe/stripe-js";
import  MainStyle from './style/main.module.css'

const dotenv = require('dotenv');
dotenv.config('');

export default function Products() {

    const ClickHandler = async (event, product_price_id) => {
        event.preventDefault()
        const stripe = await loadStripe('pk_test_51Hr8RFEAxjBMcLOop6ah7qFNyuJzOjKU12Xu2f986khPIR12WVZ2xlvkKfG2l4ueBIfFGgHcdmd3r2CbLe483Mjk00tDQwG0xw');
        const { error } = await stripe.redirectToCheckout({
            mode: "payment",
            lineItems: [{ price: product_price_id, quantity: 1 }],
            successUrl: `http://localhost:8000/page2/`,
            cancelUrl: `http://localhost:8000/failed/`,
        })
        if (error)
            console.log(error);
    }

    const gqlData = useStaticQuery(graphql`
    query MyQuery {
        allStripePrice {
          nodes {
            product {
              images
              id
              description
              name
            }
            id
          }
        }
      } 
    `);
    const myProducts = gqlData.allStripePrice.nodes;
    console.log(myProducts);
    return (
        <div className={MainStyle.MainContainer}>
            <h1 className={MainStyle.heading}>Welcome to Computer Velie</h1>
            <div className={MainStyle.LandingImg}></div>
            {
                myProducts.map(({ id, product }) => {
                    return (
                        <div className={MainStyle.ProductSec} key={id}>
                            <h3>{product.name}</h3>
                            <img alt={product.name} className={MainStyle.ProImg} src={product.images[0]} />
                            <button className={MainStyle.BuyBtn} onClick={(e)=> ClickHandler(e,id)}>Buy</button>
                        </div>
                    )
                })
            }
        </div>
    )
}