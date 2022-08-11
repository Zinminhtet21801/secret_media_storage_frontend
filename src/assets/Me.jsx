import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdOutlineEmail,
} from 'react-icons/md';
export const SOCIAL_LINKS = [
  {
    id: 1,
    name: "Github",
    url: "https://github.com/Zinminhtet21801",
    icon: <FaGithub />,
  },
  {
    id: 2,
    name: "Twitter",
    url: "https://twitter.com/ZinMinH99293443",
    icon: <FaTwitter />,
  },
  {
    id: 3,
    name: "linkedIn",
    url: "https://www.linkedin.com/in/zin-min-htet-704971215/",
    icon: <FaLinkedin />,
  },
];

export const companyDetail = [
  {
    name: "phone",
    contact: "+95-9799545310",
    icon: <MdPhone color="#1970F1" size="20px"  />
  },
  {
    name: "email",
    contact: "zetminhtin@gmail.com",
    icon: <MdEmail color="#1970F1" size="20px"  />
  },{
    name: "location",
    contact: "Yangon, Myanmar",
    icon: <MdLocationOn color="#1970F1" size="20px"  />
  }
]
