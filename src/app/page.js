'use client';

import React, { useState, useEffect } from 'react';

// Default LEGO minifigure silhouette avatar matching user request
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

  // --- 알고리즘 및 피드 정렬/필터링 상태 ---
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
  const [naviesImage, setNaviesImage] = useState(null); // { base64, mimeType, previewUrl }
  const [isNaviesLoading, setIsNaviesLoading] = useState(false);

  // Post creation state
  const [content, setContent] = useState('');
  const [mediaList, setMediaList] = useState([]); // array of { url, type, name }
  const [commentInputs, setCommentInputs] = useState({});

  // Profile Edit Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  // Other User Profile Modal state
  const [viewUserProfile, setViewUserProfile] = useState(null);

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
      content: 'VIBELOG에 오신 것을 환영합니다! 🎉\n#VIBELOG #웰컴 #데일리룩 #OOTD\n\n- 스마트 추천 알고리즘 정렬 지원\n- 상대방 프로필 클릭 시 상세 정보 보기\n- 미디어 첨부 지원',
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
    const score = engagement / Math.pow(hoursAgo + 2, gravity);
    return score;
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
    const matchPercentage = Math.min(100, Math.round((matchPoints / (totalInteractions * 20)) * 100));

    return matchPercentage;
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
        password: '1234',
        name: '바이브로그 Official',
        bio: '공식 바이브로그 계정입니다. 일상의 모든 분위기를 나누세요 ✨',
        avatar: DEFAULT_AVATAR
      },
      {
        id: 'user_fashion',
        email: 'fashion@vibelog.com',
        password: '1234',
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
    }, 3000);
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
      if (cleanPassword.length < 4) {
        showToast('비밀번호는 최소 4자 이상 입력해야 합니다.');
        return;
      }

      const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        showToast('이미 등록된 이메일입니다. 로그인해 주세요.');
        setIsSignUp(false);
        return;
      }

      const nameToUse = userNameInput.trim() || cleanEmail.split('@')[0];
      const newUser = {
        id: `user_${Date.now()}`,
        email: cleanEmail,
        password: cleanPassword,
        name: nameToUse,
        bio: '나만의 감성을 기록하는 공간입니다.',
        avatar: DEFAULT_AVATAR,
        isGuest: false
      };

      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('vibelog_registered_users', JSON.stringify(updatedUsers));

      setUser(newUser);
      localStorage.setItem('vibelog_user', JSON.stringify(newUser));
      showToast(`회원가입 완료! ${newUser.name}님 환영합니다 🎉`);
    } else {
      const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      
      if (!foundUser) {
        showToast('등록되지 않은 계정입니다. 회원가입을 먼저 진행해주세요.');
        return;
      }

      if (foundUser.password !== cleanPassword) {
        showToast('비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
        return;
      }

      const activeUser = { ...foundUser, isGuest: false };
      setUser(activeUser);
      localStorage.setItem('vibelog_user', JSON.stringify(activeUser));
      showToast(`로그인 성공! ${activeUser.name}님 환영합니다 ✨`);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === demoEmail.toLowerCase());
    if (foundUser) {
      const activeUser = { ...foundUser, isGuest: false };
      setUser(activeUser);
      localStorage.setItem('vibelog_user', JSON.stringify(activeUser));
      showToast(`${activeUser.name} 계정으로 로그인되었습니다!`);
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
      showToast('🔒 NAVIES AI는 회원가입 및 로그인 유저만 이용하실 수 있습니다.');
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
      // 환경변수에서 API 키를 읽어옵니다.
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      
      if (!apiKey) {
        setNaviesMessages((prev) => [
          ...prev,
          { role: 'model', text: '⚠️ API 키가 설정되지 않았습니다. Vercel 대시보드의 Settings -> Environment Variables에서 NEXT_PUBLIC_GEMINI_API_KEY 항목을 등록해주세요.' }
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
        let sources = [];
        const groundingMetadata = candidate.groundingMetadata;

        if (groundingMetadata && Array.isArray(groundingMetadata.groundingChunks)) {
          sources = groundingMetadata.groundingChunks
            .map(chunk => ({
              uri: chunk.web?.uri,
              title: chunk.web?.title || '쇼핑 및 검색 바로가기'
            }))
            .filter(source => source.uri);
        }

        if (sources.length === 0 && groundingMetadata && Array.isArray(groundingMetadata.groundingAttributions)) {
          sources = groundingMetadata.groundingAttributions
            .map(attribution => ({
              uri: attribution.web?.uri,
              title: attribution.web?.title || '구매 참고 정보'
            }))
            .filter(source => source.uri);
        }

        const uniqueSources = [];
        const seenUris = new Set();
        sources.forEach(src => {
          if (src.uri && !seenUris.has(src.uri)) {
            seenUris.add(src.uri);
            uniqueSources.push(src);
          }
        });

        setNaviesMessages((prev) => [
          ...prev,
          { role: 'model', text: replyText, sources: uniqueSources }
        ]);
      } else {
        setNaviesMessages((prev) => [
          ...prev,
          { role: 'model', text: '죄송합니다. 이미지를 분석하는 중 문제가 발생했습니다. 다시 시도해주세요.' }
        ]);
      }
    } catch (err) {
      console.error(err);
      setNaviesMessages((prev) => [
        ...prev,
        { role: 'model', text: '네트워크 통신 중 오류가 발생했습니다. 잠시 후 다시 이용해주세요.' }
      ]);
    } finally {
      setIsNaviesLoading(false);
    }
  };

  const openProfileModal = () => {
    if (user?.isGuest) {
      showToast('🔒 게스트 계정은 프로필을 편집할 수 없습니다.');
      return;
    }
    setEditName(user.name || '');
    setEditBio(user.bio || '');
    setEditAvatarUrl(user.avatar || DEFAULT_AVATAR);
    setShowProfileModal(true);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('닉네임을 입력해주세요.');
      return;
    }

    const updatedUser = {
      ...user,
      name: editName.trim(),
      bio: editBio.trim(),
      avatar: editAvatarUrl || DEFAULT_AVATAR
    };

    setUser(updatedUser);
    localStorage.setItem('vibelog_user', JSON.stringify(updatedUser));

    setPosts(prevPosts =>
      prevPosts.map(p => ({
        ...p,
        authorName: p.authorId === updatedUser.id ? updatedUser.name : p.authorName,
        authorAvatar: p.authorId === updatedUser.id ? updatedUser.avatar : p.authorAvatar,
        authorBio: p.authorId === updatedUser.id ? updatedUser.bio : p.authorBio,
        comments: p.comments.map(c =>
          c.userId === updatedUser.id
            ? { ...c, userName: updatedUser.name, userAvatar: updatedUser.avatar }
            : c
        )
      }))
    );

    setShowProfileModal(false);
    showToast('프로필 정보가 저장되었습니다!');
  };

  const handlePostFilesChange = (e) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 계정은 파일 첨부를 할 수 없습니다.');
      return;
    }
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (mediaList.length + files.length > 5) {
      showToast('최대 5개의 파일까지 첨부할 수 있습니다.');
      return;
    }

    files.forEach((file) => {
      let type = 'image';
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaList((prev) => [
          ...prev,
          { url: reader.result, type, name: file.name }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (user?.isGuest) {
      showToast('🔒 게스트 계정은 게시글 작성이 불가능합니다.');
      return;
    }
    if (!content.trim() && mediaList.length === 0) {
      showToast('내용이나 미디어 파일을 첨부해주세요.');
      return;
    }

    const newPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorBio: user.bio,
      content: content.trim(),
      mediaList: mediaList,
      likes: [],
      comments: [],
      createdAt: '방금 전',
      timestamp: Date.now()
    };

    setPosts([newPost, ...posts]);
    setContent('');
    setMediaList([]);
    showToast('게시글이 성공적으로 작성되었습니다!');
  };

  const handleDeletePost = (postId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 계정은 삭제 권한이 없습니다.');
      return;
    }

    setPosts((prev) => prev.filter((post) => post.id !== postId));
    showToast('게시글이 삭제되었습니다.');
  };

  const handleLike = (postId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 계정은 좋아요를 누를 수 없습니다.');
      return;
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(user.id);
          const newLikes = hasLiked
            ? post.likes.filter((id) => id !== user.id)
            : [...post.likes, user.id];
          return { ...post, likes: newLikes };
        }
        return post;
      })
    );
  };

  const handleCommentSubmit = (postId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 계정은 댓글을 남길 수 없습니다.');
      return;
    }

    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: commentText,
      createdAt: '방금 전'
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleDeleteComment = (postId, commentId) => {
    if (user?.isGuest) {
      showToast('🔒 게스트 계정은 삭제 권한이 없습니다.');
      return;
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter((c) => c.id !== commentId)
          };
        }
        return post;
      })
    );

    showToast('댓글이 삭제되었습니다.');
  };

  const openUserProfile = (authorId, authorName, authorAvatar, authorBio) => {
    setViewUserProfile({
      id: authorId,
      name: authorName,
      avatar: authorAvatar || DEFAULT_AVATAR,
      bio: authorBio || '등록된 한줄 소개가 없습니다.'
    });
  };

  const bg = isDark ? '#09090b' : '#f4f4f5';
  const cardBg = isDark ? '#18181b' : '#ffffff';
  const text = isDark ? '#f4f4f5' : '#09090b';
  const subText = isDark ? '#a1a1aa' : '#71717a';
  const borderStyle = isDark ? '1px solid #27272a' : '1px solid #e4e4e7';
  const inputBg = isDark ? '#27272a' : '#f4f4f5';

  const btnStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: borderStyle,
    backgroundColor: inputBg,
    color: text,
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'sans-serif' }}>
        {toastMessage && (
          <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#18181b', color: '#ffffff', padding: '10px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', zIndex: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {toastMessage}
          </div>
        )}

        <div style={{ backgroundColor: cardBg, border: borderStyle, borderRadius: '20px', padding: '32px 28px', width: '100%', maxWidth: '400px', boxShadow: '0 15px 35px rgba(0,0,0,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 6px 0', color: '#3b82f6' }}>✨ VIBELOG</h1>
            <p style={{ fontSize: '13px', color: subText, margin: 0 }}>
              {isSignUp ? '새 계정을 만들고 감성을 나누어보세요' : '일상의 감성을 공유하는 소셜 커뮤니티'}
            </p>
          </div>

          <div style={{ display: 'flex', backgroundColor: inputBg, borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setEmail(''); setPassword(''); }}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: !isSignUp ? cardBg : 'transparent', color: text, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: !isSignUp ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setEmail(''); setPassword(''); }}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: isSignUp ? cardBg : 'transparent', color: text, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: isSignUp ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isSignUp && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: subText, display: 'block', marginBottom: '4px' }}>닉네임 / 이름</label>
                <input
                  type="text"
                  placeholder="사용할 닉네임 (예: 감성스타일러)"
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: subText, display: 'block', marginBottom: '4px' }}>이메일 주소</label>
              <input
                type="email"
                placeholder="example@vibelog.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: subText, display: 'block', marginBottom: '4px' }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••• (4자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: subText }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" style={{ ...btnStyle, marginTop: '8px', padding: '12px', fontSize: '14px' }}>
              {isSignUp ? '✨ 새 계정 가입 완료' : '🚀 로그인'}
            </button>
          </form>

          {!isSignUp && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: borderStyle }}>
              <p style={{ fontSize: '11px', color: subText, fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>⚡ 원클릭 체험용 샘플 계정</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('official@vibelog.com', '1234')}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: borderStyle, backgroundColor: inputBg, color: text, fontSize: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>👑 공식 계정</span>
                  <span style={{ fontSize: '10px', color: subText }}>official@vibelog.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('fashion@vibelog.com', '1234')}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: borderStyle, backgroundColor: inputBg, color: text, fontSize: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>👗 패션 크리에이터 계정</span>
                  <span style={{ fontSize: '10px', color: subText }}>fashion@vibelog.com</span>
                </button>
              </div>
            </div>
          )}

          <div style={{ margin: '16px 0', height: '1px', backgroundColor: isDark ? '#27272a' : '#e4e4e7' }} />

          <button
            onClick={handleGuestLogin}
            style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            ⚡ 게스트 계정으로 즉시 탐색 (읽기 전용)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, fontFamily: 'sans-serif' }}>
      {toastMessage && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#18181b', color: '#ffffff', padding: '10px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', zIndex: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, backgroundColor: cardBg, borderBottom: borderStyle, zIndex: 10, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>✨ VIBELOG</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={user.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {user.name} {user.isGuest && <span style={{ color: '#ef4444', fontSize: '10px' }}>(게스트)</span>}
            </span>
          </div>

          <button
            onClick={openProfileModal}
            style={{ padding: '6px 12px', borderRadius: '6px', border: borderStyle, backgroundColor: 'transparent', color: text, fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            👤 내 프로필
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: borderStyle, backgroundColor: 'transparent', color: text, fontSize: '12px', cursor: 'pointer' }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button
            onClick={handleOpenNavies}
            style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)' }}
          >
            ✨ NAVIES
          </button>

          <button
            onClick={handleLogout}
            style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🚪 로그아웃
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Algorithm Control Bar */}
        <div style={{ backgroundColor: cardBg, border: borderStyle, borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="🔍 검색어 또는 #해시태그, 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '32px' }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '13px' }}>🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: subText, cursor: 'pointer', fontSize: '12px' }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'trending', label: '🔥 트렌딩', desc: '중력 감쇄 유행 정렬' },
              { id: 'foryou', label: '🎯 For You', desc: 'AI 사용자 맞춤 추천' },
              { id: 'latest', label: '⏰ 최신순', desc: '시간순 정렬' },
              { id: 'popular', label: '❤️ 인기순', desc: '반응 점수순' }
            ].map((tab) => {
              const active = sortMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSortMode(tab.id)}
                  title={tab.desc}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: active ? 'none' : borderStyle,
                    backgroundColor: active ? '#3b82f6' : inputBg,
                    color: active ? '#ffffff' : text,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: subText, fontWeight: 'bold', alignSelf: 'center' }}>태그:</span>
            <button
              onClick={() => setSelectedTag('전체')}
              style={{
                padding: '3px 8px',
                borderRadius: '12px',
                border: borderStyle,
                backgroundColor: selectedTag === '전체' ? text : 'transparent',
                color: selectedTag === '전체' ? cardBg : subText,
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              전체
            </button>
            {getAllPopularTags().map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? '전체' : tag)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    border: borderStyle,
                    backgroundColor: isSelected ? '#ec4899' : inputBg,
                    color: isSelected ? '#ffffff' : text,
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Creation Box */}
        <div style={{ backgroundColor: cardBg, border: borderStyle, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <form onSubmit={handleCreatePost}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <img src={user.avatar} alt="user" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              <textarea
                placeholder={user.isGuest ? '🔒 게스트 계정은 읽기 전용 모드입니다 (작성 불가)' : '오늘 어떤 특별한 감성을 느끼셨나요?'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={user.isGuest}
                style={{ ...inputStyle, minHeight: '60px', resize: 'none', opacity: user.isGuest ? 0.6 : 1 }}
              />
            </div>

            {mediaList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {mediaList.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', backgroundColor: inputBg, border: borderStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.type === 'image' && <img src={item.url} alt="media preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    {item.type === 'video' && <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    {item.type === 'audio' && <div style={{ fontSize: '24px' }}>🎵</div>}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', color: user.isGuest ? subText : '#3b82f6', cursor: user.isGuest ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                📁 미디어 첨부 (사진/영상/음성)
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handlePostFilesChange}
                  disabled={user.isGuest}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="submit"
                disabled={user.isGuest}
                style={{ ...btnStyle, opacity: user.isGuest ? 0.5 : 1, cursor: user.isGuest ? 'not-allowed' : 'pointer' }}
              >
                게시하기
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {getProcessedPosts().length === 0 ? (
            <div style={{ backgroundColor: cardBg, border: borderStyle, borderRadius: '12px', padding: '32px', textAlign: 'center', color: subText, fontSize: '13px' }}>
              🔍 검색 조건 및 선택된 태그와 일치하는 게시글물이 없습니다.
            </div>
          ) : (
            getProcessedPosts().map((post) => {
              const isLiked = post.likes.includes(user.id);

              return (
                <div key={post.id} style={{ backgroundColor: cardBg, border: borderStyle, borderRadius: '12px', padding: '16px' }}>
                  {/* Post Author Info & Delete Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div
                      onClick={() => openUserProfile(post.authorId, post.authorName, post.authorAvatar, post.authorBio)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                    >
                      <img src={post.authorAvatar} alt="author" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>{post.authorName}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: subText }}>{post.createdAt}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {!user.isGuest && post.authorId === user.id && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          ✕ 게시글 삭제
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  {post.content && <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 12px 0', whiteSpace: 'pre-line' }}>{post.content}</p>}

                  {/* Attached Media List */}
                  {post.mediaList && post.mediaList.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {post.mediaList.map((media, mIdx) => (
                        <div key={mIdx} style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: inputBg, border: borderStyle }}>
                          {media.type === 'image' && (
                            <img src={media.url} alt={media.name || 'media'} style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }} />
                          )}
                          {media.type === 'video' && (
                            <video src={media.url} controls style={{ width: '100%', maxHeight: '380px', display: 'block' }} />
                          )}
                          {media.type === 'audio' && (
                            <audio src={media.url} controls style={{ width: '100%', padding: '8px' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Like Button & Stats */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderTop: borderStyle, borderBottom: borderStyle, marginBottom: '12px' }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isLiked ? '#ef4444' : text,
                        cursor: user.isGuest ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isLiked ? '❤️' : '🤍'} {post.likes.length}
                    </button>
                    <span style={{ fontSize: '12px', color: subText }}>
                      💬 댓글 {post.comments.length}개
                    </span>
                  </div>

                  {/* Comments Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {post.comments.map((comment) => (
                      <div key={comment.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <img
                            src={comment.userAvatar}
                            alt="commenter"
                            onClick={() => openUserProfile(comment.userId, comment.userName, comment.userAvatar, '')}
                            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px', cursor: 'pointer' }}
                          />
                          <div>
                            <span
                              onClick={() => openUserProfile(comment.userId, comment.userName, comment.userAvatar, '')}
                              style={{ fontSize: '12px', fontWeight: 'bold', marginRight: '6px', cursor: 'pointer' }}
                            >
                              {comment.userName}
                            </span>
                            <span style={{ fontSize: '12px', color: text }}>{comment.text}</span>
                          </div>
                        </div>

                        {!user.isGuest && comment.userId === user.id && (
                          <button
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '8px' }}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder={user.isGuest ? '게스트는 댓글 작성이 제한됩니다' : '댓글 달기...'}
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                      disabled={user.isGuest}
                      style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', opacity: user.isGuest ? 0.6 : 1 }}
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={user.isGuest}
                      style={{ ...btnStyle, padding: '6px 12px', opacity: user.isGuest ? 0.5 : 1, cursor: user.isGuest ? 'not-allowed' : 'pointer' }}
                    >
                      게시
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: cardBg, color: text, border: borderStyle, borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '360px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>👤 내 프로필 편집</h2>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: subText, display: 'block', marginBottom: '4px' }}>닉네임</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: subText, display: 'block', marginBottom: '4px' }}>한줄 소개 (Bio)</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: subText, display: 'block', marginBottom: '6px' }}>프로필 이미지 첨부</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  style={{ fontSize: '12px', width: '100%' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                  <img src={editAvatarUrl} alt="preview" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: borderStyle }} />
                  {editAvatarUrl && editAvatarUrl !== DEFAULT_AVATAR && (
                    <button
                      type="button"
                      onClick={() => setEditAvatarUrl(DEFAULT_AVATAR)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      기본 이미지로 변경
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  style={{ flex: 1, padding: '10px', border: borderStyle, backgroundColor: 'transparent', color: text, borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', border: 'none', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Other User Profile Modal */}
      {viewUserProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: cardBg, color: text, border: borderStyle, borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <img src={viewUserProfile.avatar} alt="user avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: borderStyle }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{viewUserProfile.name}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: subText }}>{viewUserProfile.bio}</p>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: isDark ? '#27272a' : '#e4e4e7', margin: '16px 0' }} />

            <h4 style={{ fontSize: '13px', margin: '0 0 12px 0', color: subText }}>작성한 게시글</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {posts.filter((p) => p.authorId === viewUserProfile.id).length === 0 ? (
                <p style={{ fontSize: '12px', color: subText }}>작성된 게시글이 없습니다.</p>
              ) : (
                posts
                  .filter((p) => p.authorId === viewUserProfile.id)
                  .map((userPost) => (
                    <div key={userPost.id} style={{ backgroundColor: inputBg, padding: '10px', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '12px' }}>{userPost.content}</p>
                      <span style={{ fontSize: '10px', color: subText }}>{userPost.createdAt}</span>
                    </div>
                  ))
              )}
            </div>

            <button
              onClick={() => setViewUserProfile(null)}
              style={{ width: '100%', padding: '10px', border: borderStyle, backgroundColor: 'transparent', color: text, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', marginTop: '16px', fontWeight: 'bold' }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* NAVIES AI Chatbot Modal */}
      {showNaviesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '16px' }}>
          <div style={{ backgroundColor: cardBg, color: text, border: borderStyle, borderRadius: '20px', width: '100%', maxWidth: '520px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '16px 20px', borderBottom: borderStyle, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  👗
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>NAVIES AI 패션 분석가</h3>
                  <p style={{ margin: 0, fontSize: '11px', opacity: 0.9 }}>📸 의류 인식 (구글 렌즈) & 실시간 코디 컨설팅</p>
                </div>
              </div>
              <button
                onClick={() => setShowNaviesModal(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '10px 16px', borderBottom: borderStyle, backgroundColor: inputBg, display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
              {['📸 사진 속 옷 제품 찾기', '🔥 2026 트렌드 분석', '👔 출근룩 추천', '🎨 퍼스널컬러 매칭'].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (chip.includes('사진 속 옷')) {
                      document.getElementById('navies-image-upload-trigger')?.click();
                    } else {
                      handleSendNavies(chip);
                    }
                  }}
                  disabled={isNaviesLoading}
                  style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '16px', border: borderStyle, backgroundColor: cardBg, color: text, fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {naviesMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    backgroundColor: msg.role === 'user' ? '#3b82f6' : (isDark ? '#27272a' : '#f1f5f9'),
                    color: msg.role === 'user' ? '#ffffff' : text,
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="uploaded fashion"
                      style={{ width: '100%', maxHeight: '220px', borderRadius: '12px', objectFit: 'cover', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                  )}

                  <div>{renderFormattedText(msg.text)}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(150,150,150,0.2)', fontSize: '11px' }}>
                      <strong style={{ color: msg.role === 'user' ? '#e0f2fe' : '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        🛒 인식된 연관 상품 & 구매/검색 바로가기
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {msg.sources.map((src, sIdx) => {
                          let domain = '';
                          try {
                            domain = new URL(src.uri).hostname.replace('www.', '');
                          } catch (e) {
                            domain = '쇼핑 사이트';
                          }

                          return (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.15)' : (isDark ? '#18181b' : '#ffffff'),
                                border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.3)' : borderStyle,
                                color: msg.role === 'user' ? '#ffffff' : text,
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                                🛍️ {src.title}
                              </span>
                              <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#3b82f6', color: '#ffffff', fontWeight: 'bold', flexShrink: 0 }}>
                                {domain} ↗
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isNaviesLoading && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: isDark ? '#27272a' : '#f1f5f9', padding: '10px 16px', borderRadius: '18px', fontSize: '12px', color: subText, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔍 NAVIES가 사진 속 의류 제품 및 스타일을 인식 중입니다...</span>
                </div>
              )}
            </div>

            {naviesImage && (
              <div style={{ padding: '8px 16px', backgroundColor: inputBg, borderTop: borderStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={naviesImage.previewUrl} alt="attached target" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>📸 의류 인식용 사진이 첨부되었습니다</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNaviesImage(null)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  취소 ✕
                </button>
              </div>
            )}

            <div style={{ padding: '12px 16px', borderTop: borderStyle, backgroundColor: cardBg, display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label
                htmlFor="navies-image-upload-trigger"
                title="의류 사진 첨부"
                style={{ padding: '10px', borderRadius: '8px', border: borderStyle, backgroundColor: inputBg, color: text, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                📷
                <input
                  id="navies-image-upload-trigger"
                  type="file"
                  accept="image/*"
                  onChange={handleNaviesImageChange}
                  style={{ display: 'none' }}
                />
              </label>

              <input
                type="text"
                placeholder={naviesImage ? "사진에 대해 궁금한 점을 적거나 바로 전송하세요!" : "질문 입력 또는 📷 버튼을 눌러 사진을 첨부하세요..."}
                value={naviesInput}
                onChange={(e) => setNaviesInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendNavies()}
                disabled={isNaviesLoading}
                style={{ ...inputStyle, flex: 1, padding: '10px 14px' }}
              />

              <button
                onClick={() => handleSendNavies()}
                disabled={isNaviesLoading || (!naviesInput.trim() && !naviesImage)}
                style={{
                  ...btnStyle,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  padding: '10px 18px',
                  opacity: (isNaviesLoading || (!naviesInput.trim() && !naviesImage)) ? 0.5 : 1,
                  cursor: (isNaviesLoading || (!naviesInput.trim() && !naviesImage)) ? 'not-allowed' : 'pointer'
                }}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
