

function Stack(){
    this.elements = []    
    
    this.add = function(element){
        if(element.constructor.name == "Quantity"){
            this.elements.push(new StackQuantity(this,element));
        }
        if(element.constructor.name == "Equation"){
            this.elements.push(new StackEquation(this,element));
        }
        if(element.constructor.name == "Material"){
            this.elements.push(new StackMaterial(this,element));
        }
        this.render();
    }
   
    this.remove = function(elementId){
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
    
}
