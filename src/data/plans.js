export const plans = [
  {
    id: "free",
    name: "Free",
    tagline: "A good place to start",
    description: "For trying ideas and everyday questions.",
    features: ["Chat with NEXUS", "Explore ideas", "Keep recent conversations"],
    priceLabel: "Free",
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "More room to get things done",
    description: "For regular use, learning, and creative work.",
    features: ["Everything in Free", "Higher message limits", "Priority access"],
    currency: "usd",
    interval: "month",
    regularPriceCents: 6000,
    discountPercent: 25,
    priceCents: 4500,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "More power for bigger projects",
    description: "For demanding work and longer sessions.",
    features: ["Everything in Plus", "The highest usage limits", "Advanced tools"],
    currency: "usd",
    interval: "month",
    regularPriceCents: 12000,
    discountPercent: 25,
    priceCents: 9000,
    featured: true,
  },
];

export const getPlan = (id) => plans.find((plan) => plan.id === id);
