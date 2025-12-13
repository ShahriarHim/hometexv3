/**
 * Location API Types
 */

export interface Division {
  id: number;
  name: string;
}

export interface Area {
  id: number;
  name: string;
}

export type DivisionsResponse = Division[];

export type AreasResponse = Area[];
