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
        this.normal()
    },

    normal: function () {

        var anim = this.getComponent(cc.Animation);
        anim.play('enemyNormal_1');
    },

    hit: function () {
        this.isAlive = false
        var anim = this.getComponent(cc.Animation);
        anim.play('enemyDie_1');
        anim.over = function () {
            game.onEnemyKilled(this.node, 1)
        }
    },

    update(dt) {
        if (this.node.y <= - game.bg_1.height / 2) {
            game.onEnemyKilled(this.node, 1)
        }
        if (game.gameType == 1 || game.gameType == 3) {
            this.node.y = this.node.y - this.speed
        }
    },
});
