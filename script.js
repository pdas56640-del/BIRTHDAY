const pages=[...document.querySelectorAll('.page')];
function showPage(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));document.querySelector('.page.active')?.scrollTo(0,0);window.scrollTo(0,0);}
document.querySelectorAll('.next').forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.next)));
document.querySelector('.next-letter').addEventListener('click',e=>{e.stopPropagation();showPage('final')});

const music=document.getElementById('music'),musicBtn=document.getElementById('musicBtn');
async function playMusic(){try{await music.play();musicBtn.textContent='🎵 Hangover playing';}catch(e){musicBtn.textContent='🎵 Tap for Hangover';}}
musicBtn.addEventListener('click',()=>music.paused?playMusic():(music.pause(),musicBtn.textContent='▶️ Play Hangover'));
document.addEventListener('pointerdown',()=>{if(music.paused)playMusic()},{once:true});

const scratchEmojis=['😘','💋','🫶','💗','✨','🥹','👀','😏','🦋','💞'];
function emojiBurst(x,y){for(let i=0;i<20;i++){const e=document.createElement('span');e.className='emoji';e.textContent=scratchEmojis[Math.floor(Math.random()*scratchEmojis.length)];e.style.left=x+'px';e.style.top=y+'px';e.style.setProperty('--dx',(Math.random()*280-140)+'px');e.style.setProperty('--dy',(Math.random()*-250-40)+'px');e.style.fontSize=(20+Math.random()*22)+'px';document.getElementById('emojiLayer').appendChild(e);setTimeout(()=>e.remove(),1400)}}
function setupScratch(card){const canvas=card.querySelector('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});let drawing=false,revealed=false,steps=0;
function resize(){const r=card.getBoundingClientRect(),d=Math.max(1,devicePixelRatio||1);canvas.width=Math.max(1,Math.floor(r.width*d));canvas.height=Math.max(1,Math.floor(r.height*d));canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#c7c0c4';ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='#766a70';ctx.font='800 17px DM Sans';ctx.textAlign='center';ctx.fillText('SCRATCH ME ✨',r.width/2,r.height/2+6)}
resize();new ResizeObserver(resize).observe(card);
function pos(ev){const r=canvas.getBoundingClientRect();return{x:ev.clientX-r.left,y:ev.clientY-r.top}}
function scratch(ev){if(revealed)return;const p=pos(ev);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(p.x,p.y,27,0,Math.PI*2);ctx.fill();steps++;if(steps%5===0){const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<d.length;i+=4)if(d[i]<80)clear++;if(clear/(d.length/4)>.42){revealed=true;card.classList.add('revealed');emojiBurst(ev.clientX,ev.clientY)}}}
canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);scratch(e)});canvas.addEventListener('pointermove',e=>{if(drawing)scratch(e)});canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false)}
document.querySelectorAll('.scratch-card').forEach(setupScratch);

