// ####################################################################################
// ####################################################################################
// ####################################################################################
// #################### !!!! KIKAPCSOLVA !!!! ##########################################
// ####################################################################################
// ####################################################################################
// ####################################################################################
// ####################################################################################

CKEDITOR.plugins.add('blockimagepaste',
        {
            init: function (editor)
            {
                function replaceImgText(html) {
                    // FIXME Mivel már a sequence plugin tesz id-t arra, amin nincs
                    // ez nem tud működni
//                    if (editor.sequence.hasId(html)) {
//                        return html;
//                    }

                    return  html.replace(/<img[^>]*>/gi, function (img) {
                        alert("Rendszeren kívülről kép beillesztés nem lehetséges. Kérem, használja a kép létrehozás gombot!");
                        return '';
                    });
                }

                function chkImg() {
                    // don't execute code if the editor is readOnly
                    if (editor.readOnly)
                        return;

                    setTimeout(function () {
                        editor.document.$.body.innerHTML = replaceImgText(editor.document.$.body.innerHTML);
                    }, 100);
                }

                editor.on('contentDom', function () {
                    // For Firefox
                    editor.document.on('drop', chkImg);
                    // For IE
                    editor.document.getBody().on('drop', chkImg);
                });

                editor.on('paste', function (e) {
                    var html = e.data.dataValue;
                    if (!html)
                        return;
                    e.data.dataValue = replaceImgText(html);
                });

            } //Init
        });
