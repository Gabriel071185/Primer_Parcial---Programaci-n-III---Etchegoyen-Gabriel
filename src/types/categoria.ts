 export interface ICategory {
    id: number;
    eliminado: boolean;
    createdAt: string;
    nombre: string;
    descripcion: string;
 }

export type CategoryFilter = "all" | number;