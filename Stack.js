

function Stack(){
    this.elements = [];

    this.addNoRender = function(element){
        if(element.constructor.name == "Quantity"){
            this.elements.push(new StackQuantity(this,element));
        }
        if(element.constructor.name == "Equation"){
            this.elements.push(new StackEquation(this,element));
        }
        if(element.constructor.name == "Material"){
            this.elements.push(new StackMaterial(this,element));
        }
    }
    
    this.add = function(element){
        this.addNoRender(element);
        this.render();
    }
       
    this.remove = function(elementId){
        this.get(elementId).dispose();
        this.elements.splice(this.getIndexOfElement(elementId), 1);
        this.render();
    }
    
    this.get = function(elementId){
        return this.elements[this.getIndexOfElement(elementId)];
    }
    
    this.moveUp = function(elementId){
        var index = this.getIndexOfElement(elementId);
        if (index < 1){
            return;
        }
        var tmp = this.elements[index - 1];
        this.elements[index - 1] = this.elements[index];
        this.elements[index] = tmp;
        this.render();
    }
    
    this.moveDown = function(elementId){
        var index = this.getIndexOfElement(elementId);
        if (index > this.elements.length-2){
            return;
        }
        var tmp = this.elements[index + 1];
        this.elements[index + 1] = this.elements[index];
        this.elements[index] = tmp;
        this.render();
    }
    
    this.getIndexOfElement = function(elementId){
        for (var index = 0; index < this.elements.length; ++index) {
            if(this.elements[index].id == elementId){
                return index;
            }
        }
        return -1;
    }
    
    this.render = function(){
        var r = Mustache.render($('#StackTemplate').html(), this);
        $('#Stack').animate({'opacity': 0.4}, 60, function(){
            $(this).html(r).animate({'opacity': 1}, 150);    
        });        
        Equations.render();
    }   
    
    this.updateRender = function(elementId){
        var start = this.getIndexOfElement(elementId);
        for (var index = start+1; index < this.elements.length; ++index) {
            this.elements[index].updateRender(this.id);
        }
    }

    this.clear = function(){
        for (var index = 0; index < this.elements.length; ++index) {
            this.elements[index].dispose();
        }
        this.elements=[];
        this.render();
    }
    
    this.save = function(){
        var result = [];
        for (var index = 0; index < this.elements.length; ++index) {
            var stackElement = this.elements[index];
            result[index] = {};
            result[index]["type"] = stackElement.constructor.name;
            result[index]["data"] = stackElement.save();
        }
        localStorage.setItem('testObject', JSON.stringify(result));

    }
    
    this.load = function(){
        this.clear();
        var retrievedObject = JSON.parse(localStorage.getItem('testObject'));
        for (var index = 0; index < retrievedObject.length; ++index) {
            if(retrievedObject[index]["type"] == "StackQuantity"){
                var q=Quantities.get(retrievedObject[index]["data"]["quantity_name"])
                this.addNoRender(q);
                this.elements[index].load(retrievedObject[index]["data"])
            }
            if(retrievedObject[index]["type"] == "StackMaterial"){
                var m=Materials.get(retrievedObject[index]["data"]["material_name"])
                this.addNoRender(m);
                this.elements[index].load(retrievedObject[index]["data"])
            }
            if(retrievedObject[index]["type"] == "StackEquation"){
                var e=Equations.get(retrievedObject[index]["data"]["equation_name"])
                this.addNoRender(e);
                this.elements[index].load(retrievedObject[index]["data"])
            }            
        }
        this.render();
    }
}

Stack = new Stack();


