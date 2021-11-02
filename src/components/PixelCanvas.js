export default class PixelCanvas {
  dom = null;
  ctx = null;
  rawCanvas = null;
  prev_pt = null;
  toolIndex = 0;
  width;
  height;
  pixelWidth;
  pixelHeight;

  constructor(width = 400, height = 400, pixelWidth = 64, pixelHeight = 64) {
    this.width = width;
    this.height = height;
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.initialize();
  }

  initialize() {
    this.dom = document.createElement("canvas");
    this.dom.getContext('2d').imageSmoothingEnabled = false;
    this.dom.width = this.width;
    this.dom.height = this.height;
    this.rawCanvas = document.createElement("canvas");
    this.rawCanvas.width = this.pixelWidth;
    this.rawCanvas.height = this.pixelHeight;
    this.setContext(this.rawCanvas.getContext('2d'));
  }

  setContext(ctx) {
    this.ctx = ctx;
    this.imageData = this.ctx.getImageData(0, 0, this.pixelWidth, this.pixelHeight)
    this.repaint()
  }

  setTool(index) {
    this.toolIndex = index;
  }

  repaint() {
    this.ctx.putImageData(this.imageData, 0, 0)
    let ctx = this.dom.getContext('2d')
    ctx.drawImage(this.rawCanvas, 0, 0, this.width, this.height)
  }

  onPointerOver(e) {
    // eslint-disable-next-line no-unused-vars
    let pt = this.getPoint(e)
    return false;
  }

  onPointerEnter(e) {
    // eslint-disable-next-line no-unused-vars
    let pt = this.getPoint(e)
    return false;
  }
  onPointerDown(e) {
    let pt = this.getPoint(e)
    switch (this.toolIndex) {
      case 0:
        if (pt) {
          this.setDot(pt.x, pt.y, [255, 0, 0, 255])
          this.prev_pt = pt
          this.repaint()
          return true;
        }
        break;
    }
    return false;
  }
  onPointerMove(e) {
    //todo pressure使うと出て戻ってきたときとかにややこしくなるからフラグで管理でも
    let pt = this.getPoint(e)
    switch (this.toolIndex) {
      case 0:
        if(e.pressure && pt){
          this.setLine(this.prev_pt.x, this.prev_pt.y, pt.x, pt.y, [255, 0, 0, 255])
          this.prev_pt = pt
          this.repaint()
          return true;
        }
        break;
    }
    return false;
  }
  onPointerUp(e) {
    // eslint-disable-next-line no-unused-vars
    let pt = this.getPoint(e)
    return false;
  }
  onPointerOut(e) {
    // eslint-disable-next-line no-unused-vars
    let pt = this.getPoint(e)
    return false;
  }
  onPointerLeave(e) {
    // eslint-disable-next-line no-unused-vars
    let pt = this.getPoint(e)
    return false;
  }

  getPoint(e) {
    let clientRect = e.target.getBoundingClientRect();
    let rawPt = {
      x: (e.clientX - clientRect.left) / this.width * this.pixelWidth,
      y: (e.clientY - clientRect.top) / this.height * this.pixelHeight
    };
    return (0 <= rawPt.x && rawPt.x <= this.width && 0 <= rawPt.y && rawPt.y <= this.height) ? {
      x: Math.floor(rawPt.x),
      y: Math.floor(rawPt.y)
    } : false;
  }

  setDot(x, y, color) {
    let data = this.imageData.data
    let index = (this.imageData.width * y + x) * 4
    data[index] = color[0]
    data[index + 1] = color[1]
    data[index + 2] = color[2]
    data[index + 3] = color[3]
  }

  getDot(x,y){
    let data = this.imageData.data
    let index = (this.imageData.width * y + x) * 4
    return data.slice(index,index + 3);
  }

  setLine(x1,y1,x2,y2,color){
    let steep = Math.abs(y2 - y1) > Math.abs(x2 - x1)
    if(steep){
      let tmp = x1;
      x1 = y1;
      y1 = tmp;

      tmp = x2;
      x2 = y2;
      y2 = tmp;
    }
    if(x1 > x2){
      let tmp = x1;
      x1 = x2;
      x2 = tmp;

      tmp = y1;
      y1 = y2;
      y2 = tmp;
    }
    let dx = x2 - x1
    let dy = Math.abs(y2 - y1)
    let error = dx / 2
    let y = y1
    let y_step = y1 < y2 ? 1: -1
    for(let x = x1; x <= x2; x++){
      steep ? this.setDot(y,x,color) : this.setDot(x,y,color)
      error -= dy
      if(error < 0) {
        y += y_step
        error += dx
      }
    }
  }

}