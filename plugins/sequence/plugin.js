CKEDITOR.plugins.add('sequence', {

    init: function (editor) {
        editor.sequence = {
            _value: 0,
            _regex: /(<[^>]*data-id=")([0-9]*)("[^>]*>)/gm,

            next: function () {
                editor.sequence._value += 1;
                return editor.sequence._value;
            },

            hasId: function (html) {
                var regex = editor.sequence._regex;
                return regex.test(html);
            }
        };


        function updateId(html) {
            if (editor.sequence.hasId(html)) {
                var regex = editor.sequence._regex;
                return html.replace(regex, function (img, beforeImageId, imageId, afterImageId) {
                    var nextId = editor.sequence.next(editor);
                    return beforeImageId + nextId + afterImageId;
                });
            }
        }

        function chkId() {
            // don't execute code if the editor is readOnly
            if (editor.readOnly)
                return;

            setTimeout(function () {
                editor.document.$.body.innerHTML = updateId(editor.document.$.body.innerHTML);
            }, 100);
        }

        editor.on('contentDom', function () {
            // For Firefox
            editor.document.on('drop', chkId);
            // For IE
            editor.document.getBody().on('drop', chkId);
        });

        editor.on('paste', function (e) {
            var html = e.data.dataValue;
            if (!html)
                return;
            e.data.dataValue = updateId(html);
        });

        editor.on('setData', function (e) {
            var html = e.data.dataValue;
            var regex = editor.sequence._regex;
            var sequence = editor.sequence._value;

            var match;
            while (true) {
                match = regex.exec(html);
                if (match) {
                    sequence = Math.max(sequence, match[2]);
                } else {
                    break;
                }
            }

            editor.sequence._value = sequence;
        });
    }
});