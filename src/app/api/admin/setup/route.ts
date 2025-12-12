import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// This endpoint creates an admin user - should be disabled in production
export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Admin setup is disabled in production" },
      { status: 403 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 }
    );
  }

  // Use service role to create admin user
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const adminEmail = "admin@toollib.com";
  const adminPassword = "Admin@123456";

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(
      (u) => u.email === adminEmail
    );

    if (existingAdmin) {
      // Update the user's metadata to ensure admin role
      await supabase.auth.admin.updateUserById(existingAdmin.id, {
        user_metadata: { role: "admin", name: "Admin" },
      });

      return NextResponse.json({
        message: "Admin user already exists and has been updated",
        credentials: {
          email: adminEmail,
          password: "Use your existing password or reset it",
        },
      });
    }

    // Create new admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: "admin",
        name: "Admin",
      },
    });

    if (error) {
      console.error("Error creating admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Admin user created successfully!",
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Admin Setup Endpoint",
    instructions: "Send a POST request to create an admin user",
    note: "This only works in development mode",
  });
}
