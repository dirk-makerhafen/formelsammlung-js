function Quantity(name,description,unit){
    this.constructorName = "Quantity";

    this.name = name;
    this.identifier =  this.name.replace(/\W+/g, "");
    this.aliasnames = [];

    this.shortname = "";
    this.aliasshortnames = [];
    
    this.description = description;
    if(unit == undefined){
        alter("undefined unit in Quantity " + name);
    }
    this.unit = unit;
    this.unitTex = math.parse(unit.toString()).toTex();
        
    this.scaleup = undefined;
    this.scaledown = undefined;
    this.convertto = [];
  
    this.converter = [];
    this.rawmarkdown = "";
    
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
   
    // scale value from this. to TargetQuantity
    this.convertValue = function(value,TargetQuantity){
        if (isNaN(value)){
            return value;
        }
        var u1= this.unit.toString();
        var u2= TargetQuantity.unit.toString();
        if(u1==""){u1="m^0";}// todo better handing of stuff without unit
        if(u2==""){u2="m^0";}
        return math.unit(value,u1).toNumber(u2);
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
    
    this.renderUnitTex = function(){
        var targetId = "QuantityUnitTexTarget_" + this.identifier; 
        return mathjaxCache.add(targetId,this.unitTex);
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
        
    this.paginationPage = 1;
    
    this.paginationElementsPerPage = 7;
    
    this.loadMarkdown = function(markdown){
        try {
            var parts = markdown.split("-------------");
        }catch(err){return;}    
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("|---|---|---|---|---|---|") == -1){continue;}
            var parseableString = parts[partsIndex];
            
            var data = parseableString.split("|---|")[0].split("|")
            var names = stripArray(data[1]);
            var shortnames = stripArray(data[2]);
            var unitstring = data[3].trim();
            var description = parseableString.split("|---|---|---|---|---|---|")[1].split("-------------")[0];
            var unit = undefined;
            
            // find unit via shortname, if no unit can be found,create one with name=shortname and unitstring parsed by math.js
            
            try{
                unit = math.unit(shortnames[0]);
            }catch(e){}
            
            if(unit==undefined){
                //var s = unitstring.replace(new RegExp('\\^', 'g'), '**');
                var factor   = parseFloat(unitstring.split(" ")[0]);
                var unitpart = unitstring.substring(unitstring.indexOf(" "));
                
                if(isNaN(factor)){
                    if(unitstring==""){
                        unit = math.createUnit(shortnames[0]);
                    }else{
                        unit = math.unit(unitstring);
                    }
                }else{
                    math.createUnit(shortnames[0],factor + " " + unitpart);
                    console.log("created unit '" + shortnames[0] + "' from '" + unitstring + "'");
                    unit = math.unit(shortnames[0]);
                }
            }
            var q = new Quantity(names.splice(0, 1)[0],description,unit);
            
            q.aliasnames = names;
            q.shortname = shortnames.splice(0, 1)[0];            
            q.aliasshortnames = shortnames;
            q.scaledown = data[4].trim();
            q.scaleup = data[5].trim();
            q.convertto = stripArray(data[6]);
            q.rawmarkdown = parseableString;
            Quantities.add( q );

        }
    }  
    
    this.loadTranslationMarkdown = function(language,markdown){
        try{
            var parts = markdown.split("---------");
        }catch(err){
            return;
        }    
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("|---|---|---|---|") == -1){continue;}
            var parseableString = parts[partsIndex];
            var data = parseableString.split("|---|")[0].split("|")
            
            var parentname =  stripArray(data[1]);
            var names = stripArray(data[2]);
            var shortnames = stripArray(data[3]);
            var description = parseableString.split("|---|---|---|---|")[1].split("---------")[0];
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
    
    this.filteredQuantitiesPagination = function(){
        var index = this.paginationElementsPerPage*(this.paginationPage-1);
        return this.filteredquantities.slice(index,index+ this.paginationElementsPerPage);
    }
    
    this.paginationMaxPages = function(){
        return math.ceil(this.filteredquantities.length / this.paginationElementsPerPage); 
    }
    
    this.setPaginationPage = function(newpage){
        this.paginationPage = newpage;
        this.render();
    }
    
    this.paginationPageLinks = function(){
        var r = []
        if(this.paginationMaxPages()==1){return [];};
        for(var i =1;i<this.paginationMaxPages()+1;i++){  
            if(i==this.paginationPage){ var selected = "active";}else{ var selected = ""};
            r.push({"nr":i,"selected":selected});}
        return r;
    }
    
    this.add = function(quantity){
        this.allquantities.push(quantity);
    };
    
    this.get = function(nameOrShortname){   
        if(nameOrShortname == ""){ return undefined;}
        for (var index = 0; index < this.allquantities.length; ++index) {
            if(this.allquantities[index].name == nameOrShortname || this.allquantities[index].shortname == nameOrShortname){
                return this.allquantities[index];
            }
        }
        return undefined;
    }
    
    this.setFilter = function(filter){
        this.filter = filter;
        this.filteredquantities = []
        this.paginationPage = 1;
        if(filter == ""){
            this.filteredquantities = this.allquantities;
        }else{
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
                    this.match(index, mstr.toLowerCase() == this.filter.toLowerCase()  );}
                for (var index = 0; index < this.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                    this.match(index, mstr.indexOf(this.filter) ==  0);}
                for (var index = 0; index < this.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                    this.match(index, mstr.toLowerCase().indexOf(this.filter.toLowerCase()) ==  0);}
                for (var index = 0; index < this.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                    this.match(index, mstr.indexOf(this.filter) >  0);}
                for (var index = 0; index < this.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allquantities[index][keys[matchindex]]+""}else{var mstr = this.allquantities[index][keys[matchindex]]()+""}
                    this.match(index, mstr.toLowerCase().indexOf(this.filter.toLowerCase()) >  0);}
            }
        }
        this.render();
    }
    
    this.init = function(){
        for (var index = 0; index < this.allquantities.length; ++index) {
            this.allquantities[index].init();
        }
        this.allquantities.sort(function(a, b) {
            if( a.name_translation().toLowerCase() >  b.name_translation().toLowerCase()){ return  1;};
            if( a.name_translation().toLowerCase() <  b.name_translation().toLowerCase()){ return -1;};
            if( a.name_translation().toLowerCase() == b.name_translation().toLowerCase()){ return  0;};
        });
        this.filteredquantities = this.allquantities;
     
    }
    
    this.render = function(){
        var r = Mustache.render($('#QuantitiesTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;
        mathjaxCache.render();


    }
}

function StackQuantity(stack,quantity){
    this.constructorName = "StackQuantity";
    this.parentStack = stack;
    this.quantity = quantity;    
    this.id = "SQ_" + getUniqNumber();
    
    this.value = 1;
    
    this.name =  getStackName("var ");
    this.showConverter = "None";
    
    this.mappedto = []
    
    this.addMappedTo = function(StackEquationIo){
        if(this.mappedto.indexOf(StackEquationIo) == -1){
            this.mappedto.push(StackEquationIo)
        }
    }
    
    this.removeMappedTo = function(StackEquationIo){
        var index = this.mappedto.indexOf(StackEquationIo);
        if(index != -1){
            this.mappedto.splice(index,1);
        }
    }
    
    this.dispose = function(){
        while (this.mappedto.length > 0){
            this.mappedto[0].setMappedTo("UNMAPPED",true);
        }
    }
    
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
        this.value = parseFloat(value.replace(",","."));
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
    
    this.MoveUpColor = function(){ 
        if (CurrentStack.elements[0].id == this.id){
            return "lightgray";
        }
        return "black";
    }
    
    this.MoveDownColor = function(){ 
        if (CurrentStack.elements[CurrentStack.elements.length-1].id == this.id){
            return "lightgray";
        }
        return "black";
    }        
    
    this.save = function(){
        var data = {};
        data["value"] = this.value;
        data["id"] = this.id;
        data["name"] = this.name;
        data["qn"] = this.quantity.name;
        return data;
    }
    
    this.load = function(data){
        this.value = data["value"];
        this.name = data["name"];
        this.id = data["id"];
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
    
    this.renderPrint = function(){  
        var equation = " $$"+this.name.replace(" ","_")+"=" + this.value + "\\qquad ( " + this.quantity.unitTex + " ) \\qquad "+this.quantity.name+" $$ ";;
        var r = Mustache.render($('#StackQuantityPrintTemplate').html(),{
            "equation" : equation,
        });
        return r;
    }
    
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
        mathjaxCache.render();
    }
    
    this.updateRenderConverter = function(){
        document.getElementById("Converter_"+this.id).innerHTML = this.renderConverter();
    }
    
}

var Quantities = new Quantities();
