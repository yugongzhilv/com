(function () {
  'use strict';

  // ---------- 轮播图 ----------
  var slides = document.querySelectorAll('.hero .slide');
  var dotsContainer = document.querySelector('.hero .carousel-dots');
  var currentSlide = 0;
  var slideInterval;

  var dotInactiveSrc, dotActiveSrc, useDotUrlIcons;
  function goToSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === currentSlide);
    });
    var dots = dotsContainer && dotsContainer.querySelectorAll('.dot');
    if (dots) {
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentSlide);
        var img = d.querySelector('.dot-icon-img');
        if (img && useDotUrlIcons && dotInactiveSrc && dotActiveSrc) img.src = i === currentSlide ? dotActiveSrc : dotInactiveSrc;
      });
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (slides.length && dotsContainer) {
    var dotIcon = dotsContainer.getAttribute('data-dot-icon') || '';
    var dotIconActive = dotsContainer.getAttribute('data-dot-icon-active') || '';
    var defaultInactive = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="white" opacity="0.5"/></svg>');
    var defaultActive = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="white"/></svg>');
    dotInactiveSrc = dotIcon || defaultInactive;
    dotActiveSrc = dotIconActive || defaultActive;
    useDotUrlIcons = !!(dotIcon || dotIconActive);
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', '第' + (i + 1) + '张');
      var img = document.createElement('img');
      img.src = i === 0 ? dotActiveSrc : dotInactiveSrc;
      img.alt = '';
      img.className = 'dot-icon-img';
      dot.appendChild(img);
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsContainer.appendChild(dot);
    });
    document.querySelector('.hero .carousel-btn.next').addEventListener('click', nextSlide);
    document.querySelector('.hero .carousel-btn.prev').addEventListener('click', prevSlide);
    slideInterval = setInterval(nextSlide, 5000);
  }

  // ---------- 锚点跳转：滚动到内容标题居中 ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var titleEl = target.querySelector('.section-title') || target.querySelector('h2') || target.querySelector('h1') || target;
    var rect = titleEl.getBoundingClientRect();
    var currentScroll = window.scrollY || window.pageYOffset;
    var elementCenterY = currentScroll + rect.top + rect.height / 2;
    var viewportHalf = window.innerHeight / 2;
    var targetScroll = elementCenterY - viewportHalf;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    else location.hash = id;
  });

  // ---------- 济源特产：点击随机跳转指定淘宝商品链接 ----------
  var taobaoRandomLinks = [
    'https://item.taobao.com/item.htm?id=1020138422690&mi_id=0000wu0zFCa_kk2EnVlXEYLKKWI49r2JV9lW0MO66oe0cmE&spm=a21xtw.29178619.0.0&xxc=shop',
    'https://item.taobao.com/item.htm?id=1021229637317&mi_id=0000hbuiDnImgB6IlpULSdIOQWaxhJN4BeXtK5zmZyZ9nGg&spm=a21xtw.29178619.0.0&xxc=shop',
    'https://item.taobao.com/item.htm?id=1022010168148&mi_id=0000-dJgjV963-Rnl7qlACqGyA5gFomeMAj0ftskpi7uV7E&spm=a21xtw.29178619.0.0&xxc=shop'
  ];
  document.querySelectorAll('.taobao-random').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var url = taobaoRandomLinks[Math.floor(Math.random() * taobaoRandomLinks.length)];
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  // ---------- 热销/文创横向滚动（支持多个轮播） ----------
  document.querySelectorAll('.featured-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.feat-track');
    var prevBtn = carousel.querySelector('.feat-btn.prev');
    var nextBtn = carousel.querySelector('.feat-btn.next');
    if (track && prevBtn) prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -220, behavior: 'smooth' });
    });
    if (track && nextBtn) nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: 220, behavior: 'smooth' });
    });
  });

  // ---------- 淘宝店铺跳转（店铺未建好：显示提示弹窗） ----------
  var taobaoModal = document.getElementById('taobao-modal');
  var closeTaobaoModal = document.getElementById('close-taobao-modal');

  function openTaobaoModal() {
    if (taobaoModal) {
      taobaoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeTaobaoModalFn() {
    if (taobaoModal) {
      taobaoModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('a[href="#taobao"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openTaobaoModal();
    });
  });

  if (closeTaobaoModal) closeTaobaoModal.addEventListener('click', closeTaobaoModalFn);
  if (taobaoModal) {
    taobaoModal.addEventListener('click', function (e) {
      if (e.target === taobaoModal) closeTaobaoModalFn();
    });
  }

  // ---------- AI 智能咨询 ----------
  var aiWidget = document.getElementById('ai-chat-widget');
  var aiMessages = document.getElementById('ai-messages');
  var aiForm = document.getElementById('ai-chat-form');
  var aiInput = document.getElementById('ai-input');
  var openAiChat = document.getElementById('open-ai-chat');
  var quickAi = document.getElementById('quick-ai');
  var footerAi = document.getElementById('footer-ai');
  var closeAiChat = document.getElementById('close-ai-chat');
  var aiFab = document.getElementById('ai-fab');

  function openAiWidget() {
    if (aiWidget) {
      aiWidget.setAttribute('aria-hidden', 'false');
      if (aiInput) aiInput.focus();
    }
  }

  function closeAiWidget() {
    if (aiWidget) aiWidget.setAttribute('aria-hidden', 'true');
  }

  [openAiChat, quickAi, footerAi, aiFab].forEach(function (el) {
    if (el) el.addEventListener('click', function (e) {
      e.preventDefault();
      openAiWidget();
    });
  });

  if (closeAiChat) closeAiChat.addEventListener('click', closeAiWidget);

  // 简单本地 AI：根据关键词回复预算、房间、游玩、当地等问题
  function getAiReply(text) {
    var t = (text || '').toLowerCase().replace(/\s/g, '');
    var budget = /预算|多少钱|花费|价格|人均|一人|两人|三人|四人|五人|几天|两天|三天|一日|两日/.test(t);
    var room = /房间|住宿|酒店|民宿|住哪|订房|几人住/.test(t);
    var travel = /游玩|行程|安排|路线|景点|推荐|怎么玩|玩什么/.test(t);
    var local = /当地|王屋|附近|哪里|有什么|好吃|美食/.test(t);

    if (budget) {
      return '关于预算：王屋一带两日游人均约 400–800 元（含住宿、餐饮、门票）。三人两天建议预留 1500–2500 元；五人两天约 2500–4000 元。具体可结合您选的住宿档次和是否购买特产调整。需要我帮您按人数和天数细算吗？';
    }
    if (room) {
      return '住宿方面：当地有民宿、农家乐和快捷酒店。民宿约 150–350 元/晚，标间为主，部分带院子和农家菜。如需多间或家庭房，建议提前联系店家。需要我按「几人、几晚」帮您推荐房型吗？';
    }
    if (travel) {
      return '游玩安排建议：第一天可走王屋山主景区（愚公移山传说）+ 阳台宫；第二天可安排小沟背或黄河三峡等。夏秋季节最宜，记得穿舒适鞋、带防晒。需要我根据您的人数、天数排一个具体行程表吗？';
    }
    if (local) {
      return '当地特色：王屋山一带可体验山水、道教文化和愚公文化；特产有核桃、柿子、土蜂蜜、中药材等，可在景区或镇上购买。美食以农家菜为主，如土鸡、野菜、手擀面。更多好物可到我们淘宝店铺挑选（店铺即将上线）。';
    }
    if (/你好|在吗|客服|帮助/.test(t)) {
      return '您好！我是智绘王屋的 AI 助手。您可以问我：当地游玩安排、几人几天预算、住宿房间推荐、行程规划等。也可以直接说「预算」「房间」「游玩」等关键词。';
    }
    return '您可以问我：几人几天预算、住宿房间推荐、当地游玩安排、行程规划或特产美食。例如：「3人两天预算多少？」「有什么住宿推荐？」';
  }

  function appendMessage(isUser, content) {
    if (!aiMessages) return;
    var div = document.createElement('div');
    div.className = 'ai-msg ' + (isUser ? 'user' : 'bot');
    var p = document.createElement('p');
    p.textContent = content;
    div.appendChild(p);
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  if (aiForm && aiInput) {
    aiForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var question = (aiInput.value || '').trim();
      if (!question) return;
      aiInput.value = '';
      appendMessage(true, question);
      var reply = getAiReply(question);
      setTimeout(function () {
        appendMessage(false, reply);
      }, 400);
    });
  }
})();
