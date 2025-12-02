"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, Plus, Trash2, Eye, EyeOff } from "lucide-react"

// --- TYPE DEFINITIONS ---
interface SignInPageProps {
  title?: React.ReactNode
  onComplete?: (data: WizardFormData) => void
}

interface WizardFormData {
  language: string
  serverName: string
  adminName: string
  adminEmail: string
  adminPassword: string
  libraries: Library[]
  metadataLanguage: string
  region: string
  allowRemoteNetwork: boolean
  useUPnP: boolean
}

interface Library {
  id: string
  name: string
  files: string[]
}

// --- CONSTANTS ---
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
]

const REGIONS = [
  { code: "us", name: "United States" },
  { code: "eu", name: "Europe" },
  { code: "asia", name: "Asia" },
  { code: "au", name: "Australia" },
  { code: "other", name: "Other" },
]

const DEMO_FILE_STRUCTURE = ["/", "/home/user/Music", "/home/user/Music/Artist/Album", "/media/external/library1"]

// --- SUB-COMPONENTS ---
const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-background/40 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
)

const Dropdown = ({
  label,
  value,
  onChange,
  options,
  isOpen,
  setIsOpen,
  dropdownRef,
  isClosing,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { code: string; name: string }[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement>
  isClosing: boolean
}) => (
  <div>
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <div className="relative" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full">
        <GlassInputWrapper>
          <div className="flex items-center justify-between p-4 rounded-2xl">
            <span className="text-sm">{options.find((o) => o.code === value)?.name || "Select option"}</span>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </GlassInputWrapper>
      </button>
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-background backdrop-blur-sm z-10 max-h-64 overflow-y-auto animate-dropdown-in ${isClosing ? "animate-dropdown-out" : ""}`}
        >
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                onChange(opt.code)
                setIsOpen(false)
              }}
              className={`w-full text-left p-4 hover:bg-foreground/5 transition-colors ${
                value === opt.code ? "bg-violet-500/10 border-l-2 border-violet-400" : ""
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
}) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <div
      className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
        checked ? "bg-violet-500 border-violet-500" : "border-muted-foreground/50 hover:border-violet-400/50"
      }`}
      onClick={() => onChange(!checked)}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <div className="flex-1">
      <div className="font-medium text-foreground text-sm">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
    </div>
  </label>
)

// --- STEP COMPONENTS ---
const Step1 = ({
  language,
  setLanguage,
  serverName,
  setServerName,
  isLanguageOpen,
  setIsLanguageOpen,
  dropdownRef,
  isLanguageClosing,
}: any) => (
  <form className="space-y-5">
    <Dropdown
      label="Language"
      value={language}
      onChange={setLanguage}
      options={LANGUAGES}
      isOpen={isLanguageOpen}
      setIsOpen={setIsLanguageOpen}
      dropdownRef={dropdownRef}
      isClosing={isLanguageClosing}
    />
    <div>
      <label className="text-sm font-medium text-muted-foreground">Server Name</label>
      <GlassInputWrapper>
        <input
          type="text"
          placeholder="Enter your server name"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
          required
        />
      </GlassInputWrapper>
    </div>
  </form>
)

const Step2 = ({
  adminName,
  setAdminName,
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  showPassword,
  setShowPassword,
}: any) => (
  <form className="space-y-5">
    <div>
      <p className="text-sm text-muted-foreground">This will be your admin account for the server.</p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Email</label>
      <GlassInputWrapper>
        <input
          type="email"
          placeholder="Enter email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
          required
        />
      </GlassInputWrapper>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Username</label>
      <GlassInputWrapper>
        <input
          type="text"
          placeholder="Enter username"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
          required
        />
      </GlassInputWrapper>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Password</label>
      <GlassInputWrapper>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
              <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            )}
          </button>
        </div>
      </GlassInputWrapper>
    </div>
  </form>
)

const Step3 = ({ libraries, setLibraries }: any) => {
  const addLibrary = () => {
    setLibraries([
      ...libraries,
      {
        id: Date.now().toString(),
        name: `Music Library ${libraries.length + 1}`,
        files: ["/home/user/Music"],
      },
    ])
  }

  const removeLibrary = (id: string) => {
    setLibraries(libraries.filter((lib: Library) => lib.id !== id))
  }

  const updateLibraryName = (id: string, name: string) => {
    setLibraries(libraries.map((lib: Library) => (lib.id === id ? { ...lib, name } : lib)))
  }

  return (
    <form className="space-y-5">
      <p className="text-sm text-muted-foreground">Configure your music libraries.</p>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {libraries.map((lib: Library) => (
          <div key={lib.id} className="space-y-2 rounded-2xl border border-border/30 p-4">
            <div className="flex gap-2 items-center">
              <GlassInputWrapper>
                <input
                  type="text"
                  value={lib.name}
                  onChange={(e) => updateLibraryName(lib.id, e.target.value)}
                  className="w-full bg-transparent text-sm p-3 rounded-2xl focus:outline-none"
                  placeholder="Library name"
                />
              </GlassInputWrapper>
              <button
                type="button"
                onClick={() => removeLibrary(lib.id)}
                className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="pl-3 border-l border-border/50 space-y-1">
              {DEMO_FILE_STRUCTURE.map((file, idx) => (
                <div key={idx} className="text-xs text-muted-foreground/70 font-mono">
                  {file}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addLibrary}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-violet-400/30 hover:bg-violet-500/10 py-3 font-medium text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Music Library
      </button>
    </form>
  )
}

const Step4 = ({
  metadataLanguage,
  setMetadataLanguage,
  region,
  setRegion,
  isMetadataOpen,
  setIsMetadataOpen,
  isRegionOpen,
  setIsRegionOpen,
  metadataRef,
  regionRef,
  isMetadataClosing,
  isRegionClosing,
}: any) => (
  <form className="space-y-5">
    <Dropdown
      label="Metadata Language"
      value={metadataLanguage}
      onChange={setMetadataLanguage}
      options={LANGUAGES}
      isOpen={isMetadataOpen}
      setIsOpen={setIsMetadataOpen}
      dropdownRef={metadataRef}
      isClosing={isMetadataClosing}
    />
    <Dropdown
      label="Region"
      value={region}
      onChange={setRegion}
      options={REGIONS}
      isOpen={isRegionOpen}
      setIsOpen={setIsRegionOpen}
      dropdownRef={regionRef}
      isClosing={isRegionClosing}
    />
  </form>
)

const Step5 = ({ allowRemoteNetwork, setAllowRemoteNetwork, useUPnP, setUseUPnP }: any) => (
  <form className="space-y-5">
    <div className="space-y-4">
      <CustomCheckbox
        checked={allowRemoteNetwork}
        onChange={setAllowRemoteNetwork}
        label="Allow Remote Network Connection"
        description="If unchecked, will block any remote connections to the server."
      />

      <CustomCheckbox
        checked={useUPnP}
        onChange={setUseUPnP}
        label="Automatically Forward Public Ports via UPnP"
        description="This may not work with some router models or network configurations. Changes will not apply until after a server restart."
      />
    </div>
  </form>
)

const Step6 = () => (
  <div className="space-y-6 text-center">
    <div>
      <h2 className="text-2xl font-semibold mb-2">Setup Complete!</h2>
      <p className="text-muted-foreground">Your Aristo media server is ready to use.</p>
    </div>
    <div className="space-y-2 text-sm text-muted-foreground">
      <p>You can now log in with your admin account and start managing your media libraries.</p>
    </div>
  </div>
)

// --- MAIN COMPONENT ---
export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Welcome to Aristo</span>,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [language, setLanguage] = useState("en")
  const [serverName, setServerName] = useState("")
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [libraries, setLibraries] = useState<Library[]>([{ id: "1", name: "My Music", files: ["/home/user/Music"] }])
  const [metadataLanguage, setMetadataLanguage] = useState("en")
  const [region, setRegion] = useState("us")
  const [allowRemoteNetwork, setAllowRemoteNetwork] = useState(false)
  const [useUPnP, setUseUPnP] = useState(false)

  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isMetadataOpen, setIsMetadataOpen] = useState(false)
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [isLanguageClosing, setIsLanguageClosing] = useState(false)
  const [isMetadataClosing, setIsMetadataClosing] = useState(false)
  const [isRegionClosing, setIsRegionClosing] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const metadataRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isLanguageOpen) {
          setIsLanguageClosing(true)
          setTimeout(() => {
            setIsLanguageOpen(false)
            setIsLanguageClosing(false)
          }, 200)
        }
      }
      if (metadataRef.current && !metadataRef.current.contains(event.target as Node)) {
        if (isMetadataOpen) {
          setIsMetadataClosing(true)
          setTimeout(() => {
            setIsMetadataOpen(false)
            setIsMetadataClosing(false)
          }, 200)
        }
      }
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        if (isRegionOpen) {
          setIsRegionClosing(true)
          setTimeout(() => {
            setIsRegionOpen(false)
            setIsRegionClosing(false)
          }, 200)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLanguageOpen, isMetadataOpen, isRegionOpen])

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return serverName.trim() !== ""
      case 2:
        return adminName.trim() !== "" && adminEmail.trim() !== "" && adminPassword.trim() !== ""
      case 3:
        return libraries.length > 0
      default:
        return true
    }
  }

  const handleContinue = () => {
    if (currentStep === 6) {
      const formData: WizardFormData = {
        language,
        serverName,
        adminName,
        adminEmail,
        adminPassword,
        libraries,
        metadataLanguage,
        region,
        allowRemoteNetwork,
        useUPnP,
      }
      onComplete?.(formData)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = () => {
    const titles = [
      "Server Setup",
      "Admin Account",
      "Music Libraries",
      "Metadata Settings",
      "Network Settings",
      "Setup Complete",
    ]
    return titles[currentStep - 1]
  }

  const getStepDescription = () => {
    const descriptions = [
      "Let's set up your media server",
      "Create your admin account",
      "Configure your music libraries",
      "Set metadata preferences",
      "Configure network access",
      "Your server is ready!",
    ]
    return descriptions[currentStep - 1]
  }

  return (
    <div className="h-[100dvh] flex items-center justify-center font-sans w-[100dvw] p-4 md:p-8">
      {/* Setup wizard form */}
      <section className="w-full max-w-md lg:max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img src="/aristo-logo.png" alt="Aristo logo" className="h-12 w-12" />
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">{title}</h1>
            </div>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  idx + 1 <= currentStep ? "bg-violet-500" : "bg-foreground/10"
                }`}
              />
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
            <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
          </div>

          <div className="min-h-64">
            {currentStep === 1 && (
              <Step1
                language={language}
                setLanguage={setLanguage}
                serverName={serverName}
                setServerName={setServerName}
                isLanguageOpen={isLanguageOpen}
                setIsLanguageOpen={setIsLanguageOpen}
                dropdownRef={dropdownRef}
                isLanguageClosing={isLanguageClosing}
              />
            )}
            {currentStep === 2 && (
              <Step2
                adminName={adminName}
                setAdminName={setAdminName}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
            {currentStep === 3 && <Step3 libraries={libraries} setLibraries={setLibraries} />}
            {currentStep === 4 && (
              <Step4
                metadataLanguage={metadataLanguage}
                setMetadataLanguage={setMetadataLanguage}
                region={region}
                setRegion={setRegion}
                isMetadataOpen={isMetadataOpen}
                setIsMetadataOpen={setIsMetadataOpen}
                isRegionOpen={isRegionOpen}
                setIsRegionOpen={setIsRegionOpen}
                metadataRef={metadataRef}
                regionRef={regionRef}
                isMetadataClosing={isMetadataClosing}
                isRegionClosing={isRegionClosing}
              />
            )}
            {currentStep === 5 && (
              <Step5
                allowRemoteNetwork={allowRemoteNetwork}
                setAllowRemoteNetwork={setAllowRemoteNetwork}
                useUPnP={useUPnP}
                setUseUPnP={setUseUPnP}
              />
            )}
            {currentStep === 6 && <Step6 />}
          </div>

          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 rounded-2xl border border-border py-4 font-medium text-foreground hover:bg-foreground/5 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue()}
              className={`flex-1 rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors ${
                !canContinue() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {currentStep === 6 ? "Start Using Aristo" : "Continue"}
            </button>
          </div>

          <div className="text-center text-xs text-muted-foreground">Step {currentStep} of 6</div>
        </div>
      </section>
    </div>
  )
}
