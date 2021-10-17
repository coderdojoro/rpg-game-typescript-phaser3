class Node {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default class Dog extends Phaser.GameObjects.Sprite {
    hero: Phaser.GameObjects.Sprite;
    map: Phaser.Tilemaps.Tilemap;
    pathsMatrix: number[][];
    path: Array<Node>;

    currentTarget: Node;
    lastDistanceFromTarget: number;

    constructor(x: number, y: number, scene: Phaser.Scene, hero: Phaser.GameObjects.Sprite, map: Phaser.Tilemaps.Tilemap) {
        super(scene, x, y, scene.make.renderTexture({ width: 32, height: 32 }).texture);
        this.hero = hero;
        this.map = map;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        this.hero.setOrigin(0.5, 0.5);

        this.scene.load.spritesheet('dog-spritesheet', 'assets/objects/dog.png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'dog-idle-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'dog-s-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 3, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'dog-se-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'dog-e-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 9, end: 11 }),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'dog-n-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 12, end: 14 }),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'dog-nv-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 15, end: 17 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.play('dog-idle-down-anim');
        });
        this.scene.load.start();
        this.recomputeNextTarget();
    }

    // texts: Array<Phaser.GameObjects.Arc> = [];
    recomputeNextTarget() {
        this.initMatrix();
        this.findCosts();
        this.path = this.findPath();
        this.currentTarget = this.path[1];
        if (this.currentTarget) {
            let currentTargetWorld = this.map.tileToWorldXY(this.currentTarget.x, this.currentTarget.y);
            this.lastDistanceFromTarget = Phaser.Math.Distance.Between(currentTargetWorld.x + 16, currentTargetWorld.y + 16, this.x, this.y);
        }
        // for (let text of this.texts) {
        //     text.destroy();
        // }
        // this.texts = [];
        // for (let node of path) {
        //     let coord = this.map.tileToWorldXY(node.x, node.y);
        //     let text = this.scene.add.circle(coord.x + 16, coord.y + 16, 10, Phaser.Display.Color.RandomRGB().color);
        //     this.texts.push(text);
        // }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.currentTarget) {
            (this.body as Phaser.Physics.Arcade.Body).stop();
            this.recomputeNextTarget();
            return;
        }

        let currentTargetWorld = this.map.tileToWorldXY(this.currentTarget.x, this.currentTarget.y);
        let currentDistance = Phaser.Math.Distance.Between(currentTargetWorld.x + 16, currentTargetWorld.y + 16, this.x, this.y);
        if (currentDistance > this.lastDistanceFromTarget) {
            this.recomputeNextTarget();
        } else {
            this.lastDistanceFromTarget = currentDistance;
        }

        if (!this.currentTarget) {
            return;
        }

        let dogTile = this.map.worldToTileXY(this.x, this.y);
        if (dogTile.x == this.currentTarget.x && dogTile.y == this.currentTarget.y) {
            let dogTile = new Phaser.Math.Vector2(this.path[0].x, this.path[0].y);
        }
        if (this.currentTarget.x == dogTile.x && this.currentTarget.y > dogTile.y) {
            this.setFlipX(false);
            if (this.anims.getName() != 'dog-s-anim') {
                this.anims.play('dog-s-anim');
            }
        }
        if (this.currentTarget.x > dogTile.x && this.currentTarget.y > dogTile.y) {
            this.setFlipX(false);
            if (this.anims.getName() != 'dog-se-anim') {
                this.anims.play('dog-se-anim');
            }
        }
        if (this.currentTarget.x < dogTile.x && this.currentTarget.y > dogTile.y) {
            this.setFlipX(true);
            if (this.anims.getName() != 'dog-se-anim') {
                this.anims.play('dog-se-anim');
            }
        }
        if (this.currentTarget.x > dogTile.x && this.currentTarget.y == dogTile.y) {
            this.setFlipX(false);
            if (this.anims.getName() != 'dog-e-anim') {
                this.anims.play('dog-e-anim');
            }
        }
        if (this.currentTarget.x < dogTile.x && this.currentTarget.y == dogTile.y) {
            this.setFlipX(true);
            if (this.anims.getName() != 'dog-e-anim') {
                this.anims.play('dog-e-anim');
            }
        }
        if (this.currentTarget.x == dogTile.x && this.currentTarget.y < dogTile.y) {
            this.setFlipX(false);
            if (this.anims.getName() != 'dog-n-anim') {
                this.anims.play('dog-n-anim');
            }
        }
        if (this.currentTarget.x < dogTile.x && this.currentTarget.y < dogTile.y) {
            this.setFlipX(false);
            if (this.anims.getName() != 'dog-nv-anim') {
                this.anims.play('dog-nv-anim');
            }
        }
        if (this.currentTarget.x > dogTile.x && this.currentTarget.y < dogTile.y) {
            this.setFlipX(true);
            if (this.anims.getName() != 'dog-nv-anim') {
                this.anims.play('dog-nv-anim');
            }
        }
        this.scene.physics.moveTo(this, currentTargetWorld.x + 16, currentTargetWorld.y + 16, 100);
    }

    private findPath(): Array<Node> {
        let heroTile: Phaser.Math.Vector2 = this.map.worldToTileXY(this.hero.x, this.hero.y);
        let lastX = heroTile.x;
        let lastY = heroTile.y;
        let cost = this.pathsMatrix[lastX][lastY];
        let path: Array<Node> = [];
        path.push(new Node(lastX, lastY));
        while (cost > 0) {
            cost--;
            let neighbors = this.getNeighbors(lastX, lastY);
            // console.log('find: ' + cost);
            for (let neighbor of neighbors) {
                // console.log(this.pathsMatrix[neighbor[0]][neighbor[1]]);
                if (this.pathsMatrix[neighbor.x][neighbor.y] == cost) {
                    lastX = neighbor.x;
                    lastY = neighbor.y;
                    path.push(new Node(lastX, lastY));
                    break;
                }
            }
        }
        return path.reverse();
    }

    initMatrix() {
        this.pathsMatrix = new Array<Array<number>>();
        for (let x = 0; x < this.map.width; x++) {
            this.pathsMatrix[x] = new Array<number>();
            for (let y = 0; y < this.map.height; y++) {
                this.pathsMatrix[x][y] = -1;
            }
        }
        let dogTile: Phaser.Math.Vector2 = this.map.worldToTileXY(this.x, this.y);
        let heroTile: Phaser.Math.Vector2 = this.map.worldToTileXY(this.hero.x, this.hero.y);

        this.pathsMatrix[dogTile.x][dogTile.y] = 0;
        this.pathsMatrix[heroTile.x][heroTile.y] = -2;
    }

    private findCosts() {
        let finished = false;
        let currentCost = 0;
        while (!finished) {
            finished = true;
            // console.log('loop');
            for (let x = 0; x < this.map.width; x++) {
                for (let y = 0; y < this.map.height; y++) {
                    if (this.pathsMatrix[x][y] == currentCost) {
                        finished = false;
                        let neighbors = this.getEmptyNeighbors(x, y);
                        for (let neighbor of neighbors) {
                            if (this.pathsMatrix[neighbor.x][neighbor.y] == -2) {
                                this.pathsMatrix[neighbor.x][neighbor.y] = currentCost + 1;
                                // let coord = this.map.tileToWorldXY(neighbor[0], neighbor[1]);
                                // let text = this.add.text(coord.x + 16, coord.y + 16, '[' + (currentCost + 1) + ']', style);
                                return;
                            }
                            this.pathsMatrix[neighbor.x][neighbor.y] = currentCost + 1;
                            // let coord = this.map.tileToWorldXY(neighbor[0], neighbor[1]);
                            // let text = this.add.text(coord.x + 16, coord.y + 16, '' + (currentCost + 1), style);
                        }
                    }
                }
            }
            currentCost++;
        }
    }

    getEmptyNeighbors(x: number, y: number): Array<Node> {
        // console.log('found: ' + x + ', ' + y);
        let neighbors: Array<Node> = this.getNeighbors(x, y);
        let emptyNeighbors: Array<Node> = [];
        for (let a = 0; a < neighbors.length; a++) {
            let neighbor = neighbors[a];
            // console.log('N: ' + neighbor[0] + ', ' + neighbor[1]);
            if (this.pathsMatrix[neighbor.x][neighbor.y] < 0 && !this.map.getTileAt(neighbor.x, neighbor.y, false, 'World')) {
                // console.log('remove');
                emptyNeighbors.push(neighbor);
            }
        }
        return emptyNeighbors;
    }

    getNeighbors(x: number, y: number): Array<Node> {
        let result = new Array();
        let anglePaths = new Array();
        if (y > 0) {
            if (x > 0) {
                anglePaths.push(new Node(x - 1, y - 1));
            }
            result.push(new Node(x, y - 1));
            if (x < this.map.width) {
                anglePaths.push(new Node(x + 1, y - 1));
            }
        }
        if (x > 0) {
            result.push(new Node(x - 1, y));
        }
        if (x < this.map.width) {
            result.push(new Node(x + 1, y));
        }
        if (y < this.map.height) {
            if (x > 0) {
                anglePaths.push(new Node(x - 1, y + 1));
            }
            result.push(new Node(x, y + 1));
            if (x < this.map.width) {
                anglePaths.push(new Node(x + 1, y + 1));
            }
        }
        result.push(...anglePaths);
        return result;
    }
}
