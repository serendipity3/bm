import {Parameters} from "./parameter";
import {Molecules} from "./molecular"


export class BrownianMotion {
// Setting {{{
    dimension = 2;
    elementID:number = 1;
    bathT:number = 300e0;
    dt:number = 15e0 * Parameters.FS;
    v0:number = 4e2;
    particleNumber = 100;
    realLength = 2.6e1 * Parameters.molecules[this.elementID][3];
//    particleNumber = 200;
//    realLength = 3.5e1 * Parameters.molecules[this.elementID][3];
// }}}
    t:number;
    area:number[];
    aspect:number;
    particles:Molecules[];

    constructor(aspect:number) {
        this.t = 0e0;

        this.aspect = aspect;
        this.area = [this.realLength, this.realLength*this.aspect];

        this.particles = [];
        let sqrtN = Math.sqrt(this.particleNumber) + 1
        for (let i=1; i<=this.particleNumber; i++) {
            let position = [
                Math.floor(i%sqrtN)*this.area[0]/sqrtN + Parameters.molecules[this.elementID][3],
                Math.floor(i/sqrtN)*this.area[1]/sqrtN + Parameters.molecules[this.elementID][3]
            ]
            this.particles.push( new Molecules(this.dimension, this.elementID, this.v0, position) );
        };

        let halfN = Math.floor(this.particleNumber/2)
        let position = [
            this.particles[halfN].position[0] + 5e-1 * (this.area[0] / sqrtN),
            this.particles[halfN].position[1] + 5e-1 * (this.area[1] / sqrtN)
        ]
        this.particles.push( new Molecules(this.dimension, 9, this.v0, position) );
    };

    get temperature () {
        let KE = 0
        for (let i=0; i<=this.particleNumber; i++) {
            KE += this.particles[i].energy;
        };
        KE = KE / (this.particleNumber+1) / Parameters.KB
        return KE
    };

    update () {
        this.t += this.dt
        for (let i=0; i<=this.particleNumber; i++) {
            for (let j=0; j<=this.dimension-1; j++) {
                this.particles[i].force[j] = 0e0;
            };
        };

        for (let i=0; i<=this.particleNumber; i++) {
            for (let j=i+1; j<=this.particleNumber; j++) {
                if (j > this.particleNumber) {
                    break;
                };
                this.particles[j].calcForce(this.particles[i]);
            };
        };

        let T = this.temperature;
        let Tr = Math.sqrt(this.bathT/T);
        if (Tr < 5e-1) {
            Tr = 5e-1;
        } else if (Tr > 1.2e0) {
            Tr = 1.2e0;
        };
        for (let i=0; i<=this.particleNumber; i++) {
            this.particles[i].move(this.dt, this.area, Tr);
        };
    };

    getRadius(i:number, displayLength:number):number {
        let scale = displayLength / this.realLength
        return this.particles[i].sigma * scale;
    };

    getPositions(displayLength:number):number[][] {
        let scale = displayLength / this.realLength
        let positions:number[][] = [];


        for (let i=0; i<=this.particleNumber; i++) {
            let tmp:number[] = [];
            for (let j=0; j<=this.dimension-1; j++) {
                tmp.push( Math.floor((this.particles[i].position[j]-this.particles[i].sigma/2) * scale) );
            };
            positions.push( tmp );
        };

        return positions;
    };

    getTrajectry(displayLength:number):number[] {
        let scale = displayLength / this.realLength
        let i = this.particleNumber
        let trajectry:number[] = [];
        for (let j=0; j<=this.dimension-1; j++) {
            trajectry.push( Math.floor(this.particles[i].position[j] * scale) );
        };

        return trajectry;

    };
};
