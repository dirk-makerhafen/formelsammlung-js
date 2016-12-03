function Equation(name,description,equationstring,io){
    this.name = name;
    this.description = description;
    this.equationstring = equationstring;
    this.io = io;
    
    for (var index = 0; index < this.io.length; ++index) {
        this.io[index].parentEquation = this;
    }
    
    this.cantranslate = function(){ 
        if (LANGUAGE == "EN" || this.translations == undefined || this.translations[LANGUAGE] == undefined){ return false; }else{ return true; } 
    }
    
    this.name_translation = function(){
        if(this.cantranslate()){return this.translations[LANGUAGE].name;}
        return this.name;
    }
    
    this.description_translation = function(){
        if(this.cantranslate()){return this.translations[LANGUAGE].description;}
        return this.description;
    }

    this.displayTranslateMe = function(){
        if(this.cantranslate() || LANGUAGE == "EN"){ return "None"; }
        return "";
    }    
    
    this.renderDescription = function(){
        return markdown.toHTML(this.description_translation());    
    }   
    
    this.getMappableIoIndexes = function(){
        var wouldmap = [] // prevent doublicate io mapping
        var indexes = []
        
        
        for (var index = 0; index < this.io.length; ++index) {
            var mse = this.io[index].mapableStackElements();
            if(mse.length > 0){
                for(var i =0;i<mse.length;i++){
                   if(wouldmap.indexOf(mse[i]) == -1){
                        if(!( SETTINGS["EquationsIgnoreMappedElements"] == true && mse[i].mappedto.length > 0)){  
                            wouldmap.push(mse[i]);
                            indexes.push(index);
                            break;    
                        }                        
                   }
                }
            }
        }
        return indexes;
    }
    
    this.outputName = function(){
        var matchindexes = this.getMappableIoIndexes();
        if((this.io.length - matchindexes.length) == 1){
            for(var i =0;i<this.io.length;++i){ // search unmatched io, aka output
                if(matchindexes.indexOf(i) == -1){
                    return this.io[i].quantity.name; 
                }
            }
        }
        return "";
    }   
       
    this.nrOfMappableIos = function(){
        return this.getMappableIoIndexes().length;
    }   
       
    this.distance = function(){
        return 100.0 /  this.io.length * this.nrOfMappableIos();            
    }    
    
    this.getIoBySymbol = function(symbol){
        for(var i =0;i<this.io.length;++i){ // search unmatched io, aka output
            if(this.io[i].symbol == symbol){
                return this.io[i];
            }
        }
        return undefined;
    }
    
    this.color = function(){
        if(this.outputName()!=""){
            return "green";            
        }else{
            return "gray";
        }
    }
    
    this.render = function(){
        var r = Mustache.render($('#EquationTemplate').html(), this);
        return r;
    }
}

function EquationIO(quantity,symbol,description){
    this.quantity = quantity;
    this.symbol = symbol;
    this.description = description;
    this.parentEquation = null; // set by parent on constructor
    this.equation = ""; // to be filled by code, but now filled by hand
    
    this.cantranslate = function(){ 
        if (LANGUAGE == "EN" || this.translations == undefined || this.translations[LANGUAGE] == undefined){ return false; }else{ return true; } 
    }
    
    this.description_translation = function(){
        if(this.cantranslate()){return this.translations[LANGUAGE].description;}
        return this.description;
    }

    this.displayTranslateMe = function(){
        if(this.cantranslate() || LANGUAGE == "EN"){ return "None"; }
        return "";
    } 
    
    // test if this io can be mapped to a stack element
    this.canMap = function(stackElement){
        if(stackElement.constructor.name == "StackQuantity"){
            if(stackElement.quantity.unit.equals(this.quantity.unit)){
                return true;
            }
        }
        
        if(stackElement.constructor.name == "StackEquation"){
            var q = stackElement.resultQuantity();
            if(q!=undefined){
                if(q.unit.equals(this.quantity.unit)){
                    return true;
                }
            }
        }
        
        if(stackElement.constructor.name == "StackMaterial"){
            var materialproperties =  stackElement.material.properties;
            for (var index1 = 0; index1 < materialproperties.length; ++index1) {
                if(materialproperties[index1].quantity.unit.equals(this.quantity.unit)){
                    return true;
                }   
            }
        }    
        
        return false;
    } 

    this.mapableStackElements = function(){
        var selectableStackElements = [];
        for (var index = 0; index < Stack.elements.length; ++index) {
            if (this.canMap(Stack.elements[index])){
                selectableStackElements.push(Stack.elements[index]);
            }
        }
        return selectableStackElements;
    }    
    
}

