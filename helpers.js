var globalCounter = 0; // for uniq variable names
function getUniqNumber(){
    globalCounter++;
    return globalCounter;
}

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