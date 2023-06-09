class Assistant {
  constructor(name, id) {
    this.id = id;
    this.name = name;
  }

  // här kommer eventuella getters, setters elle andra "nödvändiga" metoder

  getAssistantID() {
    return this.id;
  }

  getAssistantName() {
    return this.name;
  }

  setAssistantID(id) {
    this.id = id;
  }

  setAssistantName(name) {
    this.name = name;
  }
}

export default Assistant;
