# MTM Solutions – website

Een homepage met daarnaast aparte pagina's per dienst, per regio en in het Frans
(HTML, CSS en een beetje JavaScript). Er is geen database nodig, en er zijn geen externe
koppelingen of betaalde diensten. De site staat online op https://www.mtmsolutions.be
via GitHub Pages.

## Inhoud van de map

| Bestand            | Wat staat erin                                                      |
|--------------------|---------------------------------------------------------------------|
| `index.html`       | De homepage, per onderdeel aangeduid                                 |
| `verhuizen/`, `woningontruiming/` … | De pagina's per dienst (8)                          |
| `verhuis-ontruiming-<stad>/` | De pagina's per regio (10)                                 |
| `fr/`              | De Franstalige pagina's (onthaal, déménagement, débarras)            |
| `privacy/`, `404.html` | Het privacybeleid en de pagina voor een onbestaand adres         |
| `robots.txt`, `sitemap.xml` | Voor Google: welke pagina's er zijn                         |
| `_bouw/`           | De teksten van alle subpagina's en het script dat ze opbouwt (zie hieronder). Wordt niet online gezet |
| `CNAME`            | De domeinnaam voor GitHub Pages. Niet verwijderen                    |
| `img/og-image.jpg` | Het beeld dat verschijnt als je een link deelt (WhatsApp, Facebook)  |
| `css/style.css`    | De opmaak. Kleuren staan bovenaan bij `:root`                        |
| `js/script.js`     | Menu, animaties en formulier. WhatsApp-nummer bovenaan                |
| `img/logo.webp`    | Het logo, met doorzichtige achtergrond (ook `logo-small.webp`)       |
| `img/favicon-*.png`| Het icoontje in het browsertabblad: de doos uit het logo             |
| `img/hero-*.webp`  | De foto bovenaan, in vier groottes (760, 1024, 1200 en 1536 px breed)|
| `img/waarom*.webp` | De foto achter de sectie "Waarom MTM Solutions?", in twee groottes   |
| `img/verhuizen*`, `img/ontruiming*`, `img/opkuis*`, `img/vervoer*`, `img/montage*`, `img/inpakservice*` | De foto's bij de zes diensten, elk in drie groottes (560, 800 en 1120 px) |

## Bekijken op je computer

De links tussen de pagina's beginnen met `/`, dus dubbelklikken op `index.html` werkt
maar half. Start liever de kleine webserver vanuit de hoofdmap:

    powershell -NoProfile -ExecutionPolicy Bypass -File _bouw\server.ps1

en open daarna http://localhost:8137/ in je browser.

## Subpagina's aanpassen of toevoegen

De dienst-, regio- en Franse pagina's en de footer worden **niet** met de hand
geschreven, maar opgebouwd door `_bouw/bouw.ps1`:

1. De tekst van elke pagina staat in `_bouw/paginas/<naam>.html`. Bovenaan staat een
   kader met de gegevens (titel voor Google, beschrijving, kop, foto ...), daaronder
   de tekst in HTML. Pas de tekst daar aan, niet in de gemaakte pagina zelf.
2. Een nieuwe pagina? Kopieer een bestaand bestand, geef het een nieuwe naam en
   `slug`, en voeg het voor de footer en de tegels toe aan de lijst bovenaan
   `_bouw/bouw.ps1` (`$dienstenNl` of `$regiosNl`).
3. Voer vanuit de hoofdmap uit:

       powershell -NoProfile -ExecutionPolicy Bypass -File _bouw\bouw.ps1

   Het script maakt alle pagina's opnieuw, vernieuwt `sitemap.xml` en zet de footer
   ook op de homepage (tussen `FOOTER:START` en `FOOTER:END`).
4. Upload of commit alles naar GitHub.

**Bedrijfsgegevens** (adres, BTW-nummer, openingsuren) staan op drie plaatsen: in de
footer (`_bouw/bouw.ps1`, functie `Footer`), in het blok `application/ld+json` bovenaan
`index.html` (voor Google) en in `_bouw/paginas/privacy.html`.

**Op tijd bijwerken:** de pagina over Gent vermeldt dat de stad vanaf 1 januari 2027 zelf
de parkeerverbodsborden plaatst. Pas die zin na die datum aan.

