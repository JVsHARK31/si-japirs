"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { signInWithGoogle, signInWithDiscord, signInWithEmail } from "@/lib/auth-supabase"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeProvider, setActiveProvider] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setActiveProvider('google')
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign in error:", error)
      toast.error("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
      setActiveProvider(null)
    }
  }

  const handleDiscordSignIn = async () => {
    try {
      setIsLoading(true)
      setActiveProvider('discord')
      await signInWithDiscord()
    } catch (error) {
      console.error("Discord sign in error:", error)
      toast.error("Failed to sign in with Discord. Please try again.")
    } finally {
      setIsLoading(false)
      setActiveProvider(null)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please enter your email and password")
      return
    }

    try {
      setIsLoading(true)
      await signInWithEmail(email, password)
      toast.success("Successfully signed in!")
      window.location.href = callbackUrl
    } catch (error: any) {
      console.error("Email sign in error:", error)
      toast.error(error.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Zap, text: "Lightning Fast", color: "text-yellow-500" },
    { icon: Shield, text: "Secure Authentication", color: "text-blue-500" },
    { icon: Sparkles, text: "AI-Powered Features", color: "text-purple-500" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <Image
                  src="/logo.jpg"
                  alt="Si-JAPIRS"
                  width={100}
                  height={100}
                  className="rounded-3xl relative shadow-xl"
                  priority
                />
              </div>
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground mt-2">
                Sign in to access your AI-powered academic assistant
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-6">
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12 relative overflow-hidden group border-2"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {activeProvider === 'google' && isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <FcGoogle className="mr-2 h-5 w-5" />
                  )}
                  <span className="font-medium">Continue with Google</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 relative overflow-hidden group border-2"
                  onClick={handleDiscordSignIn}
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-[#5865F2]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {activeProvider === 'discord' && isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <FaDiscord className="mr-2 h-5 w-5 text-[#5865F2]" />
                  )}
                  <span className="font-medium">Continue with Discord</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-11"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 pr-10 h-11"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  disabled={isLoading}
                >
                  {isLoading && !activeProvider ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                  Create free account
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Feature Showcase (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 max-w-lg space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">
              Your AI Academic Assistant
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the power of AI-driven academic support with Si-JAPIRS
            </p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className={`p-3 rounded-2xl bg-background/50 backdrop-blur ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.text}</h3>
                    <p className="text-sm text-muted-foreground">
                      Enhanced productivity and efficiency
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-xs text-muted-foreground">User Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function EnhancedSignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
