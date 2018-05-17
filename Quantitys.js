var Quantities = undefined;

function QuantityClass(name,description,unit){
    var self = this;
    self.constructorName = "Quantity";

    self.name = name;
    self.identifier =  self.name.replace(/\W+/g, "");
    self.aliasnames = [];

    self.shortname = "";
    self.aliasshortnames = [];
    
    self.description = description;
    if(unit == undefined){
        alter("undefined unit in Quantity " + name);
    }
    self.unit = unit;
    self.unitTex = math.parse(unit.toString()).toTex();
        
    self.scaleup = undefined;
    self.scaledown = undefined;
    self.convertto = [];
  
    self.converter = [];
    self.rawmarkdown = "";
    
    self.cantranslate = function(){ 
        if (LANGUAGE == "EN" || self.translations == undefined || self.translations[LANGUAGE] == undefined){ return false; }else{ return true; } 
    }
    
    self.name_translation = function(){
        if(self.cantranslate()){return self.translations[LANGUAGE].name;}
        return self.name;
    }
    
    self.aliasnames_translation = function(){
        if(self.cantranslate()){ return self.translations[LANGUAGE].aliasnames;}
        return self.aliasnames;
    }
    
    self.shortname_translation = function(){
        if(self.cantranslate()){ return self.translations[LANGUAGE].shortname;}
        return self.shortname;
    }
    
    self.aliasshortnames_translation = function(){
        if(self.cantranslate()){ return self.translations[LANGUAGE].aliasshortnames;}
        return self.aliasshortnames;
    }
    
    self.description_translation = function(){
        if(self.cantranslate()){ return self.translations[LANGUAGE].description;}
        return self.description;
    }
   
    // scale value from self. to TargetQuantity
    self.convertValue = function(value,TargetQuantity){
        if (isNaN(value)){
            return value;
        }
        var u1= self.unit.toString();
        var u2= TargetQuantity.unit.toString();
        if(u1==""){u1="m^0";}// todo better handing of stuff without unit
        if(u2==""){u2="m^0";}
        return math.unit(value,u1).toNumber(u2);
    }
    
    //after all quantity/equations are loaded from markdown, call this to init 
    self.init = function(){
        for(var i =0;i<self.convertto.length;++i){ 
            var q = Quantities.get(self.convertto[i]);
            if(q!=undefined){
                if(self.converter.indexOf(q)==-1){
                    self.converter.push(q);
                }
            } 
        }
        self.scaleup = Quantities.get(self.scaleup);
        self.scaledown = Quantities.get(self.scaledown);
    }
    
    self.renderUnitTex = function(){
        var targetId = "QuantityUnitTexTarget_" + self.identifier; 
        return mathjaxCache.add(targetId,self.unitTex);
    }
    
    self.renderDescription = function(){
        return markdown.toHTML(self.description_translation());    
    }
    
    self.render = function(){
        var r = Mustache.render($('#QuantityTemplate').html(),this);
        return r;
    }
}

