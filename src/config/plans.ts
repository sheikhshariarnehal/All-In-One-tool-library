export const plans = [
  {
    id: "free",
    name: "Free",
    description: "For individuals getting started",
    price: 0,
    priceId: null,
    features: [
      "Access to all basic tools",
      "10 uses per tool per day",
      "Standard processing speed",
      "Community support",
    ],
    limitations: [
      "Limited daily usage",
      "Watermarks on some outputs",
      "No API access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For power users and professionals",
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Access to all tools including premium",
      "Unlimited usage",
      "Priority processing",
      "No watermarks",
      "Email support",
      "Usage history & analytics",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and organizations",
    price: 49.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Everything in Pro",
      "API access",
      "Team management",
      "Custom branding",
      "Priority support",
      "SSO integration",
      "Dedicated account manager",
    ],
  },
];

export const usageLimits = {
  free: {
    dailyLimit: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    batchLimit: 1,
  },
  pro: {
    dailyLimit: Infinity,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    batchLimit: 10,
  },
  enterprise: {
    dailyLimit: Infinity,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    batchLimit: 50,
  },
};
