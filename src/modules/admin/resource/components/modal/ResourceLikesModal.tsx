import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Divider } from '@mui/material';
import { IconX, IconUser } from '@tabler/icons-react';
import { useGetResourceLikes } from '@/apis/resource/hook';
import { useTranslation } from 'react-i18next';

interface ResourceLikesModalProps {
  open: boolean;
  onClose: () => void;
  resourceId: number;
  resourceTitle: string;
}

export default function ResourceLikesModal({ open, onClose, resourceId, resourceTitle }: ResourceLikesModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource.likesModal' });
  const { data, isLoading } = useGetResourceLikes(open ? resourceId : null);
  const likes = data?.result || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('title', { title: resourceTitle, defaultValue: `Lượt thích: ${resourceTitle}` })}</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : likes.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            {t('empty', 'Chưa có lượt thích nào.')}
          </Typography>
        ) : (
          <List disablePadding>
            {likes.map((like, index) => (
              <React.Fragment key={like.userId}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <IconUser />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight={600}>{like.name}</Typography>}
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" component="span" display="block" color="text.primary">
                          {like.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('likedAt', 'Thích lúc: ')}{new Date(like.likedAt).toLocaleString('vi-VN')}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < likes.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
