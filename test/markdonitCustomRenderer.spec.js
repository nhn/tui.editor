var Convertor = require('../src/js/convertor'),
    EventManager = require('../src/js/eventManager');

describe('Markdown-it', function() {
    var convertor, em;

    beforeEach(function() {
        var $container = $('<div />');
        em = new EventManager();
        convertor = new Convertor(em);

        $('body').append($container);
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('tableRendererRule', function() {
        var tableText = '\n| | | |'
            + '\n| --- | :---: | ---: |'
            + '\n| | | |'
            + '\n| | | |'
            + '\n| | | |';

        it('sholud render table element accurately', function() {
            var tableHTML = convertor.toHTML(tableText);
            var $tableElement = $(tableHTML);
            var tds, ths;

            expect($tableElement.find('td,th').length).toBe(12);
            tds = $tableElement.find('td');
            ths = $tableElement.find('th');
            expect(tds.eq(0).attr('align')).toBeUndefined();
            expect(tds.eq(1).attr('align')).toBe('center');
            expect(tds.eq(2).attr('align')).toBe('right');
            expect(ths.eq(0).attr('align')).toBeUndefined();
            expect(ths.eq(1).attr('align')).toBe('center');
            expect(ths.eq(2).attr('align')).toBe('right');
        });
    });

    describe('taskPlugin', function() {
        var taskText = '\n* [ ] study'
            + '\n* [x] workout'
            + '\n* [X] eat breakfast';

        it('should render task list accurately', function() {
            var taskHTML = convertor.toHTML(taskText);
            var $container = $('<div></div>');
            var li0, li1, li2, lis;

            $container.html(taskHTML);

            lis = $container.find('li');
            li0 = lis.eq(0);
            li1 = lis.eq(1);
            li2 = lis.eq(2);

            expect($container.children('ul').length).toBe(1);
            expect(lis.length).toBe(3);
            expect(li0.text()).toBe('study');
            expect(li0.hasClass('task-list-item')).toBe(true);
            expect(li0.hasClass('checked')).toBe(false);
            expect(li0.attr('data-te-task')).toBe('');

            expect(li1.text()).toBe('workout');
            expect(li1.hasClass('task-list-item')).toBe(true);
            expect(li1.hasClass('checked')).toBe(true);
            expect(li1.attr('data-te-task')).toBe('');

            expect(li2.text()).toBe('eat breakfast');
            expect(li2.hasClass('task-list-item')).toBe(true);
            expect(li2.hasClass('checked')).toBe(true);
            expect(li2.attr('data-te-task')).toBe('');
        });
    });

    describe('codeblock', function() {
        var codeblockText = '\n```javascript'
            + '\nvar a = 100;'
            + '\n```';

        it('rendering Codeblock element accurately', function() {
            var codeblockHTML = convertor._markdownToHtml(codeblockText);
            var $container = $('<div></div>');

            $container.html(codeblockHTML);

            expect($container.children('pre').length).toBe(1);
            expect($container.children('pre').children('code').length).toBe(1);
            expect($container.children('pre').children('code').attr('data-language')).toBe('javascript');
            expect($container.children('pre').children('code').hasClass('lang-javascript')).toBe(true);
        });
        it('rendering Codeblock element accurately with highlight', function() {
            var codeblockHTML = convertor._markdownToHtmlWithCodeHighlight(codeblockText);
            var $container = $('<div></div>');

            $container.html(codeblockHTML);

            expect($container.children('pre').length).toBe(1);
            expect($container.children('pre').children('code').length).toBe(1);
            expect($container.children('pre').children('code').children('span').length).toBe(2);
            expect($container.children('pre').children('code').attr('data-language')).toBe('javascript');
            expect($container.children('pre').children('code').hasClass('lang-javascript')).toBe(true);
        });
    });
});
