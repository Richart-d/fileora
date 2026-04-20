import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to createOrUpdateUser");
    }

    const clerkId = identity.subject;
    const email = identity.email ?? "";
    const name = identity.name ?? undefined;
    const imageUrl = identity.pictureUrl ?? undefined;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email,
        name,
        imageUrl,
      });
      return existingUser._id;
    }

    const newUserId = await ctx.db.insert("users", {
      clerkId,
      email,
      name,
      imageUrl,
      createdAt: Date.now(),
      plan: "free",
    });

    return newUserId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to getCurrentUser");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { name: args.name });
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Delete all resumes
    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const resume of resumes) {
      await ctx.db.delete(resume._id);
    }

    // Delete all pdf operations
    const pdfOps = await ctx.db
      .query("pdf_operations")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const op of pdfOps) {
      await ctx.db.delete(op._id);
    }

    // Delete user
    await ctx.db.delete(user._id);
  },
});
