export const routes = {
    homePage: { path: '/', title: 'Home' },
    loginPage: { path: '/login', title: 'Login' },
    registerPage: { path: '/register', title: 'Register' },
    worksPage: { path: '/works', title: 'Works'},
    unauthorized: { path: '/unauthorized', title: 'Unauthorized' },
    protectedPage: { path: '/user', title: 'User Dashboard' },
    adminPage: { path: '/admin', title: 'Admin Dashboard' },
    newOrgPage: { path: '/new-organization', title: 'Add New Organization' },
    existingOrgPage: { path: '/existing-organizations', title: 'Existing Organizations' },
    orgPage: { path: '/organization', title: 'Organization Dashboard' },
    orgAddAgent: { path: '/add-agents', title: 'Add Agents' },
    orgCurrentAgent: { path: '/current-agents', title: 'Current Agents' },
    addNewJob: { path: '/new-job', title: 'New Job'},
    currentJobs: { path: '/current-jobs', title: 'Current Jobs' },
    orgSettings: { path: '/organization-settings', title: 'Organization Settings' },
    agentPage: { path: '/agent', title: 'Agent Dashboard' },
    agentShift: {path: '/agent-shift', title: 'Agent Shift'},
    agentStudentList: {path: '/agent-student-list', title: 'Agent Student List'},
    studentApplications: { path: '/applications', title: 'Student Applications'},
    agentSettings: { path: '/agent-settings', title: 'Agent Settings'},
    agentJobs: { path: '/agent-jobs', title: 'Agent Jobs'},
    adminSettings: { path: '/admin-settings', title: 'Admin Settings'},
    workPage: { path: '/works/:id', title: 'Work page'},
    shiftPage: { path: '/shift/:id', title: 'Shift page'}
};

export const adminTopLinks = [
  { path: routes.adminPage.path, icon: "./dashboard.png", label: "Kezelőpult" },
  { path: routes.newOrgPage.path, icon: "./more.png", label: "Szövetkezet felvétele" },
  { path: routes.existingOrgPage.path, icon: "./people.png", label: "Meglévő szövetkezetek" },
  { path: routes.adminSettings.path, icon: "./settings.png", label: "Beállítások" },
];
export const orgMenuLinks = [
  { path: routes.orgPage.path, icon: "./dashboard.png", label: "Kezelőpult" },
  { path: routes.orgAddAgent.path, icon: "./realtor.png", label: "Közvetítő felvétele" },
  { path: routes.orgCurrentAgent.path, icon: "./people.png", label: "Meglévő közvetítők" },
  { path: routes.addNewJob.path, icon: "./more.png", label: "Munka létrehozása" },
  { path: routes.currentJobs.path, icon: "./job.png", label: "Létrehozott munkák" },
  { path: routes.orgSettings.path, icon: "./settings.png", label: "Beállítások" }
];  
export const agentMenuLinks = [
  { path: routes.agentPage.path, icon: "/dashboard.png", label: "Kezelőpult"},
  { path: routes.agentJobs.path, icon: "/job-description.png", label: "Munkák"},
  { path: routes.agentShift.path, icon: "/timetable.png", label: "Műszak"},
  { path: routes.studentApplications.path, icon: "/resume.png", label: "Jelentkezések"},
  { path: routes.agentSettings.path, icon: "/settings.png", label: "Beállítások"},
  { path: routes.agentStudentList.path, icon: "/realtor.png", label: "Diákok listázása"}
];
export const userMenuLinks = [

];
export const roleRoutes: Record<string, string> = {
  Admin: routes.adminPage.path,
  User: routes.homePage.path,
  Organization: routes.orgPage.path,
  Agent: routes.agentPage.path
};