import FooterHandler from './footerHandler';
import TileHandler from './tileHandler';
import Timer from './timer';

class Field {
    constructor(rows = 4) {
        this.tileHndlr = new TileHandler();
        this.timer = new Timer();
        this.timer.start();
        this.reset(rows);
        this.deepShuffle = 100;
        this.isSound = true;
    }

    defineSizes() {
        let navContainer = document.querySelector('.nav__container');
        if (navContainer.scrollWidth > 700) {
            this.fieldWidth = 600;
        } else if (navContainer.scrollWidth>500) {
            this.fieldWidth = 400;
        } else {
            this.fieldWidth = 250;
        }
        this.tileWidth = this.fieldWidth / this.rows;
    }

    defineTable() {
        if (this.rows == 8) {
            this.table = [
                [1, 2, 3, 4, 5, 6, 7, 8],
                [9,10,11,12,13,14,15,16],
                [17,18,19,20,21,22,23,24],
                [25,26,27,28,29,30,31,32],
                [33,34,35,36,37,38,39,40],
                [41,42,43,44,45,46,47,48],
                [49,50,51,52,53,54,55,56],
                [57,58,59,60,61,62,63,0]
            ];
        }

        if (this.rows == 7) {
            this.table = [
                [1, 2, 3, 4, 5, 6, 7],
                [8, 9, 10,11,12,13,14],
                [15,16,17,18,19,20,21],
                [22,23,24,25,26,27,28],
                [29,30,31,32,33,34,35],
                [36,37,38,39,40,41,42],
                [43,44,45,46,47,48,0]
            ];
        }

        if (this.rows == 6) {
            this.table = [
                [1, 2, 3, 4, 5, 6],
                [7, 8, 9,10,11,12],
                [13,14,15,16,17,18],
                [19,20,21,22,23,24],
                [25,26,27,28,29,30],
                [31,32,33,34,35,0]
            ];
        }

        if (this.rows == 5) {
            this.table = [
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10],
                [11,12,13,14,15],
                [16,17,18,19,20],
                [21,22,23,24,0]
            ];
        }

