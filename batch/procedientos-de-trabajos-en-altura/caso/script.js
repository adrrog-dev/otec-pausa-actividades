(function(){
  var D=window.__DATA__, app=document.getElementById('app');
  var byId={}; D.nodes.forEach(function(n){byId[n.id]=n;});
  var current=D.nodes[0].id, score=0, steps=0, first=true;
  function render(){
    var n=byId[current];
    var html='<div class="pad">';
    if(first){html+='<h1>'+esc(D.title)+'</h1><p class="intro">'+esc(D.intro||'')+'</p>';first=false;}
    html+='<div class="situation">'+esc(n.situation)+'</div><div id="opts">';
    n.options.forEach(function(o,i){html+='<button class="opt" data-i="'+i+'">'+esc(o.text)+'</button>';});
    html+='</div></div>';app.innerHTML=html;
    Array.prototype.forEach.call(document.querySelectorAll('.opt'),function(b){b.onclick=function(){choose(parseInt(b.dataset.i,10));};});
  }
  function choose(i){
    var n=byId[current], o=n.options[i]; score+=(o.score||0); steps++;
    var html='<div class="outcome"><strong>Consecuencia:</strong> '+esc(o.outcome)+'<div class="fb">'+esc(o.feedback)+'</div></div>';
    html+='<button class="btn" id="cont">Continuar</button>';
    document.getElementById('opts').innerHTML=html;
    document.getElementById('cont').onclick=function(){
      if(o.next===null||o.next===undefined||!byId[o.next]){final();}else{current=o.next;render();}
    };
  }
  function final(){
    var avg=steps?score/steps:0;
    var verdict=avg>=0.5?'Desempeño sólido. Tomaste decisiones alineadas con las buenas prácticas.':(avg>=0?'Desempeño aceptable, con espacio para mejorar.':'Conviene repasar el contenido: varias decisiones fueron poco adecuadas.');
    app.innerHTML='<div class="pad final"><h2>Análisis de desempeño</h2><p class="meter">'+(avg>=0.5?'★★★':avg>=0?'★★':'★')+'</p><p>'+esc(verdict)+'</p><p>'+esc(D.finalAnalysis||'')+'</p><button class="btn alt" id="again">Repetir caso</button></div>';
    document.getElementById('again').onclick=function(){current=D.nodes[0].id;score=0;steps=0;first=true;render();};
  }
  function esc(s){return String(s==null?'':s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  render();
})();