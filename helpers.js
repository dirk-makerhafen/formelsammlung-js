var globalCounter = 0; // for uniq variable names
getUniqNumber = function (){
    globalCounter++;
    return globalCounter;
}


getStackName = function(prefix){
    var highestNumber = 0;
    for(var i=0;i<CurrentStack.elements.length;i++){
        if(CurrentStack.elements[i].name.indexOf(prefix) == 0){
            var nr = parseInt(CurrentStack.elements[i].name.substring(prefix.length));
            if(nr>highestNumber){
                highestNumber = nr;
            }
        }
    }
    return prefix + (highestNumber+1);
    
}

mathjaxCache = function(){
    this.ids = [];
    this.cache = []
    
    this.renderIds = [];
    
    this.render = function(){
        MathJax.Hub.Queue(function () { mathjaxCache._prepare(); });
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,"renderCache"]);
        MathJax.Hub.Queue(function () { mathjaxCache._applyCache(); });
    };
    
    this._prepare = function(){
        this.renderIds = this.ids;
        this.ids = [];
    }
    
    this._applyCache = function(){
        var rc =  document.getElementById("renderCache");
        for(var i=0;i<this.renderIds.length;++i){
            try{
                var c = $("#cache_" + this.renderIds[i])[0];
                var elements = $("." + this.renderIds[i]);
                elements.replaceWith(c);
                this.cache[this.renderIds[i]] = c;
            }catch(e){}
        } 
        this.renderIds = [];
    }
    
    this.add = function(targetId,content){
        if(this.cache[targetId] != undefined){
            return '<div class="'+targetId+'" ></div>';
        }
        var div = document.createElement('div');
        div.id = "cache_" + targetId;
        div.innerHTML = '$$'+content+'$$';
        document.getElementById("renderCache").appendChild(div);
        this.ids.push(targetId);
        return '<div class="'+targetId+'" ></div>';
    }

}

var mathjaxCache = new mathjaxCache();

flashMappedInputHelper = function(divname){
    var items = $("."+divname);
    for(var i =0;i<items.length;++i){
        if(items[i].selected == true){
            items[i].parentElement.style.backgroundColor = "lightgray";
            var tf = '$(".'+divname+'")['+i+'].parentElement.style.backgroundColor = "";';
            setTimeout( tf, 100);
        }
    }
}


markdown_extractValue = function(string,key){
    return string.split(key)[1].split("\n__")[0].trim();
}


markdown_extractValues = function(string,key){
    var valuesString = markdown_extractValue(string,key); 
    var values = undefined;
    if(valuesString.indexOf(",")!=-1){
        values = valuesString.split(",")
    }else{
        values = valuesString.split("\n")
    }
    
    for(var i = 0;i<values.length;++i){ 
        values[i] = values[i].trim();
    };
    while(values.indexOf("")!=-1){
        values.splice(values.indexOf(""), 1);
    }

    return values;
} 


stripArray = function(valuesString){
    var values = undefined;
    if(valuesString.indexOf(",")!=-1){
        values = valuesString.split(",")
    }else{
        values = valuesString.split("\n")
    }
    for(var i = 0;i<values.length;++i){ 
        values[i] = values[i].trim();
    };
    return values;
}


selectOutputRendering = function(node,number){
    var x=$(node.parentNode.parentNode).children(); 
    for(var i=0;i<3;i++ ){
        if(i==number){continue;}
        x.eq(i).hide(150);
    }
    x.eq(number).show(150);
     
    var y=$(node.parentNode).children(); 
    for(var i=0;i<3;i++ ){
        if(i==number){
            y.eq(i).css("font-weight","bold");
        }else{
            y.eq(i).css("font-weight","inherit");
        }
    }
}

textAreaAdjust = function(target) {
    target.style.height = "1px";
    target.style.height = (12+target.scrollHeight)+"px";
}


create_link = function(type,target){
    var host = location.hostname;
    if(location.port != ""){
        host += ":" + location.port;
    }
    url =  location.protocol + '//' + host + location.pathname + "?link=" + type + ":" + encodeURIComponent(target);
    jQuery("#shareLinkModalURL")[0].value = url;
}


getUrlParams = function(){
    var urlParams;
    (window.onpopstate = function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);
        urlParams = {};
        while (match = search.exec(query))
           urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams;
}


var currentElement = undefined;
myconfirm = function(element,callback){
    if(currentElement != undefined){
        $(currentElement[0]).show(250);
        $(currentElement[0]).next().remove(0);            
    }
    currentElement = [element,callback];
    $(element).hide();
    var node = document.createElement("div"); 
    node.style.textAlign = "center";
    node.style.display = "none";
    node.innerHTML = '<div class="col-md-6" style=\'padding: 0px;\'><a onclick="myconfirmno();" >no!</a></div> <div class="col-md-6"   style=\'padding: 0px\'><a onclick="myconfirmyes();">yes</a></div>';
    $(element).parent().append(node);
    $(node).show(250);
}

myconfirmno = function(id){
    $(currentElement[0]).show(250);
    $(currentElement[0]).next().remove(0);
    currentElement = undefined;
}

myconfirmyes = function(id){
    currentElement[1]();
    $(currentElement[0]).show();
    currentElement = undefined;
}
