"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { TEAM_TAG } from "./views/ManageTeams";

/**
 * Server action to revalidate teams data by tag
 */
export async function revalidateTeams() {
  revalidateTag(TEAM_TAG);
}

/**
 * Server action to revalidate teams page by path
 */
export async function revalidateTeamsPath(path: string = "/teams") {
  revalidatePath(path);
}
