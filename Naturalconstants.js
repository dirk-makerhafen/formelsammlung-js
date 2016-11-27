// TODO implement me
function NatualConstant(name,description,value,unit){
    this.name = name;
    this.description = description;
    this.value = value;
    this.unit = unit;
    this.render = function(){
        var r = Mustache.render($('#NatualConstantTemplate').html(), this);
        return r;
    }
    this.renderDescription = function(){
        return markdown.toHTML(this.description);    
    }   

}


function NatualConstants(){    
    // search
    // render
}


var NatualConstants = new NatualConstants();
