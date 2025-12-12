import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(apiKey);
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables not configured");
  }
  return createClient(url, serviceKey);
}

// Helper to safely get subscription period dates
function getSubscriptionDates(subscription: Stripe.Subscription) {
  const periodStart = (subscription as unknown as { current_period_start?: number }).current_period_start;
  const periodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;
  return {
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  };
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id || 
          (session.subscription && typeof session.subscription === 'string' 
            ? (await stripe.subscriptions.retrieve(session.subscription)).metadata.supabase_user_id
            : null);

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const dates = getSubscriptionDates(subscription);

          await supabase.from("subscriptions").upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan_id: subscription.items.data[0].price.id,
            ...dates,
          });

          await supabase
            .from("profiles")
            .update({ subscription_tier: "pro" })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.supabase_user_id;
        const dates = getSubscriptionDates(subscription);

        if (userId) {
          await supabase
            .from("subscriptions")
            .update({
              status: subscription.status,
              plan_id: subscription.items.data[0].price.id,
              ...dates,
            })
            .eq("stripe_subscription_id", subscription.id);

          const tier = subscription.status === "active" ? "pro" : "free";
          await supabase
            .from("profiles")
            .update({ subscription_tier: tier })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.supabase_user_id;

        if (userId) {
          await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("stripe_subscription_id", subscription.id);

          await supabase
            .from("profiles")
            .update({ subscription_tier: "free" })
            .eq("id", userId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed for invoice:", invoice.id);
        // Could send email notification here
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
