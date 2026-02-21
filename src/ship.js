export class Ship {
    constructor(length, name) {
        this.id = crypto.randomUUID();
        this.length = length;
        this.name = name;
        this.hitTimes = 0;
        this.sunk = false;
        this.col = null;
        this.row = null;
        this.dir = null;
    }

    hit() {
        if (!this.sunk) {
            this.hitTimes++;
            if (this.hitTimes >= this.length) this.sunk = true;
        }
    }

    resetShip() {
        this.hitTimes = 0;
        this.sunk = false;
        this.col = null;
        this.row = null;
        this.dir = null;
    }
}