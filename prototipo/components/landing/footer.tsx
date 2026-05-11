import Link from "next/link"

const footerLinks = {
  plataforma: [
    { name: "Metodologia", href: "#metodologia" },
    { name: "Profesionales", href: "#profesionales" },
    { name: "Empresas", href: "#empresas" },
    { name: "Comunidad", href: "#comunidad" },
  ],
  recursos: [
    { name: "Blog", href: "#" },
    { name: "Webinars", href: "#" },
    { name: "Guias practicas", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  legal: [
    { name: "Terminos de uso", href: "#" },
    { name: "Privacidad", href: "#" },
    { name: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Red de Bienestar Laboral
            </span>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Conectamos talento senior con oportunidades reales. Tu experiencia tiene valor.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Plataforma
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.plataforma.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Recursos
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Legal
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} Red de Bienestar Laboral. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
