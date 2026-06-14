/* =========================
   SCROLL PROGRESS BAR
========================= */

window.addEventListener("scroll", () => {

    const winScroll =
        document.body.scrollTop ||
        document.documentElement.scrollTop;

    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const scrolled =
        (winScroll / height) * 100;

    const progress =
        document.getElementById("progress-bar");

    if(progress){
        progress.style.width =
            scrolled + "%";
    }

});

/* =========================
   SCROLL TO TOP BUTTON
========================= */

const scrollBtn =
    document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {

    if(!scrollBtn) return;

    if(window.scrollY > 400){

        scrollBtn.style.display = "block";

    }else{

        scrollBtn.style.display = "none";

    }

});

if(scrollBtn){

    scrollBtn.addEventListener("click", () => {

        window.scrollTo({

            top:0,
            behavior:"smooth"

        });

    });

}

/* =========================
   KPI COUNTERS
========================= */

const counters =
    document.querySelectorAll(".counter");

const animateCounter = (counter) => {

    const target =
        +counter.getAttribute("data-target");

    const speed = 40;

    // preserve suffix tag (e.g. <i>%</i>) if present
    const suffixEl =
        counter.querySelector("i");
    const suffix =
        suffixEl ? suffixEl.outerHTML : "";

    let current = 0;

    const updateCounter = () => {

        if(current < target){

            current += Math.ceil(
                target / speed
            );

            if(current > target){
                current = target;
            }

            counter.innerHTML = current + suffix;

            setTimeout(
                updateCounter,
                25
            );

        }else{

            counter.innerHTML =
                target + suffix;

        }

    };

    updateCounter();

};

/* =========================
   OBSERVER FOR COUNTERS
========================= */

const counterObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if(entry.isIntersecting){

                    animateCounter(
                        entry.target
                    );

                    counterObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold:0.5
        }

    );

counters.forEach(counter => {

    counterObserver.observe(
        counter
    );

});

/* =========================
   TEAM CARDS
========================= */

const teamButtons =
    document.querySelectorAll(".team-btn");

teamButtons.forEach(button => {

    button.addEventListener("click", () => {

        const details =
            button.nextElementSibling;

        if(
            details.style.display ===
            "block"
        ){

            details.style.display =
                "none";

            button.innerText =
                "Подробнее";

        }else{

            details.style.display =
                "block";

            button.innerText =
                "Скрыть";

        }

    });

});

/* =========================
   JOURNAL TIMELINE
========================= */

const timelineButtons =
    document.querySelectorAll(
        ".timeline-btn"
    );

timelineButtons.forEach(button => {

    button.addEventListener("click", () => {

        const content =
            button.nextElementSibling;

        if(
            content.style.display ===
            "block"
        ){

            content.style.display =
                "none";

            button.classList.remove("open");

        }else{

            content.style.display =
                "block";

            button.classList.add("open");

        }

    });

});

/* =========================
   SCROLL ANIMATION
========================= */


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if(entry.isIntersecting){

                    entry.target.classList.add(
                        "show"
                    );

                }

            });

        },

        {
            threshold:0.15
        }

    );

const revealElements =
    document.querySelectorAll(
        ".nb-glass, .nb-team-card, .nb-tech, .nb-res-card, .nb-sum-card, .nb-kpi, .nb-arch-item, .nb-tl-item, .nb-pp-row, " +
        ".nb-sec-head, .nb-num-row, .nb-dark-badge, .nb-dark-title, .nb-dark-sub, .nb-pipe, " +
        ".nb-marq-lead, .nb-marq, .nb-showcase-head, .nb-cc-card, .nb-cta h2, .nb-cta-row, .nb-foot, " +
        ".nb-quad-intro, .nb-quad-cell, .nb-quad-stat, .nb-check-col"
    );

revealElements.forEach(el => {

    el.classList.add("hidden");

    revealObserver.observe(el);

});

/* =========================
   ACTIVE NAV LINK
========================= */

const currentPage =
    window.location.pathname
        .split("/")
        .pop();

const navLinks =
    document.querySelectorAll(
        ".nav-links a, .nb-links a"
    );

navLinks.forEach(link => {

    const href =
        link.getAttribute("href");

    if(href === currentPage){

        link.classList.add(
            "active-link"
        );

    }

});

/* =========================
   PARALLAX HERO
========================= */

const parallaxHero =
    document.querySelector(".hero");

