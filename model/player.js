module.exports = class Player {
    constructor(name, socketId) {
        this.name = name;
        this.socketId = socketId;
        this.state = null;
        this.choice = null;
    }
}