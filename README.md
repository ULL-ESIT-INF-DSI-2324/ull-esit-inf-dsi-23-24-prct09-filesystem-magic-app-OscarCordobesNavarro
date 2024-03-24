

<p align="center">
  <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-OscarCordobesNavarro/actions/workflows/node.js.yml">
    <img src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-OscarCordobesNavarro/actions/workflows/node.js.yml/badge.svg" alt="Tests">
  </a>
  <a href="https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-OscarCordobesNavarro?branch=main">
    <img src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-OscarCordobesNavarro/badge.svg?branch=main" alt="Coverage Status">
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-OscarCordobesNavarro">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-OscarCordobesNavarro&metric=alert_status" alt="Quality Gate Status">
  </a>
</p>

# Introducción

En esta práctica, vamos a adentrarnos en el uso de las APIs proporcionadas por Node JS. En este caso, utilizaremos la API para la lectura y escritura de archivos de manera síncrona.

Con esto en mente, desarrollaremos un sencillo gestor de colecciones de cartas de Magic utilizando la API síncrona recién mencionada, además de yargs y chalk, y aplicando todo el conocimiento adquirido en prácticas anteriores.

Aprenderemos también a utilizar los paquetes Chalk y Yargs. El primero para darle color a los textos volcados por la salida estándar y el segundo para poder parsear argumentos por la línea de comandos para nuestro programa.

# Aplicación para coleccionistas de cartas Magic

Antes de nada, debemos definir cómo serán las cartas de nuestra colección atendiendo al enunciado de la práctica. En este caso, vamos a tener unas restricciones en cuanto al color de la carta, la rareza y la línea de tipo. Para ello, se han creado los siguientes enumerados:

```typescript
// COLOR
export enum Color {
  White = "FFFFFF",
  Blue = "0000FF",
  Black = "000000",
  Red = "FF0000",
  Green = "00FF00",
  ColorLess = "colorless",
  Multicolor = "multicolor",
}

// RAREZA
export enum Rarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Mythical = "Mythical",
}

// LINEA DE TIPO
export enum TypeLine {
    Land = "Land",
    Creature = "Creature",
    Enchantment = "Enchantment",
    Sorcery = "Sorcery",
    Instant = "Instant",
    Artifact = "Artifact",
    Planeswalker = "Planeswalker",
}
```

Llama la atención la forma de implementar los colores. Los represento en formato hexadecimal para poder utilizar el método `hex` de Chalk a la hora de imprimir la carta y mostrarla por consola.

Con todo esto ya podemos definir lo que es una carta, lo definimos con una interfaz:

```typescript
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
```

Recordemos que los parámetros strength y endurance deben de ser introducidos para los de tipo creature y el parámetro de brandsLoyalty para los de tipo PlanesWalker.

Ahora con las cartas ya definidas podemos empexar a desarrollar el manejador de las cartas, el `CardCollectionsHandler`, el objetivo es que esta clase sea quien haga las operaciones de lectura y escritura de los archivos JSON de cada usuario utilizando la API sincrona para lectura y escritura de ficheros. 

La idea es que el manejador tenga una dirección asignada en donde se encontrará el JSON correspondiente, además de que contendrá operaciones para `añadir`, `eliminar`, `listar`, `listar` y `actualizar` las cartas de la colección. Los elementos que estarán dentro del JSON tendrán que estar implementado con la interfaz de cartas que hemos mencionado antes:

```typescript
export class CardCollectionsHandler {
  // Ruta por defecto en donde estarán los usuarios
  private userCollectionPath: string = "./data/";
  // Coleccion del usuario al que estamos apuntando
  private userCollection: ICard[] = [];
  // Usuario que estamos apuntando
  private userName: string = "";

  constructor(userName?: string);

  // Método para imprimir una carta
  private printCard(card: ICard);
  // Método que utiliza la API sincrona para leer y actualizar la propiedad `userCollection`
  private readCollection(): void;
  // Método que utiliza la api sincrona para escribir en el JSON
  private writeCollection(data: ICard[]): void;
  // Método para obtener la ruta
  public getUserCollectionPath(): string;
  // Método para obtener el usuario que estamos manejando
  public getUserName(): string;
  // Método para actualizar el usuario que estamos gestionando
  public updateUser(newUser: string): void;
  // Método para actualizar la direccion entera del archivo JSON
  public updatePath(path: string): void;

  // Métodos principales mencionados
  public addCard(card: ICard): void;

  public removeCard(id: number): void;

  public showCard(id: number): void;

  public updateCard(card: ICard, id: number): void;

  public listCollection(): void;

  // Método para obtener una carta según su ID
  public getCard(id: number): ICard;
  // Limpiar la coleccion entera
  public clearCollection(): void;
}
```

