function Equation(){
    this.constructorName = "Equation";

    this.identifier = undefined;
    
    this.name = undefined;
    this.description = undefined;
    this.rawmarkdown = undefined;
        
    this.images = [];
    this.description = undefined;
    this.equationString = undefined;
    this.io = [];

    this.renderDescriptionCache = []

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
    
    this.solve = function(valuemappingin,solveto){ 
        valuemapping = [];
        for (var key in valuemappingin) {
            if ( valuemappingin.hasOwnProperty(key)){
                if(solveto==key){continue;}
                valuemapping[key] = valuemappingin[key];
            };
        }
        
        var outPutEquation = this.getIoBySymbol(solveto).equation;                  
        var result = "NaN";
        try {
            result = outPutEquation.eval(valuemapping);
        }catch(e){
            console.log("failed eval of" + this.getIoBySymbol(solveto).equationString) + "   " + e;
        }
        
        return result;
    }
    
    this.smokeTest = function(){
        var valuemapping = []
        for(var pass=0;pass<this.io.length;++pass){
            for(var i=0;i<this.io.length;++i){
                valuemapping[this.io[i].symbol] = Math.floor(Math.random() * 100) + 1;
            }
            var res = this.solve(valuemapping,this.io[pass].symbol); // calc
            valuemapping[this.io[pass].symbol] = res; // map first 
            
            for(var i=0;i<this.io.length;++i){
                try{
                    var rt = this.solve(valuemapping,this.io[i].symbol);
                    if(rt - valuemapping[this.io[i].symbol] > 0.00001){
                        console.log("failed smoketest of equation " + this.name + " for output " + this.io[i].symbol);
                        console.log(rt + " != " + valuemapping[this.io[i].symbol]);
                        console.log(valuemapping);
                    }
                }catch(e){
                    console.log("failed to test equation " + this.name);
                    console.log(e);
                    var rt = this.solve(valuemapping,this.io[i].symbol);
                }
            }
        }
    }
    
    this.loadMarkdown = function(markdownString){
        this.name = markdown_extractValue(markdownString,"__Name__:");
        this.identifier = this.name.replace(/\W+/g, "");
        this.description = markdown_extractValue(markdownString,"__Description__:");
        this.rawmarkdown = markdownString;
        
        this.images = [];
        var tmpparts = this.description.split("![Image of URI](")
        for(var i=1;i<tmpparts.length;++i){
            var url = tmpparts[i].split(")")[0].trim();
            if(url.indexOf("http")==0){ this.images.push(url); }
        }
        this.description = this.description.split("![Image of URI](")[0];  // description is before the images ! 
        
        this.equationString = markdownString.split("__Equation__:")[1].split("__IO__:")[0].trim();
        
        this.io = []
        var ioparts = markdownString.split("__IO__:")[1].split("--------")[0].trim().split("* __");        
        for(var i=0;i<ioparts.length;++i){
            if(ioparts[i].indexOf("__ [ _") == -1){continue;}
            var eio = new EquationIO();
            eio = eio.loadMarkdown(ioparts[i]);
            if(eio!=undefined){
                this.io.push(eio);
            }else{
                alert("failed to parse EquationIO markdown")
            }
        }
        
        for (var index = 0; index < this.io.length; ++index) {
            this.io[index].parentEquation = this;
        }
        return this;

    }

    this.loadTranslationMarkdown = function(language,markdownString){
        if(this.translations == undefined){ this.translations = {} }
        if(this.translations[language] == undefined){ this.translations[language] = {} }
        
        this.translations[language].name = markdown_extractValue(markdownString,"__Name__:");
        this.translations[language].description = markdown_extractValue(markdownString,"__Description__:");  

        var ioparts = markdownString.split("__IO__:")[1].split("--------")[0].trim().split("* __");
        for(var i=0;i<ioparts.length;++i){
            if(ioparts[i].indexOf("__") == -1){continue;}
            var symbol = ioparts[i].split("__")[0].trim();
            var io = this.getIoBySymbol(symbol);
            io.loadTranslationMarkdown(language,ioparts[i]);
        }
    }
    
    this.renderDescription = function(){
        var r = Mustache.render($('#EquationDescriptionTemplate').html(), {
            description  : markdown.toHTML(this.description_translation()),
            name : this.name,
            images : this.images,
            io : this.io,
            identifier : this.identifier,
        });
        
        return r;    
    }   
        
    this.render = function(){
        var r = Mustache.render($('#EquationTemplate').html(), this);
        return r;
    }

    
}

