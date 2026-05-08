import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Monitor, Brain, Heart } from "lucide-react"

const skillCategories = [
  {
    title: "Habilidades Digitales",
    icon: Monitor,
    skills: [
      "Herramientas de colaboracion",
      "Analisis de datos",
      "IA para productividad",
      "Presencia digital profesional",
    ],
  },
  {
    title: "Habilidades Cognitivas",
    icon: Brain,
    skills: [
      "Pensamiento critico",
      "Resolucion de problemas",
      "Adaptabilidad al cambio",
      "Aprendizaje continuo",
    ],
  },
  {
    title: "Habilidades Socioemocionales",
    icon: Heart,
    skills: [
      "Liderazgo e influencia",
      "Comunicacion efectiva",
      "Inteligencia emocional",
      "Trabajo en equipo",
    ],
  },
]

const benefits = [
  {
    title: "Claridad profesional",
    description: "Comprende tu valor real en el mercado actual",
  },
  {
    title: "Empleabilidad mejorada",
    description: "Formacion practica con resultados medibles",
  },
  {
    title: "Competencias validadas",
    description: "Evidencia concreta de tus habilidades",
  },
]

export function ForProfessionals() {
  return (
    <section id="profesionales" className="py-24 lg:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Para Profesionales +45
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Formacion en las competencias que el mercado demanda
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Programas disenados para profesionales con experiencia que buscan actualizar sus habilidades.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <div key={category.title} className="border border-border p-8">
              <category.icon className="h-5 w-5 text-foreground" />
              <h3 className="mt-6 text-base font-semibold text-foreground">
                {category.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-foreground" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-5xl bg-primary p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-4 lg:items-center">
            <div>
              <h3 className="text-lg font-semibold text-primary-foreground">
                Beneficios clave
              </h3>
            </div>
            <div className="lg:col-span-3 grid gap-8 sm:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <h4 className="text-sm font-semibold text-primary-foreground">
                    {benefit.title}
                  </h4>
                  <p className="mt-1 text-sm text-primary-foreground/70">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/auth/register">
              Comenzar diagnostico
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
