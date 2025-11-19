"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { TEAM_TAG } from "../(main)/teams/_libs/views/ManageTeams";
import { MEMBER_TAG } from "../(main)/members/_libs/views/ManageMembers";

/**
 * Server action to revalidate teams data by tag
 */
export async function revalidateTeams() {
  revalidateTag(TEAM_TAG);
}

export async function revalidateMembers() {
  revalidateTag(MEMBER_TAG);
}
