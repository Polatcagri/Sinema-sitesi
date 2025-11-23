
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show"); // Animasyon sınıfı ekle
    modal.style.display = "flex"; // Görünür yap
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show"); // Animasyon sınıfını kaldır
    setTimeout(() => {
      modal.style.display = "none"; // Animasyon bitince gizle
    }, 300); // CSS'teki animasyon süresine eşit olmalı
  }
}



// Modal dışına tıklayınca da kapanmasını sağlamak
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal"); // Tüm modalları seç
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

const navSlide = () => {
    const burger = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // 1. Menüyü Aç/Kapa
        nav.classList.toggle('nav-active');

        // 2. Link Animasyonları (Sırayla gelme efekti)
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                // Eğer zaten açıksa animasyonu temizle (kapanırken)
                link.style.animation = '';
            } else {
                // Açılırken animasyonu ekle. Index ile gecikme veriyoruz.
                // index / 7 + 0.3s -> Her bir link 0.1s farkla gelir.
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // 3. Burger İkonunu Animasyonla (X şekline dönüştürmek için)
        burger.classList.toggle('toggle');
    });
}

// Fonksiyonu çalıştır
navSlide();



const slides = document.querySelectorAll('.showtime-slide');
    let index = 0;

    setInterval(() => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, 5000);









// https://www.tauruscinemarine.com/control/json/info.json

