CKEDITOR.plugins.add('sequence', {

    init: function (editor) {
        editor.sequence = {
            _value: 0,

            next: function () {
                editor.sequence._value += 1;
                return editor.sequence._value;
            }
        };

        var tagWithDataId = /(<[^>]*data-id=")([0-9]*)("[^>]*>)/gm;

        function updateOrCreateId(html) {
            var tableOrImgRegex = /(<table|<img)([^>]*>)/gm;
            return html.replace(tableOrImgRegex, function (full, tag, afterTag) {
                var nextId = editor.sequence.next(editor);

                var match = tagWithDataId.exec(full);
                tagWithDataId.lastIndex = 0;
                if (match) {
                    return match[1] + nextId + match[3];
                }

                return tag + ' data-id="' + nextId + '" ' + afterTag;
            });
        }

        function chkId() {
            // don't execute code if the editor is readOnly
            if (editor.readOnly)
                return;

            setTimeout(function () {
                editor.document.$.body.innerHTML = updateOrCreateId(editor.document.$.body.innerHTML);
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
            e.data.dataValue = updateOrCreateId(html);
        });

        editor.on('setData', function (e) {
            var html = updateOrCreateId(e.data.dataValue);
            var sequence = editor.sequence._value;

            var match;
            while (true) {
                match = tagWithDataId.exec(html);
                if (match) {
                    sequence = Math.max(sequence, match[2]);
                } else {
                    break;
                }
            }

            e.data.dataValue = html;
            editor.sequence._value = sequence;
        });
    }
});