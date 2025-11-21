"use server";

import { revalidateTag } from "next/cache";
import { TEAM_TAG } from "../(main)/teams/_libs/views/ManageTeams";
import { MEMBER_TAG } from "../(main)/members/_libs/views/ManageMembers";
import { PROJECT_TAG } from "../(main)/projects/_libs/views/ManageProjects";
import { TASK_CATEGORY_TAG } from "../(main)/task-category/_libs/views/ManageTaskCategories";
import { TASK_TAG } from "../(main)/tasks/_libs/views/ManageTasks";

/**
 * Server action to revalidate teams data by tag
 */
export async function revalidateTeams() {
  revalidateTag(TEAM_TAG);
}

export async function revalidateMembers() {
  revalidateTag(MEMBER_TAG);
}

export async function revalidateProjects() {
  revalidateTag(PROJECT_TAG);
}

export async function revalidateTaskCategories() {
  revalidateTag(TASK_CATEGORY_TAG);
}

export async function revalidateTasks() {
  revalidateTag(TASK_TAG);
}
