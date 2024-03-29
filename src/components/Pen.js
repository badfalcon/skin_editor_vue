export default class Pen{
    name="pen";

    // eslint-disable-next-line no-unused-vars
    onPointerEnter(ctx,pt){
        ctx.lineWidth = 0.5;
        return false
    }

    onPointerDown(ctx,pt) {
        ctx.beginPath();
        this.pressed = true;
        ctx.moveTo(pt.x, pt.y);
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    onPointerUp(ctx, pt) {
        if (this.pressed) {
            ctx.stroke();
            this.pressed = false;
            return true;
        }
        return false;
    }

    onPointerMove(ctx, pt) {
        if (this.pressed) {
            ctx.lineTo(pt.x, pt.y);
            ctx.stroke();
            return true;
        }
        return false;
    }
}