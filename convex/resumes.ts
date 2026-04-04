import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper to get user by Clerk ID
async function getAuthUserId(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated call to Convex");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) {
    throw new Error("User not found");
  }
  return user._id;
}

export const createResume = mutation({
  args: {
    templateId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const resumeId = await ctx.db.insert("resumes", {
      userId,
      title: "Untitled Resume",
      templateId: args.templateId,
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      certifications: [],
      summary: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return resumeId;
  },
});

export const updateResume = mutation({
  args: {
    id: v.id("resumes"),
    title: v.optional(v.string()),
    templateId: v.optional(v.string()),
    personalInfo: v.optional(
      v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        location: v.string(),
        linkedin: v.optional(v.string()),
        website: v.optional(v.string()),
      })
    ),
    workExperience: v.optional(
      v.array(
        v.object({
          company: v.string(),
          title: v.string(),
          startDate: v.string(),
          endDate: v.optional(v.string()),
          current: v.boolean(),
          bullets: v.array(v.string()),
        })
      )
    ),
    education: v.optional(
      v.array(
        v.object({
          school: v.string(),
          degree: v.string(),
          field: v.string(),
          year: v.string(),
          grade: v.optional(v.string()),
        })
      )
    ),
    skills: v.optional(v.array(v.string())),
    certifications: v.optional(
      v.array(
        v.object({
          name: v.string(),
          issuer: v.string(),
          year: v.string(),
        })
      )
    ),
    summary: v.optional(v.string()),
    nyscStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const existingResume = await ctx.db.get(args.id);
    if (!existingResume) {
      throw new Error("Resume not found");
    }

    if (existingResume.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const { id, ...patch } = args;

    await ctx.db.patch(args.id, {
      ...patch,
      updatedAt: Date.now(),
    });
  },
});

export const getUserResumes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getResume = query({
  args: {
    id: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      return null;
    }

    if (resume.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return resume;
  },
});

export const deleteResume = mutation({
  args: {
    id: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const existingResume = await ctx.db.get(args.id);
    if (!existingResume) {
      throw new Error("Resume not found");
    }

    if (existingResume.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