## Indeling en stijl

- **Opbouw**: vast menu met een offerteknop, opening met titel en grote knop, zes diensten,
  stappen, waarom MTM, werkgebied, offerteformulier en een footer met bel- en mailknoppen.
- **Kleuren**: afgeleid van het logo — het oranjerood van de doos en de gebogen lijn,
  en het donkergrijs van de twee figuren, aangevuld met wit en warme neutrale tinten.

  | Kleur             | Code      | Waar                                                      |
  |-------------------|-----------|-----------------------------------------------------------|
  | Donkergrijs       | `#292929` | Uit het logo. Menu, titels, iconen, donkere sectie, tekst  |
  | Donkergrijs dieper| `#1C1C1C` | De footer, zodat die zich onderscheidt van de sectie erboven |
  | Donkergrijs lichter| `#3A3A3A`| De kaders binnen de donkere sectie                         |
  | Oranjerood        | `#DB4626` | Exact uit het logo. Accentlijnen en de streep in de titel  |
  | Oranjerood (knop) | `#D44122` | Knoppen; net donker genoeg voor witte tekst                |
  | Oranjerood donker | `#B3341A` | Hover, en kleine accenttekst op een lichte ondergrond      |
  | Oranjerood licht  | `#F0A085` | Accent op de donkere sectie en in de footer                |
  | Oranjerood zacht  | `#FBE8E1` | Meldingen, de cijfers bij de stappen                       |
  | Wit               | `#FFFFFF` | Kaarten en formulier                                       |
  | Warm wit          | `#FAF8F5` | Hoofdachtergrond                                           |
  | Zacht zand        | `#F1EBE4` | Afwisselende secties                                       |
  | Lijnen            | `#E4DCD3` | Randen en scheidingslijnen                                 |
  | Zachtere tekst    | `#5C5753` | Bijschriften en kleinere tekst                             |
  | Foutmeldingen     | `#A01B1B` | Dieper rood, zodat het niet op het accent lijkt            |

  Alle tekst-, knop- en formulierkleuren zijn nagerekend: elke combinatie haalt minstens
  4,5 op 1 contrast (de norm WCAG AA voor gewone tekst). De knopkleur `#D44122` is daarom
  een fractie donkerder dan het oranjerood uit het logo: met wit erop haalt die 4,6 op 1,
  terwijl `#DB4626` op 4,3 zou blijven steken.
- **Logo**: staat in `img/logo.png`, met een doorzichtige achtergrond. In de footer staat het
  op een wit vlak, omdat de donkere figuren op de donkere footer niet zichtbaar zouden zijn.
  Wil je een ander logo? Vervang `logo.png` en `logo-small.png` (zelfde verhouding, ongeveer
  3 op 2) en pas zo nodig `.logo-beeld` in `css/style.css` aan.
- **Animaties**: onderdelen komen zacht in beeld wanneer je ernaar scrollt, de vier stappen
  verschijnen in volgorde en knoppen reageren subtiel. Zie het onderdeel *Animaties* hieronder.
- **Lettertype**: het standaardlettertype van het toestel. Dat laadt meteen en er is
  geen koppeling met Google Fonts nodig.
- **Op smartphone** staat onderaan een vaste balk met *Bellen* en *Gratis offerte*.
- **Foto's**: bovenaan staat een hero-foto, en elke dienstkaart heeft een eigen beeld. Ze staan
  in WebP-formaat in meerdere groottes; de browser kiest zelf de kleinste die volstaat. De foto's
  bij de diensten laden pas wanneer je ernaartoe scrollt.
  Wil je een foto vervangen? Zet je eigen beeld in `img/` onder dezelfde naam, in verhouding 3:2
  voor de diensten (bijvoorbeeld 1120 bij 747 pixels).

  **Over de groottes.** Van elke foto staan er meerdere versies in `img/`. In de
  `srcset` van elke `<img>` staat hoe breed elke versie is; de browser kiest zelf
  de kleinste die scherp genoeg is voor het scherm van de bezoeker. Een gsm laadt
  dus niet de grote versie. Vervang je een foto, maak dan alle maten opnieuw aan,
  anders blijft er een oude versie rondslingeren. De foto's staan op WebP-kwaliteit
  82: dat is de laagste waarde waarbij er met het blote oog niets te zien is.
  Lager zetten maakt de bestanden kleiner, maar dan zie je het wel. Let op: op de huidige beelden staan mensen
  in MTM-kledij. Zijn dat niet jullie eigen mensen of opdrachten, vervang ze dan best door
  echte foto's van jullie werk.

