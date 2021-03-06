/*
 * Created by ALL-INKL.COM - Neue Medien Muennich - 04. Feb 2014
 * Licensed under the terms of GPL, LGPL and MPL licenses.
 */
CKEDITOR.dialog.add("base64imageDialog", function (editor) {
    var t = null,
        selectedImg = null,
        orgWidth = null, orgHeight = null,
        imgPreview = null, urlCB = null, urlI = null, fileCB = null, imgScal = 1;

    /* Load preview image */
    function imagePreviewLoad(s) {
        /* no preview */
        if (typeof (s) != "string" || !s) {
            imgPreview.getElement().setHtml("");
            return;
        }

        /* Create image */
        var i = new Image();
        i.src = s;

        /* When image is loaded */
        i.onload = function () {
            /* Resize image */
            if (editor.plugins.imageresize)
                editor.plugins.imageresize.resize(editor, this);

            /* Remove preview */
            imgPreview.getElement().setHtml("");

            /* Set attributes */
            if (orgWidth == null || orgHeight == null) {
                t.setValueOf("tab-properties", "width", "100");
                t.setValueOf("tab-properties", "height", "100");
            } else {
                t.setValueOf("tab-properties", "width", orgWidth);
                t.setValueOf("tab-properties", "height", orgHeight);
            }

            this.id = editor.id + "previewimage";
            this.setAttribute("style", "max-width:400px;max-height:100px;");
            this.setAttribute("alt", "");

            /* Insert preview image */
            try {
                var p = imgPreview.getElement().$;
                if (p)
                    p.appendChild(this);
            } catch (e) {
            }

        };

        /* Error Function */
        i.onerror = function () {
            imgPreview.getElement().setHtml("");
        };
        i.onabort = function () {
            imgPreview.getElement().setHtml("");
        };
    }

    /* Change input values and preview image */
    function imagePreview() {

        /* Remove preview */
        imgPreview.getElement().setHtml("");

        /* Ensable Image File Checkbox */
        if (urlCB)
            urlCB.setValue(false, true);
        if (fileCB)
            fileCB.setValue(true, true);

        /* Read file and load preview */
        var fileI = t.getContentElement("tab-source", "file");
        var n = null;
        try {
            n = fileI.getInputElement().$;
        } catch (e) {
            n = null;
        }
        if (n && "files" in n && n.files && n.files.length > 0 && n.files[0]) {
            if ("type" in n.files[0] && !n.files[0].type.match("image.*"))
                return;
            if (!FileReader)
                return;
            imgPreview.getElement().setHtml("Betöltés...");
            var fr = new FileReader();
            fr.onload = (function (f) {
                return function (e) {
                    imgPreview.getElement().setHtml("");
                    imagePreviewLoad(e.target.result);
                };
            })(n.files[0]);
            fr.onerror = function () {
                imgPreview.getElement().setHtml("");
            };
            fr.onabort = function () {
                imgPreview.getElement().setHtml("");
            };
            fr.readAsDataURL(n.files[0]);
        }

    }
    ;

    /* Calculate image dimensions */
    function getImageDimensions() {
        var o = {
            "w": t.getContentElement("tab-properties", "width").getValue(),
            "h": t.getContentElement("tab-properties", "height").getValue()
        };
        o.w = parseInt(o.w, 10);
        o.h = parseInt(o.h, 10);
        if (isNaN(o.w))
            o.w = 0;
        if (isNaN(o.h))
            o.h = 0;
        return o;
    }

    /* Set image dimensions */
    function setImageRatio(to) {
        var o = getImageDimensions();
        imgScal = imgScal > 1 ? 1 : imgScal;
        if (to == "width") {
            o.h = Math.round(o.w / imgScal);
        } else {
            o.w = Math.round(o.h * imgScal);
        }

        t.getContentElement("tab-properties", "width").setValue(o.w);
        t.getContentElement("tab-properties", "height").setValue(o.h);
    }

    /* Set integer Value */
    function integerValue(elem) {
        var v = elem.getValue();
        v = parseInt(v, 10);
        if (isNaN(v))
            v = 0;
        elem.setValue(v + "%");
    }

    var sourceElements = [
        {
            type: "file",
            id: "file",
            label: "",
            onChange: function () {
                imagePreview();
            }
        },
        {
            type: "html",
            id: "preview",
            html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
        }
    ];

    /* Dialog */
    return {
        title: editor.lang.common.image,
        minWidth: 450,
        minHeight: 180,
        onLoad: function () {
            /* Get url input element */
            urlI = this.getContentElement("tab-source", "url");

            /* Get image preview element */
            imgPreview = this.getContentElement("tab-source", "preview");

            /* Change Attributes Events  */
            this.getContentElement("tab-properties", "width").getInputElement().on("keyup", function () {
                var imageDimensions = getImageDimensions();
                if (imageDimensions.w > 100) {
                    alert("A kép túl széles, maximum 100% állítható be.");
                    CKEDITOR.dialog.getCurrent().disableButton('ok');
                    return;
                }

                CKEDITOR.dialog.getCurrent().enableButton('ok');
                setImageRatio("width");
            });
            this.getContentElement("tab-properties", "height").getInputElement().on("keyup", function () {
                var imageDimensions = getImageDimensions();
                if (imageDimensions.h > 100) {
                    alert("A kép túl magas, maximum 100% állítható be.");
                    CKEDITOR.dialog.getCurrent().disableButton('ok');
                    return;
                }

                CKEDITOR.dialog.getCurrent().enableButton('ok');
                setImageRatio("height");
            });
            this.getContentElement("tab-properties", "vmargin").getInputElement().on("keyup", function () {
                integerValue(this);
            }, this.getContentElement("tab-properties", "vmargin"));
            this.getContentElement("tab-properties", "hmargin").getInputElement().on("keyup", function () {
                integerValue(this);
            }, this.getContentElement("tab-properties", "hmargin"));
            this.getContentElement("tab-properties", "border").getInputElement().on("keyup", function () {
                integerValue(this);
            }, this.getContentElement("tab-properties", "border"));

        },
        onShow: function () {
            /* Remove preview */
            imgPreview.getElement().setHtml("");

            t = this, orgWidth = null, orgHeight = null, imgScal = 1;

            /* selected image or null */
            selectedImg = editor.getSelection();
            if (selectedImg)
                selectedImg = selectedImg.getSelectedElement();
            if (!selectedImg || selectedImg.getName() !== "img")
                selectedImg = null;

            /* Set input values */
            t.setValueOf("tab-properties", "vmargin", "0");
            t.setValueOf("tab-properties", "hmargin", "0");
            t.setValueOf("tab-properties", "border", "0");
            t.setValueOf("tab-properties", "align", "none");
            if (selectedImg) {


                /* Set input values from selected image */
                if (typeof (selectedImg.getAttribute("width")) == "string")
                    orgWidth = selectedImg.getAttribute("width");
                if (typeof (selectedImg.getAttribute("height")) == "string")
                    orgHeight = selectedImg.getAttribute("height");
                if ((orgWidth == null || orgHeight == null) && selectedImg.$) {

                    // Azért van szükség a selectedImg.getStyle()-ból szedni az adatokat, mert a kép visszatöltésekor
                    // a selectedImg.$.width és a selectedImg.$.height már pixelben tárolja
                    // az értékeit és ebből tölti vissza az eredetileg %-ot tartalmazó mezőt,
                    // ami így modosítás után helytelen képméretet eredményez
                    // Viszont az img style attribútumába továbbbra is %-osan szerepel az érték így onna kell kiszedni.

                    orgWidth = selectedImg.getStyle('width');
                    orgHeight = selectedImg.getStyle('height');
                }

                if (orgWidth != null && orgHeight != null) {
                    t.setValueOf("tab-properties", "width", orgWidth);
                    t.setValueOf("tab-properties", "height", orgHeight);
                    orgWidth = parseInt(orgWidth, 10);
                    orgHeight = parseInt(orgHeight, 10);
                    imgScal = 1;
                    if (!isNaN(orgWidth) && !isNaN(orgHeight) && orgHeight > 0 && orgWidth > 0)
                        imgScal = orgWidth / orgHeight;
                    if (imgScal <= 0)
                        imgScal = 1;
                }

                if (typeof (selectedImg.getAttribute("src")) == "string") {
                    if (selectedImg.getAttribute("src").indexOf("data:") === 0) {
                        imagePreview("base64");
                        imagePreviewLoad(selectedImg.getAttribute("src"));
                    } else {
                        t.setValueOf("tab-source", "url", selectedImg.getAttribute("src"));
                    }
                }
                if (typeof (selectedImg.getAttribute("alt")) == "string")
                    t.setValueOf("tab-properties", "alt", selectedImg.getAttribute("alt"));
                if (typeof (selectedImg.getAttribute("hspace")) == "string")
                    t.setValueOf("tab-properties", "hmargin", selectedImg.getAttribute("hspace"));
                if (typeof (selectedImg.getAttribute("vspace")) == "string")
                    t.setValueOf("tab-properties", "vmargin", selectedImg.getAttribute("vspace"));
                if (typeof (selectedImg.getAttribute("border")) == "string")
                    t.setValueOf("tab-properties", "border", selectedImg.getAttribute("border"));
                if (typeof (selectedImg.getAttribute("align")) == "string") {
                    switch (selectedImg.getAttribute("align")) {
                        case "top":
                        case "text-top":
                            t.setValueOf("tab-properties", "align", "top");
                            break;
                        case "baseline":
                        case "bottom":
                        case "text-bottom":
                            t.setValueOf("tab-properties", "align", "bottom");
                            break;
                        case "left":
                            t.setValueOf("tab-properties", "align", "left");
                            break;
                        case "right":
                            t.setValueOf("tab-properties", "align", "right");
                            break;
                    }
                }
                t.selectPage("tab-properties");
            }

        },
        onOk: function () {

            /* Get image source */
            var isNewImage = true;
            var src = "";
            try {
                src = CKEDITOR.document.getById(editor.id + "previewimage").$.src;
            } catch (e) {
                src = "";
            }
            if (typeof (src) != "string" || src == null || src === "")
                return;


            /* selected image or new image */
            if (selectedImg && selectedImg.$.src == src) {
                var newImg = selectedImg;
                isNewImage = false;
            } else {
                var newImg = editor.document.createElement("img");
            }

            newImg.setAttribute("src", src);
            src = null;

            /* Set attributes */
            newImg.setAttribute("alt", t.getValueOf("tab-properties", "alt").replace(/^\s+/, "").replace(/\s+$/, ""));
            var attr = {
                "width": ["width", "width:#;", "integer", 1],
                "height": ["height", "height:#;", "integer", 1],
                "vmargin": ["vspace", "margin-top:#;margin-bottom:#;", "integer", 0],
                "hmargin": ["hspace", "margin-left:#;margin-right:#;", "integer", 0],
                "align": ["align", ""],
                "border": ["border", "border:# solid black;", "integer", 0]
            }, css = [], value, cssvalue, attrvalue, k;
            for (k in attr) {

                value = t.getValueOf("tab-properties", k);
                attrvalue = value;
                cssvalue = value;

                if (k == "align") {
                    switch (value) {
                        case "top":
                        case "bottom":
                            attr[k][1] = "vertical-align:#;";
                            break;
                        case "left":
                        case "right":
                            attr[k][1] = "float:#;";
                            break;
                        default:
                            value = null;
                            break;
                    }
                }

                if (attr[k][2] == "integer") {
                    value = parseInt(value, 10);
                    if (isNaN(value))
                        value = null;
                    else if (value < attr[k][3])
                        value = null;
                    if (value != null) {
                        attrvalue = value + "%";
                        cssvalue = value + "%";
                    }
                }

                if (value != null) {
                    newImg.setAttribute(attr[k][0], attrvalue);
                    css.push(attr[k][1].replace(/#/g, cssvalue));
                }

            }
            if (css.length > 0)
                newImg.setAttribute("style", css.join(""));

            //set image ID attribute
            if (editor.plugins.sequence && isNewImage) {
                var nextId = editor.sequence.next(editor);
                newImg.setAttribute("data-id", nextId);
            }

            editor.insertElement(newImg);
        },

        /* Dialog form */
        contents: [
            {
                id: "tab-source",
                label: editor.lang.common.generalTab,
                elements: sourceElements
            },
            {
                id: "tab-properties",
                label: editor.lang.common.advancedTab,
                elements: [
                    {
                        type: "text",
                        id: "alt",
                        label: editor.lang.base64image.alt
                    },
                    {
                        type: 'hbox',
                        widths: ["20%", "30%", "50%"],
                        children: [
                            {
                                type: "text",
                                width: "45px",
                                id: "width",
                                label: editor.lang.common.width
                            },
                            {
                                type: "text",
                                width: "45px",
                                id: "height",
                                label: editor.lang.common.height
                            },
                            {
                                type: 'vbox',
                                padding: 0,
                                children: [
                                    {
                                        type: 'hbox',
                                        children: [
                                            {
                                                type: "select",
                                                id: "align",
                                                label: editor.lang.common.align,
                                                items: [
                                                    [editor.lang.common.notSet, "none"],
                                                    [editor.lang.common.alignTop, "top"],
                                                    [editor.lang.common.alignBottom, "bottom"],
                                                    [editor.lang.common.alignLeft, "left"],
                                                    [editor.lang.common.alignRight, "right"]
                                                ]
                                            },
                                            {
                                                type: "text",
                                                width: "45px",
                                                id: "border",
                                                label: editor.lang.base64image.border
                                            }
                                        ]
                                    },
                                    {
                                        type: 'hbox',
                                        widths: ["50%", "50%"],
                                        children: [
                                            {
                                                type: "text",
                                                width: "45px",
                                                id: "vmargin",
                                                label: editor.lang.base64image.vSpace
                                            },
                                            {
                                                type: "text",
                                                width: "45px",
                                                id: "hmargin",
                                                label: editor.lang.base64image.hSpace
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ]
    };
});
