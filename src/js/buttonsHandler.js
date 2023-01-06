import beep from '../media/bulb.mp3';
import FooterHandler from './footerHandler';
import LocalStrg from './localStrg';

export default class ButtonHandler {
    constructor() {

    }

    init(fld) {
        this.alarm = new Audio(beep);
        this.isAlarm = true;
        this.fieldContainer = document.querySelector('#root');
        this.localStrg = new LocalStrg();

        this.start(fld);
        //this.startTest(fld);
        this.sound(fld);
        this.results(fld);
        this.clearResults();
        this.save(fld);
        this.load(fld);
        this.deep(fld);
        this.alarmButton();
    }

    start(fld) {

        let button = document.getElementById('start');
        button.addEventListener('click', (e) => {
            fld.restart();
        });
    }

    // startTest(fld) {

    //     let button = document.getElementById('startTest');
    //     button.addEventListener('click', (e) => {
    //         fld.restart(false);
    //     });
    // }

    sound(fld) {
        let alarm = document.getElementById('sound');
        alarm.addEventListener('click', (e) => {
            e.target.classList.toggle('nav__sound_active');
            this.isAlarm = !(this.isAlarm);
            if (this.isAlarm) {
                e.target.innerHTML = "Sound ON";
                fld.isSound = true;
            } else {
                e.target.innerHTML = "Sound OFF";
                fld.isSound = false;
            }
        })
    }

    results(fld) {
        let res = document.getElementById('results'); 
        res.addEventListener('click', (e) => {
            this.fillAlert(`${fld.rows}x${fld.rows} top results`, this.localStrg.get(fld.rows), "lightgreen", "white", false);
        });
    }

    clearResults() {
        let res = document.getElementById('resultsClear'); 
        res.addEventListener('click', (e) => {
            this.localStrg.clear();
            this.fillAlert('', 'Local storage was cleared !!!', "", "red");
        });
    }

    save(fld) {
        let button = document.getElementById('save'); 
        button.addEventListener('click', (e) => {
            this.localStrg.saveGame(fld);
            this.fillAlert(`Game ${fld.rows}x${fld.rows} SAVED`, `with time: <b>${fld.timer.getTime()}</b> and <b>${fld.movies}</b> moves...`, "lightgreen", 'white');
        });
    }

    load(fld) {
        let button = document.getElementById('load'); 
        button.addEventListener('click', (e) => {
            let data = this.localStrg.loadGame();

            if (!data) {
                this.fillAlert('', 'Bad or empty saved DATA', "", "red");
                return;
            }

            fld.matrix = data.matrix;
            fld.time = data.time;
            fld.movies = data.mov;
            fld.tileHndlr.mov = data.mov;
            fld.tileHndlr.appendMov.innerHTML = data.mov;
            fld.rows = data.rows;

            fld.timer.seconds = +data.time.split(":")[1];
            fld.timer.minutes = +data.time.split(":")[0];

            let footer = new FooterHandler();
            footer.highLight(data.rows);

            fld.load();
            this.fillAlert(`Game ${fld.rows}x${fld.rows} LOADED`, `with time: <b>${data.time}</b> and <b>${fld.movies}</b> moves...`, "lightgreen", "white");

        });
    }

    deep(fld) {
        let zip = document.getElementById('nav__deeper'); 
        let zipVal = document.getElementById('nav__deeper-val');
        zip.addEventListener('change', (e) => {
            zipVal.innerHTML = fld.rows + "x" + zip.value;
            fld.deepShuffle = zip.value;
        })
    }

    alarmButton() {
        let btn = document.getElementById('alarm-button');
        btn.addEventListener('click', (e) => {
            document.getElementById('alarm-mod').style.display = null;
        })
    }

    fillAlert(msg, content, msgColor="", contentColor = "", center=true) {
        let alrm = document.getElementById('alarm-mod');
        let h2 = alrm.querySelector('h2');
        let p = alrm.querySelector('p');

        h2.innerHTML = msg;
        p.innerHTML = content

        if (msgColor != "") h2.style.color = msgColor;
        if (contentColor != "") p.style.color = contentColor;

        if (center) {
            p.style.textAlign = 'center';
        } else {
            p.style.textAlign = 'left';
        }

        alrm.style.display = "block";
    }
}