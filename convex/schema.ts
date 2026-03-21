import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    plan: v.union(v.literal('free'), v.literal('pro')),
  }).index('by_clerkId', ['clerkId']),

  resumes: defineTable({
    userId: v.id('users'),
    title: v.string(),
    templateId: v.string(),
    personalInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      location: v.string(),
      linkedin: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    workExperience: v.array(v.object({
      company: v.string(),
      title: v.string(),
      startDate: v.string(),
      endDate: v.optional(v.string()),
      current: v.boolean(),
      bullets: v.array(v.string()),
    })),
    education: v.array(v.object({
      school: v.string(),
      degree: v.string(),
      field: v.string(),
      year: v.string(),
      grade: v.optional(v.string()),
    })),
    skills: v.array(v.string()),
    certifications: v.array(v.object({
      name: v.string(),
      issuer: v.string(),
      year: v.string(),
    })),
    summary: v.string(),
    nyscStatus: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']),

  pdf_operations: defineTable({
    userId: v.id('users'),
    operationType: v.string(),
    inputFileNames: v.array(v.string()),
    outputFileName: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),
})
