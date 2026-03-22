

const footerLinks = [
  { label: 'Contract', href: '#' },
  { label: 'Docs', href: '#' },
  { label: 'Github', href: '#' },
  { label: 'Discord', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-slate-50 w-full py-12 mt-8">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-bold text-slate-900 font-headline">ZuruToken</div>
        <div className="flex gap-8 flex-wrap justify-center">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-500 hover:text-blue-500 transition-colors text-sm tracking-wide uppercase font-body"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="text-slate-500 text-xs tracking-wide uppercase font-body">
          © 2024 ZuruToken. Built for the Luminous Flow.
        </div>
      </div>
    </footer>
  );
}
