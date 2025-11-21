import { Task } from "../../../../../generated/prisma/client";

export type TaskWithRelations = Task & {
  project?: { id: string; name: string };
  assigned_member?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
};
