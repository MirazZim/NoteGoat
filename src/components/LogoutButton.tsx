"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { logOutAction } from '@/actions/users'

const LogOutButton = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogOut = async () => {
        setLoading(true);

       const { errorMessage } = await logOutAction();

        if (!errorMessage) {
            toast.success("You've been logged out", {
            description: "Your session has ended securely. Come back soon!",
            duration: 5000,
            action: {
              label: "Dismiss",
              onClick: () => toast.dismiss()
            },
            position: "top-center",
            style: {
              color: "hsl(var(--foreground))",
              border: "2px solid hsl(var(--border))",
              borderRadius: "calc(var(--radius) - 2px)",
              boxShadow: "var(--shadow-md)",
            },
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            )
          });   

          router.push("/");
        } else {
            toast.error(errorMessage);
        }
        
        setLoading(false);
    }
    return (
        <Button
            variant="outline"
            onClick={handleLogOut}
            disabled={loading}
            className="w-24"
        >
            {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
        </Button>
    )
}

export default LogOutButton