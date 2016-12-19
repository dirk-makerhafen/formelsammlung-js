disqus_loaded = false;

function init_disqus(newidentifier) { 
    if(newidentifier == undefined){ newidentifier = "general";}
    disqus_config = function () {
        this.page.url =        "https://dirk-attraktor.github.io/formelsammlung-js/#!"+newidentifier;;
        this.page.identifier = "https://dirk-attraktor.github.io/formelsammlung-js/#!"+newidentifier;;
    }
    var d = document, s = d.createElement('script');
    s.src = '//formelsammlung-js.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    disqus_loaded = true;
};

function reload_disqus(newidentifier){
    if(disqus_loaded==false){
        init_disqus(newidentifier);
    }else{
        DISQUS.reset({
          reload: true,
          config:  function () {
            this.page.url =        "https://dirk-attraktor.github.io/formelsammlung-js/#!"+newidentifier;   
            this.page.identifier = "https://dirk-attraktor.github.io/formelsammlung-js/#!"+newidentifier;
          }
        });
    }
    
}

function load_disqus_modal(element,identifier){
    $('#disqusModalPreview')[0].innerHTML = element.renderDescription();
    $('#disqusModalTitle')[0].innerHTML = "<b>" + element.name_translation() + "</b>";
    jQuery("#disqus_thread").detach().appendTo('#disqusModalBody')
    reload_disqus(element.constructorName + "_" + identifier);
}

 function load_disqus_footer(){
    $('#disqusModalPreview')[0].innerHTML = "";
    $('#disqusModalTitle')[0].innerHTML = "";
    jQuery("#disqus_thread").detach().appendTo('#disqus_general_thread')
    reload_disqus("general");
}   