window.addEventListener("scroll", () => {

    if(!parallaxHero) return;

    const offset =
        window.scrollY * 0.2;

    parallaxHero.style.backgroundPositionY =
        offset + "px";

});

/* =========================
   MOBILE SHOWCASE — screen carousel
========================= */
const scScreens =
    document.querySelectorAll(".nb-sc-screen");
const scDots =
    document.querySelectorAll(".nb-sc-dot");

let scIdx = 0;
let scInterval = null;

const setScreen = (idx) => {
    scScreens.forEach((s,i) => {
        s.classList.toggle("active", i === idx);
    });
    scDots.forEach((d,i) => {
        d.classList.toggle("active", i === idx);
    });
    scIdx = idx;
};

const cycleScreens = () => {
    if(scScreens.length === 0) return;
    scInterval = setInterval(() => {
        setScreen((scIdx + 1) % scScreens.length);
    }, 3800);
};

scDots.forEach((dot,i) => {
    dot.addEventListener("click", () => {
        clearInterval(scInterval);
        setScreen(i);
        cycleScreens();
    });
});

if(scScreens.length){
    cycleScreens();
}

/* =========================
   MOBILE SHOWCASE — feature pills reveal
========================= */
const featPills =
    document.querySelectorAll(".nb-feat-pill");

const pillObserver =
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const delay = +entry.target.getAttribute("data-anim-delay") || 0;
                setTimeout(() => {
                    entry.target.classList.add("show");
                }, delay);
                pillObserver.unobserve(entry.target);
            }
        });
    }, {threshold:0.2});

featPills.forEach(p => pillObserver.observe(p));

/* =========================
   NAV — scrolled state
========================= */
const navInner =
    document.querySelector(".nb-nav-inner");

window.addEventListener("scroll", () => {
    if(!navInner) return;
    if(window.scrollY > 30){
        navInner.classList.add("scrolled");
    }else{
        navInner.classList.remove("scrolled");
    }
});

/* =========================
   MAGNETIC HOVER on FABs
========================= */
const magnets =
    document.querySelectorAll(".nb-fab, .nb-cta-btn, .nb-back-btn, .nb-mob-btn");

magnets.forEach(el => {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        el.style.transform =
            `translate(${x*0.25}px, ${y*0.25}px)`;
    });
    el.addEventListener("mouseleave", () => {
        el.style.transform = "";
    });
});

/* =========================
   RADIAL HOVER on TECH cards
========================= */
const radarCards =
    document.querySelectorAll(".nb-tech");

radarCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
    });
});

/* =========================
   CURSOR GLOW on HERO
========================= */
const hero =
    document.querySelector(".nb-hero, .nb-page-hero");

if(hero){
    const glow = document.createElement("div");
    glow.className = "nb-cursor-glow";
    hero.appendChild(glow);

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.left = x + "px";
        glow.style.top = y + "px";
        glow.style.opacity = "1";
    });
    hero.addEventListener("mouseleave", () => {
        glow.style.opacity = "0";
    });
}

/* =========================
   TILT on PHONE
========================= */
const phones =
    document.querySelectorAll(".nb-phone");

phones.forEach(phone => {
    const wrap = phone.parentElement;
    if(!wrap) return;
    wrap.addEventListener("mousemove", (e) => {
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        phone.style.transform =
            `perspective(900px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg) translateY(-10px)`;
        phone.style.animationPlayState = "paused";
    });
    wrap.addEventListener("mouseleave", () => {
        phone.style.transform = "";
        phone.style.animationPlayState = "";
    });
});

/* =========================
   COUNT-UP for KPI values without data-target
========================= */

/* =========================
   THEME TOGGLE (ОПЦИОНАЛЬНО)
========================= */

const themeToggle =
    document.getElementById(
        "theme-toggle"
    );

if(themeToggle){

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-theme"
            );

        });

}
/* =========================
   TEAM — carousel
========================= */
document.querySelectorAll(".nb-carousel").forEach(function(car){
    const track = car.querySelector(".nb-carousel-track");
    if(!track) return;
    const card = track.querySelector(".nb-cc-card");
    const step = function(){ return card ? card.offsetWidth + 22 : 380; };
    const prev = car.querySelector(".nb-cc-prev");
    const next = car.querySelector(".nb-cc-next");
    if(prev) prev.addEventListener("click", function(){ track.scrollBy({left:-step(), behavior:"smooth"}); });
    if(next) next.addEventListener("click", function(){ track.scrollBy({left:step(), behavior:"smooth"}); });
});