        if (this.rows == 4) {
            this.table = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9,10,11,12],
                [13,14,15,0]
            ];
        }

        if (this.rows == 3) {
            this.table = [
                [1,2,3],
                [4,5,6],
                [7,8,0]
            ];
        }
    }

    restart(isShuffle = true) {

        this.defineSizes();
        this.defineTable();

        document.getElementById('nav__deeper-val').innerHTML = this.rows + "x" + this.deepShuffle;

        this.movies = 0;
        this.matrix = JSON.parse(JSON.stringify(this.table));
        
        document.querySelector('section.field').innerHTML = "";
        this.buildField(this.fieldWidth);
        this.fillField();
        this.timer.start();
        this.tileHndlr.resetMov();

        if (isShuffle) {
            this.shuffleMatrix();
        }

    }

    load() {

        this.defineSizes();
        this.defineTable();

        document.querySelector('section.field').innerHTML = "";
        this.buildField(this.fieldWidth);
        this.fillField();
    }

    reset(rows = 4) {

        this.rows = rows;
        let fieldHandler = new FooterHandler();
        fieldHandler.rowsChange(this, this.rows);

    }

    resize(width) {

        if (width > 700) {
            this.fieldWidth = 600;
        } else if (width>500) {
            this.fieldWidth = 400;
        } else {
            this.fieldWidth = 250;
        }

        this.tileWidth = this.fieldWidth / this.rows;
        document.querySelector('section.field').innerHTML = "";
        this.buildField(this.fieldWidth);
        this.fillField();

    }

    async shuffleMatrix() {

        let block = document.getElementById('block');
        block.style.display = "block";

        function delay(ms) {
            return new Promise(res => setTimeout(res, ms));
        }

        this.timer.stop();

        let zeroX;
        let zeroY;
        let tile;
        for (let y = 0 ; y < this.matrix.length; y++) {
            for (let x = 0 ; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] == 0) {
                    zeroY = y;
                    zeroX = x;
                }
            }
        }
            let vars = [];
            let clearMoveable = false;
            for (let i = 0 ; i < this.rows * this.deepShuffle; i++) {

               let loop = () => {

                if (!clearMoveable) {
                    clearMoveable = this.tileHndlr.clearMoveable();
                }
                    //up
                    if (this.matrix[zeroY-1] !== undefined && this.matrix[zeroY-1][zeroX] !== undefined) {
                        vars.push('up');
                    }

                    //down
                    if (this.matrix[zeroY+1] !== undefined && this.matrix[zeroY+1][zeroX] !== undefined) {
                        vars.push('down');
                    }

                    //left
                    if (this.matrix[zeroY] !== undefined && this.matrix[zeroY][zeroX-1] !== undefined) {
                        vars.push('left');
                    }

                    //right
                    if (this.matrix[zeroY] !== undefined && this.matrix[zeroY][zeroX+1] !== undefined) {
                        vars.push('right');
                    }

                if (vars[1] !== undefined) {
                    vars.sort(() => Math.random() - 0.5);      
                    if (vars[0] == "up") {
                        tile = document.querySelector('.tile[data-val="'+ this.matrix[zeroY-1][zeroX] +'"]');
                        if (tile) {
                            tile.style.top = parseInt(tile.style.top) + this.tileWidth + "px";

                            this.matrix[zeroY][zeroX] = this.matrix[zeroY-1][zeroX];
                            this.matrix[zeroY-1][zeroX] = 0;
                            zeroY = zeroY-1;
                        }

                    } else if (vars[0] == "down") {
                        tile = document.querySelector('.tile[data-val="'+ this.matrix[zeroY+1][zeroX] +'"]');
                        if (tile) {
                            tile.style.top = parseInt(tile.style.top) - this.tileWidth + "px";

                            this.matrix[zeroY][zeroX] = this.matrix[zeroY+1][zeroX];
                            this.matrix[zeroY+1][zeroX] = 0;
                            zeroY = zeroY+1;
                        }

                    } else if (vars[0] == "left") {
                        tile = document.querySelector('.tile[data-val="'+ this.matrix[zeroY][zeroX-1] +'"]');
                        if (tile) {
                            tile.style.left = parseInt(tile.style.left) + this.tileWidth + "px";

                            this.matrix[zeroY][zeroX] = this.matrix[zeroY][zeroX-1];
                            this.matrix[zeroY][zeroX-1] = 0;
                            zeroX = zeroX-1;
                        }

                    } else if (vars[0] == "right") {
                        tile = document.querySelector('.tile[data-val="'+ this.matrix[zeroY][zeroX+1] +'"]');
                        if (tile) {
                            tile.style.left = parseInt(tile.style.left) - this.tileWidth + "px";

                            this.matrix[zeroY][zeroX] = this.matrix[zeroY][zeroX+1];
                            this.matrix[zeroY][zeroX+1] = 0;
                            zeroX = zeroX+1;
                        }
                    }
                }
                vars = [];
                tile = null;
            }

            await delay(1);
            await loop();
        }

        await this.load();
        block.style.display = "none";
        await this.timer.start();

    }

    buildField(width = 500) {
        const field = document.createElement("div");
        field.classList.add('field__container');
        field.setAttribute('id', 'field');
        field.style['width'] = width + 'px';
        field.style['height'] = width + 'px';

        let container = document.querySelector('section.field');
        container.appendChild(field);

    }

    buildTile(num, top = 0, left = 0) {
        const tile = document.createElement("div");
        const p = document.createElement("p");
        const txt = document.createTextNode(num);
        tile.classList.add('tile');
        p.appendChild(txt);

        tile.style['width'] = this.tileWidth + 'px';
        tile.style['height'] = this.tileWidth + 'px';
        tile.style['top'] = top + 'px';
        tile.style['left'] = left + 'px';

        tile.appendChild(p);
        tile.setAttribute('data-val', num);
        return tile;        
    }

    fillField(needAnalyze = true) {
        for (let i = 0 ; i < this.matrix.length; i++) {
            for (let z = 0 ; z < this.matrix[i].length; z++) {
                if (this.matrix[i][z] == 0) continue;
                let tile = this.buildTile(this.matrix[i][z], i * this.tileWidth, z * this.tileWidth);
                this.addTileToField(tile);
            }
        }

        if (needAnalyze) this.tileHndlr.analyzeMatrix(this);
    }


    addTileToField(tile) {
        let f = document.getElementById('field');
        f.appendChild(tile);
    }

}

export default Field;