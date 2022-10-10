
cc.Class({
    extends: cc.Component,

    properties: {
        bg_1: cc.Node,
        bg_2: cc.Node,
        gameReady: cc.Node,
        gamePlaying: cc.Node,
        gamePause: cc.Node,
        gameOver: cc.Node,
        hero: cc.Node,
        pre_bullet: cc.Prefab,
        pre_enemy_1: cc.Prefab,
        pre_enemy_2: cc.Prefab,
    },

    onLoad() {
        window.game = this

        this.isBgMove = false
        this.bg_1.y = 0
        this.bg_2.y = this.bg_1.y + this.bg_1.height
        this.setTouch()
        this.gameReady.active = true
        this.gamePlaying.active = false
        this.gamePause.active = false
        this.gameOver.active = false
        this.gameOver.zIndex = 2
        this.gamePause.zIndex = 2
        this.bulletTime = 0
        this.bulletPool = new cc.NodePool()
        this.enemyTime = 0
        this.enemy1_Pool = new cc.NodePool()
        this.enemy2_Pool = new cc.NodePool()
        this.hero.setPosition(cc.v2(0, -this.bg_1.height / 2))

        this.gameType = 0 // 0:ready,1:playing,2:pause,3:over

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

    },

    setTouch: function () {
        this.node.on('touchstart', function (event) {
            console.log('touchstart')
            this.gameReady.active = false
            this.gamePlaying.active = true
            this.isBgMove = true
            if (this.gameType == 0) {
                this.gameType = 1
            }
        }, this)

        this.node.on('touchmove', function (event) {
            //console.log('touchmove')
            var pos_hero = this.hero.getPosition()
            var pos_move = event.getDelta()
            this.hero.setPosition(cc.v2(pos_hero.x + pos_move.x, pos_hero.y + pos_move.y))
            cc.log(pos_move)
        }, this)

        this.node.on('touchend', function (event) {
            console.log('touchend')
            this.createBullet()
        }, this)
    },

    clickBtn: function (sender, str) {
        if (str == 'pause') {
            this.gameType = 2
            cc.log('点击了暂停按钮')
            this.gamePause.active = true
        } else if (str == 'continue') {
            this.gameType = 1
            cc.log('点击了继续按钮')
            this.gamePause.active = false
        } else if (str == 'reStart') {
            this.gameType = 1
            cc.log('点击了重新开始按钮')
            this.gamePause.active = false
            this.gameOver.active = false
            this.removeAllBullet()
            this.removeAllEnemy()
            this.hero.setPosition(cc.v2(0, -this.bg_1.height / 2))
            var js = this.hero.getComponent("hero")
            if (js) {
                js.init()
            }
        } else if (str == 'backHome') {
            this.gameType = 0
            cc.log('点击了返回主页按钮')
            this.gamePause.active = false
            this.gameOver.active = false
            this.gamePlaying.active = false
            this.gameReady.active = true
            this.isBgMove = false
            this.removeAllBullet()
            this.removeAllEnemy()
            this.hero.setPosition(cc.v2(0, -this.bg_1.height / 2))
            var js = this.hero.getComponent("hero")
            if (js) {
                js.init()
            }
        }
    },

    setBg: function () {
        this.bg_1.y = this.bg_1.y - 2
        this.bg_2.y = this.bg_2.y - 2
        if (this.bg_1.y <= -this.bg_1.height) {
            this.bg_1.y = this.bg_2.y + this.bg_1.height
        }
        if (this.bg_2.y <= -this.bg_1.height) {
            this.bg_2.y = this.bg_1.y + this.bg_1.height
        }
    },

    setGameOver: function () {
        this.gameOver.active = true
    },

    createBullet: function () {
        let parentNode = this.node
        let bullet = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.pre_bullet);
        }
        bullet.parent = parentNode
        var pos = this.hero.getPosition()
        bullet.setPosition(cc.v2(pos.x, pos.y + this.hero.height / 2 + 5))
    },

    onBulletKilled: function (bullet) {
        this.bulletPool.put(bullet);
    },

    removeAllBullet: function () {
        var children = this.node.children;
        for (var i = children.length - 1; i >= 0; --i) {
            var js = children[i].getComponent("bullet")
            if (js) {
                this.onBulletKilled(children[i])
            }
        }
        this.bulletPool.clear()
    },

    createEnemy: function (enemyType) {
        var js;
        let enemy = null;
        if (enemyType == 1) {
            if (this.enemy1_Pool.size() > 0) {
                enemy = this.enemy1_Pool.get();
            } else {
                enemy = cc.instantiate(this.pre_enemy_1);
            }
            enemy.parent = this.node
            js = enemy.getComponent("enemy_1")
        } else {
            if (this.enemy2_Pool.size() > 0) {
                enemy = this.enemy2_Pool.get();
            } else {
                enemy = cc.instantiate(this.pre_enemy_2);
            }
            enemy.parent = this.node
            js = enemy.getComponent("enemy_2")
        }
        if (js) {
            js.init()
        }
        var enemy_x = this.bg_1.width / 2 - Math.floor(Math.random() * this.bg_1.width)
        var enemy_y = this.bg_1.height / 2
        cc.log(enemy_x, enemy_y)
        enemy.active = false
        var pos = cc.v2(enemy_x, enemy_y)
        enemy.setPosition(pos)
        enemy.active = true
    },

    removeAllEnemy: function () {
        var children = this.node.children;
        for (var i = children.length - 1; i >= 0; --i) {
            if (children[i].getComponent("enemy_1")) {
                this.onEnemyKilled(children[i], 1)
                cc.log("remove enemy_1")
            } else if (children[i].getComponent("enemy_2")) {
                cc.log("remove enemy_2")
                this.onEnemyKilled(children[i], 2)
            }
        }
    },

    onEnemyKilled: function (enemy, enemyType) {
        if (enemyType == 1) {
            this.enemy1_Pool.put(enemy);
        } else if (enemyType == 2) {
            this.enemy2_Pool.put(enemy);
        }
    },

    update(dt) {
        if (this.isBgMove) {
            this.setBg()

        }
        this.bulletTime++
        if (this.bulletTime % 20 == 0 && this.gameType == 1) {
            this.bulletTime = 0
            this.createBullet()
        }
        this.enemyTime++
        if (this.enemyTime % 200 == 0 && (this.gameType == 1 || this.gameType == 3)) {
            cc.log("enemy create")
            this.enemyTime = 0
            this.createEnemy(Math.floor(Math.random() * 2 + 1))
        }

    },
});
