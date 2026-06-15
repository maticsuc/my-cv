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
assert.match(caseStudy, /const translations = \{[\s\S]*en:\s*\{[\s\S]*sl:\s*\{/, 'Case study includes English and Slovenian translations');
assert.match(caseStudy, /src="\.\.\/\.\.\/site\.js"/, 'Case study uses shared preference script');
assert.match(cv, /src="site\.js"/, 'CV uses shared preference script');
assert.match(siteScript, /window\.initSite/, 'Shared script exposes site initializer');
assert.match(siteScript, /prefers-color-scheme:\s*light/, 'Shared script defaults to the system theme');
assert.match(caseStudy, /prefers-color-scheme:\s*light/, 'Case study applies the system theme before rendering');

const caseStudyKeys = [...caseStudy.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]);
for (const key of new Set(caseStudyKeys)) {
  const translationOccurrences = caseStudy.match(new RegExp(`'${key.replaceAll('.', '\\.')}'\\s*:`, 'g')) || [];
  assert.equal(translationOccurrences.length, 2, `Case study includes English and Slovenian translations for ${key}`);
}

console.log('Static validation passed.');
