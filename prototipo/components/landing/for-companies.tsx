import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Search, Filter, Users, Shield } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Galeria de Talento",
    description: "Perfiles profesionales con skills validadas y trayectoria verificable.",
  },
  {
    icon: Filter,
    title: "Filtros Avanzados",
    description: "Busqueda por habilidades, experiencia sectorial y competencias.",
  },
  {
    icon: Users,
    title: "Talento Actualizado",
    description: "Profesionales con formacion reciente en competencias clave.",
  },
  {
    icon: Shield,
    title: "Reduccion de Riesgo",
    description: "Candidatos con evidencia de aprendizaje y adaptabilidad.",
  },
]

const stats = [
  { label: "Experiencia promedio", value: "15+ anos" },
  { label: "Talento disponible", value: "650+" },
  { label: "Perfiles validados", value: "100%" },
]

export function ForCompanies() {
  return (
    <section id="empresas" className="py-24 lg:py-32 bg-muted/30 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Para Empresas
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Acceda a talento senior actualizado
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Profesionales experimentados que combinan trayectoria con habilidades renovadas. Un pipeline de candidatos que entienden su negocio.
            </p>

            <div className="mt-10 flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/auth/register?type=company">
                  Explorar Talento
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="bg-background p-8">
                <feature.icon className="h-5 w-5 text-foreground" />
                <h3 className="mt-6 text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
