/* =====================================================================
   INSTELLINGEN — pas hier je gegevens aan
   ===================================================================== */
var INSTELLINGEN = {
  // WhatsApp-nummer waar offerteaanvragen naartoe gaan:
  // internationaal formaat, enkel cijfers, zonder + en zonder 0 vooraan.
  // 0486 58 45 07 wordt dus 32486584507.
  whatsapp: '32486584507'
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
  var submitBtn = document.getElementById('submitBtn');
  var resultWa = document.getElementById('resultWa');
  var waLink = document.getElementById('waLink');

  var dienstenGroep = document.getElementById('dienstenGroep');
  var ruimteGroep = document.getElementById('ruimteGroep');
  var datumGroep = document.getElementById('datumGroep');
  var vervoerGroep = document.getElementById('vervoerGroep');
  var eindGroep = document.getElementById('eindGroep');
  var datum = document.getElementById('datum');
  var datumOpen = document.getElementById('datumOpen');

  // De diensten waarbij er ook een eindadres nodig is: er moet dan iets
  // van de ene plek naar de andere.
  var MET_EINDADRES = ['Verhuizen', 'Vervoer van inboedel'];

  var START_VELDEN = ['startStraat', 'startNummer', 'startPostcode', 'startGemeente'];
  var EIND_VELDEN = ['eindStraat', 'eindNummer', 'eindPostcode', 'eindGemeente'];

  // Kort hulpje om een invulveld op te halen via zijn naam.
  function veld(naam) { return form.elements[naam]; }

  // Alle aangevinkte waarden van een groep selectievakjes.
  function aangevinkt(naam) {
    return [].slice.call(form.querySelectorAll('input[name="' + naam + '"]:checked'))
      .map(function (el) { return el.value; });
  }

  /* ---------- Het bestemmingsadres tonen of verbergen ----------
     Bij een verhuis of bij vervoer van inboedel is er altijd een tweede adres,
     dus dan verschijnt het meteen. Bij de andere diensten vragen we eerst of er
     iets naar een ander adres moet; pas bij "Ja" verschijnt het blok. */
  function gekozenRadio(naam) {
    var el = form.querySelector('input[name="' + naam + '"]:checked');
    return el ? el.value : '';
  }

  function toonEindadres() {
    var gekozen = aangevinkt('diensten');
    var viaDienst = gekozen.some(function (d) { return MET_EINDADRES.indexOf(d) >= 0; });

    // De ja/nee-vraag hoort alleen bij de overige diensten.
    var vraagTonen = gekozen.length > 0 && !viaDienst;
    vervoerGroep.hidden = !vraagTonen;
    if (!vraagTonen) {
      // Een eerder gegeven antwoord wissen, zodat een oude "Ja" niet blijft hangen.
      form.querySelectorAll('input[name="andersAdres"]').forEach(function (el) { el.checked = false; });
    }

    var nodig = viaDienst || (vraagTonen && gekozenRadio('andersAdres') === 'Ja');
    eindGroep.hidden = !nodig;
    if (!nodig) EIND_VELDEN.forEach(function (n) { clearError(veld(n)); });
    return nodig;
  }

  form.querySelectorAll('input[name="diensten"], input[name="andersAdres"]').forEach(function (el) {
    el.addEventListener('change', toonEindadres);
  });

  /* ---------- Datum ----------
     Je kiest een dag, of je vinkt aan dat de datum nog besproken moet worden.
     Het ene sluit het andere uit, dus we zetten het datumvak dan uit. */
  var vandaag = new Date();
  datum.min = [vandaag.getFullYear(),
    ('0' + (vandaag.getMonth() + 1)).slice(-2),
    ('0' + vandaag.getDate()).slice(-2)].join('-');

  datumOpen.addEventListener('change', function () {
    datum.disabled = datumOpen.checked;
    if (datumOpen.checked) datum.value = '';
    clearGroepFout(datumGroep, 'datum-err');
  });

  // Knoppen bij een dienst vinken die dienst alvast aan. Wat al aangevinkt
  // stond, blijft staan: zo kun je er nog diensten bij kiezen.
  document.querySelectorAll('[data-dienst]').forEach(function (link) {
    link.addEventListener('click', function () {
      var naam = link.getAttribute('data-dienst');
      var vak = form.querySelector('input[name="diensten"][value="' + naam + '"]');
      if (!vak) return;
      vak.checked = true;
      toonEindadres();
      clearGroepFout(dienstenGroep, 'diensten-err');
      dienstenGroep.classList.remove('just-set');
      void dienstenGroep.offsetWidth; // zet de markering opnieuw klaar
      dienstenGroep.classList.add('just-set');
      window.setTimeout(function () { dienstenGroep.classList.remove('just-set'); }, 1100);
    });
  });

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
    var cijfers = waarde.replace(/\D/g, '');
    if (cijfers.length < 10) return 'Je telefoonnummer moet minimaal 10 cijfers bevatten.';
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
    if (el.id === 'telefoon' || el.id === 'email') return;
    function opruimen() { if (el.getAttribute('aria-invalid')) clearError(el); }
    el.addEventListener('input', opruimen);
    el.addEventListener('change', opruimen);
  });

  // Staat er een melding bij telefoon of e-mail, dan kijken we bij elke
  // toetsaanslag opnieuw: zodra de invoer klopt, verdwijnt ze. Klopt ze nog
  // niet, dan blijft de juiste melding staan.
  [['telefoon', telefoonFout], ['email', emailFout]].forEach(function (paar) {
    var el = veld(paar[0]), keur = paar[1];
    function herkeuren() {
      if (!el.getAttribute('aria-invalid')) return;
      var fout = keur(el.value);
      if (fout) showError(el, fout); else clearError(el);
    }
    el.addEventListener('input', herkeuren);
    el.addEventListener('change', herkeuren);
  });
  form.querySelectorAll('input[name="diensten"]').forEach(function (el) {
    el.addEventListener('change', function () { clearGroepFout(dienstenGroep, 'diensten-err'); });
  });
  form.querySelectorAll('input[name="ruimte"]').forEach(function (el) {
    el.addEventListener('change', function () { clearGroepFout(ruimteGroep, 'ruimte-err'); });
  });
  datum.addEventListener('change', function () { clearGroepFout(datumGroep, 'datum-err'); });

  function validate() {
    var first = null;
    function fail(field, msg) { showError(field, msg); if (!first) first = field; }
    function failGroep(groep, meldingId, msg, focusEl) {
      toonGroepFout(groep, meldingId, msg);
      if (!first) first = focusEl;
    }

    var naam = veld('naam'), tel = veld('telefoon'), mail = veld('email');
    [naam, tel, mail].forEach(clearError);
    START_VELDEN.concat(EIND_VELDEN).forEach(function (n) { clearError(veld(n)); });
    clearGroepFout(dienstenGroep, 'diensten-err');
    clearGroepFout(ruimteGroep, 'ruimte-err');
    clearGroepFout(datumGroep, 'datum-err');

    if (!naam.value.trim()) fail(naam, 'Vul je naam in.');
    if (telefoonFout(tel.value)) fail(tel, telefoonFout(tel.value));
    if (emailFout(mail.value)) fail(mail, emailFout(mail.value));

    if (!aangevinkt('diensten').length)
      failGroep(dienstenGroep, 'diensten-err', 'Kies minstens één dienst.',
        form.querySelector('input[name="diensten"]'));
    if (!aangevinkt('ruimte').length)
      failGroep(ruimteGroep, 'ruimte-err', 'Kies minstens één type woning of ruimte.',
        form.querySelector('input[name="ruimte"]'));

    var LABELS = {
      Straat: 'Vul de straat in.', Nummer: 'Vul het huisnummer in.',
      Postcode: 'Vul de postcode in.', Gemeente: 'Vul de gemeente in.'
    };
    function keurAdres(namen) {
      namen.forEach(function (n) {
        var el = veld(n);
        if (!el.value.trim()) fail(el, LABELS[n.replace(/^(start|eind)/, '')]);
      });
    }
    keurAdres(START_VELDEN);
    if (toonEindadres()) keurAdres(EIND_VELDEN);

    if (!datumOpen.checked && !datum.value)
      failGroep(datumGroep, 'datum-err',
        'Kies een gewenste datum, of vink aan dat de datum nog te bespreken is.', datum);

    if (first) first.focus();
    return !first;
  }

  // Een adres op twee regels, zoals je het op een envelop zou schrijven.
  function adresRegels(namen) {
    var w = namen.map(function (n) { return veld(n).value.trim(); });
    return [(w[0] + ' ' + w[1]).trim(), (w[2] + ' ' + w[3]).trim()];
  }

  // De datum in gewone taal, bv. "15 november 2026".
  var MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  function datumInWoorden(waarde) {
    var d = waarde.split('-');
    if (d.length !== 3) return waarde;
    return Number(d[2]) + ' ' + MAANDEN[Number(d[1]) - 1] + ' ' + d[0];
  }

  // Het bericht dat vooraf ingevuld in WhatsApp verschijnt (*tekst* = vet in WhatsApp).
  function whatsappBericht() {
    var naam = veld('naam').value.trim();
    var tel = veld('telefoon').value.trim();
    var mail = veld('email').value.trim();
    var oms = veld('omschrijving').value.trim();

    var regels = [
      'Hallo MTM Solutions,',
      'Ik wil graag een gratis, vrijblijvende offerte aanvragen.',
      '',
      '*Diensten:* ' + aangevinkt('diensten').join(', '),
      '*Type woning of ruimte:* ' + aangevinkt('ruimte').join(', '),
      '',
      '*Naam:* ' + naam,
      '*Telefoon:* ' + tel
    ];
    if (mail) regels.push('*E-mail:* ' + mail);

    var start = adresRegels(START_VELDEN);
    regels.push('', '*Beginadres / adres van de opdracht:*', start[0], start[1]);

    // Het bestemmingsadres staat er alleen bij als het blok ook echt getoond
    // wordt. Heeft de klant het eerder ingevuld en daarna weer verborgen, dan
    // gaat het dus niet mee.
    if (!eindGroep.hidden) {
      var eind = adresRegels(EIND_VELDEN);
      regels.push('', '*Bestemmingsadres:*', eind[0], eind[1]);
    }

    regels.push('', '*Gewenste datum:* ' + (datumOpen.checked
      ? 'nog te bespreken'
      : datumInWoorden(datum.value) + ' (onder voorbehoud)'));

    if (oms) regels.push('', '*Extra info:*', oms);
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
