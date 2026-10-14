// Campus Hub: DEMO DATA
function inDays(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}
function toISO(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}
function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
const announcements = [
  {
    title: "Welcome Back Assembly",
    category: "General",
    date: toISO(inDays(-1)),
    body: "All students are invited to the welcome assembly in the main hall."
  },
  {
    title: "Library Extended Hours",
    category: "Academics",
    date: toISO(inDays(-3)),
    body: "The library will stay open until 6:00 PM on weekdays."
  },
  {
    title: "Basketball Tryouts This Week",
    category: "Sports",
    date: toISO(inDays(-4)),
    body: "Tryouts for the school basketball team are open to all grades."
  },
  {
    title: "Cafeteria Menu Update",
    category: "General",
    date: toISO(inDays(-6)),
    body: "New healthy meal options are available every day."
  },
  {
    title: "Science Fair Sign-Ups Open",
    category: "Academics",
    date: toISO(inDays(-8)),
    body: "Register your project with your science teacher."
  },
  {
    title: "Drama Club Auditions",
    category: "Clubs",
    date: toISO(inDays(-10)),
    body: "Auditions for the winter play are open."
  }
];
const guidance = {
  "Grade 10": [
    { id: "g10-1", text: "Explore your interests and list five careers you enjoy." },
    { id: "g10-2", text: "Meet your counselor to talk about your goals." },
    { id: "g10-3", text: "Choose courses that fit your interests." },
    { id: "g10-4", text: "Join a club, sport, or volunteer activity." },
    { id: "g10-5", text: "Record your achievements and activities." },
    { id: "g10-6", text: "Try a practice test." }
  ],
  "Grade 11": [
    { id: "g11-1", text: "Build a list of 8–10 colleges or programs." },
    { id: "g11-2", text: "Plan your test dates and prepare." },
    { id: "g11-3", text: "Research colleges and take notes." },
    { id: "g11-4", text: "Ask teachers about recommendation letters." },
    { id: "g11-5", text: "Research scholarships and deadlines." },
    { id: "g11-6", text: "Draft ideas for your personal essay." }
  ]
};
const guidanceTips = [
  { title: "Start early", body: "Small steps each month are easier than a big rush." },
  { title: "Track deadlines", body: "Write every important date in one place." },
  { title: "Ask for help", body: "Teachers and counselors can support you." }
];
const opportunities = [
{
title: “Community Scholarship”,
type: “Scholarship”,
deadline: toISO(inDays(30)),
grades: “Grades 10–11”,
body: “A sample scholarship for students who show community leadership.”
},
{
title: “Beach Clean-Up Day”,
type: “Volunteering”,
deadline: toISO(inDays(14)),
grades: “All grades”,
body: “Join a team to clean the local shoreline.”
},
{
title: “Robotics Club”,
type: “Club”,
deadline: toISO(inDays(20)),
grades: “All grades”,
body: “Build and program robots after school. Beginners welcome.”
},
{
title: “Young Writers Contest”,
type: “Competition”,
deadline: toISO(inDays(45)),
grades: “Grades 10–11”,
body: “Submit a short story for the school magazine.”
},
{
title: “Summer Job Shadow Program”,
type: “Internship”,
deadline: toISO(inDays(60)),
grades: “Grade 11”,
body: “Spend a day learning about a professional career.”
},
{
title: “Peer Tutoring Team”,
type: “Volunteering”,
deadline: toISO(inDays(25)),
grades: “Grades 10–11”,
body: “Help younger students with math and reading.”
},
{
title: “STEM Challenge”,
type: “Competition”,
deadline: toISO(inDays(35)),
grades: “All grades”,
body: “Solve an engineering challenge with a team.”
},
{
title: “Arts Merit Award”,
type: “Scholarship”,
deadline: toISO(inDays(50)),
grades: “Grade 11”,
body: “An award for students with an arts portfolio.”
},
{
title: “Connect Kazakhstan 2026”,
type: “Event”,
deadline: “2026-11-01”,
grades: “Grades 10–11”,
body: “Connect Kazakhstan 2026 — an opportunity for students to connect, learn, and explore new possibilities.”
}
];

const calendarEvents = [
{ title: “Welcome Assembly”, date: toISO(inDays(2)), time: “9:00 AM”, type: “Event” },
{ title: “College Info Night”, date: toISO(inDays(6)), time: “6:30 PM”, type: “Guidance” },
{ title: “Math Midterm Exam”, date: toISO(inDays(9)), time: “10:00 AM”, type: “Exam” },
{ title: “Parent-Teacher Meetings”, date: toISO(inDays(13)), time: “3:00 PM”, type: “Meeting” },
{ title: “Beach Clean-Up Day”, date: toISO(inDays(14)), time: “9:00 AM”, type: “Event” },
{ title: “Science Fair”, date: toISO(inDays(21)), time: “1:00 PM”, type: “Event” },
{ title: “Scholarship Deadline”, date: toISO(inDays(30)), time: “11:59 PM”, type: “Deadline” },
{ title: “School Holiday”, date: toISO(inDays(34)), time: “All day”, type: “Holiday” },
{ title: “English Final Exam”, date: toISO(inDays(40)), time: “9:00 AM”, type: “Exam” },
{ title: “Winter Play”, date: toISO(inDays(52)), time: “7:00 PM”, type: “Event” },
{ title: “Connect Kazakhstan Fair — Day 1”, date: “2026-10-20”, time: “9:00 AM”, type: “Event” },
{ title: “Connect Kazakhstan Fair — Day 2”, date: “2026-10-21”, time: “9:00 AM”, type: “Event” },
{ title: “Connect Kazakhstan Fair — Day 3”, date: “2026-10-22”, time: “9:00 AM”, type: “Event” }
];
