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
        var indexes = []
        for (var index = 0; index < this.io.length; ++index) {
            if(this.io[index].mapableStackElements().length!=0){
                indexes.push(index);
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
        
        if(filter == ""){
            this.filteredequations = this.allequations;
        }else{
            for (var index = 0; index < this.allequations.length; ++index) {
                if(  this.allequations[index].name.toLowerCase().indexOf(this.filter) !== -1 || 
                     this.allequations[index].description.toLowerCase().indexOf(this.filter) !== -1 )
                    {
                        this.filteredequations.push(this.allequations[index]);
                    }
            }   
        }
        
        this.render();
    }
   
    this.render = function(){
        this.filteredequations.sort(function(a, b) {
            return b.distance() - a.distance() ;
        });
        var r = Mustache.render($('#EquationsTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;

        $('#EquationsPagination').easyPaginate({
            paginateElement: 'div',
            elementsPerPage: 4,
            hashPage: "EquationsPage",
        });
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
                        v = parseFloat((""+mappedto.value).replace(",","."));
                        v = mappedto.quantity.convertValue(v,this.io[i].equationio.quantity)
                    }
                    if(mappedto.constructor.name == "StackEquation"){
                        v = parseFloat((""+mappedto.resultValue()).replace(",","."));
                        v = mappedto.resultQuantity().convertValue(v,this.io[i].equationio.quantity);
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
    
    this.setMappedTo = function(key){
        if(key == "OUTPUT"){
            this.parentStackEquation.resultScaler = undefined;
        }
        this.mappedto = key;
        this.updateRender();
        this.parentStackEquation.updateRender();
        this.parentStackEquation.parentStack.updateRender(this.parentStackEquation.id);
    }
        
    this.render = function(){
        var r = Mustache.render($('#StackEquationIoTemplate').html(), this);
        return r;
    }   
    
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
    }
    
    this.autoMapStackElements = function(){
        var tmp =  this.mapableStackElements(); 
        if(tmp.length > 0 && this.mappedto == "UNMAPPED"){  
            this.mappedto = tmp[0].id;
        }
        if(tmp.length == 0 && ( this.mappedto != "UNMAPPED" && this.mappedto != "OUTPUT" )){
            this.mappedto = "UNMAPPED";
        }
    }
    
    this.autoMapStackElements();// on first load
    
}   

var Equations = new Equations();
