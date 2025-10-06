export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;     // ISO
  roles?: Role[];
}

export interface Role {
  id: number;
  role: 'Admin' | 'Member' | 'Coach' | string;
}

export interface PersonRole {
  personId: number;
  roleId: number;
  createdAt: string;
  role?: Role;
}

export interface Program {
  id: number;
  name: string;
  description?: string;
  startDate: string;     // ISO
  endDate: string;       // ISO
  personPrograms?: PersonProgram[];
}

export interface PersonProgram {
  personId: number;
  programId: number;
  createdAt: string;
  person?: Person;
}

export interface CreatePersonDto {
  firstName: string;
  lastName: string;
  email: string;
  roleIds?: number[]; // optional shortcut to assign roles on create
}

export interface CreateProgramDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}
