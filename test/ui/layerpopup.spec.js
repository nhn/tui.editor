import LayerPopup from '../../src/js/ui/layerpopup';

describe('LayerPopup', () => {
    const {CLASS_PREFIX} = LayerPopup;
    let popup;

    afterEach(() => {
        popup = null;
        $('body').empty();
    });

    describe('팝업이 들어갈 타겟 엘리먼트를 정한다', () => {
        it('옵션으로 전달된 $target이 내부 어트리뷰트 $target 으로 만들어졌다.', () => {
            $('body').html('<div class="container" />');

            popup = new LayerPopup({
                $target: $('.container')
            });

            popup.render();

            expect(popup.$target.hasClass('container')).toBe(true);
        });

        it('타겟이 전달되면 팝업이 타겟으로 붙는다', () => {
        });
    });

    describe('팩토리를 이용해 외부 팝업 HTML을 팝업화한다', () => {
        beforeEach(() => {
            $('body').html(`<div class="${CLASS_PREFIX}wrapper" />`);

            popup = LayerPopup.factory({
                $el: $(`.${CLASS_PREFIX}wrapper`)
            });
        });

        it('옵션으로 전달된 $el이 내부 $el로 지정된다', () => {
            expect(popup.$el.hasClass(`${CLASS_PREFIX}wrapper`)).toBe(true);
        });

        it('외부 HTML을 이용하는경우 컨텐트옵션을 이용하지 않는다', () => {
            $('body').html(LayerPopup.prototype.layoutTemplate);

            popup = LayerPopup.factory({
                $el: $(`.${CLASS_PREFIX}wrapper`),
                content: $('<p>test</p>')
            });

            expect(popup.$target.find('p').length).toBe(0);
        });
    });

    describe('기본레이아웃을 이용한다', () => {
        it('자체 생성 팝업 HTML의 각 클래스네임별로 엘리먼트들이 존재한다.', () => {
            popup = new LayerPopup();
            popup.render();

            expect(popup.$target.find(`.${CLASS_PREFIX}wrapper`).length).toBe(1);
            expect(popup.$target.find(`.${CLASS_PREFIX}header`).length).toBe(1);
            expect(popup.$target.find(`.${CLASS_PREFIX}body`).length).toBe(1);
            expect(popup.$target.find(`.${CLASS_PREFIX}close-button`).length).toBe(1);
        });

        it('className을 옵션으로 전달하면 래퍼 엘리먼트에 해당 클래스네임을 추가한다', () => {
            popup = new LayerPopup({
                className: 'myclass'
            });
            popup.render();

            expect(popup.$el.hasClass('myclass')).toBe(true);
        });

        it('텍스트 컨텐트를 전달받아 그린다', () => {
            popup = new LayerPopup({
                textContent: 'text'
            });

            popup.render();

            expect(popup.$el.find(`.${CLASS_PREFIX}body`).text()).toEqual('text');
        });

        it('컨텐트를 텍스트 태그형태로 전달받아서 그린다', () => {
            popup = new LayerPopup({
                content: '<p>test</p>'
            });

            popup.render();

            expect(popup.$target.find('p').length).toBe(1);
        });

        it('컨텐트를 제이쿼리형태로 전달받아서 그린다', () => {
            popup = new LayerPopup({
                content: $('<p>test</p>')
            });

            popup.render();

            expect(popup.$target.find('p').length).toBe(1);
        });

        it('타이틀을 전달받아 그린다', () => {
            popup = new LayerPopup({
                title: 'mytitle'
            });

            popup.render();

            expect($(`.${CLASS_PREFIX}title`).text()).toEqual('mytitle');
        });

        it('do not render if header option is false', () => {
            popup = new LayerPopup({
                header: false
            });

            popup.render();

            expect($(`.${CLASS_PREFIX}header`).length).toEqual(0);
        });
    });

    describe('css', () => {
        it('css() can apply style to popup wrapper', () => {
            popup = new LayerPopup({
                content: '<p>test</p>'
            });

            popup.render();
            popup.css({
                width: 10
            });

            expect($(`.${CLASS_PREFIX}wrapper`).width()).toEqual(10);
        });
        it('css option can apply style to popup wrapper', () => {
            popup = new LayerPopup({
                content: '<p>test</p>',
                css: {
                    width: 10
                }
            });

            popup.render();

            expect($(`.${CLASS_PREFIX}wrapper`).width()).toEqual(10);
        });
    });

    describe('setContent', () => {
        beforeEach(() => {
            popup = new LayerPopup();
            popup.render();
        });

        it('컨텐트를 변경한다', () => {
            popup.setContent('text');
            expect(popup.$el.find(`.${CLASS_PREFIX}body`).text()).toEqual('text');
        });
        it('컨텐트가 이미 있다면 지우고 변경한다', () => {
            popup.setContent('text');
            popup.setContent('text');
            expect(popup.$el.find(`.${CLASS_PREFIX}body`).text()).toEqual('text');
        });
    });

    describe('setTitle', () => {
        beforeEach(() => {
            popup = new LayerPopup();
            popup.render();
        });

        it('타이틀을 변경한다', () => {
            popup.setTitle('title');
            expect($(`.${CLASS_PREFIX}title`).text()).toEqual('title');
        });

        it('타이틀이 이미 있다면 지우고  변경한다', () => {
            popup.setTitle('titleBefore');
            popup.setTitle('title');
            expect($(`.${CLASS_PREFIX}title`).text()).toEqual('title');
        });
    });

    describe(`내부의 ${CLASS_PREFIX}close-button란 클래스가 붙은 엘리먼트가 클릭되면 팝업이 닫힌다`, () => {
        beforeEach(() => {
            popup = new LayerPopup();
            popup.render();
        });

        it('클릭이벤트가 발생되어 layerpopup이 사라진다', () => {
            popup.show();
            expect(popup.isShow()).toBe(true);

            $(`.${CLASS_PREFIX}close-button`).trigger('click');
            expect(popup.isShow()).toBe(false);
        });
    });

    describe('CSS 셀렉터를 옵션으로 받아 팝업을 오픈하는 버튼을 지정할수 있다', () => {
        beforeEach(() => {
            $('body').append($('<button class="button1 openPopup"></button>'));
            $('body').append($('<button class="button2 openPopup"></button>'));

            popup = new LayerPopup({
                openerCssQuery: '.openPopup'
            });

            popup.render();
        });

        it('옵션에 해당되는 엘리먼트가 클릭되면 팝업의 show된다.', () => {
            $('.button1').trigger('click');
            expect(popup.isShow()).toBe(true);
            popup.hide();

            $('.button2').trigger('click');
            expect(popup.isShow()).toBe(true);
        });
    });

    describe('CSS 셀렉터를 옵션으로 받아 팝업을 닫는 버튼을 지정할수 있다', () => {
        beforeEach(() => {
            $('body').append($('<button class="button1 closePopup"></button>'));
            $('body').append($('<button class="button2 closePopup"></button>'));

            popup = new LayerPopup({
                closerCssQuery: '.closePopup'
            });

            popup.render();
        });

        it('옵션에 해당되는 엘리먼트가 클릭되면 팝업의 show된다.', () => {
            popup.show();
            $('.button1').trigger('click');
            expect(popup.isShow()).toBe(false);

            popup.show();
            $('.button2').trigger('click');
            expect(popup.isShow()).toBe(false);
        });
    });

    describe('팝업 노출과 숨기기', () => {
        beforeEach(() => {
            popup = new LayerPopup({
                $el: $('<div class="container" />')
            });

            popup.render();
        });

        it('show()로 팝업이 나타난다', () => {
            popup.hide();
            popup.show();

            expect(popup.$el.css('display')).toEqual('block');
            expect(popup.isShow()).toBe(true);
        });

        it('hide()로 팝업이 숨겨진다', () => {
            popup.show();
            popup.hide();

            expect(popup.$el.css('display')).toEqual('none');
            expect(popup.isShow()).toBe(false);
        });
    });

    describe('remove로 팝업을 DOM에서 삭제할 수 있다', () => {
        beforeEach(() => {
            popup = new LayerPopup();
            popup.render();
        });

        it('래퍼 엘리먼트가 삭제된다', () => {
            popup.remove();
            expect($(`.${CLASS_PREFIX}wrapper`).length).toBe(0);
        });
    });

    describe('remove객체가 지정한 이벤트들을 모두 해제 할수 있어야한다', () => {
        beforeEach(() => {
            $('body').append($('<button class="button1 openPopup"></button>'));

            popup = new LayerPopup({
                openerCssQuery: '.openPopup'
            });

            popup.render();
        });

        it('오프너 이벤트가 발생하지 않는다', () => {
            const button = $('.button1');
            popup.remove();
            button.trigger('click');
            expect(popup.isShow()).toBe(false);
        });

        it('close-button이벤트가 발생하지 않는다', () => {
            const button = $(`.${CLASS_PREFIX}close-button`);
            popup.show();
            popup.remove();
            button.trigger('click');
            expect(popup.isShow()).toBe(true);
        });
    });

    describe('커스텀 이벤트를 관리할 수 있다', () => {
        beforeEach(() => {
            popup = new LayerPopup();
            popup.render();
        });

        it('이벤트가 발생된다', () => {
            const spy = jasmine.createSpy('spy');
            popup.on('cev', spy);
            popup.trigger('cev');

            expect(spy).toHaveBeenCalled();
        });

        it('이벤트가 제거된다', () => {
            const spy = jasmine.createSpy('spy');
            popup.on('cev', spy);
            popup.off('cev');
            popup.trigger('cev');

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('modal popup', () => {
        beforeEach(() => {
            popup = new LayerPopup({
                modal: true
            });
            popup.render();
        });

        it('contains modal layout if modal option is true', () => {
            expect(popup.$el.hasClass('tui-popup-modal-background')).toBe(true);

            popup = new LayerPopup();
            popup.render();

            expect(popup.$el.hasClass('tui-popup-modal-background')).toBe(false);
        });

        it('toggleFitToWindow should toggle style', () => {
            const isFitToWindow = popup.isFitToWindow();

            popup.toggleFitToWindow();
            expect(popup.isFitToWindow()).toBe(!isFitToWindow);

            popup.toggleFitToWindow();
            expect(popup.isFitToWindow()).toBe(isFitToWindow);
        });
    });
});
