/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
        config.plugins = 'sequence,dialogui,dialog,about,a11yhelp,autocorrect,dialogadvtab,basicstyles,bidi,blockquote,notification,button,toolbar,clipboard,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,copyformatting,div,resize,elementspath,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,indent,indentblock,indentlist,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,tableselection,undo,wsc,base64image,pastebase64,imageresize';
        config.skin = 'moono-lisa';

        config.disableObjectResizing = true;

        /**
         *  IJR-ben central-ban a CkEditorConfig.java -ban az extraAllowedContent is ez a default értéke,
         *  ha módosul ez ott is módosítani kell
         */
        config.extraAllowedContent = 'table[width];p{margin-top,margin-bottom}';
        config.disallowedContent = 'table{width}';
        config.stylesEnabledCopyPaste = true;
        CKEDITOR.disableAutoInline = true;
};
