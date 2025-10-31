// app/coaching/lib/types.ts

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  community: string;
  school: string;
}

export interface Session {
  id: string;
  date: string; // or Date if you convert it
  community: string;
  coach_id?: string | null;
  type: string;
  duration: number;
}

export interface Attendance {
  id?: string;
  session_id: string;
  child_id: string;
  status: "present" | "absent";
}
