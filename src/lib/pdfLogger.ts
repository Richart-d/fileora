import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export async function logPdfActivity(
  operationType: string,
  inputFileNames: string[],
  outputFileName: string,
  status: string
) {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) return;

    const convex = new ConvexHttpClient(convexUrl);
    await convex.mutation(api.pdfOperations.logPdfOperation, {
      clerkId: userId,
      operationType,
      inputFileNames,
      outputFileName,
      status,
    });
  } catch (err) {
    console.warn("Failed to log PDF operation:", err);
  }
}
