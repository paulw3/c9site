// Shared "chrome" strings only — Header, Footer, MethodologyStrip, Hero's
// fixed bits, and other copy reused across pages. Page-specific copy (hero
// headline, pillar card text, section content) lives directly in each
// locale's page file instead, the same way English page copy already does.
export const defaultLocale = 'en';
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const ui = {
  en: {
    skipToContent: 'Skip to content',
    navCloudMigration: 'Cloud Migration & Transformation',
    navGdc: 'Google Distributed Cloud',
    navResources: 'Resources',
    navAbout: 'About',
    navContact: 'Contact',
    navWhatsapp: 'Message us',
    navLangSwitch: 'العربية',
    wordmarkAria: 'C-9INE, home',
    whatsappAria: 'Message us on WhatsApp',
    menuAria: 'Open menu',
    footerPartner: 'Google Cloud Preferred Partner',
    footerRights: 'All rights reserved.',
    footerAddress1: 'Sahaba Tissa (Cloud 9)',
    footerAddress2: '7586 King Fahad Road, Ar Rahmaniyah',
    footerAddress3: 'Riyadh 12341, Saudi Arabia',
    talkToUs: 'Talk to us',
    heroTrustLine: 'Born and based in Saudi Arabia',
    methodologyDesignLabel: 'Design',
    methodologyDesignCopy: 'Target-state architecture, mapped before a single workload moves.',
    methodologyEngineerLabel: 'Engineer',
    methodologyEngineerCopy:
      'Governed execution: migration factory or GDC deployment, whichever the destination needs.',
    methodologyRunLabel: 'Run',
    methodologyRunCopy:
      'Documentation, knowledge transfer and support to keep it running, or we hand you the keys entirely.',
  },
  ar: {
    skipToContent: 'تخطَّ إلى المحتوى',
    navCloudMigration: 'الترحيل والتحول السحابي',
    navGdc: 'السحابة الموزعة من جوجل',
    navResources: 'الموارد',
    navAbout: 'من نحن',
    navContact: 'اتصل بنا',
    navWhatsapp: 'راسلنا',
    navLangSwitch: 'English',
    wordmarkAria: 'سي-9اين، الصفحة الرئيسية',
    whatsappAria: 'راسلنا عبر واتساب',
    menuAria: 'افتح القائمة',
    footerPartner: 'شريك Google Cloud المفضّل',
    footerRights: 'جميع الحقوق محفوظة.',
    footerAddress1: 'صحابة تسعة (Cloud 9)',
    footerAddress2: '٧٥٨٦ طريق الملك فهد، الرحمانية',
    footerAddress3: 'الرياض ١٢٣٤١، المملكة العربية السعودية',
    talkToUs: 'تواصل معنا',
    heroTrustLine: 'تأسسنا ومقرّنا في المملكة العربية السعودية',
    methodologyDesignLabel: 'التصميم',
    methodologyDesignCopy: 'بنية الحالة المستهدفة، تُرسم قبل نقل أي حمل عمل واحد.',
    methodologyEngineerLabel: 'الهندسة',
    methodologyEngineerCopy: 'تنفيذ محكوم: مصنع ترحيل أو نشر GDC، أيًا كانت الوجهة المطلوبة.',
    methodologyRunLabel: 'التشغيل',
    methodologyRunCopy: 'توثيق، ونقل معرفة، ودعم لإبقاء النظام يعمل، أو نسلّمك المفاتيح بالكامل.',
  },
} as const;

export function t(locale: Locale, key: keyof (typeof ui)['en']): string {
  return ui[locale][key];
}
