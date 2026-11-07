/* =====================================================================
   INSTELLINGEN — pas hier je gegevens aan
   ===================================================================== */
var INSTELLINGEN = {
  // WhatsApp-nummer waar offerteaanvragen naartoe gaan:
  // internationaal formaat, enkel cijfers, zonder + en zonder 0 vooraan.
  // 0492 05 15 70 wordt dus 32492051570.
  whatsapp: '32492051570',

  /* ---------- Meting ----------
     Vul in wat je hebt, laat leeg wat je niet hebt. Staat alles leeg, dan
     wordt er niets naar buiten gestuurd en zie je de gebeurtenissen alleen
     in de browserconsole (F12 → Console). Zo kun je eerst zelf testen. */

  // Google Analytics 4. Het meet-ID staat in Analytics bij
  // Beheer → Datastreams → je website. Het begint met G-.
  ga4: '',

  // ChatGPT Ads. Het pixel-ID staat in Ads Manager op het tabblad Conversies.
  chatgptPixel: '',

  // Elke gebeurtenis in de console tonen. Handig zolang je test.
  // Zet op false als alles werkt.
  metingInConsole: true,

  /* ---------- Waar de aanvraag naartoe gaat ----------
     Vul hieronder je sleutel in en de aanvraag komt rechtstreeks in je
     mailbox. Daarna krijgt de klant een bevestiging te zien, met een
     WhatsApp-knop om er foto's bij te sturen.

     Laat je de sleutel leeg, dan werkt alles zoals vroeger: het formulier
     opent WhatsApp met het bericht al ingevuld. De website blijft dus
     gewoon werken tot je dit invult.

     Een sleutel halen (gratis, 250 aanvragen per maand, geen account):
       1. Ga naar https://web3forms.com
       2. Vul info@mtmsolutions.be in en vraag een Access Key
       3. De sleutel komt in je mailbox. Plak ze hieronder.
       4. De eerste aanvraag die binnenkomt moet je in je mailbox
          bevestigen. Doe dus zelf een testaanvraag. */
  formulierSleutel: '87139047-e16d-494a-b626-3738e9a3dce1',
  formulierEndpoint: 'https://api.web3forms.com/submit'
};

