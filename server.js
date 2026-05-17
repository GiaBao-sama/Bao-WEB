const express = require('express');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51TSoxqFo6ABzcR1sBkbPz1WQhY55UPeE0SjX3cdRl65TkJsy3xMqPQNJkDY8hMIAX24peDn5KmnIW8zWTWGvC3Xx00XuxuOkNn';
const stripe = require('stripe')(stripeSecretKey); // Thay bằng secret key của bạn từ Stripe dashboard hoặc đặt STRIPE_SECRET_KEY
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/create-checkout-session', async (req, res) => {
    const { orderId, amount, currency, products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        console.error('create-checkout-session: products empty or invalid', products);
        return res.status(400).json({ error: 'Products are required' });
    }

    const lineItems = products.map(product => {
        const unitAmount = parseInt((product.price || '').replace(/\D/g, ''), 10);
        const name = product.name || product.title || 'Sản phẩm';

        if (!unitAmount || unitAmount <= 0) {
            console.error('Invalid product price', product);
        }

        return {
            price_data: {
                currency: 'vnd',
                product_data: {
                    name,
                    images: product.img ? [product.img] : [],
                },
                unit_amount: unitAmount,
            },
            quantity: product.quantity || 1,
        };
    });

    console.log('Creating Stripe session', { orderId, amount, currency, products, lineItems });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel.html',
            metadata: {
                orderId: orderId.toString(),
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));