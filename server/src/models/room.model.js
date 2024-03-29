/**
 * @class Room
 */
class Room {
  constructor(name) {
    this.name = name;
    this.messages = [];
    this.members = 0;
  }

  /**
   * Add a message.
   * @param {String} message - The message to add.
   * @returns {void}
   */
  addMessage(message) {
    this.messages = message;
  }
}

export default Room;
