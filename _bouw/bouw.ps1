# Bouwt de subpagina's van mtmsolutions.be.
#
# Elke pagina staat als tekstblok in _bouw\paginas\<naam>.html: bovenaan een
# kader met gegevens (titel, beschrijving, kop ...), daaronder de eigenlijke
# tekst in HTML. Dit script zet daar het menu, de kop, de offertekaart, de
# tegels, de footer en de knoppen omheen en schrijft het resultaat naar
# <slug>\index.html in de hoofdmap van de website. Daarna vernieuwt het
# sitemap.xml en de footer van de homepage (tussen <!-- FOOTER:START --> en
# <!-- FOOTER:END -->).
#
# Uitvoeren vanuit de hoofdmap:
#   powershell -NoProfile -ExecutionPolicy Bypass -File _bouw\bouw.ps1
# De map _bouw begint met een liggend streepje, zodat GitHub Pages ze niet online zet.
#
# Let op: dit bestand bevat bewust enkel gewone letters. Speciale tekens
# staan er als HTML-code in (&eacute; = e met accent), omdat Windows
# PowerShell 5 een script zonder BOM anders verkeerd inleest.

$ErrorActionPreference = 'Stop'
$bouw = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $bouw
# De website staat in de map erboven (in de GitHub-repository) of in een map "site" ernaast.
$site = Join-Path $root 'site'
if (-not (Test-Path (Join-Path $site 'index.html'))) { $site = $root }
$domein = 'https://www.mtmsolutions.be'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$vandaag = (Get-Date).ToString('yyyy-MM-dd')

# ---------- Vaste lijsten: volgorde in de footer en in de tegels ----------
$dienstenNl = @(
  @{ slug = 'verhuizen';                       label = 'Verhuizen' },
  @{ slug = 'woningontruiming';                label = 'Woningontruiming' },
  @{ slug = 'ontruiming-na-overlijden';        label = 'Ontruiming na overlijden' },
  @{ slug = 'zolder-kelder-garage-leegmaken';  label = 'Zolder, kelder of garage leegmaken' },
  @{ slug = 'vervoer-inboedel';                label = 'Vervoer van inboedel' },
  @{ slug = 'meubelmontage';                   label = 'Meubelmontage' },
  @{ slug = 'inpakservice';                    label = 'Inpakservice' },
  @{ slug = 'verhuis-woonzorgcentrum';         label = 'Verhuis naar woonzorgcentrum' }
)
$regiosNl = @(
  @{ slug = 'verhuis-ontruiming-waasland';     label = 'Waasland' },
  @{ slug = 'verhuis-ontruiming-sint-niklaas'; label = 'Sint-Niklaas' },
  @{ slug = 'verhuis-ontruiming-lokeren';      label = 'Lokeren' },
  @{ slug = 'verhuis-ontruiming-beveren';      label = 'Beveren' },
  @{ slug = 'verhuis-ontruiming-gent';         label = 'Gent' },
  @{ slug = 'verhuis-ontruiming-antwerpen';    label = 'Antwerpen' },
  @{ slug = 'verhuis-ontruiming-aalst';        label = 'Aalst' },
  @{ slug = 'verhuis-ontruiming-dendermonde';  label = 'Dendermonde' },
  @{ slug = 'verhuis-ontruiming-mechelen';     label = 'Mechelen' },
  @{ slug = 'verhuis-ontruiming-brussel';      label = 'Brussel' }
)
$paginasFr = @(
  @{ slug = 'fr/demenagement'; label = 'D&eacute;m&eacute;nagement' },
  @{ slug = 'fr/debarras';     label = 'D&eacute;barras de maison' }
)

