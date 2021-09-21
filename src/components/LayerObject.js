export default class layerObject{
  id
  nickname
  visible

  dom
  // todo add context
  constructor(id) {
    this.id = id
    this.nickname = "layer"+id
    this.visible = true;
    this.dom = document.createElement('canvas')
    this.dom.width = 64;
    this.dom.height = 64;
    let ctx = this.dom.getContext('2d');
    ctx.fillStyle = this.getRandomColour();
    ctx.fillRect(0,0,64,64);
  }

  toggleVisible(){
    this.visible = !this.visible
  }

  getRandomColour() {
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);

    return "rgb(" + red + "," + green + "," + blue + " )";
  }
}