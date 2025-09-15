import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

export const ContactPage = () => {
  const form = useRef();

  // --------------------------------------------------------------------------
  // TODO: お客様へ
  // 以下の3つの値は、EmailJSの管理画面から取得したご自身のものに置き換えてください。
  // 1. EmailJSにサインアップ: https://www.emailjs.com/
  // 2. 新しいサービスを追加 (例: Gmail)
  // 3. 新しいメールテンプレートを作成
  // 4. 「Account」->「API Keys」でPublic Key (User ID) を確認
  // --------------------------------------------------------------------------
  const YOUR_SERVICE_ID = 'service_awnkwwq';       // EmailJSのサービスID
  const YOUR_TEMPLATE_ID = 'template_bm8orgm';     // EmailJSのテンプレートID
  const YOUR_PUBLIC_KEY = 'HdJ-TyVVwBQwEISU9';       // EmailJSのPublic Key (User ID)

  const sendEmail = (e) => {
    e.preventDefault();

    if (YOUR_SERVICE_ID === 'YOUR_SERVICE_ID') {
      alert('EmailJSのIDが設定されていません。ContactPage.jsファイルを編集してください。');
      return;
    }

    emailjs.sendForm(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, form.current, YOUR_PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          alert('メッセージが送信されました！');
          form.current.reset();
      }, (error) => {
          console.log(error.text);
          alert('メッセージの送信に失敗しました。後ほどお試しください。');
      });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          お問い合わせ
        </Typography>
        <form ref={form} onSubmit={sendEmail}>
          <TextField
            label="お名前"
            name="user_name"
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="メールアドレス"
            name="user_email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="メッセージ"
            name="message"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }}>
            送信
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
