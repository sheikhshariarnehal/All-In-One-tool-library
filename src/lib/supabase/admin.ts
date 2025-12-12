import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import type { 
  Template, 
  TemplateCategory, 
  AIToolDB, 
  AIToolUsage, 
  AdminActivityLog,
  BlogPost,
  BlogCategory
} from "@/types/database";

// Re-export for convenience
export type AITool = AIToolDB;
export type ActivityLog = AdminActivityLog;

// Create admin client with service role (bypasses RLS)
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is not configured");
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  
  // Service role key bypasses RLS - use with caution
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'admin-dashboard',
      },
    },
  });
}

// ============= TEMPLATES =============

export async function getTemplates(options?: {
  categoryId?: string;
  isPremium?: boolean;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = createAdminClient();
  
  let query = supabase
    .from("templates")
    .select("*, template_categories(*)");
  
  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.isPremium !== undefined) {
    query = query.eq("is_premium", options.isPremium);
  }
  if (options?.isActive !== undefined) {
    query = query.eq("is_active", options.isActive);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  query = query.order("created_at", { ascending: false });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as (Template & { template_categories: TemplateCategory })[];
}

export async function getTemplateById(id: string) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("templates")
    .select("*, template_categories(*)")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data as Template & { template_categories: TemplateCategory };
}

export async function createTemplate(template: {
  name: string;
  slug: string;
  file_format: string;
  category_id?: string | null;
  description?: string | null;
  file_url?: string | null;
  preview_url?: string | null;
  file_size?: number | null;
  is_premium?: boolean;
  is_active?: boolean;
  tags?: string[] | null;
  metadata?: Record<string, unknown> | null;
}) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("templates")
    .insert(template)
    .select()
    .single();
  
  if (error) throw error;
  return data as Template;
}

export async function updateTemplate(id: string, template: Partial<Template>) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("templates")
    .update(template)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Template;
}

export async function deleteTemplate(id: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
}

export async function getTemplateCategories() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("template_categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  
  if (error) throw error;
  return data as TemplateCategory[];
}

export async function createTemplateCategory(data: {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  is_active?: boolean;
  display_order?: number;
}) {
  const supabase = createAdminClient();
  
  const { data: category, error } = await supabase
    .from("template_categories")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      icon: data.icon || null,
      color: data.color || null,
      is_active: data.is_active !== false,
      display_order: data.display_order || 0,
    })
    .select()
    .single();
  
  if (error) throw error;
  return category as TemplateCategory;
}

export async function updateTemplateCategory(id: string, data: Partial<{
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  display_order: number;
}>) {
  const supabase = createAdminClient();
  
  const { data: category, error } = await supabase
    .from("template_categories")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return category as TemplateCategory;
}

export async function deleteTemplateCategory(id: string) {
  const supabase = createAdminClient();
  
  // Check if category has templates
  const { data: templates } = await supabase
    .from("templates")
    .select("id")
    .eq("category_id", id)
    .limit(1);
  
  if (templates && templates.length > 0) {
    throw new Error("Cannot delete category with templates. Move or delete templates first.");
  }
  
  const { error } = await supabase
    .from("template_categories")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
}

export async function incrementTemplateDownload(templateId: string, userId?: string) {
  const supabase = createAdminClient();
  
  // Increment download count
  await supabase.rpc("increment_template_downloads", { template_id: templateId });
  
  // Log the download
  if (userId) {
    await supabase.from("template_downloads").insert({
      template_id: templateId,
      user_id: userId,
    });
  }
  
  return true;
}

// ============= AI TOOLS =============

export async function getAITools(options?: {
  isActive?: boolean;
  requiresAuth?: boolean;
  limit?: number;
}) {
  const supabase = createAdminClient();
  
  let query = supabase.from("ai_tools").select("*");
  
  if (options?.isActive !== undefined) {
    query = query.eq("is_active", options.isActive);
  }
  if (options?.requiresAuth !== undefined) {
    query = query.eq("requires_auth", options.requiresAuth);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  query = query.order("name");
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as AITool[];
}

export async function getAIToolBySlug(slug: string) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .eq("slug", slug)
    .single();
  
  if (error) throw error;
  return data as AITool;
}

export async function createAITool(tool: {
  name: string;
  slug: string;
  model_provider: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  features?: string[] | null;
  is_premium?: boolean;
  is_active?: boolean;
  daily_limit_free?: number;
  daily_limit_pro?: number;
  monthly_limit_enterprise?: number | null;
  model_name?: string | null;
  system_prompt?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("ai_tools")
    .insert(tool)
    .select()
    .single();
  
  if (error) throw error;
  return data as AITool;
}

export async function updateAITool(id: string, tool: Partial<AITool>) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("ai_tools")
    .update(tool)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as AITool;
}

