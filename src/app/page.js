'use client';

import React, { useState, useEffect } from 'react';

// Default LEGO minifigure silhouette avatar
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

  // 보안문자 (CAPTCHA) 인증 state
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Sorting and filter state
  const [sortMode, setSortMode] = useState('trending'); // 'trending' | 'foryou' | 'latest' | 'popular'
  const [selectedTag, setSelectedTag] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  // NAVIES AI Chatbot state
  const [showNaviesModal, setShowNaviesModal] = useState(false);
  const [naviesMessages, setNaviesMessages] = useState([
    {
      role: 'model',
      text: '안녕하세요! 당신의 트렌디한 패션 어드바이저 NAVIES입니다. 👗✨\n오늘의 코디 추천뿐만 아니라 📸 **사진을 첨부하시면 구글 렌즈처럼 사진 속 옷과 패션 아이템을 인식**하여 제품 특징과 스타일 정보를 찾아드립니다!'
    }
  ]);
  const [naviesInput, setNaviesInput] = useState('');
  const [naviesImage, setNaviesImage] = useState(null);
  const [isNaviesLoading, setIsNaviesLoading] = useState(false);

  // Post creation state
  const [content, setContent] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  // Profile Edit Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  // Other User Profile Modal state
  const [viewUserProfile, setViewUserProfile] = useState(null);

  // 6자리 랜덤 보안문자 생성 함수 (혼동되는 문자 O, 0, I, 1 제외)
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
            padding: '5px 12px',
            borderRadius: '12px',
            backgroundColor: '#ec4899',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '12px',
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(236, 72, 153, 0.3)'
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

  const [posts, setPosts] = useState([
    {
      id: 'post_1',
      authorId: 'user_dev',
      authorName: '바이브로그 Official',
      authorAvatar: DEFAULT_AVATAR,
      authorBio: '공식 바이브로그 계정입니다. 일상의 모든 분위기를 나누세요 ✨',
      content: 'VIBELOG에 오신 것을 환영합니다! 🎉\n#VIBELOG #웰컴 #데일리룩 #OOTD\n\n- 스마트 1초 소셜 간편 가입 & 보안문자(CAPTCHA) 실시간 인증 지원!\n- 스마트 추천 알고리즘 정렬 지원\n- 미디어 첨부 및 AI 패션 어드바이저 NAVIES 지원',
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
          text: '프로필 사진을 클릭하여 사용자의 정보를 확인해보세요!',
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

    const gravity = 1.5;
    return engagement / Math.pow(hoursAgo + 2, gravity);
  };

  const calculatePersonalizedScore = (post, currentUser) => {
    if (!currentUser || currentUser.isGuest) return 0;

    const interactedPosts = posts.filter(
      (p) =>
        p.likes.includes(currentUser.id) ||
        p.comments.some((c) => c.userId === currentUser.id)
    );

    const userInterestTags = {};
    interactedPosts.forEach((p) => {
      const tags = extractHashtags(p.content);
      tags.forEach((tag) => {
        userInterestTags[tag] = (userInterestTags[tag] || 0) + 1;
      });
    });

    const postTags = extractHashtags(post.content);
    let matchPoints = 0;
    postTags.forEach((tag) => {
      if (userInterestTags[tag]) {
        matchPoints += userInterestTags[tag] * 20;
      }
    });

    const totalInteractions = Object.keys(userInterestTags).length || 1;
    return Math.min(100, Math.round((matchPoints / (totalInteractions * 20)) * 100));
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
      } else if (sortMode === 'foryou') {
        return calculatePersonalizedScore(b, user) - calculatePersonalizedScore(a, user);
      } else if (sortMode === 'popular') {
        const scoreA = (a.likes || []).length * 2 + (a.comments || []).length;
        const scoreB = (b.likes || []).length * 2 + (b.comments || []).length;
        return scoreB - scoreA;
      } else {
        return (b.timestamp || 0) - (a.timestamp || 0);
      }
    });
  };

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

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return '비밀번호는 최소 6자리 이상이어야 합니다.';
    }
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return '비밀번호는 영문자, 숫자, 특수문자(!@#$%^&* 등)를 모두 포함해야 합니다.';
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
        showToast('⚠️ 이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
        return;
      }

      // 보안문자 검증
      if (!captchaInput.trim() || captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
        showToast('⚠️ 보안문자가 일치하지 않습니다. 올바르게 입력해 주세요.');
        generateCaptcha();
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
      setIsSignUp(false);

      showToast(`🎉 회원가입이 완료되었습니다! 가입하신 정보로 로그인해주세요.`);
    } else {
      const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!foundUser) {
        showToast('❌ 등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.');
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
      bio: '읽기 전용 게스트 모드로 접속 중입니다.',
      avatar: DEFAULT_AVATAR,
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('vibelog_user', JSON.stringify(guestUser));
    showToast('게스트 모드로 접속했습니다. (읽기 전용)');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vibelog_user');
    showToast('성공적으로 로그아웃 되었습니다.');
  };

  const handleOpenNavies = () => {
    if (user?.isGuest) {
      showToast('🔒 NAVIES AI는 로그인 유저만 이용하실 수 있습니다.');
      return;
    }
    setShowNaviesModal(true);
  };

  const handleNaviesImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        const mimeType = file.type || 'image/jpeg';
        setNaviesImage({
          base64: base64Data,
          mimeType: mimeType,
          previewUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendNavies = async (promptToSend) => {
    const textQuery = promptToSend || naviesInput;
    const currentNaviesImage = naviesImage;

    if ((!textQuery.trim() && !currentNaviesImage) || isNaviesLoading) return;

    const userMsg = {
      role: 'user',
      text: textQuery || (currentNaviesImage ? '📸 이 사진 속 의류/패션 제품을 분석해줘!' : ''),
      image: currentNaviesImage?.previewUrl || null
    };

    setNaviesMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setNaviesInput('');
    setNaviesImage(null);
    setIsNaviesLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

      if (!apiKey) {
        setNaviesMessages((prev) => [
          ...prev,
          { role: 'model', text: '💡 [안내] Vercel 환경 변수에 NEXT_PUBLIC_GEMINI_API_KEY를 설정하시면 구글 Gemini AI 모델과 실시간으로 대화할 수 있습니다.' }
        ]);
        setIsNaviesLoading(false);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const systemPrompt = "당신은 구글 렌즈처럼 사진 속 의류, 패션 아이템 및 스타일을 정밀 분석하는 전문 패션 분석가 겸 스타일리스트 AI 'NAVIES'입니다.\n\n[주요 임무]\n1. 첨부된 사진 속 의류(상의, 하의, 신발, 아우터, 액세서리 등)의 디자인, 소재, 색상, 브랜드 스타일을 정밀 식별합니다.\n2. 구글 검색(Google Search Tool)을 적극 활용하여 사용자가 동일하거나 유사한 패션 아이템을 즉시 구매 및 비교 검색할 수 있도록 주요 쇼핑몰/웹사이트의 구매 링크 및 검색 정보를 탐색합니다.\n3. 답변 작성 시 구매나 검색이 가능한 사이트 링크가 발견되면 반드시 `[🛍️ 브랜드/상품명 쇼핑하기](https://링크주소)` 형식의 마크다운 링크로 명확히 작성해 주세요.\n4. 어울리는 추천 스타일링 팁과 퍼스널컬러 매칭 제안도 함께 제공해 주세요.";

      const contents = naviesMessages.slice(-6).map((m) => {
        const parts = [];
        if (m.text) parts.push({ text: m.text });
        return {
          role: m.role === 'model' ? 'model' : 'user',
          parts
        };
      });

      const currentUserParts = [];
      if (currentNaviesImage) {
        currentUserParts.push({
          inlineData: {
            mimeType: currentNaviesImage.mimeType,
            data: currentNaviesImage.base64
          }
        });
      }
      currentUserParts.push({
        text: textQuery || "사진 속에 있는 의류 및 패션 아이템을 인식해서 어떤 제품 스타일인지, 구매 가능한 정보나 유사 키워드와 추천 코디법을 알려주세요!"
      });

      contents.push({ role: 'user', parts: currentUserParts });

      const payload = {
        contents: contents,
        tools: [{ "google_search": {} }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        const replyText = candidate.content.parts[0].text;
        setNaviesMessages((prev) => [
          ...prev,
          { role: 'model', text: replyText }
        ]);
      } else {
        setNaviesMessages((prev) => [
          ...prev,
          { role: 'model', text: '죄송합니다. 요청을 처리하는 중에 문제가 발생했습니다. 다시 시도해 주세요.' }
        ]);
      }
    } catch (err) {
      console.error(err);
      setNaviesMessages((prev) => [
        ...prev,
        { role: 'model', text: '네트워크 통신 중 오류가 발생했습니다.' }
      ]);
    } finally {
      setIsNaviesLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const isVideo = file.type.startsWith('video');
        setMediaList((prev) => [
          ...prev,
          {
            url: reader.result,
            type: isVideo ? 'video' : 'image',
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (index) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (user?.isGuest) {
      showToast('🔒 게스트 유저는 글을 작성할 수 없습니다. 회원가입 후 이용해주세요!');
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
    showToast('✨ 새 피드가 성공적으로 공유되었습니다!');
  };

  const handleToggleLike = (postId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 유저는 좋아요를 누를 수 없습니다.');
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.likes.includes(user.id);
          const newLikes = hasLiked
            ? p.likes.filter((id) => id !== user.id)
            : [...p.likes, user.id];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 유저는 댓글을 작성할 수 없습니다.');
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

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('게시물이 삭제되었습니다.');
  };

  const handleOpenProfileModal = () => {
    if (user?.isGuest) {
      showToast('게스트 프로필은 수정할 수 없습니다.');
      return;
    }
    setEditName(user.name);
    setEditBio(user.bio || '');
    setEditAvatarUrl(user.avatar || '');
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('이름을 입력해주세요.');
      return;
    }

    const updatedUser = {
      ...user,
      name: editName.trim(),
      bio: editBio.trim(),
      avatar: editAvatarUrl.trim() || DEFAULT_AVATAR
    };

    setUser(updatedUser);
    localStorage.setItem('vibelog_user', JSON.stringify(updatedUser));

    const updatedRegistered = registeredUsers.map((u) =>
      u.id === user.id ? updatedUser : u
    );
    setRegisteredUsers(updatedRegistered);
    localStorage.setItem('vibelog_registered_users', JSON.stringify(updatedRegistered));

    setPosts((prev) =>
      prev.map((p) =>
        p.authorId === user.id
          ? {
              ...p,
              authorName: updatedUser.name,
              authorAvatar: updatedUser.avatar,
              authorBio: updatedUser.bio
            }
          : p
      )
    );

    setShowProfileModal(false);
    showToast('프로필 정보가 수정되었습니다!');
  };

  const themeClass = isDark
    ? 'bg-slate-950 text-slate-100 min-h-screen'
    : 'bg-slate-50 text-slate-800 min-h-screen';

  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-800';
  const subText = isDark ? 'text-slate-400' : 'text-slate-500';

  const processedPosts = getProcessedPosts();
  const popularTags = getAllPopularTags();

  return (
    <div className={themeClass} style={{ fontFamily: 'sans-serif' }}>
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: isDark ? '#3b82f6' : '#1d4ed8',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontWeight: 'bold',
            fontSize: '14px',
            textAlign: 'center',
            maxWidth: '90%',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          {toastMessage}
        </div>
      )}

      {!user ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className={cardBg} style={{ width: '100%', maxWidth: '440px', padding: '32px', borderRadius: '24px', borderWidth: '1px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                VIBELOG
              </div>
              <p style={{ fontSize: '14px', marginTop: '6px' }} className={subText}>
                {isSignUp ? '🔒 보안문자 실시간 인증 회원가입' : '일상의 분위기를 기록하고 소통하는 공간'}
              </p>
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>닉네임</label>
                  <input
                    type="text"
                    required
                    placeholder="사용하실 닉네임을 입력하세요"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    className={inputBg}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', borderWidth: '1px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>이메일 주소</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBg}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', borderWidth: '1px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>비밀번호</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="영문, 숫자, 특수문자 조합 (6자 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputBg}
                    style={{ width: '100%', padding: '12px 42px 12px 16px', borderRadius: '12px', borderWidth: '1px', fontSize: '14px', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* 보안문자 (CAPTCHA) 인증 영역 */}
              {isSignUp && (
                <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', marginTop: '4px', borderWidth: '1px', borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>🔒 보안문자 입력 (필수)</label>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      style={{ background: 'none', border: 'none', color: '#ec4899', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      🔄 새로고침
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Visual Security Text Display Box */}
                    <div
                      style={{
                        padding: '10px 16px',
                        borderRadius: '12px',
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        border: `1px dashed ${isDark ? '#475569' : '#cbd5e1'}`,
                        fontFamily: 'monospace, courier, sans-serif',
                        fontSize: '20px',
                        fontWeight: '900',
                        letterSpacing: '5px',
                        color: '#ec4899',
                        userSelect: 'none',
                        textDecoration: 'line-through',
                        fontStyle: 'italic',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '130px',
                        background: isDark
                          ? 'linear-gradient(45deg, #0f172a 25%, #1e293b 25%, #1e293b 50%, #0f172a 50%, #0f172a 75%, #1e293b 75%, #1e293b 100%)'
                          : 'linear-gradient(45deg, #f8fafc 25%, #e2e8f0 25%, #e2e8f0 50%, #f8fafc 50%, #f8fafc 75%, #e2e8f0 75%, #e2e8f0 100%)',
                        backgroundSize: '16px 16px'
                      }}
                    >
                      {captchaCode}
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="보안문자 6자리"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className={inputBg}
                      maxLength={6}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        borderWidth: '1px',
                        fontSize: '14px',
                        outline: 'none',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        textAlign: 'center'
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
                  marginTop: '10px',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                }}
              >
                {isSignUp ? '회원가입 완료' : '로그인'}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px' }}>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                }}
                style={{ background: 'none', border: 'none', color: '#ec4899', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
              </button>
              <button
                onClick={handleGuestLogin}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                className={subText}
              >
                게스트 모드로 구경하기 ➔
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '20px 16px' }}>
          {/* Header */}
          <header className={cardBg} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderRadius: '20px', borderWidth: '1px', marginBottom: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VIBELOG
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleOpenNavies}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
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
                <span>✨ NAVIES AI 어드바이저</span>
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                style={{ padding: '8px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'none', cursor: 'pointer', fontSize: '16px' }}
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '8px' }}>
                <img
                  src={user.avatar || DEFAULT_AVATAR}
                  alt="avatar"
                  onClick={handleOpenProfileModal}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: '2px solid #ec4899' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{user.name}</span>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '11px', color: '#ef4444', cursor: 'pointer', padding: 0 }}>
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px' }}>
            {/* Main Content Area */}
            <div>
              {/* Post Creation Box */}
              {!user.isGuest && (
                <div className={cardBg} style={{ padding: '20px', borderRadius: '20px', borderWidth: '1px', marginBottom: '24px' }}>
                  <textarea
                    rows={3}
                    placeholder="오늘 어떤 특별한 일이나 패션 코디가 있었나요? 분위기를 기록해보세요... (#해시태그)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={inputBg}
                    style={{ width: '100%', padding: '14px', borderRadius: '14px', borderWidth: '1px', fontSize: '14px', outline: 'none', resize: 'none' }}
                  />

                  {mediaList.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', margin: '12px 0' }}>
                      {mediaList.map((m, idx) => (
                        <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                          {m.type === 'image' ? (
                            <img src={m.url} alt="upload" style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover' }} />
                          ) : (
                            <video src={m.url} style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover' }} />
                          )}
                          <button
                            onClick={() => handleRemoveMedia(idx)}
                            style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', backgroundColor: isDark ? '#334155' : '#f1f5f9', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                      📷 사진/동영상 첨부
                      <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>

                    <button
                      onClick={handleCreatePost}
                      style={{ padding: '10px 20px', borderRadius: '12px', backgroundColor: '#ec4899', color: '#fff', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer' }}
                    >
                      게시하기 ✨
                    </button>
                  </div>
                </div>
              )}

              {/* Feed Filter & Sorting Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'trending', label: '🔥 실시간 트렌딩' },
                    { id: 'foryou', label: '🎯 맞춤 추천' },
                    { id: 'latest', label: '⏱️ 최신순' },
                    { id: 'popular', label: '❤️ 인기순' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSortMode(tab.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: sortMode === tab.id ? '#ec4899' : isDark ? '#1e293b' : '#e2e8f0',
                        color: sortMode === tab.id ? '#ffffff' : isDark ? '#cbd5e1' : '#475569'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {processedPosts.length === 0 ? (
                  <div className={cardBg} style={{ padding: '40px', textAlign: 'center', borderRadius: '20px', borderWidth: '1px' }}>
                    <p className={subText}>검색 결과나 해당 조건의 피드가 없습니다 😢</p>
                  </div>
                ) : (
                  processedPosts.map((post) => (
                    <article key={post.id} className={cardBg} style={{ padding: '20px', borderRadius: '20px', borderWidth: '1px' }}>
                      {/* Post Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setViewUserProfile(post)}>
                          <img src={post.authorAvatar || DEFAULT_AVATAR} alt="author" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{post.authorName}</div>
                            <div style={{ fontSize: '12px' }} className={subText}>{post.createdAt}</div>
                          </div>
                        </div>

                        {user.id === post.authorId && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}
                          >
                            삭제
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      <p style={{ whiteSpace: 'pre-line', fontSize: '15px', lineHeight: '1.6', marginBottom: '14px' }}>
                        {renderFormattedText(post.content)}
                      </p>

                      {/* Media */}
                      {post.mediaList && post.mediaList.length > 0 && (
                        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '14px', borderWidth: '1px' }}>
                          {post.mediaList.map((m, idx) => (
                            <div key={idx}>
                              {m.type === 'image' ? (
                                <img src={m.url} alt="media" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
                              ) : (
                                <video src={m.url} controls style={{ width: '100%', maxHeight: '500px' }} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`, paddingTop: '12px' }}>
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold', color: post.likes.includes(user.id) ? '#ec4899' : 'inherit' }}
                        >
                          {post.likes.includes(user.id) ? '❤️' : '🤍'} {post.likes.length}
                        </button>
                        <span style={{ fontSize: '14px' }} className={subText}>💬 {post.comments.length}</span>
                      </div>

                      {/* Comments List */}
                      {post.comments.length > 0 && (
                        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                          {post.comments.map((c) => (
                            <div key={c.id} style={{ fontSize: '13px' }}>
                              <span style={{ fontWeight: 'bold', marginRight: '6px' }}>{c.userName}:</span>
                              <span>{c.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      {!user.isGuest && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <input
                            type="text"
                            placeholder="댓글을 남겨보세요..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className={inputBg}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', borderWidth: '1px', fontSize: '13px', outline: 'none' }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: '#ec4899', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                          >
                            게시
                          </button>
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Search Box */}
              <div className={cardBg} style={{ padding: '16px', borderRadius: '20px', borderWidth: '1px' }}>
                <input
                  type="text"
                  placeholder="🔍 피드, 작성자, 태그 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={inputBg}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', borderWidth: '1px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              {/* Popular Hashtags */}
              <div className={cardBg} style={{ padding: '20px', borderRadius: '20px', borderWidth: '1px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>🔥 인기 해시태그</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedTag('전체')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedTag === '전체' ? '#ec4899' : isDark ? '#334155' : '#f1f5f9',
                      color: selectedTag === '전체' ? '#ffffff' : 'inherit'
                    }}
                  >
                    #전체
                  </button>
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
                        backgroundColor: selectedTag === tag ? '#ec4899' : isDark ? '#334155' : '#f1f5f9',
                        color: selectedTag === tag ? '#ffffff' : 'inherit'
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '16px' }}>
          <div className={cardBg} style={{ width: '100%', maxWidth: '600px', height: '650px', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>✨ NAVIES 패션 어드바이저</div>
              <button onClick={() => setShowNaviesModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {naviesMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  {msg.image && (
                    <img src={msg.image} alt="upload preview" style={{ width: '180px', borderRadius: '12px', marginBottom: '6px', border: '1px solid #cbd5e1' }} />
                  )}
                  <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: msg.role === 'user' ? '#ec4899' : isDark ? '#1e293b' : '#f1f5f9', color: msg.role === 'user' ? '#fff' : 'inherit', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                    {renderFormattedText(msg.text)}
                  </div>
                </div>
              ))}
              {isNaviesLoading && <div style={{ fontSize: '13px' }} className={subText}>💭 NAVIES가 사진과 스타일을 분석하는 중입니다...</div>}
            </div>

            <div style={{ padding: '16px', borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
              {naviesImage && (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                  <img src={naviesImage.previewUrl} alt="preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <button onClick={() => setNaviesImage(null)} style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer' }}>✕</button>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <label style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: isDark ? '#334155' : '#f1f5f9', cursor: 'pointer', fontSize: '16px' }}>
                  📷
                  <input type="file" accept="image/*" onChange={handleNaviesImageChange} style={{ display: 'none' }} />
                </label>
                <input
                  type="text"
                  placeholder="사진에 대한 질문이나 패션 코디를 물어보세요..."
                  value={naviesInput}
                  onChange={(e) => setNaviesInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendNavies()}
                  className={inputBg}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', borderWidth: '1px', fontSize: '13px', outline: 'none' }}
                />
                <button onClick={() => handleSendNavies()} style={{ padding: '10px 18px', borderRadius: '12px', backgroundColor: '#ec4899', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '16px' }}>
          <div className={cardBg} style={{ width: '100%', maxWidth: '420px', padding: '24px', borderRadius: '24px', borderWidth: '1px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>프로필 수정</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: subText }}>이름</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputBg}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', borderWidth: '1px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: subText }}>한줄 소개</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className={inputBg}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', borderWidth: '1px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: subText }}>프로필 이미지 URL</label>
                <input
                  type="text"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className={inputBg}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', borderWidth: '1px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowProfileModal(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'none', cursor: 'pointer' }}>취소</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#ec4899', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Profile View Modal */}
      {viewUserProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '16px' }}>
          <div className={cardBg} style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '24px', textAlign: 'center', borderWidth: '1px' }}>
            <img src={viewUserProfile.authorAvatar || DEFAULT_AVATAR} alt="user avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{viewUserProfile.authorName}</h3>
            <p style={{ fontSize: '13px', marginTop: '6px' }} className={subText}>{viewUserProfile.authorBio || '소개글이 없습니다.'}</p>
            <button onClick={() => setViewUserProfile(null)} style={{ marginTop: '20px', padding: '8px 20px', borderRadius: '10px', backgroundColor: '#ec4899', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
