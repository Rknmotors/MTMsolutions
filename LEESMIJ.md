# MTM Solutions – website

Eén eenvoudige pagina (HTML, CSS en een beetje JavaScript). Er is geen bouwstap of
database nodig, en er zijn geen externe koppelingen of betaalde diensten.

## Inhoud van de map

| Bestand            | Wat staat erin                                                      |
|--------------------|---------------------------------------------------------------------|
| `index.html`       | Alle teksten van de website, per onderdeel aangeduid                 |
| `css/style.css`    | De opmaak. Kleuren staan bovenaan bij `:root`                        |
| `js/script.js`     | Menu, animaties en formulier. WhatsApp-nummer bovenaan                |
| `img/logo.webp`    | Het logo, met doorzichtige achtergrond (ook `logo-small.webp`)       |
| `img/favicon-*.png`| Het icoontje in het browsertabblad: de doos uit het logo             |
| `img/hero-*.webp`  | De foto bovenaan, in vier groottes (760, 1024, 1200 en 1536 px breed)|
| `img/waarom*.webp` | De foto achter de sectie "Waarom MTM Solutions?", in twee groottes   |
| `img/verhuizen*`, `img/ontruiming*`, `img/opkuis*`, `img/vervoer*`, `img/montage*`, `img/inpakservice*` | De foto's bij de zes diensten, elk in drie groottes (560, 800 en 1120 px) |

## Bekijken op je computer

Dubbelklik op `index.html`. De website opent dan in je browser.

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
  - `0486 58 45 07` (zichtbaar nummer)
  - `+32486584507` (het nummer achter de belknoppen)
  - `info@mtm.be`

  Pas het WhatsApp-nummer daarna ook aan bovenaan `js/script.js` (bij `INSTELLINGEN`).
- **Kleuren**: pas de waarden bovenaan `css/style.css` aan, bij `:root`.
- Pas je CSS of JavaScript aan nadat de site online staat? Verhoog dan in `index.html` het
  nummer in `style.css?v=2` en `script.js?v=2` (naar `v=3` enzovoort). Zo krijgen bezoekers
  meteen de nieuwe versie te zien. (Nu staat overal `v=15`.)

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

| Vraag | Verplicht | Opmerking |
|-------|-----------|-----------|
| Naam | ja | |
| Telefoonnummer | ja | minimaal 10 cijfers; spaties, streepjes, haakjes, punten en + tellen niet mee |
| E-mailadres | ja | moet de vorm naam@voorbeeld.be hebben |
| Welke diensten heb je nodig? | minstens één | aankruisvakjes, meerdere tegelijk mogelijk |
| Welk type woning of ruimte? | minstens één | aankruisvakjes, meerdere tegelijk mogelijk |
| Beginadres / adres van de opdracht | ja | straat, nummer, postcode en gemeente |
| Moeten er spullen van of naar een ander adres worden vervoerd? | nee | enkel zichtbaar bij de overige diensten |
| Bestemmingsadres | enkel indien zichtbaar | straat, nummer, postcode en gemeente |
| Wanneer heb je hulp nodig? | ja | een datum kiezen **of** "Datum nog te bespreken" aanvinken |
| Korte omschrijving | nee | |

**Telefoon en e-mail** worden apart nagekeken door `telefoonFout()` en `emailFout()` in
`js/script.js`. Die geven de foutmelding terug, of niets als alles klopt, en worden gebruikt
bij het verzenden én tijdens het typen. Daardoor blijft de melding staan zolang de invoer
nog niet deugt, en verdwijnt ze zodra ze wel deugt — bij de andere velden verdwijnt ze al
zodra je begint te typen. Let op: de grens van tien cijfers sluit Belgische vaste nummers
uit, want die hebben er negen (bv. 09 123 45 67).

**Het bestemmingsadres** verschijnt op twee manieren:

- Kiest de klant **Verhuizen** of **Vervoer van inboedel**, dan is er sowieso een tweede
  adres. Het blok verschijnt meteen en is verplicht; de ja/nee-vraag blijft dan weg. Dat
  geldt ook in combinatie met andere diensten, bijvoorbeeld ontruiming én verhuis.
- Kiest de klant alleen andere diensten, dan verschijnt eerst de vraag **"Moeten er spullen
  van of naar een ander adres worden vervoerd?"**. Pas bij **Ja** komt het blok tevoorschijn en is
  het verplicht; bij **Nee** blijft het verborgen en vrijblijvend.

Verdwijnt het blok weer — bijvoorbeeld omdat de verhuis wordt uitgevinkt — dan vervallen de
verplichtingen en gaat het bestemmingsadres **niet** mee in het WhatsApp-bericht, ook niet
als de klant het eerder al had ingevuld. De ingevulde tekst blijft wel in de velden staan,
zodat er niets verloren gaat als de klant van gedacht verandert. Een eerder gegeven "Ja"
wordt wel gewist zodra de vraag zelf verdwijnt. De lijst met diensten die altijd een tweede
adres hebben staat in `js/script.js` bij `MET_EINDADRES`; de hele regeling zit in
`toonEindadres()`.

**De datum** is een gewone kalender (`<input type="date">`) die niet verder teruggaat dan
vandaag. Vinkt de klant "Datum nog te bespreken" aan, dan gaat het datumvak uit en wordt
het leeggemaakt. Bij het formulier staat uitdrukkelijk dat de datum een voorkeur is en nog
bevestigd wordt; in het bericht komt er "(onder voorbehoud)" achter.

**De offerteknoppen** bij elke dienst (in de lijst bovenaan en op de dienstkaarten) vinken
die ene dienst alvast aan. Wat de klant zelf al aanvinkte blijft staan, dus een combinatie
als ontruiming én verhuis kan gewoon.

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
enkel cijfers: `32486584507`). Pas daarna ook het zichtbare nummer en de belknoppen aan in
`index.html`. Hoe je dat doet, lees je hierboven.

## Voor de website online gaat

- Zelf een testaanvraag doen vanaf een smartphone en vanaf een computer.
- Kijk deze zin onder het formulier na: *"Je gegevens worden enkel gebruikt om je aanvraag te
  beantwoorden."* Voeg ook best een privacyverklaring toe, want het formulier verzamelt
  persoonsgegevens.
- Indien gewenst: logo en echte foto's toevoegen.
- Online zetten: upload de volledige inhoud van deze map (met `css/`, `js/` en `img/`) naar
  je hosting. De site staat nog **nergens** online.
