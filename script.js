'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');navigation.classList.remove('open');document.body.style.overflow='';}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open);document.body.style.overflow=open?'hidden':'';});
document.querySelector('.wordmark').addEventListener('click',closeMenu);
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){closeMenu();menuButton.focus();}});
matchMedia('(min-width:721px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
navigation.addEventListener('keydown',event=>{if(event.key==='Tab'&&navigation.classList.contains('open')){const last=navigation.querySelector('.nav-cta');if(event.target===last&&!event.shiftKey){event.preventDefault();menuButton.focus();}}});
menuButton.addEventListener('keydown',event=>{if(event.key==='Tab'&&event.shiftKey&&navigation.classList.contains('open')){event.preventDefault();navigation.querySelector('.nav-cta').focus();}});
const cards = [...document.querySelectorAll('.project')];
const filters = [...document.querySelectorAll('[data-filter]')];
function matchesDomain(card, domain) {
  return domain === 'All Work' || card.dataset.domains.split('|').includes(domain);
}
function selectDomain(domain) {
  const visible = cards.filter(card => matchesDomain(card, domain));
  cards.forEach(card => {
    card.hidden = !visible.includes(card);
    card.classList.toggle('wide', visible.length % 2 === 1 && card === visible.at(-1));
  });
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === domain)));
  document.querySelector('#filter-status').textContent = 'Showing ' + visible.length + ' projects in ' + domain + '.';
}
filters.forEach(button => {
  const domain = button.dataset.filter;
  button.textContent = domain + ' (' + cards.filter(card => matchesDomain(card, domain)).length + ')';
  button.addEventListener('click', () => selectDomain(domain));
});
selectDomain('All Work');
const dialog=document.querySelector('#project-dialog');
let opener;
const projects = [
  {
    "image": "earthquake-tectonic-map.jpg",
    "secondary": [
      "tectonic-map.jpg"
    ]
  },
  {
    "image": "fulani-mobility-map.jpg"
  },
  {
    "image": "subsurface-velocity-sections.jpg"
  },
  {
    "image": "seismometer-deployment-figure5.jpg",
    "secondary": [
      "seismometer-deployment-figure6.jpg"
    ]
  },
  {
    "image": "Institutionalization.jpg"
  },
  {
    "image": "Deep_Deeper_Deepest_NL.jpg"
  },
  {
    "image": "tectonic-map.jpg",
    "video": "tectonic-earthquake.mp4"
  },
  {
    "image": "seismic-wave-velocities.jpg",
    "video": "seismic-waves.mp4"
  },
  {
    "image": "fault-movement-graphic.png",
    "video": "fault-movement.mp4"
  }
];
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const p=projects[Number(button.dataset.project)];
 if(!p)return;
 opener=button;
 const card = button.closest('.project');
 const title = card.querySelector('h3').textContent;
 document.querySelector('#dialog-title').textContent=title;
 document.querySelector('#dialog-category').textContent=card.querySelector('.project-meta').innerText.replace(/\n+/g, ' · ');
 document.querySelector('#dialog-description').textContent=card.querySelector('p').textContent;
 const img=document.querySelector('#dialog-image');
 img.src='assets/'+p.image;
 img.alt=(["Maps of earthquake epicentres, tectonic structures and seismic stations", "Map of Fulani movement routes and destinations", "Colour-coded cross-sections of subsurface seismic velocities", "Diagram of seismometer deployment and sensor positioning", "Thesis jacket with concentric rings and a network of connected nodes", "Thesis jacket showing geological maps and a cutaway of the Dutch subsurface", "Tectonic map showing earthquake locations", "Diagram comparing seismic wave travel through fast and slow materials", "Diagram of fault displacement and deformation of the ground surface"])[Number(button.dataset.project)];
 const gallery=document.querySelector('#dialog-gallery');gallery.replaceChildren();
 (p.secondary||[]).forEach(name=>{const pic=document.createElement('img');pic.src='assets/'+name;pic.alt=name === 'tectonic-map.jpg' ? 'Map of tectonic structures and earthquake activity' : 'Additional field configuration diagram for seismometer deployment';pic.loading='lazy';gallery.appendChild(pic);});
 const video=document.querySelector('#dialog-video');video.pause();video.removeAttribute('src');video.load();
 if(p.video){video.src='assets/'+p.video;video.hidden=false;}else{video.hidden=true;}
 dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';
}));
function closeProject(){dialog.close();}
document.querySelector('.dialog-close').addEventListener('click',closeProject);
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;
 const bounds=dialog.getBoundingClientRect();
 if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeProject();});
