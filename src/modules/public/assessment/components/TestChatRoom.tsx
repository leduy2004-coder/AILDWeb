import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper, CircularProgress, Avatar } from '@mui/material';
import { IconSend, IconRobot, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useChatWithAI } from '@/apis/assessment/hook';
import { toast } from 'react-toastify';
import logoTutor from '@/assests/images/logo.png';

interface TestChatRoomProps {
  assessmentId: number;
  chatMaxTurns: number;
  onFinish: (finalScore?: number, interviewScore?: number) => void;
}

interface Message {
  id: string;
  role: 'AI' | 'USER';
  content: string;
}

export const TestChatRoom: React.FC<TestChatRoomProps> = ({ assessmentId, chatMaxTurns, onFinish }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useChatWithAI({ assessmentId });
  const initTriggered = useRef(false);

  useEffect(() => {
    if (!initTriggered.current) {
      initTriggered.current = true;
      chatMutation.mutate(
        { message: `Bắt đầu phỏng vấn. Hãy chào tôi, phổ biến ngắn gọn luật phỏng vấn (tối đa ${chatMaxTurns} lượt hỏi đáp) và đặt ngay câu hỏi đầu tiên.` },
        {
          onSuccess: (res) => {
            setMessages([{ id: Date.now().toString(), role: 'AI', content: res.result.reply }]);
          },
          onError: () => {
            setMessages([{ id: 'error', role: 'AI', content: "Có lỗi xảy ra khi kết nối. Vui lòng thử lại." }]);
          }
        }
      );
    }
  }, [assessmentId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    
    // Optimistic UI update
    const newUserMsg: Message = { id: Date.now().toString(), role: 'USER', content: userMsg };
    setMessages(prev => [...prev, newUserMsg]);

    chatMutation.mutate(
      { message: userMsg },
      {
        onSuccess: (res) => {
          if (res.result) {
            const aiMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'AI',
              content: res.result.reply,
            };
            setMessages(prev => [...prev, aiMsg]);

            if (res.result.isFinished) {
              setTimeout(() => {
                onFinish(res.result?.finalScore, res.result?.interviewScore);
              }, 3000);
            }
          }
        },
        onError: () => {
          toast.error(t('assessment.chatError', 'Lỗi kết nối. Vui lòng thử lại.'));
          setMessages(prev => prev.filter(m => m.id !== newUserMsg.id));
          setInputValue(userMsg);
        }
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '700px', // Fixed height for chat window
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={3} pb={2} borderBottom="1px solid #F1F5F9">
        <Avatar src={logoTutor.src} sx={{ bgcolor: 'white', width: 48, height: 48, border: '1px solid #E2E8F0' }} imgProps={{ sx: { objectFit: 'cover', transform: 'scale(1.35)' } }} />
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {t('assessment.aiInterviewer', 'Giám khảo AI')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('assessment.aiInterviewerDesc', 'Trả lời các câu hỏi để hoàn tất bài thi')} • Lượt trả lời: {messages.filter(m => m.role === 'USER').length} / {chatMaxTurns}
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box 
        flex={1} 
        overflow="auto" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          pr: 1.5, 
          mb: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#CBD5E1',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#94A3B8',
            },
          },
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            display="flex"
            justifyContent={msg.role === 'USER' ? 'flex-end' : 'flex-start'}
            alignItems="flex-start"
            gap={1.5}
          >
            {msg.role === 'AI' && (
              <Avatar src={logoTutor.src} sx={{ bgcolor: 'white', width: 42, height: 42, border: '1px solid #E2E8F0' }} imgProps={{ sx: { objectFit: 'cover', transform: 'scale(1.35)' } }} />
            )}
            
            <Box
              sx={{
                maxWidth: '75%',
                p: 2,
                borderRadius: '16px',
                borderTopLeftRadius: msg.role === 'AI' ? 0 : '16px',
                borderTopRightRadius: msg.role === 'USER' ? 0 : '16px',
                backgroundColor: msg.role === 'USER' ? '#1E3A8A' : '#EFF6FF',
                color: msg.role === 'USER' ? '#FFFFFF' : '#1E293B',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {msg.content}
              </Typography>
            </Box>

            {msg.role === 'USER' && (
              <Avatar sx={{ bgcolor: '#F1F5F9', color: '#64748B', width: 32, height: 32 }}>
                <IconUser size={20} />
              </Avatar>
            )}
          </Box>
        ))}
        
        {chatMutation.isPending && (
          <Box display="flex" justifyContent="flex-start" alignItems="flex-start" gap={1.5}>
            <Avatar src={logoTutor.src} sx={{ bgcolor: 'white', width: 42, height: 42, border: '1px solid #E2E8F0' }} imgProps={{ sx: { objectFit: 'cover', transform: 'scale(1.35)' } }} />
            <Box sx={{ p: 2, borderRadius: '16px', borderTopLeftRadius: 0, backgroundColor: '#EFF6FF' }}>
              <CircularProgress size={20} />
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box display="flex" gap={2} alignItems="flex-end">
        <TextField
          fullWidth
          size="small"
          multiline
          maxRows={4}
          placeholder={t('assessment.chatPlaceholder', 'Nhập tin nhắn...')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={chatMutation.isPending}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!inputValue.trim() || chatMutation.isPending}
          sx={{
            backgroundColor: '#1E3A8A',
            color: 'white',
            width: 42,
            height: 42,
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: '#172554',
            },
            '&.Mui-disabled': {
              backgroundColor: '#E2E8F0',
              color: '#94A3B8'
            }
          }}
        >
          <IconSend size={20} />
        </IconButton>
      </Box>
    </Paper>
  );
};