function QuantitiesClass(){
    var self = this;
    self.targetdiv = "QuantitiesList";
    self.allquantities = [];
    self.filter = "";
    self.filteredquantities = self.allquantities;
        
    self.paginationPage = 1;
    
    self.paginationElementsPerPage = 7;
    
    self.loadMarkdown = function(markdown){
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
            var q = new QuantityClass(names.splice(0, 1)[0],description,unit);
            
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
    
    self.loadTranslationMarkdown = function(language,markdown){
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
            var q=self.get(parentname) 
            if(q.translations == undefined){ q.translations = {} }
            if(q.translations[language] == undefined){ q.translations[language] = {} }
            
            q.translations[language].name = names.splice(0, 1)[0]
            q.translations[language].aliasnames = names;
            q.translations[language].shortname = shortnames.splice(0, 1)[0]
            q.translations[language].aliasshortnames = shortnames;
            q.translations[language].description = description
        }
    }  
    
    self.filteredQuantitiesPagination = function(){
        var index = self.paginationElementsPerPage*(self.paginationPage-1);
        return self.filteredquantities.slice(index,index+ self.paginationElementsPerPage);
    }
    
    self.paginationMaxPages = function(){
        return math.ceil(self.filteredquantities.length / self.paginationElementsPerPage); 
    }
    
    self.setPaginationPage = function(newpage){
        self.paginationPage = newpage;
        self.render();
    }
    
    self.paginationPageLinks = function(){
        var r = []
        if(self.paginationMaxPages()==1){return [];};
        for(var i =1;i<self.paginationMaxPages()+1;i++){  
            if(i==self.paginationPage){ var selected = "active";}else{ var selected = ""};
            r.push({"nr":i,"selected":selected});}
        return r;
    }
    
    self.add = function(quantity){
        self.allquantities.push(quantity);
    };
    
    self.get = function(nameOrShortname){   
        if(nameOrShortname == ""){ return undefined;}
        for (var index = 0; index < self.allquantities.length; ++index) {
            if(self.allquantities[index].name == nameOrShortname || self.allquantities[index].shortname == nameOrShortname){
                return self.allquantities[index];
            }
        }
        return undefined;
    }
    
    self.setFilter = function(filter){
        self.filter = filter;
        self.filteredquantities = []
        self.paginationPage = 1;
        if(filter == ""){
            self.filteredquantities = self.allquantities;
        }else{
            self.match = function(index,matched){
                if(matched==true){
                    if(self.filteredquantities.indexOf(self.allquantities[index]) == -1 ){
                        self.filteredquantities.push(self.allquantities[index]);
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
                for (var index = 0; index < self.allquantities.length; ++index) {               
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allquantities[index][keys[matchindex]]+""}else{var mstr = self.allquantities[index][keys[matchindex]]()+""}
                    self.match(index, mstr == self.filter  );}
                for (var index = 0; index < self.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allquantities[index][keys[matchindex]]+""}else{var mstr = self.allquantities[index][keys[matchindex]]()+""}
                    self.match(index, mstr.toLowerCase() == self.filter.toLowerCase()  );}
                for (var index = 0; index < self.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allquantities[index][keys[matchindex]]+""}else{var mstr = self.allquantities[index][keys[matchindex]]()+""}
                    self.match(index, mstr.indexOf(self.filter) ==  0);}
                for (var index = 0; index < self.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allquantities[index][keys[matchindex]]+""}else{var mstr = self.allquantities[index][keys[matchindex]]()+""}
                    self.match(index, mstr.toLowerCase().indexOf(self.filter.toLowerCase()) ==  0);}
                for (var index = 0; index < self.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allquantities[index][keys[matchindex]]+""}else{var mstr = self.allquantities[index][keys[matchindex]]()+""}
                    self.match(index, mstr.indexOf(self.filter) >  0);}
                for (var index = 0; index < self.allquantities.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allquantities[index][keys[matchindex]]+""}else{var mstr = self.allquantities[index][keys[matchindex]]()+""}
                    self.match(index, mstr.toLowerCase().indexOf(self.filter.toLowerCase()) >  0);}
            }
        }
        self.render();
    }
    
    self.init = function(){
        for (var index = 0; index < self.allquantities.length; ++index) {
            self.allquantities[index].init();
        }
        self.allquantities.sort(function(a, b) {
            if( a.name_translation().toLowerCase() >  b.name_translation().toLowerCase()){ return  1;};
            if( a.name_translation().toLowerCase() <  b.name_translation().toLowerCase()){ return -1;};
            if( a.name_translation().toLowerCase() == b.name_translation().toLowerCase()){ return  0;};
        });
        self.filteredquantities = self.allquantities;
     
    }
    
    self.render = function(){
        var r = Mustache.render($('#QuantitiesTemplate').html(), this);
        document.getElementById(self.targetdiv).innerHTML = r;
        mathjaxCache.render();


    }
}

