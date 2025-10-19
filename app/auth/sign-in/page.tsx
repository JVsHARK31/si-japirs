"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import toast from "react-hot-toast"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Terjadi kesalahan saat login. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.jpeg"
              alt="Si-JAPIRS Logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
          </div>
          <CardTitle className="text-2xl text-center">
            Selamat Datang di Si-JAPIRS
          </CardTitle>
          <CardDescription className="text-center">
            Masuk untuk mengakses semua fitur AI Academic Assistant
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghubungkan...
              </>
            ) : (
              <>
                <FcGoogle className="mr-2 h-5 w-5" />
                Masuk dengan Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                atau
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Belum punya akun? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Daftar gratis
            </Button>
          </div>
          
          <Link href="/" className="text-center">
            <Button variant="ghost" size="sm">
              ← Kembali ke Beranda
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
