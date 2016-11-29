function Quantity(name,description,unit){
    this.name = name;
    this.aliasnames = [];

    this.shortname = "";
    this.aliasshortnames = [];
    
    this.description = description;
    if(unit == undefined){
        alter("undefined unit in Quantity " + name);
    }
    this.unit = unit;
    
    this.scaleup = undefined;
    this.scaledown = undefined;
    this.convertto = [];
  
    this.converter = [];
    
    this.cantranslate = function(){ 
        if (LANGUAGE == "EN" || this.translations == undefined || this.translations[LANGUAGE] == undefined){ return false; }else{ return true; } 
    }
    
    this.name_translation = function(){
        if(this.cantranslate()){return this.translations[LANGUAGE].name;}
        return this.name;
    }
    
    this.aliasnames_translation = function(){
        if(this.cantranslate()){ return this.translations[LANGUAGE].aliasnames;}
        return this.aliasnames;
    }
    
    this.shortname_translation = function(){
        if(this.cantranslate()){ return this.translations[LANGUAGE].shortname;}
        return this.shortname;
    }
    
    this.aliasshortnames_translation = function(){
        if(this.cantranslate()){ return this.translations[LANGUAGE].aliasshortnames;}
        return this.aliasshortnames;
    }
    
    this.description_translation = function(){
        if(this.cantranslate()){ return this.translations[LANGUAGE].description;}
        return this.description;
    }

    this.displayTranslateMe = function(){
        if(this.cantranslate() || LANGUAGE == "EN"){ return "None"; }
        return "";
    }    
    
    // scale value from this. to TargetQuantity
    this.convertValue = function(value,TargetQuantity){
        return math.unit(value,this.unit.toString()).toNumber(TargetQuantity.unit.toString());
    }
    
    //after all quantity/equations are loaded from markdown, call this to init 
    this.init = function(){
        for(var i =0;i<this.convertto.length;++i){ 
            var q = Quantities.get(this.convertto[i]);
            if(q!=undefined){
                if(this.converter.indexOf(q)==-1){
                    this.converter.push(q);
                }
            } 
        }
        this.scaleup = Quantities.get(this.scaleup);
        this.scaledown = Quantities.get(this.scaledown);
    }
    
    this.renderDescription = function(){
        return markdown.toHTML(this.description_translation());    
    }
    
    this.render = function(){
        var r = Mustache.render($('#QuantityTemplate').html(),this);
        return r;
    }
}

