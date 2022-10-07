
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.speed = 8
    },

    start() {

    },

    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        if (self.tag == 0) {
            game.onBulletKilled(this.node)
        }
        if (other.tag == 1) {
            var js = other.node.getComponent("enemy_1")
            if (js && js.isAlive == true) {
                js.hit()
            }
        } else if (other.tag == 2) {
            var js = other.node.getComponent("enemy_2")
            if (js && js.isAlive == true) {
                js.hit()
            }
        }
    },

    update(dt) {
        if (this.node.y >= game.bg_1.height / 2) {
            game.onBulletKilled(this.node)
        }
        if (game.gameType == 1 || game.gameType == 3) {
            this.node.y = this.node.y + this.speed
        }
    },
});