Destacar también el uso de chalks en el método privado de `printCard`, la sintaxis de `chalks` es tan sencilla que se puede detectar y aprender a simple vista.
```typescript
  private printCard(card: ICard) {
    const colorName = Object.keys(Color).find(
      (key) => Color[key as keyof typeof Color] === card.color,
    );
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
```

En mi caso he decidido gestionar todos los errores mediante los bloques de tipo `try...catch` y propagando los errores desde su inicio, todos los métodos en donde se encuentran escenarios inoportunos retornan objetos de tipo `Error`.

Con esto ya tendríamos toda la parte de gestión de las colecciones. Ahora vamos a pasar a `yargs`, donde se situará nuestro flujo inicial del programa. Como ya hemos dicho, Yargs maneja argumentos por la línea de comandos.
En este caso, invocamos a Yargs con todos los argumentos en la consola, y a partir de esto vamos concatenando los comandos que vayamos a aceptar. Un ejemplo sería el de la lectura:

```typescript
yargs(hidebin(process.argv)).command(
    "read",
    "Read a card of the user collection",
    {
      user: {
        alias: "u",
        description: "User Name",
        type: "string",
        demandOption: true,
      },
      id: {
        alias: "i",
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const cardHandler = new CardCollectionsHandler(argv.user);
      try {
        cardHandler.showCard(argv.id);
      } catch(error) {
        console.log(chalk.red(error.message));
        return;
      }
    },
  ).help().argv
```

En este caso, tenemos los argumentos obligatorios "user" e "id", y después gestionamos los argumentos con el callback correspondiente donde intentamos mostrar la carta utilizando el manejador de cartas.

Esto lo hacemos con el resto de los comandos.

# Modificacion PE101

El objetivo era implementar el patrón Template Method para procesar archivos con distintos formatos pero que contienen la misma información, en este caso, un JSON y un CSV con un formato algo especial según lo descrito en el enunciado del ejercicio.

La idea era tener una clase abstracta llamada `Processor` en la que se definieran los distintos pasos para procesar los archivos, independientemente de su formato. Además, se podrían incluir algunos "hooks" o métodos opcionales.

```typescript
abstract class Processor {
    protected benefits: Array<number> = [];
    protected weights: Array<number> = [];
    protected Capacity: number = 0;
    protected NumElements: number = 0;

    public process(): [Array<number>, Array<number>] {
        this.beforeRead();
        this.readTheFile();
        this.afterRead();
        return [this.getWeights(), this.getBenefits()];
    }

    abstract readTheFile(): void;
    public getWeights(): Array<number> {
        return this.weights;
    };

    public getBenefits(): Array<number> {
        return this.benefits;
    
    };

    protected beforeRead(): void {}
    protected afterRead(): void {}

}

class JSONProcessor extends Processor {
    private data: Array<BackPack> = [];
    public readTheFile(): void {
        try {
            this.data = JSON.parse(fs.readFileSync('./src/Modificacion/elements.json', 'utf-8'));
            this.data[0].elements.forEach((element: any) => { // Update the type annotation to 'any'
                this.benefits.push(element.benefit);
                this.weights.push(element.weight);
            });
            console.log("Beneficios:", this.benefits);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    }

    protected beforeRead(): void {
        // Nos aseguramos que el archivo exista
        if (!fs.existsSync('./src/Modificacion/elements.json')) {
            console.error("El archivo no existe");
            process.exit();
        }
    }

}

class CSVProcessor extends Processor {
    private data: string = "";
    public readTheFile(): void {
        try {
            // Leer el archivo CSV y dejarlo en una linea
            this.data = fs.readFileSync('./src/Modificacion/elements.csv', 'utf-8');
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    }

    protected afterRead(): void {
        // Limpiamos las comas de los datos
        this.data = this.data.replace(/,/g, '');
        // Quitamos los saltos de linea
        this.data = this.data.replace(/\r/g, '');
        // Separamos los datos por saltos de linea
        const lines = this.data.split('\n');
        // Obtenemos la capacidad
        this.Capacity = parseInt(lines[0]);
        // Obtenemos el numero de elementos
        this.NumElements = parseInt(lines[1]);
        // Obtenemos los pesos
        this.weights = lines[2].split(' ').map((weight: string) => parseInt(weight));
        // Eliminamos el primero
        this.weights.shift();
        // Obtenemos los beneficios
        this.benefits = lines[3].split(' ').map((benefit: string) => parseInt(benefit));
        // Eliminamos el primero
        this.benefits.shift();
    }
}
```

# Conclusión

Esta práctica ha sido beneficiosa para comprender la lectura de archivos de forma asíncrona mediante la API de Node, explorar la documentación de Node y familiarizarse con los paquetes Chalk y Yargs, herramientas muy útiles e interesantes para conocer, deseando ver la parte asíncrona.
