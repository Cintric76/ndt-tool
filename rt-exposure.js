const filmFactors = {
  "Ir-192": { D4: 3.0, D5: 1.5, D7: 1.0 },
  "Se-75": { D4: 2.4, D5: 1.4, D7: 1.0 },
  "Co-60": { D4: 3.0, D5: 1.5, D7: 1.0 }
};

const muBySource = {
  "Ir-192": 0.047529066436122015,
  "Se-75": 0.06672950045788328,
  "Co-60": 0.03195864092343074
};

const kBySource = {
  "Ir-192": 0.71070778151011,
  "Se-75": 1.5335704855042178,
  "Co-60": 0.5489183450213326
};

let timer = null;
let remainingSeconds = 0;

function calculate() {
  const source = document.getElementById("source").value;
  const activity = parseFloat(document.getElementById("activity").value);
  const filmType = document.getElementById("filmType").value;
  const thickness = parseFloat(document.getElementById("thickness").value);
  const distance = parseFloat(document.getElementById("distance").value);

  if (!(activity > 0 && thickness > 0 && distance > 0)) return;

  const mu = muBySource[source];
  const k = kBySource[source];
  const filmFactor = filmFactors[source][filmType];

  const seconds = k * filmFactor * (Math.pow(distance, 2) / activity) * Math.exp(mu * thickness);
  remainingSeconds = Math.round(seconds);

  document.getElementById("resultTime").innerText = formatTime(remainingSeconds);
  document.getElementById("resultSection").style.display = "block";
  updateWarningDots();
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function startTimer() {
  if (remainingSeconds <= 0 || timer) return;
  timer = setInterval(() => {
    if (remainingSeconds <= 1) {
      stopTimer();
      remainingSeconds = 0;
    } else {
      remainingSeconds--;
    }
    document.getElementById("resultTime").innerText = formatTime(remainingSeconds);
    updateWarningDots();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  stopTimer();
  calculate(); // recalc to reset timer
}

function updateWarningDots() {
  const container = document.getElementById("blinkDots");
  container.innerHTML = "";
  if (remainingSeconds <= 5) {
    const color = remainingSeconds === 0 ? "red" : "orange";
    for (let i = 0; i < 2; i++) {
      const dot = document.createElement("div");
      dot.style.width = "80px";
      dot.style.height = "80px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = color;
      dot.style.animation = "blink 1s infinite alternate";
      container.appendChild(dot);
    }
  }
}

const style = document.createElement("style");
style.innerHTML = `@keyframes blink { from { opacity: 0.2; } to { opacity: 1; } }`;
document.head.appendChild(style);
