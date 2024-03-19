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

import { ICard, Color, TypeLine, Rarity } from "./ICard.js";
import fs, { readFileSync } from "fs";
import chalk from "chalk";

// Clase para manejar de forma asincrona las colecciones de cartas Magic
export class CardCollectionsHandler {
  private userCollectionPath: string = "./data/";
  private userCollection: ICard[] = [];
  private userName: string = "";

  constructor(userName?: string) {
    if (userName) {
      this.userName = userName;
      this.updatePath(userName);
    }
  }

  public updatePath(newUser: string) {
    this.userCollectionPath = "./data/" + newUser + ".json";
    this.userCollection = [];
  }

  private readCollection() {
    const data = fs.readFileSync(this.userCollectionPath, "utf-8");
    this.userCollection = JSON.parse(data);
  }

  private writeCollection(data: ICard[]) {
    fs.writeFileSync(this.userCollectionPath, JSON.stringify(data, null, 1));
  }

  public addCard(card: ICard) {
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

  public removeCard(id: number) {
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

  public readCard(id: number) {
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

  public updateCard(card: ICard, id: number) {
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

  public listCollection() {
    this.readCollection();
    if (this.userCollection.length === 0) {
      console.log(chalk.red("empty collection"));
      return;
    }
  }

  private printCard(card: ICard) {
    const colorName = Object.keys(Color).find(key => Color[key as keyof typeof Color] === card.color);
    console.log(
      " " + chalk.blue.bold("Card ID: ") + card.id + "\n",
      chalk.blue.bold("Card Name: ") + card.name + "\n",
      chalk.blue.bold("Card Mana Cost: ") + card.manaCost + "\n",
      chalk.hex(card.color).bold("Card Color: ") + colorName + "\n",
      chalk.blue.bold("Card Type Line: ") + card.lineType + "\n",
      chalk.blue.bold("Card Rarity: ") + card.rarity + "\n",
      chalk.blue.bold("Card Rules Text: ") + card.ruleText + "\n",
      chalk.blue.bold("Card Market Value: ") + card.marketValue + "\n",
    );
  }
    
}
