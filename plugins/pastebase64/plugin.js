CKEDITOR.plugins.add('pastebase64', {
    init: function init(editor) {

        var foundAsFile;

        editor.on('paste', function (e) {
            var html = e.data.dataValue;
            if (!html)
                return;

            if (foundAsFile) {
                // block image paste from firefox
                e.data.dataValue = html.replace(/<img[^>]*src="data:image\/png;base64,[^>]*>/gm, function (img) {
                    return '';
                });
            }
        });

        editor.on("contentDom", function () {
            var editableElement = editor.editable ? editor.editable() : editor.document;
            editableElement.on("paste", onPaste, null, {editor: editor});
        });

        function onPaste(event) {
            var editor = event.listenerData && event.listenerData.editor;
            var $event = event.data.$;
            var clipboardData = $event.clipboardData;
            var imageType = /^image/;

            foundAsFile = false;
            if (!clipboardData) {
                return;
            }

            return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
                if (type.match(imageType) || clipboardData.items[i].type.match(imageType)) {
                    readImageAsBase64(clipboardData.items[i], editor);
                    foundAsFile = true;
                }
            });
        }

        function readImageAsBase64(item, editor) {
            if (!item || typeof item.getAsFile !== 'function') {
                return;
            }

            var file = item.getAsFile();
            var reader = new FileReader();

            reader.onload = function (evt) {
                var image = new Image();
                image.src = evt.target.result;

                if (editor.plugins.imageresize) {
                    editor.plugins.imageresize.resize(editor, image);
                }

                if (editor.plugins.sequence) {
                    var nextId = editor.sequence.next(editor);
                    image.setAttribute("data-id", nextId);
                }

                var element = editor.document.createElement(image);
                editor.insertElement(element);
            };

            reader.readAsDataURL(file);
        }
    }
});
