import Image from "next/image";

export default function AboutUs() {
  const features = [
    { title: "Real-time messaging", image: "/home/messaging.jpg" },
    { title: "AI conversation summaries", image: "/home/ai.jpg" },
    { title: "Group chats & channels", image: "/home/group.jpg" },
    { title: "Smart notifications", image: "/home/notifications.jpg" },
  ];

  return (
    <section className="relative min-h-screen w-full bg-black px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Side */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-8 text-4xl font-light leading-tight text-white lg:mb-12 lg:text-6xl xl:text-7xl">
              Next-gen chat experience. Real-time messaging meets AI
              intelligence. More features coming soon.
            </h2>

            <button className="group flex w-fit items-center gap-3 rounded-full bg-white/10 px-8 py-4 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:px-10 lg:py-5">
              <span>Learn More</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-center">
            <div className="space-y-0">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative flex items-center justify-between border-b border-white/10 py-6 transition-all hover:border-white/30 lg:py-8"
                >
                  <h3 className="pr-4 text-base font-light text-white/70 transition-colors group-hover:text-white lg:text-xl">
                    {feature.title}
                  </h3>

                  <div className="flex items-center gap-3 lg:gap-4">
                    {/* Image  */}
                    <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg lg:h-20 lg:w-32 lg:opacity-0 lg:transition-opacity lg:duration-300 lg:group-hover:opacity-100">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>


                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 transition-all group-hover:border-white/40 group-hover:bg-white/5 lg:h-10 lg:w-10">
                      <svg
                        className="h-4 w-4 text-white/70 transition-all group-hover:translate-x-0.5 group-hover:text-white lg:h-5 lg:w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}