class Sprite {
    //offset修改放置xy坐标位置 即移动中心人像让人像靠近左上切图起始点
    constructor({ position, imgSrc, scale = 1, frameMax = 1, frameGap = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.frameCurrent = 0;
        this.frameTime = 0;
        this.frameGap = frameGap;
        this.offset = offset;
    }

    draw() {
        ctx.drawImage(this.image,
            this.frameCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.frameMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.frameMax) * this.scale,
            this.image.height * this.scale)
    }

    animateFrame() {
        this.frameTime++;
        if (this.frameTime % this.frameGap == 0) {
            if (this.frameCurrent + 1 < this.frameMax) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrame();
    }

}

//Fighter类也需要img 所以继承Sprite类
class Fighter extends Sprite {
    constructor({ position, velocity, color = 'red', imgSrc, scale = 1, frameMax = 1, frameGap = 1, offset = { x: 0, y: 0 }, sprites, attackBox = { offset: {}, width: undefined, height: undefined } }) {
        super({
                position,
                imgSrc,
                scale,
                frameMax,
                frameGap,
                offset
            })
            // this.position = position;
            //速度v
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.hp = 100;
        this.frameCurrent = 0;
        this.frameTime = 0;
        this.sprites = sprites;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.dead = false;

        for (let sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc;
        }
    }

    // draw() {
    //     ctx.fillStyle = this.color;
    //     ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    //     //画出hitbox
    //     if (this.isAttacking) {
    //         ctx.fillStyle = 'green';
    //         ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw();
        if (!this.dead) this.animateFrame();


        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        // this.velocity.y += gravity;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.frameMax - 1)
                this.dead = true
            return
        }

        //出刀时不执行其他任何动作
        if (
            this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.frameMax - 1
        )
            return

        // 被击中时不执行任何动作
        if (
            this.image === this.sprites.takeHit.image &&
            this.frameCurrent < this.sprites.takeHit.frameMax - 1
        )
            return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.frameMax = this.sprites.idle.frameMax;
                    this.frameCurrent = 0;
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.frameMax = this.sprites.run.frameMax
                    this.frameCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.frameMax = this.sprites.jump.frameMax
                    this.frameCurrent = 0
                }
                break

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.frameMax = this.sprites.fall.frameMax
                    this.frameCurrent = 0
                }
                break

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.frameMax = this.sprites.attack1.frameMax
                    this.frameCurrent = 0
                }
                break

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.frameMax = this.sprites.takeHit.frameMax
                    this.frameCurrent = 0
                }
                break

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.frameMax = this.sprites.death.frameMax
                    this.frameCurrent = 0
                }
                break
        }
    }
}