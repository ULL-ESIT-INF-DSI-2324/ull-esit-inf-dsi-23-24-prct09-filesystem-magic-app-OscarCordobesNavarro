import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';


// De esta forma podemos definir varios comandos para nuestra aplicación
yargs(hideBin(process.argv))
  .command('add', 'Adds a card to the collection', {
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  console.log("ID: ", argv.id, " added to the collection ");
 })
 .command('sub', 'sub a card to the collection', {
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  console.log("ID: ", argv.id, " sub to the collection ");
 })
 .help()
 .argv;



//----- EJEMPLO paquete chalk -> Simplemente es un paquete para modificar el color de la consola y ya

import chalk from "chalk";

const log = console.log;

// Combine styled and normal strings
log(chalk.blue("Hello") + " World" + chalk.red("!"));

// Compose multiple styles using the chainable API
log(chalk.blue.bgRed.bold("Hello world!"));

// Pass in multiple arguments
log(chalk.blue("Hello", "World!", "Foo", "bar", "biz", "baz"));

// Nest styles
log(chalk.red("Hello", chalk.underline.bgBlue("world") + "!"));

// Nest styles of the same type even (color, underline, background)
log(
  chalk.green(
    "I am a green line " +
      chalk.blue.underline.bold("with a blue substring") +
      " that becomes green again!"
  )
);