dialog.addEventListener('close',()=>{const video=document.querySelector('#dialog-video');video.pause();document.body.style.overflow='';if(document.activeElement===document.body)opener?.focus({preventScroll:true});});
document.querySelector('#dialog-contact').addEventListener('click', event => {
  event.preventDefault();
  closeProject();
  location.hash = 'contact';
  document.querySelector('#contact').scrollIntoView();
  document.querySelector('#contact input').focus({preventScroll: true});
});
const form=document.querySelector('#contact-form');
const statusText = document.querySelector('#form-status');
const send = form.querySelector('.send-button');
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (send.disabled) return;
  const data = Object.fromEntries(new FormData(form));
  for (const name of ['name', 'message']) {
    const input = form.elements[name];
    input.setCustomValidity(input.value.trim().length < (name === 'message' ? 10 : 1) ? 'Please enter ' + (name === 'message' ? 'at least 10 characters.' : 'your name.') : '');
  }
  if (!form.reportValidity()) return;
  send.disabled = true;
  send.firstChild.textContent = 'Sending… ';
  form.setAttribute('aria-busy', 'true');
  statusText.textContent = 'Sending your message…';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok && result.sent === true) {
      form.reset();
      statusText.textContent = 'Thanks — your message is on its way. We’ll reply within 2 business days.';
    } else {
      statusText.textContent = result.error || 'Your message didn’t send. Please try again.';
    }
  } catch {
    statusText.textContent = 'Your message didn’t send. Please try again.';
  } finally {
    send.disabled = false;
    send.firstChild.textContent = 'Send Message ';
    form.removeAttribute('aria-busy');
  }
});
form.addEventListener('input', event => event.target.setCustomValidity?.(''));
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.section-intro,.project,.tool-row,.quotes figure').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}

// Service panels lead to the corresponding portfolio category.
document.querySelectorAll('[data-service-filter]').forEach(link=>link.addEventListener('click',()=>{const button=Array.from(document.querySelectorAll('[data-filter]')).find(item=>item.dataset.filter===link.dataset.serviceFilter);button?.click();}));

// Keep cover videos playing only when visible; respect reduced motion.
const coverVideos = document.querySelectorAll('.project-cover-video');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const visibleCovers = new Set();
function syncCoverVideos(){coverVideos.forEach(v=>{v.muted=true;if(visibleCovers.has(v)&&!motionPreference.matches&&!document.hidden&&!dialog.open){if(!v.hasAttribute("src"))v.src=v.dataset.src;v.play().catch(()=>{});}else{v.pause();}});}
if('IntersectionObserver' in window){const coverObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)visibleCovers.add(e.target);else visibleCovers.delete(e.target);});syncCoverVideos();},{threshold:0.1});coverVideos.forEach(v=>coverObserver.observe(v));}else{coverVideos.forEach(v=>visibleCovers.add(v));syncCoverVideos();}
motionPreference.addEventListener('change',syncCoverVideos);document.addEventListener('visibilitychange',syncCoverVideos);dialog.addEventListener('close',syncCoverVideos);new MutationObserver(syncCoverVideos).observe(dialog,{attributes:true,attributeFilter:['open']});

// Reflect the current anchor when opening a shared link or using browser history.
function updateNavigationPills() {
 const section = window.location.hash || '#top';
 document.querySelectorAll('.nav-sections a').forEach(link => {
  if (link.getAttribute('href') === section) {
   link.setAttribute('aria-current', 'location');
  } else {
   link.removeAttribute('aria-current');
  }
 });
}
window.addEventListener('hashchange', updateNavigationPills);
updateNavigationPills();
