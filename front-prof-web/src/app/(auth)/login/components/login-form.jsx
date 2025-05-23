'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import DialogRegistration from "./dialog-registration"
import { useUserContext } from "@/context/UserContext"
import { authApi } from "@/app/api/auth/auth"
import { useEffect } from "react" 

const loginSchema = z.object({

    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})


const defaultLoginValues = {
    email: "noureddine@gmail.com",
    password: "Pa$$w0rd!",
}


export function LoginForm({
    className,
    ...props
}) {

    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem('auth')) {
            router.push('/admin')
        }
    }, [router])
    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: defaultLoginValues,
    })

    const { setAuthenticated } = useUserContext()

    async function onLogin(data) {
        try {
            await authApi.getCsrfToken();

            const response = await authApi.login(data);

            if (response.status == 204) {


                localStorage.setItem("auth", true)
                setAuthenticated(true);
                toast.success('Login successful')
                loginForm.reset(defaultLoginValues)
                router.push('/admin')


            }
        }

        catch (error) {
            if (error.response) {

                loginForm.setError('email', {
                    message: error.response?.data?.errors?.email.join()
                })
            }
            toast.error(error.message,
            )
        }


    }
   

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="">
                            <FormField
                                control={loginForm.control}
                                name="password"
                                className='w-full'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>

                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                        <Link
                                            href="/forgot-password"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </FormItem>
                                )}
                            />

                        </div>
                    </div>
                    <div className=" w-full">
                        <Button type="submit" className={'w-full'} disabled={loginForm.formState.isSubmitting}>
                            {loginForm.formState.isSubmitting ? <><Loader2 className="animate-spin" /> login...</> : "Login"}
                        </Button>
                    </div>
                    {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
                <Button variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                        />
                    </svg>
                    Login with GitHub
                </Button> */}
                </div>





                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <DialogRegistration />
                </div>
            </form>
        </Form>



    )
}
