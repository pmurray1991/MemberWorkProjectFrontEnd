import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreatePersonDto, CreateProgramDto, Person, Program, Role } from './models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  constructor(private http: HttpClient) {}

  // People
  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.base}/person`);
  }
  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.base}/person/${id}`);
  }
  createPerson(dto: CreatePersonDto): Observable<Person> {
    return this.http.post<Person>(`${this.base}/person/createPerson`, dto);
  }
  updatePerson(id: number, dto: Partial<CreatePersonDto>): Observable<void> {
    return this.http.put<void>(`${this.base}/person/${id}`, dto);
  }
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/person/${id}`);
  }

  // Roles (assuming you expose GET /api/roles)
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.base}/roles`);
  }

  // Assign/Remove roles
  assignRole(personId: number, roleId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/person/${personId}/roles/${roleId}`, {});
  }
  removeRole(personId: number, roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/person/${personId}/roles/${roleId}`);
  }

  // Programs
  getPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(`${this.base}/program`);
  }
  getProgram(id: number): Observable<Program> {
    return this.http.get<Program>(`${this.base}/program/${id}`);
  }
  createProgram(dto: CreateProgramDto): Observable<Program> {
    return this.http.post<Program>(`${this.base}/program/createProgram`, dto);
  }
  updateProgram(id: number, dto: Partial<CreateProgramDto>): Observable<void> {
    return this.http.put<void>(`${this.base}/program/${id}`, dto);
  }
  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/program/${id}`);
  }

  // Assign/Remove people to programs
  assignPeopleToProgram(programId: number, personIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.base}/program/${programId}/people`, { personIds });
  }
  removePersonFromProgram(programId: number, personId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/program/${programId}/people/${personId}`);
  }
}