# ---------- Hulpjes ----------
function Enc([string]$t) { return $t.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;') }
function Js([string]$t) { return $t.Replace('\', '\\').Replace('"', '\"') }
function Url([string]$slug) { if ($slug -eq '') { return "$domein/" } return "$domein/$slug/" }
function Pad([string]$slug) { if ($slug -eq '') { return '/' } return "/$slug/" }

$svgPijl  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
$svgTel   = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
$svgMail  = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
$svgWa    = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.5c0 3.3 3.2 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.3-2.3l.9-1-1-2z"/></svg>'
$svgMenu  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
$svgKlein = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'

# ---------- Teksten per taal ----------
$Talen = @{
  nl = @{
    lang = 'nl-BE'; og = 'nl_BE'; home = 'Home'; skip = 'Naar de inhoud'; menu = 'Hoofdmenu'; menuOpen = 'Menu openen'
    logoLabel = 'MTM Solutions, naar de homepage'
    nav = '<li><a href="/#diensten">Diensten</a></li><li><a href="/#werkwijze">Hoe werkt het</a></li><li><a href="/#waarom">Waarom MTM</a></li><li><a href="/#werkgebied">Werkgebied</a></li><li><a href="#contact">Contact</a></li>'
    taalLabel = 'FR'; taalLang = 'fr'; taalTitel = 'Version fran&ccedil;aise'; taalStandaard = '/fr/'
    offerteKort = 'Offerte binnen 2u'; offerteLang = 'Offerte binnen 2u'; bel = 'Bel 0492 05 15 70'; bellen = 'Bellen'
    kruimel = 'Kruimelpad'
    zkTitel = 'Offerte binnen 2u'
    zkTicks = '<li>Gratis en vrijblijvend</li><li>Persoonlijk contact, geen callcenter</li><li>Vanuit Waasmunster actief in heel Vlaanderen en Brussel</li>'
    zkKnop = 'Offerte binnen 2u'; zkUren = 'Bereikbaar van 8 tot 20 uur.'
    diensten = 'Onze diensten'; regios = 'Hier zijn we actief'
    ctaTekst = 'Vertel ons kort wat je nodig hebt. Je krijgt binnen 2u een offerte op maat, gratis en vrijblijvend.'
  }
  fr = @{
    lang = 'fr-BE'; og = 'fr_BE'; home = 'Accueil'; skip = 'Aller au contenu'; menu = 'Menu principal'; menuOpen = 'Ouvrir le menu'
    logoLabel = 'MTM Solutions, vers la page d&#39;accueil'
    nav = '<li><a href="/fr/#services">Services</a></li><li><a href="/fr/demenagement/">D&eacute;m&eacute;nagement</a></li><li><a href="/fr/debarras/">D&eacute;barras</a></li><li><a href="#contact">Contact</a></li>'
    taalLabel = 'NL'; taalLang = 'nl'; taalTitel = 'Nederlandstalige versie'; taalStandaard = '/'
    offerteKort = 'Devis sous 2 h'; offerteLang = 'Devis sous 2 h'; bel = 'Appelez le 0492 05 15 70'; bellen = 'Appeler'
    kruimel = "Fil d'Ariane"
    zkTitel = 'Devis sous 2 h'
    zkTicks = '<li>Gratuit et sans engagement</li><li>Contact personnel, pas de call center</li><li>Bruxelles et toute la Flandre</li>'
    zkKnop = 'Devis sous 2 h'; zkUren = 'Joignables de 8 h &agrave; 20 h.'
    diensten = 'Nos services'; regios = ''
    ctaTekst = 'D&eacute;crivez-nous bri&egrave;vement votre projet. Vous recevez un devis sur mesure sous 2 h, gratuit et sans engagement.'
  }
}

# WhatsApp-link met een vooraf ingevuld Frans bericht (de Franse pagina's hebben geen formulier).
$waFr = 'https://wa.me/32492051570?text=' + [uri]::EscapeDataString("Bonjour MTM Solutions, je souhaite recevoir un devis gratuit.")

function Tegels($lijst, [string]$huidig) {
  $s = ''
  foreach ($p in $lijst) {
    $cur = ''; if ($p.slug -eq $huidig) { $cur = ' aria-current="page"' }
    $s += "<li><a href=""$(Pad $p.slug)""$cur>$($p.label)$svgKlein</a></li>"
  }
  return $s
}

function Footer([string]$taal) {
  if ($taal -eq 'fr') {
    $kolom2 = '<h3>Services</h3><ul>' + (($paginasFr | ForEach-Object { "<li><a href=""$(Pad $_.slug)"">$($_.label)</a></li>" }) -join '') + '<li><a href="/fr/#services">Tous nos services</a></li></ul>'
    $kolom3 = '<h3>R&eacute;gions</h3><ul><li><a href="/verhuis-ontruiming-brussel/" hreflang="nl">Bruxelles</a></li><li>Pays de Waes (Waasland)</li><li>Gand, Anvers, Malines, Alost</li><li>Toute la Flandre</li></ul>'
    $kolom4 = "<h3>Contact</h3><ul><li><a href=""tel:+32492051570"">0492 05 15 70</a></li><li><a href=""mailto:info@mtmsolutions.be"">info@mtmsolutions.be</a></li><li><a href=""$waFr"" target=""_blank"" rel=""noopener"">WhatsApp</a></li><li><a href=""/"" lang=""nl"" hreflang=""nl"">Nederlandstalige versie</a></li><li><a href=""/privacy/"" hreflang=""nl"">Vie priv&eacute;e (NL)</a></li></ul>"
    $kop = '<p class="eyebrow">Contact</p><h2>Une question&#160;? Contactez-nous.</h2>'
    $belK = 'Appelez-nous'; $mailK = 'Envoyez un e-mail'; $mailOnd = 'Question%20via%20le%20site'
    $tag = 'D&eacute;m&eacute;nagement &amp; d&eacute;barras pour particuliers'
    $geg = 'MTM Solutions<br>9250 Waasmunster (Pays de Waes)<br>TVA BE 1006.001.549<br>Joignables de 8 h &agrave; 20 h'
    $legal = '&copy; <span id="jaar">2026</span> MTM Solutions &middot; TVA BE 1006.001.549'
    $logoLabel = $Talen.fr.logoLabel; $thuis = '/fr/'
  } else {
    $kolom2 = '<h3>Diensten</h3><ul>' + (($dienstenNl | ForEach-Object { "<li><a href=""$(Pad $_.slug)"">$($_.label)</a></li>" }) -join '') + '</ul>'
    $kolom3 = '<h3>Regio&#39;s</h3><ul>' + (($regiosNl | ForEach-Object { "<li><a href=""$(Pad $_.slug)"">$($_.label)</a></li>" }) -join '') + '</ul>'
    $kolom4 = '<h3>Contact</h3><ul><li><a href="tel:+32492051570">0492 05 15 70</a></li><li><a href="mailto:info@mtmsolutions.be">info@mtmsolutions.be</a></li><li><a href="https://wa.me/32492051570" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="/fr/" lang="fr" hreflang="fr">Version fran&ccedil;aise</a></li><li><a href="/privacy/">Privacybeleid</a></li></ul>'
    $kop = '<p class="eyebrow">Contact</p><h2>Vragen? Neem gerust contact op.</h2>'
    $belK = 'Bel ons'; $mailK = 'Stuur een e-mail'; $mailOnd = 'Vraag%20via%20de%20website'
    $tag = 'Verhuis &amp; ontruiming voor particulieren'
    $geg = 'MTM Solutions<br>9250 Waasmunster (Waasland)<br>BTW BE 1006.001.549<br>Bereikbaar van 8 tot 20 uur'
    $legal = '&copy; <span id="jaar">2026</span> MTM Solutions &middot; BTW BE 1006.001.549 &middot; <a href="/privacy/">Privacybeleid</a>'
    $logoLabel = $Talen.nl.logoLabel; $thuis = '/'
  }
  return @"
<!-- FOOTER:START (gemaakt door bouw.ps1) -->
<footer class="footer" id="contact">
  <div class="wrap">
    <div class="foot-top">
      <div>$kop</div>
      <div class="contact-btns">
        <a class="cbtn" href="tel:+32492051570"><span class="ci">$svgTel</span><span><small>$belK</small>0492 05 15 70</span></a>
        <a class="cbtn" href="mailto:info@mtmsolutions.be?subject=$mailOnd"><span class="ci">$svgMail</span><span><small>$mailK</small>info@mtmsolutions.be</span></a>
      </div>
    </div>
    <div class="foot-grid">
      <div>
        <a class="logo logo-licht" href="$thuis" aria-label="$logoLabel">
          <span class="logo-vlak"><img src="/img/logo.webp" srcset="/img/logo-small.webp 260w, /img/logo.webp 520w" sizes="86px" width="520" height="338" alt=""></span>
          <span class="logo-naam"><b>MTM</b> Solutions</span>
        </a>
        <p class="foot-tag">$tag</p>
        <p class="foot-gegevens">$geg</p>
      </div>
      <div>$kolom2</div>
      <div>$kolom3</div>
      <div>$kolom4</div>
    </div>
    <p class="legal">$legal</p>
  </div>
</footer>
<!-- FOOTER:END -->
"@
}

# ---------- Pagina's inlezen ----------
$paginas = @()
foreach ($f in Get-ChildItem (Join-Path $bouw 'paginas') -Filter *.html | Sort-Object Name) {
  $ruw = [IO.File]::ReadAllText($f.FullName, $utf8)
  $m = [regex]::Match($ruw, '(?s)^\s*<!--(.*?)-->(.*)$')
  if (-not $m.Success) { throw "Geen gegevenskader bovenaan $($f.Name)" }
  $p = @{ bestand = $f.Name; inhoud = $m.Groups[2].Value.Trim() }
  foreach ($regel in ($m.Groups[1].Value -split "`n")) {
    $k = [regex]::Match($regel, '^\s*([a-z]+)\s*:\s*(.*?)\s*$')
    if ($k.Success) { $p[$k.Groups[1].Value] = $k.Groups[2].Value }
  }
  foreach ($verplicht in 'slug', 'taal', 'soort', 'titel', 'beschrijving', 'kop') {
    if (-not $p.ContainsKey($verplicht)) { throw "$($f.Name): '$verplicht' ontbreekt" }
  }
  # "vertaling: -" verwijst naar de Nederlandstalige homepage
  if ($p.vertaling -eq '-') { $p.vertaling = '' }
  $paginas += $p
}
$bySlug = @{ '' = @{ slug = ''; taal = 'nl' } }; foreach ($p in $paginas) { $bySlug[$p.slug] = $p }

# ---------- Elke pagina opbouwen ----------
foreach ($p in $paginas) {
  $t = $Talen[$p.taal]
  $url = Url $p.slug
  $is404 = ($p.slug -eq '404')
  if ($is404) { $url = "$domein/404.html" }

  # Offerteknop: NL naar het formulier op de homepage (dienst al aangevinkt), FR naar WhatsApp.
  if ($p.taal -eq 'fr') { $offerte = $waFr; $doel = ' target="_blank" rel="noopener"' }
  else {
    $offerte = '/#offerte'; $doel = ''
    if ($p.dienst) { $offerte = '/?dienst=' + [uri]::EscapeDataString($p.dienst) + '#offerte' }
  }

  # Taalwissel en hreflang
  $taalHref = $t.taalStandaard
  $hreflang = ''
  if ($p.ContainsKey('vertaling') -and $bySlug.ContainsKey($p.vertaling)) {
    $taalHref = Pad $p.vertaling
    $hreflang = "<link rel=""alternate"" hreflang=""$($t.lang)"" href=""$url"">`n<link rel=""alternate"" hreflang=""$($Talen[$bySlug[$p.vertaling].taal].lang)"" href=""$(Url $p.vertaling)"">`n"
    $nlUrl = $url; if ($p.taal -eq 'fr') { $nlUrl = Url $p.vertaling }
    $hreflang += "<link rel=""alternate"" hreflang=""x-default"" href=""$nlUrl"">"
  }

  # Gestructureerde gegevens: kruimelpad + de dienst
  $homeUrl = "$domein/"; if ($p.taal -eq 'fr') { $homeUrl = "$domein/fr/" }
  $kruimel = $p.kruimel; if (-not $kruimel) { $kruimel = $p.kop }
  $schema = ''
  if (-not $is404 -and $p.slug -ne 'fr') {
    $items = "{""@type"":""ListItem"",""position"":1,""name"":""$($t.home)"",""item"":""$homeUrl""},{""@type"":""ListItem"",""position"":2,""name"":""$(Js $kruimel)"",""item"":""$url""}"
    $schema = "{""@context"":""https://schema.org"",""@type"":""BreadcrumbList"",""itemListElement"":[$items]}"
  }
  if ($p.soort -eq 'dienst' -or $p.soort -eq 'regio') {
    $gebied = '[{"@type":"AdministrativeArea","name":"Oost-Vlaanderen"},{"@type":"AdministrativeArea","name":"Antwerpen"},{"@type":"AdministrativeArea","name":"Vlaams-Brabant"},{"@type":"AdministrativeArea","name":"West-Vlaanderen"},{"@type":"AdministrativeArea","name":"Limburg"},{"@type":"AdministrativeArea","name":"Brussels Hoofdstedelijk Gewest"}]'
    if ($p.stad) { $gebied = "{""@type"":""Place"",""name"":""$(Js $p.stad)""}" }
    $dienstNaam = $p.dienstnaam; if (-not $dienstNaam) { $dienstNaam = $p.kop }
    $schema += ",{""@context"":""https://schema.org"",""@type"":""Service"",""name"":""$(Js $dienstNaam)"",""url"":""$url"",""inLanguage"":""$($t.lang)"",""areaServed"":$gebied,""provider"":{""@type"":""MovingCompany"",""@id"":""$domein/#bedrijf"",""name"":""MTM Solutions"",""url"":""$domein/"",""telephone"":""+32492051570""}}"
  }
  $schemaTag = ''; if ($schema) { $schemaTag = "<script type=""application/ld+json"">[$schema]</script>" }

  # Kop met of zonder foto
  $foto = ''
  if ($p.foto) {
    $fa = Enc $p.fotoalt
    $foto = "<figure class=""pagina-kop-foto""><img src=""/img/$($p.foto).webp"" srcset=""/img/$($p.foto)-small.webp 560w, /img/$($p.foto)-mid.webp 800w, /img/$($p.foto).webp 1120w"" sizes=""(max-width: 900px) calc(100vw / 1.5), 45vw"" width=""1120"" height=""747"" fetchpriority=""high"" decoding=""async"" alt=""$fa""></figure>"
  }
  $kruimelHtml = ''
  if ($p.slug -ne 'fr' -and -not $is404) {
    $homePad = '/'; if ($p.taal -eq 'fr') { $homePad = '/fr/' }
    $kruimelHtml = "<nav class=""kruimel"" aria-label=""$($t.kruimel)""><ol><li><a href=""$homePad"">$($t.home)</a></li><li aria-current=""page"">$(Enc $kruimel)</li></ol></nav>"
  }
  $bovenkop = ''; if ($p.bovenkop) { $bovenkop = "<p class=""eyebrow"">$(Enc $p.bovenkop)</p>" }
  $intro = ''; if ($p.intro) { $intro = "<p class=""lede"">$(Enc $p.intro)</p>" }
  $knoppen = "<div class=""hero-acts""><a class=""btn btn-accent btn-lg"" href=""$offerte""$doel>$($t.offerteLang) $svgPijl</a><a class=""btn btn-ghost btn-lg"" href=""tel:+32492051570"">$svgTel $($t.bel)</a></div>"
  if ($p.soort -eq 'info') { $knoppen = '' }

  $kopGrid = 'wrap pagina-kop-grid'; if (-not $p.foto) { $kopGrid = 'wrap' }
  $kopHtml = @"
<section class="pagina-kop">
  <div class="$kopGrid">
    <div class="pagina-kop-tekst">
      $kruimelHtml
      $bovenkop
      <h1>$(Enc $p.kop)</h1>
      $intro
      $knoppen
    </div>
    $foto
  </div>
</section>
"@

  # Tekst met offertekaart ernaast (niet op de info-pagina's)
  if ($p.soort -eq 'info') {
    $lijf = "<section class=""section""><div class=""wrap""><article class=""tekst"">$($p.inhoud)</article></div></section>"
  } else {
    $lijf = @"
<section class="section">
  <div class="wrap pagina-grid">
    <article class="tekst">
$($p.inhoud)
    </article>
    <aside class="zijkaart" aria-labelledby="zkTitel">
      <h2 id="zkTitel">$($t.zkTitel)</h2>
      <ul class="ticks">$($t.zkTicks)</ul>
      <a class="btn btn-accent" href="$offerte"$doel>$($t.zkKnop)</a>
      <a class="btn btn-ghost" href="tel:+32492051570">$svgTel $($t.bel)</a>
      <p class="small">$($t.zkUren)</p>
    </aside>
  </div>
</section>
"@
  }

  # Tegels naar de andere pagina's (interne links helpen Google de site te begrijpen)
  $tegels = ''
  if ($p.taal -eq 'nl' -and ($p.soort -eq 'dienst' -or $p.soort -eq 'regio')) {
    $tegels = "<section class=""section section-paper""><div class=""wrap""><div class=""tegels-blok""><h2>$($t.diensten)</h2><ul class=""tegels"">$(Tegels $dienstenNl $p.slug)</ul></div><div class=""tegels-blok""><h2>$($t.regios)</h2><ul class=""tegels"">$(Tegels $regiosNl $p.slug)</ul></div></div></section>"
  }
  if ($p.taal -eq 'fr' -and $p.soort -ne 'info') {
    $frLijst = @(@{ slug = 'fr'; label = 'Accueil' }) + $paginasFr
    $tegels = "<section class=""section section-paper""><div class=""wrap""><div class=""tegels-blok""><h2>$($t.diensten)</h2><ul class=""tegels"">$(Tegels $frLijst $p.slug)</ul></div></div></section>"
  }

  $ctaKop = $p.ctakop; if (-not $ctaKop) { $ctaKop = $t.offerteLang }
  $cta = ''
  if ($p.soort -ne 'info') {
    $cta = "<section class=""cta-band""><div class=""wrap""><div><h2>$(Enc $ctaKop)</h2><p>$($t.ctaTekst)</p></div><div class=""hero-acts""><a class=""btn btn-accent btn-lg"" href=""$offerte""$doel>$($t.offerteKort) $svgPijl</a><a class=""btn btn-ghost btn-lg"" href=""tel:+32492051570"">$svgTel $($t.bellen)</a></div></div></section>"
  }

  $robots = ''; if ($is404) { $robots = '<meta name="robots" content="noindex">' }
  $canon = "<link rel=""canonical"" href=""$url"">"; if ($is404) { $canon = '' }

  $html = @"
<!doctype html>
<html lang="$($t.lang)">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$(Enc $p.titel)</title>
<meta name="description" content="$(Enc $p.beschrijving)">
$robots
$canon
$hreflang
<meta property="og:type" content="website">
<meta property="og:site_name" content="MTM Solutions">
<meta property="og:locale" content="$($t.og)">
<meta property="og:title" content="$(Enc $p.titel)">
<meta property="og:description" content="$(Enc $p.beschrijving)">
<meta property="og:url" content="$url">
<meta property="og:image" content="$domein/img/og-image.jpg">
<meta name="theme-color" content="#292929">
<link rel="icon" href="/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/img/favicon-180.png">
<link rel="stylesheet" href="/css/style.css?v=41">
<script>document.documentElement.className += ' js';</script>
$schemaTag
</head>
<body>
<a class="skip" href="#inhoud">$($t.skip)</a>

<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="logo" href="$(if ($p.taal -eq 'fr') { '/fr/' } else { '/' })" aria-label="$($t.logoLabel)">
      <img class="logo-beeld" src="/img/logo.webp" srcset="/img/logo-small.webp 260w, /img/logo.webp 520w" sizes="(max-width: 420px) 60px, 84px" width="520" height="338" alt="">
      <span class="logo-naam"><b>MTM</b> Solutions</span>
    </a>
    <nav aria-label="$($t.menu)">
      <ul class="nav-list" id="navList">$($t.nav)</ul>
    </nav>
    <div class="nav-r">
      <a class="taal" href="$taalHref" hreflang="$($t.taalLang)" lang="$($t.taalLang)" title="$($t.taalTitel)">$($t.taalLabel)</a>
      <a class="btn btn-accent btn-sm" href="$offerte"$doel>$($t.offerteKort)</a>
      <button class="menu-btn" id="menuBtn" type="button" aria-label="$($t.menuOpen)" aria-expanded="false" aria-controls="navList">$svgMenu</button>
    </div>
  </div>
</header>

<main id="inhoud">
$kopHtml
$lijf
$tegels
$cta
</main>

$(Footer $p.taal)

<div class="mobile-bar" id="mobileBar">
  <a class="btn btn-dark" href="tel:+32492051570">$svgTel $($t.bellen)</a>
  <a class="btn btn-accent" href="$offerte"$doel>$($t.offerteKort)</a>
</div>

<script src="/js/script.js?v=41"></script>
</body>
</html>
"@
  # Lege regels van weggelaten onderdelen opruimen
  $html = [regex]::Replace($html, '(\r?\n)[ \t]*(?=\r?\n)', '')

  if ($is404) { $uit = Join-Path $site '404.html' }
  else {
    $map = Join-Path $site ($p.slug -replace '/', '\')
    [IO.Directory]::CreateDirectory($map) | Out-Null
    $uit = Join-Path $map 'index.html'
  }
  [IO.File]::WriteAllText($uit, $html, $utf8)
  Write-Host "ok  $(Pad $p.slug)"
}

# ---------- Footer van de homepage vernieuwen ----------
$homeBestand = Join-Path $site 'index.html'
$homeHtml = [IO.File]::ReadAllText($homeBestand, $utf8)
$nieuw = [regex]::Replace($homeHtml, '(?s)<!-- FOOTER:START.*?<!-- FOOTER:END -->', [System.Text.RegularExpressions.MatchEvaluator] { param($m) (Footer 'nl').Trim() })
if ($nieuw -eq $homeHtml -and $homeHtml -notmatch 'FOOTER:START') { Write-Warning 'Geen FOOTER-markering gevonden in index.html' }
[IO.File]::WriteAllText($homeBestand, $nieuw, $utf8)

# ---------- sitemap.xml ----------
$urls = @("$domein/") + ($paginas | Where-Object { $_.slug -ne '404' -and $_.slug -ne '' } | ForEach-Object { Url $_.slug })
$sm = "<?xml version=""1.0"" encoding=""UTF-8""?>`n<urlset xmlns=""http://www.sitemaps.org/schemas/sitemap/0.9"">`n"
foreach ($u in $urls) { $sm += "  <url><loc>$u</loc><lastmod>$vandaag</lastmod></url>`n" }
$sm += "</urlset>`n"
[IO.File]::WriteAllText((Join-Path $site 'sitemap.xml'), $sm, $utf8)
Write-Host "sitemap: $($urls.Count) adressen"