function EquationIO(){
    this.symbol = undefined;
    this.symbolTex = undefined;
    this.description = undefined;
    this.equation = undefined;
    this.equationTex = undefined;
    this.quantity = undefined;

    this.parentEquation = undefined; // set by parent on constructor
    
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
        if(stackElement.constructorName == "StackQuantity"){
            if(stackElement.quantity.unit.equals(this.quantity.unit)){
                return true;
            }
        }
        
        if(stackElement.constructorName == "StackEquation"){
            var q = stackElement.resultQuantity();
            if(q!=undefined){
                if(q.unit.equals(this.quantity.unit)){
                    return true;
                }
            }
        }
        
        if(stackElement.constructorName == "StackMaterial"){
            var materialproperties =  stackElement.material.properties;
            for (var index1 = 0; index1 < materialproperties.length; ++index1) {
                if(materialproperties[index1].quantity == this.quantity){
                    return true;
                }   
            }
        }    
        
        return false;
    } 

    this.mapableStackElements = function(){
        var selectableStackElements = [];
        for (var index = 0; index < CurrentStack.elements.length; ++index) {
            if (this.canMap(CurrentStack.elements[index])){
                selectableStackElements.push(CurrentStack.elements[index]);
            }
        }
        return selectableStackElements;
    }    
    
    this.loadMarkdown = function(markdownString){
        this.symbol = markdownString.split("__")[0].trim();
        this.description =  markdownString.split("_ ]")[1].split("\n")[1].trim();
        this.equationString = markdownString.split("_ ]")[1].split("|")[1].split("\n")[0].trim();
        try{
            this.equation = math.parse(this.symbol + " = " +this.equationString);
        }catch(e){
            console.log("failed to parse equation for io: " + this.equation + "  " + e);
        }
        this.equationTex =  this.equation.toTex();
        this.symbolTex = math.parse(this.symbol).toTex();
        var quantity =  markdownString.split("[ _")[1].split("_ ]")[0].trim();
        var q = Quantities.get(quantity);
        if (q == undefined){
            alert("Quantity " + quantity + " not found");
            return;
        }
        this.quantity = q;
        return this;
    }
    
    this.loadTranslationMarkdown = function(language,markdownString){
        if(this.translations == undefined){ this.translations = {} }
        if(this.translations[language] == undefined){ this.translations[language] = {} }
        this.translations[language].description = markdownString.split("__")[1].split("\n")[1].trim();            
    }    
    
    this.equationJavascript = function(){
        if(this.jsCache!=undefined){return this.jsCache;}
        var js = this.equation.compile().eval.toString();
        js = js.split(" = ")[2];
        var ionames = [];
        for(var i=0;i<this.parentEquation.io.length;++i){
            if(this.symbol != this.parentEquation.io[i].symbol){
                ionames.push(this.parentEquation.io[i].symbol);
            }
        }

        for(var i=0;i<ionames.length;i++){
            var ioname = ionames[i];
            var toreplace1 = '("'+ioname+'" in scope ? scope["'+ioname+'"] : new Unit(null, "'+ioname+'"))';
            var toreplace2 = '("'+ioname+'" in scope ? scope["'+ioname+'"] : undef("'+ioname+'"))';
            var toreplace3 = '("'+ioname+'" in scope ? scope["'+ioname+'"] : math["'+ioname+'"])';        
            while(js.indexOf('scope ? scope["'+ioname+'"]') != -1){
                js = js.replace(toreplace1,ioname);
                js = js.replace(toreplace2,ioname);
                js = js.replace(toreplace3,ioname);
            }
        }
        
        
        var varnames = [];
        var tmpparts = js.split('scope ? scope["');
        for(var i=1;i<tmpparts.length;i++){
            var varname = tmpparts[i].split('"')[0];
            if(ionames.indexOf(varname) == -1){
                varnames.push(varname);
            }
        }
        for(var i=0;i<varnames.length;i++){
            var varname = varnames[i];       
            var toreplace1 =  '("'+varname+'" in scope ? scope["'+varname+'"] : math["'+varname+'"])';
            js = js.replace(toreplace1,'math.'+varname+'');

        }
        js = this.symbol + " = function("+ionames+"){ return "+js;
        
        var comment_io = '';
        var comment_return = ''
        for(var i=0;i<this.parentEquation.io.length;++i){
            if(this.symbol != this.parentEquation.io[i].symbol){
                comment_io += this.parentEquation.io[i].symbol + " : " + this.parentEquation.io[i].quantity.name_translation() + " - "  + this.parentEquation.io[i].description_translation() + "\n";
            }else{
                comment_return += "return" + " : " + this.parentEquation.io[i].quantity.name_translation() + " - "  + this.parentEquation.io[i].description_translation() + "\n";
            }
        }
        var comment = "/*\n" + comment_io + "" + comment_return + "*/\n";
        js = comment + js;
        this.jsCache = js;
        return js;
    }
    
    this.renderSymbolTex = function(){
        var targetId = "symbolTexTarget_" + this.parentEquation.identifier + "_" + this.symbol; 
        return mathjaxCache.add(targetId,this.symbolTex);
    }
    
    this.renderEquationTex = function(){
        var targetId = "equationTexTarget_" + this.parentEquation.identifier + "_" + this.symbol; 
        return mathjaxCache.add(targetId,this.equationTex);
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
        var parts = markdown.split("--------");
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("__Name__:") == -1){continue;}
            var e = new Equation();
            e = e.loadMarkdown(parts[partsIndex]);
            if(e!=undefined){
                this.add(e);
            }else{
                alert("failed to parse Equation markdown");
            }
        }
    }    
    
    this.loadTranslationMarkdown = function(language,markdown){
        var parts = markdown.split("--------");
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("__Name__:") == -1){continue;}
            var parentname = markdown_extractValue(parts[partsIndex],"__ParentName__:");
            var e = this.get(parentname); 
            if(e!=undefined){
                e.loadTranslationMarkdown(language,parts[partsIndex]);
            }else{
                alert("failed to parse Equation Translation markdown");
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
        for (var index = 0; index < this.allequations.length; ++index) {               
            this.allequations[index].smokeTest();
        }
    }
    
    this.render = function(){
        this.filteredequations.sort(function(a, b) {
            var d = b.distance() - a.distance();
            if(d==0){
                if( a.name_translation().toLowerCase() >  b.name_translation().toLowerCase()){ return  1;};
                if( a.name_translation().toLowerCase() <  b.name_translation().toLowerCase()){ return -1;};
                if( a.name_translation().toLowerCase() == b.name_translation().toLowerCase()){ return  0;};
            }
            return d;
        });
        var r = Mustache.render($('#EquationsTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;
        mathjaxCache.render();
        
    }

}

function StackEquation(stack, equation){
    this.constructorName = "StackEquation";

    this.parentStack = stack;
    this.equation = equation;
    this.id = "SE_" + getUniqNumber();

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
            this.mappedto[0].setMappedTo("UNMAPPED",true); // unmap elements that map to this result
        }
        for(var index=0;index<this.io.length;++index){
            this.io[index].setMappedTo("UNMAPPED",true);
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

    this.canCalc = function(){
        if (this.getIndexOfIOByMapping("UNMAPPED").length == 0 && this.getIndexOfIOByMapping("OUTPUT").length == 1){
            return true;
        }
        return false;
    }    
  
    this.resultValue = function(){
        if(this.canCalc() == true){
            var valuemapping = [];
            var valuekeys = []
            for(var i=0;i<this.io.length;i++){
                if(this.io[i].mappedto == "OUTPUT"){continue;}
                var mappedto = CurrentStack.get(this.io[i].mappedto)
                
                if (mappedto != undefined){
                    valuekeys.push(this.io[i].equationio.symbol)
                    
                    var v="";
                    if(mappedto.constructorName == "StackQuantity"){
                        v = parseFloat((""+mappedto.value));
                        v = mappedto.quantity.convertValue(v,this.io[i].equationio.quantity)
                    }
                    if(mappedto.constructorName == "StackEquation"){
                        v = parseFloat((""+mappedto.resultValue()));
                        if(!isNaN(v)){
                            v = mappedto.resultQuantity().convertValue(v,this.io[i].equationio.quantity);
                        }
                    }
                    if(mappedto.constructorName == "StackMaterial"){
                        var x = mappedto.material.getPropertyByQuantity(this.io[i].equationio.quantity);
                        v=x.value;
                        if(!isNaN(v)){
                            v = x.quantity.convertValue(v,this.io[i].equationio.quantity);
                        }
                        
                    }

                    valuemapping[this.io[i].equationio.symbol] = v;
                }else{
                    this.io[i].mappedto = "UNMAPPED"; // mappedto no longer exists
                }
            }
            var outputEquationIO = this.io[this.getIndexOfIOByMapping("OUTPUT")[0]].equationio;
            
            var value = this.equation.solve(valuemapping,outputEquationIO.symbol)            
            
            return outputEquationIO.quantity.convertValue(value,this.resultQuantity());
        }
        return "Na";    
    }
 
    this.save = function(){
        var data = {};
        data["name"] = this.name;
        data["id"] = this.id;
        data["io"] = {};
        for (var index = 0; index < this.io.length; ++index) {
             data["io"][this.io[index].equationio.symbol] = this.io[index].save();
        }
        data["eqn"] = this.equation.name;
        return data;
    }
    
    this.load = function(data){
        this.name = data["name"];
        this.id = data["id"];
        for (var index = 0; index < this.io.length; ++index) {
            this.io[index].load(data["io"][this.io[index].equationio.symbol]);
        }
    }
 
    this.resultQuantity = function(){
        if(this.canCalc() == true){
            if(this.resultScaler != undefined){
                return this.resultScaler;
            }
            var rq = this.io[ this.getIndexOfIOByMapping("OUTPUT")[0]].equationio.quantity;
            return rq;
        }
        return undefined;
    }
    
    this.renderPrint = function(){  
        var resultSymbol =  this.io[this.getIndexOfIOByMapping("OUTPUT")[0]].equationio.symbol;
        var eqTex = this.equation.getIoBySymbol(resultSymbol).equationTex;

        var rq = this.resultQuantity()
        var equation = " $$"+ eqTex + " \\qquad ( " + rq.unitTex + " ) \\qquad "+rq.name+" $$ ";;
        var r = Mustache.render($('#StackEquationPrintTemplate').html(),{
            "equation" : equation,
        });
        return r;
    }
    
    this.renderDescription = function(){
        var r = Mustache.render($('#EquationDescriptionTemplate').html(), {
            description  : markdown.toHTML(this.equation.description_translation()),
            name : this.equation.name,
            images : this.equation.images,
            io : this.equation.io,
            identifier : "Stack"+this.identifier,
        });
        return r;    
    }  
    
    this.render = function(){
        if(this.getIndexOfIOByMapping("UNMAPPED").length > 0 || this.getIndexOfIOByMapping("OUTPUT").length != 1){
            var cntoutput = 0;
            for(var i=0;i<this.io.length;i++){
                this.io[i].autoMapStackElements(true); 
                this.io[i].autoMapStackElements(false); 
                if(this.io[i].mappedto == "OUTPUT" || this.io[i].mappedto == "UNMAPPED" ){
                    cntoutput += 1;
                }
                if(cntoutput == 0 && i==this.io.length-2){ // last io becomes output
                    break;
                }
            }
        }
        if (this.getIndexOfIOByMapping("UNMAPPED").length == 1 && this.getIndexOfIOByMapping("OUTPUT").length == 0){
            this.io[this.getIndexOfIOByMapping("UNMAPPED")[0]].setMappedTo("OUTPUT",true);
        } 
        var r = Mustache.render($('#StackEquationTemplate').html(), this);
        return r;
    }   
        
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
    }
     
    this.renderConverter = function(){
        var str = "";
        var rq = this.resultQuantity();
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
    this.id = "SEIO" + getUniqNumber();

    this.mappedto = "UNMAPPED"; // "OUTPUT" , "UNMAPPED"
    
    this.selectableDivClass = function(){
        if(this.parentStackEquation.canCalc()){
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
        
        var myindex = CurrentStack.getIndexOfElement(this.parentStackEquation.id);        
        if(myindex == -1){
            myindex =  CurrentStack.elements.length; // item does not exist on stack yet
        }    
        for (var index = myindex - 1 ; index >= 0 ; --index) {
            var element = CurrentStack.elements[index];
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
    
    this.setMappedTo = function(key,norender){
        var e = CurrentStack.get(this.mappedto)
        if (e!=undefined){
            e.removeMappedTo(this);
        }

        if(key == "OUTPUT"){
            this.parentStackEquation.resultScaler = undefined;
        }
        this.mappedto = key;
        var e = CurrentStack.get(this.mappedto)
        if (e!=undefined){
            e.addMappedTo(this);
        }
        if(norender==false){
            this.updateRender();
            this.parentStackEquation.updateRender();
            this.parentStackEquation.parentStack.updateRender(this.parentStackEquation.id);
        }
    }
    
    this.save = function(){
        var data = {};
        data["m"] = this.mappedto;
        return data;
    }
    
    this.load = function(data){
        this.setMappedTo(data["m"],true);
    }
    
    this.render = function(){
        r = Mustache.render($('#StackEquationIoTemplate').html(), this);
        return r;
    }   
    
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
    }
    
    this.autoMapStackElements = function(noDoubleMapping){
        if(this.mappedto == "UNMAPPED"){
            var mapableElements = this.mapableStackElements(); 
            if(mapableElements.length > 0){  
                for(var i=0;i < mapableElements.length;i++){   // for each mappable element
                    var mapableElement = mapableElements[i];    
                    if(noDoubleMapping == true && mapableElement.mappedto.length>0){ continue;}
                    var isAlreadyMappedToParentStackEquation = false;
                    for(var j=0;j < mapableElement.mappedto.length;j++){ // for each equationIO this element already maps to 
                        if(mapableElement.mappedto[j].parentStackEquation == this.parentStackEquation){
                            isAlreadyMappedToParentStackEquation = true;
                            break;
                        }
                    }
                    if(isAlreadyMappedToParentStackEquation == false){
                        this.setMappedTo(mapableElement.id,true);
                        break;
                    }
                }
            }
        }
    }
}   

var Equations = new Equations();
