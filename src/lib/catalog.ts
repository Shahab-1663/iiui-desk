export const faculties = [
  { slug: "arabic", name: "Arabic", short: "Arabic", image: "/images/FOA.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/arabic/", description: "Language, literature and the rich traditions of Arabic scholarship." },
  { slug: "computing", name: "Computing & Information Technology", short: "Computing & IT", image: "/images/FOC.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/faculties/computing/", description: "Computer science, software engineering, information technology and more." },
  { slug: "education", name: "Education", short: "Education", image: "/images/FOE.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/faculties/faculty-of-education/", description: "Teaching, learning and educational leadership." },
  { slug: "engineering", name: "Engineering & Technology", short: "Engineering", image: "/images/FOP.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/faculties/engineering-technology/", description: "Technical learning rooted in practical problem solving." },
  { slug: "islamic-economics", name: "International Institute of Islamic Economics", short: "Islamic Economics", image: "/images/FOM.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/faculties/international-institute-islamic-economics/", description: "Economics, finance and development in an Islamic framework." },
  { slug: "languages", name: "Languages & Literature", short: "Languages", image: "/images/FOA.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/faculties/languages-literature/", description: "Languages, literature, communication and cultural exchange." },
  { slug: "management", name: "Management Sciences", short: "Management", image: "/images/FOM.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/management-sciences/", description: "Business, management, finance, marketing and technology management." },
  { slug: "sciences", name: "Sciences", short: "Sciences", image: "/images/FOP.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/faculties/sciences/", description: "The natural and applied sciences, from mathematics to physics." },
  { slug: "shariah-law", name: "Shari‘ah & Law", short: "Shari‘ah & Law", image: "/images/FOSL.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/faculties/shariah-law/", description: "Legal study, Shari‘ah, jurisprudence and justice." },
  { slug: "social-sciences", name: "Social Sciences", short: "Social Sciences", image: "/images/FOE.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/social-sciences-2/", description: "People, communities and the ideas shaping our shared future." },
  { slug: "usuluddin", name: "Usuluddin (Islamic Studies)", short: "Usuluddin", image: "/images/about_backgroung.jpg", accent: "from-[#17392e]/0 to-[#17392e]/90", official: "https://www.iiu.edu.pk/usuluddin/", description: "Qur’anic sciences, Hadith, Islamic thought and history." },
] as const;

export type Faculty = (typeof faculties)[number];

export function getFaculty(slug: string) {
  return faculties.find((faculty) => faculty.slug === slug);
}

