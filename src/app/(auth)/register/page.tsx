"use client"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";

export default function Component() {
  const { data: session, status }: any = useSession()
  const router = useRouter();

  if(session){
    router.push('http://localhost:3001/dashboard')
  }

  return (
    <div className="items-center my-auto py-32 lg:py-0">
            <div className="flex flex-col my-auto items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="rounded-lg border bg-white text-gray-800 shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 mx-auto justify-center">
                        {session ? (
                          <>
                            Signed in as {session?.user?.email} <br />
                            <Button className="inline-flex gap-2 w-full" size={"lg"} onClick={() => signOut()}>Sign out</Button>
                          </>
                        ) : (
                          <>
                            <h2 className="mb-2 text-lg font-semibold">Register an account</h2>
                            <Button className="inline-flex gap-2 w-full" size={"lg"} onClick={() => signIn()}>
                              <span>Register with Discord</span>
                              <FaDiscord />
                            </Button>
                            <p className="text-sm font-light">
                               Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</a>
                            </p>
                          </>
                        )}
                    </div>
                </div>
            </div>
    </div>
  )
}