document.addEventListener("DOMContentLoaded", async function () {
const API_URL = "https://sinema-sitesi.onrender.com/proxy?url=https://www.tauruscinemarine.com/control/json/info.json";
const FALLBACK_IMG_URL = 'images/placeholder.jpg';

  const elements = {
      sliderContainer: document.getElementById('sliderContainer'),
      dotsContainer: document.getElementById('dotsContainer'),
      filmTitleEl: document.getElementById('ad'),
      biletBtnSlider: document.querySelector("#sliderContainer .satinal"),
      detayBtnSlider: document.querySelector("#sliderContainer .detay"),
      vizyonFilmlerContainer: document.querySelector(".vizyonfilmler"),
      sliderCards: document.getElementById('slider-card'), // Kategori filmleri için eklendi
      sliderMenuItems: document.querySelectorAll('.slider-menu li'),
      filmDetayContainer: document.querySelector(".film-container"),
      seanslarContainer: document.getElementById('seanslar-container') // Seanslar için eklendi
  };

  let slideIndex = 1;
  let slides = [];
  let dots = [];
  let popularMovies = [];

  // --- Helper Fonksiyonlar ---

  async function fetchData(url) {
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error("Veri çekme hatası:", error);
          throw error;
      }
  }

  function navigateToDetail(filmId) {
      window.location.href = `Filmdetay.html?id=${filmId}`;
  }

  function getTurkishTitle(title) {
      return title ? title.split('/')[0].trim() : "Film Adı Yok";
  }

  function createSlide(film, index) {
      const slide = document.createElement('div');
      slide.className = 'slideshow-item';
      if (index === 0) slide.classList.add('slide-active');

      slide.innerHTML = `
          <img src="${film.banner || FALLBACK_IMG_URL}" alt="${getTurkishTitle(film.ad)}" onerror="this.src='${FALLBACK_IMG_URL}'">
      `;
      slide.addEventListener('click', () => navigateToDetail(film.id));
      elements.sliderContainer.insertBefore(slide, elements.sliderContainer.querySelector('.prev'));

      const dot = document.createElement('span');
      dot.className = 'dot';
      if (index === 0) dot.classList.add('current');
      dot.addEventListener('click', () => currentSlide(index + 1));
      elements.dotsContainer.appendChild(dot);
  }

  function showSlides(n) {
      if (n > slides.length) slideIndex = 1;
      if (n < 1) slideIndex = slides.length;

      for (let i = 0; i < slides.length; i++) {
          slides[i].classList.remove("slide-active");
      }
      for (let i = 0; i < dots.length; i++) {
          dots[i].classList.remove("current");
      }

      slides[slideIndex - 1].classList.add("slide-active");
      dots[slideIndex - 1].classList.add("current");

      const currentFilm = popularMovies[slideIndex - 1];
      elements.filmTitleEl.textContent = getTurkishTitle(currentFilm?.ad); // ?. ile undefined kontrolü

      if (elements.detayBtnSlider && currentFilm && currentFilm.id) {
          elements.detayBtnSlider.onclick = (e) => {
              e.stopPropagation();
              navigateToDetail(currentFilm.id);
          };
      }
  }

  function plusSlides(n) {
      showSlides(slideIndex += n);
      resetInterval();
  }

  function currentSlide(n) {
      showSlides(slideIndex = n);
      resetInterval();
  }

  let autoSlideInterval;
  function startSlider() {
      autoSlideInterval = setInterval(() => plusSlides(1), 7000);
  }
  function resetInterval() {
      clearInterval(autoSlideInterval);
      startSlider();
  }
  window.plusSlides = plusSlides;
  window.currentSlide = currentSlide;

  // --- Bölüm 1: Popüler Filmleri Çek ve Slider'ı Oluştur ---
  async function loadPopularMoviesForSlider() {
      try {
          const data = await fetchData(API_URL);
          popularMovies = data.slice(0, 10); // İlk 10 filmi slider için al
          popularMovies.forEach((film, index) => createSlide(film, index));
          slides = document.getElementsByClassName('slideshow-item');
          dots = document.getElementsByClassName('dot');
          showSlides(slideIndex);
          startSlider();

          if (elements.biletBtnSlider) {
              elements.biletBtnSlider.addEventListener('click', (e) => {
                  e.stopPropagation();
                  openModal('seansModal');
              });
          }
      } catch (error) {
          console.error("Popüler filmler yüklenirken hata:", error);
          elements.sliderContainer.innerHTML = `<div class="error">Popüler filmler yüklenirken hata oluştu.</div>`;
      }
  }


  // --- Bölüm 2: Kategori Filmleri ---
  const loadCategoryFilms = async (category) => {
    if (!elements.sliderCards) return;
    try {
        const films = await fetchData(API_URL);
        let filteredFilms = [];

        switch (category) {
            case 'popular':
                filteredFilms = films.slice(0, 10);
                break;
            case 'now_playing':
                filteredFilms = films.filter(f => f.vizyon && new Date(f.vizyon) <= new Date());
                // Rastgele sıralama algoritması
                filteredFilms.sort(() => Math.random() - 0.5);
                filteredFilms = filteredFilms.slice(0, 30);
                break;
            case 'upcoming':
                filteredFilms = films.filter(f => f.vizyon && new Date(f.vizyon) > new Date());
                break;
            default:
                filteredFilms = films.slice(0, 10);
        }

        elements.sliderCards.innerHTML = filteredFilms.map(film => `
            <div class="card" data-id="${film.id}">
                <img src="${film.poster || FALLBACK_IMG_URL}"
                     alt="${getTurkishTitle(film.ad)}"
                     onerror="this.src='${FALLBACK_IMG_URL}'">
                <div class="movie-info">
                    <h3 class="movie-title">${getTurkishTitle(film.ad)}</h3>
                   
                </div>
            </div>
        `).join('');

        // Kategori kartlarına tıklama olayını ekle
        elements.sliderCards.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const filmId = card.dataset.id;
                if (filmId) {
                    navigateToDetail(filmId);
                }
            });
        });

    } catch (error) {
        console.error(`Kategori (${category}) filmleri yüklenemedi:`, error);
        elements.sliderCards.innerHTML = `<div class="error">Kategori filmleri yüklenirken hata oluştu</div>`;
    }
};

