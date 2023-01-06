export default class FooterHandler {
    constructor() {
    }

    rowsChange(field, attr = 4) {

        let list = document.querySelector('.footer__list');
        list.addEventListener('click', (e) => {
            if (e.target.tagName != "A") return;
            e.preventDefault();
            attr = e.target.getAttribute('href');
            if (attr) {
                field.reset(attr);
                this.highLight(attr);
                field.restart();
            }
        }, {once: true});
        
    }

    highLight(attr) {
        let a = document.querySelector('a[href="'+attr+'"]');
        if (!a) return;
        document.querySelector('.footer__display').innerHTML = a.innerHTML;
        document.querySelector('.footer__link_active').classList.toggle('footer__link_active');
        a.classList.toggle('footer__link_active');
    }
}