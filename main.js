// DOM Elements
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("back-to-top");
const calculateBtn = document.getElementById("calculate-btn");
const results = document.getElementById("results");

// Quiz Elements
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const progressFill = document.getElementById("progress-fill");
const questionContainer = document.getElementById("question-container");
const quizResult = document.getElementById("quiz-result");
const scoreNumber = document.getElementById("score-number");
const resultMessage = document.getElementById("result-message");
const restartQuizBtn = document.getElementById("restart-quiz");

// State Management
let currentQuestion = 0;
let score = 0;
let isDarkMode = false;

// Quiz Data
const quizData = [
  {
    question: "Apa limbah kelapa sawit yang paling banyak dihasilkan?",
    answers: [
      "Janjang kosong",
      "Cangkang sawit",
      "Sabut sawit",
      "Cairan limbah",
    ],
    correct: 0,
  },
  {
    question: "Apa manfaat utama dari bio-briket?",
    answers: [
      "Pupuk tanaman",
      "Bahan bakar alternatif",
      "Makanan ternak",
      "Bahan bangunan",
    ],
    correct: 1,
  },
  {
    question: "Berapa persen limbah kelapa sawit yang bisa dimanfaatkan?",
    answers: ["25%", "50%", "75%", "100%"],
    correct: 2,
  },
  {
    question: "Apa keuntungan pengolahan limbah sawit bagi lingkungan?",
    answers: [
      "Mengurangi polusi udara",
      "Menghemat lahan pembuangan",
      "Menciptakan produk bernilai",
      "Semua benar",
    ],
    correct: 3,
  },
  {
    question: "Apa yang bisa dihasilkan dari cangkang kelapa sawit?",
    answers: ["Arang aktif", "Bahan bakar", "Media tanam", "Semua benar"],
    correct: 3,
  },
];

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupThemeToggle();
  setupBackToTop();
  setupCalculator();
  setupQuiz();
  setupSmoothScrolling();
  setupScrollAnimations();
  setupModal();
  loadThemeFromStorage();
}

// Navigation
function setupNavigation() {
  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Change header background on scroll
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    const isDark = document.body.classList.contains("dark-mode");
    if (window.scrollY > 100) {
      header.style.background = isDark
        ? "rgba(45, 45, 45, 0.95)"
        : "rgba(255, 255, 255, 0.95)";
      header.style.backdropFilter = "blur(10px)";
      header.style.boxShadow = "var(--shadow-sm)";
    } else {
      header.style.background = "transparent";
      header.style.backdropFilter = "none";
      header.style.boxShadow = "none";
    }
  });
}

// Theme Toggle
function setupThemeToggle() {
  themeToggle.addEventListener("click", function () {
    isDarkMode = !isDarkMode;
    toggleTheme();
  });
}

function toggleTheme() {
  const body = document.body;
  const themeIcon = themeToggle.querySelector(".theme-icon");

  if (isDarkMode) {
    body.classList.add("dark-mode");
    themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

function loadThemeFromStorage() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode = true;
    toggleTheme();
  }
}

// Back to Top
function setupBackToTop() {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Calculator
function setupCalculator() {
  calculateBtn.addEventListener("click", calculateWastePotential);

  // Add input validation
  const tonnageInput = document.getElementById("tonnage");
  tonnageInput.addEventListener("input", function () {
    if (this.value < 0) {
      this.value = 0;
    }
  });
}

function calculateWastePotential() {
  const tonnage = parseFloat(document.getElementById("tonnage").value);
  const wasteType = document.getElementById("waste-type").value;

  if (!tonnage || tonnage <= 0) {
    showNotification("Silakan masukkan jumlah limbah yang valid", "error");
    return;
  }

  let briketAmount = 0;
  let pupukAmount = 0;
  let economicValue = 0;
  let co2Reduction = 0;

  // Calculate based on waste type
  switch (wasteType) {
    case "janjang":
      briketAmount = tonnage * 0.6;
      pupukAmount = tonnage * 0.3;
      economicValue = tonnage * 500000;
      co2Reduction = tonnage * 1.2;
      break;
    case "cangkang":
      briketAmount = tonnage * 0.8;
      pupukAmount = tonnage * 0.1;
      economicValue = tonnage * 700000;
      co2Reduction = tonnage * 1.5;
      break;
    case "sabut":
      briketAmount = tonnage * 0.4;
      pupukAmount = tonnage * 0.4;
      economicValue = tonnage * 400000;
      co2Reduction = tonnage * 0.8;
      break;
    case "campuran":
      briketAmount = tonnage * 0.5;
      pupukAmount = tonnage * 0.3;
      economicValue = tonnage * 550000;
      co2Reduction = tonnage * 1.1;
      break;
  }

  // Display results with animation
  displayResults(briketAmount, pupukAmount, economicValue, co2Reduction);
}

function displayResults(briket, pupuk, value, co2) {
  // Show results container
  results.style.display = "block";
  results.classList.add("fade-in");

  // Animate numbers
  animateValue("briket-result", 0, briket, 1000, " ton");
  animateValue("pupuk-result", 0, pupuk, 1000, " ton");
  animateValue("nilai-result", 0, value, 1000, "", true);
  animateValue("emisi-result", 0, co2, 1000, " ton");

  // Scroll to results
  setTimeout(() => {
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

function animateValue(
  id,
  start,
  end,
  duration,
  suffix = "",
  isCurrency = false
) {
  const element = document.getElementById(id);
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }

    if (isCurrency) {
      element.textContent = "Rp " + Math.floor(current).toLocaleString("id-ID");
    } else {
      element.textContent = current.toFixed(1) + suffix;
    }
  }, 16);
}

// Quiz Functions
function setupQuiz() {
  restartQuizBtn.addEventListener("click", restartQuiz);
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    showQuizResult();
    return;
  }

  const question = quizData[currentQuestion];
  questionText.textContent = question.question;
  currentQuestionSpan.textContent = currentQuestion + 1;
  totalQuestionsSpan.textContent = quizData.length;

  // Update progress bar
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  progressFill.style.width = progress + "%";

  // Clear and populate answers
  answersContainer.innerHTML = "";
  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => selectAnswer(index));
    answersContainer.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  const question = quizData[currentQuestion];
  const buttons = answersContainer.querySelectorAll(".answer-btn");

  // Disable all buttons
  buttons.forEach((button) => {
    button.disabled = true;
  });

  // Show correct/incorrect
  if (selectedIndex === question.correct) {
    buttons[selectedIndex].classList.add("correct");
    score++;
  } else {
    buttons[selectedIndex].classList.add("incorrect");
    buttons[question.correct].classList.add("correct");
  }

  // Move to next question after delay
  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 1500);
}

