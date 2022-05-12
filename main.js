import { background, shop, player, enemy } from './instance.js'
import { setTimer, moveCase, hitboxCollision, watchDamage, jumpCase, hitCase, missCase } from './functionCase.js'
setTimer(time)

ctx.fillRect(0, 0, canvas.width, canvas.height);


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
    moveCase(player, keys.a, keys.d, 'a', 'd');

    //玩家跳跃和下落
    jumpCase(player, 'a', 'd');

    //敌方左右移动
    moveCase(enemy, keys.ArrowLeft, keys.ArrowRight, 'ArrowLeft', 'ArrowRight');

    //敌方跳跃下落
    jumpCase(enemy, 'ArrowLeft', 'ArrowRight');

    //敌我击中判定
    hitCase(player, enemy, 4);
    hitCase(enemy, player, 2);

    //双方miss的情况
    missCase(player);
    missCase(enemy);

}

animate();


//事件监听
window.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (player.image !== player.sprites.death.image) {
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
                if (player.lastKey === 'd') {
                    player.attackRight();
                } else if (player.lastKey === 'a') {
                    player.attackLeft();
                }
                break
        }
    }

    //敌方
    if (enemy.image !== enemy.sprites.death.image) {
        switch (e.key) {
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break
            case 'ArrowUp':
                //防二段跳
                if (enemy.position.y + enemy.height < canvas.height - 96) return
                enemy.velocity.y = -10;
                break
            case 'ArrowDown':
                if (enemy.lastKey === 'ArrowRight') {
                    enemy.attackRight();
                } else if (enemy.lastKey === 'ArrowLeft') {
                    enemy.attackLeft();
                }
                break

        }
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
    }

    //敌方
    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
    }
})