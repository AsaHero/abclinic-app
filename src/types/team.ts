// Types for the team/doctor pages — new content, not present in the old
// site. `role` mirrors ClinicCards' own staff roles (DOCTOR/MANAGER/
// ADMINISTRATOR/ASSISTANT/...) so the roster can be cross-checked against
// GET /staff; `roleTitle` is the public-facing job title shown on the site
// (e.g. "Стоматолог-терапевт"), which ClinicCards has no equivalent for.
export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  roleTitle?: string;
  photo?: string;
  bio?: string;
  education?: string[];
  certificates?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const isDoctor = (member: TeamMember) => member.role === "DOCTOR";
