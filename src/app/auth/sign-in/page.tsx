'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from "@/components/navbar/Navbar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle"

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({});
    const router = useRouter();

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const validateEmail = (email: string) => {
        if (!email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is required.' }));
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Email address is invalid.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
        }
    };

    const validatePassword = (password: string) => {
        if (!password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
        }
    };

    const handleSubmit = () => {
        validateEmail(email);
        validatePassword(password);

        if (!errors.email && !errors.password) {
        }
    };

    
    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md lg:max-w-lg xl:max-w-2xl p-5">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        className="mt-2 mb-2"
                    />
                    {errors.email && <p className="text-red-500 mb-4">{errors.email}</p>}

                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-2 mb-2">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="pr-20"
                        />
                        <Toggle aria-label="Toggle" className='absolute inset-y-0 right-0 '  onClick={toggleShowPassword}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Toggle>
                    </div>
                    {errors.password && <p className="text-red-500 mb-4">{errors.password}</p>}

                    <div className="flex justify-between">
                        <Button onClick={handleSubmit}>Sign In</Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <p>Don't have an account? <a href="/auth/sign-up" className="text-blue-500 hover:text-blue-600">Sign Up</a></p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SignIn;
