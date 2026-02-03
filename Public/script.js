<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Active navigation link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Form date validation - set min date to today
  const dateInput = document.getElementById('preferred-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Form submission
  const appointmentForm = document.querySelector('.appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function (e) {
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      
      submitBtn.innerHTML = 'Sending... ⏳';
      submitBtn.disabled = true;

      setTimeout(() => {
        const confirmation = document.createElement('div');
        confirmation.style.cssText = `
          padding: 20px;
          margin: 20px 0;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 10px;
          color: #00f0ff;
          text-align: center;
          font-size: 1.1rem;
        `;
        confirmation.innerHTML = '✅ Thank you! Your appointment request has been sent. We\'ll contact you shortly.';
        appointmentForm.parentNode.insertBefore(confirmation, appointmentForm.nextSibling);
        
        appointmentForm.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        setTimeout(() => {
          confirmation.style.transition = 'opacity 0.3s ease';
          confirmation.style.opacity = '0';
          setTimeout(() => confirmation.remove(), 300);
        }, 5000);
      }, 500);
    });
  }

  // Scroll animations for service cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Contact cards animation
  document.querySelectorAll('.contact-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Chat widget functionality
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatNotification = document.querySelector('.chat-notification');

  const STORAGE_KEY = 'gooroo_chat_messages_v2';

  function openChat() {
    chatPanel.hidden = false;
    chatInput.focus();
    scrollToBottom();
    if (chatNotification) {
      chatNotification.style.display = 'none';
    }
  }

  function closeChat() {
    chatPanel.hidden = true;
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function renderMessages() {
    chatMessages.innerHTML = '';
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    messages.forEach(m => {
      const el = document.createElement('div');
      el.className = 'msg ' + (m.from === 'user' ? 'user' : 'bot');
      el.textContent = m.text;
      chatMessages.appendChild(el);
    });
    scrollToBottom();
  }

  function pushMessage(from, text) {
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    messages.push({ from, text, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    renderMessages();
  }

  function botReply(forText) {
    const lowered = forText.toLowerCase();

    if (/password|forgot|reset|login/i.test(lowered)) {
      return 'For password issues, use the "Forgot Password" link or contact support@gooroo.com. We\'ll help you reset it immediately.';
    }

    if (/wifi|internet|network|connection|slow/i.test(lowered)) {
      return 'Network troubleshooting: 1) Restart router/modem 2) Check cables 3) Run speed test. Need help? We can schedule a remote session!';
    }

    if (/backup|restore|data|recovery/i.test(lowered)) {
      return 'Data recovery is critical! Do you have a recent backup? We offer emergency recovery services. What\'s your situation?';
    }

    if (/camera|cctv|surveillance|video/i.test(lowered)) {
      return 'Camera issues? Check: 1) Power 2) Network 3) NVR/DVR status. Our technicians can visit on-site. Schedule an appointment?';
    }

    if (/appointment|schedule|book/i.test(lowered)) {
      return 'Great! You can book an appointment using the form on this page, or tell me your preferred date and I\'ll note it for our team.';
    }

    if (/price|pricing|cost|quote/i.test(lowered)) {
      return 'Our pricing varies by service. We offer free consultations to assess your needs. Would you like to schedule one?';
    }

    if (/(hi|hello|hey)/i.test(lowered) && lowered.length < 15) {
      return 'Hello! 👋 I\'m here to help with your IT needs. What can I assist you with today?';
    }

    return `I've noted: "${forText.substring(0, 50)}${forText.length > 50 ? '...' : ''}". A support specialist will follow up soon. Call (555) 123-4567 for immediate help!`;
  }

  chatToggle.addEventListener('click', () => {
    if (chatPanel.hidden) {
      openChat();
    } else {
      closeChat();
    }
  });

  chatClose.addEventListener('click', closeChat);

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    pushMessage('user', text);
    chatInput.value = '';

    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.textContent = '...';
    typing.style.opacity = '0.6';
    chatMessages.appendChild(typing);
    scrollToBottom();

    setTimeout(() => {
      chatMessages.removeChild(typing);
      const reply = botReply(text);
      pushMessage('bot', reply);
    }, 800 + Math.random() * 700);
  });

  // Initialize chat
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          from: 'bot',
          text: '👋 Welcome to Gooroo Support! How can I help you today?',
          timestamp: Date.now()
        }
      ])
    );
  }

  renderMessages();

  // Smooth scroll for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 70; // navbar height
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
=======
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;

  const confirmation = document.getElementById('confirmation');
  confirmation.textContent = `Thank you, ${name}. Your appointment for ${date} has been received!`;
  
  this.reset(); // Clear the form
});
>>>>>>> 80b2e887388b8f6d615bb965d154bdb09b1d64dc
