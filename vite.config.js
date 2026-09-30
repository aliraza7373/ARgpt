import react from '@vitejs/plugin-react'
import { Buffer } from 'node:buffer'
import { defineConfig, loadEnv } from 'vite'
import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { plans } from './src/data/plans.js'

function geminiChatApi(apiKey) {
  return {
    name: 'gemini-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (request, response) => {
        const sendJson = (status, body) => {
          response.statusCode = status
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(body))
        }

        void (async () => {
          if (request.method !== 'POST') {
            sendJson(405, { error: 'Use POST to send a chat message.' })
            return
          }

          if (!apiKey) {
            sendJson(500, { error: 'The GEMINI key is missing from the server environment.' })
            return
          }

          try {
            let rawBody = ''
            for await (const chunk of request) {
              rawBody += chunk
              if (rawBody.length > 100_000) {
                sendJson(413, { error: 'This conversation is too long to send.' })
                return
              }
            }

            const { messages } = JSON.parse(rawBody)
            if (!Array.isArray(messages) || messages.length === 0) {
              sendJson(400, { error: 'Add a message before sending.' })
              return
            }

            const transcript = messages
              .filter((message) =>
                (message.sender === 'user' || message.sender === 'ai') &&
                typeof message.text === 'string'
              )
              .map((message) => `${message.sender === 'ai' ? 'Assistant' : 'User'}: ${message.text}`)
              .join('\n\n')

            const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: JSON.stringify({
                model: 'gemini-3.5-flash-lite',
                input: `Continue this conversation and answer the latest user message.\n\n${transcript}`,
                store: false,
              }),
            })

            const result = await geminiResponse.json()
            if (!geminiResponse.ok) {
              sendJson(502, { error: result.error?.message || 'Gemini could not complete the request.' })
              return
            }

            const answer = result.output_text || result.steps
              ?.flatMap((step) => step.content || [])
              .filter((part) => part.type === 'text')
              .map((part) => part.text)
              .join('')

            if (!answer) {
              sendJson(502, { error: 'Gemini returned an empty response. Please try again.' })
              return
            }

            sendJson(200, { answer })
          } catch {
            sendJson(500, { error: 'Could not send your message. Please try again.' })
          }
        })()
      })
    },
  }
}

function authCodeApi(env) {
  const challenges = new Map()
  const lastSentAt = new Map()

  const sendJson = (response, status, body) => {
    response.statusCode = status
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(body))
  }

  const readBody = async (request) => {
    let body = ''
    for await (const chunk of request) {
      body += chunk
      if (body.length > 16_000) throw new Error('The request is too large.')
    }
    return JSON.parse(body)
  }

  const sendVerification = async (channel, destination, code) => {
    if (channel === 'email') {
      if (!env.RESEND_API_KEY || !env.AUTH_EMAIL_FROM) {
        throw new Error('Email codes need RESEND_API_KEY and AUTH_EMAIL_FROM in .env.')
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.AUTH_EMAIL_FROM,
          to: [destination],
          subject: 'Your NEXUS sign-in code',
          text: `Your verification code is ${code}. It expires in 10 minutes.`,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'The email provider could not send the code.')
      return
    }

    if (channel === 'phone') {
      if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
        throw new Error('Text codes need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env.')
      }

      const form = new URLSearchParams({
        To: destination,
        From: env.TWILIO_PHONE_NUMBER,
        Body: `Your NEXUS verification code is ${code}. It expires in 10 minutes.`,
      })
      const credentials = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64')
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: form,
        },
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'The text message provider could not send the code.')
      return
    }

    throw new Error('Choose email or text message for verification.')
  }

  return {
    name: 'auth-code-api',
    configureServer(server) {
      server.middlewares.use('/api/auth/send-code', (request, response) => {
        void (async () => {
          if (request.method !== 'POST') {
            sendJson(response, 405, { error: 'Use POST to request a verification code.' })
            return
          }

          try {
            const { channel, destination } = await readBody(request)
            const normalized = typeof destination === 'string' ? destination.trim() : ''
            if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
              sendJson(response, 400, { error: 'Enter a valid email address.' })
              return
            }
            if (channel === 'phone' && !/^\+[1-9]\d{7,14}$/.test(normalized)) {
              sendJson(response, 400, { error: 'Enter a phone number with country code, such as +15551234567.' })
              return
            }

            const key = `${channel}:${normalized.toLowerCase()}`
            const wait = 60_000 - (Date.now() - (lastSentAt.get(key) || 0))
            if (wait > 0) {
              sendJson(response, 429, { error: `Please wait ${Math.ceil(wait / 1000)} seconds before requesting another code.` })
              return
            }

            const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
            await sendVerification(channel, normalized, code)
            challenges.set(key, {
              hash: createHash('sha256').update(code).digest(),
              expiresAt: Date.now() + 10 * 60_000,
              attempts: 0,
            })
            lastSentAt.set(key, Date.now())
            sendJson(response, 200, { sent: true, expiresInSeconds: 600 })
          } catch (error) {
            const missingSetup = error.message.includes('in .env.')
            sendJson(response, missingSetup ? 503 : 502, { error: error.message || 'Could not send a verification code.' })
          }
        })()
      })

      server.middlewares.use('/api/auth/verify-code', (request, response) => {
        void (async () => {
          if (request.method !== 'POST') {
            sendJson(response, 405, { error: 'Use POST to verify your code.' })
            return
          }

          try {
            const { channel, destination, code } = await readBody(request)
            const normalized = typeof destination === 'string' ? destination.trim() : ''
            const key = `${channel}:${normalized.toLowerCase()}`
            const challenge = challenges.get(key)
            if (!challenge || challenge.expiresAt < Date.now()) {
              challenges.delete(key)
              sendJson(response, 400, { error: 'That code has expired or was not requested. Send a new code.' })
              return
            }
            if (challenge.attempts >= 5) {
              challenges.delete(key)
              sendJson(response, 429, { error: 'Too many incorrect attempts. Send a new code.' })
              return
            }

            const submittedHash = createHash('sha256').update(String(code || '')).digest()
            if (submittedHash.length !== challenge.hash.length || !timingSafeEqual(submittedHash, challenge.hash)) {
              challenge.attempts += 1
              sendJson(response, 400, { error: 'That code is incorrect. Check it and try again.' })
              return
            }

            challenges.delete(key)
            sendJson(response, 200, { verified: true })
          } catch {
            sendJson(response, 400, { error: 'Enter the verification code and try again.' })
          }
        })()
      })
    },
  }
}

