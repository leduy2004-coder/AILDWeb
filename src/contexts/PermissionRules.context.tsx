import { PureAbility, defineAbility } from '@casl/ability';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

 import { getUserInfoByAccessToken, noop } from '@/modules/shared/utils';
import { useDispatch } from '@/modules/shared/store/hooks';
import { setMenus } from '@/modules/shared/store/menu';
import { IMenu } from '@/types/navigations';
import { Permission, RolePermission } from '@/types/permissions';
import Menuitems from '@/app/(DashboardLayout)/layout/vertical/sidebar/MenuItems';

type ContextType = {
  rules: RolePermission[];
  ability: PureAbility | null;
  refetchMenu: () => void;
};

const DEFAULT_CONTEXT_VALUE = {
  rules: [],
  ability: null,
  refetchMenu: noop,
};

export const PermissionRulesContext = createContext<ContextType>(
  DEFAULT_CONTEXT_VALUE,
);

export const usePermissionRules = () => {
  const context = useContext(PermissionRulesContext);

  if (!context) {
    throw new Error(
      'usePermissionRules must be used within PermissionRulesProvider',
    );
  }

  return context;
};

export const PermissionRulesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [contextValue, setContextValue] = useState<ContextType>(
    DEFAULT_CONTEXT_VALUE,
  );
  const dispatch = useDispatch();
  const userInfoString = getUserInfoByAccessToken() || '';
  const userLogin = useMemo(() => {
    try {
      return JSON.parse(userInfoString) || {};
    } catch {
      return {};
    }
  }, [userInfoString]);

  const userRolesList = useMemo<string[]>(() => {
    if (!userLogin.roles) return [];
    return Array.isArray(userLogin.roles) ? userLogin.roles : [userLogin.roles];
  }, [userLogin.roles]);

  const filterMenuByRole = useCallback((items: IMenu[], userRoles: string[]): IMenu[] => {
    return items
      .map((item) => {
        const priAccess = item.data?.priAccess;
        const hasAccess = userRoles.some((role) => priAccess.includes(role));
        if (hasAccess) {
          return item;
        }
        return null;
      })
      .filter((item): item is IMenu => item !== null);
  }, []);

  const generateRules = useCallback((items: IMenu[], rules: RolePermission[]) => {
    items.forEach((item: IMenu) => {
      const roleData = item.data;

      const actions = Object.entries(Permission).reduce((result, [, value]) => {
        const allowedRoles = roleData[value];

        if (
          Array.isArray(allowedRoles) &&
          userRolesList.some((role: string) => allowedRoles.includes(role))
        ) {
          result.push(value);
        }

        return result;
      }, [] as Permission[]);

      rules.push({
        subject: roleData.code,
        actions,
      });

      if (item.children.length > 0) {
        return generateRules(item.children, rules);
      }
    });

    return rules;
  }, [userRolesList]);
  
  useEffect(() => {
    if (!userRolesList.length) return;

    const filteredMenus = filterMenuByRole(Menuitems, userRolesList);
    const rules = generateRules(filteredMenus, []);

    const ability = defineAbility((can: any) => {
      rules.forEach(({ actions, subject }: RolePermission) => {
        actions.forEach((action: Permission) => can(action, subject));
      });
    });

    dispatch(setMenus(filteredMenus));

    setContextValue({
      rules,
      ability,
      refetchMenu: noop,
    });
  }, [userRolesList, filterMenuByRole, generateRules, dispatch]);

  const value = useMemo(() => contextValue, [contextValue]);

  return (
    <PermissionRulesContext.Provider value={value}>
      {children}
    </PermissionRulesContext.Provider>
  );
};