// Sayfa yüklendiğinde varsayılan olarak popüler filmleri yükle
if (elements.sliderCards) {
    loadCategoryFilms('popular');

    // Kategori menü öğelerine tıklama olaylarını ekle
    elements.sliderMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                // Tüm menü öğelerinden active sınıfını kaldır
                elements.sliderMenuItems.forEach(li => li.classList.remove('active'));
                // Tıklanan öğeye active sınıfını ekle
                this.classList.add('active');
                loadCategoryFilms(category);
            }
        });
    });

    // İlk menü öğesini varsayılan olarak aktif yap
    if (elements.sliderMenuItems.length > 0) {
        elements.sliderMenuItems[0].classList.add('active');
    }
}


  // --- Bölüm 3: Vizyondaki Filmleri Çek ve Listele ---
  async function loadNowPlayingMovies() {
    if (!elements.vizyonFilmlerContainer) return;

    try {
        const data = await fetchData(API_URL);
        elements.vizyonFilmlerContainer.innerHTML = "";

        data.forEach(film => {
            const filmKarti = document.createElement("div");
            filmKarti.classList.add("vizyon-karti");
            filmKarti.setAttribute("id", `film-${film.id}`);

            // Film Kartı HTML
            filmKarti.innerHTML = `
                <img src="${film.poster || FALLBACK_IMG_URL}" alt="${getTurkishTitle(film.ad)}" onerror="this.src='${FALLBACK_IMG_URL}'">
                <div class="button-container">
                    <button class="indexbilet-al">Bilet Al</button>
                    <button class="incele">İncele</button>
                </div>
                <p>${getTurkishTitle(film.ad)}</p>
            `;
            filmKarti.addEventListener("click", () => {
                navigateToDetail(film.id);
            });

            // Bilet Al butonuna tıklanınca modal oluştur
            filmKarti.querySelector(".indexbilet-al").addEventListener("click", (event) => {
                event.stopPropagation();
                openFilmSessionsModal(film);
            });

            // İncele butonu
            filmKarti.querySelector(".incele").addEventListener("click", (event) => {
                event.stopPropagation();
                navigateToDetail(film.id);
            });

            elements.vizyonFilmlerContainer.appendChild(filmKarti);
        });
    } catch (error) {
        console.error("Vizyondaki filmler yüklenirken hata:", error);
        elements.vizyonFilmlerContainer.innerHTML = `<div class="error">Vizyondaki filmler yüklenirken hata oluştu.</div>`;
    }
}

