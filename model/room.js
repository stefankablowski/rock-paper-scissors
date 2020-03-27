class Room {
    constructor() {
        this.players = [];
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    pop() {
        return this.players.shift();
    }

    push(player) {
        this.players.push(player);
    }

}