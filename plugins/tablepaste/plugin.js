CKEDITOR.plugins.add( 'tablepaste',
    {
        init : function( editor )
        {
            function replaceTableId(html) {
                var ret = html.replace( /tableId="\d+"/gi, function( table ){
                    var id = editor.config.tableId;
                    editor.config.tableId += 1;
                    return "tableId=\"" + id + "\"";
                });
                return ret;
            }

            function checkTable() {
                // don't execute code if the editor is readOnly
                if (editor.readOnly)
                    return;

                setTimeout( function() {
                    editor.document.$.body.innerHTML = replaceTableId(editor.document.$.body.innerHTML);
                },100);
            }

            editor.on( 'contentDom', function() {
                // For Firefox
                editor.document.on('drop', checkTable);
                // For IE
                editor.document.getBody().on('drop', checkTable);
            });

            editor.on( 'paste', function(e) {
                var html = e.data.dataValue;
                if (!html)
                    return;
                e.data.dataValue = replaceTableId(html);
            });

        } //Init
    } );