(function () {
  'use strict';

  /* ---------- Meting ----------
     Eén functie voor alle gebeurtenissen: meet('naam'). Die stuurt ze naar
     wat er is ingevuld bovenaan dit bestand. Is er niets ingevuld, dan
     gebeurt er niets, en de rest van de website werkt gewoon door.

     De gebeurtenissen die we tellen:
       offerte_klik        iemand klikt op een offerteknop
       bel_klik            iemand klikt op een telefoonnummer
       whatsapp_klik       iemand klikt op een WhatsApp-link
       mail_klik           iemand klikt op een e-mailadres
       formulier_start     iemand vult het eerste veld in
       formulier_fout      het formulier werd geweigerd, met het veld erbij
       aanvraag_verstuurd  het formulier was volledig en WhatsApp ging open

     formulier_start tegenover aanvraag_verstuurd laat zien hoeveel mensen
     beginnen en afhaken. formulier_fout zegt op welk veld dat gebeurt. */

  function laadScript(bron) {
    var s = document.createElement('script');
    s.async = true; s.src = bron;
    document.head.appendChild(s);
  }

  // Google Analytics 4
  if (INSTELLINGEN.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', INSTELLINGEN.ga4);
    laadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(INSTELLINGEN.ga4));
  }

  // ChatGPT Ads. De wachtrij vangt de gebeurtenissen op tot het script geladen is.
  if (INSTELLINGEN.chatgptPixel && !window.oaiq) {
    var rij = function () { rij.q.push(arguments); };
    rij.q = [];
    window.oaiq = rij;
    laadScript('https://bzrcdn.openai.com/sdk/oaiq.min.js');
    window.oaiq('init', { pixelId: INSTELLINGEN.chatgptPixel });
  }

  function meet(naam, extra) {
    var gegevens = { pagina: location.pathname };
    if (extra) { for (var k in extra) { if (extra.hasOwnProperty(k)) gegevens[k] = extra[k]; } }

    if (INSTELLINGEN.metingInConsole && window.console) {
      console.log('[meting] ' + naam, gegevens);
    }
    try {
      if (INSTELLINGEN.ga4 && window.gtag) window.gtag('event', naam, gegevens);
    } catch (e) { /* meting mag de website nooit tegenhouden */ }
    try {
      if (INSTELLINGEN.chatgptPixel && window.oaiq) {
        window.oaiq('measure', 'custom', { type: 'custom' }, { custom_event_name: naam });
      }
    } catch (e) { /* idem */ }
  }

  /* Klikken op knoppen en contactgegevens, op élke pagina. Via één
     luisteraar op het document, zodat knoppen die later verschijnen
     ook meetellen. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('#offerte') >= 0) meet('offerte_klik', { knop: (a.textContent || '').trim().slice(0, 40) });
    else if (href.indexOf('wa.me') >= 0) meet('whatsapp_klik');
    else if (href.indexOf('tel:') === 0) meet('bel_klik');
    else if (href.indexOf('mailto:') === 0) meet('mail_klik');
  }, true);

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
  var resultOk = document.getElementById('resultOk');
  var waLink = document.getElementById('waLink');
  var fotoLink = document.getElementById('fotoLink');

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

  /* Het eerste veld dat iemand aanraakt telt als "formulier gestart".
     Daarna niet meer: we willen weten hoeveel mensen beginnen, niet
     hoeveel toetsen ze indrukken. */
  var gestart = false;
  form.addEventListener('input', function () {
    if (gestart) return;
    gestart = true;
    meet('formulier_start');
  }, true);

  // Welk veld de aanvraag tegenhield, zodat je ziet waar mensen stranden.
  var laatsteFout = '';

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

    laatsteFout = first ? (first.id || first.name || 'onbekend') : '';
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

  function toonResultaat(vak) {
    form.hidden = true;
    vak.hidden = false;
    vak.focus();
    if (vak.scrollIntoView) vak.scrollIntoView({ block: 'center', behavior: minderBeweging ? 'auto' : 'smooth' });
  }

  /* ---------- Reserveweg: via WhatsApp ----------
     Gebruikt zolang er geen formulierdienst is ingesteld, en als terugval
     wanneer het versturen mislukt. De klant moet in WhatsApp zelf nog op
     verzenden drukken, dus hier staat bewust geen "verstuurd"-melding. */
  function viaWhatsApp() {
    var url = 'https://wa.me/' + INSTELLINGEN.whatsapp + '?text=' + encodeURIComponent(whatsappBericht());
    waLink.href = url;
    var w = window.open(url, '_blank');
    if (w) w.opener = null;
    toonResultaat(resultWa);
  }

  /* De aanvraag zoals ze in de mailbox terechtkomt. De veldnamen worden de
     regels in de e-mail, dus ze staan hier in gewone taal. */
  function aanvraagGegevens() {
    var fd = new FormData();
    fd.append('access_key', INSTELLINGEN.formulierSleutel);
    // De onderwerpregel van de mail die bij ons binnenkomt. Alles tussen
    // aanhalingstekens is vaste tekst, alles met veld(...) komt van de klant.
    // Wil je er nog iets bij? Plak het erachter met +, bijvoorbeeld
    // + ' - ' + veld('naam').value.trim() of + ' - ' + gekozenRadio('termijn')
    fd.append('subject', 'Offerteaanvraag: ' + veld('dienst').value + ' (' + veld('postcode').value.trim() + ')');
    fd.append('from_name', 'MTM Solutions website');
    fd.append('Dienst', veld('dienst').value);
    fd.append('Opdracht', veld('beschrijving').value.trim());
    fd.append('Wanneer', gekozenRadio('termijn'));
    fd.append('Naam', veld('naam').value.trim());
    fd.append('Postcode', veld('postcode').value.trim());
    fd.append('Telefoon', veld('telefoon').value.trim());
    // 'email' is het antwoordadres: klik je in je mailbox op Beantwoorden,
    // dan gaat je antwoord rechtstreeks naar de klant.
    fd.append('email', veld('email').value.trim());
    fd.append('botcheck', veld('botcheck').checked ? 'true' : '');
    return fd;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      meet('formulier_fout', { veld: laatsteFout });
      return;
    }

    meet('aanvraag_verstuurd', {
      dienst: veld('dienst').value,
      termijn: gekozenRadio('termijn')
    });

    // Nog geen sleutel ingevuld? Dan de oude weg: WhatsApp.
    if (!INSTELLINGEN.formulierSleutel || !window.fetch) {
      viaWhatsApp();
      return;
    }

    var oudeTekst = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met versturen…';

    function herstelKnop() {
      submitBtn.disabled = false;
      submitBtn.textContent = oudeTekst;
    }

    window.fetch(INSTELLINGEN.formulierEndpoint, { method: 'POST', body: aanvraagGegevens() })
      .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
      .then(function (d) {
        if (!d || !d.success) throw new Error(d && d.message ? d.message : 'verzenden mislukt');
        herstelKnop();
        meet('aanvraag_ontvangen', { dienst: veld('dienst').value });
        fotoLink.href = 'https://wa.me/' + INSTELLINGEN.whatsapp + '?text=' +
          encodeURIComponent('Hallo MTM Solutions, ik heb net een offerte aangevraagd op naam van ' +
            veld('naam').value.trim() + '. Hier zijn enkele foto’s:');
        toonResultaat(resultOk);
      })
      .catch(function (fout) {
        // De klant mag hier niets van merken: we vallen terug op WhatsApp,
        // zodat de aanvraag alsnog ergens terechtkomt.
        herstelKnop();
        meet('verzenden_mislukt', { reden: String(fout && fout.message).slice(0, 80) });
        viaWhatsApp();
      });
  });
})();
