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

import fs from 'fs';
import { BackPack } from './IBackPack.js';
import { Element } from './IElement.js';

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

const csvProcessor = new CSVProcessor();
const [weights, elements] = csvProcessor.process();
const jsonProcessor = new JSONProcessor();
const [weights2, elements2] = jsonProcessor.process();

console.log("Pesos:", weights);
console.log("Elementos:", elements);
console.log("--------------------");
console.log("Pesos:", weights2);
console.log("Elementos:", elements2);