function billingApi(env) {
  const stripeAuthorization = `Basic ${Buffer.from(`${env.STRIPE_SECRET_KEY || ''}:`).toString('base64')}`

  const sendJson = (response, status, body) => {
    response.statusCode = status
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(body))
  }

  return {
    name: 'stripe-billing-api',
    configureServer(server) {
      server.middlewares.use('/api/billing/plans', (request, response) => {
        void (async () => {
          if (request.method !== 'GET') {
            sendJson(response, 405, { error: 'Use GET to load plan pricing.' })
            return
          }

          const formatPrice = (amount) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(amount / 100)

          sendJson(response, 200, {
            plans: plans.filter((plan) => plan.priceCents).map((plan) => ({
              id: plan.id,
              priceLabel: `${formatPrice(plan.priceCents)} / month`,
              originalPriceLabel: `${formatPrice(plan.regularPriceCents)} / month`,
              discountPercent: plan.discountPercent,
            })),
          })
        })()
      })

      server.middlewares.use('/api/billing/checkout', (request, response) => {
        void (async () => {
          if (request.method !== 'POST') {
            sendJson(response, 405, { error: 'Use POST to start secure checkout.' })
            return
          }
          if (!env.STRIPE_SECRET_KEY) {
            sendJson(response, 503, { error: 'Stripe billing is not configured yet. Add STRIPE_SECRET_KEY to .env.' })
            return
          }

          try {
            let rawBody = ''
            for await (const chunk of request) {
              rawBody += chunk
              if (rawBody.length > 2_000) {
                sendJson(response, 413, { error: 'Invalid checkout request.' })
                return
              }
            }

            const { planId } = JSON.parse(rawBody)
            const plan = plans.find((item) => item.id === planId && item.priceCents)
            if (!plan) {
              sendJson(response, 400, { error: 'That plan is not available for purchase yet.' })
              return
            }

            const host = request.headers.host
            const protocol = request.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'
            const origin = request.headers.origin || `${protocol}://${host}`
            if (!host || new URL(origin).host !== host) {
              sendJson(response, 400, { error: 'Could not validate the checkout return address.' })
              return
            }

            const checkoutParams = new URLSearchParams({
              mode: 'subscription',
              'line_items[0][price_data][currency]': plan.currency,
              'line_items[0][price_data][unit_amount]': String(plan.priceCents),
              'line_items[0][price_data][product_data][name]': `NEXUS ${plan.name}`,
              'line_items[0][price_data][recurring][interval]': plan.interval,
              'line_items[0][quantity]': '1',
              success_url: `${origin}/plans?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${origin}/plans?checkout=cancelled`,
            })
            const checkoutResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
              method: 'POST',
              headers: {
                Authorization: stripeAuthorization,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: checkoutParams,
            })
            const checkout = await checkoutResponse.json()
            if (!checkoutResponse.ok) {
              sendJson(response, 502, { error: checkout.error?.message || 'Stripe could not start checkout.' })
              return
            }
            sendJson(response, 200, { url: checkout.url })
          } catch (error) {
            sendJson(response, 500, { error: error.message || 'Could not start secure checkout.' })
          }
        })()
      })

      server.middlewares.use('/api/billing/checkout-status', (request, response) => {
        void (async () => {
          if (request.method !== 'GET') {
            sendJson(response, 405, { error: 'Use GET to check checkout status.' })
            return
          }
          if (!env.STRIPE_SECRET_KEY) {
            sendJson(response, 503, { error: 'Stripe billing is not configured.' })
            return
          }

          const sessionId = new URL(request.url, 'http://localhost').searchParams.get('session_id')
          if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
            sendJson(response, 400, { error: 'Invalid checkout session.' })
            return
          }

          try {
            const checkoutResponse = await fetch(
              `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
              { headers: { Authorization: stripeAuthorization } },
            )
            const checkout = await checkoutResponse.json()
            if (!checkoutResponse.ok) {
              sendJson(response, 502, { error: checkout.error?.message || 'Could not confirm checkout.' })
              return
            }
            const paid = checkout.status === 'complete' &&
              ['paid', 'no_payment_required'].includes(checkout.payment_status)
            sendJson(response, 200, { paid })
          } catch (error) {
            sendJson(response, 502, { error: error.message || 'Could not confirm checkout.' })
          }
        })()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const projectRoot = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, projectRoot, '')

  return {
    plugins: [react(), geminiChatApi(env.GEMINI || env.GEMINI_API_KEY), authCodeApi(env), billingApi(env)],
  }
})