export async function deleteAITool(id: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from("ai_tools")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
}

export async function logAIToolUsage(toolId: string, userId: string, tokensUsed: number, success: boolean, errorMessage?: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase.from("ai_tool_usage").insert({
    tool_id: toolId,
    user_id: userId,
    tokens_used: tokensUsed,
    success,
    error_message: errorMessage,
  });
  
  if (error) throw error;
  
  // Increment total uses if successful
  if (success) {
    await supabase.rpc("increment_ai_tool_uses", { tool_id: toolId });
  }
  
  return true;
}

export async function getAIToolUsageStats(toolId: string, days: number = 30) {
  const supabase = createAdminClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from("ai_tool_usage")
    .select("*")
    .eq("tool_id", toolId)
    .gte("created_at", startDate.toISOString());
  
  if (error) throw error;
  
  const stats = {
    totalUses: data.length,
    successfulUses: data.filter(u => u.success).length,
    totalTokens: data.reduce((sum, u) => sum + (u.tokens_used || 0), 0),
    errorRate: data.length > 0 
      ? (data.filter(u => !u.success).length / data.length) * 100 
      : 0,
  };
  
  return stats;
}

export async function checkUserDailyLimit(userId: string, toolId: string, dailyLimit: number): Promise<boolean> {
  const supabase = createAdminClient();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from("ai_tool_usage")
    .select("*", { count: "exact", head: true })
    .eq("tool_id", toolId)
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());
  
  if (error) throw error;
  
  return (count || 0) < dailyLimit;
}

// ============= ACTIVITY LOGS =============

export async function getActivityLogs(options?: {
  adminId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createAdminClient();
  
  let query = supabase
    .from("admin_activity_log")
    .select("*, profiles(full_name, email, avatar_url)");
  
  if (options?.adminId) {
    query = query.eq("admin_id", options.adminId);
  }
  if (options?.action) {
    query = query.eq("action", options.action);
  }
  
  query = query.order("created_at", { ascending: false });
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as (ActivityLog & { profiles: { full_name: string; email: string; avatar_url: string } | null })[];
}

export async function logActivity(
  adminId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string
) {
  const supabase = createAdminClient();
  
  const { error } = await supabase.from("admin_activity_log").insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_values: oldValues,
    new_values: newValues,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
  
  if (error) throw error;
  return true;
}

// ============= BLOG =============

export async function getBlogPosts(options?: {
  status?: "draft" | "published" | "archived";
  categoryId?: string;
  authorId?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createAdminClient();
  
  let query = supabase
    .from("blog_posts")
    .select("*, blog_categories(*), profiles(full_name, avatar_url)");
  
  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.authorId) {
    query = query.eq("author_id", options.authorId);
  }
  
  query = query.order("created_at", { ascending: false });
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(*), profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "created_at" | "updated_at" | "view_count">) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();
  
  if (error) throw error;
  return data as BlogPost;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("blog_posts")
    .update(post)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as BlogPost;
}

export async function deleteBlogPost(id: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
}

export async function getBlogCategories() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name");
  
  if (error) throw error;
  return data as BlogCategory[];
}

// ============= DASHBOARD STATS =============

export async function getDashboardStats() {
  const supabase = createAdminClient();
  
  // Get counts in parallel
  const [
    usersResult,
    templatesResult,
    aiToolsResult,
    blogPostsResult,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("ai_tools").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
  ]);
  
  // Get template downloads this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const downloadsResult = await supabase
    .from("template_downloads")
    .select("*", { count: "exact", head: true })
    .gte("downloaded_at", startOfMonth.toISOString());
  
  // Get AI tool usage this month
  const aiUsageResult = await supabase
    .from("ai_tool_usage")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());
  
  return {
    totalUsers: usersResult.count || 0,
    totalTemplates: templatesResult.count || 0,
    totalAITools: aiToolsResult.count || 0,
    totalBlogPosts: blogPostsResult.count || 0,
    monthlyDownloads: downloadsResult.count || 0,
    monthlyAIUsage: aiUsageResult.count || 0,
  };
}

export async function getPopularTemplates(limit: number = 5) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("templates")
    .select("id, name, download_count, template_categories(name)")
    .eq("is_active", true)
    .order("download_count", { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function getPopularAITools(limit: number = 5) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("ai_tools")
    .select("id, name, total_uses")
    .eq("is_active", true)
    .order("total_uses", { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}
