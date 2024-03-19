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

import { ICard } from "./ICard.js";
import { Color } from "./IColor.js";
import fs, { readFileSync } from "fs";
import chalk from "chalk";


/**
 * Clase que se encarga de gestionar las colecciones de cartas
 */
export class CardCollectionsHandler {
  private userCollectionPath: string = "./data/";
  private userCollection: ICard[] = [];
  private userName: string = "";

  constructor(userName?: string) {
    if (userName) {
      this.userName = userName;
      this.updateUser(userName);
    }
  }

  
  /**
   * Actualiza el usuario y la ruta de la colección de usuario.
   * @param newUser El nuevo nombre de usuario.
   * @returns void
   */
  public updateUser(newUser: string): void {
    this.userCollectionPath = "./data/" + newUser + ".json";
    this.userCollection = [];
  }

  /**
   * Actualiza la ruta de la colección de usuario.
   * @param path La nueva ruta de la colección de usuario.
   * @returns void
   */
  public updatePath(path: string): void {
    this.userCollectionPath = path;
    this.userCollection = [];
  }

  
  /**
   * Lee la colección de cartas desde el archivo especificado.
   * Si el archivo no existe, se crea y se inicializa con un array vacío.
   * @returns void
   */
  private readCollection(): void {
    // Asegurarse de que el archivo existe
    if (!fs.existsSync(this.userCollectionPath)) {
      fs.writeFileSync(this.userCollectionPath, "[]");
    }
    const data = fs.readFileSync(this.userCollectionPath, "utf-8");
    this.userCollection = JSON.parse(data);
  }

  /**
   * Escribe la colección de cartas en el archivo especificado.
   * @param data La colección de cartas a escribir.
   * @returns void
   */
  private writeCollection(data: ICard[]): void {
    fs.writeFileSync(this.userCollectionPath, JSON.stringify(data, null, 1));
  }

  
  /**
   * Añade una tarjeta a la colección del usuario.
   * @param card La tarjeta que se va a añadir.
   * @returns void
   */
  public addCard(card: ICard): void {
    this.readCollection();
    if (this.userCollection.find((c) => c.id === card.id)) {
      console.log(
        chalk.red("card already exists at " + this.userName + " collection"),
      );
      return;
    } else {
        this.userCollection.push(card);
        this.writeCollection(this.userCollection);
        console.log(
            chalk.green.bold("card added to " + this.userName + " collection"),
        );
    }
  }

  /**
   * Elimina una tarjeta de la colección del usuario.
   * @param id El identificador de la tarjeta que se va a eliminar.
   * @returns void
   */
  public removeCard(id: number): void {
    this.readCollection();
    const index = this.userCollection.findIndex((card) => card.id === id);
    if (index === -1) {
      console.log(
        chalk.red("card not found at " + this.userName + " collection"),
      );
      return;
    } else {
      this.userCollection.splice(index, 1);
      this.writeCollection(this.userCollection);
      console.log(
        chalk.green.bold("card removed from " + this.userName + " collection"),
      );
    }
  }

  /**
   * Lee una tarjeta de la colección del usuario.
   * @param id El identificador de la tarjeta que se va a leer.
   * @returns void
   */
  public readCard(id: number): void {
    this.readCollection();
    const card = this.userCollection.find((card) => card.id === id);
    if (card) {
        this.printCard(card);
    } else {
      console.log(
        chalk.red.bold("card not found at " + this.userName + " collection"),
      );
    }
  }

  /**
   * Actualiza una tarjeta de la colección del usuario.
   * @param card La tarjeta que se va a actualizar.
   * @param id El identificador de la tarjeta que se va a actualizar.
   * @returns void
   */
  public updateCard(card: ICard, id: number): void {
    this.readCollection();
    const index = this.userCollection.findIndex((card) => card.id === id);
    if (index === -1) {
      console.log(
        chalk.red.bold("card not found at " + this.userName + " collection"),
      );
      return;
    } else {
      this.userCollection[index] = card;
      this.writeCollection(this.userCollection);
      console.log(
        chalk.green.bold("card updated at " + this.userName + " collection"),
      );
    }
  }

  /**
   * Lista todas las tarjetas de la colección del usuario.
   * @returns void
   */
  public listCollection(): void {
    this.readCollection();
    if (this.userCollection.length === 0) {
      console.log(chalk.red("empty collection"));
      return;
    } else {
      console.log(chalk.green.bold("Collection of " + this.userName + ":"));
      this.userCollection.forEach((card) => {
        console.log("---------------------------------");
        this.printCard(card);
      });
    }
  }

  /**
   * Imprime una tarjeta.
   * @param card La tarjeta que se va a imprimir.
   * @returns void
   */
  private printCard(card: ICard) {
    const colorName = Object.keys(Color).find(key => Color[key as keyof typeof Color] === card.color);
    console.log(
      "\n " + chalk.blue.bold("Card ID: ") + card.id + "\n",
      chalk.blue.bold("Card Name: ") + card.name + "\n",
      chalk.blue.bold("Card Mana Cost: ") + card.manaCost + "\n",
      chalk.hex(card.color).bold("Card Color: ") + colorName + "\n",
      chalk.blue.bold("Card Type Line: ") + card.lineType + "\n",
      chalk.blue.bold("Card Rarity: ") + card.rarity + "\n",
      chalk.blue.bold("Card Rules Text: ") + card.ruleText + "\n",
      chalk.blue.bold("Card Market Value: ") + card.marketValue + "\n",
    );
  }

  /**
   * Obtiene una tarjeta de la colección del usuario.
   * @param id El identificador de la tarjeta que se va a obtener.
   * @returns La tarjeta que se ha obtenido ICard.
   */
  public getCard(id: number): ICard {
    this.readCollection();
    const card = this.userCollection.find((card) => card.id === id);
    if (card) {
      return card;
    } else {
      console.log(
        chalk.red.bold("card not found at " + this.userName + " collection"),
      );
      throw new Error("Card not found");
    }
  }
}
