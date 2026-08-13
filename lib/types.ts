/**
 * 'admin' y 'profesor' son staff (panel /panel); 'socio' tiene el suyo
 * (/mi-progreso). La frontera y los guards viven en lib/auth.ts.
 */
export type Role = "admin" | "profesor" | "socio";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  phone: string | null;
  must_change_password: boolean;
  activo: boolean;
  created_at: string;
}

export interface Profesor {
  id: string;
  nombre_completo: string;
  telefono: string | null;
  especialidad: string | null;
  activo: boolean;
  /** Cuenta vinculada, si el admin le dio acceso al panel. */
  profile_id: string | null;
  created_at: string;
}

export type DiaSemana =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

export interface Clase {
  id: string;
  nombre: string;
  profesor_id: string | null;
  dia_semana: DiaSemana | null;
  horario: string | null;
  cupo: number | null;
  activa: boolean;
  created_at: string;
}

export interface ClaseTomada {
  id: string;
  socio_id: string;
  clase_id: string;
  fecha: string;
  presente: boolean;
  notas: string | null;
  registrado_por: string | null;
  created_at: string;
}

export interface Ejercicio {
  nombre: string;
  series?: string;
  reps?: string;
  descanso?: string;
  notas?: string;
}

export interface Rutina {
  id: string;
  socio_id: string;
  nombre: string;
  descripcion: string | null;
  ejercicios: Ejercicio[];
  asignada_por: string | null;
  fecha_inicio: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export interface Medida {
  nombre: string;
  valor: string;
}

export interface Medicion {
  id: string;
  socio_id: string;
  fecha: string;
  peso_kg: number | null;
  grasa_corporal_pct: number | null;
  medidas: Medida[];
  notas: string | null;
  registrado_por: string | null;
  created_at: string;
}

/** Asignación de un socio a una clase (horario fijo). Distinta de
 * ClaseTomada, que es el registro de asistencia por sesión. */
export interface Inscripcion {
  id: string;
  socio_id: string;
  clase_id: string;
  created_by: string | null;
  created_at: string;
}
