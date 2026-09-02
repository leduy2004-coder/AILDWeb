import { Icon } from '@iconify/react';
import Link from 'next/link';
import React from 'react';

// mui imports
import { useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import { AnyType } from '@/types/shared';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { IMenuSidebar } from '@/types/navigations';
import { useAppModal } from '@/modules/shared/hooks';
import { ConfirmModal } from '@/modules/shared/components';
import { useRouter } from 'next/navigation';

interface ItemType {
  item: IMenuSidebar;
  onClick: (item: IMenuSidebar) => void;
  hideMenu?: AnyType;
  level?: number | AnyType;
  pathDirect: string;
}

export default function NavItem({
  item,
  level,
  pathDirect,
  hideMenu,
  onClick,
}: ItemType) {
  const customizer = useSelector((state: AppState) => state.customizer);
  //const Icon = item?.icon;

  const theme = useTheme();
  const { t } = useTranslation();

  const router = useRouter();

  //const itemIcon = level > 1 ? <Icon size={24} /> : <Icon size="1.5rem" />;

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '5px 10px 5px 0',
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color:
      level > 1 && pathDirect === item?.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    fontWeight: '600 !important',
    paddingLeft: hideMenu
      ? '0'
      : level > 2
        ? `${level * 15}px`
        : level > 1
          ? '10px'
          : '0',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '-20px',
      height: '100%',
      zIndex: '-1',
      borderRadius: ' 0 24px 24px 0',
      transition: 'all .3s ease-in-out',
      width: '0',
    },
    '&:hover::before': {
      width: 'calc(100% + 20px)',
      backgroundColor: theme.palette.primary.light,
    },
    '& > .MuiListItemIcon-root': {
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      transition: 'all .3s ease-in-out',
    },
    '.MuiTypography-root': {
      fontWeight: '600',
    },
    '&:hover': {
      backgroundColor: 'transparent !important',
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
      '.MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
      '&:before': {
        backgroundColor: theme.palette.primary.light,
        width: 'calc(100% + 16px)',
      },
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  }));
  const { show: showConfirmModal } = useAppModal(ConfirmModal);

  const logoutAndRedirect = (href: string) => {
    router.push(href);
  };

  /*
  const handleClickHref = (e: React.MouseEvent<HTMLElement>, href?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!href) return;

    const redirect = () => logoutAndRedirect(href);

    showConfirmModal({
      title: t('header.profile.popup_confirm.title'),
      description: t('header.profile.popup_confirm.unsaved_changes'),
      onAgree: redirect,
    });
  };
  */

  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <Link
        href={item.href ?? ''}
        // onClick={(event) => handleClickHref(event, item.href)}
      >
        <ListItemStyled
          // {...listItemProps}
          disabled={item?.disabled}
          selected={pathDirect.includes(item?.href ?? '')}
          onClick={() => onClick(item)}
          sx={{
            '&:hover': {
              '.MuiListItemIcon-root': {
                color: theme.palette.primary.main,
              },
            },
            '&:hover::before': {
              backgroundColor: theme.palette.primary.light,
            },
            '&.Mui-selected': {
              color:
                level > 1
                  ? `${theme.palette.text.secondary} !important`
                  : theme.palette.primary.main,
              '& .MuiTypography-root': {
                fontWeight: level > 1 ? '600 !important' : 400,
              },
              '.MuiListItemIcon-root': {
                color: theme.palette.primary.main,
              },
              '&:before': {
                backgroundColor: theme.palette.primary.light,
              },
              '&:hover': {
                color: theme.palette.primary.main,
                '.MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: '36px',
              p: '3px 0',
              color:
                level > 1 && pathDirect === item?.href
                  ? `${theme.palette.primary.main}!important`
                  : 'inherit',
            }}
          >
            {level > 1 ? (
              <Box
              /*sx={{
                  width: '6px',
                  height: '6px',
                  opacity: level > 1 && pathDirect === item?.href ? 1 : '0.3',
                  backgroundColor:
                    level > 1 && pathDirect === item?.href
                      ? theme.palette.text.secondary
                      : theme.palette.text.secondary,
                }}*/
              />
            ) : (
              <Icon icon={'solar:' + item.icon} width="24" height="24" />
            )}
            {/* {itemIcon} */}
          </ListItemIcon>
          <Tooltip title={t(`${item?.title}`)}>
            <ListItemText
              primaryTypographyProps={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {hideMenu ? '' : <>{t(`${item?.title}`)}</>}
              <br />
              {item?.subtitle ? (
                <Typography variant="caption">
                  {hideMenu ? '' : item?.subtitle}
                </Typography>
              ) : (
                ''
              )}
            </ListItemText>
          </Tooltip>

          {!item?.chip || hideMenu ? null : (
            <Chip
              color={item?.chipColor ?? 'default'}
              variant={item?.variant ? item?.variant : 'filled'}
              size="small"
              label={item?.chip}
            />
          )}
        </ListItemStyled>
      </Link>
    </List>
  );
}
