import { player, enemy } from './instance.js'
export { setTimer, moveCase, hitboxCollision, watchDamage, jumpCase, hitCase, missCase }
/**
 * @description 计时器
 * @param {*} time 
 */
const setTimer = (time) => {
    let interval = setInterval(() => {
        timer.innerHTML = time;
        time--;
        if (time == 0) {
            clearInterval(interval);
        };

        if (enemy.hp <= 0 || player.hp <= 0) {
            time = 100;
            timer.innerHTML = time;
            clearInterval(interval)
        }
    }, 1000)
}

/**
 * @description 双方移动代码段复用
 * @param {角色} role 
 * @param {keys对象中左右角色对应的左键} leftKey 
 * @param {keys对象中左右角色对应的右键} rightKey 
 * @param {角色对应左键在键盘事件中的对应key键} leftKeyStr 
 * @param {角色对应右键在键盘事件中的对应key键} rightKeyStr 
 */
const moveCase = (role, leftKey, rightKey, leftKeyStr, rightKeyStr) => {
    if (leftKey.pressed && role.lastKey === leftKeyStr) {
        role.velocity.x = -5;
        role.switchSprite('runLeft');
    } else if (rightKey.pressed && role.lastKey === rightKeyStr) {
        role.velocity.x = 5;
        role.switchSprite('runRight');
    } else {
        role.lastKey === leftKeyStr ? role.switchSprite('idleLeft') : role.switchSprite('idleRight');
    }
}

/**
 * @description 双方跳跃代码段复用
 * @param {角色} role 
 * @param {角色对应左键在键盘事件中的对应key键} leftKey 
 * @param {角色对应右键在键盘事件中的对应key键} rightKey 
 */
const jumpCase = (role, leftKey, rightKey) => {
    if (role.velocity.y < 0 && role.lastKey === leftKey) {
        role.switchSprite('jumpLeft')
    } else if (role.velocity.y < 0 && role.lastKey === rightKey) {
        role.switchSprite('jumpRight')
    }

    if (role.velocity.y > 0 && role.lastKey === leftKey) {
        role.switchSprite('fallLeft')
    } else if (role.velocity.y > 0 && role.lastKey === rightKey) {
        role.switchSprite('fallRight')
    }
}


function hitboxCollision(rectangle1, rectangle2) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height && rectangle1.isAttacking)

}

/**
 * @description 监测hit并扣血
 * @param {角色 敌方or玩家} role 
 */
const watchDamage = (role) => {
    if (role == player && enemy.hp >= 0) {
        rightHp.style.width = enemy.hp + '%';
    }
    if (role == enemy && player.hp >= 0) {
        leftHp.style.width = (100 - player.hp) + '%';
    }
}

/**
 * @description 击中判定段复用
 * @param {攻击角色} rectangle1 
 * @param {被攻击角色} rectangle2 
 * @param {出刀所在帧 左4右2} frame
 */
const hitCase = (rectangle1, rectangle2, frame) => {
    if (hitboxCollision(rectangle1, rectangle2) && rectangle1.isAttacking && rectangle1.frameCurrent == frame) {
        rectangle2.takeHit();
        rectangle1.isAttacking = false;
        watchDamage(rectangle1);
    }
}

/**
 * @description miss段复用
 * @param {角色} role 
 */
const missCase = (role) => {
    if (role.isAttacking && role.frameCurrent === 4) {
        role.isAttacking = false
    }
}