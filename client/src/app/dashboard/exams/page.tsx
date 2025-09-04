"use client";

import Button from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { MdLink } from "react-icons/md";

const exams = [
  {
    title: "JET New Exam 9-11",
    description: "9-11 yaş qrupu üçün IT məktəbinə qəbul imtahanı",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfiyxoxQxJHBklO25qaW0k2JRQpEhbqe6wK87Q9DQalbAHY4w/viewform",
  },
  {
    title: "JET New Exam 12-15",
    description: "12-15 yaş qrupu üçün IT məktəbinə qəbul imtahanı",
    link: "https://docs.google.com/forms/d/e/1FAIpQLScWKC0sSPSVpUiqVrDn6rB4sB53fE317cAvV4814zdJmiZVmQ/viewform",
  },
  {
    title: "JET New Exam 9-11 RU",
    description: "Экзамен для возрастной группы 9-11 лет",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSe6fMq-kgeQqVNabpJc2ADYpouPh3ZFrTuZyysMA5CmmUWAlQ/viewform",
  },
  {
    title: "JET New Exam 12-15 RU",
    description: "Экзамен для возрастной группы 12-15 лет",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSeaueRURQdNvo61mrcGxmk-Q04_L3wEL8PW5FMLjsslB_PI0A/viewform",
  },
];

export default function ExamsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Exam Links</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">{exam.title}</h3>
              <p className="text-sm text-gray-600">{exam.description}</p>
            </CardHeader>
            <CardBody>
              <Button
                text="Open Exam Form"
                variant="primary"
                icon={MdLink}
                iconPosition="right"
                onClick={() => window.open(exam.link, "_blank")}
                className="w-full"
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
