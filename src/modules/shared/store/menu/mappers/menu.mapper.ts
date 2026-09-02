import { IMenu, IMenuPermission, IMenuSidebar } from '@/types/navigations';
import { Permission } from '@/types/permissions';

function mapMenuToMenuPermission(menu: IMenu): IMenuPermission {
  return {
    ...menu.data,
    children: menu.children?.map(mapMenuToMenuPermission),
  };
}

function mapMenuPermissionToMenuSidebar(menu: IMenuPermission): IMenuSidebar {
  return {
    id: Number(menu.id),
    code: menu.code,
    title: menu.title ?? '',
    // mock menu icon
    // icon: 'settings-line-duotone',
    icon: menu.icon,
    href: menu.link ?? undefined,
    bgcolor: 'primary',
    isHidden: !menu[Permission.CAN_ACCESS],
    children: menu.children?.length
      ? menu.children.map(mapMenuPermissionToMenuSidebar)
      : undefined,
  };
}

export { mapMenuToMenuPermission, mapMenuPermissionToMenuSidebar };
