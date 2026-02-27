import { getRecords, saveRecords } from "./storage.js";
import {
  calculateBMI,
  bmiStatus,
  calculateProgress,
  averageCalories,
  weeklyTrend,
  calorieStreak} from "./calculations.js";

let records = getRecords();
let calChartInstance;
let weightChartInstance;

window.addRecord = function () {
  const calories = parseInt(document.getElementById("calories").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (!calories || !weight) return alert("Enter all fields");

  records.push({
    date: new Date().toLocaleDateString(),
    calories,
    weight
  });

  saveRecords(records);

window.addRecord = function () {
  const calories = parseInt(document.getElementById("calories").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (!calories || !weight) return alert("Enter all fields");

  records.push({
    date: new Date().toLocaleDateString(),
    calories,
    weight
  });

  saveRecords(records);
  showToast("Added successfully ✅", "success");

  // re-render
  renderSummary();
  renderCharts();

  // clear input
  document.getElementById("calories").value = "";
  document.getElementById("weight").value = "";
};};

window.deleteLast = function () {
  if (records.length === 0) return;

  records.pop();
  saveRecords(records);
  showToast("Deleted last entry ❌", "danger");

  renderSummary();
  renderCharts();
};

function renderSummary() {
  if (records.length === 0) return;

  const latest = records[records.length - 1]; 
  const bmi = calculateBMI(latest.weight);
  const status = bmiStatus(bmi);
  const progress = calculateProgress(latest.weight);
  const avgCal = averageCalories(records);
  const trend = weeklyTrend(records);
  const streak = calorieStreak(records);



  document.getElementById("summary").innerHTML = `
    <strong>Weight:</strong> ${latest.weight} kg |
    <strong>BMI:</strong> ${bmi} (${status}) |
    <strong>Calories:</strong> ${latest.calories} <br>
    <strong>7-day Avg Calories:</strong> ${avgCal}
    <strong>Streak</strong> ${streak} days 🔥
    <strong>Weekly Trend:</strong> ${trend}  `;

  const bar = document.getElementById("progressBar");
  bar.style.width = Math.max(0, progress) + "%";
  bar.innerText = progress.toFixed(1) + "% to goal";

}

function renderCharts() {
  const labels = records.map(r => r.date);
  const calData = records.map(r => r.calories);
  const weightData = records.map(r => r.weight);

  if (calChartInstance) calChartInstance.destroy();
  if (weightChartInstance) weightChartInstance.destroy();

  calChartInstance = new Chart(
    document.getElementById("calChart"),
    {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "แคลอรี่",
            data: calData,
            borderWidth: 2,
            tension: 0.3
          }
        ]
      }
    }
  );

  weightChartInstance = new Chart(
    document.getElementById("weightChart"),
    {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "น้ำหนัก",
            data: weightData,
            borderWidth: 2,
            tension: 0.3
          }
        ]
      }
    }
  );
}
renderCharts();
renderSummary();


window.exportCSV = function () {
  if (records.length === 0) return;

  let csv = "Date,Calories,Weight\n";

  records.forEach(r => {
    csv += `${r.date},${r.calories},${r.weight}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "weight-data.csv";
  a.click();
};

window.showView = function (view) {
  const dashboard = document.getElementById("dashboardView");
  const history = document.getElementById("historyView");

  if (view === "dashboard") {
    dashboard.style.display = "block";
    history.style.display = "none";
  } else {
    dashboard.style.display = "none";
    history.style.display = "block";
    renderHistory();
  }
};

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  records.forEach((r, index) => {
    const item = document.createElement("li");
    item.className = "list-group-item";
    item.innerText = `${r.date} | ${r.calories} kcal | ${r.weight} kg`;
    list.appendChild(item);
  });
}

function showToast(message, type = "success") {
  const toastEl = document.getElementById("liveToast");
  const toastMsg = document.getElementById("toastMessage");

  toastMsg.innerText = message;

  toastEl.classList.remove("text-bg-success", "text-bg-danger");
  toastEl.classList.remove("slide-in", "slide-out");

  if (type === "success") {
    toastEl.classList.add("text-bg-success");
  } else {
    toastEl.classList.add("text-bg-danger");
  }

  const toast = new bootstrap.Toast(toastEl, {
    delay: 2000
  });

  toast.show();
  // Toast Audio
  const sound = document.getElementById("toastSound");
      sound.currentTime = 0;
      sound.volume = 0.3; // ปรับความเบาได้ 0.0 - 1.0
      sound.play().catch(() => {});

  // Slide In
  toastEl.classList.add("slide-in");

  // Slide Out ก่อนหาย
  toastEl.addEventListener("hide.bs.toast", () => {
    toastEl.classList.remove("slide-in");
    toastEl.classList.add("slide-out");
  }, { once: true });
}

//Dark Mode
function updateThemeButton() {
  const btn = document.getElementById("themeToggle");

  if (document.body.classList.contains("dark")) {
    btn.innerText = "☀️";
    btn.classList.remove("btn-dark");
    btn.classList.add("btn-light");
  } else {
    btn.innerText = "🌙";
    btn.classList.remove("btn-light");
    btn.classList.add("btn-dark");
  }
}
window.toggleDarkMode = function () {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);

  updateThemeButton();
};
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

updateThemeButton();