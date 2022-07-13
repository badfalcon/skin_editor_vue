export default class ActionManager
{
  actionList = [];
  index = 0;
  constructor() {
    document.addEventListener('editorAction',(e)=>{
      console.log("action called");
      console.log(e);
    });
  }

  addAction(action){
    if(this.canRedo()){
      console.log(this.actionList);
      this.actionList.splice(this.index);
      console.log(this.actionList);
    }
    this.actionList.add(action);
    ++this.index;
  }

  undoAction(){

  }

  redoAction(){

  }

  canUndo(){
    return this.index !== 0;
  }

  canRedo(){
    return this.index !== this.actionList.length;
  }
}