function Equations(){
    this.targetdiv = "EquationsList";
    this.allequations = [];
    this.filter = "";
    this.filteredequations = this.allequations;
    
    this.paginationPage = 1;
    this.paginationElementsPerPage = 10;
    
    
    this.loadMarkdown = function(markdown){
        extractValue = function(string,key){
            return string.split(key)[1].split("\n__")[0].trim();;
        }
        var parts = markdown.split("--------");
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("__Name__:") == -1){continue;}
            var parseableString = parts[partsIndex];

            var name = markdown_extractValue(parseableString,"__Name__:");
            var description = markdown_extractValue(parseableString,"__Description__:");
            
            var equation = parts[partsIndex].split("__Equation__:")[1].split("__IO__:")[0].trim();
            var ioparts = parts[partsIndex].split("__IO__:")[1].split("--------")[0].trim().split("* __");
            var ios = []
            for(var i=0;i<ioparts.length;++i){
                if(ioparts[i].indexOf("__ [ _") == -1){continue;}
                var letter = ioparts[i].split("__")[0].trim();
                var quantity =  ioparts[i].split("[ _")[1].split("_ ]")[0].trim();
                var iodescription=  ioparts[i].split("_ ]")[1].split("\n")[1].trim();
                
                var q = Quantities.get(quantity);
                if (q == undefined){
                    alert("Quantity " + quantity + " not found");
                    continue;
                }
                var io = new EquationIO(q,letter,iodescription)
                io.equation = ioparts[i].split("_ ]")[1].split("|")[1].split("\n")[0].trim();
                ios.push(io);
            }
            this.add(new Equation(name,description,equation,ios));
        }
    }    
    
    this.loadTranslationMarkdown = function(language,markdown){
        extractValue = function(string,key){
            return string.split(key)[1].split("\n__")[0].trim();;
        }
        var parts = markdown.split("--------");
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("__Name__:") == -1){continue;}
            var parseableString = parts[partsIndex];

            var parentname = markdown_extractValue(parseableString,"__ParentName__:");
            var name = markdown_extractValue(parseableString,"__Name__:");
            var description = markdown_extractValue(parseableString,"__Description__:");
            
            var e = this.get(parentname);            
            if(e.translations == undefined){ e.translations = {} }
            if(e.translations[language] == undefined){ e.translations[language] = {} }
            
            e.translations[language].name = name
            e.translations[language].description = description            
            var ioparts = parts[partsIndex].split("__IO__:")[1].split("--------")[0].trim().split("* __");
            var ios = []
            for(var i=0;i<ioparts.length;++i){
                if(ioparts[i].indexOf("__") == -1){continue;}
                var letter = ioparts[i].split("__")[0].trim();
                var iodescription=  ioparts[i].split("__")[1].split("\n")[1].trim();
                var io = e.getIoBySymbol(letter)
                if(io.translations == undefined){ io.translations = {} }
                if(io.translations[language] == undefined){ io.translations[language] = {} }
                io.translations[language].description = iodescription            
            }
        }
    }  
    
    this.add = function(equation){
        this.allequations.push(equation);
    }
    
    this.get = function(name){
        for (var index = 0; index < this.allequations.length; ++index) {
            if(this.allequations[index].name == name){
                return this.allequations[index];
            }
        }
        return null;
    }
    
    this.setFilter = function(filter){
        this.filter = filter;
        this.filteredequations = []
        this.paginationPage = 1;        
        if(filter == ""){
            this.filteredequations = this.allequations;
        }else{
        

        
            this.match = function(index,matched){
                if(matched==true){
                    if(this.filteredequations.indexOf(this.allequations[index]) == -1 ){
                        this.filteredequations.push(this.allequations[index]);
                    }
                }
            }
        
            // TODO: Better, faster, non stupid.
            var keys = ["name_translation","description_translation"]
            if(LANGUAGE != "EN"){
                keys.push("name");
                keys.push("description");
            }
            for (var matchindex = 0; matchindex < keys.length; ++matchindex) {  
                for (var index = 0; index < this.allequations.length; ++index) {               
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allequations[index][keys[matchindex]]+""}else{var mstr = this.allequations[index][keys[matchindex]]()+""}
                    this.match(index, mstr == this.filter  );}
                for (var index = 0; index < this.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allequations[index][keys[matchindex]]+""}else{var mstr = this.allequations[index][keys[matchindex]]()+""}
                    this.match(index, mstr.toLowerCase() == this.filter.toLowerCase()  );}
                for (var index = 0; index < this.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allequations[index][keys[matchindex]]+""}else{var mstr = this.allequations[index][keys[matchindex]]()+""}
                    this.match(index, mstr.indexOf(this.filter) ==  0);}
                for (var index = 0; index < this.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allequations[index][keys[matchindex]]+""}else{var mstr = this.allequations[index][keys[matchindex]]()+""}
                    this.match(index, mstr.toLowerCase().indexOf(this.filter.toLowerCase()) ==  0);}
                for (var index = 0; index < this.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allequations[index][keys[matchindex]]+""}else{var mstr = this.allequations[index][keys[matchindex]]()+""}
                    this.match(index, mstr.indexOf(this.filter) >  0);}
                for (var index = 0; index < this.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = this.allequations[index][keys[matchindex]]+""}else{var mstr = this.allequations[index][keys[matchindex]]()+""}
                    this.match(index, mstr.toLowerCase().indexOf(this.filter.toLowerCase()) >  0);}
            }
        }
        
        this.render();
    }

    this.filteredEquationsPagination = function(){
        var index = this.paginationElementsPerPage*(this.paginationPage-1);
        return this.filteredequations.slice(index,index+ this.paginationElementsPerPage);
    }
    
    this.paginationMaxPages = function(){
        return math.ceil(this.filteredequations.length / this.paginationElementsPerPage); 
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
            r.push({"nr":i,"selected":selected});
        }
        return r;
    }
    
    this.init = function(){
        this.allequations.sort(function(a, b) {
            if( a.name_translation() >  b.name_translation()){ return  1;};
            if( a.name_translation() <  b.name_translation()){ return -1;};
            if( a.name_translation() == b.name_translation()){ return  0;};
        });
        this.filteredequations = this.allequations;
    }
    
    this.render = function(){
        this.filteredequations.sort(function(a, b) {
            var d = b.distance() - a.distance();
            if(d==200){
                if( a.name_translation().toLowerCase() >  b.name_translation().toLowerCase()){ return  1;};
                if( a.name_translation().toLowerCase() <  b.name_translation().toLowerCase()){ return -1;};
                if( a.name_translation().toLowerCase() == b.name_translation().toLowerCase()){ return  0;};
            }
            return d;
        });
        var r = Mustache.render($('#EquationsTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;
        
    }
}

function StackEquation(stack, equation){

    this.parentStack = stack;
    this.equation = equation;
    this.id = "StackEquation_" + getUniqNumber();

    this.name = "result " + getUniqNumber();
    this.showConverter = "None";

    this.resultScaler = undefined;
    
    this.io = []
    for (var index = 0; index < this.equation.io.length; ++index) {
        this.io.push(new StackEquationIO(this,this.equation.io[index]));
    }
       
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
       
    this.setName = function(name){
        this.name = name;
        this.parentStack.updateRender(this.id);
    }
    
    this.getIO = function(elementId){
        return this.io[this.getIndexOfIO(elementId)];
    }
    
    this.getIndexOfIO = function(elementId){
        for (var index = 0; index < this.io.length; ++index) {
            if(this.io[index].id == elementId){
                return index;
            }
        }
        return -1;
    }
            
    this.getIndexOfIOByMapping = function(mappedtostring){
        var outputIos = [];
        for (var index = 0; index < this.io.length; ++index) {
            if(this.io[index].mappedto == mappedtostring){
                outputIos.push(index);
            }
        }
        return outputIos;
    }
    
    this._canCalc = function(){
        if (this.getIndexOfIOByMapping("UNMAPPED").length == 0 && this.getIndexOfIOByMapping("OUTPUT").length == 1){
            return true;
        }
        return false;
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
        
    this.scaleUp = function(){
        if(this.resultScaler == undefined){
            this.resultScaler =  this.resultQuantity().scaleup;
        }else{
            if(this.resultScaler.scaleup != undefined){
                this.resultScaler = this.resultScaler.scaleup;
            }
        }
        this.updateRender();
    }
    
    this.displayScaleUp = function(){
        var rq = this.resultQuantity();
        if (rq == undefined || rq.scaleup==undefined){
            return "None";
        }
        
        return "";
    }  
    
    this.scaleDown = function(){
        if(this.resultScaler == undefined){
            this.resultScaler = this.resultQuantity().scaledown;
        }else{
            if(this.resultScaler.scaledown != undefined){
                this.resultScaler = this.resultScaler.scaledown;
             }
        }
        this.updateRender();
    }
    
    this.displayScaleDown = function(){
        var rq = this.resultQuantity();
        if (rq == undefined ||  rq.scaledown==undefined){
            return "None";
        }
        return "";
    } 
    
    this.displayShowConvert = function(){
        var rq = this.resultQuantity();
        if(rq == undefined || rq.converter.length==0){
            return "None"
        }
        return "";
    }   
       
    this.resultValue = function(){
        if(this._canCalc() == true){
            var valuemapping = [];
            var valuekeys = []
            for(var i=0;i<this.io.length;i++){
                if(this.io[i].mappedto == "OUTPUT"){continue;}
                var mappedto = Stack.get(this.io[i].mappedto)
                
                if (mappedto != undefined){
                    valuekeys.push(this.io[i].equationio.symbol)
                    
                    var v="";
                    if(mappedto.constructor.name == "StackQuantity"){
                        v = parseFloat((""+mappedto.value));
                        v = mappedto.quantity.convertValue(v,this.io[i].equationio.quantity)
                    }
                    if(mappedto.constructor.name == "StackEquation"){
                        v = parseFloat((""+mappedto.resultValue()));
                        if(!isNaN(v)){
                            v = mappedto.resultQuantity().convertValue(v,this.io[i].equationio.quantity);
                        }
                    }
                    if(mappedto.constructor.name == "StackMaterial"){
                        v=mappedto.material.getPropertyByQuantity(this.io[i].equationio.quantity).value;
                    }
                    
                    
                    valuemapping[this.io[i].equationio.symbol] = v;
                }else{
                    this.io[i].mappedto = "UNMAPPED"; // mappedto no longer exists
                }
            }
            valuekeys = valuekeys.sort(function(a, b){
                return b.length - a.length;
            });
            
            var outputIoIndex = this.getIndexOfIOByMapping("OUTPUT")[0]
            var outPutEquation = this.io[outputIoIndex].equationio.equation;                     
            
            for(var i=0;i<valuekeys.length;i++){
                outPutEquation = outPutEquation.replace(new RegExp(valuekeys[i], 'g'), valuemapping[valuekeys[i]]);
            }
            eval("var value = " + outPutEquation);
            
            return this.io[this.getIndexOfIOByMapping("OUTPUT")[0]].equationio.quantity.convertValue(value,this.resultQuantity());
        }
        return "Na";    
    }
    
    this.resultQuantity = function(){
        if(this._canCalc() == true){
            if(this.resultScaler != undefined){
                return this.resultScaler;
            }
            var rq = this.io[ this.getIndexOfIOByMapping("OUTPUT")[0]].equationio.quantity;
            return rq;
        }
        return undefined;
    }
    
    this.render = function(){
        for(var i=0;i<this.io.length;i++){
            this.io[i].autoMapStackElements(); 
        }
        if (this.getIndexOfIOByMapping("UNMAPPED").length == 1 && this.getIndexOfIOByMapping("OUTPUT").length == 0){
            this.io[this.getIndexOfIOByMapping("UNMAPPED")[0]].setMappedTo("OUTPUT");
        } 
        var r = Mustache.render($('#StackEquationTemplate').html(), this);
        return r;
    }   
        
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
    }
     
    this.renderConverter = function(){
        var str = "";
        var rq = this.resultQuantity()
        if (rq != undefined){
            
            for(var i =0;i<rq.converter.length;++i){ 
                str += Mustache.render($('#StackQuantityConverterTemplate').html(),{
                    value : math.unit(this.resultValue(),rq.unit.toString()).toNumber(rq.converter[i].unit.toString()),
                    quantity : rq.converter[i],
                }
                );
            }
        }
        return str;
    }
    
    this.updateRenderConverter = function(){
        document.getElementById("Converter_"+this.id).innerHTML = this.renderConverter();
    }
}

function StackEquationIO(stackequation,equationio){
    this.parentStackEquation = stackequation;
    this.equationio = equationio;
    this.id = "StackEquationIO" + getUniqNumber();

    this.mappedto = "UNMAPPED"; // "OUTPUT" , "UNMAPPED"
    
    this.selectableDivClass = function(){
        if(this.parentStackEquation._canCalc()){
            if(this.mappedto == "OUTPUT"){
                return "StackEquationIoGreen";
            }
        }else{
            if(this.mappedto == "UNMAPPED" || this.mappedto == "OUTPUT"){
                 return "StackEquationIoWarn";
            }
        }
        return "";
    }
    
    this.mapableStackElements = function(){
        var selectableStackElements = [];
        
        var myindex = Stack.getIndexOfElement(this.parentStackEquation.id);        
        if(myindex == -1){
            myindex =  Stack.elements.length; // item does not exist on stack yet
        }    
        for (var index = myindex - 1 ; index >= 0 ; --index) {
            var element = Stack.elements[index];
            if(element.id == this.mappedto){
                element.selected = "selected";
            }else{
                element.selected = "";
            }
            
            if (this.equationio.canMap(element)){
                selectableStackElements.push(element);
            }
        }

        return selectableStackElements;
    }
    
    this.setMappedTo = function(key,norender=false){
        var e = Stack.get(this.mappedto)
        if (e!=undefined){
            e.removeMappedTo(this);
        }

        if(key == "OUTPUT"){
            this.parentStackEquation.resultScaler = undefined;
        }
        this.mappedto = key;
        var e = Stack.get(this.mappedto)
        if (e!=undefined){
            e.addMappedTo(this);
        }
        if(norender==false){
            this.updateRender();
            this.parentStackEquation.updateRender();
            this.parentStackEquation.parentStack.updateRender(this.parentStackEquation.id);
        }
    }
        
    this.render = function(){
        var r = Mustache.render($('#StackEquationIoTemplate').html(), this);
        return r;
    }   
    
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
    }
    
    this.autoMapStackElements = function(){
        var mapableElements =  this.mapableStackElements(); 
        if(mapableElements.length > 0 && this.mappedto == "UNMAPPED"){  
            for(var i=0;i < mapableElements.length;i++){   // for each mappable element
                var mapableElement = mapableElements[i];
                var isAlreadyMappedToParentStackEquation = false;
                for(var j=0;j < mapableElement.mappedto.length;j++){ // for each equationIO this element already maps to 
                    if(mapableElement.mappedto[j].parentStackEquation == this.parentStackEquation){
                        isAlreadyMappedToParentStackEquation = true;
                        break;
                    }
                }
                if(isAlreadyMappedToParentStackEquation == false){
                    this.setMappedTo(mapableElement.id,true)
                    break;
                }
            }
        }
    }
    
    this.autoMapStackElements();// on first load
    
}   

var Equations = new Equations();
