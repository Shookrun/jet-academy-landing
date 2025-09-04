"use client";
import Image from "next/image";



export default function HeroImage() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 animate-pulse">
        <div className="absolute top-4 right-8 w-16 h-16 bg-jsyellow/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-6 left-4 w-12 h-12 bg-orange-300/30 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 left-0 w-8 h-8 bg-yellow-400/25 rounded-full blur-sm"></div>
      </div>

      <div
        className="
          w-[400px] h-[400px] 
          md:w-[500px] md:h-[500px] 
          lg:w-[600px] lg:h-[600px]
          [@media(min-width:3500px)]:!w-[800px]
          [@media(min-width:3500px)]:!h-[700px]
          relative 
          cursor-pointer 
          select-none 
          shrink-0
          group
          transition-all duration-500 ease-out
          hover:scale-[1.03]
          hover:rotate-1
        "
      >
        <div className="
          absolute inset-0 
          bg-gradient-to-br from-jsyellow/40 via-jsyellow/70 to-jsyellow/90
          shadow-2xl shadow-jsyellow/25
          rounded-[40%_15%_50%_45%] 
          group-hover:rounded-[45%_20%_55%_40%]
          transition-all duration-700 ease-out
          group-hover:shadow-3xl group-hover:shadow-jsyellow/35
          before:absolute before:inset-0 
          before:bg-gradient-to-tl before:from-orange-300/20 before:to-transparent
          before:rounded-[40%_15%_50%_45%] 
          group-hover:before:rounded-[45%_20%_55%_40%]
          before:transition-all before:duration-700
        " />

        <div className="relative w-full h-full overflow-hidden rounded-[40%_15%_50%_45%] group-hover:rounded-[45%_20%_55%_40%] transition-all duration-700">
          <Image
            src="/boy.png"
            alt="Student learning programming"
            fill
            quality={100}
            className="
              object-cover object-center
              transition-all duration-500 ease-out
              group-hover:scale-110
              group-hover:brightness-110
              filter drop-shadow-lg
            "
            sizes="(max-width: 768px) 400px, (max-width: 1024px) 500px, 600px"
          />
          
          <div className="
            absolute inset-0 
            bg-gradient-to-t from-jsyellow/10 via-transparent to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          " />
        </div>

        <div className="absolute -top-2 -right-2 w-6 h-6 bg-jsyellow rounded-full opacity-60 animate-bounce [animation-delay:0.5s]"></div>
        <div className="absolute -bottom-3 -left-1 w-4 h-4 bg-orange-400 rounded-full opacity-70 animate-bounce [animation-delay:1s]"></div>
        <div className="absolute top-1/4 -left-3 w-3 h-3 bg-yellow-300 rounded-full opacity-50 animate-bounce [animation-delay:1.5s]"></div>
        <div className="
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          before:absolute before:top-1/4 before:left-1/4 before:w-1 before:h-1 
          before:bg-white before:rounded-full before:animate-ping
          after:absolute after:top-3/4 after:right-1/4 after:w-1 after:h-1 
          after:bg-white after:rounded-full after:animate-ping after:[animation-delay:0.3s]
        "></div>
      </div>
    </div>
  );
}