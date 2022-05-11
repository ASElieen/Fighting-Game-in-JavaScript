const $ = (ele) => {
    return document.querySelector(ele);
}

const leftHp = $('.leftHp');
const rightHp = $('.rightHp');
const timer = $('.timer');

/**
 * @description 监测hit并扣血
 * @param {角色 敌方or玩家} role 
 */
const watchDamage = (role) => {
    if (role == player && enemy.hp > 0) {
        enemy.hp -= 10;
        rightHp.style.width = enemy.hp + '%';
    }
    if (role == enemy && player.hp > 0) {
        player.hp -= 10;
        leftHp.style.width = (100 - player.hp) + '%';
    }
}

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