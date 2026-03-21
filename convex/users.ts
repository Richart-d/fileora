import { mutation, query } from "./_generated/server";

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
