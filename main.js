const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImg = document.getElementById("song-img");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseBtn = document.getElementById("pause");
const playBtn = document.getElementById("play");
const playListBtn = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeBtn = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

//indis sırası
let index;

//döngü
let loop = true;

//şarkı listesi
const songList = [
  {
    name: "Çocukluğum",
    link: "assets/cocuklugum.mp3",
    artist: "Misal",
    image: "assets/misal.jpeg",
  },
  {
    name: "Yerli Plaka",
    link: "assets/yerliplaka.mp3",
    artist: "Ceza",
    image: "assets/ceza.jpg",
  },
  {
    name: "366.Gün",
    link: "assets/366.gun.mp3",
    artist: "Sagopa",
    image: "assets/sago.jpeg",
  },
  {
    name: "Mola",
    link: "assets/mola.mp3",
    artist: "Tankurt Manas",
    image: "assets/tankurtmanas.jpg",
  },
];
//şarkı atama
const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImg.src = image;

  audio.onloadedmetadata = () => {
    //zamanı ayarla
    maxDuration.innerText = timeFormatter(audio.duration);
  };

  playAudio();

  //playlist seçip-gizleme
  playListContainer.classList.add("hide");
};

//sarkıyı çal
const playAudio = () => {
  audio.play();
  pauseBtn.classList.remove("hide");
  playBtn.classList.add("hide");
};

//şarkı durdur
const pauseAudio = () => {
  audio.pause();
  pauseBtn.classList.add("hide");
  playBtn.classList.remove("hide");
};

//önceki şarkı
const prevSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songList.length - 1;
  }
  setSong(index);
};

//sonraki şarkı
const nextSong = () => {
  if (loop) {
    if (index == songList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.round(Math.random() * songList.length);
    setSong(randIndex);
  }
  playAudio();
};

//şarkı bittiğinde //sıradakini çağır
audio.onended = () => {
  nextSong();
};

//karıştırıcı
shuffleBtn.addEventListener("click", () => {
  if (shuffleBtn.classList.contains("active")) {
    shuffleBtn.classList.remove("active");
    loop = true;
  } else {
    shuffleBtn.classList.add("active");
    loop = false;
  }
});

//tekrar
repeatBtn.addEventListener("click", () => {
  if (repeatBtn.classList.contains("active")) {
    repeatBtn.classList.remove("active");
    audio.loop = false;
  } else {
    repeatBtn.classList.add("active");
    audio.loop = true;
  }
});

//zaman formatı oluşturma
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

//şarkıda geçen toplam saniye anlık alma
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

//progres alanı hesapla
progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;
  let coordEnd = event.clientX;

  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
  currentProgress.style.width = progress * 100 + "%";
  audio.currentTime = progress * audio.duration;

  playAudio();
});

//otomatik zaman sayacı progres doldurma
setInterval(() => {
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

//liste oluşturma
const initializePlaylist = () => {
  for (let i in songList) {
    playListSongs.innerHTML += `<li class='playlistSong' onclick='setSong(${i})'>
      <div class='playlist-image-container'>
        <img src='${songList[i].image}'/>
      </div>
      <div class='playlist-song-details'>
        <span id='playlist-song-name'>
          ${songList[i].name}
        </span>
        <span id='playlist-song-artist'>
          ${songList[i].artist}
        </span>
      </div>
    </li>`;
  }
};

//close playlist button
closeBtn.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//open playlist button
playListBtn.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

//Elements Click

//play button
playBtn.addEventListener("click", playAudio);

//pause button
pauseBtn.addEventListener("click", pauseAudio);

//next button
nextBtn.addEventListener("click", nextSong);

//prev button
prevBtn.addEventListener("click", prevSong);

//ekran ilk açıldığında
window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlaylist();
};
