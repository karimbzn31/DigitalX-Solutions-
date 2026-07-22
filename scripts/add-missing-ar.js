const fs = require("fs");
let c = fs.readFileSync("./src/lib/translations.ts", "utf8");

// Extract FR keys from first section
const frSection = c.match(/export const fr = \{([\s\S]*?)\};/)[1];
const arSectionMatch = c.match(/export const ar: Record<TranslationKey, string> = \{([\s\S]*?)\};/);
const arSection = arSectionMatch[1];

const frLines = frSection.split("\n").filter(l => l.match(/": "/));
const frKeys = frLines.map(l => l.match(/"([^"]+)":/)?.[1]).filter(Boolean);

const arLines = arSection.split("\n").filter(l => l.match(/": "/));
const arKeys = arLines.map(l => l.match(/"([^"]+)":/)?.[1]).filter(Boolean);

const missing = frKeys.filter(k => !arKeys.includes(k));
console.log("FR keys:", frKeys.length);
console.log("AR keys:", arKeys.length);
console.log("Missing AR keys:", missing.length);

// For each missing key, add Arabic translation
// We take the FR value and add localized AR text
const missingEntries = missing.map(k => {
  const line = frLines.find(l => l.includes('"' + k + '":'));
  // Extract the value (after ": ", before last line char)
  const v = line.replace(/.*": "/, "").replace(/",?\s*$/, "");
  return { key: k, frValue: v };
});

// Add AR translations for all missing keys
// Use Arabic equivalent or technical transliteration for technical terms
const extraAr = missingEntries.map(entry => {
  const k = entry.key;
  const v = entry.frValue;

  // Map specific keys to proper Arabic translations
  const arMap = {
    "features.eyebrow": "ما ينتظرك",
    "features.titre": "تكوين معد لأولئك الذين يريدون البناء",
    "features.sousTitre": "لا نظرية زائدة. كل وحدة تدفعك لإنتاج شيء حقيقي.",
    "features.f1t": "ذكاء اصطناعي مجاني وغير محدود",
    "features.f1d": "نماذج متطورة بدون اشتراك، متاحة في أي وقت.",
    "features.f2t": "Vibe Coding",
    "features.f2d": "طور برامجك 10 أضعاف مع الذكاء الاصطناعي التوليدي والبرمجة الثنائية.",
    "features.f3t": "إنشاء SaaS الخاص بك",
    "features.f3d": "من الفكرة إلى المنتج على الإنترنت - تقنية، نشر، توسيع.",
    "features.f4t": "وكيل ذكاء اصطناعي شخصي",
    "features.f4d": "أنشئ وكلاء أذكياء لأتمتة مهامك.",
    "features.f5t": "تحديث منتظم",
    "features.f5d": "محتوى محدث باستمرار لمواكبة التطور السريع للذكاء الاصطناعي.",
    "features.f6t": "مجتمع نشط",
    "features.f6d": "تبادل مع المتعلمين الآخرين واحصل على الدعم.",
    "stats.1": "تكويناً في البرنامج",
    "stats.2": "متعلماً مسجلاً",
    "stats.3": "ساعة من المحتوى المرئي",
    "stats.4": "نسبة رضا",
    "moduleZero.badge": "✦ أكاديمية ديجيتال إكس سوليوشنز",
    "moduleZero.w1": "حوّل",
    "moduleZero.w2": "أفكارك",
    "moduleZero.w3": "إلى شركة ناشئة بفضل الذكاء الاصطناعي",
    "moduleZero.subtitle": "أتقن الذكاء الاصطناعي و Vibe Coding وتطوير SaaS. ابنِ منتجات حقيقية. أطلق شركتك الناشئة.",
    "moduleZero.pourquoiTitre": "لماذا نحن؟",
    "moduleZero.pourquoiDesc": "نحن لا نقدم نظرية فقط. هنا، تتعلم من خلال بناء مشاريع حقيقية. تخرج بمهارات تدرّ عليك المال، وليس مجرد شهادة.",
    "moduleZero.obtiens": "ما تحصل عليه مجاناً:",
    "moduleZero.item1t": "نماذج ذكاء اصطناعي قوية",
    "moduleZero.item1d": "وصول مجاني لنماذج مثل Claude Code بفضل استراتيجيتنا",
    "moduleZero.item2t": "وكلاء ذكاء اصطناعي مستقلون",
    "moduleZero.item2d": "أنشئ وكلاء يعملون لك 24/24",
    "moduleZero.item3t": "أتمتة كاملة",
    "moduleZero.item3d": "أتقن N8N، Instagram، Facebook، WhatsApp",
    "moduleZero.item4t": "أطلق SaaS الخاص بك",
    "moduleZero.item4d": "تعلّم الإنشاء والنشر والربح",
    "moduleZero.imagine": "تخيّل بعد إتمام تكويناتنا...",
    "moduleZero.revenu": "مشاريع تدرّ عليك دخلاً حقيقياً. ليست نظرية، بل نتائج.",
    "testimonials.eyebrow": "الشهادات",
    "testimonials.titre": "لقد قاموا بالقفزة بالفعل.",
    "testimonials.sousTitre": "اكتشف ما يقوله متعلمونا عن تجربتهم.",
    "cta.action": "الآن",
    "cta.titre1": "مستعد لبناء",
    "cta.titre2": "المستقبل",
    "cta.titre3": "؟",
    "cta.desc": "انضم إلى أكثر من {count} متعلّماً يحوّلون أفكارهم إلى شركات ناشئة بالذكاء الاصطناعي.",
    "cta.btn": "ابدأ الآن →",
    "cta.contact": "اتصل بنا",
    "cta.footer": "✦ الجزائر وما بعدها ✦",
    "login.bienvenue": "سعداء بعودتك",
    "login.subtitle": "سجّل الدخول لمواصلة تكوينك",
    "login.connecter": "تسجيل الدخول",
    "login.pasCompte": "ليس لديك حساب بعد؟",
    "login.inscrire": "التسجيل",
    "login.ou": "أو المتابعة باستخدام",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.mdpOublie": "نسيت كلمة المرور؟",
    "register.titre": "انضم إلى الأكاديمية",
    "register.subtitle": "أنشئ حسابك وتمتع بالوصول إلى جميع تكويناتنا",
    "register.inscription": "إنشاء حسابي",
    "register.dejaCompte": "لديك حساب بالفعل؟",
    "register.connecter": "تسجيل الدخول",
    "register.enCours": "جارٍ التسجيل...",
    "register.nom": "الاسم الكامل",
    "register.email": "البريد الإلكتروني",
    "register.password": "كلمة المرور",
    "forgot.titre": "نسيت كلمة المرور",
    "forgot.subtitle": "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور",
    "forgot.envoyer": "إرسال الرابط",
    "forgot.retour": "العودة إلى تسجيل الدخول",
    "forgot.envoi": "جارٍ الإرسال...",
    "forgot.email": "البريد الإلكتروني",
    "notFound.titre": "الصفحة غير موجودة",
    "notFound.desc": "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    "notFound.retour": "العودة إلى الرئيسية",
    "error.titre": "حدث خطأ",
    "error.desc": "حدث خطأ ما. حاول تحديث الصفحة.",
    "error.reessayer": "إعادة المحاولة",
    "error.retour": "العودة إلى الرئيسية",
    "chat.welcome": "مرحباً {name}! أنا مرشد أكاديمية ديجيتال إكس سوليوشنز. اسألني عن Vibe Coding أو الذكاء الاصطناعي أو SaaS أو التكوينات.",
    "chat.placeholder": "اطرح سؤالك...",
    "chat.indisponible": "الخدمة غير متاحة حالياً.",
    "legal.titre": "الإشعار القانوني وشروط الاستخدام",
    "legal.sousTitre": "معلومات قانونية بخصوص أكاديمية ديجيتال إكس سوليوشنز",
    "dashboardHero.salut": "مرحباً {name} 👋",
    "dashboardHero.message": "واصل التقدم، خطوة بخطوة.",
    "dashboardHero.tipLabel": "نصيحة اليوم",
    "formations.heroBadge": "كتالوج 2026",
    "formations.heroTitre": "تكويناتنا",
    "formations.heroDesc": "استكشف كتالوج التكوينات المصممة لجعلك خبيراً في الذكاء الاصطناعي والأتمتة وإنشاء الشركات الناشئة. كل تكوين عملي 100%.",
    "formations.certificat": "شهادة عند الإتمام",
    "formations.accesCommunaute": "وصول إلى المجتمع الخاص",
    "formations.decouvrir": "اكتشف التكوين",
    "formations.question": "لديك سؤال عن تكويناتنا؟",
    "formations.questionDesc": "فريقنا ومجتمعنا هنا لإرشادك في اختيارك",
    "formations.rejoindre": "انضم إلى المجتمع",
    "formations.demanderIA": "اسأل ديجيتال إكس أي",
    "common.chargement": "جارٍ التحميل...",
    "common.aucun": "لا توجد نتائج"
  };

  const arVal = arMap[k];
  if (arVal) {
    return `  "${k}": "${arVal.replace(/"/g, '\\"')}"`;
  }
  // Fallback: use FR value
  return `  "${k}": "${v}"`;
}).filter(Boolean);

// Add missing AR entries before closing brace of AR section
const arClose = "};";
const arCloseIdx = c.lastIndexOf(arClose);
const beforeClose = c.substring(0, arCloseIdx);
const afterClose = c.substring(arCloseIdx);

c = beforeClose + extraAr.join(",\n") + "\n" + afterClose;

fs.writeFileSync("./src/lib/translations.ts", c);
console.log("Added", extraAr.length, "missing AR translations");
