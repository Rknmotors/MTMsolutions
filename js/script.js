/* =====================================================================
   INSTELLINGEN — pas hier je gegevens aan
   ===================================================================== */
var INSTELLINGEN = {
  // WhatsApp-nummer waar offerteaanvragen naartoe gaan:
  // internationaal formaat, enkel cijfers, zonder + en zonder 0 vooraan.
  // 0492 05 15 70 wordt dus 32492051570.
  whatsapp: '32492051570'
};

(function () {
  'use strict';

  /* ---------- Onderdelen zacht in beeld laten komen ----------
     Onderdelen met class="reveal" staan standaard gewoon zichtbaar. Enkel wat
     bij het openen nog ónder het scherm ligt, krijgt even de class "pre" en
     schuift zacht omhoog zodra je eraan toe scrollt. Zo moet je nooit op een
     animatie wachten voor iets dat je meteen al ziet.
     Werkt dit niet (oude browser) of staat "verminder beweging" aan, dan
     gebeurt er niets en staat alles er meteen. */
  var minderBeweging = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var teTonen = [].slice.call(document.querySelectorAll('.reveal'));

  /* Staat "verminder beweging" aan, dan zetten we de lichtpuntjes op de kaart
     stil. De CSS verbergt ze al; dit stopt de beweging ook echt. */
  if (minderBeweging) {
    var kaart = document.querySelector('.kaart-doek svg');
    if (kaart && kaart.pauseAnimations) kaart.pauseAnimations();
  }

  if (!minderBeweging && 'IntersectionObserver' in window) {
    var schermhoogte = window.innerHeight;
    var verborgen = teTonen.filter(function (el) {
      if (el.getBoundingClientRect().top <= schermhoogte * 0.92) return false;
      el.classList.add('pre');
      return true;
    });

    var kijker = new IntersectionObserver(function (waarnemingen) {
      waarnemingen.forEach(function (w) {
        if (w.isIntersecting) { w.target.classList.remove('pre'); kijker.unobserve(w.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    verborgen.forEach(function (el) { kijker.observe(el); });
  }

  /* ---------- Menu op smartphone ---------- */
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Menu openen');
  }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  });
  document.querySelectorAll('#navList a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Jaartal in de footer ---------- */
  document.getElementById('jaar').textContent = new Date().getFullYear();

  /* ---------- Offerteformulier via WhatsApp ---------- */
  var form = document.getElementById('quoteForm');
  // Het formulier staat alleen op de homepage. Op de subpagina's stopt het script hier.
  if (!form) return;
  var submitBtn = document.getElementById('submitBtn');
  var resultWa = document.getElementById('resultWa');
  var waLink = document.getElementById('waLink');

  var termijnGroep = document.getElementById('termijnGroep');
  var dienstVeld = document.getElementById('dienst');

  // Kort hulpje om een invulveld op te halen via zijn naam.
  function veld(naam) { return form.elements[naam]; }

  // De gekozen waarde van een groep keuzerondjes.
  function gekozenRadio(naam) {
    var el = form.querySelector('input[name="' + naam + '"]:checked');
    return el ? el.value : '';
  }

  /* ---------- De dienst vooraf instellen ----------
     Zet de keuzelijst op een dienst, maar alleen als die er ook echt in staat. */
  function kiesDienst(naam) {
    var bestaat = [].slice.call(dienstVeld.options).some(function (o) { return o.value === naam; });
    if (!bestaat) return;
    dienstVeld.value = naam;
    clearError(dienstVeld);
  }

  // De offerteknoppen bij elke dienst zetten die dienst alvast klaar.
  document.querySelectorAll('[data-dienst]').forEach(function (link) {
    link.addEventListener('click', function () { kiesDienst(link.getAttribute('data-dienst')); });
  });

  // Komt iemand via de offerteknop van een dienstpagina (bv. /?dienst=Verhuizen#offerte),
  // dan staat die dienst al gekozen in het formulier.
  var gevraagd = window.URLSearchParams ? new URLSearchParams(location.search).get('dienst') : '';
  if (gevraagd) kiesDienst(gevraagd);

  function showError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    var p = document.getElementById(field.id + '-err');
    if (p) { p.textContent = msg; p.hidden = false; }
  }
  function clearError(field) {
    if (!field) return;
    field.removeAttribute('aria-invalid');
    var p = document.getElementById(field.id + '-err');
    if (p) { p.textContent = ''; p.hidden = true; }
  }
  // Een groep selectievakjes heeft geen eigen invulveld, dus de melding hangt
  // aan de groep zelf.
  function toonGroepFout(groep, meldingId, msg) {
    var p = document.getElementById(meldingId);
    p.textContent = msg; p.hidden = false;
    groep.classList.add('groep-fout');
  }
  function clearGroepFout(groep, meldingId) {
    var p = document.getElementById(meldingId);
    if (p) { p.textContent = ''; p.hidden = true; }
    groep.classList.remove('groep-fout');
  }

  /* ---------- Telefoon en e-mail ----------
     Beide zijn verplicht. Deze twee hulpjes geven de foutmelding terug, of een
     lege tekst als alles in orde is. Ze worden gebruikt bij het verzenden én
     tijdens het typen, zodat een melding vanzelf verdwijnt zodra het klopt. */
  function telefoonFout(waarde) {
    if (!waarde.trim()) return 'Vul je telefoonnummer in.';
    // Spaties, streepjes, haakjes, punten en het plusteken tellen niet mee.
    // Negen cijfers, want een Belgisch vast nummer heeft er net zoveel
    // (bv. 09 123 45 67). Op tien zetten sluit die mensen uit.
    var cijfers = waarde.replace(/\D/g, '');
    if (cijfers.length < 9) return 'Je telefoonnummer moet minstens 9 cijfers bevatten.';
    return '';
  }
  function postcodeFout(waarde) {
    var w = waarde.trim();
    if (!w) return 'Vul je postcode in.';
    if (!/^[1-9][0-9]{3}$/.test(w)) return 'Een Belgische postcode bestaat uit vier cijfers, bv. 9250.';
    return '';
  }
  function emailFout(waarde) {
    var w = waarde.trim();
    if (!w) return 'Vul je e-mailadres in.';
    // iets@iets.iets, zonder spaties — streng genoeg om tikfouten te vangen,
    // soepel genoeg voor alle gewone adressen.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(w)) return 'Vul een geldig e-mailadres in.';
    return '';
  }

  // Bij de gewone velden verdwijnt de melding zodra je begint te typen.
  // Telefoon en e-mail krijgen hieronder een eigen behandeling: daar moet de
  // melding pas weg als de invoer ook echt klopt.
  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    if (el.id === 'telefoon' || el.id === 'email' || el.id === 'postcode') return;
    function opruimen() { if (el.getAttribute('aria-invalid')) clearError(el); }
    el.addEventListener('input', opruimen);
    el.addEventListener('change', opruimen);
  });

  // Staat er een melding bij telefoon of e-mail, dan kijken we bij elke
  // toetsaanslag opnieuw: zodra de invoer klopt, verdwijnt ze. Klopt ze nog
  // niet, dan blijft de juiste melding staan.
  [['telefoon', telefoonFout], ['email', emailFout], ['postcode', postcodeFout]].forEach(function (paar) {
    var el = veld(paar[0]), keur = paar[1];
    function herkeuren() {
      if (!el.getAttribute('aria-invalid')) return;
      var fout = keur(el.value);
      if (fout) showError(el, fout); else clearError(el);
    }
    el.addEventListener('input', herkeuren);
    el.addEventListener('change', herkeuren);
  });
  form.querySelectorAll('input[name="termijn"]').forEach(function (el) {
    el.addEventListener('change', function () { clearGroepFout(termijnGroep, 'termijn-err'); });
  });

  function validate() {
    var first = null;
    function fail(field, msg) { showError(field, msg); if (!first) first = field; }
    function failGroep(groep, meldingId, msg, focusEl) {
      toonGroepFout(groep, meldingId, msg);
      if (!first) first = focusEl;
    }

    var dienst = veld('dienst'), oms = veld('beschrijving'), naam = veld('naam');
    var post = veld('postcode'), tel = veld('telefoon'), mail = veld('email');
    [dienst, oms, naam, post, tel, mail].forEach(clearError);
    clearGroepFout(termijnGroep, 'termijn-err');

    if (!dienst.value) fail(dienst, 'Kies het type dienst.');
    if (!oms.value.trim()) fail(oms, 'Vertel kort waar we je mee kunnen helpen.');
    if (!naam.value.trim()) fail(naam, 'Vul je naam in.');
    if (postcodeFout(post.value)) fail(post, postcodeFout(post.value));
    if (telefoonFout(tel.value)) fail(tel, telefoonFout(tel.value));
    if (emailFout(mail.value)) fail(mail, emailFout(mail.value));

    if (!gekozenRadio('termijn'))
      failGroep(termijnGroep, 'termijn-err', 'Kies wanneer we mogen komen.',
        form.querySelector('input[name="termijn"]'));

    if (first) first.focus();
    return !first;
  }

  // Het bericht dat vooraf ingevuld in WhatsApp verschijnt (*tekst* = vet in WhatsApp).
  function whatsappBericht() {
    var regels = [
      'Hallo MTM Solutions,',
      'Ik wil graag een gratis, vrijblijvende offerte aanvragen.',
      '',
      '*Dienst:* ' + veld('dienst').value,
      '*Opdracht:* ' + veld('beschrijving').value.trim(),
      '*Wanneer:* ' + gekozenRadio('termijn'),
      '',
      '*Naam:* ' + veld('naam').value.trim(),
      '*Postcode:* ' + veld('postcode').value.trim(),
      '*Telefoon:* ' + veld('telefoon').value.trim(),
      '*E-mail:* ' + veld('email').value.trim()
    ];
    return regels.join('\n');
  }

  resultWa.querySelector('[data-back]').addEventListener('click', function () {
    resultWa.hidden = true;
    form.hidden = false;
    submitBtn.focus();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var url = 'https://wa.me/' + INSTELLINGEN.whatsapp + '?text=' + encodeURIComponent(whatsappBericht());
    waLink.href = url;

    // WhatsApp openen in een nieuw tabblad (op smartphone opent de app).
    // Wordt dat geblokkeerd, dan staat de knop "WhatsApp niet geopend? Klik hier" klaar.
    var w = window.open(url, '_blank');
    if (w) w.opener = null;

    // Geen "verstuurd"-melding: we weten niet of de klant op verzenden drukt.
    form.hidden = true;
    resultWa.hidden = false;
    resultWa.focus();
    if (resultWa.scrollIntoView) resultWa.scrollIntoView({ block: 'center', behavior: minderBeweging ? 'auto' : 'smooth' });
  });
})();
