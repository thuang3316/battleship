export class Ship {
    constructor(length, hitTimes=0, sunk=false) {
        this.length = length;
        this.hitTimes = hitTimes;
        this.sunk = sunk;
    }

    hit() {
        // ship being hit
        if (!this.sunk) {
            this.hitTimes ++;
            this.isSunk();
        }
    }

    isSunk() {
        // judge if a ship is sunk+
        if (this.hitTimes === this.length) {
            this.sunk = true;
        }
    }
}