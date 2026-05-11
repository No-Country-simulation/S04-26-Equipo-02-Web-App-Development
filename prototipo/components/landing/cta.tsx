import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-primary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            Inicie su proceso de reinsercion laboral
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/70">
            Mas de 650 profesionales ya estan transformando su carrera. El diagnostico inicial es gratuito.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button 
              size="lg" 
              variant="secondary" 
              asChild
            >
              <Link href="/auth/register">
                Comenzar diagnostico
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/auth/register?type=company">
                Acceso empresas
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
