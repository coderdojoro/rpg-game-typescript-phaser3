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

    currentTarget: Node;
    lastDistanceFromTarget: number;

    constructor(x: number, y: number, scene: Phaser.Scene, hero: Phaser.GameObjects.Sprite, map: Phaser.Tilemaps.Tilemap) {
        super(scene, x, y, scene.make.renderTexture({ width: 32, height: 32 }).texture);
        this.hero = hero;
        this.map = map;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.scene.load.spritesheet('dog-spritesheet', 'assets/objects/dog.png', { frameWidth: 32, frameHeight: 32 });
        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'dog-idle-down-anim',
                frames: this.scene.anims.generateFrameNumbers('dog-spritesheet', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.play('dog-idle-down-anim');
        });
        this.scene.load.start();
        this.recomputeNextTarget();
    }

    texts: Array<Phaser.GameObjects.Arc> = [];
    recomputeNextTarget() {
        this.initMatrix();
        this.findCosts();
        let path = this.findPath();
        this.currentTarget = path[2];
        let currentTargetWorld = this.map.tileToWorldXY(this.currentTarget.x, this.currentTarget.y);
        this.lastDistanceFromTarget = Phaser.Math.Distance.Between(currentTargetWorld.x + 16, currentTargetWorld.y + 16, this.x, this.y);

        for (let text of this.texts) {
            text.destroy();
        }
        this.texts = [];
        for (let node of path) {
            let coord = this.map.tileToWorldXY(node.x, node.y);
            let text = this.scene.add.circle(coord.x + 16, coord.y + 16, 10, Phaser.Display.Color.RandomRGB().color);
            this.texts.push(text);
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        let currentTargetWorld = this.map.tileToWorldXY(this.currentTarget.x, this.currentTarget.y);
        let currentDistance = Phaser.Math.Distance.Between(currentTargetWorld.x + 16, currentTargetWorld.y + 16, this.x, this.y);

        console.log(currentDistance + ' > ' + this.lastDistanceFromTarget);
        if (currentDistance > this.lastDistanceFromTarget) {
            console.log('recompute');
            this.recomputeNextTarget();
        } else {
            this.lastDistanceFromTarget = currentDistance;
        }
        this.scene.physics.moveTo(this, currentTargetWorld.x, currentTargetWorld.y, 200);
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