function Quantities(){

    this.targetdiv = "QuantitiesList";
    this.allquantities = [];
    this.filter = "";
    this.filteredquantities = this.allquantities;
    
    this.loadMarkdown = function(markdownId){
        var oFrame = document.getElementById(markdownId);
        try {
            var parts = oFrame.contentWindow.document.body.childNodes[0].innerHTML.split("-------------");
        }catch(err){return;}    
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("|---|---|---|---|---|---|") == -1){continue;}
            parseableString = parts[partsIndex];
            
            data = parseableString.split("|---|")[0].split("|")
            names = stripArray(data[1]);
            shortnames = stripArray(data[2]);
            unitstring = data[3].trim();
            description = parseableString.split("|---|---|---|---|---|---|")[1].split("-------------")[0];
            
            if(isNaN(unitstring.split(" ")[0])){
                unit = math.unit(unitstring);
            }else{
                math.createUnit(shortnames[0],unitstring)
                console.log("created unit '" + shortnames[0] + "' from '" + unitstring + "'");
                unit = math.unit(shortnames[0]);
            }
             
            q = new Quantity(names.splice(0, 1)[0],description,unit);
            
            q.aliasnames = names;
            q.shortname = shortnames.splice(0, 1)[0];            
            q.aliasshortnames = shortnames;
            q.scaledown = data[4].trim();
            q.scaleup = data[5].trim();
            q.convertto = stripArray(data[6]);

            Quantities.add( q );

        }
    }  
    
    this.loadTranslationMarkdown = function(markdownId){
        var language = markdownId.split("_")[1].trim();
        var oFrame = document.getElementById(markdownId);
        try{
            var parts = oFrame.contentWindow.document.body.childNodes[0].innerHTML.split("---------");
        }catch(err){
            return;
        }    
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("|---|---|---|---|") == -1){continue;}
            parseableString = parts[partsIndex];
            data = parseableString.split("|---|")[0].split("|")
            
            parentname =  stripArray(data[1]);
            names = stripArray(data[2]);
            shortnames = stripArray(data[3]);
            description = parseableString.split("|---|---|---|---|")[1].split("---------")[0];
            var q=this.get(parentname) 
            if(q.translations == undefined){ q.translations = {} }
            if(q.translations[language] == undefined){ q.translations[language] = {} }
            
            q.translations[language].name = names.splice(0, 1)[0]
            q.translations[language].aliasnames = names;
            q.translations[language].shortname = shortnames.splice(0, 1)[0]
            q.translations[language].aliasshortnames = shortnames;
            q.translations[language].description = description
        }
    }  
    

    this.add = function(quantity){
        this.allquantities.push(quantity);
    };
    
    this.get = function(name){
        for (var index = 0; index < this.allquantities.length; ++index) {
            if(this.allquantities[index].name == name){
                return this.allquantities[index];
            }
        }
        return undefined;
    }
    
    this.setFilter = function(filter){
        this.filter = filter;
        this.filteredquantities = []
        
        this.match = function(index,matched){
            if(matched==true){
                if(this.filteredquantities.indexOf(this.allquantities[index]) == -1 ){
                    this.filteredquantities.push(this.allquantities[index]);
                }
            }
        }
        // TODO: Better, faster, non stupid.
        var keys = ["unit","shortname_translation","name_translation","description_translation"]
        if(LANGUAGE != "EN"){
            keys.push("shortname");
            keys.push("name");
            keys.push("description");
        }
        for (var matchindex = 0; matchindex < keys.length; ++matchindex) {  
            for (var index = 0; index < this.allquantities.length; ++index) {               
                if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                this.match(index, mstr == this.filter  );}
            for (var index = 0; index < this.allquantities.length; ++index) {            
                if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                this.match(index, mstr.toLowerCase() == this.filter  );}
            for (var index = 0; index < this.allquantities.length; ++index) {            
                if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                this.match(index, mstr.indexOf(this.filter) ==  0);}
            for (var index = 0; index < this.allquantities.length; ++index) {            
                if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                this.match(index, mstr.toLowerCase().indexOf(this.filter) ==  0);}
            for (var index = 0; index < this.allquantities.length; ++index) {            
                if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                this.match(index, mstr.indexOf(this.filter) >  0);}
            for (var index = 0; index < this.allquantities.length; ++index) {            
                if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                this.match(index, mstr.toLowerCase().indexOf(this.filter) >  0);}
        }
        
        this.render();
    }
    
    this.init = function(){
        for (var index = 0; index < this.allquantities.length; ++index) {
            this.allquantities[index].init();
        }
    }
    
    this.render = function(){
        var r = Mustache.render($('#QuantitiesTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;
        $('#QuantitiesPagination').easyPaginate({
            paginateElement: 'div',
            elementsPerPage: 4,
            hashPage: "QuantitiesPage",
        });
    }
}

function StackQuantity(stack,quantity){
    this.parentStack = stack;
    this.quantity = quantity;    
    this.id = "StackQuantity_" + getUniqNumber();
    
    this.value = 1;
    
    this.name = "variable " + getUniqNumber();
    this.showConverter = "None";
    
    this.toggleShowConverter = function(){
        if(this.showConverter == "None"){
            this.showConverter = "";
            jQuery("#Converter_"+this.id).toggle('show');
        }else{
            this.showConverter = "None";
            jQuery("#Converter_"+this.id).toggle('show');
        }
    }
    
    this.setValue = function(value){
        this.value = value;
        this.updateRenderConverter();
        this.parentStack.updateRender(this.id);
    }
    
    this.setName = function(name){
        this.name = name;
        this.parentStack.updateRender(this.id);
    }
    
    this.scaleUp = function(){
        if(this.quantity.scaleup!=undefined){
            this.value =  this.quantity.convertValue(this.value,this.quantity.scaleup);            
            this.quantity = this.quantity.scaleup;         
        }
        this.updateRender();
    }
    
    this.displayScaleUp = function(){
        if(this.quantity.scaleup==undefined){
            return "None"
        }
        return "";
    }
    
    this.scaleDown = function(){
        if(this.quantity.scaledown!=undefined){
            this.value =  this.quantity.convertValue(this.value,this.quantity.scaledown);
            this.quantity = this.quantity.scaledown;
        }
        this.updateRender();
    }
    
    this.displayScaleDown = function(){
        if(this.quantity.scaledown==undefined){
            return "None"
        }
        return "";
    } 
    
    this.displayShowConvert = function(){
        if(this.quantity.converter.length==0){
            return "None"
        }
        return "";
    }   
    
    this.renderConverter = function(){
        var str = "";
        for(var i =0;i<this.quantity.converter.length;++i){ 
            str += Mustache.render($('#StackQuantityConverterTemplate').html(),{
                value : this.quantity.convertValue(this.value,this.quantity.converter[i]),
                quantity : this.quantity.converter[i],
            }
            );
        }
        return str;
    }
    
    this.render = function(){
        var r = Mustache.render($('#StackQuantityTemplate').html(),this);
        return r;
    }   
    
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
    }
    
    this.updateRenderConverter = function(){
        document.getElementById("Converter_"+this.id).innerHTML = this.renderConverter();
    }
    
}

var Quantities = new Quantities();
