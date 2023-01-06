import ButtonHandler from "./buttonsHandler";

export default class LocalStrg {
    constructor() {

    }

    save(rows, name, time, moves) {

        if (!localStorage.hasOwnProperty("results"+rows)) {
            localStorage.setItem("results"+rows, JSON.stringify([]));
        }

        let results = JSON.parse(localStorage.getItem("results"+rows));
        results.push([name, time, moves]);
        let user = JSON.stringify([name, time, moves]);
        localStorage.setItem("results"+rows, JSON.stringify(results));

        let btn = new ButtonHandler();
        btn.fillAlert(`${rows}x${rows} top results`, this.get(rows, user), "lightgreen", "white", false);

    }

    saveGame(fld) {

        let data = {};
        data.matrix = fld.matrix;
        data.rows = fld.rows;
        data.mov = fld.movies;
        data.time = fld.timer.getTime();

        localStorage.setItem('saveGame', JSON.stringify(data));
    }

    loadGame() {

        if (localStorage.hasOwnProperty('saveGame')) {
            return JSON.parse(localStorage.getItem('saveGame'));
        } else {
            return false;
        };
    }

    get(rows, user = null) {

        let results = [];
        if (!localStorage.hasOwnProperty("results"+rows)) {
            localStorage.setItem("results"+rows, JSON.stringify([]));
        } else {
            results = JSON.parse(localStorage.getItem("results"+rows));
        }

        results.sort(
            function(a, b) {          
               if (a[2] === b[2]) {
                  return a[1] > b[1] ? 1 : -1;
               }
               return a[2] > b[2] ? 1 : -1;
        });

        let res = "<dd><b>&nbsp;#&emsp;Moves&emsp;&emsp;Time&emsp;&emsp;&emsp;Name</b></dd><dd>&emsp;</dd>";
        for (let i = 0; i<results.length; i++) {


            let str = "<dd>";
            let end = "</dd>";

            if (JSON.stringify(results[i]) == user) {
                 str = '<dd><b style="color: red">';
                 end = "</b></dd>";
            }

            res += str + ( (i+1 > 9) ? (i+1) : "&nbsp;&nbsp;" + (i+1) )+ "." + 
            "&emsp;" + ( results[i][2] < 9 ? "&nbsp;&nbsp;&nbsp;&nbsp;" + results[i][2] : results[i][2] < 99 ? "&nbsp;&nbsp;" + results[i][2] : results[i][2] ) +
            "&emsp;&emsp;&emsp;" + results[i][1] +
            "&emsp;&emsp;&emsp;" + results[i][0] + end;
        }

        return res;

    }

    clear() {
        localStorage.clear();
    }
}