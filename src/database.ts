import { Profile, Job } from "./types.js";

// In-memory database
export const profiles: Profile[] = [
    {"id":1,"name":"Jahnavi Jha","email":"priya.sharma@email.com","phone":"9876543210","skills":["Python","Django","PostgreSQL","REST APIs","Docker","AWS"],"experience":[{"company":"Tech Solutions Pvt Ltd","role":"Backend Developer","duration":"2 years"},{"company":"StartupHub","role":"Junior Developer","duration":"1 year"}],"location":"Bangalore"},
    {"id":2,"name":"Shrey Singhal","email":"shreynbd@gmail.com","phone":"8057260114","skills":["SEO","Google Analytics","Content Marketing","Social Media Marketing","SEM","WordPress"],"experience":[{"company":"Digital Marketing Pro","role":"SEO Specialist","duration":"3 years"}],"location":"Remote"},
    {"id":3,"name":"Yash Singla","email":"neha.patel@email.com","phone":"8877665544","skills":["Figma","Adobe XD","Sketch","UI Design","UX Research","Prototyping","Wireframing","User Testing"],"experience":[{"company":"DesignStudio","role":"UI/UX Designer","duration":"3 years"},{"company":"Creative Agency","role":"Graphic Designer","duration":"1 year"}],"location":"Mumbai"},
];
export const jobs: Job[] = [
    {"id":1,"title":"Full Stack Developer","company":"Finoverse Innovations","location":"Bangalore","experienceRequired":"2-4 years","salary":1600000,"description":"Seeking a Full Stack Developer to build and maintain our financial technology platform. Work with React, Node.js, and modern web technologies in a fast-paced startup environment.","skillsRequired":["JavaScript","React","Node.js","MongoDB","REST APIs","Git"]},
    {"id":2,"title":"Digital Marketing Manager","company":"Webivi Agency","location":"Remote","experienceRequired":"3+ years","salary":1200000,"description":"Looking for a Digital Marketing Manager to lead our online marketing efforts. Develop and execute SEO, SEM, and social media strategies to drive traffic and sales for our e-commerce platform.","skillsRequired":["SEO","Google Analytics","Content Marketing","Social Media Marketing","SEM","WordPress"]},
    {"id":3,"title":"UI/UX Designer","company":"Explorin Ed","location":"Mumbai","experienceRequired":"2-5 years","salary":1000000,"description":"Hiring a UI/UX Designer to create engaging and user-friendly designs for our clients. Collaborate with cross-functional teams to deliver exceptional digital experiences.","skillsRequired":["Figma","Adobe XD","Sketch","UI Design","UX Research","Prototyping","Wireframing","User Testing"]},
];

// Helper for generating next ID
export function nextId(arr: { id?: number }[]): number {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map(x => x.id ?? 0)) + 1;
}
