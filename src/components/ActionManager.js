export default class ActionManager
{
  actionList = [];
  index = 0;
  constructor() {

  }

  addAction(){

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