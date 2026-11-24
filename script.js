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
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.filter;let count=0;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.project').forEach(project=>{project.hidden=category!=='All Work'&&project.dataset.category!==category;if(!project.hidden)count++;project.classList.add('visible');});document.querySelector('.project-grid').classList.toggle('filtered',category!=='All Work');document.querySelector('#filter-status').textContent=`Showing ${count} projects${category==='All Work'?'':` in ${category}`}.`;}));
const dialog=document.querySelector('#project-dialog');
let opener;
const projects=[{"title": "Earthquake & Tectonic Distribution Maps", "category": "Geo-Vis & Maps", "description": "Scientific maps visualizing earthquake occurrence, tectonic structures and seismological station distribution. Carefully layered cartography makes spatial relationships across geological datasets easier to interpret.", "image": "earthquake-tectonic-map.jpg", "secondary": ["tectonic-map.jpg"], "label": "GEOSPATIAL CARTOGRAPHY"}, {"title": "Fulani Mobility & Trajectory Map", "category": "Geo-Vis & Maps", "description": "A mobility map tracing trajectories and destinations while illustrating the factors that shape movement patterns. The cartographic design supports a clearer reading of spatial routes and their relationships.", "image": "fulani-mobility-map.jpg", "label": "MOBILITY MAPPING"}, {"title": "Subsurface Velocity Model — Cross-Sections", "category": "Data Visualization", "description": "A scientific data visualization of subsurface seismic velocity models, using cross-sectional views to communicate changes in the structure and properties of material beneath the surface.", "image": "subsurface-velocity-sections.jpg", "label": "GEOPHYSICAL DATA VISUALIZATION"}, {"title": "Seismometer Deployment Illustrations", "category": "Scientific Illustration", "description": "Technical illustrations documenting seismometer sensor deployment and field configuration. The diagrams clarify instrument positioning and installation through structured scientific visual communication.", "image": "seismometer-deployment-figure5.jpg", "secondary": ["seismometer-deployment-figure6.jpg"], "label": "TECHNICAL ILLUSTRATION"}, {"title": "Drift, Actor-Networks, and Structuration", "category": "Thesis Covers", "description": "A thesis cover exploring planning-support systems institutionalization in Rwanda. Concentric patterns meet interconnected networks, referencing the relationship between spatial planning processes, actors and institutions. Designed for Deborah Adeola Oyeku, University of Twente — ITC.", "image": "Institutionalization.jpg", "label": "THESIS COVER DESIGN"}, {"title": "Deep, Deeper, Deepest-NL", "category": "Thesis Covers", "description": "A research thesis cover depicting the crust and upper mantle of the Netherlands. Geological maps, seismic profiles and an illustrated subsurface scene bring the scientific subject into a cohesive visual narrative. Designed for Stephen Akínwùmí Akínrẹmí, University of Twente — ITC.", "image": "Deep_Deeper_Deepest_NL.jpg", "label": "THESIS COVER DESIGN"}, {"title": "Tectonic Earthquakes — Animated", "category": "Illustration & Animation", "description": "A scientific motion visualization showing the spatial relationship between tectonic activity and earthquake occurrence. Animated mapping helps communicate geologic activity over time.", "image": "tectonic-map.jpg", "video": "tectonic-earthquake.mp4", "label": "SCIENTIFIC ANIMATION"}, {"title": "Seismic Wave Speed — Fast & Slow", "category": "Illustration & Animation", "description": "An explanatory visualization showing how seismic waves propagate through high- and low-velocity Earth materials toward seismic receivers. The illustration supports an understanding of wave travel and varying subsurface conditions.", "image": "seismic-wave-velocities.jpg", "video": "seismic-waves.mp4", "label": "GEOPHYSICAL MOTION CONCEPT"}, {"title": "Fault Movement & Earthquake Formation", "category": "Illustration & Animation", "description": "A geological visualization exploring fault movement, the generation of earthquakes and the resulting changes at the surface. Composed to explain connections between subsurface processes and visible land deformation.", "image": "fault-movement-graphic.png", "video": "fault-movement.mp4", "label": "GEOLOGICAL ANIMATION CONCEPT"}];
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const p=projects[Number(button.dataset.project)];
 if(!p)return;
 opener=button;
 document.querySelector('#dialog-title').textContent=p.title;
 document.querySelector('#dialog-category').textContent=p.category.toUpperCase();
 document.querySelector('#dialog-description').textContent=p.description;
 const img=document.querySelector('#dialog-image');
 img.src='assets/'+p.image;
 img.alt=p.title+' — full original artwork';
 const gallery=document.querySelector('#dialog-gallery');gallery.replaceChildren();
 (p.secondary||[]).forEach(name=>{const pic=document.createElement('img');pic.src='assets/'+name;pic.alt='Additional original artwork for '+p.title;pic.loading='lazy';gallery.appendChild(pic);});
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
document.querySelector('#dialog-contact').addEventListener('click',()=>{closeProject();document.querySelector('#contact input').focus({preventScroll:true});});
const form=document.querySelector('#contact-form');
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const enquiry=`Project enquiry — Akin Visuals\n\nName: ${data.get('name').trim()}\nEmail: ${data.get('email').trim()}\nProject type: ${data.get('type')}\n\n${data.get('message').trim()}`;document.querySelector('#enquiry-preview').value=enquiry;document.querySelector('#form-result').hidden=false;document.querySelector('#form-status').textContent='Your enquiry is ready to copy. No message has been sent.';document.querySelector('#enquiry-preview').focus();});
document.querySelector('#copy-enquiry').addEventListener('click',async()=>{const preview=document.querySelector('#enquiry-preview');try{await navigator.clipboard.writeText(preview.value);document.querySelector('#form-status').textContent='Enquiry copied. No message has been sent.';}catch{preview.focus();preview.select();document.querySelector('#form-status').textContent='Select and copy the enquiry below using your device’s copy command.';}});
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
