import { IMenuPermission } from '@/types/navigations';
import { Permission } from '@/types/permissions';
import { isArray, isObject } from 'lodash';

type FindMenuType = {
  menu: IMenuPermission;
  by: keyof IMenuPermission;
  value?: string;
};

export function findMenu({
  menu,
  by,
  value,
}: FindMenuType): IMenuPermission | null | undefined {
  if (!isObject(menu)) return null;

  const regexPattern = new RegExp(
    `^${`${menu[by]}`.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\/.*`,
  );

  if (
    value &&
    (`${menu[by]}` === value || regexPattern.test(value)) &&
    !!menu[Permission.CAN_ACCESS]
  ) {
    return menu;
  }

  if (isArray(menu.children)) {
    for (const child of menu.children) {
      const foundMenu = findMenu({ menu: child, by, value });
      if (foundMenu) {
        return foundMenu;
      }
    }
  }
}
