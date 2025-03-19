import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import SpotlightCard from "@/components/ui/reactBits/SpotlightCard/SpotlightCard";

export const About = () => {
  const { t } = useTranslation();

  const team = [
    {
      name: t("about.cedric.name"),
      role: t("about.cedric.role"),
      image: "../../public/images/cedric.png",
      bio: t("about.cedric.bio"),
      github: "https://github.com/cedric-champeix"
    },
    {
      name: t("about.teo.name"),
      role: t("about.teo.role"),
      image: "../../public/images/teo.png",
      bio: t("about.teo.bio"),
      github: "https://github.com/teovlt"
    },
    {
      name: t("about.gabin.name"),
      role: t("about.gabin.role"),
      image: "../../public/images/gabin.jpg",
      bio: t("about.gabin.bio"),
      github: "https://github.com/Onibagg"
    }
  ];

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">{t("about.title")}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <a href={member.github} target="_blank" rel="noopener noreferrer">
          <SpotlightCard
            key={index}
            className="bgcustom-spotlight-card shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 duration-300"
            spotlightColor="rgba(71, 140, 209, 0.3)">
          <Card
            className="p-4 bg-transparent border-transparent "
          >
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-24 h-24 rounded-full mb-4">
                <AvatarImage src={member.image} alt={member.name} className="object-cover rounded-full" />
              </Avatar>
              <h2 className="text-xl font-semibold text-secondary-foreground">{member.name}</h2>
              <p className="text-gray-500">{member.role}</p>
              <p className="text-sm mt-2 text-secondary-foreground">{member.bio}</p>
            </CardContent>
          </Card>
          </SpotlightCard>
          </a>
        ))}
      </div>
      
    </div>
  );
}
