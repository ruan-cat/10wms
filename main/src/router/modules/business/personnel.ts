import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

/** 人员配置模块路由 */
const personnelRouter: RouteConfigsTable = {
	path: "/personnel",
	name: "Personnel",
	component: Layout,
	redirect: "/personnel/academic-code",
	meta: {
		title: $t("business.personnel"),
		icon: "ri:user-star-line",
		rank: 9,
	},
	children: [
		{
			path: "/personnel/academic-code",
			name: "AcademicCode",
			component: () => import("@/pages/personnel/academic-code/index.vue"),
			meta: {
				title: $t("business.academicCode"),
				icon: "ri:graduation-cap-line",
				showLink: true,
			},
		},
		{
			path: "/personnel/employment-status",
			name: "EmploymentStatus",
			component: () => import("@/pages/personnel/employment-status/index.vue"),
			meta: {
				title: $t("business.employmentStatus"),
				icon: "ri:briefcase-line",
				showLink: true,
			},
		},
		{
			path: "/personnel/gender-code",
			name: "GenderCode",
			component: () => import("@/pages/personnel/gender-code/index.vue"),
			meta: {
				title: $t("business.genderCode"),
				icon: "ri:user-2-line",
				showLink: true,
			},
		},
		{
			path: "/personnel/work-status",
			name: "WorkStatus",
			component: () => import("@/pages/personnel/work-status/index.vue"),
			meta: {
				title: $t("business.workStatus"),
				icon: "ri:user-follow-line",
				showLink: true,
			},
		},
	],
};

export default personnelRouter;