## Teksten en gegevens aanpassen

- **Teksten**: open `index.html` in een teksteditor en pas de tekst aan tussen de tags.
  Elk onderdeel begint met een kader zoals `<!-- ============ 2. ONZE DIENSTEN ============ -->`.
- **Telefoon en e-mail**: zoek en vervang in `index.html`:
  - `0492 05 15 70` (zichtbaar nummer)
  - `+32492051570` (het nummer achter de belknoppen)
  - `info@mtmsolutions.be`

  Doe hetzelfde in `_bouw/bouw.ps1` en in de bestanden in `_bouw/paginas/`, en bouw de
  pagina's opnieuw. Pas het WhatsApp-nummer daarna ook aan bovenaan `js/script.js`
  (bij `INSTELLINGEN`).
- **Kleuren**: pas de waarden bovenaan `css/style.css` aan, bij `:root`.
- Pas je CSS of JavaScript aan nadat de site online staat? Verhoog dan het nummer in
  `style.css?v=37` en `script.js?v=37` (naar `v=38` enzovoort), zowel in `index.html` als
  in `_bouw/bouw.ps1`, en bouw de pagina's opnieuw. Zo krijgen bezoekers meteen de nieuwe
  versie te zien.

## De foto bovenaan

De hero-foto is de **achtergrond van de hele opening** (`.hero-photo` in
`css/style.css`). Ze loopt over de volledige breedte achter de titel, de tekst,
de knoppen en het keuzevak door. Er ligt een crèmesluier overheen zodat alles
leesbaar blijft: stevig links achter de tekst, opklarend naar rechts zodat de
foto daar goed zichtbaar blijft.

Bovenaan blijft een strook helemaal vrij van die sluier: daar staan de twee
medewerkers. Hoe hoog die strook is, staat in de variabele `--vrij`, en de
bovenruimte van de hero wordt daaruit berekend. Zo komt er nooit tekst, een
keuzevak of de actiebadge voor hun gezichten.

| Scherm                  | Instelling                                              |
|-------------------------|---------------------------------------------------------|
| Computer (vanaf 901)    | `--vrij: 23vw`, foto op ware breedte, `margin-top: -2%`  |
| Tablet en gsm (t.e.m. 900) | `--vrij: 32vw`, foto ingezoomd op `130%` met `margin-left: -12%` |

Let op als je hieraan sleutelt:

- **`--vrij` moet groter blijven dan waar de kinnen eindigen.** Op een computer
  staan die op ongeveer 22% van de schermbreedte, op gsm op ongeveer 31%.
  Verklein je `--vrij`, dan komt de sluier over de gezichten te liggen.
- De bovenruimte is `--vrij + --overgang + wat lucht`. Begint de tekst hoger,
  dan staat ze in de overgang van de sluier en wordt ze slecht leesbaar.
- Op tablet en gsm hoort `width: 130%` bij `margin-left: -12%`. Verander het ene
  getal niet zonder het andere: samen bepalen ze dat de twee medewerkers rechts
  van de actiebadge en volledig binnen het scherm staan.
- De sluier (`.hero-photo::after`) loopt via `inset: 0 0 -7vw 0` nog een stuk
  door onder de foto, en het masker dooft hem daar uit. Zo is er geen zichtbare
  rand waar de foto stopt. Haal dat niet weg.

## De foto achter "Waarom MTM Solutions?"

Die sectie heeft de foto als achtergrond. Ze is opgebouwd uit drie lagen die
los van elkaar staan (zie `#waarom` in `css/style.css`):

1. `#waarom::before` — de foto zelf, onbewerkt ingeladen uit `img/`;
2. `#waarom::after` — de donkere sluier;
3. `.wrap` — de tekst en de drie kaarten.

