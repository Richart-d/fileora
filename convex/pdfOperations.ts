import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logPdfOperation = mutation({
  args: {
    clerkId: v.string(), // Send from Next.js auth() context
    operationType: v.string(),
    inputFileNames: v.array(v.string()),
    outputFileName: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // We expect the backend API to provide a valid clerkId directly
    // Look up the internal userId
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error(`User with clerkId ${args.clerkId} not found`);
    }

    await ctx.db.insert("pdf_operations", {
      userId: user._id,
      operationType: args.operationType,
      inputFileNames: args.inputFileNames,
      outputFileName: args.outputFileName,
      status: args.status,
      createdAt: Date.now(),
    });
  },
});

export const getRecentOperations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const operations = await ctx.db
      .query("pdf_operations")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(5);

    return operations;
  },
});
