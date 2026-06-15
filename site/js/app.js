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
        ".nb-glass, .nb-team-card, .nb-tech, .nb-res-card, .nb-sum-card, .nb-kpi, .nb-arch-item, .nb-pp-row, " +
        ".nb-sec-head, .nb-num-row, .nb-dark-badge, .nb-dark-title, .nb-dark-sub, .nb-pipe, " +
        ".nb-marq-lead, .nb-marq, .nb-showcase-head, .nb-cta h2, .nb-cta-row, .nb-foot, " +
        ".nb-quad-intro, .nb-quad-cell, .nb-quad-stat, .nb-check-col, " +
        ".nb-arch-arrow, .nb-back-btn, .nb-sc-stat-card, " +
        ".section--runline, .nw-slider, .nb-carousel"
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
   HOME CTA REVEAL SNAP
========================= */
(function(){
    const stage =
        document.querySelector(".nb-cta-scroll-stage");
    if(!stage) return;

    const cta =
        stage.querySelector(".nb-cta");
    if(!cta) return;

    const desktopMq =
        window.matchMedia("(min-width: 1001px)");
    const reduceMq =
        window.matchMedia("(prefers-reduced-motion: reduce)");

    let ticking = false;
    let snapTimer = null;
    let snapping = false;
    let lastY = window.scrollY || 0;
    let direction = 1;
    let progress = 0;
    let ctaWasSnapped = false;

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));

    const smooth = (value) =>
        value * value * (3 - 2 * value);

    function setStageVars(p){
        const kpiDissolve =
            smooth(clamp((p - 0.82) / 0.12, 0, 1));
        const ctaReveal =
            smooth(clamp((p - 0.94) / 0.06, 0, 1));

        stage.style.setProperty(
            "--kpi-blur",
            (kpiDissolve * 14).toFixed(2) + "px"
        );
        stage.style.setProperty(
            "--kpi-shift",
            (-kpiDissolve * 64).toFixed(2) + "px"
        );
        stage.style.setProperty(
            "--kpi-opacity",
            (1 - kpiDissolve * 0.66).toFixed(3)
        );
        stage.style.setProperty(
            "--cta-opacity",
            ctaReveal.toFixed(3)
        );
        stage.style.setProperty(
            "--cta-core-opacity",
            ctaReveal.toFixed(3)
        );
        stage.style.setProperty(
            "--cta-shield-opacity",
            "0"
        );
        stage.style.setProperty(
            "--cta-shift",
            "0px"
        );
    }

    function resetStageVars(){
        stage.style.removeProperty("--kpi-blur");
        stage.style.removeProperty("--kpi-shift");
        stage.style.removeProperty("--kpi-opacity");
        stage.style.removeProperty("--cta-opacity");
        stage.style.removeProperty("--cta-core-opacity");
        stage.style.removeProperty("--cta-shield-opacity");
        stage.style.removeProperty("--cta-shift");
    }

    function update(){
        ticking = false;

        if(!desktopMq.matches || reduceMq.matches){
            progress = 0;
            resetStageVars();
            return;
        }

        const currentY =
            window.scrollY || 0;
        direction =
            currentY >= lastY ? 1 : -1;
        lastY = currentY;

        const rect =
            cta.getBoundingClientRect();
        progress =
            clamp(
                (window.innerHeight - rect.top) /
                window.innerHeight,
                0,
                1
            );

        if(rect.top > window.innerHeight * 0.9){
            ctaWasSnapped = false;
        }

        setStageVars(progress);
    }

    function requestUpdate(){
        if(!ticking){
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    function maybeSnap(){
        if(
            !desktopMq.matches ||
            reduceMq.matches ||
            snapping ||
            direction < 0 ||
            ctaWasSnapped ||
            progress < 0.76
        ){
            return;
        }

        const rect =
            cta.getBoundingClientRect();
        if(
            rect.top < -window.innerHeight * 0.65 ||
            rect.top > window.innerHeight * 0.24
        ){
            return;
        }

        const target =
            window.scrollY +
            rect.top;

        if(Math.abs(window.scrollY - target) < 12){
            ctaWasSnapped = true;
            return;
        }

        snapping = true;
        ctaWasSnapped = true;
        window.scrollTo({
            top:target,
            behavior:"smooth"
        });

        setTimeout(() => {
            const settle =
                cta.getBoundingClientRect().top;
            if(Math.abs(settle) > 4 && Math.abs(settle) < 80){
                window.scrollTo({
                    top:window.scrollY + settle,
                    behavior:"auto"
                });
            }
            snapping = false;
            requestUpdate();
        }, 900);
    }

    function onScroll(){
        requestUpdate();
        clearTimeout(snapTimer);
        snapTimer =
            setTimeout(maybeSnap, 120);
    }

    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", requestUpdate);
    desktopMq.addEventListener("change", requestUpdate);
    reduceMq.addEventListener("change", requestUpdate);
    requestUpdate();
})();

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
    document.querySelectorAll(".nb-fab, .nb-cta-btn, .nb-back-btn, .nb-mob-btn, .nw-prev, .nw-next");

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
    const cards = Array.prototype.slice.call(track.querySelectorAll(".nb-cc-card"));
    const first = cards[0];
    const step = function(){ return first ? first.offsetWidth + 30 : 390; };
    const prev = car.querySelector(".nb-cc-prev");
    const next = car.querySelector(".nb-cc-next");
    if(prev) prev.addEventListener("click", function(){ track.scrollBy({left:-step(), behavior:"smooth"}); });
    if(next) next.addEventListener("click", function(){ track.scrollBy({left:step(), behavior:"smooth"}); });

    // mark the most-centred card as in focus
    function updateFocus(){
        const tr = track.getBoundingClientRect();
        const mid = tr.left + tr.width / 2;
        let best = null, bestDist = Infinity;
        cards.forEach(function(c){
            const r = c.getBoundingClientRect();
            const d = Math.abs((r.left + r.width / 2) - mid);
            if(d < bestDist){ bestDist = d; best = c; }
        });
        cards.forEach(function(c){ c.classList.toggle("is-focus", c === best); });
    }
    let tk = false;
    track.addEventListener("scroll", function(){
        if(!tk){ requestAnimationFrame(function(){ updateFocus(); tk = false; }); tk = true; }
    }, {passive:true});
    window.addEventListener("resize", updateFocus);
    // center the first card initially, then set focus
    requestAnimationFrame(updateFocus);
});