Omdat de sluier een aparte laag is, wordt alleen de foto donkerder gemaakt. Het
beeldbestand blijft ongewijzigd; je kunt het dus altijd opnieuw gebruiken.

Twee variabelen sturen alles aan:

- `--zoom`: hoe groot de foto staat (de hoogte staat op `auto`, dus de foto
  wordt nooit uitgerekt).
- `--fh`: de hoogte die de foto daardoor inneemt. De foto is 2,5 keer zo breed
  als hoog, dus `--fh` is altijd `--zoom / 2,5`. **Pas je de ene aan, pas dan
  ook de andere aan**, anders klopt de sluier niet meer.

| Scherm                 | `--zoom` | uitsnede | bovenruimte |
|------------------------|----------|----------|-------------|
| Computer (vanaf 901)   | 118%     | `70% 0`  | gewone sectieruimte; de twee personen staan rechts naast de tekst |
| Tablet (561–900)       | 170%     | `94% 0`  | 45% van de fotohoogte: de personen staan dan boven de tekst |
| Smartphone (t.e.m. 560)| 260%     | `94% 0`  | idem |

Onder de foto loopt de sectie door in de donkere huiskleur. De sluier eindigt in
precies diezelfde kleur, dus je ziet nergens een rand waar de foto stopt.

Op een computer is de sluier links donker (tot 47% van de breedte, waar de tekst
staat) en rechts licht (vanaf 61%, waar de twee personen zitten). Verschuif je
de uitsnede, dan verschuiven die twee zones mee: controleer dan opnieuw of de
gezichten in het lichte deel vallen.

De drie kaarten zijn licht doorschijnend met een zachte vervaging erachter. Werkt
die vervaging niet in een oudere browser, dan blijft de kaart gewoon donkergrijs
en blijft de tekst leesbaar.

## De actiebadge

De eindejaarsactie staat als een ronde badge in een hoek van de hero-foto
(`.actie-badge` in `index.html`, opmaak bij `.actie-badge` in `css/style.css`).
Het is een echte cirkel: `aspect-ratio: 1` houdt breedte en hoogte gelijk, en de
maat schaalt mee met het scherm.

De vier regels staan los van elkaar, zodat de korting het meest opvalt:
`.ab-kop` (Eindejaarsactie), `.ab-cijfer` (15%), `.ab-woord` (korting) en
`.ab-voet` (op alles, t.e.m. 31 dec.). Het percentage is met afstand het
grootst. Witte tekst op het oranjerood van de huisstijl haalt een contrast van
1 op 4,6 — ruim boven de norm.

**De plaats.** De badge hangt linksboven in de hero, over de bestelwagen. Op
tablet en smartphone is ze iets kleiner, zodat ze ook daar links van het eerste
gezicht blijft. Zet haar niet rechtsboven: daar staat de tweede medewerker.

**Let op bij de opmaak**: de badge hangt vast aan `.hero-photo`, dus dat vak
moet altijd `position: relative` blijven. Zet de badge niet rechtsboven: daar
staat het hoofd van de tweede medewerker.

**Na 31 december**: verwijder het hele blok `<p class="actie-badge">` uit
`index.html`. Er staat een opmerking bij. De actie staat maar op één plaats, dus
daarmee is ze overal weg.

## De belofte "Offerte binnen 2u"