function StackQuantityClass(stack,quantity){
    var self = this;
    self.constructorName = "StackQuantity";
    self.parentStack = stack;
    self.quantity = quantity;    
    self.id = "SQ_" + getUniqNumber();
    
    self.value = 1;
    
    self.name =  getStackName("var ");
    self.showConverter = "None";
    
    self.mappedto = []
    
    self.addMappedTo = function(StackEquationIo){
        if(self.mappedto.indexOf(StackEquationIo) == -1){
            self.mappedto.push(StackEquationIo)
        }
    }
    
    self.removeMappedTo = function(StackEquationIo){
        var index = self.mappedto.indexOf(StackEquationIo);
        if(index != -1){
            self.mappedto.splice(index,1);
        }
    }
    
    self.dispose = function(){
        while (self.mappedto.length > 0){
            self.mappedto[0].setMappedTo("UNMAPPED",true);
        }
    }
    
    self.toggleShowConverter = function(){
        if(self.showConverter == "None"){
            self.showConverter = "";
            jQuery("#Converter_"+self.id).toggle('show');
        }else{
            self.showConverter = "None";
            jQuery("#Converter_"+self.id).toggle('show');
        }
    }
    
    self.setValue = function(value){
        self.value = parseFloat(value.replace(",","."));
        self.updateRenderConverter();
        self.parentStack.updateRender(self.id);
    }
    
    self.setName = function(name){
        self.name = name;
        self.parentStack.updateRender(self.id);
    }
    
    self.scaleUp = function(){
        if(self.quantity.scaleup!=undefined){
            self.value =  self.quantity.convertValue(self.value,self.quantity.scaleup);            
            self.quantity = self.quantity.scaleup;         
        }
        self.updateRender();
    }
    
    self.displayScaleUp = function(){
        if(self.quantity.scaleup==undefined){
            return "None"
        }
        return "";
    }
    
    self.scaleDown = function(){
        if(self.quantity.scaledown!=undefined){
            self.value =  self.quantity.convertValue(self.value,self.quantity.scaledown);
            self.quantity = self.quantity.scaledown;
        }
        self.updateRender();
    }
    
    self.displayScaleDown = function(){
        if(self.quantity.scaledown==undefined){
            return "None"
        }
        return "";
    } 
    
    self.displayShowConvert = function(){
        if(self.quantity.converter.length==0){
            return "None"
        }
        return "";
    }   
    
    self.MoveUpColor = function(){ 
        if (CurrentStack.elements[0].id == self.id){
            return "lightgray";
        }
        return "black";
    }
    
    self.MoveDownColor = function(){ 
        if (CurrentStack.elements[CurrentStack.elements.length-1].id == self.id){
            return "lightgray";
        }
        return "black";
    }        
    
    self.save = function(){
        var data = {};
        data["value"] = self.value;
        data["id"] = self.id;
        data["name"] = self.name;
        data["qn"] = self.quantity.name;
        return data;
    }
    
    self.load = function(data){
        self.value = data["value"];
        self.name = data["name"];
        self.id = data["id"];
    }
        
    self.renderConverter = function(){
        var str = "";
        for(var i =0;i<self.quantity.converter.length;++i){ 
            str += Mustache.render($('#StackQuantityConverterTemplate').html(),{
                value : self.quantity.convertValue(self.value,self.quantity.converter[i]),
                quantity : self.quantity.converter[i],
            }
            );
        }
        return str;
    }

    self.render = function(){
        var r = Mustache.render($('#StackQuantityTemplate').html(),this);
        return r;
    }   
    
    self.renderPrint = function(){  
        var equation = " $$"+self.name.replace(" ","_")+"=" + self.value + "\\qquad ( " + self.quantity.unitTex + " ) \\qquad "+self.quantity.name+" $$ ";;
        var r = Mustache.render($('#StackQuantityPrintTemplate').html(),{
            "equation" : equation,
        });
        return r;
    }
    
    self.updateRender = function(){
        $("#"+self.id).replaceWith(self.render());
        mathjaxCache.render();
    }
    
    self.updateRenderConverter = function(){
        document.getElementById("Converter_"+self.id).innerHTML = self.renderConverter();
    }
    
}

Quantities = new QuantitiesClass();
