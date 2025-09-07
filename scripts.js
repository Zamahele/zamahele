const toggle=document.querySelector('.mobile-toggle');
const menu=document.querySelector('.mobile-menu');
if(toggle){toggle.addEventListener('click',()=>menu.classList.toggle('open'));}
