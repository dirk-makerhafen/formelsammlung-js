

function Stack(){
    this.elements = [];
    this.name = "";
    this.description = "";
    
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
    this.showSubmenu = function(){
        if(this.elements.length==0){return "none";}else{return "";}
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
            var shorts = {"StackQuantity":"SQ","StackMaterial":"SM","StackEquation":"SE"}
            result[index]["t"] = shorts[stackElement.constructor.name];
            result[index]["d"] = stackElement.save();
        }
        return result;
    }
    
    this.getLinkData = function(){   
        var uncompressed = JSON.stringify(this.save());
        //alert("Size of uncompressed sample is: " + uncompressed.length);
        var compressed = LZString.compressToEncodedURIComponent(uncompressed);
        //alert("Size of compressed sample is: " + compressed.length);
        //var compressed = LZString.compressToUTF16 (uncompressed);
        //alert("Size of compressed sample is: " + compressed.length);
        //var compressed = LZString.compressToBase64  (uncompressed);
        //alert("Size of compressed sample is: " + compressed.length);
        return compressed;
    }
    
    this.renderPrint = function(){
        var r = Mustache.render($('#StackPrintTemplate').html(), this);
        document.getElementById("printerCache").innerHTML = r;
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,"printerCache"]);

    }   
    
    
    this.load = function(data){
        this.clear();
        for (var index = 0; index < data.length; ++index) {
            if(data[index]["t"] == "SQ"){
                var q=Quantities.get(data[index]["d"]["qn"])
                this.addNoRender(q);
                this.elements[index].load(data[index]["d"])
            }
            if(data[index]["t"] == "SM"){
                var m=Materials.get(data[index]["d"]["mn"])
                this.addNoRender(m);
                this.elements[index].load(data[index]["d"])
            }
            if(data[index]["t"] == "SE"){
                var e=Equations.get(data[index]["d"]["eqn"])
                this.addNoRender(e);
                this.elements[index].load(data[index]["d"])
            }            
        }
        this.render();
        
    }
}

CurrentStack = new Stack();

// name, description, and saved stack, not active stack object! 
SavedStack = function(savedStack,name,description){
    this.savedStack = savedStack;
    this.name = name;
    this.description = description;
    
    this.save = function(){
        return {
            "name" : this.name,
            "description" : this.description, 
            "savedStack" : this.savedStack,
        }
    
    }
    this.load = function(data){
        this.savedStack = data["savedStack"];
        this.description = data["description"];
        this.name = data["name"];
        
    }
    
    this.render = function(){
        var r = Mustache.render($('#SavedStackTemplate').html(), this);
        return r;
    }   
    
    this.getLinkData = function(){   
        return LZString.compressToEncodedURIComponent(JSON.stringify(this.savedStack));
    }
        
    
}

Stacks = function(){
    this.targetdiv = "StacksList";

    this.elements = [] // list of stacks
    
    this.get = function(name){
        return this.elements[this.getIndexOfElement(name)];
    }
    this.getIndexOfElement = function(name){
        for(var i=0;i<this.elements.length;++i){
            if(this.elements[i].name==name){
                return i;
            }
        }
        return undefined;
    }
    
    this.remove = function(name){
        this.elements.splice(this.getIndexOfElement(name), 1);
        this.toLocalStorage();
        this.render();
    }
    
    this.saveCurrentStack = function(){
        var s = new SavedStack(CurrentStack.save(),"test","foobar");
        this.elements.push(s);
        this.toLocalStorage();
        this.render();
    }
    
    this.loadCurrentStack = function(name){
        CurrentStack.clear();
        CurrentStack.load(this.elements[this.getIndexOfElement(name)].savedStack)
        CurrentStack.render();
    }
    
    this.toLocalStorage = function(){
        var s = []
        for(var i=0;i<this.elements.length;++i){
            s[i] = this.elements[i].save();
        }
        localStorage.setItem('testObject', JSON.stringify(s));
    }
    
    this.fromLocalStorage = function(){
        this.loadFromString(localStorage.getItem('testObject'));
        
    }
    this.loadFromString = function(st){
        var s = JSON.parse(st);
        if(s==null || s==undefined){return;}
        for(var i=0;i<s.length;++i){
            var ss = new SavedStack();
            ss.load(s[i]);
            this.elements.push(ss);
        }
    }
    
    this.init = function(){
        this.fromLocalStorage();
        this.render();
        if(this.elements.length == 0){
            $("#MyStacksTab").hide();
        }else{
            $("#MyStacksTab").show();
        }
        
    }
    
    this.download = function(){
        var s = []
        for(var i=0;i<this.elements.length;++i){
            s[i] = this.elements[i].save();
        }
        
        var currentdate = new Date(); 
        var filename = "formelsammlung-js_" + currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/" 
            + currentdate.getFullYear() + " @ "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
            
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(s)));
        element.setAttribute('download',filename);
        element.style.display = 'none';
        
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    }
    this.upload = function(){
        if (!window.FileReader) { alert('Your browser is not supported') }
        var input = $('#StackUploadFile').get(0);        
        var reader = new FileReader();
        if (input.files.length) {
            reader.readAsText(input.files[0]);
            $(reader).on('load', this._processUploadedFile);
        } else {
            alert('Please upload a file before continuing')
        } 
    }
    
    this._processUploadedFile = function(e){
        var file = e.target.result;
        if (file && file.length) {
            Stacks.loadFromString(file);
            Stacks.render();
        }
    }
    
    this.render = function(){
        var r = Mustache.render($('#StacksTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;
    }   
    
}


Stacks = new Stacks();
