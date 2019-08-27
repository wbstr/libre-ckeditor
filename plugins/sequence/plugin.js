CKEDITOR.plugins.add('sequence', {

    init: function (editor) {
        var dataIds = [];

        editor.sequence = {
            _value: 0,

            next: function () {
                editor.sequence._value += 1;
                return editor.sequence._value;
            }
        };

        var tagWithDataId = /(<[^>]*data-id=")([0-9]*)("[^>]*>)/gm;
        var tableOrImgRegex = /(<table|<img)([^>]*>)/gm;

        function updateOrCreateId(html) {
            return html.replace(tableOrImgRegex, function (full, tag, afterTag) {
                var nextId = editor.sequence.next(editor);

                var match = tagWithDataId.exec(full);
                tagWithDataId.lastIndex = 0;
                if (match) {
                    dataIds.push(nextId);
                    return match[1] + nextId + match[3];
                }

                dataIds.push(nextId);
                return tag + ' data-id="' + nextId + '" ' + afterTag;
            });
        }

        function checkDataIds(html) {
            dataIds.length = 0;
            return html.replace(tableOrImgRegex, function (full) {
                var match = tagWithDataId.exec(full);
                tagWithDataId.lastIndex = 0;

                if (match) {
                    var id = parseInt(match[2], 10);

                    if (dataIds.includes(id)) {
                        return updateOrCreateId(full);
                    }

                    dataIds.push(id);
                    return full;
                } else {
                    return updateOrCreateId(full);
                }
            });
        }

        editor.on('paste', function (e) {
            var html = e.data.dataValue;
            var match = tableOrImgRegex.exec(html);
            if (!html || !match)
                return;
            e.data.dataValue = updateOrCreateId(html);
        });

        editor.on('setData', function (e) {
            var html = checkDataIds(e.data.dataValue);
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