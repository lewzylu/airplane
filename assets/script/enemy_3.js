// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init()
    },

    init: function () {
        this.isAlive = true
        this.speed = 5
        this.hp = 8
        this.normal()
    },

    normal: function () {
        var anim = this.getComponent(cc.Animation);
        anim.play('enemyNormal_3');
    },

    hit: function () {
        if (this.isAlive == true) {
            this.hp = this.hp - 1;
            cc.log(this.hp)
            if (this.hp == 0) {
                this.isAlive = false
                this.die()
            } else {
                var anim = this.getComponent(cc.Animation);
                anim.play('enemyHit_3');
            }
        }
    },

    die: function () {
        cc.audioEngine.play(game.enemy_blowup_audio, false);
        var anim = this.getComponent(cc.Animation);
        anim.play('enemyDie_3');
        anim.over = function () {
            game.onEnemyKilled(this.node, 3)
            game.addScore(500)
        }
    },

    update(dt) {
        if (!this.isAlive) {
            return
        }
        if (this.node.y <= - game.bg_1.height / 2) {
            game.onEnemyKilled(this.node, 3)
        }
        if (game.gameType == 1 || game.gameType == 3) {
            this.node.y = this.node.y - this.speed
        }
    },
});
