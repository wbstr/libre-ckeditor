# blockimagepaste
Block drag &amp; drop image OR direct image paste into CKEditor


# Adding it to CKEdtior

    cd <ckeditor>
    cd plugins/
    git clone https://github.com/coolshou/blockimagepaste.git

Now add the plugin in your config.js

    cd <ckeditor>
    nano config.js 

for redmine_ckeditor
 
    cd <redmine>
    cd plugins/redmine_ckeditor/assets/ckeditor-contrib/plugins
    git clone https://github.com/coolshou/blockimagepaste.git
    cd plugins/redmine_ckeditor/assets/ckeditor
    nano config.js 
    
with following setting

    CKEDITOR.editorConfig = function( config )
    {
     config.extraPlugins = "blockimagepaste";
    };
