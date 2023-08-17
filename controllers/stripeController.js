const asyncHandler = require("express-async-handler")
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_KEY)

const payExam = asyncHandler(async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: "Sezar"
                    },
                    unit_amount: 2000
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: `https://examonline.vercel.app/?success=true`,
        cancel_url: `https://examonline.vercel.app/?canceled=true`,
    });

    res.send({ url: session.url });
})

module.exports = {
    payExam
}