function openFilmSessionsModal(film) {
    const modalId = `modal-${film.id}`;
    let modal = document.getElementById(modalId);

    // Modal zaten varsa sadece göster ve seansları yeniden yükle
    if (modal) {
        modal.style.display = "block";
        loadFilmSessions(film.id);
        return;
    }

    // Yeni modal oluştur
    modal = document.createElement("div");
    modal.id = modalId;
    modal.className = "film-seans-modal";
    modal.innerHTML = `
        <div class="film-seans-content">
            <span class="film-seans-close" onclick="document.getElementById('${modalId}').style.display='none'">&times;</span>
            <h2 class="film-seans-baslik">${getTurkishTitle(film.ad)}  </h2>
            <div class="film-seans-button-container">
                <button id="seanslarBtn-${film.id}" class="film-seans-button film-seans-button-active" data-section="seanslar">
                    <i class="fa-solid fa-clock"></i>Seanslar
                </button>
                <button id="takvimBtn-${film.id}" class="film-seans-button" data-section="takvim">
                    <i class="fa-solid fa-calendar-days"></i>Takvim
                </button>
            </div>
            <div class="yas-uyari">
          <span id="yasisaret" class="uyari-icon">
            <img src="#" alt="" >
          </span>
          <span id="yasisaret"  class="uyari-icon">
            <img src="#" alt="">
          </span>
          <span id="yasisaret" class="uyari-icon">
            <img src="#" alt="">
          </span>
          <span id="yasisaret" class="uyari-icon">
            <img src="#" alt="">
          </span>
          
        </div>
            <div id="seansSection-${film.id}" class="film-seans-section active-section" data-section="seanslar">
                <ul id="saat-kapsayici-${film.id}" class="film-seans-saat-list"></ul>
            </div>
            <div id="takvimSection-${film.id}" class="film-takvim-section" data-section="takvim" style="display:none;">
                <ul class="film-seans-takvim-gunler"></ul>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const seanslarBtn = modal.querySelector(`#seanslarBtn-${film.id}`);
    const takvimBtn = modal.querySelector(`#takvimBtn-${film.id}`);
    const seansSection = modal.querySelector(`#seansSection-${film.id}`);
    const takvimSection = modal.querySelector(`#takvimSection-${film.id}`);

    const yasContainer = modal.querySelector(".yas-uyari");

    yasContainer.innerHTML = "";
    film.yasisaret.forEach(icon => {
        const img = document.createElement("img");
        img.src = icon;
        img.alt = "Yaş uyarı";
        img.style.borderRadius = "50%"
        img.style.height = "32px"
        img.style.marginRight = "10px"
        yasContainer.appendChild(img);
    });

    seanslarBtn.addEventListener("click", () => {
        seanslarBtn.classList.add("film-seans-button-active");
        takvimBtn.classList.remove("film-seans-button-active");
        seansSection.style.display = "block";
        takvimSection.style.display = "none";
    });

    takvimBtn.addEventListener("click", () => {
        takvimBtn.classList.add("film-seans-button-active");
        seanslarBtn.classList.remove("film-seans-button-active");
        seansSection.style.display = "none";
        takvimSection.style.display = "flex"; // Takvim bölümünü flex yapısı ile göster
        loadFilmCalendar(film.id);
    });

    loadFilmSessions(film.id);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function getTodayFormatted() {
    const today = new Date();
    return formatDate(today);
}

function isSameDay(dateString1, dateString2) {
    return formatDate(dateString1) === formatDate(dateString2);
}

async function loadFilmSessions(filmId) {
    const API_URL = "https://sinema-sitesi.onrender.com/proxy?url=https://www.tauruscinemarine.com/control/json/info.json";
    const saatKapsayici = document.getElementById(`saat-kapsayici-${filmId}`);
    const takvimContainer = document.getElementById(`takvimSection-${filmId}`);

    if (!saatKapsayici || !takvimContainer) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        const selectedFilm = data.find(film => film.id === filmId);

        if (selectedFilm && selectedFilm.altseans) {
            const uniqueDates = [...new Set(selectedFilm.altseans.map(seans => seans.tarih))].sort();
            createCalendar(uniqueDates, filmId);

            const today = getTodayFormatted();
            const todaySessions = selectedFilm.altseans.filter(seans => isSameDay(seans.tarih, today));
            displaySessions(todaySessions, saatKapsayici);
        } else {
            saatKapsayici.innerHTML = '<p>Bu film için henüz seans bilgisi bulunmamaktadır.</p>';
            takvimContainer.innerHTML = '';
        }

    } catch (error) {
        console.error("Seanslar yüklenirken hata:", error);
        saatKapsayici.innerHTML = '<div class="error">Seanslar yüklenirken bir hata oluştu.</div>';
        takvimContainer.innerHTML = '';
    }
}

function displaySessions(sessions, container) {
    let seansHTML = '<ul class="film-seans-saat-list">';
    const now = new Date();
    const todayFormatted = getTodayFormatted();

    const upcomingSessions = sessions.filter(seans => {
        if (seans.tarih === todayFormatted) {
            const [hours, minutes] = seans.seans.split(':').map(Number);
            const seansTime = new Date();
            seansTime.setHours(hours, minutes, 0, 0);
            return seansTime > now;
        }
        return seans.tarih > todayFormatted;
    });

    if (upcomingSessions.length > 0) {
        upcomingSessions.forEach(seans => {
            const biletLink = `https://www.biletiva.com/place/TAURUS_CINEMARINE?scode=TAURUS_CINEMARINE&lid=${seans.seansid}&eventName=undefined`;
            seansHTML += `
                <li>
                    <a href="${biletLink}" target="_blank" class="seans-bilgi">
                        ${seans.seans} - ${seans.kopya}
                    </a>
                    </li>
            `;
        });
    } else {
        seansHTML += '<li>Bugün için veya seçilen tarihte gösterim saatleri geçmiştir.</li>';
    }

    seansHTML += '</ul>';
    container.innerHTML = seansHTML;
}

