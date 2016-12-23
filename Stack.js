

function Stack(){
    this.constructorName = "Stack";

    this.elements = [];
    this.name = "";
    this.description = "";
    
    this.savedStack = undefined; // reference if stack is loaded from saved stacks    
    
    this.addNoRender = function(element){
        if(element.constructorName == "Quantity"){
            this.elements.push(new StackQuantity(this,element));
        }
        if(element.constructorName == "Equation"){
            this.elements.push(new StackEquation(this,element));
        }
        if(element.constructorName == "Material"){
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
            $(this).html(r).animate({'opacity': 1}, 150).queue(
                    function () {
                        CurrentStack.loadDragDrop();
                        $(this).dequeue();
                    }
                );            
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
        this.elements = [];
        this.name = "";
        this.description = "";
        this.savedStack = undefined;
        this.render();
    }
    
    this.save = function(){
        var result = [];
        for (var index = 0; index < this.elements.length; ++index) {
            var stackElement = this.elements[index];
            result[index] = {};
            var shorts = {"StackQuantity":"SQ","StackMaterial":"SM","StackEquation":"SE"}
            result[index]["t"] = shorts[stackElement.constructorName];
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
    
    this.showSaveChanges = function(){
        if( this.savedStack ==  undefined){
            return "none"
        }
        return "";
    }
    
    this.showSave = function(){
        if( this.savedStack !=  undefined){
            return "none"
        }
        return "";
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
    
    this.loadDragDrop = function(){
        $(".slides").sortable({
            placeholder: 'slide-placeholder',
            axis: "y",
            revert: 150,
            handle: '.glyphicon-resize-vertical',
            start: function(e, ui){
                placeholderHeight = ui.item.outerHeight();
                ui.placeholder.height(placeholderHeight + 15);
                $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
            },
            change: function(event, ui) {
                
                ui.placeholder.stop().height(0).animate({
                    height: ui.item.outerHeight() + 15
                }, 300);
                
                placeholderAnimatorHeight = parseInt($(".slide-placeholder-animator").attr("data-height"));
                
                $(".slide-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
                    height: 0
                }, 300, function() {
                    $(this).remove();
                    placeholderHeight = ui.item.outerHeight();
                    $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
                });
                
            },
            stop: function(e, ui) {
                
                $(".slide-placeholder-animator").remove();
                
                var x = $(".slides")[0].children;
                var index = 0;
                
                for(var i=0;i<x.length;i++){
                    var divid = x[i].getAttribute("stackelementid");
                    if(divid != null ){
                        if(divid!=CurrentStack.elements[index].id){
                            for(var y=0;y<CurrentStack.elements.length;y++){
                                if(CurrentStack.elements[y].id == divid){
                                    var tmp = CurrentStack.elements[index];
                                    CurrentStack.elements[index] = CurrentStack.elements[y];
                                    CurrentStack.elements[y] = tmp;
                                    break;
                                }
                            }
                        }
                        index++;
                    }
                }
                CurrentStack.render();  
            },
        });    
    }

  
}

CurrentStack = new Stack();

// name, description, and saved stack, not active stack object! 
SavedStack = function(savedStack,name,description){
    this.savedStack = savedStack;
    this.name = name;
    this.description = description;
    this.id = "SS_" + getUniqNumber();

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
    
    this.setName = function(name){
        this.name = name;
        if(CurrentStack.savedStack == this){
            CurrentStack.name = name;
            $("#CurrentStackDivId")[0].innerHTML = CurrentStack.name;
        }
    }
    
    this.setDescription = function(description){
        this.description = description
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

    this.elements = []; // list of stacks
    
    this.paginationPage = 1;
    this.paginationElementsPerPage = 6;
    this.filteredstacks = this.elements;
    
    this.get = function(elementId){
        return this.elements[this.getIndexOfElement(elementId)];
    }

    this.getIndexOfElement = function(elementId){
        for(var i=0;i<this.elements.length;++i){
            if(this.elements[i].id==elementId){
                return i;
            }
        }
        return undefined;
    }
    
    this.remove = function(elementId){
        var i = this.getIndexOfElement(elementId);
        if(this.elements[i] == CurrentStack.savedStack){
            CurrentStack.savedStack = undefined;
            CurrentStack.name = "";
            CurrentStack.description="";
        }
        this.elements.splice(i, 1);
        this.toLocalStorage();
        this.filteredstacks = this.elements;

        this.render();
        if(CurrentStack.savedStack==undefined){
            $(".saveStackChanges").hide();
            $(".saveStack").show();
        }else{
            $(".saveStackChanges").show();
            $(".saveStack").hide();        
        }
        if($("#CurrentStackDivId")[0] != undefined){
            $("#CurrentStackDivId")[0].innerHTML = CurrentStack.name;
        } 
    }
  
    this.setFilter = function(filter){
        this.filter = filter;
        this.filteredstacks = []
        this.paginationPage = 1;
        if(filter == ""){
            this.filteredstacks = this.elements;
        }else{
            
            for (var i = 0; i < this.elements.length; ++i) {               
                  if(this.elements[i].name.toLowerCase().indexOf(filter.toLowerCase()) != -1 && this.filteredstacks.indexOf(this.elements[i])==-1){this.filteredstacks.push(this.elements[i]); }
                    if(this.elements[i].description.toLowerCase().indexOf(filter.toLowerCase()) != -1 && this.filteredstacks.indexOf(this.elements[i])==-1){this.filteredstacks.push(this.elements[i]); }            }
        }
        this.render();
    }
  
    this.saveCurrentStack = function(forceNew){
        $("#MyStacksTabSelect")[0].click()
        this.setFilter("");
        $("#StacksSearchInput")[0].value = "";
        if(CurrentStack.savedStack == undefined || forceNew == true){
            if(forceNew==true){
                $("#saveNewButtonOk").show(250).delay(1000).hide(250);
            }else{
                $("#saveNewButtonOk").show(250).delay(1000).hide(250);
            }
            var s = new SavedStack(CurrentStack.save(),"","");
            this.elements.unshift(s);
            CurrentStack.savedStack = s;
            CurrentStack.name = "";
            CurrentStack.description ="";
        }else{
            $("#saveChangesButtonOk").show(250).delay(1000).hide(250);
            for(var i=0;i<this.elements.length;i++){
                if(CurrentStack.savedStack == this.elements[i]){
                    var e = this.elements[i];//new last saved element to top
                    this.elements.splice(i, 1);
                    this.elements.unshift(e); 
                    break;
                }
            }
            CurrentStack.savedStack.savedStack = CurrentStack.save();
        }
        this.render();
        this.toLocalStorage();
        $(".saveStack").hide();
        $(".saveStackChanges").show();
        $("#StacksPagination").children().eq(1).stop().animate({ borderColor: "green" }, 600).delay(1000).animate({ borderColor: "#ddd" }, 1200);
        $("#CurrentStackDivId")[0].innerHTML = CurrentStack.name;
    }
    
    this.loadCurrentStack = function(elementId){
        CurrentStack.clear();
        var e = this.elements[this.getIndexOfElement(elementId)];
        CurrentStack.load(e.savedStack)
        CurrentStack.name = e.name;
        CurrentStack.description = e.description;
        CurrentStack.savedStack = e;
        CurrentStack.render();
    }
    
    this.toLocalStorage = function(){
        var s = []
        for(var i=0;i<this.elements.length;++i){
            s[i] = this.elements[i].save();
        }
        localStorage.setItem('formelsammlung-js-data', JSON.stringify(s));
    }
    
    this.fromLocalStorage = function(){
        this.loadFromString(localStorage.getItem('formelsammlung-js-data'));
        
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
        this.filteredstacks = this.elements;
        this.render();
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
            + currentdate.getSeconds() + ".fsjs" ;
            
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
        this.filteredstacks = this.elements;
        
    }
    
    this._processUploadedFile = function(e){
        var file = e.target.result;
        if (file && file.length) {
            Stacks.loadFromString(file);
            Stacks.render();
        }
    }
    
    this.loadExamples = function(){
        var example = [{"name":"Some name","description":"Some \nSuer \ndesasd\n","savedStack":[{"t":"SQ","d":{"value":1,"id":"SQ_10","name":"var 11","qn":"Ampere"}},{"t":"SQ","d":{"value":1,"id":"SQ_12","name":"var 13","qn":"Volt"}},{"t":"SE","d":{"m":false,"name":"result 15","id":"SE_14","io":{"P":{"m":"OUTPUT"},"U":{"m":"SQ_12"},"I":{"m":"SQ_10"}},"eqn":"PUI"}}]}];
        for(var i=0;i<example.length;++i){
            var ss = new SavedStack();
            ss.load(example[i]);
            this.elements.push(ss);
        }
        this.filteredstacks = this.elements;
        
        this.render();
    }
    
    this.filteredStacksPagination = function(){
        var index = this.paginationElementsPerPage*(this.paginationPage-1);
        return this.filteredstacks.slice(index,index+ this.paginationElementsPerPage);
    }
    
    this.paginationMaxPages = function(){
        return math.ceil(this.filteredstacks.length / this.paginationElementsPerPage); 
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
        var r = Mustache.render($('#StacksTemplate').html(), this);
        document.getElementById(this.targetdiv).innerHTML = r;

        if(this.elements.length>0){
            $("#EmptyStackLoadExamples").hide();
        }else{
            $("#EmptyStackLoadExamples").show();
        }
        var x = $(".variableTextArea");
        for(var i=0;i<x.length;i++){
            var l = x[i].value.split(/\r*\n/).length * 22;
            x[i].style.height = l + "px";
            
        }
    }   
    
}


Stacks = new Stacks();
