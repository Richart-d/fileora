import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <Link href="/" className="mb-8">
        <Image 
          src="/logo.png" 
          alt="Fileora Logo" 
          width={150} 
          height={60} 
          className="object-contain"
          priority
        />
      </Link>
      <SignUp />
    </div>
  );
}
