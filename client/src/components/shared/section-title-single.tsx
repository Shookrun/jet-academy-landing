import React from "react";

interface ISectionTitle {
  title: string;
  description?: string;
}
function SectionTitleSingle({ title }: ISectionTitle) {
  return (
    <div className="w-10/12 lg:w-1/2 mx-auto text-jsblack text-center flex flex-col gap-4 [@media(min-width:3500px)]:!gap-10 mb-5 justify-center items-center">
      <h1 className="text-4xl [@media(min-width:3500px)]:!text-5xl mt-16  font-bold leading-[1.3]">{title}</h1>
    </div>
  );
}

export default SectionTitleSingle;
