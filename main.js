const canvas = $('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;
const time = 100;
setTimer(time)

ctx.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: 'img/background.png'
})

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

const player = new Fighter({
    position: {
        x: 0,
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
        idle: {
            imgSrc: './img/samuraiMack/Idle.png',
            frameMax: 8
        },
        run: {
            imgSrc: './img/samuraiMack/Run.png',
            frameMax: 8
        },
        jump: {
            imgSrc: './img/samuraiMack/Jump.png',
            frameMax: 2
        },
        fall: {
            imgSrc: './img/samuraiMack/Fall.png',
            frameMax: 2
        },
        attack1: {
            imgSrc: './img/samuraiMack/Attack1.png',
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

const enemy = new Fighter({
    position: {
        x: 400,
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
    frameGap: 10,
    frameMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imgSrc: './img/kenji/Idle.png',
            frameMax: 4
        },
        run: {
            imgSrc: './img/kenji/Run.png',
            frameMax: 8
        },
        jump: {
            imgSrc: './img/kenji/Jump.png',
            frameMax: 2
        },
        fall: {
            imgSrc: './img/kenji/Fall.png',
            frameMax: 2
        },
        attack1: {
            imgSrc: './img/kenji/Attack1.png',
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


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

//此时rec1 玩家 rec2敌方
function hitboxCollision(rectangle1, rectangle2) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height && rectangle1.isAttacking)

}

// function jumpTest(role) {
//     if (role.velocity.y < 0 && role.image !== role.sprites.jump.image) {
//         role.image = role.sprites.jump.image;
//         role.frameMax = role.sprites.jump.frameMax;
//         role.frameCurrent = 0;
//     } else {
//         role.image = role.sprites.idle.image;
//         role.frameMax = role.sprites.idle.frameMax;
//         role.frameCurrent = 0;
//     }
// }


function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    //玩家左右移动 没按键时默认为站立
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    //玩家跳跃和下落
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //敌方左右移动
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    //敌方跳跃
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //敌我击中判定
    if (hitboxCollision(player, enemy) && player.isAttacking && player.frameCurrent == 4) {
        enemy.takeHit();
        player.isAttacking = false;
        watchDamage(player);
    }
    if (hitboxCollision(enemy, player) && enemy.isAttacking && enemy.frameCurrent == 2) {
        player.takeHit();
        enemy.isAttacking = false;
        watchDamage(enemy);
    }

    //双方miss的情况
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false
    }

}

animate();


//事件监听
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break
        case 'w':
            //防二段跳
            if (player.position.y + player.height < canvas.height - 96) return
            player.velocity.y = -10;
            break
        case ' ':
            e.preventDefault();
            player.attack();
            break
    }

    //敌方
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break
        case 'ArrowRight':
            e.preventDefault();
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break
        case 'ArrowUp':
            e.preventDefault();
            if (enemy.position.y + enemy.height < canvas.height - 96) return
            enemy.velocity.y = -10;
            break
        case ('ArrowDown'):
            e.preventDefault();
            enemy.attack();
            break

    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false;
            player.image = player.sprites.idle.image
            break
        case 'a':
            keys.a.pressed = false;
            player.image = player.sprites.idle.image
            break
    }

    //敌方
    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            enemy.image = enemy.sprites.idle.image;
            enemy.frameMax = enemy.sprites.idle.frameMax;
            // enemy.image = enemy.sprites.idle.image;
            // enemy.frameMax = enemy.sprites.idle.frameMax;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            enemy.image = enemy.sprites.idle.image;
            // enemy.image = enemy.sprites.idle.image;
            enemy.frameMax = enemy.sprites.idle.frameMax;
            break
    }
})