/* =========================
   RUNNING-LINE MARQUEE — JS driven
   • smooth speed easing on hover (no jump, position kept)
   • each word/phrase scales up on hover
   • words fill white as they near the screen centre (empty -> white)
   shared by the journal news runline and the home-page marquees.
========================= */
function nbInitMarquee(sec, track, group, words, normal, slow, dir){
    if(!sec || !track || !group) return;

    function paintWords(){
        const cx = window.innerWidth / 2;
        const range = window.innerWidth * 0.22;      // narrow band = quick ignition
        words.forEach(function(w){
            const r = w.getBoundingClientRect();
            let t = 1 - Math.abs((r.left + r.width / 2) - cx) / range;
            t = t < 0 ? 0 : (t > 1 ? 1 : t);
            t = t * t * (3 - 2 * t);                 // smoothstep
            w.style.color = "rgba(255,255,255," + t + ")";
            w.style.webkitTextStrokeColor = "rgba(243,231,216," + (0.5 * (1 - t)) + ")";
        });
    }

    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        paintWords();   // static fill, no marquee
        return;
    }

    let target = normal, speed = normal;
    let x = 0;
    let groupW = group.offsetWidth;
    let last = performance.now();
    let running = false, raf = null;

    const remeasure = function(){ groupW = group.offsetWidth; };
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(remeasure); }

    sec.addEventListener("mouseenter", function(){ target = slow; });
    sec.addEventListener("mouseleave", function(){ target = normal; });

    function frame(now){
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        // ease speed toward target — no jump, current position is kept
        speed += (target - speed) * Math.min(dt * 5, 1);
        x -= speed * dt * dir;
        if(groupW > 0){
            while(x <= -groupW){ x += groupW; }
            while(x > 0){ x -= groupW; }
        }
        track.style.transform = "translateX(" + x + "px)";
        paintWords();
        if(running) raf = requestAnimationFrame(frame);
    }

    // run only while on screen (no work when scrolled away)
    new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting && !running){
                running = true; last = performance.now(); raf = requestAnimationFrame(frame);
            }else if(!e.isIntersecting && running){
                running = false; if(raf) cancelAnimationFrame(raf);
            }
        });
    }, {threshold:0}).observe(sec);
}

// journal news runline
document.querySelectorAll(".section--runline").forEach(function(sec){
    nbInitMarquee(
        sec,
        sec.querySelector(".nw-runline-track"),
        sec.querySelector(".nw-runline-group"),
        Array.prototype.slice.call(sec.querySelectorAll(".nw-run-txt")),
        58, 12, 1
    );
});