*Offerte binnen 2u* (`Devis sous 2 h` op de Franse pagina's) is de tekst van elke
offerteknop op de site: in het menu, in de kop van elke pagina, op de
dienstkaarten, in de CTA-balk onderaan en in de vaste balk op smartphone. De
teksten komen uit `offerteKort`, `offerteLang`, `zkTitel` en `zkKnop` bovenaan
`_bouw/bouw.ps1`, per taal. Op de homepage staan ze rechtstreeks in `index.html`.

Dezelfde belofte staat ook in de kop van de zijkaart, in de tekst van de
CTA-balk (`ctaTekst`), in de veelgestelde vragen en in de meta-beschrijvingen
die Google toont.

**"Gratis" is niet verdwenen**, alleen verhuisd: het staat nu in de lopende
tekst, in de veelgestelde vragen, in de meta-beschrijvingen en als eerste punt
in de zijkaart ("Gratis en vrijblijvend"). De knop zelf draagt de termijn, want
dat is wat een bezoeker nog niet wist.

Er heeft korte tijd ook een pill met een klokje onder de knoppen gestaan
(`.belofte` in `css/style.css`). Die is weg omdat ze woord voor woord hetzelfde
zei als de knop er vlak boven. De opmaak staat nog in de stylesheet, dus je kunt
ze terugzetten als de knoptekst ooit weer verandert.

**Verander je de termijn?** Dan moet hij op al die plaatsen mee. Zoek op
`binnen 2u` en op `sous 2 h`, in `index.html`, in `_bouw/bouw.ps1` en in
`_bouw/paginas/`, en bouw daarna de pagina's opnieuw. Let op: de zin over de
parkeerverbodsborden ("minstens 24 uur op voorhand") gaat **niet** over de
offerte en moet blijven staan.

**Houd de belofte haalbaar.** Jullie zijn bereikbaar van 8 tot 20 uur, en dat
staat er ook bij. Komt een aanvraag 's nachts binnen, dan telt die termijn in de
praktijk vanaf de ochtend. Lukt twee uur niet meer, pas de termijn dan aan in
plaats van hem te laten staan: een belofte die je niet haalt, kost meer
vertrouwen dan een ruimere termijn die je wel haalt.

## Het 24/7-blok in de footer

Onderaan elke pagina, tussen de contactknoppen en de kolommen, staat een blok
met het WhatsApp-rondje: *24/7 bereikbaar via WhatsApp*. Het legt uit dat er op
elk moment van de dag antwoord komt en dat dat buiten de telefoonuren een
AI-assistent is. De opmaak staat bij `.foot-247` in `css/style.css`, de teksten
bij `$k247`, `$t247` en `$w247` in de functie `Footer` van `_bouw/bouw.ps1`, per
taal.

**Zeg erbij dat het een AI is.** Dat staat er nu met zoveel woorden. Haal die
zin er niet uit: een bezoeker die denkt dat hij met een medewerker schrijft en
daar later achterkomt, vertrouwt de rest ook niet meer. Sinds de Europese
AI-verordening is die duidelijkheid trouwens ook een verplichting.

De openingsuren in de footergegevens staan daarom nu op twee regels:
telefonisch van 8 tot 20 uur, WhatsApp 24/7. Verandert een van beide, pas dan
`$geg` aan in dezelfde functie, in beide talen.

## Animaties

Alle animaties zitten onderaan in `css/style.css`, onder het kader `ANIMATIES`. Er zijn geen
externe libraries gebruikt; het JavaScript ervoor is een twintigtal regels bovenaan
`js/script.js`. De bewegingsstijl volgt die van de Autoverkooppunt-website: dezelfde
easing `cubic-bezier(.16, 1, .3, 1)` (bovenaan ingesteld als `--ease`), hetzelfde tempo
(ongeveer 0,9 seconde) en dezelfde opbouw met 120 milliseconden tussen onderdelen.

**Hoe het werkt**
1. De klant vult het formulier in. Verplichte velden hebben een rood sterretje (*).
   Vergeet de klant iets, dan krijgt die eerst een duidelijke foutmelding.
2. De klant klikt op **Open WhatsApp met mijn aanvraag**. WhatsApp opent met een bericht
   naar +32 486 58 45 07, waarin alle gegevens al staan. Op een smartphone opent de
   WhatsApp-app, op een computer WhatsApp Desktop of WhatsApp Web.
3. De klant moet in WhatsApp **zelf nog op verzenden drukken**. Dat staat bij het formulier,
   onder de knop en nog eens op het scherm daarna.
4. Foto's kan de klant in hetzelfde WhatsApp-gesprek toevoegen. Een website kan geen foto's
   automatisch in een WhatsApp-bericht zetten. Daarom is er geen foto-upload in het formulier.

**De velden**

Het formulier telt bewust weinig velden. Bezoekers haken af op lange formulieren,
en het volledige adres, het type woning en een exacte datum zijn in een eerste
contact niet nodig: die vraag je in het gesprek dat erop volgt. De postcode
volstaat om te zien of de opdracht binnen het werkgebied valt.

| Vraag | Verplicht | Opmerking |
|-------|-----------|-----------|
| Type dienst | ja | keuzelijst, één keuze; met "Meerdere diensten" en "Iets anders" onderaan |
| Korte beschrijving | ja | één regel, maximaal 200 tekens |
| Volledige naam | ja | |
| Postcode | ja | vier cijfers, niet beginnend met 0 |
| Telefoonnummer | ja | minstens 9 cijfers, zodat ook een vast nummer (bv. 09 123 45 67) past; spaties, streepjes, haakjes, punten en + tellen niet mee |
| E-mailadres | ja | moet de vorm naam@voorbeeld.be hebben |
| Wanneer moeten we komen? | ja | keuzerondjes: zo snel mogelijk, binnen een week, 1 tot 2 weken, 3 tot 4 weken, over een maand, of nog niet geweten |

**Voeg je een veld toe?** Doe dat alleen als je het antwoord echt nodig hebt
vóór het eerste gesprek. Elk extra verplicht veld kost aanvragen.

**Telefoon, e-mail en postcode** worden apart nagekeken door `telefoonFout()`,
`emailFout()` en `postcodeFout()` in `js/script.js`. Die geven de foutmelding terug, of
niets als alles klopt, en worden gebruikt bij het verzenden én tijdens het typen. Daardoor
blijft de melding staan zolang de invoer nog niet deugt, en verdwijnt ze zodra ze wel
deugt — bij de andere velden verdwijnt ze al zodra je begint te typen.

**De termijn** is een rij keuzerondjes in plaats van een kalender. Eén tik volstaat, en op
een smartphone scheelt dat het openklappen en scrollen van een datumkiezer. Bij het
formulier staat uitdrukkelijk dat het een voorkeur is en nog bevestigd wordt. Wil je een
andere reeks termijnen? Pas de zes `<label class="keuze">` aan in `index.html`; het script
leest gewoon de waarde die aanstaat en hoeft niet mee aangepast te worden.

**De offerteknoppen** bij elke dienst (in de lijst bovenaan en op de dienstkaarten) zetten
de keuzelijst alvast op die dienst (`kiesDienst()` in `js/script.js`). Een waarde die niet
in de lijst staat, wordt genegeerd. Dat geldt ook voor `/?dienst=Verhuizen#offerte`.

De website toont bewust **geen** melding "aanvraag verstuurd", want ze kan niet zien of de
klant het bericht echt verstuurt.

**Het blokje boven het formulier** (`.notice.notice-wa`, met `id="formNotice"`) legt die
drie stappen kort uit, met een titel en een WhatsApp-icoon in een donker rondje. Het is
geen waarschuwing maar een rustige toelichting (`role="note"`), dus het heeft geen harde
balk aan de zijkant: een heel lichtgroen vlak (`#EFFBF3`) met een fijne lichtgroene rand
(`#BDEBCC`) en het WhatsApp-rondje in de eigen groene kleur van WhatsApp (`#25D366`) met
een wit logo. Zo is meteen duidelijk langs welke weg de aanvraag vertrekt. Tekst wijzigen doe je in `index.html`; de opmaak staat in `css/style.css` bij
`.notice`.

**Nummer wijzigen**: pas `whatsapp` aan bovenaan `js/script.js` (internationaal formaat,
enkel cijfers: `32492051570`). Pas daarna ook het zichtbare nummer en de belknoppen aan in
`index.html`. Hoe je dat doet, lees je hierboven.

## Online zetten

De site staat op GitHub Pages: alles wat in de branch `main` van deze repository staat,
komt na een minuut of twee online. Laat het bestand `CNAME` altijd staan; het koppelt de
site aan www.mtmsolutions.be.

- Doe na een grote wijziging zelf een testaanvraag vanaf een smartphone en een computer.
- Het privacybeleid staat op `/privacy/` (tekst in `_bouw/paginas/privacy.html`).
- Echte foto's van jullie eigen team en opdrachten wekken meer vertrouwen dan
  voorbeeldbeelden.
