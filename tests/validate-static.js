const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const cv = read('index.html');
const cvStyles = read('style.css');
const caseStudy = read('projects/astel/index.html');
const siteScript = read('site.js');

assert.match(cv, /href="projects\/astel\/"/, 'CV links to the ASTEL case study');
assert.match(cv, /<div class="profile-controls">[\s\S]*id="theme-toggle"[\s\S]*id="language-toggle"[\s\S]*<div class="profile_container">/, 'CV places theme and language controls inside the profile card before profile content');
assert.match(cv, /projects\.kiosk\.name/, 'CV uses a translated company-neutral project title');
assert.match(cv, /projects\.astel\.description/, 'CV includes translated ASTEL teaser copy');
assert.match(cv, /src="projects\/astel\/images\/kiosk-boot\.webp"/, 'CV includes the ASTEL device hero image');
assert.match(cvStyles, /@media print[\s\S]*\.project-hero-image[\s\S]*display:\s*none/, 'Print hides ASTEL teaser visual');
assert.match(cvStyles, /@media print[\s\S]*\.case-study-link[\s\S]*display:\s*none/, 'Print hides ASTEL case-study link');

assert.match(caseStudy, /href="\.\.\/\.\.\/index\.html#projects"/, 'Case study links back to CV projects');
assert.match(caseStudy, /<h1 class="case-study-title" data-i18n="kiosk\.title">Custom Touchscreen Kiosk<\/h1>/, 'Case study uses a company-neutral title');
assert.match(caseStudy, /data-i18n="astel\.starting\.title"/, 'Case study includes starting point');
assert.match(caseStudy, /data-i18n="astel\.kiosk\.title"/, 'Case study includes kiosk mode section');
assert.match(caseStudy, /data-i18n="astel\.setup\.title"/, 'Case study includes setup interface section');
assert.match(caseStudy, /data-i18n="astel\.hardware\.title"/, 'Case study includes hardware-specific problems');
assert.match(caseStudy, /data-i18n="astel\.branding\.title"/, 'Case study includes branding and controls');
assert.match(caseStudy, /data-i18n="astel\.deployment\.title"/, 'Case study includes deployment and recovery');
assert.match(caseStudy, /data-i18n="astel\.result\.title"/, 'Case study includes result section');
assert.match(caseStudy, /6\.1/, 'Case study includes original startup metric');
assert.match(caseStudy, /4\.4/, 'Case study includes optimized startup metric');
assert.match(caseStudy, /19/, 'Case study includes original WiFi metric');
assert.match(caseStudy, /10\.5/, 'Case study includes optimized WiFi metric');
assert.match(caseStudy, /src="images\/kiosk-boot\.webp"[^>]*width="1715"[^>]*height="1715"/, 'Case study includes an explicit-size hero image');
assert.match(caseStudy, /src="images\/kiosk-config-keyboard\.webp"[^>]*loading="lazy"/, 'Case study includes a lazy-loaded privacy-safe provisioning photo');
assert.match(caseStudy, /src="images\/kiosk-config-ui\.webp"[^>]*loading="lazy"/, 'Case study includes a lazy-loaded configuration UI image');
assert.doesNotMatch(caseStudy, /data-i18n="visual\.(hero|provisioning|kiosk)"/, 'Replaced image placeholders are removed');
assert.doesNotMatch(caseStudy, /visual-placeholder/, 'Case study no longer contains visual placeholders');
assert.doesNotMatch(caseStudy, /id="language-toggle"/, 'Case study does not include a language toggle');
assert.match(caseStudy, /const translations = \{[\s\S]*en:\s*\{/, 'Case study includes English translations');
assert.doesNotMatch(caseStudy, /\n\s*sl:\s*\{/, 'Case study does not include Slovenian translations');
assert.match(caseStudy, /src="\.\.\/\.\.\/site\.js"/, 'Case study uses shared preference script');
assert.match(cv, /src="site\.js"/, 'CV uses shared preference script');
assert.match(siteScript, /window\.initSite/, 'Shared script exposes site initializer');
assert.match(siteScript, /prefers-color-scheme:\s*light/, 'Shared script defaults to the system theme');
assert.match(siteScript, /const hasLanguageToggle = Boolean\(languageToggle\)/, 'Shared script keeps pages without language toggles English-only');
assert.match(caseStudy, /prefers-color-scheme:\s*light/, 'Case study applies the system theme before rendering');
assert.doesNotMatch(cvStyles, /\.(theme-toggle|language-toggle)\s*\{[^}]*position:\s*fixed/, 'Profile controls are positioned relative to the profile card, not the viewport');
assert.match(cvStyles, /\.profile\s*\{[\s\S]*position:\s*relative/, 'Profile card establishes the positioning context for controls');
assert.match(cvStyles, /\.profile-controls\s*\{[\s\S]*position:\s*absolute/, 'Profile controls sit inside the profile card corner');
assert.doesNotMatch(cvStyles, /\.theme-toggle\.is-switching\s+svg\s*\{[\s\S]*animation:\s*themeIconSwitch/, 'Theme click animation stays off icon transforms to avoid end-of-animation snapping');
assert.match(cvStyles, /\.theme-toggle\.is-switching\s*\{[\s\S]*animation:\s*themeControlSwitch/, 'Theme click animation runs on the control wrapper');
assert.match(cvStyles, /\.language-toggle\.is-switching\s*\{[\s\S]*animation:\s*themeControlSwitch/, 'Language click animation matches the theme control wrapper animation');
assert.doesNotMatch(cvStyles, /@keyframes languageTicker|\.language-toggle\.is-switching\s+\.lang-text/, 'Language toggle does not use a separate text ticker animation');
assert.match(cvStyles, /@media only screen and \(max-width: 768px\)[\s\S]*\.theme-toggle svg\s*\{[^}]*width:\s*2rem;[^}]*height:\s*2rem;/, 'Mobile theme icon is slightly smaller than desktop to match language control weight');

const caseStudyKeys = [...caseStudy.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]);
for (const key of new Set(caseStudyKeys)) {
  const translationOccurrences = caseStudy.match(new RegExp(`'${key.replaceAll('.', '\\.')}'\\s*:`, 'g')) || [];
  assert.equal(translationOccurrences.length, 1, `Case study includes one English translation for ${key}`);
}

console.log('Static validation passed.');
