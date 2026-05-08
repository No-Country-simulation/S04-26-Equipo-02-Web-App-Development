import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, Calendar, BookOpen, Users } from "lucide-react"

const communityFeatures = [
  {
    icon: MessageCircle,
    title: "Grupos de WhatsApp",
    description: "Oportunidades laborales, talleres y recursos compartidos.",
  },
  {
    icon: Calendar,
    title: "Webinars Mensuales",
    description: "Speakers del mundo corporativo sobre temas de carrera.",
  },
  {
    icon: BookOpen,
    title: "Networking",
    description: "Encuentros para crear alianzas profesionales.",
  },
  {
    icon: Users,
    title: "Comunidad Nacional",
    description: "Profesionales de diferentes sectores e industrias.",
  },
]

const founders = [
  { name: "Vanina Colazo", initials: "VC" },
  { name: "Ana Caro Corbelle", initials: "AC" },
  { name: "Evelyn Stacey", initials: "ES" },
]

export function Community() {
  return (
    <section id="comunidad" className="py-24 lg:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Comunidad
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Una red de apoyo para profesionales senior
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Creada por profesionales de HR que comprenden los desafios de la reinvencion profesional.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {communityFeatures.map((feature) => (
            <div key={feature.title} className="bg-background p-8 text-center">
              <feature.icon className="mx-auto h-5 w-5 text-foreground" />
              <h3 className="mt-6 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl border border-border p-8 lg:p-12">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Fundadoras
            </p>
            <p className="mt-3 text-muted-foreground">
              3 profesionales del mundo de HR comprometidas con la empleabilidad senior
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {founders.map((founder) => (
              <div key={founder.name} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border text-sm font-medium text-foreground">
                  {founder.initials}
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">{founder.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth/register">Unirse a la comunidad</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
