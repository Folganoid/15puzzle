export default class HtmlBuilder {
    constructor() {

    }

    buildTag(tagName, attr = {}, content = "") {

        let elem = document.createElement(tagName);

        if (content != "") {
            let cont = document.createTextNode(content);
            elem.appendChild(cont);
        }

        if (attr) {
            for (let i in attr) {
                elem.setAttribute(i, attr[i]);
            }
        }

        return elem;

    }

    buildBody() {

        let root = document.getElementById('root');

        let block = this.buildTag('div', {id: "block"});
            let h1 = this.buildTag('h1', {}, "Shuffling...");
            block.appendChild(h1);
        root.appendChild(block);

        let alarmMod = this.buildTag('div', {id: "alarm-mod"});
            let h2 = this.buildTag('h2', {}, "Message");
            alarmMod.appendChild(h2);

            let alarmP = this.buildTag('p', {}, "");
            alarmMod.appendChild(alarmP);

            let alarmB = this.buildTag('button', {id: "alarm-button"}, "Close");
            alarmMod.appendChild(alarmB);
        
        root.appendChild(alarmMod);

        let nav = this.buildTag('nav', {class: "nav"});
            let div1 = this.buildTag('div', {class: "nav__container"});
                 let button1 = this.buildTag('button', {id: "start"}, "Shuffle and start");
                 //let button2 = this.buildTag('button', {id: "startTest"}, "Start without shuffle (test)");
                 let button3 = this.buildTag('button', {id: "save"}, "Save");
                 let button4 = this.buildTag('button', {id: "load"}, "Load");
                 let button5 = this.buildTag('button', {id: "results"}, "Results");
                 let button6 = this.buildTag('button', {id: "resultsClear"}, "Clear localStorage");
                 let button7 = this.buildTag('button', {id: "sound", class: "nav__sound_active"}, "Sound On");
                
                 div1.appendChild(button1);
                //div1.appendChild(button2);
                 div1.appendChild(button3);
                 div1.appendChild(button4);
                 div1.appendChild(button5);
                 div1.appendChild(button6);
                 div1.appendChild(button7);

                 let div2 = this.buildTag('div');
                     let span = this.buildTag('span');
                     span.innerHTML = 'Shuffle deep: <b id=\"nav__deeper-val\">4x10</b> steps';

                     let input = this.buildTag('input', {id: "nav__deeper", min: "100", "max": 300, value: "100", step: "10", type: "range"});

                     div2.appendChild(span);
                     div2.appendChild(input);

            div1.appendChild(div2);

                 let p = this.buildTag('p');
                 p.innerHTML = "Moves: <b id=\"nav__mov\">0</b> / Time: <b id=\"nav__min\">00</b>:<b id=\"nav__sec\">00</b>";
            
             div1.appendChild(p);

        nav.appendChild(div1);
        root.appendChild(nav);

        let section = this.buildTag('section', {class: "field"});
        root.appendChild(section);

        let footer = this.buildTag('footer', {class: "footer"});

            let div3 = this.buildTag('div', {class: "footer__container"});
                 let p2 = this.buildTag('p');
                     let b = this.buildTag('b', {}, "Frame size: ");
                     let span2 = this.buildTag('span', {class: "footer__display"}, "4x4");
                
                     p2.append(b);
                     p2.append(span2);
                
                 let p3 = this.buildTag('p');
                     let b2 = this.buildTag('b', {}, "Other sizes:");
                     p3.append(b2);


                 let ul = this.buildTag('ul', {class: "footer__list"});
                     let li3 = this.buildTag('li');
                     li3.append(this.buildTag('a', {href: "3"}, "3x3"));

                     let li4 = this.buildTag('li');
                     li4.append(this.buildTag('a', {href: "4", class: "footer__link_active"}, "4x4"));

                     let li5 = this.buildTag('li');
                     li5.append(this.buildTag('a', {href: "5"}, "5x5"));

                     let li6 = this.buildTag('li');
                     li6.append(this.buildTag('a', {href: "6"}, "6x6"));

                     let li7 = this.buildTag('li');
                     li7.append(this.buildTag('a', {href: "7"}, "7x7"));

                     let li8 = this.buildTag('li');
                     li8.append(this.buildTag('a', {href: "8"}, "8x8"));

                     ul.append(li3);
                     ul.append(li4);
                     ul.append(li5);
                     ul.append(li6);
                     ul.append(li7);
                     ul.append(li8);

                 div3.append(p2);
                 div3.append(p3);
                 div3.append(ul);

            footer.appendChild(div3);    
        root.appendChild(footer);

    }

}