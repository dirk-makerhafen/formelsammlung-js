var globalCounter = 0; // for uniq variable names
function getUniqNumber(){
    globalCounter++;
    return globalCounter;
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
                var c = document.getElementById("cache_"+this.renderIds[i])
                document.getElementById(this.renderIds[i]).innerHTML = c.innerHTML;
                this.cache[this.renderIds[i]] = c.innerHTML;
                rc.removeChild(c);
            }catch(e){}
        } 
        this.renderIds = [];
    }
    
    this.add = function(targetId,content){
        if(this.cache[targetId] != undefined){
            return '<div id="'+targetId+'" >'+this.cache[targetId]+'</div>';
        }
        var div = document.createElement('div');
        div.id = "cache_" + targetId;
        div.innerHTML = '$$'+content+'$$';
        document.getElementById("renderCache").appendChild(div);
        this.ids.push(targetId);
        return '<div id="'+targetId+'" ></div>';
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