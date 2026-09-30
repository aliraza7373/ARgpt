# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Email and SMS verification

The sign-in form can send one-time codes through Resend (email) or Twilio (SMS). Copy the relevant variable names from `.env.example` into `.env`, add credentials from the provider you want to use, and restart the Vite dev server. Email requires `RESEND_API_KEY` and a verified `AUTH_EMAIL_FROM` sender. SMS requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and an enabled `TWILIO_PHONE_NUMBER`.

Codes expire after 10 minutes, can be requested once per minute per destination, and allow five verification attempts. The current sign-in state and chat history are in memory; this Vite middleware is for local development and needs a persistent server-side auth implementation before deployment.

## Subscription checkout

The plans page uses Stripe-hosted Checkout, so card data does not pass through this app. Set `STRIPE_SECRET_KEY` in `.env` using `.env.example` as a guide. Plus is billed at $45/month after 25% off its $60 regular price; Pro is billed at $90/month after 25% off its $120 regular price. Plan prices are defined in `src/data/plans.js`. Restart the Vite dev server after changing the environment. Plan names and feature descriptions are examples; adjust them in `src/data/plans.js` to match the service you offer.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
