
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
        pre_enemy_3: cc.Prefab,
        lab_score: cc.Label,
        lab_best_score: cc.Label,
        bg_audio: {
            default: null,
            type: cc.AudioClip
        },
        enemy_blowup_audio: {
            default: null,
            type: cc.AudioClip
        },
        hero_blowup_audio: {
            default: null,
            type: cc.AudioClip
        },
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
        this.lab_score.zIndex = 3
        this.lab_best_score.zIndex = 3
        this.bulletTime = 0
        this.bulletPool = new cc.NodePool()
        this.enemyTime = 0
        this.enemy1_Pool = new cc.NodePool()
        this.enemy2_Pool = new cc.NodePool()
        this.enemy3_Pool = new cc.NodePool()
        this.game_level = 1
        this.bullet_create_interval = 50
        this.enemy_create_interval = 20
        this.hero.setPosition(cc.v2(0, -this.bg_1.height / 2))
        this.gameType = 0 // 0:ready,1:playing,2:pause,3:over

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.scoreNum = 0
        this.bestScoreNum = 0
        this.addScore(0)

    },

    setTouch: function () {
        this.node.on('touchstart', function (event) {
            console.log('touchstart')
            this.gameReady.active = false
            this.gamePlaying.active = true
            this.isBgMove = true
            this.bgAudioId = cc.audioEngine.playMusic(this.bg_audio, true);
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
        }, this)
    },

    addScore: function (score) {
        this.scoreNum += score
        this.lab_score.string = this.scoreNum
        if (this.scoreNum > this.bestScoreNum) {
            this.bestScoreNum = this.scoreNum
        }
        this.lab_best_score.string = this.bestScoreNum
    },

    clickBtn: function (sender, str) {
        if (str == 'pause') {
            this.gameType = 2
            cc.log('?????????????????????')
            this.gamePause.active = true
            this.isBgMove = false
            cc.audioEngine.pauseMusic();
        } else if (str == 'continue') {
            this.gameType = 1
            cc.log('?????????????????????')
            this.gamePause.active = false
            this.isBgMove = true
            cc.audioEngine.resumeMusic();
        } else if (str == 'reStart') {
            this.gameType = 1
            cc.log('???????????????????????????')
            this.gamePause.active = false
            this.gameOver.active = false
            this.removeAllBullet()
            this.removeAllEnemy()
            this.hero.setPosition(cc.v2(0, -this.bg_1.height / 2))
            var js = this.hero.getComponent("hero")
            if (js) {
                js.init()
            }
            this.scoreNum = 0
            this.addScore(0)
            cc.audioEngine.resumeMusic();
        } else if (str == 'backHome') {
            this.gameType = 0
            cc.log('???????????????????????????')
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
            this.scoreNum = 0
            this.addScore(0)
            cc.audioEngine.stopMusic();
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
        if (this.bulletPool.size() > 0) { // ?????? size ????????????????????????????????????????????????
            bullet = this.bulletPool.get();
        } else { // ???????????????????????????????????????????????????????????????????????????????????? cc.instantiate ????????????
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
        } else if (enemyType == 2) {
            if (this.enemy2_Pool.size() > 0) {
                enemy = this.enemy2_Pool.get();
            } else {
                enemy = cc.instantiate(this.pre_enemy_2);
            }
            enemy.parent = this.node
            js = enemy.getComponent("enemy_2")
        } else if (enemyType == 3) {
            if (this.enemy3_Pool.size() > 0) {
                enemy = this.enemy3_Pool.get();
            } else {
                enemy = cc.instantiate(this.pre_enemy_3);
            }
            enemy.parent = this.node
            js = enemy.getComponent("enemy_3")
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
            } else if (children[i].getComponent("enemy_3")) {
                cc.log("remove enemy_3")
                this.onEnemyKilled(children[i], 3)
            }
        }
    },

    onEnemyKilled: function (enemy, enemyType) {
        if (enemyType == 1) {
            this.enemy1_Pool.put(enemy);
        } else if (enemyType == 2) {
            this.enemy2_Pool.put(enemy);
        } else if (enemyType == 3) {
            this.enemy3_Pool.put(enemy);
        }
    },

    levelUp() {
        this.game_level += 1;
    }

    update(dt) {
        if (this.isBgMove) {
            this.setBg()

        }
        this.bulletTime++
        if (this.gameType == 1) {
            if (this.bulletTime % this.bullet_create_interval == 0) {
                this.bulletTime = 0
                this.createBullet()
            }
        }
        this.enemyTime++
        if (this.gameType == 1 || this.gameType == 3) {
            if (this.enemyTime % this.enemy_create_interval == 0) {
                cc.log("enemy create")
                this.enemyTime = 0
                this.createEnemy(Math.floor(Math.random() * 3 + 1))
            }
        }

    },
});
