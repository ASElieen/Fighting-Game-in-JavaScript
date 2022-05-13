import { Sprite, Fighter } from "./classes.js"
export { background, shop, player, enemy }
//--------------------背景------------------------
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: 'img/background.png'
})

//------------------------------商店--------------------------
const shop = new Sprite({
    position: {
        x: 650,
        y: 225
    },
    scale: 2,
    imgSrc: 'img/shop.png',
    frameMax: 6,
    frameGap: 10
})

//--------------------------玩家(左)---------------------------
const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imgSrc: './img/samuraiMack/Idle.png',
    frameMax: 8,
    frameGap: 10,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idleRight: {
            imgSrc: './img/samuraiMack/Idle.png',
            frameMax: 8
        },
        idleLeft: {
            imgSrc: './img/samuraiMack/IdleToLeft.png',
            frameMax: 8
        },
        runRight: {
            imgSrc: './img/samuraiMack/Run.png',
            frameMax: 8
        },
        runLeft: {
            imgSrc: './img/samuraiMack/RunToLeft.png',
            frameMax: 8
        },
        jumpRight: {
            imgSrc: './img/samuraiMack/Jump.png',
            frameMax: 2
        },
        jumpLeft: {
            imgSrc: './img/samuraiMack/JumpToLeft.png',
            frameMax: 2
        },
        fallRight: {
            imgSrc: './img/samuraiMack/Fall.png',
            frameMax: 2
        },
        fallLeft: {
            imgSrc: './img/samuraiMack/FallToLeft.png',
            frameMax: 2
        },
        attack1Right: {
            imgSrc: './img/samuraiMack/Attack1.png',
            frameMax: 6
        },
        attack1Left: {
            imgSrc: './img/samuraiMack/Attack1ToLeft.png',
            frameMax: 6
        },
        takeHit: {
            imgSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            frameMax: 4
        },
        death: {
            imgSrc: './img/samuraiMack/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})


//-------------------------------------玩家(右)-----------------------
const enemy = new Fighter({
    position: {
        x: 750,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imgSrc: './img/kenji/Idle.png',
    frameGap: 14,
    frameMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idleLeft: {
            imgSrc: './img/kenji/Idle.png',
            frameMax: 4
        },
        idleRight: {
            imgSrc: './img/kenji/IdleToRight.png',
            frameMax: 4
        },
        runLeft: {
            imgSrc: './img/kenji/Run.png',
            frameMax: 8
        },
        runRight: {
            imgSrc: './img/kenji/RunToRight.png',
            frameMax: 8
        },
        jumpLeft: {
            imgSrc: './img/kenji/Jump.png',
            frameMax: 2
        },
        jumpRight: {
            imgSrc: './img/kenji/JumpToRight.png',
            frameMax: 2
        },
        fallLeft: {
            imgSrc: './img/kenji/Fall.png',
            frameMax: 2
        },
        fallRight: {
            imgSrc: './img/kenji/FallToRight.png',
            frameMax: 2
        },
        attack1Left: {
            imgSrc: './img/kenji/Attack2.png',
            frameMax: 4
        },
        attack1Right: {
            imgSrc: './img/kenji/Attack2ToRight.png',
            frameMax: 4
        },
        takeHit: {
            imgSrc: './img/kenji/Take hit.png',
            frameMax: 3
        },
        death: {
            imgSrc: './img/kenji/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})