export const faculties = [
  { slug: "arabic", name: "Faculty of Arabic", short: "Arabic", code: "FA", number: "01", official: "https://www.iiu.edu.pk/arabic/", departments: ["Centre for Teaching Arabic Language", "Linguistics", "Literature", "Translation & Interpretation"], description: "Arabic language, literature and translation, rooted in scholarship and opened to the world.", field: "LANGUAGE · CULTURE · TRANSLATION", glyph: "ع" },
  { slug: "computing", name: "Faculty of Computing & Information Technology", short: "Computing & IT", code: "FCIT", number: "02", official: "https://www.iiu.edu.pk/faculties/computing/", departments: ["Bioinformatics", "Computer Science", "Software Engineering"], description: "Computing disciplines shaping the systems, software and ideas of tomorrow.", field: "COMPUTING · SOFTWARE · DATA", glyph: "</>" },
  { slug: "education", name: "Faculty of Education", short: "Education", code: "FOE", number: "03", official: "https://www.iiu.edu.pk/faculties/faculty-of-education/", departments: ["Educational Leadership & Management", "Teacher Education"], description: "Preparing teachers, researchers and education leaders to make learning matter.", field: "TEACHING · LEADERSHIP · LEARNING", glyph: "∑" },
  { slug: "engineering", name: "Faculty of Engineering & Technology", short: "Engineering", code: "FET", number: "04", official: "https://www.iiu.edu.pk/faculties/engineering-technology/", departments: ["Civil Engineering", "Electrical & Computer Engineering", "Mechanical Engineering", "Advanced Electronics Laboratories", "Iqra College of Technology & Skills"], description: "Engineering ideas made practical through design, experimentation and problem solving.", field: "DESIGN · SYSTEMS · BUILD", glyph: "⌁" },
  { slug: "islamic-economics", name: "International Institute of Islamic Economics", short: "Islamic Economics", code: "IIIE", number: "05", official: "https://www.iiu.edu.pk/faculties/international-institute-islamic-economics/", departments: ["Department of Economics & Finance", "School of Economics", "School of Islamic Banking & Finance"], description: "Economics and finance explored through rigorous research and ethical perspectives.", field: "ECONOMICS · FINANCE · POLICY", glyph: "٪" },
  { slug: "languages", name: "Faculty of Languages & Literature", short: "Languages", code: "FLL", number: "06", official: "https://www.iiu.edu.pk/faculties/languages-literature/", departments: ["English", "Persian", "Urdu", "Centre for Language Teaching"], description: "Languages, literature and communication across local and global traditions.", field: "WORDS · LITERATURE · CULTURE", glyph: "¶" },
  { slug: "management", name: "Faculty of Management Sciences", short: "Management", code: "FMS", number: "07", official: "https://www.iiu.edu.pk/management-sciences/", departments: ["Accounting, Finance & Commerce", "Business Administration", "Technology & Project Management"], description: "Business, finance and technology management grounded in responsible leadership.", field: "BUSINESS · FINANCE · LEADERSHIP", glyph: "↗" },
  { slug: "sciences", name: "Faculty of Sciences", short: "Sciences", code: "FOS", number: "08", official: "https://www.iiu.edu.pk/faculties/sciences/", departments: ["Biological Sciences", "Centre for Interdisciplinary Research in Basic Science (SA-CIRBS)", "Environmental Science", "Mathematics & Statistics", "Physics"], description: "Natural and applied sciences, connecting observation, evidence and discovery.", field: "BIOLOGY · CLIMATE · PHYSICS", glyph: "◉" },
  { slug: "shariah-law", name: "Faculty of Shari‘ah & Law", short: "Shari‘ah & Law", code: "FSL", number: "09", official: "https://www.iiu.edu.pk/faculties/sharia-and-law/", departments: ["Department of Shari‘ah", "Department of Law"], description: "Legal thought and practice engaging contemporary questions with depth and care.", field: "LAW · JUSTICE · JURISPRUDENCE", glyph: "§" },
  { slug: "social-sciences", name: "Faculty of Social Sciences", short: "Social Sciences", code: "FSS", number: "10", official: "https://www.iiu.edu.pk/social-sciences-2/", departments: ["Anthropology", "History & Pakistan Studies", "Islamic Arts & Architecture Studies", "Media & Communication Studies", "Politics & International Relations", "Psychology", "Sociology"], description: "Understanding people, institutions and the stories that shape society.", field: "PEOPLE · SOCIETY · IDEAS", glyph: "◎" },
  { slug: "usuluddin", name: "Faculty of Usuluddin (Islamic Studies)", short: "Usuluddin", code: "FUD", number: "11", official: "https://www.iiu.edu.pk/usuluddin/", departments: ["Aqeedah & Philosophy", "Dawah & Islamic Culture", "Hadith & Its Sciences", "Seerah & Islamic History", "Study of Religions", "Tafseer & Qur’anic Sciences"], description: "Islamic thought and textual traditions studied with scholarship and context.", field: "QUR’AN · HADITH · THOUGHT", glyph: "۞" },
] as const;

export type Faculty = (typeof faculties)[number];

export const academicInstitutes = [
  { name: "Dawah Academy", type: "Institute & academy", url: "https://dawah.iiu.edu.pk/" },
  { name: "Shariah Academy", type: "Institute & academy", url: "https://shariahacademy.iiu.edu.pk/" },
  { name: "Islamic Research Institute", type: "Institute & academy", url: "https://iri.iiu.edu.pk/" },
  { name: "Institute of Professional Development", type: "Institute & academy", url: "https://www.iiu.edu.pk/" },
  { name: "Iqbal International Institute for Research & Dialogue", type: "Institute & academy", url: "https://ird.iiu.edu.pk/" },
  { name: "Centre of Excellence in Advanced Electronics & Photovoltaic Engineering", type: "Centre & college", url: "https://www.iiu.edu.pk/faculties/engineering-technology/" },
  { name: "IIUI Business Incubation Center", type: "Centre & college", url: "https://www.iiu.edu.pk/" },
  { name: "Centre for Language Teaching", type: "Centre & college", url: "https://www.iiu.edu.pk/faculties/languages-literature/" },
  { name: "Directorate of Open & Distance Learning", type: "Centre & college", url: "https://ddl.iiu.edu.pk/" },
  { name: "Iqra College of Technology & Skills", type: "Centre & college", url: "https://www.iiu.edu.pk/faculties/engineering-technology/" },
  { name: "IIUI Schools", type: "Centre & college", url: "https://www.iiu.edu.pk/" },
  { name: "SA – Centre for Interdisciplinary Research in Basic Science", type: "Centre & college", url: "https://www.iiu.edu.pk/faculties/sciences/" },
] as const;

export function getFaculty(slug: string) {
  return faculties.find((faculty) => faculty.slug === slug);
}
