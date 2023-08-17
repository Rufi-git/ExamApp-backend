const asyncHandler = require("express-async-handler")
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_KEY)

const payExam = asyncHandler(async (req, res) => {
    const { exam } = req.body

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "azn",
                    product_data: {
                        name: exam.name,
                        metadata: {
                            id: exam._id
                        }
                    },
                    unit_amount: exam.price * 100
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: `https://examonline.vercel.app/myExams?examId=${exam._id}&success=true`,
        cancel_url: `https://examonline.vercel.app/myExams?canceled=true`,
    });

    res.send({ url: session.url });
})

module.exports = {
    payExam
}