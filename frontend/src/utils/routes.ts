export const routes = {
    homePage: { path: '/', title: 'Home' },
    loginPage: { path: '/login', title: 'Login' },
    registerPage: { path: '/register', title: 'Register' },
    worksPage: { path: '/works', title: 'Works'},
    unauthorized: { path: '/unauthorized', title: 'Unauthorized' },
    userPage: { path: '/user', title: 'User Dashboard' },
    userJobs: { path: '/user-jobs', title: 'User Jobs' },
    userProfile: { path: '/user-profile', title: 'User Profile' },
    adminPage: { path: '/admin', title: 'Admin Dashboard' },
    newOrgPage: { path: '/new-organization', title: 'Add New Organization' },
    existingOrgPage: { path: '/existing-organizations', title: 'Existing Organizations' },
    orgPage: { path: '/organization', title: 'Organization Dashboard' },
    orgAddAgent: { path: '/add-agents', title: 'Add Agents' },
    orgCurrentAgent: { path: '/current-agents', title: 'Current Agents' },
    addNewJob: { path: '/new-job', title: 'New Job'},
    currentJobs: { path: '/current-jobs', title: 'Current Jobs' },
    orgSettings: { path: '/organization-settings', title: 'Organization Settings' },
    agentStudentList: {path: '/agent-student-list', title: 'Agent Student List'},
    shiftApplications: {path: '/shift-applications/:id', title: 'Shift Applications'},
    studentApplications: { path: '/applications', title: 'Student Applications'},
    agentSettings: { path: '/agent-settings', title: 'Agent Settings'},
    agentJobs: { path: '/agent', title: 'Agent Jobs'},
    adminSettings: { path: '/admin-settings', title: 'Admin Settings'},
    workPage: { path: '/works/:id', title: 'Work Page'},
    shiftPage: { path: '/shift/:id', title: 'Shift Page'},
    userApplications: { path: '/user-applications', title: 'User Applications'},
    manageShiftsPage: { path: '/manage-shifts/:id', title: 'Manage Shifts'},
    userShifts: {path: '/user-shifts', title: 'User Shifts'},
    contactPage: {path: '/contact', title: 'Contact'},
    organizationRequest: { path: '/organization-request', title: 'Organization Request'}
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
  { path: routes.orgSettings.path, icon: "./settings.png", label: "Beállítások" },
];  
export const agentMenuLinks = [
  { path: routes.agentJobs.path, icon: "/job-description.png", label: "Munkák"},
  { path: routes.studentApplications.path, icon: "/resume.png", label: "Jelentkezések"},
  { path: routes.agentStudentList.path, icon: "/realtor.png", label: "Diákok"},
  { path: routes.agentSettings.path, icon: "/settings.png", label: "Beállítások"}
];
export const roleRoutes: Record<string, string> = {
  Admin: routes.adminPage.path,
  User: routes.userPage.path,
  Organization: routes.orgPage.path,
  Agent: routes.agentJobs.path
};