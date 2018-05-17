

function Material(name, description, properties){
    this.constructorName = "Material";

    this.name = name;
    this.description = description;
    this.properties = properties; // list of MaterialProperty
    for (var index = 0; index < this.properties.length; ++index) {
        this.properties[index].parentMaterial = this;
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
           
    this.renderDescription = function(){
        return markdown.toHTML(this.description_translation());    
    }   
    
    this.render = function(){
        var r = Mustache.render($('#MaterialTemplate').html(), this);
        return r;
    }

}

function MaterialProperty(quantity,value){
    this.quantity = quantity;
    this.value = value;
    this.parentMaterial = null; // set by parent material on constructor
}

function Materials(){
    this.targetdiv = "MaterialsList";
    this.allmaterials = [];
    this.filter = "";
    this.filteredmaterials = this.allmaterials;
    this.paginationPage = 1;
    this.paginationElementsPerPage = 10;  
    
    this.add = function(quantity){
        this.allmaterials.push(quantity);
    };
    
    this.get = function(name){
        for (var index = 0; index < this.allmaterials.length; ++index) {
            if(this.allmaterials[index].name == name){
                return this.allmaterials[index];
            }
        }
        return null;
    }
    
    this.setFilter = function(filter){
        this.filter = filter;
        this.filteredmaterials = []
        this.paginationPage = 1;
        if(filter == ""){
            this.filteredmaterials = this.allmaterials;
        }else{
            for (var index = 0; index < this.allmaterials.length; ++index) {
                if(  this.allmaterials[index].name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1 || 
                     this.allmaterials[index].description.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1 )
                    {
                        this.filteredmaterials.push(this.allmaterials[index]);
                    }
            }        
        }
        
        this.render();
    }
           
    this.loadMarkdown = function(markdown){
        try {
            var parts = markdown.split("-------------");
        }catch(err){return;}    
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("* ") == -1){continue;}
            var parseableString = parts[partsIndex];
            var name = parseableString.split("\n")[1].split("__")[1];
            var description = parseableString.split("__"+name+"__")[1].split("\n* ")[0].trim();
            var values = parseableString.split("__"+name+"__")[1].split("\n* ");
            var name = name.trim();
            var properties = []
            for (var valueindex = 1; valueindex < values.length; valueindex++) {
                var quantityname = values[valueindex].split(":")[0].trim();
                var quantityvalue = parseFloat(values[valueindex].split(":")[1].trim());
                var materialproperty = new MaterialProperty(Quantities.get(quantityname),quantityvalue)
                properties.push(materialproperty)
            }
            this.add(new Material(name,description,properties));
        }
    }  
    
    this.loadTranslationMarkdown = function(language,markdown){
        try{
            var parts = markdown.split("-------------");
        }catch(err){
            return;
        }    
        for (var partsIndex = 1; partsIndex < parts.length; partsIndex++) {
            if(parts[partsIndex].indexOf("__") == -1){continue;}
            var parseableString = parts[partsIndex];
            var parentname = parseableString.split("\n")[1].split("__")[1].trim();
            var name = parseableString.split("\n")[2].split("__")[1].trim();
            var description = parseableString.split("__"+name+"__")[1].split("\n* ")[0].trim();
            
            var m=this.get(parentname) 
            if(m.translations == undefined){ m.translations = {} }
            if(m.translations[language] == undefined){ m.translations[language] = {} }
            m.translations[language].name = name
            m.translations[language].description = description
        }
    }  
    

    this.filteredMaterialsPagination = function(){
        var index = this.paginationElementsPerPage*(this.paginationPage-1);
        return this.filteredmaterials.slice(index,index+ this.paginationElementsPerPage);
    }
    
    this.paginationMaxPages = function(){
        return math.ceil(this.filteredmaterials.length / this.paginationElementsPerPage); 
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
    
    this.render = function(){
        var r = Mustache.render($('#MaterialsTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;
    }    
}

function StackMaterial(stack,material){
    this.constructorName = "StackMaterial";

    this.parentStack = stack;
    this.material = material;
    this.id = "SM_" + getUniqNumber();

    this.name = getStackName("material ");
    this.color = "#eee";
    
    this.mappedto = []
    this.minimised = false;
    
    this.properties = []; // list of StackMaterialProperty
    for (var index = 0; index < this.material.properties.length; ++index) {
        this.properties[index] = new StackMaterialProperty(this,this.material.properties[index]);
    }
    
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
  
    this.setMinimised = function(value){
        this.minimised = value;
    }
    
    this.showCanMinimise = function(){
        if(this.minimised==true){return "none";}
        return "";
    }
    
    this.showCanMaximise = function(){
        if(this.minimised==false){return "none";}
        return "";
    } 
        
    this.getPropertyById = function(id){
        for (var index = 0; index < this.properties.length; ++index) {
            if(this.properties[index].id == id){return this.properties[index];}
        }
        return undefined;
    }
    
    this.getPropertyByQuantity = function(quantity){
        for (var index = 0; index < this.properties.length; ++index) {
            if(this.properties[index].quantity == quantity){
                return this.properties[index];
            }
        }
        return undefined;
    }
    
    this.dispose = function(){
        while (this.mappedto.length > 0){
            this.mappedto[0].setMappedTo("UNMAPPED",true);
        }
    }
    
    this.setName = function(name){
        this.name = name;
        var e = document.getElementsByClassName("StackEquationIo_"+this.id);
        for (var i = 0; i < e.length; ++i) {
             e[i].innerHTML = this.name;
        }
    }
    
     this.save = function(){
        var data = {};
        data["name"] = this.name;
        data["id"] = this.id;
        data["m"] = this.minimised;
        data["mn"] = this.material.name;
        data["p"] = [] // q.name , value
        for (var index = 0; index < this.properties.length; ++index) {
            if(this.properties[index].hasCustomValue()){
                data["p"].push([this.properties[index].quantity.name,this.properties[index].value]);
            }
        }
        return data;
    }
    
    this.load = function(data){
        this.name = data["name"];
        this.id = data["id"];
        this.minimised = data["m"];
        
        for (var index = 0; index < data["p"].length; ++index) {
                var q = Quantities.get(data["p"][index][0]);
                var v = data["p"][index][1];
                var p = this.getPropertyByQuantity(q);
                p.value = v;
        }
    }
    
    this.renderPrint = function(){
        return "hallom";
    }   
    this.render = function(){
        var r = Mustache.render($('#StackMaterialTemplate').html(), this);
        return r;
    }   
    
    this.updateRender = function(){
        //$("#"+this.id).replaceWith(this.render());
        for (var index = 0; index < this.properties.length; ++index) {
            $("#" + this.properties[index].id + "_input").val(this.properties[index].value);
        }
    }
}

function StackMaterialProperty(stackmaterial,materialproperty){
    this.parentStackMaterial = stackmaterial;
    this.materialproperty = materialproperty;
    this.id = "SMP_" + getUniqNumber();
    
    this.value = materialproperty.value;
    this.quantity = materialproperty.quantity;
    
    this.setValue = function(value){
        this.value = value;
        this.parentStackMaterial.parentStack.updateRender(this.parentStackMaterial.id);
    }
    
    this.hasCustomValue = function(){
        return this.value != this.materialproperty.value;
    }
    
}

var Materials = new Materials();