function showQuizResult() {
  questionContainer.style.display = "none";
  quizResult.style.display = "block";
  scoreNumber.textContent = score;

  let message = "";
  if (score === 5) {
    message = "Luar biasa! Anda sangat peduli dengan lingkungan! 🌟";
  } else if (score >= 3) {
    message = "Bagus! Anda sudah mulai peduli dengan lingkungan! 👍";
  } else {
    message = "Mari terus belajar tentang pengelolaan limbah sawit! 📚";
  }

  resultMessage.textContent = message;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  questionContainer.style.display = "block";
  quizResult.style.display = "none";
  loadQuestion();
}

// Smooth Scrolling
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll Animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(".feature-item, .education-card, .gallery-item")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    zIndex: "10000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
    wordWrap: "break-word",
  });

  // Set background color based on type
  switch (type) {
    case "error":
      notification.style.background = "#f44336";
      break;
    case "success":
      notification.style.background = "#4caf50";
      break;
    default:
      notification.style.background = "#2196f3";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Modal Functionality
function setupModal() {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const closeBtn = modal.querySelector(".close");

  // Close modal when clicking close button
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Close modal on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });

  // Setup modal triggers for education cards
  document.querySelectorAll(".btn-modal").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".education-card");
      const title = card.getAttribute("data-title");
      const description = card.getAttribute("data-description");

      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modal.style.display = "block";
    });
  });

  // Setup modal triggers for gallery items
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", function () {
      const title = this.getAttribute("data-title");
      const description = this.getAttribute("data-description");

      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modal.style.display = "block";
    });
  });
}

// Gallery Lightbox
function setupGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector(".gallery-img");
      const overlay = this.querySelector(".gallery-overlay");
      const title = overlay.querySelector("h3").textContent;
      const description = overlay.querySelector("p").textContent;

      createLightbox(img.src, title, description);
    });
  });
}

function createLightbox(src, title, description) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";

  lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${src}" alt="${title}">
            <div class="lightbox-info">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        </div>
    `;

  // Style lightbox
  Object.assign(lightbox.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10000",
    opacity: "0",
    transition: "opacity 0.3s ease",
  });

  const content = lightbox.querySelector(".lightbox-content");
  Object.assign(content.style, {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90%",
    textAlign: "center",
  });

  const img = lightbox.querySelector("img");
  Object.assign(img.style, {
    maxWidth: "100%",
    maxHeight: "70vh",
    borderRadius: "8px",
  });

  const closeBtn = lightbox.querySelector(".lightbox-close");
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "-40px",
    right: "0",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "2rem",
    cursor: "pointer",
    padding: "5px",
  });

  const info = lightbox.querySelector(".lightbox-info");
  Object.assign(info.style, {
    marginTop: "1rem",
    color: "white",
  });

  document.body.appendChild(lightbox);

  // Animate in
  setTimeout(() => {
    lightbox.style.opacity = "1";
  }, 10);

  // Close handlers
  function closeLightbox() {
    lightbox.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(lightbox);
    }, 300);
  }

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });
}

// Form Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[+]?[\d\s-()]+$/;
  return re.test(phone) && phone.length >= 10;
}

// Performance Optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize gallery lightbox when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Gallery lightbox removed due to conflicts with modal setup
});

// Error Handling
window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
  showNotification("Terjadi kesalahan. Silakan refresh halaman.", "error");
});

// Analytics (placeholder)
function trackEvent(eventName, properties = {}) {
  // Placeholder for analytics tracking
  console.log("Event tracked:", eventName, properties);
}

// Track user interactions
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn")) {
    trackEvent("button_click", {
      button_text: e.target.textContent,
      button_class: e.target.className,
    });
  }
});

// Export functions for external use
window.LitPalm = {
  calculateWastePotential,
  showNotification,
  toggleTheme,
  restartQuiz,
};
