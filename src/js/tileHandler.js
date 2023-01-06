import LocalStrg from "./localStrg";
import beep from '../media/bulb.mp3';
import woop from '../media/woop.mp3';
import ButtonHandler from "./buttonsHandler";


export default class TileHandler {
    constructor() {
        this.appendMov = document.getElementById('nav__mov');
        this.mov = 0;
        this.localStrg = new LocalStrg();
        this.alarm = new Audio(beep);
        this.alarm2 = new Audio(woop);
        this.buttonHandler = new ButtonHandler();
    }

    resetMov() {
        this.mov = 0;
        this.appendMov.innerHTML = this.mov;
    }

    analyzeMatrix(field) {

        for (let i = 0 ; i < field.matrix.length; i++) {
            for (let z = 0; z < field.matrix[i].length; z++) {
                if (field.matrix[i][z] == 0) {
                    this.addListeners(field, i, z);
                    return;
                }
            }
        }
    }

    clearListeners(field) {

            document.getElementById('field').style.backgroundColor = 'grey';

            if (this.upTile && this.upMouseListener) {
                this.upTile.onmousedown = null;
            }
            if (this.downTile && this.downMouseListener) {
                this.downTile.onmousedown = null;
            }
            if (this.leftTile && this.leftMouseListener) {
                this.leftTile.onmousedown = null;
            }
            if (this.rightTile  && this.rightMouseListener) {
                this.rightTile.onmousedown = null;
            }

            this.downTile = null;
            this.downMouseListener = null;
            this.upTile = null;
            this.upMouseListener = null;
            this.leftTile = null;
            this.leftMouseListener = null;
            this.rightTile = null;
            this.rightMouseListener = null;

            this.appendMov.innerHTML = this.mov;
            this.analyzeMatrix(field);   
            
            setTimeout(() => {this.check(field)},150);

    }

    clearMoveable() {
        for (let i of document.querySelectorAll('.tile_moveable')) {
            if (i) {
                i.classList.toggle('tile_moveable');
            }
        }
        return true;
    }

