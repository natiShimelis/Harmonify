"use client"
import Image from "next/image"
import SideImage from "../../../public/mello.svg"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function Login() {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Harmonify</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to your account
            </p>
          </div>
          <div className="grid gap-4">
            {/* <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div> */}
            {/* <Button type="submit" className="w-full">
              Login
            </Button> */}
            <Button  onClick={()=> signIn("spotify") } variant="default" className="w-full">
              Login with Spotify
            </Button>
          </div>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={SideImage}
          alt="Image"
          width={1920}
          height={1200}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}
