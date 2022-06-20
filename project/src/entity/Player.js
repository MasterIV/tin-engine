
import Entity from 'tin-engine/basic/entity';
import RectEntity from 'tin-engine/basic/rect';
import V2, {Zero} from 'tin-engine/geo/v2';

export default class Player extends Entity {
    constructor() {
        super(new V2(100, 100));
        this.add(new RectEntity(Zero(), new V2(50, 100)));
        this.velocity = Zero();
        this.inheritSize();
    }

    up(key) {
        if(key === 'up' && this.velocity.y < 0) this.velocity = Zero();
        if(key === 'down' && this.velocity.y > 0) this.velocity = Zero();
        if(key === 'left' && this.velocity.x < 0) this.velocity = Zero();
        if(key === 'right' && this.velocity.x > 0) this.velocity = Zero();
    }

    down(key) {
        switch(key) {
            case 'up': this.velocity = new V2(0,-1); break;
            case 'down': this.velocity = new V2(0,1); break;
            case 'left': this.velocity = new V2(-1,0); break;
            case 'right': this.velocity = new V2(1,0); break;
        }
    }

    update(delta) {
        this.position.add(this.velocity.prd(delta/10));
        this.position.x = Math.max(0, Math.min(this.parent.size.x-this.size.x, this.position.x));
        this.position.y = Math.max(0, Math.min(this.parent.size.y-this.size.y, this.position.y));
    }
}
