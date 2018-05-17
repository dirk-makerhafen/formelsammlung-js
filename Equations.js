function EquationClass(){
    var self = this;
    self.constructorName = "Equation";

    self.identifier = undefined;
    
    self.name = undefined;
    self.description = undefined;
    self.rawmarkdown = undefined;
        
    self.images = [];
    self.description = undefined;
    self.equationString = undefined;
    self.io = [];
    
    self.functions = []; // defined functions
    
    self.renderDescriptionCache = []

    self.cantranslate = function(){ 
        if (LANGUAGE == "EN" || self.translations == undefined || self.translations[LANGUAGE] == undefined){ return false; }else{ return true; } 
    }
    
    self.name_translation = function(){
        if(self.cantranslate()){return self.translations[LANGUAGE].name;}
        return self.name;
    }
    
    self.description_translation = function(){
        if(self.cantranslate()){return self.translations[LANGUAGE].description;}
        return self.description;
    }

    self.getMappableIoIndexes = function(){
        var wouldmap = []; // prevent doublicate io mapping
        var indexes = [];
        
        for (var index = 0; index < self.io.length; ++index) {
            var mse = self.io[index].mapableStackElements();
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
    
    self.outputName = function(){
        var matchindexes = self.getMappableIoIndexes();
        if((self.io.length - matchindexes.length) == 1){
            for(var i =0;i<self.io.length;++i){ // search unmatched io, aka output
                if(matchindexes.indexOf(i) == -1){
                    return self.io[i].quantity.name; 
                }
            }
        }
        return "";
    }   
       
    self.nrOfMappableIos = function(){
        return self.getMappableIoIndexes().length;
    }   
       
    self.distance = function(){
        return 100.0 /  self.io.length * self.nrOfMappableIos();            
    }    
    
    self.getIoBySymbol = function(symbol){
        for(var i =0;i<self.io.length;++i){ // search unmatched io, aka output
            if(self.io[i].symbol == symbol){
                return self.io[i];
            }
        }
        return undefined;
    }
    
    self.color = function(){
        if(self.outputName()!=""){
            return "green";            
        }else{
            return "gray";
        }
    }
    
    self.solve = function(valuemappingin,solveto){ 
        valuemapping = [];
        for (var key in valuemappingin) {
            if ( valuemappingin.hasOwnProperty(key)){
                if(solveto==key){continue;}
                valuemapping[key] = valuemappingin[key];
            };
        }
        for (var key in self.functions) {
            if ( self.functions.hasOwnProperty(key)){
                valuemapping[key] = self.functions[key];
            }
        }
        
        var outPutEquation = self.getIoBySymbol(solveto).equation;                  
        var result = "NaN";
        try {
            result = outPutEquation.eval(valuemapping);
        }catch(e){
            console.log(e);
            console.log(valuemapping)
            console.log("failed eval of " + self.getIoBySymbol(solveto).equationString) + "   " + e;
        }
        if(result.hasOwnProperty("entries")){
            result = result["entries"][result["entries"].length-1];
        }
        return result;
    }
    
    self.smokeTest = function(){
        var valuemapping = []
        for(var pass=0;pass<self.io.length;++pass){
            for(var i=0;i<self.io.length;++i){
                valuemapping[self.io[i].symbol] = Math.floor(Math.random() * 100) + 1;
            }
            var res = self.solve(valuemapping,self.io[pass].symbol); // calc
            valuemapping[self.io[pass].symbol] = res; // map first 
            
            for(var i=0;i<self.io.length;++i){
                try{
                    var rt = self.solve(valuemapping,self.io[i].symbol);
                    if(rt - valuemapping[self.io[i].symbol] > 0.00001){
                        console.log("failed smoketest of equation " + self.name + " for output " + self.io[i].symbol);
                        console.log(rt + " != " + valuemapping[self.io[i].symbol]);
                        console.log(valuemapping);
                    }
                }catch(e){
                    console.log("failed to test equation " + self.name);
                    console.log(e);
                    var rt = self.solve(valuemapping,self.io[i].symbol);
                }
            }
        }
    }
    
    self.loadMarkdown = function(markdownString){
        self.name = markdown_extractValue(markdownString,"__Name__:");
        self.identifier = self.name.replace(/\W+/g, "");
        self.description = markdown_extractValue(markdownString,"__Description__:");
        self.rawmarkdown = markdownString;
        
        self.images = [];
        var tmpparts = self.description.split("![Image of URI](")
        for(var i=1;i<tmpparts.length;++i){
            var url = tmpparts[i].split(")")[0].trim();
            if(url.indexOf("http")==0){ self.images.push(url); }
        }
        self.description = self.description.split("![Image of URI](")[0];  // description is before the images ! 
                
        self.io = []
        var ioparts = markdownString.split("__IO__:")[1].split("--------")[0].trim().split("* __");        
        for(var i=0;i<ioparts.length;++i){
            if(ioparts[i].indexOf("__ [ _") == -1){continue;}
            var eio = new EquationIOClass();
            eio = eio.loadMarkdown(ioparts[i]);
            if(eio!=undefined){
                self.io.push(eio);
            }else{
                alert("failed to parse EquationIO markdown")
            }
        }
        
        for (var index = 0; index < self.io.length; ++index) {
            self.io[index].parentEquation = this;
        }
        if(markdownString.indexOf("__Function__") != -1){ 
            
            var tmpfunctions = markdownString.split("__Function__")[1].split("```");
            for(var i=0;i<tmpfunctions.length-1;i=i+2){
                var functionSymbol = tmpfunctions[i].split("__")[1];
                var str = "self.functions['"+functionSymbol+"'] = " + tmpfunctions[i+1].trim();
                eval(str);
            }
        }
        
        return this;

    }

    self.loadTranslationMarkdown = function(language,markdownString){
        if(self.translations == undefined){ self.translations = {} }
        if(self.translations[language] == undefined){ self.translations[language] = {} }
        
        self.translations[language].name = markdown_extractValue(markdownString,"__Name__:");
        self.translations[language].description = markdown_extractValue(markdownString,"__Description__:");  

        var ioparts = markdownString.split("__IO__:")[1].split("--------")[0].trim().split("* __");
        for(var i=0;i<ioparts.length;++i){
            if(ioparts[i].indexOf("__") == -1){continue;}
            var symbol = ioparts[i].split("__")[0].trim();
            var io = self.getIoBySymbol(symbol);
            io.loadTranslationMarkdown(language,ioparts[i]);
        }
    }
    
    self.renderDescription = function(){
        var r = Mustache.render($('#EquationDescriptionTemplate').html(), {
            description  : markdown.toHTML(self.description_translation()),
            name : self.name,
            images : self.images,
            io : self.io,
            identifier : self.identifier,
        });
        
        return r;    
    }   
        
    self.render = function(){
        var r = Mustache.render($('#EquationTemplate').html(), this);
        return r;
    }

    
}

function EquationIOClass(){
    var self = this;

    self.symbol = undefined;
    self.symbolTex = undefined;
    self.description = undefined;
    self.equation = undefined;
    self.equationTex = undefined;
    self.quantity = undefined;

    self.parentEquation = undefined; // set by parent on constructor
    
    self.cantranslate = function(){ 
        if (LANGUAGE == "EN" || self.translations == undefined || self.translations[LANGUAGE] == undefined){ return false; }else{ return true; } 
    }
    
    self.description_translation = function(){
        if(self.cantranslate()){return self.translations[LANGUAGE].description;}
        return self.description;
    }

    // test if this io can be mapped to a stack element
    self.canMap = function(stackElement){
        if(stackElement.constructorName == "StackQuantity"){
            if(stackElement.quantity.unit.equals(self.quantity.unit)){
                return true;
            }
        }
        
        if(stackElement.constructorName == "StackEquation"){
            var q = stackElement.resultQuantity();
            if(q!=undefined){
                if(q.unit.equals(self.quantity.unit)){
                    return true;
                }
            }
        }
        
        if(stackElement.constructorName == "StackMaterial"){
            var materialproperties =  stackElement.properties;
            for (var index1 = 0; index1 < materialproperties.length; ++index1) {
                if(materialproperties[index1].quantity == self.quantity){
                    return true;
                }   
            }
        }    
        
        return false;
    } 

    self.mapableStackElements = function(){
        var selectableStackElements = [];
        for (var index = 0; index < CurrentStack.elements.length; ++index) {
            if (self.canMap(CurrentStack.elements[index])){
                selectableStackElements.push(CurrentStack.elements[index]);
            }
        }
        return selectableStackElements;
    }    
    
    self.loadMarkdown = function(markdownString){
        self.symbol = markdownString.split("__")[0].trim();
        
        var symbolequationString = markdownString.split("_ ]")[1].split("|")[1].split("\n")[0].trim();
        if(symbolequationString.indexOf(self.symbol) != 0 && symbolequationString!="" ){
            symbolequationString = self.symbol +  " = " + symbolequationString;
        }
        var tmp = markdownString.split("_ ]")[1].split("* __")[0].split("\n__")[0].split("\n");
        var eq = [];
        var description = "";
        for(var i=1;i<tmp.length;i++){
            var x= tmp[i].trim();
            if(x.indexOf("|")==0){
                var y = x.replace("|","").trim();
                eq.push(y);
            }else{
                description += "\n" + x;
            }
            
        }

        eq.push(symbolequationString);
        
        self.description  = description;
        self.equationString = eq.join("\n"); 
        if(self.equationString != ""){
            try{
                self.equation = math.parse(self.equationString);
                self.equationTex = self.equation.toTex().replace(new RegExp('\\\\;\\\\;', 'g'), "\\\\").replace(new RegExp('\n ', 'g'), "\n");
            }catch(e){
                console.log("failed to parse equation for io: " + self.equation + "  " + e);
            }
        }else{
            self.equation = undefined;
            self.equationTex = "NaN";
        }

        self.symbolTex = math.parse(self.symbol).toTex();
        var quantity =  markdownString.split("[ _")[1].split("_ ]")[0].trim();
        var q = Quantities.get(quantity);
        if (q == undefined){
            alert("Quantity " + quantity + " not found");
            return;
        }
        self.quantity = q;
        return this;
    }
    
    self.loadTranslationMarkdown = function(language,markdownString){
        if(self.translations == undefined){ self.translations = {} }
        if(self.translations[language] == undefined){ self.translations[language] = {} }
        self.translations[language].description = markdownString.split("__")[1].split("\n")[1].trim();            
    }    
    
   
    self.showEquationDetailLink = function(){
        if(self.equation==undefined){
            return "span";
        }
        return "a";
    }   
    self.renderSymbolTex = function(){
        var targetId = "symbolTexTarget_" + self.parentEquation.identifier + "_" + self.symbol; 
        return mathjaxCache.add(targetId,self.symbolTex);
    }
    
    self.renderEquationTex = function(){
        var targetId = "equationTexTarget_" + self.parentEquation.identifier + "_" + self.symbol; 
        return mathjaxCache.add(targetId,self.equationTex);
    }
}

function EquationsClass(){
    var self = this;
    
    self.targetdiv = "EquationsList";
    self.allequations = [];
    self.filter = "";
    self.filteredequations = self.allequations;
    
    self.paginationPage = 1;
    self.paginationElementsPerPage = 10;
    
    self.loadMarkdown = function(markdown){
        var parts = markdown.split("--------");
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("__Name__:") == -1){continue;}
            var e = new EquationClass();
            e = e.loadMarkdown(parts[partsIndex]);
            if(e!=undefined){
                self.add(e);
            }else{
                alert("failed to parse Equation markdown");
            }
        }
    }    
    
    self.loadTranslationMarkdown = function(language,markdown){
        var parts = markdown.split("--------");
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("__Name__:") == -1){continue;}
            var parentname = markdown_extractValue(parts[partsIndex],"__ParentName__:");
            var e = self.get(parentname); 
            if(e!=undefined){
                e.loadTranslationMarkdown(language,parts[partsIndex]);
            }else{
                alert("failed to parse Equation Translation markdown");
            }                
        }
    }  
    
    self.add = function(equation){
        self.allequations.push(equation);
    }
    
    self.get = function(name){
        for (var index = 0; index < self.allequations.length; ++index) {
            if(self.allequations[index].name == name){
                return self.allequations[index];
            }
        }
        return null;
    }
    
    self.setFilter = function(filter){
        self.filter = filter;
        self.filteredequations = []
        self.paginationPage = 1;        
        if(filter == ""){
            self.filteredequations = self.allequations;
        }else{
        

        
            self.match = function(index,matched){
                if(matched==true){
                    if(self.filteredequations.indexOf(self.allequations[index]) == -1 ){
                        self.filteredequations.push(self.allequations[index]);
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
                for (var index = 0; index < self.allequations.length; ++index) {               
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allequations[index][keys[matchindex]]+""}else{var mstr = self.allequations[index][keys[matchindex]]()+""}
                    self.match(index, mstr == self.filter  );}
                for (var index = 0; index < self.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allequations[index][keys[matchindex]]+""}else{var mstr = self.allequations[index][keys[matchindex]]()+""}
                    self.match(index, mstr.toLowerCase() == self.filter.toLowerCase()  );}
                for (var index = 0; index < self.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allequations[index][keys[matchindex]]+""}else{var mstr = self.allequations[index][keys[matchindex]]()+""}
                    self.match(index, mstr.indexOf(self.filter) ==  0);}
                for (var index = 0; index < self.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allequations[index][keys[matchindex]]+""}else{var mstr = self.allequations[index][keys[matchindex]]()+""}
                    self.match(index, mstr.toLowerCase().indexOf(self.filter.toLowerCase()) ==  0);}
                for (var index = 0; index < self.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allequations[index][keys[matchindex]]+""}else{var mstr = self.allequations[index][keys[matchindex]]()+""}
                    self.match(index, mstr.indexOf(self.filter) >  0);}
                for (var index = 0; index < self.allequations.length; ++index) {            
                    if(keys[matchindex].indexOf("_")==-1){var mstr = self.allequations[index][keys[matchindex]]+""}else{var mstr = self.allequations[index][keys[matchindex]]()+""}
                    self.match(index, mstr.toLowerCase().indexOf(self.filter.toLowerCase()) >  0);}
            }
        }
        
        self.render();
    }

    self.filteredEquationsPagination = function(){
        var index = self.paginationElementsPerPage*(self.paginationPage-1);
        return self.filteredequations.slice(index,index+ self.paginationElementsPerPage);
    }
    
    self.paginationMaxPages = function(){
        return math.ceil(self.filteredequations.length / self.paginationElementsPerPage); 
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
            r.push({"nr":i,"selected":selected});
        }
        return r;
    }
    
    self.init = function(){
        self.allequations.sort(function(a, b) {
            if( a.name_translation() >  b.name_translation()){ return  1;};
            if( a.name_translation() <  b.name_translation()){ return -1;};
            if( a.name_translation() == b.name_translation()){ return  0;};
        });
        self.filteredequations = self.allequations;
        for (var index = 0; index < self.allequations.length; ++index) {               
            self.allequations[index].smokeTest();
        }
    }
    
    self.render = function(){
        self.filteredequations.sort(function(a, b) {
            var d = b.distance() - a.distance();
            if(d==0){
                if( a.name_translation().toLowerCase() >  b.name_translation().toLowerCase()){ return  1;};
                if( a.name_translation().toLowerCase() <  b.name_translation().toLowerCase()){ return -1;};
                if( a.name_translation().toLowerCase() == b.name_translation().toLowerCase()){ return  0;};
            }
            return d;
        });
        var r = Mustache.render($('#EquationsTemplate').html(), this);
        document.getElementById(self.targetdiv).innerHTML = r;
        mathjaxCache.render();
        
    }

}

