import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/customizer/CustomizerSlice';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { AnyType } from '@/types/shared';
import { EN_LOCALE, VI_LOCALE } from '@/modules/shared/constants';
import {
  getDefaultLanguage,
  getLocalStorageItem,
  getSelectedLanguage,
  setLocalStorageItems,
} from '@/modules/shared/utils';
import { useLanguage } from '@/contexts';

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(
    () => getSelectedLanguage() || getDefaultLanguage(),
  );

  const { setLanguage: setContextLanguage } = useLanguage();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const { i18n } = useTranslation();
  useEffect(() => {
    let savedLanguage = getLocalStorageItem<string>('selectedLanguage');
    if (!savedLanguage) {
      savedLanguage = getDefaultLanguage();
    }
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
      i18n.changeLanguage(savedLanguage);
      setSelectedLanguage(savedLanguage);
    }
  }, [dispatch, i18n]);

  const Languages = [
    {
      flagname:
        getSelectedLanguage() === EN_LOCALE ? 'English' : 'English',
      value: 'en',
    },
    {
      flagname:
        getSelectedLanguage() === VI_LOCALE ? 'Tiếng Việt' : 'Vietnamese',
      value: 'vi',
    },
  ];

  const handleClick = (event: AnyType) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    dispatch(setLanguage(language));
    setLocalStorageItems({ selectedLanguage: language });
    i18n.changeLanguage(language);
    setContextLanguage(language);
    handleClose();
  };

  const currentLang =
    Languages.find((_lang) => _lang.value === selectedLanguage) || Languages[1];

  return (
    <>
      <Button
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="inherit"
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleClick}
      >
        <Typography variant="subtitle2" color="textPrimary" sx={{ fontWeight: 500 }}>
          {currentLang.flagname}
        </Typography>
        <Avatar
          sx={{
            width: 25,
            height: 25,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          {currentLang.value.substring(0, 1).toUpperCase()}
        </Avatar>
      </Button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        {Languages.map((option, index) => (
          <MenuItem
            key={index}
            sx={{ py: 2, px: 3 }}
            onClick={() => handleLanguageChange(option.value)}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                {option.value.substring(0, 1).toUpperCase()}
              </Avatar>
              <Typography> {option.flagname}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Language;
