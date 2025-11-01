import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
    {/* Mobile View */}
    <div className="block h-full lg:hidden">
      <div className="absolute inset-0">
        <Image
          src="/home/h2.jpg"
          alt="Friends"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

   
      <div className="relative z-10 flex h-full flex-col">


        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-5xl font-normal leading-tight text-white">
              Build Your Friends
              <br />
              Faster & Smarter
            </h1>
            <p className="text-sm text-white/80">
              Experience the future of communication
              <br />
              and unified messaging platform
            </p>
          </div>

          <button className="mb-20 rounded-full border border-white/30 bg-white/5 px-12 py-3.5 text-sm font-light tracking-wide text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10">
            Discover More
          </button>
        </div>
      </div>
    </div>


      {/* Desktop View */}
      <div className="hidden h-full lg:block">
        <div className="absolute inset-0">
          <Image
            src="/home/h2.jpg"
            alt="Friends"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>


        <div className="relative z-10 flex h-[calc(100%-120px)] flex-col justify-center px-12 pb-16">
          <div className="max-w-4xl">
            <h1 className="mb-8 text-7xl font-light leading-tight text-white xl:text-8xl">
              Build Your Friends
              <br />
              Faster & Smarter
            </h1>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-white/90">
                Experience the future of communication and unified messaging platform. 
                Connect, collaborate, and create meaningful relationships across the MENA region.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}