function StackEquationClass(stack, equation){
    
    var self = this;
    
    self.constructorName = "StackEquation";

    self.parentStack = stack;
    self.equation = equation;
    self.id = "SE_" + getUniqNumber();

    self.name =  getStackName("result ");
    self.showConverter = "None";

    self.resultScaler = undefined;
    
    self.io = []
    for (var index = 0; index < self.equation.io.length; ++index) {
        self.io.push(new StackEquationIOClass(this,self.equation.io[index]));
    }
       
    self.mappedto = []
    self.minimised = false;
    
    self.resultValueTrimmed = function(){
        var r = self.resultValue()
        try{
            r = r.toFixed(4);
        }catch(e){}
        return r;
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
    
    self.setMinimised = function(value){
        self.minimised = value;
    }
    
    self.showCanMinimise = function(){
        if(self.minimised==true){return "none";}
        return "";
    }
    
    self.showCanMaximise = function(){
        if(self.minimised==false){return "none";}
        return "";
    } 
    
    self.dispose = function(){
        while (self.mappedto.length > 0){
            self.mappedto[0].setMappedTo("UNMAPPED",true); // unmap elements that map to this result
        }
        for(var index=0;index<self.io.length;++index){
            self.io[index].setMappedTo("UNMAPPED",true);
        }
    }
       
    self.setName = function(name){
        self.name = name;
        self.parentStack.updateRender(self.id);
    }
    
    self.getIO = function(elementId){
        return self.io[self.getIndexOfIO(elementId)];
    }
    
    self.getIndexOfIO = function(elementId){
        for (var index = 0; index < self.io.length; ++index) {
            if(self.io[index].id == elementId){
                return index;
            }
        }
        return -1;
    }
            
    self.getIndexOfIOByMapping = function(mappedtostring){
        var outputIos = [];
        for (var index = 0; index < self.io.length; ++index) {
            if(self.io[index].mappedto == mappedtostring){
                outputIos.push(index);
            }
        }
        return outputIos;
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
        
    self.scaleUp = function(){
        if(self.resultScaler == undefined){
            self.resultScaler =  self.resultQuantity().scaleup;
        }else{
            if(self.resultScaler.scaleup != undefined){
                self.resultScaler = self.resultScaler.scaleup;
            }
        }
        self.updateRender();
    }
    
    self.displayScaleUp = function(){
        var rq = self.resultQuantity();
        if (rq == undefined || rq.scaleup==undefined){
            return "None";
        }
        
        return "";
    }  
    
    self.scaleDown = function(){
        if(self.resultScaler == undefined){
            self.resultScaler = self.resultQuantity().scaledown;
        }else{
            if(self.resultScaler.scaledown != undefined){
                self.resultScaler = self.resultScaler.scaledown;
             }
        }
        self.updateRender();
    }
    
    self.displayScaleDown = function(){
        var rq = self.resultQuantity();
        if (rq == undefined ||  rq.scaledown==undefined){
            return "None";
        }
        return "";
    } 
    
    self.displayShowConvert = function(){
        var rq = self.resultQuantity();
        if(rq == undefined || rq.converter.length==0){
            return "None"
        }
        return "";
    }   
    
    self.canCalc = function(){
        if (self.getIndexOfIOByMapping("UNMAPPED").length == 0 && self.getIndexOfIOByMapping("OUTPUT").length == 1){
            return true;
        }
        return false;
    }    
  
    self.resultValue = function(){
        if(self.canCalc() == true){
            var valuemapping = [];
            var valuekeys = []
            for(var i=0;i<self.io.length;i++){
                if(self.io[i].mappedto == "OUTPUT"){continue;}
                var mappedto = CurrentStack.get(self.io[i].mappedto)
                
                if (mappedto != undefined){
                    valuekeys.push(self.io[i].equationio.symbol)
                    
                    var v="";
                    if(mappedto.constructorName == "StackQuantity"){
                        v = parseFloat((""+mappedto.value));
                        v = mappedto.quantity.convertValue(v,self.io[i].equationio.quantity)
                    }
                    if(mappedto.constructorName == "StackEquation"){
                        v = parseFloat((""+mappedto.resultValue()));
                        if(!isNaN(v)){
                            v = mappedto.resultQuantity().convertValue(v,self.io[i].equationio.quantity);
                        }
                    }
                    if(mappedto.constructorName == "StackMaterial"){
                        var x = mappedto.getPropertyByQuantity(self.io[i].equationio.quantity);
                        v=x.value;
                        if(!isNaN(v)){
                            v = x.quantity.convertValue(v,self.io[i].equationio.quantity);
                        }
                        
                    }

                    valuemapping[self.io[i].equationio.symbol] = v;
                }else{
                    self.io[i].mappedto = "UNMAPPED"; // mappedto no longer exists
                }
            }
            var outputEquationIO = self.io[self.getIndexOfIOByMapping("OUTPUT")[0]].equationio;
            
            var value = self.equation.solve(valuemapping,outputEquationIO.symbol)            
            
            return outputEquationIO.quantity.convertValue(value,self.resultQuantity());
        }
        return "Na";    
    }
 
    self.save = function(){
        var data = {};
        data["name"] = self.name;
        data["id"] = self.id;
        data["m"] = self.minimised;
        data["io"] = {};
        for (var index = 0; index < self.io.length; ++index) {
             data["io"][self.io[index].equationio.symbol] = self.io[index].save();
        }
        data["eqn"] = self.equation.name;
        return data;
    }
    
    self.load = function(data){
        self.name = data["name"];
        self.id = data["id"];
        self.minimised = data["m"];
        for (var index = 0; index < self.io.length; ++index) {
            self.io[index].load(data["io"][self.io[index].equationio.symbol]);
        }
    }
 
    self.resultQuantity = function(){
        if(self.canCalc() == true){
            if(self.resultScaler != undefined){
                return self.resultScaler;
            }
            var rq = self.io[ self.getIndexOfIOByMapping("OUTPUT")[0]].equationio.quantity;
            return rq;
        }
        return undefined;
    }
    
    self.renderPrint = function(){  
        var resultSymbol =  self.io[self.getIndexOfIOByMapping("OUTPUT")[0]].equationio.symbol;
        var eqTex = self.equation.getIoBySymbol(resultSymbol).equationTex;

        var rq = self.resultQuantity()
        var equation = " $$"+ eqTex + " \\qquad ( " + rq.unitTex + " ) \\qquad "+rq.name+" $$ ";;
        var r = Mustache.render($('#StackEquationPrintTemplate').html(),{
            "equation" : equation,
        });
        return r;
    }
    
    self.renderDescription = function(){
        var r = Mustache.render($('#EquationDescriptionTemplate').html(), {
            description  : markdown.toHTML(self.equation.description_translation()),
            name : self.equation.name,
            images : self.equation.images,
            io : self.equation.io,
            identifier : "Stack"+self.identifier,
        });
        return r;    
    }  
    
    self.render = function(){
        if(self.getIndexOfIOByMapping("UNMAPPED").length > 0 || self.getIndexOfIOByMapping("OUTPUT").length != 1 || true){
            var cntoutput = 0;
            for(var i=0;i<self.io.length;i++){
                self.io[i].autoMapStackElements(true); 
                self.io[i].autoMapStackElements(false); 
                if(self.io[i].mappedto == "OUTPUT" || self.io[i].mappedto == "UNMAPPED" ){
                    cntoutput += 1;
                }
                if(cntoutput == 0 && i==self.io.length-2){ // last io becomes output
                    break;
                }
            }
        }
        if (self.getIndexOfIOByMapping("UNMAPPED").length == 1 && self.getIndexOfIOByMapping("OUTPUT").length == 0){
            self.io[self.getIndexOfIOByMapping("UNMAPPED")[0]].setMappedTo("OUTPUT",true);
        } 
        var r = Mustache.render($('#StackEquationTemplate').html(), this);
        return r;
    }   
        
    self.updateRender = function(){
        $("#"+self.id).replaceWith(self.render());
        mathjaxCache.render();
    }
     
    self.renderConverter = function(){
        var str = "";
        var rq = self.resultQuantity();
        if (rq != undefined){
            
            for(var i =0;i<rq.converter.length;++i){ 
                str += Mustache.render($('#StackQuantityConverterTemplate').html(),{
                    value : math.unit(self.resultValue(),rq.unit.toString()).toNumber(rq.converter[i].unit.toString()),
                    quantity : rq.converter[i],
                }
                );
            }
        }
        return str;
    }
    
    self.updateRenderConverter = function(){
        document.getElementById("Converter_"+self.id).innerHTML = self.renderConverter();
    }
}

function StackEquationIOClass(stackequation,equationio){
    var self = this;

    self.parentStackEquation = stackequation;
    self.equationio = equationio;
    self.id = "SEIO" + getUniqNumber();

    self.mappedto = "UNMAPPED"; // "OUTPUT" , "UNMAPPED"
    
    self.selectableDivClass = function(){
        if(self.parentStackEquation.canCalc()){
            if(self.mappedto == "OUTPUT"){
                return "StackEquationIoGreen";
            }
        }else{
            if(self.mappedto == "UNMAPPED" || self.mappedto == "OUTPUT"){
                 return "StackEquationIoWarn";
            }
        }
        return "";
    }

    
    self.mapableStackElements = function(){
        var selectableStackElements = [];
        
        var myindex = CurrentStack.getIndexOfElement(self.parentStackEquation.id);        
        if(myindex == -1){
            myindex =  CurrentStack.elements.length; // item does not exist on stack yet
        }    
        for (var index = myindex - 1 ; index >= 0 ; --index) {
            var element = CurrentStack.elements[index];
            if(element.id == self.mappedto){
                element.selected = "selected";
            }else{
                element.selected = "";
            }
            if (self.equationio.canMap(element)){
                selectableStackElements.push(element);
            }
        }

        return selectableStackElements;
    }
    
    self.setMappedTo = function(key,norender){
        var e = CurrentStack.get(self.mappedto)
        if (e!=undefined){
            e.removeMappedTo(this);
        }

        if(key == "OUTPUT"){
            self.parentStackEquation.resultScaler = undefined;
            for(var i=0;i<self.parentStackEquation.io.length;i++){
                var io = self.parentStackEquation.io[i];
                if(io!=this && io.mappedto=="OUTPUT"){
                    io.setMappedTo("UNMAPPED",true);
                }
            }
        }
        self.mappedto = key;
        var e = CurrentStack.get(self.mappedto)
        if (e!=undefined){
            e.addMappedTo(this);
        }
        if(norender==false){
            self.updateRender();
            self.parentStackEquation.updateRender();
            self.parentStackEquation.parentStack.updateRender(self.parentStackEquation.id);
        }
    }
    
    self.save = function(){
        var data = {};
        data["m"] = self.mappedto;
        return data;
    }
    
    self.load = function(data){
        self.setMappedTo(data["m"],true);
    }
    
    self.render = function(){
        r = Mustache.render($('#StackEquationIoTemplate').html(), this);
        return r;
    }   
    
    self.updateRender = function(){
        $("#"+self.id).replaceWith(self.render());
    }
    
    self.autoMapStackElements = function(noDoubleMapping){
        var mapableElements = self.mapableStackElements(); 
        if(self.mappedto == "UNMAPPED"){
            if(mapableElements.length > 0){  
                for(var i=0;i < mapableElements.length;i++){   // for each mappable element
                    var mapableElement = mapableElements[i];    
                    if(noDoubleMapping == true && mapableElement.mappedto.length>0){ continue;}
                    var isAlreadyMappedToParentStackEquation = false;
                    for(var j=0;j < mapableElement.mappedto.length;j++){ // for each equationIO this element already maps to 
                        if(mapableElement.mappedto[j].parentStackEquation == self.parentStackEquation){
                            isAlreadyMappedToParentStackEquation = true;
                            break;
                        }
                    }
                    if(isAlreadyMappedToParentStackEquation == false){
                        self.setMappedTo(mapableElement.id,true);
                        break;
                    }
                }
            }
        }else{
            var exists = false;
            if(self.mappedto!="OUTPUT" && self.mappedto!="UNMAPPED"){
                for(var i=0;i < mapableElements.length;i++){   // for each mappable element
                    if(self.mappedto == mapableElements[i].id){
                        exists = true;
                        break;
                    }
                }
                if(exists == false){ //remove non existing mapped elements
                    self.setMappedTo("UNMAPPED",true);
                }
            }
        }
    }
}   

var Equations = new EquationsClass();
