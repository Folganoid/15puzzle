import "./styles.scss";
import Field from './js/field';
import ButtonHandler from './js/buttonsHandler';
import HtmlBuilder from './js/htmlBuilder';

(new HtmlBuilder()).buildBody();

let field = new Field(4);
(new ButtonHandler()).init(field);
field.restart();

let navContainer = document.querySelector('.nav__container');
new ResizeObserver(() => {
    field.resize(navContainer.scrollWidth);
}).observe(navContainer);






