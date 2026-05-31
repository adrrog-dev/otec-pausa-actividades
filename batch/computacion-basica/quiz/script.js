(function(){
  var D=window.__DATA__, app=document.getElementById('app');
  var idx=0, score=0, answered=false, total=D.questions.reduce(function(a,q){return a+(q.points||20)},0);
  function render(){
    var q=D.questions[idx];
    var pct=Math.round((idx/D.questions.length)*100);
    var html='<div class="progress"><div class="bar" style="width:'+pct+'%"></div></div><div class="pad">';
    if(idx===0&&!answered){html+='<h1>'+esc(D.title)+'</h1><p class="intro">'+esc(D.intro||'')+'</p>';}
    html+='<div class="score">Pregunta '+(idx+1)+' de '+D.questions.length+' · Puntaje: '+score+'</div>';
    html+='<div class="q">'+esc(q.q)+'</div><div id="opts">';
    q.options.forEach(function(o,i){html+='<button class="opt" data-i="'+i+'">'+esc(o)+'</button>';});
    html+='</div><div id="fb"></div></div>';
    app.innerHTML=html;
    Array.prototype.forEach.call(document.querySelectorAll('.opt'),function(b){b.onclick=function(){choose(parseInt(b.dataset.i,10));};});
  }
  function choose(i){
    if(answered)return; answered=true;
    var q=D.questions[idx], ok=i===q.correctIndex;
    var opts=document.querySelectorAll('.opt');
    opts[q.correctIndex].classList.add('correct');
    if(!ok)opts[i].classList.add('wrong');
    if(ok)score+=(q.points||20);
    var fb=document.getElementById('fb');
    fb.className='fb '+(ok?'ok':'ko');
    fb.innerHTML=(ok?'✓ ':'✗ ')+esc(ok?q.feedbackOk:q.feedbackKo)+'<br><button class="btn" id="next">'+(idx+1<D.questions.length?'Siguiente':'Ver resultado')+'</button>';
    document.getElementById('next').onclick=next;
    save(i,ok);
  }
  function next(){answered=false;idx++;if(idx<D.questions.length)render();else final();}
  function final(){
    var pct=total?Math.round((score/total)*100):0;
    app.innerHTML='<div class="pad final"><h2>Resultado</h2><p class="big">'+score+' / '+total+'</p>'+
      '<p>'+(pct>=70?'¡Muy bien! Has aprobado la actividad.':'Repasa el contenido e inténtalo nuevamente.')+'</p>'+
      '<button class="btn alt" id="again">Repetir</button></div>';
    document.getElementById('again').onclick=function(){idx=0;score=0;answered=false;render();};
  }
  function save(i,ok){try{var k='pausa_quiz_'+(D.title||'q');var log=JSON.parse(localStorage.getItem(k)||'[]');log.push({q:idx,opt:i,ok:ok,t:Date.now()});localStorage.setItem(k,JSON.stringify(log));}catch(e){}}
  function esc(s){return String(s==null?'':s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  render();
})();