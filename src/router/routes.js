
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: "/dashboard",
    component: () => import("layouts/Dashboard.vue"),
    meta: {
      aut: true
    },
    children: [
      { path: "", component: () => import("pages/dashboard/Index.vue") },
      { path: "/dashboard/patients", component: () => import("pages/dashboard/Patients.vue") }
    ]
  },
  {
    path: "/scans/:patientId",
    component: () => import("layouts/Scans.vue"),
    meta: {
      aut: true
    },
    children: [
      {
        path: "total",
        component: () => import("pages/scans/TotalScan.vue")
      },
      {
        path: "cervical",
        component: () => import("pages/scans/CervicalScan.vue")
      },
      {
        path: "lumbar",
        component: () => import("pages/scans/LumbarScan.vue")
      },
      {
        path: "fosas",
        component: () => import("pages/scans/FosasScan.vue")
      }
    ]
  },
  {
    path: "/new-scans/:patientId",
    component: () => import("layouts/NewScans.vue"),
    meta: {
      aut: true
    },
    children: [
      {
        path: "total",
        component: () => import("pages/newscans/NewTotalScan.vue")
      },
      {
        path: "cervical",
        component: () => import("pages/newscans/NewCervicalScan.vue")
      },
      {
        path: "lumbar",
        component: () => import("pages/newscans/NewLumbarScan.vue")
      },
      // {
      //   path: "fosas",
      //   component: () => import("pages/newcans/NewFosasScan.vue")
      // }
    ]
  },
  {
    // ejemplo: '/edit-scans/1699833811059/1699145428677/total/post',
    path: '/edit-scans/:idScan/:patientId/:typeScan/:type',
    component: () => import('layouts/EditScans.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
