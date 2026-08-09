export type Role = "admin" | "socio";

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
