if (window.VLibras) {
  new window.VLibras.Widget('https://vlibras.gov.br/app');
}

(function(){
 const $=id=>document.getElementById(id);
 const ids=['poolLength','poolWidth','poolDepth','tempStart','tempGoal','solarIrradiance','collectorArea','collectorEfficiency'];
 const fmt=(n,d=1)=>Number.isFinite(n)?n.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';

 function calculate(){
  const v=ids.map(id=>Number($(id).value));
  const [l,w,depth,t0,t1,irr,area,eff]=v;
  const invalid=v.some(x=>!Number.isFinite(x)||x<0)||l<=0||w<=0||depth<=0||irr<=0||area<=0||eff<=0||eff>90||t0>50||t1>50;
  const error=$('calcError');

  if(invalid){
   error.textContent='Confira os valores: use números positivos, eficiência entre 1% e 90% e temperaturas de até 50 °C.';
   ['volumeOut','energyOut','gainOut','daysOut'].forEach(id=>$(id).textContent='—');
   $('progressFill').style.width='0%';
   $('progressLabel').textContent='Corrija os campos para visualizar a estimativa.';
   return;
  }

  if(t1<=t0){
   error.textContent='A temperatura desejada precisa ser maior que a temperatura inicial para calcular o aquecimento.';
   ['volumeOut','energyOut','gainOut','daysOut'].forEach(id=>$(id).textContent='—');
   $('progressFill').style.width='0%';
   $('progressLabel').textContent='Ajuste as temperaturas.';
   return;
  }

  error.textContent='';
  const volume=l*w*depth;
  const delta=t1-t0;
  const energy=volume*1000*4.186*delta/3600;
  const gain=irr*area*(eff/100);
  const days=energy/gain;

  $('volumeOut').textContent=fmt(volume)+' m³';
  $('energyOut').textContent=fmt(energy)+' kWh';
  $('gainOut').textContent=fmt(gain)+' kWh/dia';
  $('daysOut').textContent=fmt(days)+' dias';
  $('progressFill').style.width=Math.min(100,Math.max(3,100/days))+'%';
  $('progressLabel').textContent='Prazo idealizado sem perdas: '+fmt(days)+' dia(s). Na prática, pode ser maior.';
 }

 ids.forEach(id=>$(id).addEventListener('input',calculate));

 $('resetCalc').addEventListener('click',()=>{
  ['10','5','1.4','22','28','4.5','10','50'].forEach((v,i)=>$(ids[i]).value=v);
  calculate();
 });

 calculate();

 const nav=$('mainNav');
 const menu=$('menuBtn');

 menu.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  menu.textContent=open?'✕':'☰';
 });

 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Abrir menu');
  menu.textContent='☰';
 }));

 let scale=1;

 function setScale(){
  document.documentElement.style.setProperty('--font-scale',scale);
 }

 function inc(){
  scale=Math.min(1.3,Math.round((scale+.1)*10)/10);
  setScale();
 }

 function dec(){
  scale=Math.max(.85,Math.round((scale-.1)*10)/10);
  setScale();
 }

 $('fontPlus').addEventListener('click',inc);
 $('fontUp').addEventListener('click',inc);
 $('fontDown').addEventListener('click',dec);

 function toggleContrast(){
  document.body.classList.toggle('high-contrast');
  const active=document.body.classList.contains('high-contrast');
  $('contrastToggle').setAttribute('aria-pressed',String(active));
 }

 $('contrastBtn').addEventListener('click',toggleContrast);
 $('contrastToggle').addEventListener('click',toggleContrast);

 $('dyslexiaBtn').addEventListener('click',()=>{
  const active=document.body.classList.toggle('dyslexia');
  $('dyslexiaBtn').setAttribute('aria-pressed',String(active));
 });

 $('resetAccess').addEventListener('click',()=>{
  scale=1;
  setScale();
  document.body.classList.remove('high-contrast','dyslexia');
  $('contrastToggle').setAttribute('aria-pressed','false');
  $('dyslexiaBtn').setAttribute('aria-pressed','false');
 });

 $('quizOptions').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
  $('quizFeedback').textContent=btn.dataset.correct==='true'
   ?'Correto! Painéis fotovoltaicos convertem a luz solar em energia elétrica.'
   :'Não é essa. Pense na diferença entre produzir calor diretamente e gerar eletricidade.';
 }));
})();
