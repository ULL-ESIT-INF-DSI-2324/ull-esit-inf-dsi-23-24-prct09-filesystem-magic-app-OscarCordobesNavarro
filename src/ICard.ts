/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 18/03/2024
 * Práctica 9: Clases e interfaces genéricas. Principios SOLID
 */

export enum Color {
  White = "FFFFFF",
  Blue = "0000FF",
  Black = "000000",
  Red = "FF0000",
  Green = "00FF00",
  Colorless = "colorless",
  Multicolor = "multicolor",
}

// Enumerado para el campo 'Línea de Tipo'
export enum TypeLine {
  Land = "Land",
  Creature = "Creature",
  Enchantment = "Enchantment",
  Sorcery = "Sorcery",
  Instant = "Instant",
  Artifact = "Artifact",
  Planeswalker = "Planeswalker",
}

// Enumerado para el campo 'Rareza'
// Enumerado para el campo 'Rareza'
export enum Rarity {
  Comun = "comun",
  Infrecuente = "infrecuente",
  Rara = "rara",
  Mitica = "mítica",
}

// Definición de la interfaz para una carta
export interface ICard {
  id: number;
  name: string;
  manaCost: number;
  color: Color;
  lineType: TypeLine;
  rarity: Rarity;
  ruleText: string;
  strength?: number;
  endurance?: number;
  brandsLoyalty?: number;
  marketValue: number;
}
