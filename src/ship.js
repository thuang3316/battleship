export class Ship {
    constructor(length) {
        this.id = crypto.randomUUID();
        this.length = length;
        this.hitTimes = 0;
        this.sunk = false;
        this.col = null;
        this.row = null;
        this.dir = null;
    }

    hit() {
        // ship being hit
        if (!this.sunk) {
            this.hitTimes ++;
            this.isSunk();
        }
    }

    isSunk() {
        // judge if a ship is sunk
        if (this.hitTimes >= this.length) {
            this.sunk = true;
        }
    }

    resetShip() {
        // reset a ship to its initial status
        this.hitTimes = 0;
        this.sunk = false;
    }
}