'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaDiscord, FaTwitter, FaSteam, FaSpotify, FaGithub, FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SiCrunchyroll } from "react-icons/si";
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

interface StepProps {
    nextStep?: () => void;
    prevStep?: () => void;
}

const socialNetworks = [
    { name: "Discord", icon: FaDiscord, bgClass: "bg-discord", hoverClass: "hover:bg-discord-dark" },
    { name: "Twitter", icon: FaTwitter, bgClass: "bg-twitter", hoverClass: "hover:bg-twitter-dark" },
    { name: "Steam", icon: FaSteam, bgClass: "bg-steam", hoverClass: "hover:bg-steam-dark" },
    { name: "Spotify", icon: FaSpotify, bgClass: "bg-spotify", hoverClass: "hover:bg-spotify-dark" },
    { name: "GitHub", icon: FaGithub, bgClass: "bg-github", hoverClass: "hover:bg-github-dark" },
    { name: "Crunchyroll", icon: SiCrunchyroll, bgClass: "bg-crunchyroll", hoverClass: "hover:bg-crunchyroll-dark" },
];

function useResponsiveNetworkCount(cardWidth: number) {
    const [count, setCount] = useState(1);

    useEffect(() => {
        const updateCount = () => {
            const boxWidth = 280;
            const newCount = Math.floor(cardWidth / boxWidth);
            setCount(newCount > 0 ? newCount : 1);
        };

        updateCount();

    }, [cardWidth]);

    return count;
}

function Step1({ nextStep }: StepProps) {
    return (
        <div>
            <Label htmlFor="username">Username</Label>
            <Input className="mt-2 mb-4" id="username" placeholder="Username" />
            <Label htmlFor="email">Email</Label>
            <Input className="mt-2 mb-4" id="email" type="email" placeholder="Email" />
            <Button onClick={nextStep}>Next</Button>
        </div>
    );
}

