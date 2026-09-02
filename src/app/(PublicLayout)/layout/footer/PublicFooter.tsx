'use client';

import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

export const PublicFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', pt: 6, pb: 4, mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} mb={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" fontWeight={800} color="primary.main">
                AILD
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('footer.description', 'Hệ thống Đánh giá Năng lực Sử dụng Trí tuệ Nhân tạo dành cho Sinh viên Đại học. Học tập thông minh, đánh giá chính xác.')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, color: 'text.secondary' }}>
              <LanguageIcon fontSize="small" />
              <Typography variant="body2">Tiếng Việt</Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>{t('footer.platform', 'Nền tảng')}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.assessCompetency', 'Đánh giá năng lực')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.howItWorks', 'Cách hoạt động')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.userGuide', 'Hướng dẫn sử dụng')}</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>{t('footer.resources', 'Tài nguyên')}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.aiNews', 'Tin tức AI')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.researchResults', 'Kết quả nghiên cứu')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.helpCenter', 'Trung tâm trợ giúp')}</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>{t('footer.company', 'Tổ chức')}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.aboutUs', 'Về chúng tôi')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.contact', 'Liên hệ')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.privacyPolicy', 'Chính sách bảo mật')}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t('footer.copyright', '© 2026 AILD. Đã đăng ký bản quyền.')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.terms', 'Điều khoản dịch vụ')}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{t('footer.privacyPolicy', 'Chính sách bảo mật')}</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
