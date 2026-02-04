const data = {
  "Hit, Light": -3,
  "Hit, Medium": -6,
  "Hit, Heavy": -9,
  "Draw": -15,
  "Punch": 2,
  "Bend": 7,
  "Upset": 13,
  "Shrink": 16
};

const translations = {
  ru: {
    title: "AnvilCalc",
    description: "Введите три завершающих удара и желаемое итоговое \"смещение\":",
    labelFirst: "Первый удар:",
    labelSecond: "Второй удар:",
    labelLast: "Третий удар:",
    labelTarget: "Целевое смещение:",
    calculate: "Рассчитать",
    notFound: "Подходящая комбинация не найдена, всё введно правильно?",
    fixedHits: "Завершающие удары:",
    total: "Итоговое смещение:"
  },
  en: {
    title: "AnvilCalc",
    description: "Enter the three final hit and desired \"target\" value:",
    labelFirst: "First hit:",
    labelSecond: "Second hit:",
    labelLast: "Third hit:",
    labelTarget: "Target value:",
    calculate: "Calculate",
    notFound: "No combination found, is everything entered correctly?",
    fixedHits: "Final hits:",
    total: "Final value:"
  }
};

// Текущий язык
let lang = 'en';

// Функция обновления языка на странице
function updateLanguage() {
  const t = translations[lang];
  document.getElementById("title").textContent = t.title;
  document.getElementById("description").textContent = t.description;
  document.getElementById("labelFirst").textContent = t.labelFirst;
  document.getElementById("labelSecond").textContent = t.labelSecond;
  document.getElementById("labelLast").textContent = t.labelLast;
  document.getElementById("labelTarget").textContent = t.labelTarget;
  document.getElementById("calculateBtn").textContent = t.calculate;
  
  // Обновляем класс активного языка
  document.getElementById("enBtn").classList.toggle("active", lang === 'en');
  document.getElementById("ruBtn").classList.toggle("active", lang === 'ru');
}

// Переключение языка
document.getElementById("enBtn").addEventListener("click", () => { lang = 'en'; updateLanguage(); });
document.getElementById("ruBtn").addEventListener("click", () => { lang = 'ru'; updateLanguage(); });



// Инициализация
updateLanguage();

document.getElementById("calculateBtn").addEventListener("click", () => {
  const firstHit = parseInt(document.getElementById("firstHit").value);
  const secondHit = parseInt(document.getElementById("secondHit").value);
  const lastHit = parseInt(document.getElementById("lastHit").value);
  const target = parseInt(document.getElementById("targetValue").value);

  const fixedHits = [firstHit, secondHit, lastHit];
  const fixedSum = fixedHits.reduce((a,b)=>a+b,0);
  const need = target - fixedSum;

  const names = Object.keys(data);
  const values = Object.values(data);

  let solution = null;
  const stack = [[[], 0]];

  while (stack.length > 0) {
    const [combo, s] = stack.pop();
    if (s === need) { solution = combo; break; }
    if ((need >= 0 && s > need) || (need < 0 && s < need)) continue;
    for (let i = 0; i < values.length; i++) {
      stack.push([combo.concat(i), s + values[i]]);
    }
  }

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const t = translations[lang];

  if (!solution) {
    resultsDiv.innerHTML = `<p>${t.notFound}</p>`;
    return;
  }

  const counter = {};
  solution.forEach(idx => counter[idx] = (counter[idx] || 0) + 1);

  const sortedIndices = Object.keys(counter).sort((a,b) => values[b]-values[a]);
  sortedIndices.forEach(idx => {
    const count = counter[idx];
    const div = document.createElement("div");
    div.className = "result-item";
    div.textContent = `${values[idx]} x${count} (${names[idx]})`;
    resultsDiv.appendChild(div);
  });

  const fixedDiv = document.createElement("div");
  fixedDiv.className = "fixed-hits";
  fixedDiv.textContent = `${t.fixedHits} ${fixedHits.join(", ")}`;
  resultsDiv.appendChild(fixedDiv);

  const sumDiv = document.createElement("div");
  sumDiv.className = "fixed-hits";
  sumDiv.textContent = `${t.total} ${target}`;
  resultsDiv.appendChild(sumDiv);
});