const quiz=[
{q:'What color outfit was I wearing on the first day we met?',o:['Wine','Yellow','Blue','Black'],a:0},
{q:'When is my birthday?',o:['13th','15th','25th','7th'],a:0},
{q:'What do I love most about you?',o:['Your personality','Your looks','Your height','Your eyes','Everything about you ❤️'],a:4},
{q:'What was the first thing I noticed about you?',o:['Your smile','Your eyes','Your personality','Your voice'],a:2},
{q:'What is my favorite thing to do with you?',o:['Talk for hours','Go out together','Take pictures','Just spend time together'],a:3},
{q:'What makes me happiest when I’m with you?',o:['Your attention','Your jokes','Your hugs','Just having you around'],a:3},
{q:'What nickname do I like calling you the most?',o:['Baby','Love','Sunny','Something else ❤️'],a:2},
{q:'What kind of date would I enjoy the most?',o:['Romantic dinner','Movie night','Long drive','A simple day together'],a:3},
{q:'What do I love receiving from you the most?',o:['Flowers 🌹','Gifts 🎁','Sweet messages 💌','Your time and attention'],a:3},
{q:'What is my favorite memory with you?',o:['Our first meeting','Our first conversation','A special moment we shared','All our little moments together 🥰'],a:0},
{q:'If I had to describe our relationship in one word, what would it be?',o:['Beautiful','Special','Complicated','Unforgettable ❤️'],a:0},
{q:'What is the one thing about you that I find most attractive?',o:['Your eyes','Your smile','Your voice','Your personality'],a:0},
{q:'If we could go anywhere together, where would I choose?',o:['Maldives','Barcelona','Paris','Goa'],a:1}
];
let qi=0,score=0,locked=false;const quizContent=document.getElementById('quizContent'),qNum=document.getElementById('questionNumber'),scoreText=document.getElementById('scoreText'),bar=document.getElementById('progressBar'),msg=document.getElementById('quizMessage'),next=document.getElementById('quizNext');
function quizBurst(set){for(let i=0;i<24;i++){setTimeout(()=>{const e=document.createElement('span');e.className='emoji';e.textContent=set[Math.floor(Math.random()*set.length)];e.style.left=(10+Math.random()*80)+'vw';e.style.top=(25+Math.random()*55)+'vh';e.style.setProperty('--dx',(Math.random()*180-90)+'px');e.style.setProperty('--dy',(Math.random()*-180-30)+'px');e.style.fontSize=(22+Math.random()*25)+'px';document.getElementById('emojiLayer').appendChild(e);setTimeout(()=>e.remove(),1300)},i*30)}}
function renderQuiz(){locked=false;next.classList.add('hidden');msg.textContent='';const q=quiz[qi];qNum.textContent=`Question ${qi+1} / ${quiz.length}`;scoreText.textContent=`Score: ${score}`;bar.style.width=((qi)/quiz.length*100)+'%';quizContent.innerHTML=`<div class="question"><h3>${q.q}</h3><div class="answers">${q.o.map((v,i)=>`<button class="answer" data-i="${i}">${String.fromCharCode(65+i)}) ${v}</button>`).join('')}</div></div>`;quizContent.querySelectorAll('.answer').forEach(b=>b.addEventListener('click',()=>answer(+b.dataset.i,b)))}
function answer(i,clicked){if(locked)return;locked=true;const q=quiz[qi],buttons=[...quizContent.querySelectorAll('.answer')];buttons.forEach((b,n)=>{b.disabled=true;if(n===q.a)b.classList.add('correct')});if(i===q.a){score++;msg.textContent='Correct! Okayyy, points earned. 😘💋🫶';quizBurst(['😘','💋','🫶','💗','✨'])}else{clicked.classList.add('wrong');msg.textContent='Wrong! 😑💣💀 Your confidence has been noted.';quizBurst(['😑','💣','💀','🙄','😭'])}scoreText.textContent=`Score: ${score}`;next.textContent=qi===quiz.length-1?'See my score 💌':'Next question →';next.classList.remove('hidden')}
next.addEventListener('click',()=>{if(qi<quiz.length-1){qi++;renderQuiz()}else{showResult()}});
function showResult(){bar.style.width='100%';qNum.textContent='Test complete 💗';quizContent.innerHTML=`<div class="question"><div style="font-size:58px">🏆</div><h3>You scored ${score}/${quiz.length}</h3><p>${score===13?'Perfect score. Suspicious. 👀💗':score>=9?'Okayyy, you actually know me. Respect. 😌❤️':score>=6?'Not bad, Sunny. Revision class required. 😂':'We need to have a serious conversation about your memory. 😭'}</p></div>`;msg.textContent='';next.classList.remove('hidden');next.textContent='Okay, serious for 10 seconds. ❤️';next.onclick=()=>showPage('serious');quizBurst(['💗','✨','🫶','😘','💋'])}
renderQuiz();

const envWrap=document.getElementById('envelope');
function openEnvelope(){envWrap.classList.add('open');quizBurst(['💌','💗','✨','🫶'])}
document.getElementById('openEnvelope').addEventListener('click',()=>{showPage('letter');setTimeout(()=>document.getElementById('envelope').focus(),80)});
envWrap.addEventListener('click',e=>{if(e.target.closest('.next-letter'))return;openEnvelope()});
envWrap.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openEnvelope()}});

document.getElementById('replayBtn').addEventListener('click',()=>{window.location.reload()});