function createCalendar(dates, filmId) {
    const takvimContainer = document.getElementById(`takvimSection-${filmId}`);
    takvimContainer.innerHTML = '';

    if (dates && dates.length > 0) {
        const ul = document.createElement('ul');
        ul.classList.add('film-seans-takvim-gunler');
        dates.forEach(date => {
            const li = document.createElement('li');
            li.textContent = formatDate(date);
            li.addEventListener('click', () => loadSessionsForDate(filmId, date));
            ul.appendChild(li);
        });
        takvimContainer.appendChild(ul);
    } else {
        takvimContainer.innerHTML = '<p>Gösterilecek seans tarihi bulunmamaktadır.</p>';
    }
}

async function loadSessionsForDate(filmId, selectedDate) {
    const API_URL = "https://sinema-sitesi.onrender.com/proxy?url=https://www.tauruscinemarine.com/control/json/info.json";
    const saatKapsayici = document.getElementById(`saat-kapsayici-${filmId}`);
    const seansSection = document.getElementById(`seansSection-${filmId}`);
    const takvimSection = document.getElementById(`takvimSection-${filmId}`);
    const seanslarBtn = document.getElementById(`seanslarBtn-${filmId}`);
    const takvimBtn = document.getElementById(`takvimBtn-${filmId}`);

    if (!saatKapsayici) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        const selectedFilm = data.find(film => film.id === filmId);

        if (selectedFilm && selectedFilm.altseans) {
            const sessionsOnDate = selectedFilm.altseans.filter(seans => isSameDay(seans.tarih, selectedDate));
            displaySessions(sessionsOnDate, saatKapsayici);
            if (seansSection && takvimSection && seanslarBtn && takvimBtn) {
                seansSection.style.display = 'block';
                takvimSection.style.display = 'flex';
                seanslarBtn.classList.add('film-seans-button-active');
                takvimBtn.classList.remove('film-seans-button-active');
            }
        } else {
            saatKapsayici.innerHTML = '<p>Bu film için o tarihte seans bulunmamaktadır.</p>';
        }

    } catch (error) {
        console.error("Seanslar yüklenirken hata:", error);
        saatKapsayici.innerHTML = '<div class="error">Seanslar yüklenirken bir hata oluştu.</div>';
    }
}

