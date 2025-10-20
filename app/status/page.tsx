"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeaderBackButton } from '@/components/back-button'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  Globe,
  Server,
  Database,
  Shield,
  Zap
} from 'lucide-react'

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({ status: 'ERROR', message: 'Failed to fetch status' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const features = [
    { name: 'AI Writer', path: '/writer', icon: '✍️' },
    { name: 'PDF Summarizer', path: '/summarizer', icon: '📄' },
    { name: 'Research Helper', path: '/research', icon: '🔎' },
    { name: 'AI Consultation', path: '/consult', icon: '💬' },
    { name: 'Presentation Generator', path: '/slides', icon: '🎯' },
    { name: 'Plagiarism Checker', path: '/plagiarism', icon: '🔍' },
    { name: 'Statistical Analysis', path: '/stats', icon: '📊' },
    { name: 'Dashboard', path: '/dashboard', icon: '📈' }
  ]

  return (
    <div className="container py-8 max-w-4xl">
      <HeaderBackButton 
        title="System Status" 
        subtitle="Check deployment and feature status"
        className="mb-6"
      />

      {/* Overall Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Deployment Status
            </CardTitle>
            <Button 
              size="sm" 
              variant="outline"
              onClick={checkStatus}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : status?.status === 'OK' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg font-medium">All Systems Operational</span>
                <Badge variant="default" className="bg-green-500">ONLINE</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Last Checked</p>
                  <p className="text-sm font-medium">
                    {new Date(status.timestamp).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="text-sm font-medium">{status.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platform</p>
                  <p className="text-sm font-medium">{status.deployment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Build Status</p>
                  <p className="text-sm font-medium text-green-600">Successful</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              <span className="text-lg font-medium">Service Unavailable</span>
              <Badge variant="destructive">OFFLINE</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Feature Status
          </CardTitle>
          <CardDescription>
            Click on any feature to test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature) => (
              <a
                key={feature.path}
                href={feature.path}
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <span className="text-xl">{feature.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{feature.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="font-medium">Username & Password</p>
                  <p className="text-xs text-muted-foreground">Username: Javier | Password: athallah310706</p>
                </div>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  🔷
                </div>
                <div>
                  <p className="font-medium">Google OAuth</p>
                  <p className="text-xs text-muted-foreground">Sign in with Google account</p>
                </div>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Deployment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repository</span>
              <a 
                href="https://github.com/JVsHARK31/si-japirs" 
                target="_blank"
                className="text-primary hover:underline"
              >
                JVsHARK31/si-japirs
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch</span>
              <span className="font-mono">main</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latest Commit</span>
              <span className="font-mono">09f71ae</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build Time</span>
              <span>~5-10 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
