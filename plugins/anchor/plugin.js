(function () {

    CKEDITOR.plugins.add('anchor', {
        init: function (editor) {
            editor.on('contentDom', function () {
                this.document.on('mousedown', function (e) {
                    if (e.data.$.button == 0) {
                        var b = CKEDITOR.plugins.link.getSelectedLink(editor);
                        if (e.data.$.ctrlKey && b) {
                            if (b.is('a')) {
                                var anchorName = getAnchorName(b.$.dataset.ckeSavedHref);
                                if (anchorName && (b.$.protocol.indexOf('http') == 0)) {
                                    e.data.preventDefault();
                                    var anchor = editor.document.getById(anchorName);
                                    var range = editor.createRange();
                                    range.setStart(anchor, 0);
                                    editor.getSelection().selectRanges([range]);
                                    anchor.scrollIntoView();
                                }
                            }
                        }
                    }
                })
            })
        }
    });

    CKEDITOR.plugins.link = {
        /**
         * Get the surrounding link element of the current selection.
         *
         *        CKEDITOR.plugins.link.getSelectedLink( editor );
         *
         *        // The following selections will all return the link element.
         *
         *        <a href="#">li^nk</a>
         *        <a href="#">[link]</a>
         *        text[<a href="#">link]</a>
         *        <a href="#">li[nk</a>]
         *        [<b><a href="#">li]nk</a></b>]
         *        [<a href="#"><b>li]nk</b></a>
         *
         * @since 3.2.1
         * @param {CKEDITOR.editor} editor
         * @param {Boolean} [returnMultiple=false] Indicates whether the function should return only the first selected link or all of them.
         * @returns {CKEDITOR.dom.element/CKEDITOR.dom.element[]/null} A single link element or an array of link
         * elements relevant to the current selection.
         */
        getSelectedLink: function (editor, returnMultiple) {
            var selection = editor.getSelection(),
                selectedElement = selection.getSelectedElement(),
                ranges = selection.getRanges(),
                links = [],
                link,
                range,
                i;

            if (!returnMultiple && selectedElement && selectedElement.is('a')) {
                return selectedElement;
            }

            for (i = 0; i < ranges.length; i++) {
                range = selection.getRanges()[i];

                // Skip bogus to cover cases of multiple selection inside tables (#tp2245).
                range.shrink(CKEDITOR.SHRINK_TEXT, false, {skipBogus: true});
                link = editor.elementPath(range.getCommonAncestor()).contains('a', 1);

                if (link && returnMultiple) {
                    links.push(link);
                } else if (link) {
                    return link;
                }
            }

            return returnMultiple ? links : null;
        }
    }

    function getAnchorName(href) {
        return href.split('#')[1];
    }

})();
