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

    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        if (self.tag == 100 && this.isAlive == true) {
            this.isAlive = false
            game.gameType = 3
            this.die()
        }
        // if (other.tag == 1) {
        //     var js = other.node.getComponent("enemy_1")
        //     if (js && js.isAlive == true) {
        //         js.hit()
        //     }
        // } else if (other.tag == 2) {
        //     var js = other.node.getComponent("enemy_2")
        //     if (js && js.isAlive == true) {
        //         js.hit()
        //     }
        // }
    },

    init: function () {
        this.normal()
    },

    normal: function () {
        this.isAlive = true
        this.node.active = true
        var anim = this.getComponent(cc.Animation);
        anim.play('heroNormal');
    },

    die: function () {
        cc.audioEngine.play(game.hero_blowup_audio, false);
        var anim = this.getComponent(cc.Animation);
        anim.play('heroDie');
        anim.over = function () {
            cc.log("game over")
            this.node.active = false
            game.setGameOver()
        }.bind(this)
    },
    update(dt) {
    },
});
