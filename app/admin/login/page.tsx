"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, checkAuth } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth()
      if (user) {
        router.push("/admin/dashboard")
      }
    }
    verifyAuth()
  }, [router])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await login(email, password)
      router.push("/admin/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to login. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4">
      <Card className="w-full max-w-md bg-white border border-[#e7e5e4] shadow-sm rounded-xl p-6">
        <CardHeader className="space-y-2 pb-6 pt-2">
          <CardTitle className="text-3xl font-sans font-bold tracking-tight text-center text-stone-900">Admin Login</CardTitle>
          <CardDescription className="text-center text-xs text-stone-500 font-medium tracking-[0.15px]">
            Enter your credentials to access the Xacres Admin Panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold text-stone-450 uppercase tracking-widest ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@xacres.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 bg-stone-50/50 border border-[#e7e5e4] hover:border-stone-300 focus:border-blue-650 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-full px-4 text-xs font-semibold text-stone-900 placeholder:text-stone-400/60 placeholder:font-normal transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold text-stone-450 uppercase tracking-widest ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 bg-stone-50/50 border border-[#e7e5e4] hover:border-stone-300 focus:border-blue-650 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-full px-4 text-xs font-semibold text-stone-900 transition-all"
              />
            </div>
            {error && <p className="text-xs font-semibold text-red-600 text-center">{error}</p>}
            <Button type="submit" className="w-full bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-600/30 focus:ring-2 focus:ring-blue-500/10 text-white font-semibold rounded-full h-10 text-xs uppercase tracking-widest transition-all shadow-sm" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