function Step2({ nextStep, prevStep }: StepProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [errors, setErrors] = useState<{ password?: string, confirmPassword?: string }>({});

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
        validatePassword(newPassword, confirmPassword);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validatePassword(password, newConfirmPassword);
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length > 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-orange-500';
            case 3:
                return 'bg-yellow-500';
            case 4:
                return 'bg-green-500';
            case 5:
                return 'bg-green-700';
            default:
                return 'bg-gray-300';
        }
    };

    const validatePassword = (password: string, confirmPassword: string) => {
        const newErrors: { password?: string, confirmPassword?: string } = {};
        if (!password) {
            newErrors.password = 'Password is required.';
        } else {
            newErrors.password = undefined;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        } else {
            newErrors.confirmPassword = undefined;
        }

        setErrors(newErrors);
    };

    return (
        <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-2 mb-4">
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pr-20"
                />
                <Toggle aria-label="Toggle" className='absolute inset-y-0 right-0' onClick={toggleShowPassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Toggle>
            </div>
            <div className={`h-2 rounded ${getStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
            {errors.password && <p className="text-red-500 mb-4">{errors.password}</p>}

            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative mt-2 mb-4">
                <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="pr-10"
                />
                <Toggle aria-label="Toggle" className='absolute inset-y-0 right-0 ' onClick={toggleShowConfirmPassword}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Toggle>
            </div>
            {errors.confirmPassword && <p className="text-red-500 mb-4">{errors.confirmPassword}</p>}

            <div className="flex justify-between">
                <Button onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={errors.password !== undefined || errors.confirmPassword !== undefined}>Next</Button>
            </div>
        </div>
    );
}

function Step3({ nextStep, prevStep, cardWidth }: StepProps & { cardWidth: number }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const networkCount = useResponsiveNetworkCount(cardWidth);
    const [connectedNetworks, setConnectedNetworks] = useState<string[]>([]);
    const [loading, setLoading] = useState<string | null>(null);

    const nextNetwork = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + networkCount, socialNetworks.length - networkCount));
    };

    const prevNetwork = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - networkCount, 0));
    };

    const toggleConnection = (name: string) => {
        setLoading(name);
        setTimeout(() => {
            setConnectedNetworks((prev) =>
                prev.includes(name) ? prev.filter((network) => network !== name) : [...prev, name]
            );
            setLoading(null);
        }, 2000);
    };

    const visibleNetworks = socialNetworks.slice(currentIndex, currentIndex + networkCount);

    return (
        <div className="relative flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
                <button
                    className={`p-2 ${currentIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-100 cursor-pointer'}`}
                    onClick={prevNetwork}
                    disabled={currentIndex === 0}
                >
                    <FaArrowLeft size={32} />
                </button>
                <div className="flex justify-center space-x-4">
                    {visibleNetworks.map(({ name, icon: Icon, bgClass, hoverClass }) => (
                        <div key={name} className={`flex flex-col items-center w-48 p-4 border rounded-lg shadow-md ${bgClass} ${hoverClass}`}>
                            <Icon size={32} className="text-gray-100" />
                            <span className="mt-2 text-gray-100">{name}</span>
                            <Button
                                className={`mt-2 w-full transition-all duration-300 ease-in-out ${connectedNetworks.includes(name) ? 'bg-green-400 hover:bg-green-500 text-white' : 'text-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700'}`}
                                onClick={() => toggleConnection(name)}
                                disabled={loading === name}
                            >
                                {loading === name ? (
                                    <div className="loader-btn">
                                        <span className="bar-btn"></span>
                                        <span className="bar-btn"></span>
                                        <span className="bar-btn"></span>
                                    </div>
                                ) : connectedNetworks.includes(name) ? 'Connected' : 'Connect'}
                            </Button>
                        </div>
                    ))}
                </div>
                <button
                    className={`p-2 ${currentIndex + networkCount >= socialNetworks.length ? 'text-gray-400 cursor-not-allowed' : 'text-gray-100 cursor-pointer'}`}
                    onClick={nextNetwork}
                    disabled={currentIndex + networkCount >= socialNetworks.length}
                >
                    <FaArrowRight size={32} />
                </button>
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next</Button>
            </div>
        </div>
    );
}

function Step4({ nextStep, prevStep }: StepProps) {
    const router = useRouter();

    const handleSubmit = () => {
    };

    return (
        <div>
            <p className="mb-4">Please confirm your details and proceed to connect your accounts.</p>
            <div className="flex justify-between">
                <Button onClick={prevStep}>Back</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    );
}

export default function SignUp() {
    const [step, setStep] = useState<number>(1);
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(0);

    useEffect(() => {
        const updateCardWidth = () => {
            if (cardRef.current) {
                setCardWidth(cardRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', updateCardWidth);
        updateCardWidth();

        return () => window.removeEventListener('resize', updateCardWidth);
    }, []);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const getProgressValue = (): number => {
        switch (step) {
            case 1:
                return 25;
            case 2:
                return 50;
            case 3:
                return 75;
            case 4:
                return 100;
            default:
                return 0;
        }
    };

    const getStepTitle = (): string => {
        switch (step) {
            case 1:
                return "Personal Information";
            case 2:
                return "Account Details";
            case 3:
                return "Connect with us";
            case 4:
                return "Confirmation";
            default:
                return "";
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <Card ref={cardRef} className="w-full max-w-md lg:max-w-lg xl:max-w-2xl p-5">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h2 className="text-lg font-bold mb-2">{getStepTitle()}</h2>
                    <Progress value={getProgressValue()} className="mb-4" />
                    {step === 1 && <Step1 nextStep={nextStep} />}
                    {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
                    {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} cardWidth={cardWidth} />}
                    {step === 4 && <Step4 prevStep={prevStep} />}
                </CardContent>
                <CardFooter>
                    <p>Already have an account? <a href="/auth/sign-in" className="text-blue-500 hover:text-blue-600">Sign In</a></p>
                </CardFooter>
            </Card>
        </div>
    );
}