    addListeners(field, i, z) {

        this.clearMoveable();

        function delay(ms) {
            return new Promise(res => setTimeout(res, ms));
        }

                    //up
                    if (field.matrix[i-1] !== undefined && field.matrix[i-1][z] !== undefined) {
                        this.upTile = document.querySelector('.tile[data-val="'+ field.matrix[i-1][z] +'"]');
                        this.upTile.classList.add('tile_moveable');

                        this.upMouseListener = (event) => {

                            let posInDom = Array.from(this.upTile.parentNode.children).indexOf(this.upTile);
                            let isMove = false;
                            let prevY = this.upTile.style.top;
                            let prevX = this.upTile.style.left;
                            let prevColor = this.upTile.style.backgroundColor;
                            let nextY = parseInt(prevY) + field.tileWidth + "px";
                            let nextX = prevX;

                            let startX = null;
                            let startY = null;
                            let aboveRightPos = false;

                            let shiftX = event.clientX - this.upTile.getBoundingClientRect().left;
                            let shiftY = event.clientY - this.upTile.getBoundingClientRect().top;
                          
                            this.upTile.style.transition = 'all 0ms';
                            this.upTile.style.zIndex = 1000;
                            document.body.append(this.upTile);
                          
                            let moveAt = (pageX, pageY) => {
                                this.upTile.style.left = pageX - shiftX + 'px';
                                this.upTile.style.top = pageY - shiftY + 'px';

                                if (!startY) startY = parseInt(this.upTile.style.top);
                                if (!startX) startX = parseInt(this.upTile.style.left);

                                if (
                                    parseInt(this.upTile.style.top) > startY + (field.tileWidth/2) 
                                    && parseInt(this.upTile.style.top) < startY + (field.tileWidth*1.5)
                                    &&parseInt(this.upTile.style.left) < startX + (field.tileWidth/2) 
                                    && parseInt(this.upTile.style.left) > startX - (field.tileWidth/2)
                                    ) {
                                        aboveRightPos = true;
                                        this.upTile.style.backgroundColor = 'rgb(86, 183, 139)';
                                    } else {
                                        aboveRightPos = false;
                                        this.upTile.style.backgroundColor = prevColor;
                                    }


                            }

                            moveAt(event.pageX, event.pageY);
                          
                            let onMouseMove = (event) => {
                              moveAt(event.pageX, event.pageY);
                              isMove = true;
                            }
                          
                            document.addEventListener('mousemove', onMouseMove);
                          
                            this.upTile.onmouseup = async () => {

                                document.removeEventListener('mousemove', onMouseMove);
                                document.getElementById('field').insertBefore(this.upTile, document.getElementById('field').children[posInDom]);
                                this.upTile.onmouseup = null;
                                this.upTile.style.backgroundColor = null;
                                this.upTile.style.transition = null;
                                this.upTile.style.zIndex = null;

                              if (isMove) {

                                if (!aboveRightPos) {
                                    this.upTile.style.top = prevY;
                                    this.upTile.style.left = prevX;
                                } else {
                                    this.upTile.style.top = nextY;
                                    this.upTile.style.left = nextX;
                                    field.matrix[i][z] = field.matrix[i-1][z];
                                    field.matrix[i-1][z] = 0;
                                    if (field.isSound) {
                                        this.alarm2.play();
                                    }
                                    this.mov++;
                                    field.movies = this.mov;
                                }

                              } else {
                                this.upTile.style.top = prevY;
                                this.upTile.style.left = prevX;
                                await delay(0);
                                this.upTile.style.top = nextY;
                                this.upTile.style.left = nextX;

                                field.matrix[i][z] = field.matrix[i-1][z];
                                field.matrix[i-1][z] = 0;
                                if (field.isSound) {
                                    this.alarm.play();
                                }
                                this.mov++;
                                field.movies = this.mov;
                              }
                              this.clearListeners(field);
                            };
                          
                          };

                          this.upTile.onmousedown = this.upMouseListener;
                          this.upTile.ondragstart = function() {
                            return false;
                          };

                    }

                    //down
                    if (field.matrix[i+1] !== undefined && field.matrix[i+1][z] !== undefined) {
                        this.downTile = document.querySelector('.tile[data-val="'+ field.matrix[i+1][z] +'"]')
                        this.downTile.classList.add('tile_moveable');

                        this.downMouseListener = (event) => {

                            let posInDom = Array.from(this.downTile.parentNode.children).indexOf(this.downTile);
                            let isMove = false;
                            let prevY = this.downTile.style.top;
                            let prevX = this.downTile.style.left;
                            let prevColor = this.downTile.style.backgroundColor;
                            let nextY = parseInt(prevY) - field.tileWidth + "px";
                            let nextX = prevX;

                            let startX = null;
                            let startY = null;
                            let aboveRightPos = false;

                            let shiftX = event.clientX - this.downTile.getBoundingClientRect().left;
                            let shiftY = event.clientY - this.downTile.getBoundingClientRect().top;
                          
                            this.downTile.style.transition = 'all 0ms';
                            this.downTile.style.zIndex = 1000;
                            document.body.append(this.downTile);
                          
                            let moveAt = (pageX, pageY) => {
                                this.downTile.style.left = pageX - shiftX + 'px';
                                this.downTile.style.top = pageY - shiftY + 'px';

                                if (!startY) startY = parseInt(this.downTile.style.top);
                                if (!startX) startX = parseInt(this.downTile.style.left);

                                if (
                                    parseInt(this.downTile.style.top) < startY - (field.tileWidth/2) 
                                    && parseInt(this.downTile.style.top) > startY - (field.tileWidth*1.5)
                                    &&parseInt(this.downTile.style.left) < startX + (field.tileWidth/2) 
                                    && parseInt(this.downTile.style.left) > startX - (field.tileWidth/2)
                                    ) {
                                        aboveRightPos = true;
                                        this.downTile.style.backgroundColor = 'rgb(86, 183, 139)';
                                    } else {
                                        aboveRightPos = false;
                                        this.downTile.style.backgroundColor = prevColor;
                                    }

                                }

                            moveAt(event.pageX, event.pageY);
                          
                            let onMouseMove = (event) => {
                              moveAt(event.pageX, event.pageY);
                              isMove = true;
                            }
                          
                            document.addEventListener('mousemove', onMouseMove);
                          
                            this.downTile.onmouseup = async () => {

                                document.getElementById('field').insertBefore(this.downTile, document.getElementById('field').children[posInDom]);
                                document.removeEventListener('mousemove', onMouseMove);
                                this.downTile.onmouseup = null;
                                this.downTile.style.backgroundColor = null;
                                this.downTile.style.transition = null;
                                this.downTile.style.zIndex = null;

                              if (isMove) {

                                if (!aboveRightPos) {
                                    this.downTile.style.top = prevY;
                                    this.downTile.style.left = prevX;
                                } else {
                                    this.downTile.style.top = nextY;
                                    this.downTile.style.left = nextX;
                                    field.matrix[i][z] = field.matrix[i+1][z];
                                    field.matrix[i+1][z] = 0;
                                    if (field.isSound) {
                                        this.alarm2.play();
                                    }
                                    this.mov++;
                                    field.movies = this.mov;
                                }

                              } else {
                                this.downTile.style.top = prevY;
                                this.downTile.style.left = prevX;
                                await delay(0);
                                this.downTile.style.top = nextY;
                                this.downTile.style.left = nextX;

                                field.matrix[i][z] = field.matrix[i+1][z];
                                field.matrix[i+1][z] = 0;

                                if (field.isSound) {
                                    this.alarm.play();
                                }
                                this.mov++;
                                field.movies = this.mov;
                                
                              }
                              this.clearListeners(field);
                            };
                          
                          };

                          this.downTile.onmousedown = this.downMouseListener;
                          this.downTile.ondragstart = function() {
                            return false;
                          };
                    }

                    //left
                    if (field.matrix[i] !== undefined && field.matrix[i][z-1] !== undefined) {
                        this.leftTile = document.querySelector('.tile[data-val="'+ field.matrix[i][z-1] +'"]')
                        this.leftTile.classList.add('tile_moveable');
                        
                        this.leftMouseListener = (event) => {

                            let posInDom = Array.from(this.leftTile.parentNode.children).indexOf(this.leftTile);
                            let isMove = false;
                            let prevY = this.leftTile.style.top;
                            let prevX = this.leftTile.style.left;
                            let prevColor = this.leftTile.style.backgroundColor;
                            let nextY = prevY;
                            let nextX = parseInt(prevX) + field.tileWidth + "px";

                            let startX = null;
                            let startY = null;
                            let aboveRightPos = false;

                            let shiftX = event.clientX - this.leftTile.getBoundingClientRect().left;
                            let shiftY = event.clientY - this.leftTile.getBoundingClientRect().top;
                          
                            this.leftTile.style.transition = 'all 0ms';
                            this.leftTile.style.zIndex = 1000;
                            document.body.append(this.leftTile);
                          
                            let moveAt = (pageX, pageY) => {
                                this.leftTile.style.left = pageX - shiftX + 'px';
                                this.leftTile.style.top = pageY - shiftY + 'px';

                                if (!startY) startY = parseInt(this.leftTile.style.top);
                                if (!startX) startX = parseInt(this.leftTile.style.left);

                                if (
                                    parseInt(this.leftTile.style.top) < startY + (field.tileWidth/2) 
                                    && parseInt(this.leftTile.style.top) > startY - (field.tileWidth/2)
                                    &&parseInt(this.leftTile.style.left) < startX + (field.tileWidth*1.5) 
                                    && parseInt(this.leftTile.style.left) > startX + (field.tileWidth/2)
                                    ) {
                                        aboveRightPos = true;
                                        this.leftTile.style.backgroundColor = 'rgb(86, 183, 139)';
                                    } else {
                                        aboveRightPos = false;
                                        this.leftTile.style.backgroundColor = prevColor;
                                    }

                                }

                            moveAt(event.pageX, event.pageY);
                          
                            let onMouseMove = (event) => {
                              moveAt(event.pageX, event.pageY);
                              isMove = true;
                            }
                          
                            document.addEventListener('mousemove', onMouseMove);
                          
                            this.leftTile.onmouseup = async () => {

                                document.getElementById('field').insertBefore(this.leftTile, document.getElementById('field').children[posInDom]);
                                document.removeEventListener('mousemove', onMouseMove);
                                this.leftTile.onmouseup = null;
                                this.leftTile.style.backgroundColor = null;
                                this.leftTile.style.transition = null;
                                this.leftTile.style.zIndex = null;

                              if (isMove) {

                                if (!aboveRightPos) {
                                    this.leftTile.style.top = prevY;
                                    this.leftTile.style.left = prevX;
                                } else {
                                    this.leftTile.style.top = nextY;
                                    this.leftTile.style.left = nextX;
                                    field.matrix[i][z] = field.matrix[i][z-1];
                                    field.matrix[i][z-1] = 0;
                                    if (field.isSound) {
                                        this.alarm2.play();
                                    }
                                    this.mov++;
                                    field.movies = this.mov;
                                }

                              } else {
                                this.leftTile.style.top = prevY;
                                this.leftTile.style.left = prevX;
                                await delay(0);
                                this.leftTile.style.top = nextY;
                                this.leftTile.style.left = nextX;

                                field.matrix[i][z] = field.matrix[i][z-1];
                                field.matrix[i][z-1] = 0;
                                if (field.isSound) {
                                    this.alarm.play();
                                }
                                this.mov++;
                                field.movies = this.mov;
                              }
                              this.clearListeners(field);
                            };
                          
                          };

                          this.leftTile.onmousedown = this.leftMouseListener;
                          this.leftTile.ondragstart = function() {
                            return false;
                          };
                    }

                    //right
                    if (field.matrix[i] !== undefined && field.matrix[i][z+1] !== undefined) {
                        this.rightTile = document.querySelector('.tile[data-val="'+ field.matrix[i][z+1] +'"]')
                        this.rightTile.classList.add('tile_moveable');

                        this.rightMouseListener = (event) => {

                            let posInDom = Array.from(this.rightTile.parentNode.children).indexOf(this.rightTile);
                            let isMove = false;
                            let prevY = this.rightTile.style.top;
                            let prevX = this.rightTile.style.left;
                            let prevColor = this.rightTile.style.backgroundColor;
                            let nextY = prevY;
                            let nextX = parseInt(prevX) - field.tileWidth + "px";

                            let startX = null;
                            let startY = null;
                            let aboveRightPos = false;

                            let shiftX = event.clientX - this.rightTile.getBoundingClientRect().left;
                            let shiftY = event.clientY - this.rightTile.getBoundingClientRect().top;
                          
                            this.rightTile.style.transition = 'all 0ms';
                            this.rightTile.style.zIndex = 1000;
                            document.body.append(this.rightTile);
                          
                            let moveAt = (pageX, pageY) => {
                                this.rightTile.style.left = pageX - shiftX + 'px';
                                this.rightTile.style.top = pageY - shiftY + 'px';

                                if (!startY) startY = parseInt(this.rightTile.style.top);
                                if (!startX) startX = parseInt(this.rightTile.style.left);

                                if (
                                    parseInt(this.rightTile.style.top) < startY + (field.tileWidth/2) 
                                    && parseInt(this.rightTile.style.top) > startY - (field.tileWidth/2)
                                    &&parseInt(this.rightTile.style.left) < startX - (field.tileWidth/2) 
                                    && parseInt(this.rightTile.style.left) > startX - (field.tileWidth*1.5)
                                    ) {
                                        aboveRightPos = true;
                                        this.rightTile.style.backgroundColor = 'rgb(86, 183, 139)';
                                    } else {
                                        aboveRightPos = false;
                                        this.rightTile.style.backgroundColor = prevColor;
                                    }

                                }

                            moveAt(event.pageX, event.pageY);
                          
                            let onMouseMove = (event) => {
                              moveAt(event.pageX, event.pageY);
                              isMove = true;
                            }
                          
                            document.addEventListener('mousemove', onMouseMove);
                          
                            this.rightTile.onmouseup = async () => {

                                document.getElementById('field').insertBefore(this.rightTile, document.getElementById('field').children[posInDom]);
                                document.removeEventListener('mousemove', onMouseMove);
                                this.rightTile.onmouseup = null;
                                this.rightTile.style.backgroundColor = null;
                                this.rightTile.style.transition = null;
                                this.rightTile.style.zIndex = null;

                              if (isMove) {

                                if (!aboveRightPos) {
                                    this.rightTile.style.top = prevY;
                                    this.rightTile.style.left = prevX;
                                } else {
                                    this.rightTile.style.top = nextY;
                                    this.rightTile.style.left = nextX;
                                    field.matrix[i][z] = field.matrix[i][z+1];
                                    field.matrix[i][z+1] = 0;
                                    if (field.isSound) {
                                        this.alarm2.play();
                                    }
                                    this.mov++;
                                    field.movies = this.mov;
                                }

                              } else {
                                this.rightTile.style.top = prevY;
                                this.rightTile.style.left = prevX;
                                await delay(0);
                                this.rightTile.style.top = nextY;
                                this.rightTile.style.left = nextX;

                                field.matrix[i][z] = field.matrix[i][z+1];
                                field.matrix[i][z+1] = 0;
                                if (field.isSound) {
                                    this.alarm.play();
                                }
                                this.mov++;
                                field.movies = this.mov;
                              }
                              this.clearListeners(field);
                            };
                          
                          };

                          this.rightTile.onmousedown = this.rightMouseListener;
                          this.rightTile.ondragstart = function() {
                            return false;
                          };
                    }
        
    }

    check(fld) {
        
        if (JSON.stringify(fld.matrix) == JSON.stringify(fld.table) && this.mov > 0) {
        
            fld.timer.stop(true);

            this.buttonHandler.fillAlert('Hooray!',
            `<p>You solved the puzzle in 
            <b>${fld.timer.getTime()}</b> and <b>${this.mov}</b> moves</p>
            <p>Enter your name please...</p>
            <input id="alarm-name" value="John Doe">`,
             'lightgreen', 'white');
            
            let name = document.getElementById('alarm-name');
            name.focus();
            name.selectionStart = name.selectionEnd = name.value.length;
            name.addEventListener('input', () => {
                if (name.value.length == 0 || name.value.length > 20) {
                    document.getElementById('alarm-button').disabled = true
                } else {
                    document.getElementById('alarm-button').disabled = false;
                }
            })

            let saveTime = fld.timer.getTime();
            let saveMov = this.mov;


            document.getElementById('alarm-button').addEventListener('click', () => {
                this.localStrg.save(fld.rows, name.value, saveTime, saveMov);
            }, {once: true})

            fld.restart();
            
        }
    }    

}