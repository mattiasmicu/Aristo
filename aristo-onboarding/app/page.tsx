import { AristoOnboarding } from "@/components/ui/aristo-onboarding"

const AristoOnboardingDemo = () => {
  const handleComplete = (data: any) => {
    console.log("Setup completed:", data)
    alert(`Setup complete! Check console for all data.`)
  }

  return (
    <div className="bg-background text-foreground">
      <AristoOnboarding onComplete={handleComplete} />
    </div>
  )
}

export default AristoOnboardingDemo
