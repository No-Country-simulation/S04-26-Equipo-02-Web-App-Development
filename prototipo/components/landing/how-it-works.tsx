import { ClipboardCheck, Route, UserCircle, Building2 } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Diagnostico Integral",
    description:
      "Evaluacion de competencias tecnicas, habilidades blandas y alineacion con el mercado laboral actual.",
    icon: ClipboardCheck,
  },
  {
    number: "02",
    title: "Ruta de Desarrollo",
    description:
      "Plan individualizado con modulos de upskilling y reskilling adaptados a tus objetivos profesionales.",
    icon: Route,
  },
  {
    number: "03",
    title: "Perfil Profesional",
    description:
      "CV dinamico que refleja tus competencias validadas y se actualiza con tu progreso formativo.",
    icon: UserCircle,
  },
  {
    number: "04",
    title: "Conexion Empresarial",
    description:
      "Acceso al marketplace donde empresas buscan perfiles senior con habilidades actualizadas.",
    icon: Building2,
  },
]

export function HowItWorks() {
  return (
    <section id="metodologia" className="py-24 lg:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Metodologia
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Un proceso estructurado hacia tu reinsercion laboral
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-background p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tracking-wider text-muted-foreground">
                  {step.number}
                </span>
                <step.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="mt-8 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
