

# 格斗游戏

## 画布背景

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

## 填充背景图片

ctx.drawImage()

此时的Sprite构造函数，只保留了最基础的功能。原来的Sprite类复制了一份改成Class Fighter了，后面再说，现在的Sprite类只用来处理图片素材

```javascript
class Sprite {
    constructor({ position, imgSrc }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
    }
    draw(){
       ctx.drawImage(......) 
    }
    update(){
           this.draw()
       }
}
```



## 商店烟囱动画

#### 大小和位置

![image-20220511110912619](C:\Users\ZeroX\Desktop\image-20220511110912619.png)

可以看到 素材图片是由6帧（暂时就叫帧吧）组成，那么构成动画的思路很明显

![image-20220511111122632](C:\Users\ZeroX\AppData\Roaming\Typora\typora-user-images\image-20220511111122632.png)

把图片分成六块 每隔一定的时间往前挪一块，挪到末尾后回到开头

**补充一下（实际PNG素材上没有周围的黑边）**

先引入整个商店素材

```
draw() {
        ctx.drawImage(this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width,
            this.image.height
    }
```

素材需要缩放，在构造函数中补个scale

```javascript
constructor({ position, imgSrc, scale = 1 }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
    }
```

那么draw就变成

```javascript
draw() {
        ctx.drawImage(this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width) * this.scale,
            this.image.height * this.scale)
    }
```

通过设置scale 我们可以选出一个合适的单个商店大小，在new出shop实例的时候修改positionx和positiony指定位置即可

#### 六等分和动画

![image-20220511114338516](C:\Users\ZeroX\AppData\Roaming\Typora\typora-user-images\image-20220511114338516.png)

这是w3c上的drawImage参数，那么实现六等分的核心就在于sx和swidth这两个参数。

所以思路为通过两个参数，一个为等分数量，一个为当前位置来控制sx和swidth。但是考虑到背景是不需要等分的，因此

```javascript
constructor({ position, imgSrc, scale = 1, frameMax = 1 }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.frameCurrent = 0;
    }
```

frameMax为等分的数量，默认值为1，我们new background实例的时候不做修改，背景自然就不会被等分。frameCurrent为当前的位置，默认为0，我们通过修改frameCurrent的值来改变drawImage中的sx，就可以实现素材切割和烟囱的动画。



修改后的draw方法，起始点为（0,0），每次增加六分之一的图片宽度，每次切出六分之一的图片宽度

```javascript
draw() {
        ctx.drawImage(this.image,
            this.frameCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.frameMax,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.frameMax) * this.scale,
            this.image.height * this.scale)
    }
```

实现了六等分，接下来我们来完成动画。

```javascript
function animate(){
window.requestAnimationFrame(animate)
background.update();
    shop.update();
}
```

这是animate中的一小部分，可以看到每次回调animate时，都会触发update()方法。所以每次触发update()时更新某一个常数值(i++)，即可实现六个部分中每部分的切换。



**构造函数最终版**

```javascript
constructor({ position, imgSrc, scale = 1, frameMax = 1, frameGap = 1 }) {
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
    }
```

frameGap为更新间隔，frameTime就是上面所说的常数



此时的update()

frameCurrent+1是为了防止背景一直刷新

```javascript
update() {
        this.draw();
        this.frameTime++;
        if (this.frameTime % this.frameGap == 0) {
            if (this.frameCurrent + 1 < this.frameMax) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
```

## 人物

### 人物站立动画

在之前绘制的canvas基础上引入png



### 人物移动动画

### 人物跳跃动画

### 人物攻击动画
