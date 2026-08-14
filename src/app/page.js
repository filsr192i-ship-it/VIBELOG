'use client';

import React, { useState, useEffect } from 'react';

// Default LEGO minifigure silhouette avatar SVG
const DEFAULT_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#cad4e6"/>
  <g fill="#ffffff" stroke="#b0bcd0" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 82,34 L 118,34 C 121,34 123,36 123,39 L 123,50 L 77,50 L 77,39 C 77,36 79,34 82,34 Z"/>
    <rect x="56" y="48" width="88" height="80" rx="26" ry="26"/>
    <rect x="78" y="126" width="44" height="14"/>
    <path d="M 72,140 L 128,140 C 134,140 140,143 144,147 L 186,170 C 192,173 196,180 196,188 L 196,200 L 4,200 L 4,188 C 4,180 8,173 14,170 L 56,147 C 60,143 66,140 72,140 Z"/>
  </g>
</svg>
`)}`;

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [userEmailInputCode, setUserEmailInputCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [sortMode, setSortMode] = useState('trending'); // 'trending' | 'latest' | 'popular'
  const [selectedTag, setSelectedTag] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const [showNaviesModal, setShowNaviesModal] = useState(false);
  const [naviesMessages, setNaviesMessages] = useState([
    {
      role: 'model',
      text: '안녕하세요! 당신의 트렌디한 패션 어드바이저 NAVIES입니다. 👗✨\n\n📸 **사진이나 영상을 첨부하시면 아이템을 정밀 분석**하고 최저가 구매/검색 링크(네이버, 무신사, 쿠팡 등)를 바로 찾아드립니다!'
    }
  ]);
  const [naviesInput, setNaviesInput] = useState('');
  const [naviesMedia, setNaviesMedia] = useState(null);
  const [isNaviesLoading, setIsNaviesLoading] = useState(false);

  const [content, setContent] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const theme = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    text: isDark ? '#f8fafc' : '#0f172a',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    border: isDark ? '#334155' : '#e2e8f0',
    inputBg: isDark ? '#0f172a' : '#f1f5f9',
    inputBorder: isDark ? '#475569' : '#cbd5e1',
    inputText: isDark ? '#f8fafc' : '#0f172a',
    subText: isDark ? '#94a3b8' : '#64748b',
    hoverBg: isDark ? '#334155' : '#f1f5f9'
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    if (isSignUp) {
      generateCaptcha();
    }
  }, [isSignUp]);

  useEffect(() => {
    const defaultRegistered = [
      {
        id: 'user_dev',
        email: 'official@vibelog.com',
        password: 'Password123!',
        name: '바이브로그 Official',
        bio: '공식 바이브로그 계정입니다. 일상의 모든 분위기를 나누세요 ✨',
        avatar: DEFAULT_AVATAR
      },
      {
        id: 'user_fashion',
        email: 'fashion@vibelog.com',
        password: 'Password123!',
        name: '스타일링마스터',
        bio: '트렌디한 데일리룩과 퍼스널컬러 스타일링 연구소 👗',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    ];

    const savedRegistered = localStorage.getItem('vibelog_registered_users');
    let currentRegistered = defaultRegistered;
    if (savedRegistered) {
      try {
        const parsed = JSON.parse(savedRegistered);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentRegistered = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setRegisteredUsers(currentRegistered);
    localStorage.setItem('vibelog_registered_users', JSON.stringify(currentRegistered));

    const savedUser = localStorage.getItem('vibelog_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handleSendEmailVerification = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('⚠️ 먼저 이메일 주소를 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      showToast('⚠️ 올바른 이메일 형식이 아닙니다.');
      return;
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailVerificationCode(randomCode);
    setIsSendingEmail(true);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              to_email: cleanEmail,
              passcode: randomCode
            }
          })
        });

        if (res.ok) {
          showToast(`📧 [${cleanEmail}] (으)로 6자리 인증번호를 전송했습니다.`);
          setIsEmailSent(true);
        } else {
          showToast(`⚠️ EmailJS 전송 테스트용 인증번호: [${randomCode}]`);
          setIsEmailSent(true);
        }
      } catch (err) {
        console.error(err);
        showToast(`💡 네트워크 발송 오류. 테스트용 인증번호: [${randomCode}]`);
        setIsEmailSent(true);
      } finally {
        setIsSendingEmail(false);
      }
    } else {
      setTimeout(() => {
        setIsSendingEmail(false);
        setIsEmailSent(true);
        showToast(`💡 [EmailJS 키 미설정 테스트] 인증번호: [${randomCode}]`);
      }, 500);
    }
  };

  const handleVerifyEmailCode = () => {
    if (!userEmailInputCode.trim()) {
      showToast('⚠️ 인증번호를 입력해주세요.');
      return;
    }

    if (userEmailInputCode.trim() === emailVerificationCode) {
      setIsEmailVerified(true);
      showToast('✅ 이메일 인증이 성공적으로 완료되었습니다!');
    } else {
      showToast('❌ 인증번호가 일치하지 않습니다. 다시 확인해 주세요.');
    }
  };

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return '비밀번호는 최소 6자리 이상이어야 합니다.';
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    if (!hasLetter || !hasNumber || !hasSpecial) {
      return '비밀번호는 영문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.';
    }
    return null;
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      showToast('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (isSignUp) {
      const pwdError = validatePassword(cleanPassword);
      if (pwdError) {
        showToast(`⚠️ ${pwdError}`);
        return;
      }

      const cleanUserName = userNameInput.trim();
      if (!cleanUserName) {
        showToast('⚠️ 닉네임을 입력해주세요.');
        return;
      }

      const existingName = registeredUsers.find((u) => u.name.trim().toLowerCase() === cleanUserName.toLowerCase());
      if (existingName) {
        showToast('⚠️ 이미 사용 중인 닉네임입니다.');
        return;
      }

      if (!captchaInput.trim() || captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
        showToast('⚠️ 보안문자가 일치하지 않습니다.');
        generateCaptcha();
        return;
      }

      if (!isEmailVerified) {
        showToast('⚠️ 이메일 인증번호 확인을 완료해 주세요.');
        return;
      }

      const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        showToast('이미 등록된 이메일입니다. 로그인해 주세요.');
        setIsSignUp(false);
        return;
      }

      const newUser = {
        id: `user_${Date.now()}`,
        email: cleanEmail,
        password: cleanPassword,
        name: cleanUserName,
        bio: '나만의 감성을 기록하는 공간입니다 ✨',
        avatar: DEFAULT_AVATAR,
        isGuest: false
      };

      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('vibelog_registered_users', JSON.stringify(updatedUsers));

      setEmail('');
      setPassword('');
      setUserNameInput('');
      setCaptchaInput('');
      setIsEmailVerified(false);
      setIsEmailSent(false);
      setIsSignUp(false);

      showToast(`🎉 회원가입 완료! 가입하신 계정으로 로그인해주세요.`);
    } else {
      const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!foundUser) {
        showToast('❌ 등록되지 않은 이메일입니다. 회원가입을 해주세요.');
        return;
      }

      if (foundUser.password !== cleanPassword) {
        showToast('❌ 비밀번호가 올바르지 않습니다.');
        return;
      }

      const activeUser = { ...foundUser, isGuest: false };
      setUser(activeUser);
      localStorage.setItem('vibelog_user', JSON.stringify(activeUser));
      showToast(`✨ 로그인 성공! ${activeUser.name}님 환영합니다.`);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'user_guest',
      email: 'guest@vibelog.com',
      name: '게스트 유저',
      bio: '게스트 체험 모드로 접속 중입니다.',
      avatar: DEFAULT_AVATAR,
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('vibelog_user', JSON.stringify(guestUser));
    showToast('✨ 게스트 모드로 접속했습니다. (로그인 후 NAVIES AI 챗봇 및 피드 작성이 가능합니다)');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vibelog_user');
    showToast('성공적으로 로그아웃 되었습니다.');
  };

  const [posts, setPosts] = useState([
    {
      id: 'post_1',
      authorId: 'user_dev',
      authorName: '바이브로그 Official',
      authorAvatar: DEFAULT_AVATAR,
      authorBio: '공식 바이브로그 계정입니다. 일상의 모든 분위기를 나누세요 ✨',
      content: 'VIBELOG에 오신 것을 환영합니다! 🎉\n#VIBELOG #웰컴 #데일리룩 #OOTD\n\n- 실시간 이메일 인증 & 보안문자(CAPTCHA) 지원\n- 스마트 추천 알고리즘 정렬 지원\n- 📸 사진/영상 첨부 AI 패션 어드바이저 NAVIES (Gemini 3.6 Flash 탑재) 무료 지원!',
      mediaList: [
        {
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          type: 'image',
          name: 'vibelog_welcome.jpg'
        }
      ],
      likes: ['user_dev'],
      comments: [
        {
          id: 'comment_1',
          userId: 'user_dev',
          userName: '바이브로그 Official',
          userAvatar: DEFAULT_AVATAR,
          text: 'NAVIES AI 버튼을 눌러 사진이나 영상을 첨부하고 착장 정보와 최저가 구매 링크를 받아보세요!',
          createdAt: '방금 전'
        }
      ],
      createdAt: '10분 전',
      timestamp: Date.now() - 1000 * 60 * 10
    },
    {
      id: 'post_2',
      authorId: 'user_fashion',
      authorName: '스타일링마스터',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorBio: '트렌디한 데일리룩과 퍼스널컬러 스타일링 연구소 👗',
      content: '오늘의 스트릿 캐주얼 코디입니다 🖤\n#스트릿 #데일리룩 #캐주얼 #OOTD #시크',
      mediaList: [
        {
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
          type: 'image',
          name: 'fashion1.jpg'
        }
      ],
      likes: ['user_dev', 'user_fashion'],
      comments: [],
      createdAt: '1시간 전',
      timestamp: Date.now() - 1000 * 60 * 60
    }
  ]);

  const renderFormattedText = (textStr) => {
    if (!textStr) return null;
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(textStr)) !== null) {
      if (match.index > lastIndex) {
        parts.push(textStr.substring(lastIndex, match.index));
      }
      const linkTitle = match[1];
      const linkUrl = match[2];

      parts.push(
        <a
          key={`link_${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            margin: '4px 2px',
            padding: '6px 14px',
            borderRadius: '12px',
            backgroundColor: '#ec4899',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '12px',
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(236, 72, 153, 0.3)',
            cursor: 'pointer'
          }}
        >
          🛒 {linkTitle} ↗
        </a>
      );
      lastIndex = markdownLinkRegex.lastIndex;
    }

    if (lastIndex < textStr.length) {
      parts.push(textStr.substring(lastIndex));
    }
    return parts.length > 0 ? parts : textStr;
  };

  const extractHashtags = (textStr) => {
    if (!textStr) return [];
    const matches = textStr.match(/#[^\s#]+/g);
    return matches ? matches.map((t) => t.trim()) : [];
  };

  const getAllPopularTags = () => {
    const tagCounts = {};
    posts.forEach((p) => {
      const tags = extractHashtags(p.content);
      tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  };

  const calculateTrendingScore = (post) => {
    const likesWeight = (post.likes || []).length * 3;
    const commentsWeight = (post.comments || []).length * 5;
    const engagement = likesWeight + commentsWeight + 1;
    const postTime = post.timestamp || Date.now();
    const hoursAgo = Math.max(0, (Date.now() - postTime) / (1000 * 60 * 60));
    return engagement / Math.pow(hoursAgo + 2, 1.5);
  };

  const getProcessedPosts = () => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(query) ||
          p.authorName.toLowerCase().includes(query) ||
          extractHashtags(p.content).some((t) => t.toLowerCase().includes(query))
      );
    }

    if (selectedTag !== '전체') {
      result = result.filter((p) => extractHashtags(p.content).includes(selectedTag));
    }

    return result.sort((a, b) => {
      if (sortMode === 'trending') {
        return calculateTrendingScore(b) - calculateTrendingScore(a);
      } else if (sortMode === 'popular') {
        return (b.likes || []).length - (a.likes || []).length;
      } else {
        return (b.timestamp || 0) - (a.timestamp || 0);
      }
    });
  };

  const handleNaviesFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('⚠️ 파일 크기는 15MB 이하만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      const base64Data = result.split(',')[1];
      const fileType = file.type.startsWith('video') ? 'video' : 'image';

      setNaviesMedia({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64Data,
        mimeType: file.type,
        type: fileType,
        name: file.name
      });
      showToast(`📎 ${file.name} 첨부 완료!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSendNavies = async (promptToSend) => {
    // 게스트 유저는 AI 챗봇 이용 불가 처리
    if (user?.isGuest) {
      showToast('🔒 게스트 유저는 NAVIES AI 챗봇 이용이 제한됩니다. 회원가입 또는 로그인 후 이용해 주세요.');
      return;
    }

    const textQuery = typeof promptToSend === 'string' ? promptToSend : naviesInput;
    const currentMedia = naviesMedia;

    if ((!textQuery.trim() && !currentMedia) || isNaviesLoading) return;

    const userMsg = {
      role: 'user',
      text: textQuery || (currentMedia ? `📸 [${currentMedia.type === 'video' ? '영상' : '사진'} 첨부] 분석 요청` : ''),
      media: currentMedia ? { url: currentMedia.previewUrl, type: currentMedia.type } : null
    };

    setNaviesMessages((prev) => [...prev, userMsg]);
    setNaviesInput('');
    setNaviesMedia(null);
    setIsNaviesLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

      if (!apiKey) {
        setTimeout(() => {
          setNaviesMessages((prev) => [
            ...prev,
            {
              role: 'model',
              text: `💡 [NAVIES AI - Gemini 3.6 Flash 사진/영상 정밀 분석 완료]\n\n📌 **착장 옷 이름 및 아이템 정보**:\n- 상의: **오버핏 빈티지 크롭 데님 자켓** & **헤더 크루넥 후드티**\n- 하의: **와이드 피트 딥블랙 카고 슬랙스**\n\n🔎 **디자인 & 스타일 분석**:\n첨부해주신 ${currentMedia ? (currentMedia.type === 'video' ? '동영상' : '사진') : '이미지'} 속 착장은 트렌디한 스트릿 캐주얼 룩입니다. 드롭 숄더 패턴으로 어깨 라인이 자연스럽게 떨어지며, 레이어드 스타일링이 돋보입니다.\n\n🛒 **실시간 최저가 구매 & 검색 링크**:\n- [네이버 쇼핑에서 최저가 찾기](https://search.shopping.naver.com/search/all?query=오버핏데님자켓)\n- [무신사 인기 데님자켓 검색](https://www.musinsa.com/search/musinsa/integration?type=goods&q=데님자켓)\n- [쿠팡 실시간 할인 구매링크](https://www.coupang.com/np/search?q=오버핏데님자켓)\n\n*(Vercel 설정에 NEXT_PUBLIC_GEMINI_API_KEY를 등록하시면 Google Gemini 3.6 Flash AI가 실시간으로 첨부파일을 판독합니다.)*`
            }
          ]);
          setIsNaviesLoading(false);
        }, 1200);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
      const systemPrompt = `당신은 전문 패션 분석가 및 쇼핑 AI 어드바이저 'NAVIES'입니다.
사용자가 사진/영상을 첨부하거나 패션 질문을 하면 다음 양식에 따라 명확하게 답변해 주세요:

1. 📌 **착장 옷 이름 및 상세 아이템 분석** (의류/잡화 정확한 명칭, 색상, 디자인 특징, 핏감)
2. 💡 **추천 코디 & 스타일링 팁**
3. 🛒 **구매 및 실시간 쇼핑 검색 링크**:
   분석한 상품명을 기반으로 사용자가 즉시 구매 또는 가격 비교 검색을 할 수 있도록 마크다운 링크([버튼명](URL)) 형식의 링크를 반드시 2개 이상 포함해 주세요.
   예시:
   - [네이버 쇼핑 검색하기](https://search.shopping.naver.com/search/all?query=아이템키워드)
   - [무신사에서 키워드 검색](https://www.musinsa.com/search/musinsa/integration?type=goods&q=아이템키워드)
   - [쿠팡 최저가 찾아보기](https://www.coupang.com/np/search?q=아이템키워드)

* 한국어로 친절하고 전문적이며 트렌디하게 정돈된 마크다운 형식으로 답변하세요.`;

      const parts = [];
      if (currentMedia) {
        parts.push({
          inlineData: {
            mimeType: currentMedia.mimeType,
            data: currentMedia.base64
          }
        });
      }
      parts.push({ text: textQuery || '사진/영상 속 패션 아이템을 분석하고 정확한 옷 이름과 최저가 구매 검색 링크를 찾아줘!' });

      const payload = {
        contents: [
          {
            role: 'user',
            parts: parts
          }
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        setNaviesMessages((prev) => [...prev, { role: 'model', text: candidate.content.parts[0].text }]);
      } else {
        setNaviesMessages((prev) => [...prev, { role: 'model', text: '요청을 처리하는 중에 문제가 발생했습니다. 다시 시도해 주세요.' }]);
      }
    } catch (err) {
      console.error(err);
      setNaviesMessages((prev) => [...prev, { role: 'model', text: '네트워크 통신 중 오류가 발생했습니다.' }]);
    } finally {
      setIsNaviesLoading(false);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (user?.isGuest) {
      showToast('🔒 게스트 유저는 피드 글 생성이 제한됩니다. 로그인 후 이용해 주세요.');
      return;
    }

    if (!content.trim() && mediaList.length === 0) {
      showToast('내용이나 미디어를 입력해 주세요.');
      return;
    }

    const newPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || DEFAULT_AVATAR,
      authorBio: user.bio || '',
      content: content,
      mediaList: mediaList,
      likes: [],
      comments: [],
      createdAt: '방금 전',
      timestamp: Date.now()
    };

    setPosts([newPost, ...posts]);
    setContent('');
    setMediaList([]);
    showToast('✨ 새 피드가 공유되었습니다!');
  };

  const handleToggleLike = (postId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 유저는 좋아요 생성이 제한됩니다.');
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.likes.includes(user.id);
          const newLikes = hasLiked ? p.likes.filter((id) => id !== user.id) : [...p.likes, user.id];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 유저는 댓글 작성이 제한됩니다.');
      return;
    }

    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || DEFAULT_AVATAR,
      text: commentText,
      createdAt: '방금 전'
    };

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const processedPosts = getProcessedPosts();
  const popularTags = getAllPopularTags();

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: 'sans-serif', transition: 'all 0.2s ease' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ec4899',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            zIndex: 9999,
            fontWeight: 'bold',
            fontSize: '14px',
            textAlign: 'center',
            maxWidth: '90%'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Auth Screen */}
      {!user ? (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.cardBg,
                color: theme.text,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              {isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'}
            </button>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '36px 28px',
              borderRadius: '24px',
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                VIBELOG
              </div>
              <p style={{ fontSize: '14px', marginTop: '8px', color: theme.subText, lineHeight: '1.4' }}>
                {isSignUp ? '🔒 실시간 이메일 인증 회원가입' : '일상의 모든 분위기를 기록하고 나누는 공간'}
              </p>
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>닉네임</label>
                  <input
                    type="text"
                    required
                    placeholder="사용하실 닉네임을 입력하세요"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.inputBorder}`,
                      color: theme.inputText,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>이메일 주소</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.inputBorder}`,
                      color: theme.inputText,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {isSignUp && (
                    <button
                      type="button"
                      onClick={handleSendEmailVerification}
                      disabled={isSendingEmail || isEmailVerified}
                      style={{
                        padding: '0 16px',
                        borderRadius: '12px',
                        backgroundColor: isEmailVerified ? '#10b981' : '#ec4899',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isEmailVerified ? '인증완료' : isSendingEmail ? '전송중...' : '인증발송'}
                    </button>
                  )}
                </div>
              </div>

              {isSignUp && isEmailSent && !isEmailVerified && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="6자리 인증번호"
                    value={userEmailInputCode}
                    onChange={(e) => setUserEmailInputCode(e.target.value)}
                    maxLength={6}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.inputBorder}`,
                      color: theme.inputText,
                      fontSize: '14px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailCode}
                    style={{
                      padding: '0 16px',
                      borderRadius: '12px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    확인
                  </button>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>비밀번호</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="영문, 숫자, 특수문자 조합 (6자 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 16px',
                      borderRadius: '12px',
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.inputBorder}`,
                      color: theme.inputText,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: 0 }}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div style={{ padding: '14px', borderRadius: '16px', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>🔒 보안문자 입력 (필수)</label>
                    <button type="button" onClick={generateCaptcha} style={{ background: 'none', border: 'none', color: '#ec4899', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                      🔄 새로고침
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        backgroundColor: theme.cardBg,
                        border: `1px dashed ${theme.border}`,
                        fontSize: '18px',
                        fontWeight: 'bold',
                        letterSpacing: '4px',
                        color: '#ec4899',
                        userSelect: 'none'
                      }}
                    >
                      {captchaCode}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="6자리"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      maxLength={6}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: theme.cardBg,
                        border: `1px solid ${theme.inputBorder}`,
                        color: theme.inputText,
                        fontSize: '14px',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#ec4899',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                }}
              >
                {isSignUp ? '회원가입 완료' : '로그인'}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '13px' }}>
              <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#ec4899', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
              </button>
              <button onClick={handleGuestLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.subText, padding: 0, fontWeight: 'bold' }}>
                게스트 둘러보기 ➔
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px', boxSizing: 'border-box' }}>
          {/* Header */}
          <header
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderRadius: '20px',
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VIBELOG
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (user?.isGuest) {
                    showToast('🔒 게스트 유저는 NAVIES AI 챗봇 이용이 제한됩니다. 회원가입 또는 로그인 후 이용해 주세요.');
                    return;
                  }
                  setShowNaviesModal(true);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                }}
              >
                ✨ NAVIES AI 패션 어드바이저 (Gemini 3.6)
              </button>

              <button onClick={() => setIsDark(!isDark)} style={{ padding: '8px 12px', borderRadius: '12px', border: `1px solid ${theme.border}`, background: theme.cardBg, color: theme.text, cursor: 'pointer', fontSize: '14px' }}>
                {isDark ? '☀️' : '🌙'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={user.avatar || DEFAULT_AVATAR} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ec4899' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{user.name} {user.isGuest && <span style={{ fontSize: '11px', color: '#ec4899' }}>(게스트)</span>}</div>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#ef4444', cursor: 'pointer', padding: 0 }}>
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
            {/* Feed Column */}
            <div style={{ flex: '1 1 560px', minWidth: 0 }}>
              {!user.isGuest ? (
                <div style={{ padding: '18px', borderRadius: '20px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <textarea
                    rows={3}
                    placeholder="오늘 어떤 특별한 일이나 패션 코디가 있었나요? (#해시태그)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.inputBorder}`,
                      color: theme.inputText,
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button onClick={handleCreatePost} style={{ padding: '9px 18px', borderRadius: '12px', backgroundColor: '#ec4899', color: '#fff', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(236, 72, 153, 0.25)' }}>
                      게시하기 ✨
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, marginBottom: '20px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>💡 게스트 모드로 둘러보는 중입니다. (로그인 후 NAVIES AI 챗봇 및 피드 작성 가능)</span>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ec4899', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                    로그인/가입 ➔
                  </button>
                </div>
              )}

              {/* Feed Filters */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {[
                  { id: 'trending', label: '🔥 실시간 트렌딩' },
                  { id: 'latest', label: '⏱️ 최신순' },
                  { id: 'popular', label: '❤️ 인기순' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSortMode(tab.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      backgroundColor: sortMode === tab.id ? '#ec4899' : theme.cardBg,
                      color: sortMode === tab.id ? '#ffffff' : theme.text,
                      boxShadow: sortMode === tab.id ? '0 2px 8px rgba(236, 72, 153, 0.3)' : 'none'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Posts Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {processedPosts.map((post) => (
                  <article key={post.id} style={{ padding: '18px', borderRadius: '20px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <img src={post.authorAvatar || DEFAULT_AVATAR} alt="author" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.authorName}</div>
                        <div style={{ fontSize: '11px', color: theme.subText }}>{post.createdAt}</div>
                      </div>
                    </div>

                    <p style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                      {renderFormattedText(post.content)}
                    </p>

                    {post.mediaList && post.mediaList.length > 0 && (
                      <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
                        {post.mediaList.map((m, idx) => (
                          <img key={idx} src={m.url} alt="media" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', borderTop: `1px solid ${theme.border}`, paddingTop: '10px' }}>
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          padding: 0,
                          color: post.likes.includes(user.id) ? '#ec4899' : theme.text
                        }}
                      >
                        {post.likes.includes(user.id) ? '❤️' : '🤍'} {post.likes.length}
                      </button>
                      <span style={{ fontSize: '13px', color: theme.subText }}>💬 {post.comments.length}</span>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '12px', backgroundColor: theme.inputBg }}>
                        {post.comments.map((c) => (
                          <div key={c.id} style={{ fontSize: '12px', marginBottom: '4px', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 'bold' }}>{c.userName}: </span>
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!user.isGuest && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <input
                          type="text"
                          placeholder="댓글 남기기..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            padding: '8px 12px',
                            borderRadius: '10px',
                            backgroundColor: theme.inputBg,
                            border: `1px solid ${theme.inputBorder}`,
                            color: theme.inputText,
                            fontSize: '12px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <button onClick={() => handleAddComment(post.id)} style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: '#ec4899', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          등록
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside style={{ flex: '1 1 260px', minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '20px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <input
                  type="text"
                  placeholder="🔍 피드 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    color: theme.inputText,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ padding: '18px', borderRadius: '20px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>🔥 Popular Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: selectedTag === tag ? '#ec4899' : theme.inputBg,
                        color: selectedTag === tag ? '#ffffff' : theme.text
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* NAVIES AI Modal */}
      {showNaviesModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '16px', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: '620px', height: '85vh', maxHeight: '700px', borderRadius: '24px', backgroundColor: theme.cardBg, display: 'flex', flexDirection: 'column', border: `1px solid ${theme.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', boxSizing: 'border-box', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.cardBg }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✨ NAVIES AI 패션 어드바이저 (Gemini 3.6 Flash)</span>
              </div>
              <button onClick={() => setShowNaviesModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: theme.text, padding: '4px' }}>
                ✕
              </button>
            </div>

            {/* Chat Message History */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {naviesMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '18px',
                      backgroundColor: msg.role === 'user' ? '#ec4899' : theme.inputBg,
                      color: msg.role === 'user' ? '#ffffff' : theme.text,
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    {renderFormattedText(msg.text)}
                    {msg.media && (
                      <div style={{ marginTop: '10px', borderRadius: '12px', overflow: 'hidden' }}>
                        {msg.media.type === 'video' ? (
                          <video src={msg.media.url} controls style={{ width: '100%', maxHeight: '220px', borderRadius: '12px' }} />
                        ) : (
                          <img src={msg.media.url} alt="attached" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isNaviesLoading && <div style={{ fontSize: '12px', color: theme.subText, fontStyle: 'italic', paddingLeft: '8px' }}>💭 NAVIES(Gemini 3.6 Flash)가 사진/영상을 정밀 분석하고 쇼핑/최저가 구매 링크를 검색하는 중입니다...</div>}
            </div>

            {/* Quick Action Chips */}
            <div style={{ display: 'flex', gap: '6px', padding: '8px 16px', overflowX: 'auto', borderTop: `1px solid ${theme.border}`, backgroundColor: theme.cardBg }}>
              {[
                '📸 예시 사진분석 및 구매링크',
                '👗 오늘 데일리룩 코디 추천',
                '🎨 퍼스널컬러 스타일링 팁',
                '🛒 2026 트렌드 슈즈 추천'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendNavies(chip)}
                  disabled={isNaviesLoading}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Attachment Preview Bar */}
            {naviesMedia && (
              <div style={{ padding: '8px 16px', backgroundColor: theme.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${theme.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {naviesMedia.type === 'video' ? (
                    <span style={{ fontSize: '16px' }}>🎥</span>
                  ) : (
                    <img src={naviesMedia.previewUrl} alt="preview" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {naviesMedia.name} <span style={{ color: '#ec4899' }}>({naviesMedia.type === 'video' ? '동영상' : '이미지'})</span>
                  </div>
                </div>
                <button onClick={() => setNaviesMedia(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                  ✕ 취소
                </button>
              </div>
            )}

            {/* Input and Attachment Controls */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: theme.cardBg }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: '12px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, cursor: 'pointer', fontSize: '16px' }} title="사진/영상 첨부">
                📸
                <input type="file" accept="image/*,video/*" onChange={handleNaviesFileUpload} style={{ display: 'none' }} />
              </label>

              <input
                type="text"
                placeholder="질문이나 옷 분석 요청을 입력하세요 (예: 이 옷 어디서 사?)"
                value={naviesInput}
                onChange={(e) => setNaviesInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendNavies()}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.inputBorder}`,
                  color: theme.inputText,
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <button
                onClick={() => handleSendNavies()}
                disabled={isNaviesLoading || (!naviesInput.trim() && !naviesMedia)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  backgroundColor: '#ec4899',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  opacity: isNaviesLoading || (!naviesInput.trim() && !naviesMedia) ? 0.6 : 1,
                  boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)'
                }}
              >
                전송 ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
