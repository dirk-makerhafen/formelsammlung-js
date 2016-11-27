function Material(name,description,properties){
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

    this.displayTranslateMe = function(){
        if(this.cantranslate() || LANGUAGE == "EN"){ return "None"; }
        return "";
    } 
    
    this.getPropertyByQuantity = function(quantity){
        for (var index = 0; index < this.properties.length; ++index) {
            if(this.properties[index].quantity == quantity){
                return this.properties[index];
            }
        }
        return undefined;
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
        for (var index = 0; index < this.allmaterials.length; ++index) {
            if(  this.allmaterials[index].name.toLowerCase().indexOf(this.filter) !== -1 || 
                 this.allmaterials[index].description.toLowerCase().indexOf(this.filter) !== -1 )
                {
                    this.filteredmaterials.push(this.allmaterials[index]);
                }
        }        
        this.render();
    }

    this.render = function(){
        var r = Mustache.render($('#MaterialsTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;
    }    
}

function StackMaterial(stack,material){
    this.parentStack = stack;
    this.material = material;
    this.id = "StackMaterial_" + getUniqNumber();

    this.name = "material " + getUniqNumber();
    this.color = "#eee";
    
    this.setName = function(name){
        this.name = name;
        var e = document.getElementsByClassName("StackEquationIo_"+this.id);
        for (var i = 0; i < e.length; ++i) {
             e[i].innerHTML = this.name;
        }
    }
       
    this.render = function(){
        var r = Mustache.render($('#StackMaterialTemplate').html(), this);
        return r;
    }   
    
    this.updateRender = function(){
        $("#"+this.id).replaceWith(this.render());
    }
}

var Materials = new Materials();

