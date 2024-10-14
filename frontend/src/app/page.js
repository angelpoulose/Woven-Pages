"use client";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Correct import for App Router
import wovenPagesImage from '/public/logo.jpeg'; 

export default function Home() {
  const router = useRouter(); // Initialize the router

  const handleLoginRedirect = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <div
      className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: {wovenPagesImage}, // Replace with the correct path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Optional: Adding an overlay to darken the background */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <main className="relative z-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={handleLoginRedirect} // Redirect to login on button click
          >
            Log in
          </button>
        </div>
      </main>
    </div>
  );
}
