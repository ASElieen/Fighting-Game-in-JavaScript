

# 格斗游戏

## 背景

canvas画一个

```javascript
const $ = (ele) => {
    return document.querySelector(ele);
}


const canvas = $('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
ctx.fillRect(0, 0, canvas.width, canvas.height);
```



## 核心函数animate

通过window.requestAnimationFrame()方法实现动画效果，后续的绘制部分都会放入animate中

```javascript
function animate() {
    window.requestAnimationFrame(animate);
}
```



## 玩家类Sprite

先new一个玩家和敌方，然后在画布上用矩形把他们画出来，因为position是包含x和y的，所以传入构造函数的是position对象

```javascript
class Sprite {
    constructor({position}) {
        this.position = position;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 50, 150);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    }
})
player.draw();
const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    }
})
enemy.draw();
    
```

### 双方出生时半空下落效果

构造函数做些小改动，velocity对象存放x轴y轴的速度（后面左右移动也会用这个）

```javascript
class Sprite {
    constructor({ position, velocity }) {
        this.position = position;
        //速度v
        this.velocity = velocity;
        this.height = 150;
    }
}

```

#### **update()**

通过velocity.y来改变position.y值，将前面的draw()整合到update()中并且将update传入animate从而实现动画下落效果。

```
 update() {
        this.draw();
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }
 }       
```

#### 空隙修复

传入velocity.y时，在上面的if分支中，根据y值的不同，在快触底时或多或少会形成缝隙，再做一点改动，通过一个更小的值来控制velocity.y从而消除空隙

```javascript
const gravity = 0.2;
update() {
        this.draw();
        //this.velocity.y += gravity;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }
```

#### 此时的animate()

```javascript
function animate() {
    window.requestAnimationFrame(animate);
    //重绘背景刷新位置
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();
}
```

## 移动跳跃

移动跳跃当然都是是通过事件监听触发，跟下落类似但是要做点改动。例如跟下落时一样按a给x-=1，按d给x+=1。那么在ddda或者aaaad这种情况就会出现x=0从而停止移动。**（以下都只是玩家部分按键，敌方只是改成方向键，逻辑是一样的）**

#### 移动

在constructor中加上this.lastKey

所以思路采用直接给player或者enemy的velocity.x赋1或者-1，同时通过TorF来判断键盘的键是否按下，只有按下为T时才会进行赋值操作

```javascript
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
    }            
```

**关于this.lastKey**

this.lastKey目的是为了防止两键同时按下时左右移动冲突的情况，因为a.pressed和d.pressed同时满足，所以人物会原地左右抽搐。



#### 跳跃

因为下落时已经完成了未触底时会自动下落，所以我们按W时直接给xxx.velocity.y赋个负值就行。但是如果单纯赋值会出现二段跳三段跳等情况。所以

```javascript
case 'w':
            //防二段跳
            if (player.position.y + player.height < canvas.height) return
            player.velocity.y = -10;
            break
```

如果左上角的position坐标加上高度并没有触底（即小于画布高度），那么不触发跳跃

#### animate()

每次回调时重置velocity.x 然后根据按键来重新赋值。

```javascript
function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    //玩家左右移动
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -1;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 1;
    }

    //敌方左右移动
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -1;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 1;
    }
}
```

## 攻击

基本思路为通过canvas画出双方的hitbox，通过hitbox的重叠(碰撞判定)来判断是否击中对方。

### hitbox

#### constructor和class

isAttacking判断是否攻击

```javascript
this.isAttacking;
```

position为hitbox的作画起始位置 offset为控制hitbox的朝向

```javascript
this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
```

**画出hitbox**

在draw()中加上

```javascript
if (this.isAttacking) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
```

**朝向**

在new enemy时给offset赋负值从而改变hitbox的方向，通过update来实时刷新

```javascript
this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
```

#### 攻击

attack()方法

setTimeout模拟攻击后马上收回的动作，isAttacking为F时draw()方法不会画出hitbox

```javascript
attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
```

对应事件

```javascript
case ' ':
            player.attack();
            break
```

#### 接触判定

我们假设这里rec1是player，rec2是enemy

判定分为：

1.hitbox横向接触到enemy

2.玩家的hitbox没有到敌方背后

判定3和4不太好讲，看图吧 

![无标题](https://user-images.githubusercontent.com/93816228/167596127-dcc852a0-0188-4e58-b6ff-56e1fea9adda.jpg)



```javascript
function hitboxCollision(rectangle1, rectangle2) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
    && rectangle1.isAttacking)

}
```

