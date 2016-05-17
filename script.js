 /*jshint esversion: 6 */
var Popups = function(optionsDefaults) {
"use strict";
 
     /**
     * Simple is object check.
     * @param item
     * @returns {boolean}
     */
    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param source
     */
    function mergeDeep(target, source) {
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, {
                        [key]: {}
                    });
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {
                        [key]: source[key]
                    });
                }
            });
        }
        return target;
    }
    var popups = {};

    var defaults = {
        className: "popup",
        styles: {
            position: "absolute",
            height: 200,
            width: 200,
            backgroundColor: "#b3d9ff",
            top: 100,
            left: 100,
            overflowY: "scroll",
            padding: 10,
            display: "none",
        },
        header: "The Awesome Popup!",
        content: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo."
    };
    
    optionsDefaults = mergeDeep(defaults,optionsDefaults);

    function getTemplate(id, options) {
        options = mergeDeep(defaults,options);

        var div = document.createElement('div');
        div.className = options.className;
        div.id = id;
        
        var styles = optionsDefaults.styles;
        
        for (var i in styles) {
            if (typeof styles[i] === "number") {
                styles[i] = styles[i] + "px";
            }
            div.style[i] = styles[i];
        }

        var innerHTMLStr = "<h3 class='head'>" + options.header + "</h3>" +
            "<div class='content'>" + options.content + "</div>";
        div.innerHTML = innerHTMLStr;

        return div;
    }

    function removeTemplate(id) {
        var ele = popups[id];
        ele.parentNode.removeChild(ele);
        delete popups[id];
    }

    function checkPopup(id){
        var popup = popups[id];
        if (!popup) {
            throw new Error("Popup not found");
        }
        return popup;
    }
    
    this.add = function(id, options) {
        document.body.appendChild(getTemplate(id, options));
        if (popups[id]) {
            removeTemplate(id);
            console.warn("Popup was overriden!");
        }
        popups[id] = document.getElementById(id);
    };

    this.show = function(id) {
        var popup = checkPopup(id);
        popup.style.display = "block";
    };

    this.hide = function(id) {
        var popup = checkPopup(id);
        popup.style.display = "none";
    };

    this.destroy = function(id) {
        checkPopup(id);
        removeTemplate(id);
    };

};