// home-page marquees (forward + reverse rows)
document.querySelectorAll(".nb-marq").forEach(function(sec){
    const track = sec.querySelector(".nb-marq-track");
    nbInitMarquee(
        sec,
        track,
        sec.querySelector(".nb-marq-seq"),
        Array.prototype.slice.call(sec.querySelectorAll(".nb-marq-seq > span")),
        75, 16,
        (track && track.classList.contains("nb-marq-track--rev")) ? -1 : 1
    );
});

/* =========================
   NEWS SLIDER (#Using) — one slide at a time
========================= */
document.querySelectorAll("[data-news-slider]").forEach(function(root){
    const track = root.querySelector(".nw-track");
    const slides = Array.prototype.slice.call(root.querySelectorAll(".nw-slide"));
    if(!track || slides.length === 0) return;

    const dotsWrap = root.querySelector(".nw-dots");
    const prev = root.querySelector(".nw-prev");
    const next = root.querySelector(".nw-next");
    let idx = 0;

    // build dots
    const dots = slides.map(function(_, i){
        const d = document.createElement("button");
        d.type = "button";
        d.className = "nw-dot" + (i === 0 ? " is-active" : "");
        d.setAttribute("aria-label", "Новость " + (i + 1));
        d.addEventListener("click", function(){ go(i); });
        if(dotsWrap) dotsWrap.appendChild(d);
        return d;
    });

    function go(i){
        idx = (i + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-idx * 100) + "%)";
        dots.forEach(function(d, k){ d.classList.toggle("is-active", k === idx); });
    }

    if(prev) prev.addEventListener("click", function(){ go(idx - 1); stop(); });
    if(next) next.addEventListener("click", function(){ go(idx + 1); stop(); });

    // drag / swipe
    let down = false, startX = 0, moved = 0;
    track.addEventListener("pointerdown", function(e){
        down = true; startX = e.clientX; moved = 0;
        track.style.transition = "none";
    });
    window.addEventListener("pointermove", function(e){
        if(!down) return;
        moved = e.clientX - startX;
        const pct = (moved / root.offsetWidth) * 100;
        track.style.transform = "translateX(" + (-idx * 100 + pct) + "%)";
    });
    window.addEventListener("pointerup", function(){
        if(!down) return;
        down = false;
        track.style.transition = "";
        if(Math.abs(moved) > root.offsetWidth * 0.12){
            go(moved < 0 ? idx + 1 : idx - 1);
        }else{ go(idx); }
        if(moved !== 0) stop();
    });

    // autoplay (paused on hover / after interaction / reduced motion)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = null;
    function play(){ if(reduce) return; stop(); timer = setInterval(function(){ go(idx + 1); }, 6500); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    play();
});

/* =========================
   GRADIENT CORE — subtle scroll parallax
========================= */
(function(){
    const zone = document.querySelector(".nb-core-zone");
    if(!zone) return;
    const core = zone.querySelector(".nb-core");
    if(!core) return;

    // hover the primary CTA ("Подробнее") -> the core ignites brighter & grows
    const lit = zone.querySelector(".nb-core-scale");
    const ctaBtn = zone.querySelector(".nb-cta .nb-cta-btn.primary");
    if(lit && ctaBtn){
        ctaBtn.addEventListener("mouseenter", function(){ lit.classList.add("is-lit"); });
        ctaBtn.addEventListener("mouseleave", function(){ lit.classList.remove("is-lit"); });
    }

    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const RANGE = 150;             // px the core drifts across the whole zone
    let ticking = false;
    function update(){
        const r = zone.getBoundingClientRect();
        const zoneCenter = r.top + r.height / 2;
        const viewCenter = window.innerHeight / 2;
        // p: -1 (zone below viewport) .. +1 (zone above) — continuous through the zone
        let p = (viewCenter - zoneCenter) / ((window.innerHeight + r.height) / 2);
        p = Math.max(-1, Math.min(1, p));
        core.style.transform = "translateY(" + (p * RANGE) + "px)";
        ticking = false;
    }
    window.addEventListener("scroll", function(){
        if(!ticking){ requestAnimationFrame(update); ticking = true; }
    }, {passive:true});
    window.addEventListener("resize", update);
    update();
})();

/* =========================
   JOURNAL TIMELINE — sequential draw
========================= */
(function(){
  const tl = document.querySelector(".nb-timeline");
  if(!tl) return;
  const obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add("drawn"); obs.unobserve(e.target); }
    });
  }, {threshold:0.2});
  obs.observe(tl);
})();