// `loadFilmCalendar` fonksiyonunun tanımını buraya eklemeniz gerekebilir.
// Örnek bir tanım:
async function loadFilmCalendar(filmId) {
    // Takvim verilerini çekme ve görüntüleme mantığı
    console.log(`Takvim verileri yükleniyor (Film ID: ${filmId})`);
    // ... API çağrıları ve takvim oluşturma işlemleri ...
}


  // --- Bölüm 4: Film Detaylarını Çek ve Göster ---
  async function loadMovieDetails() {
    if (!elements.filmDetayContainer) return;
    const urlParams = new URLSearchParams(window.location.search);
    const filmID = urlParams.get("id");
    const biletAlDetayBtn = document.getElementById("biletal"); // Film detay sayfasındaki buton
    let currentFilm; // Film detaylarını saklamak için değişken

    if (biletAlDetayBtn) {
        biletAlDetayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentFilm) {
                openFilmSessionsModal(currentFilm); // Dinamik modalı film bilgisiyle aç
            } else {
                console.error("Film detayları henüz yüklenmediği için modal açılamıyor.");
            }
        });
    }

    if (!filmID) {
        console.error("Film ID bulunamadı!");
        elements.filmDetayContainer.innerHTML = "<p>Film ID bulunamadı.</p>";
        return;
    }

    try {
        const data = await fetchData(API_URL);
        const film = data.find(item => item.id == filmID);

        if (film) {
            currentFilm = film; // Film detaylarını sakla

            if (film.banner) {
                elements.filmDetayContainer.style.backgroundImage = `url(${film.banner})`;
                elements.filmDetayContainer.style.backgroundSize = "cover";
                elements.filmDetayContainer.style.backgroundPosition = "center";
                elements.filmDetayContainer.style.backgroundRepeat = "no-repeat";
            }

            document.getElementById("dikey-afis").src = film.poster || FALLBACK_IMG_URL;
            document.getElementById("ad").textContent = getTurkishTitle(film.ad);
            document.getElementById("tur").innerHTML = `<strong>Tür:</strong> ${film.tur || "Bilgi yok"}`;
            document.getElementById("sure").innerHTML = `<strong>Süre:</strong> ${film.sure || "Bilgi yok"}`;
            document.getElementById("vizyon").innerHTML = `<strong>Vizyon Tarihi:</strong> ${film.vizyon || "Bilgi yok"}`;
            document.getElementById("sinopsis").innerHTML = `<strong>Konu:</strong> ${film.sinopsis || "Bilgi yok"}`;
            document.getElementById("yonetmen").innerHTML = `<strong>Yönetmen:</strong> ${film.yonetmen || "Bilgi yok"}`;
            document.getElementById("oyuncular").innerHTML = `<strong>Oyuncular:</strong> ${film.oyuncular || "Bilgi yok"}`;

            const yasContainer = document.querySelector(".yas-uyari");
            yasContainer.innerHTML = "";
            film.yasisaret.forEach(icon => {
                const img = document.createElement("img");
                img.src = icon;
                img.alt = "Yaş uyarı";
                img.style.marginRight = "8px";
                img.style.borderRadius = "50%"
                img.style.height = "32px";
                yasContainer.appendChild(img);
            });
            const fragmanContainer = document.querySelector(".trailer");
            fragmanContainer.innerHTML = `
                <iframe width="100%" height="480" src="${film.fragman}"
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;

            loadFilmSessions(filmID); // Sayfa yüklendiğinde ilk seansları yüklemek isterseniz burayı kullanabilirsiniz

        } else {
            elements.filmDetayContainer.innerHTML = "<p>Film bulunamadı.</p>";
        }

    } catch (error) {
        console.error("Film detayları yüklenirken hata:", error);
        elements.filmDetayContainer.innerHTML = `<div class="error">Film detayları yüklenirken bir hata oluştu.</div>`;
    }
}

// openFilmSessionsModal, createFilmSessionsModalHTML, attachModalEventListeners
// ve loadFilmSessions fonksiyonlarının tanımlarının bu sayfada da olduğundan emin olun.
// openFilmSessionsModal, createFilmSessionsModalHTML, attachModalEventListeners
// ve loadFilmSessions fonksiyonlarının tanımlarının bu sayfada da olduğundan emin olun.



  // --- Initial Çağrılar ---
  if (elements.sliderContainer) {
      loadPopularMoviesForSlider();
  }
  if (elements.vizyonFilmlerContainer) {
      loadNowPlayingMovies();
  }
  if (window.location.pathname.includes('Filmdetay.html')) {
      loadMovieDetails();
  }
});






  // SLIDER FONKSİYONLARI
  let slideIndex = 1;
  let autoSlideInterval;
  const dots = document.getElementsByClassName("dot");
  const slideshowContainer = document.querySelector(".slideshow-container");

  function showSlides(n) {
    const slides = document.getElementsByClassName("slideshow-item");

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("slide-active");
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("current");
    }

    if (slides[slideIndex - 1]) {
      slides[slideIndex - 1].classList.add("slide-active");
    }
    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].classList.add("current");
    }
  }

  function plusSlides(n) {
    showSlides((slideIndex += n));
    resetInterval();
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
    resetInterval();
  }

  function startSlider() {
    showSlides(slideIndex);
    autoSlideInterval = setInterval(() => plusSlides(1), 7000);
  }

  function resetInterval() {
    clearInterval(autoSlideInterval);
    startSlider();
  }

  // Dokunmatik destek
  let touchStartX = 0;
  let touchEndX = 0;

  if (slideshowContainer) {
    slideshowContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoSlideInterval);
      },
      { passive: true }
    );

    slideshowContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) plusSlides(1);
      if (touchEndX - touchStartX > 50) plusSlides(-1);
    });
  }

  // Global fonksiyonlar
  window.plusSlides = plusSlides;
  window.currentSlide = currentSlide;
  window.pauseSlides = () => clearInterval(autoSlideInterval);
  window.startSlides = startSlider;


  

