const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Payment endpoints
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, productType } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                productType: productType
            }
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI Roast Generation (would integrate with your AI credits)
app.post('/generate-roast', async (req, res) => {
    try {
        const { imageData, roastType = 'free' } = req.body;
        
        // Mock roasts - replace with actual AI integration
        const roasts = {
            free: [
                "I've seen potatoes with better angles than this selfie.",
                "Your camera must have trust issues because it keeps trying to focus on anything but your face.",
                "You look like you use a calculator to count to 10 and still get it wrong."
            ],
            savage: [
                "Holy moly, I've seen car crashes that were easier to look at than this selfie. Your face has more problems than a math textbook.",
                "Damn, you really woke up and chose violence... against your own reflection. This photo is so cursed, I'm getting bad luck just looking at it.",
                "YIKES! You look like you were assembled by someone who had never seen a human before but got a really bad description over the phone."
            ]
        };
        
        const roastArray = roasts[roastType] || roasts.free;
        const randomRoast = roastArray[Math.floor(Math.random() * roastArray.length)];
        
        // Simulate processing time
        setTimeout(() => {
            res.json({ 
                roast: randomRoast,
                watermark: roastType === 'free' ? 'Powered by SuperCool.com' : null
            });
        }, 2000);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Analytics endpoint
app.post('/track-event', (req, res) => {
    const { event, data } = req.body;
    console.log(`Event: ${event}`, data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🔥 AI Roast Master server running on port ${PORT}`);
});