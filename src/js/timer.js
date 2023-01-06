export default class Timer {

    constructor() {

        this.timeString = "00:00";
        this.seconds = 0; 
        this.minutes = 0; 
        this.appendMin = document.getElementById("nav__min");
        this.appendSec = document.getElementById("nav__sec");
    }

    start() {

        this.seconds = 0;
        this.minutes = 0;

        this.appendSec.innerHTML = "00";
        this.appendMin.innerHTML = "00";

            clearInterval(this.Interval);
            this.Interval = setInterval(() => {
                this.seconds++; 
                if (this.seconds > 59) {
                    this.minutes++;
                    this.seconds = 0;
                }
                this.drawTimer(this.seconds, this.minutes);
            }, 1000);
    }

    stop(onlyClear = false) {

        if (!onlyClear) {
            this.seconds = 0;
            this.minutes = 0;

            this.appendSec.innerHTML = "00";
            this.appendMin.innerHTML = "00";
        }
        clearInterval(this.Interval);
    }
    
    drawTimer(sec, min) {

        let minStr = "";
        let secStr = "";

        if(sec <= 9){
          this.appendSec.innerHTML = "0" + sec;
          secStr = "0" + sec;
         }

         if (sec > 9){
            this.appendSec.innerHTML = sec;
            secStr = ""+sec;
        }
        
        if(min <= 9){
            this.appendMin.innerHTML = "0" + min;
            minStr = "0" + min;
        }
  
        if (min > 9){
              this.appendMin.innerHTML = min;
              minStr = ""+min;
        } 

        this.timeString = minStr + ":" + secStr;

    }

    getTime() {
        return this.timeString;
    }
}