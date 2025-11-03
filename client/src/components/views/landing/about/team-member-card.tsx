  import { CourseTeacherAsMember, TeamMember } from "@/types/team";
  import { cn } from "@/utils/cn";
  import Image from "next/image";
  import { memo } from "react";

  const TeamMemberCard = memo(
    ({
      member,
      locale,
      noHover = false,
    }: {
      member: CourseTeacherAsMember | TeamMember;
      index: number;
      noHover?: boolean;
      locale: "az" | "en";
      isCoursePage?: boolean;
    }) => {
      const imageUrl =
        "teacher" in member ? member.teacher.imageUrl : member.imageUrl;
      const bio = "teacher" in member ? member.teacher.bio : member.bio;
      const fullName =
        "teacher" in member ? member.teacher.fullName : member.fullName;
      return (
        <div
          className={cn(
            "border border-jsyellow [@media(min-width:2500px)]:h-full [@media(min-width:3500px)]:h-[500px] cursor-pointer rounded-[32px] min-h-[280px] p-6 bg-[#fef7eb] transition-transform duration-300 ",
            noHover ? "" : "hover:scale-[1.02]"
          )}
        >
          <div className="aspect-square rounded-[24px] overflow-hidden mb-4">
            <Image
              width={400}
              height={400}
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${imageUrl}`}
              alt={`Team member ${fullName}`}
              className="w-full h-full object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshIR0dIiIdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          <h4 className="font-semibold [@media(min-width:2500px)]:!text-lg [@media(min-width:3500px)]:!text-3xl text-md text-jsblack">{fullName}</h4>
         
          <p className="text-sm text-black mt-1">{bio[locale]}</p>
        </div>
      );
    }
  );

  TeamMemberCard.displayName = "TeamMemberCard";

  export default TeamMemberCard;
