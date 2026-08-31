const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const footerMarker = '{/* Professional Footer */}';

const ctaCode = `      {/* Final CTA Banner */}
      <section className="bg-slate-900 dark:bg-slate-950 px-4 py-24 relative z-10 border-t-4 border-slate-800 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-pixel text-white text-3xl md:text-5xl leading-tight mb-6">
            Siap Menjadi Pahlawan Lingkungan?
          </h2>
          <p className="font-pixel-body text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Mulai kumpulkan botol pertama Anda hari ini. Bersama, kita wujudkan kampus bersih, inovatif, dan dapatkan berbagai reward eksklusif!
          </p>
          <Link
            to="/register"
            className="inline-flex font-pixel border-4 border-white bg-green-500 text-slate-900 px-10 py-4 items-center gap-4 text-base md:text-lg transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none"
          >
            DAFTAR SEKARANG <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      `;

if (code.includes(footerMarker)) {
  code = code.replace(footerMarker, ctaCode + footerMarker);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Final CTA successfully injected before the footer.');
} else {
  console.log('Error: Could not find the footer marker.');
}
