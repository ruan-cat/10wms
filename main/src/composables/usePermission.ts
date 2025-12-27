import { computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { checkPermission } from "@/utils/permission";

/**
 * 权限管理 Composable
 * 提供权限检查的便捷方法
 */
export function usePermission() {
	const userStore = useUserStoreHook();

	/** 用户权限列表 */
	const permissions = computed(() => userStore.permissions || []);

	/** 用户角色列表 */
	const roles = computed(() => userStore.roles || []);

	/**
	 * 检查是否有指定权限
	 * @param permission 权限标识（单个或数组）
	 * @returns 是否有权限
	 */
	function hasPermission(permission: string | string[]): boolean {
		return checkPermission(permissions.value, permission);
	}

	/**
	 * 检查是否有指定角色
	 * @param role 角色标识（单个或数组）
	 * @returns 是否有角色
	 */
	function hasRole(role: string | string[]): boolean {
		if (!role) return true;
		if (!roles.value || roles.value.length === 0) return false;

		const roleList = Array.isArray(role) ? role : [role];
		return roleList.some((r) => roles.value.includes(r));
	}

	/**
	 * 检查是否有任意一个权限
	 * @param permissions 权限列表
	 * @returns 是否有任意权限
	 */
	function hasAnyPermission(permissions: string[]): boolean {
		return permissions.some((perm) => hasPermission(perm));
	}

	/**
	 * 检查是否有所有权限
	 * @param permissions 权限列表
	 * @returns 是否有所有权限
	 */
	function hasAllPermissions(permissions: string[]): boolean {
		return permissions.every((perm) => hasPermission(perm));
	}

	/**
	 * 检查是否是超级管理员
	 * @returns 是否是超级管理员
	 */
	function isSuperAdmin(): boolean {
		return permissions.value.includes("*:*:*");
	}

	return {
		permissions,
		roles,
		hasPermission,
		hasRole,
		hasAnyPermission,
		hasAllPermissions,
		isSuperAdmin,
	};
}
