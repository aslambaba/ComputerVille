import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { loadStripe } from "@stripe/stripe-js"
import Style from './style/main.css'

const dotenv = require('dotenv');
dotenv.config('');

export default function Products() {

    const ClickHandler = async (event, product_price_id) => {
        event.preventDefault()
        const stripe = await loadStripe(process.env.STRIPE_PUBLISH_KEY);
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
        <div>
            <h1>H</h1>
            {
                myProducts.map(({ id, product }) => {
                    return (
                        <div>
                            <p>{id}</p>
                            <h3>{product.name}</h3>
                            <img src={product.images[0]} />
                            <button onClick={(e)=> ClickHandler(e,id)}>Buy</button>
                        </div>
                    )
                })
            }
        </div>
    )
}