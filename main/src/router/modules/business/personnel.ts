import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

/** 人员配置模块路由 */
const personnelRouter: RouteConfigsTable = {
	path: "/personnel",
	name: "Personnel",
	component: Layout,
	redirect: "/personnel/academic-code",
	meta: {
		title: $t("menus.personnel"),
		icon: "ep:user",
		rank: 9,
	},
	children: [
		{
			path: "/personnel/academic-code",
			name: "AcademicCode",
			component: () => import("@/pages/personnel/academic-code/index.vue"),
			meta: {
				title: $t("menus.academicCode"),
				showLink: true,
			},
		},
		{
			path: "/personnel/employment-status",
			name: "EmploymentStatus",
			component: () => import("@/pages/personnel/employment-status/index.vue"),
			meta: {
				title: $t("menus.employmentStatus"),
				showLink: true,
			},
		},
		{
			path: "/personnel/gender-code",
			name: "GenderCode",
			component: () => import("@/pages/personnel/gender-code/index.vue"),
			meta: {
				title: $t("menus.genderCode"),
				showLink: true,
			},
		},
		{
			path: "/personnel/work-status",
			name: "WorkStatus",
			component: () => import("@/pages/personnel/work-status/index.vue"),
			meta: {
				title: $t("menus.workStatus"),
				showLink: true,
			},
		},
	],
};

export default personnelRouter;
