import AuthForm from '@/components/AuthForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const LoginPage = () => {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
    <Card className="w-full max-w-md">
      <CardHeader className="mb-4">
      <CardTitle className="text-center text-3xl font-bold text-zinc-800 dark:text-white">
            Welcome Back 👋
          </CardTitle>
          <p className="text-center mt-1 text-zinc-500 dark:text-zinc-400 text-sm">
            Log in to your account
          </p>
      </CardHeader>

      <AuthForm type="login" />
    </Card>
  </div>
  )
}

export default LoginPage