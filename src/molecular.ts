import {Parameters} from "./parameter";

export class Molecules { // {{{

    private _size: number;
    private _key: number;
    private _color: string;
    private _mass: number;
    private _epsi: number;
    private _sigma: number;
    private _velocity: number[];
    force: number[];
    position: number[];

    constructor (dimension:number, key:number, average_velocity:number, position:number[]) {
        this._size = dimension-1;
        this._key = key;
        this._color = Parameters.colorMap[key];
        this._mass  = Parameters.molecules[key][0];
        this._epsi  = Parameters.molecules[key][2];
        this._sigma = Parameters.molecules[key][3];

        this._velocity = [];
        this.force = [];
        this.position = [];
        for (let i=0; i<=this._size; i++) {
            this._velocity.push( (Math.random()-5e-1) * average_velocity );
            this.position.push( position[i] );
            this.force.push(0e0);
        };

    };

    move (dt:number, area:number[], ratio:number) {
        for (let i = 0; i <= this._size; i++) {
            this._velocity[i] += this.force[i] / this._mass * dt
            let nextPosition = this.position[i] + this._velocity[i] * dt

            let flag:boolean = false;
            if (nextPosition < this._sigma/2) {
                flag = true
                this._velocity[i] = - this._velocity[i]
                this.position[i] = this._sigma/2
            } else if (nextPosition > area[i] - this._sigma/2) {
                flag = true
                this._velocity[i] = - this._velocity[i]
                this.position[i] = area[i] - this._sigma/2
            } else {
                this.position[i] = nextPosition
            };

            if (flag == true) {
                this._velocity = this._velocity.map( function (value) {
                    return value * ratio;
                });
            };
        };
    };

    get color():string {
        return this._color;
    };

    get sigma():number {
        return this._sigma;
    };

    get epsi():number {
        return this._epsi;
    };

    get energy():number {
        let e = 0e0
        for (let i=0; i<=this._size; i++) {
            e += 5e-1 * this._mass * this._velocity[i]**2
        };
        return e;
    };

    calcForce (molecules:Molecules) {
        let R = [];
        let rij:number = 0e0;
        for (let i=0; i<=this._size; i++) {
            R.push( this.position[i] - molecules.position[i] );
            rij += R[i]**2;
        };
        rij = Math.sqrt(rij)
        let s  = 5e-1*(this._sigma + molecules.sigma)
        let ep = 5e-1*(this._epsi  + molecules.epsi )
        let r  = s/rij
        let r3 = r*r*r
        let r6 = r3*r3
        let f = 24e0*ep*r6*(2e0*r6-1e0)/rij
        for (let i=0; i<=this._size; i++) {
            this.force[i]      +=  f*R[i]/rij
            molecules.force[i] += -f*R[i]/rij
        };
    };
};
// }}}

