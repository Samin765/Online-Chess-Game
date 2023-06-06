class Assistant { 
  constructor(name, id){
    this.id = id;
    this.name= name;
  }
 
  //här kommer eventuella getters, setters elle andra "nödvändiga" metoder

  getAssistanID(){
      return this.id;
  }
  getAssistanName(){
      return this.name;
  }

  setAssistanID(id){
      this.id = id;
      }
  setAssistanName(name){
      this.name= name;
  }
 
}


export default Assistant;