const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const phrases = [
  "Building modern web apps.",
  "Turning ideas into products.",
  "Solving problems with code.",
  "Always learning. Always building."
];

let phraseIndex = 0, charIndex = 0, deleting = false;
const typed = $("#typed");

function typeWriter(){
  const phrase = phrases[phraseIndex];
  typed.textContent = deleting ? phrase.slice(0, --charIndex) : phrase.slice(0, ++charIndex);
  let speed = deleting ? 35 : 75;
  if (!deleting && charIndex === phrase.length) { speed = 1700; deleting = true; }
  else if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 400; }
  setTimeout(typeWriter, speed);
}
typeWriter();

const progress = $("#progressBar");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${Math.min(100, (scrollY / max) * 100)}%`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("in-view");
      if(entry.target.classList.contains("skill-list")) {
        $$(".skill", entry.target).forEach((s,i) => setTimeout(()=>s.classList.add("in-view"), i*120));
      }
    }
  });
},{threshold:.14});
$$(".reveal").forEach(el => revealObserver.observe(el));

const sections = $$("section[id]");
const navLinks = $$(".nav-link");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s => sectionObserver.observe(s));

const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme");
if(savedTheme === "light") document.body.classList.add("light");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("portfolio-theme", document.body.classList.contains("light") ? "light" : "dark");
});

const mobileMenu = $("#mobileMenu"), mobileNav = $("#mobileNav");
mobileMenu.addEventListener("click", () => mobileNav.classList.toggle("open"));
$$(".mobile-nav a").forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("open")));

document.addEventListener("mousemove", e => {
  const glow = $(".cursor-glow");
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

$$(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX-r.left-r.width/2)*.12;
    const y = (e.clientY-r.top-r.height/2)*.12;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener("mouseleave", () => btn.style.transform = "");
});

$$("[data-count]").forEach(el => {
  const target = +el.dataset.count;
  const counterObserver = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting){
      let n=0, step=Math.max(1,Math.ceil(target/35));
      const timer=setInterval(()=>{ n=Math.min(target,n+step); el.textContent=n; if(n>=target) clearInterval(timer); },35);
      counterObserver.disconnect();
    }
  });
  counterObserver.observe(el);
});

// Subtle 3D movement for the hero photo.
const frame = $(".photo-frame");
document.addEventListener("mousemove", e => {
  if(innerWidth < 900 || !frame) return;
  const x = (innerWidth/2-e.clientX)/70;
  const y = (innerHeight/2-e.clientY)/70;
  frame.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
});
document.addEventListener("mouseleave",()=>{if(frame) frame.style.transform=""});
