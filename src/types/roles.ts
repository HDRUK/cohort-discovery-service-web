import { WithTimestamps } from "./api";

export enum RoleName {
  ADMIN = "admin",
  USER = "user",
}

export interface Role extends WithTimestamps {
  id: number;
  name: string;
}
