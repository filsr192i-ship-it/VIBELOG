export const metadata = {
  title: 'VIBELOG',
  description: '일상의 모든 분위기를 나누는 커뮤니티',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}
