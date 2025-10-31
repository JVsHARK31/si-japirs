"use client"

import { signIn } from "next-auth/react"
import { useState, Suspense, FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User, Lock, Mail, Eye, EyeOff, Sparkles, Shield, Zap, MessageSquare } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaDiscord } from "react-icons/fa"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Terjadi kesalahan saat login dengan Google.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiscordSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("discord", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Terjadi kesalahan saat login dengan Discord.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCredentialsSignIn = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error("Harap isi username dan password")
      return
    }

    try {
      setIsLoading(true)
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        toast.error("Username atau password salah")
      } else if (result?.ok) {
        toast.success("Login berhasil!")
        window.location.href = callbackUrl
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Terjadi kesalahan saat login.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-gradient" />
      <div className="absolute inset-0 bg-grid-black/[0.02]" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 animate-float">
        <div className="w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
      </div>
      <div className="absolute bottom-10 right-10 animate-float-delayed">
        <div className="w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-1/2 left-1/4 animate-float">
        <Sparkles className="w-6 h-6 text-primary/20" />
      </div>
      <div className="absolute bottom-1/3 right-1/3 animate-float-delayed">
        <Shield className="w-8 h-8 text-secondary/20" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-75 animate-pulse" />
                <Image
                  src="/logo.jpg"
                  alt="Si-JAPIRS Logo"
                  width={80}
                  height={80}
                  className="rounded-2xl relative"
                />
              </div>
            </div>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Selamat Datang di Si-JAPIRS
            </CardTitle>
            <CardDescription className="text-center">
              Platform AI Assistant untuk Kebutuhan Akademik Anda
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="credentials" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Username
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Social Login
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="credentials" className="space-y-4">
                <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="Masukkan username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all transform hover:scale-105"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Masuk...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Masuk
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Lupa password?
                    </Link>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="social" className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Masuk dengan akun sosial media Anda untuk akses cepat dan aman
                  </p>
                  
                  {/* Google Sign In Button */}
                  <Button
                    variant="outline"
                    className="w-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all transform hover:scale-[1.02] group"
                    size="lg"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Menghubungkan...
                      </>
                    ) : (
                      <>
                        <FcGoogle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Lanjutkan dengan Google</span>
                      </>
                    )}
                  </Button>
                  
                  {/* Discord Sign In Button */}
                  <Button
                    variant="outline"
                    className="w-full border-2 hover:border-[#5865F2]/50 hover:bg-[#5865F2]/5 transition-all transform hover:scale-[1.02] group"
                    size="lg"
                    onClick={handleDiscordSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Menghubungkan...
                      </>
                    ) : (
                      <>
                        <FaDiscord className="mr-2 h-5 w-5 text-[#5865F2] group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Lanjutkan dengan Discord</span>
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground px-2">KEUNTUNGAN</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-primary/5">
                      <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <span className="text-xs">Cepat</span>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/5">
                      <Shield className="w-5 h-5 mx-auto mb-1 text-secondary" />
                      <span className="text-xs">Aman</span>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/5">
                      <Sparkles className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <span className="text-xs">Mudah</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ketentuan
                </span>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Dengan masuk, Anda menyetujui{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Syarat & Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Kebijakan Privasi
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 pt-2">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Belum punya akun? </span>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                Daftar gratis
              </Button>
            </div>
            
            <Link href="/" className="text-center">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                ← Kembali ke Beranda
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
