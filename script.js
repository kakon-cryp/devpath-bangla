const roadmap = [
  {
    title: "🌐 HTML — ওয়েবের ভিত্তি",
    level: "beginner",
    tasks: [
      "HTML কী এবং কীভাবে কাজ করে",
      "HTML Elements ও Attributes",
      "Heading, Paragraph ও Links",
      "Images, Lists ও Tables"
    ]
  },
  {
    title: "🎨 CSS — ওয়েব ডিজাইন",
    level: "beginner",
    tasks: [
      "CSS Selectors ও Properties",
      "Colors, Fonts ও Background",
      "Box Model ও Position",
      "Flexbox ও CSS Grid"
    ]
  },
  {
    title: "⚡ JavaScript — Programming",
    level: "intermediate",
    tasks: [
      "Variables ও Data Types",
      "Functions ও Conditions",
      "Arrays ও Objects",
      "DOM Manipulation"
    ]
  },
  {
    title: "🔧 Git & GitHub — Version Control",
    level: "beginner",
    tasks: [
      "Git Install ও Configuration",
      "Repository ও Commit",
      "Push, Pull ও Clone",
      "GitHub-এ Project প্রকাশ"
    ]
  }
];

const list = document.getElementById("roadmapList");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const taskCount = document.getElementById("taskCount");

const storageKey = "devpath-bangla-progress";

function getCompleted() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

let completed = getCompleted();

function render() {
  const query = search.value.toLowerCase().trim();
  const level = filter.value;

  list.innerHTML = "";

  roadmap.forEach((section, sectionIndex) => {
    if (level !== "all" && section.level !== level) return;

    const matchingTasks = section.tasks
      .map((task, taskIndex) => ({ task, taskIndex }))
      .filter(item => item.task.toLowerCase().includes(query));

    if (!section.title.toLowerCase().includes(query) &&
        matchingTasks.length === 0) return;

    const card = document.createElement("article");
    card.className = "roadmap-card";

    const heading = document.createElement("div");
    heading.className = "card-title";

    const title = document.createElement("h3");
    title.textContent = section.title;

    const badge = document.createElement("span");
    badge.className = "level";
    badge.textContent = section.level;

    heading.append(title, badge);
    card.appendChild(heading);

    matchingTasks.forEach(({ task, taskIndex }) => {
      const id = `${sectionIndex}-${taskIndex}`;
      const label = document.createElement("label");
      label.className = "task";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = completed.includes(id);

      const text = document.createElement("span");
      text.textContent = task;

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          completed.push(id);
        } else {
          completed = completed.filter(item => item !== id);
        }

        localStorage.setItem(storageKey, JSON.stringify(completed));
        updateProgress();
      });

      label.append(checkbox, text);
      card.appendChild(label);
    });

    list.appendChild(card);
  });

  if (!list.children.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "কোনো বিষয় পাওয়া যায়নি। অন্য শব্দ দিয়ে খুঁজুন।";
    list.appendChild(empty);
  }

  updateProgress();
}

function updateProgress() {
  const total = roadmap.reduce((sum, section) =>
    sum + section.tasks.length, 0);

  const done = completed.length;
  const percent = Math.round((done / total) * 100);

  progressText.textContent = `${percent}% সম্পন্ন`;
  progressBar.style.width = `${percent}%`;
  taskCount.textContent =
    `${done.toLocaleString("bn-BD")} / ${total.toLocaleString("bn-BD")} টি বিষয় সম্পন্ন`;
}

search.addEventListener("input", render);
filter.addEventListener("change", render);

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  localStorage.setItem("devpath-theme", isLight ? "light" : "dark");

  document.getElementById("themeBtn").textContent =
    isLight ? "🌙" : "☀️";
});

if (localStorage.getItem("devpath-theme") === "light") {
  document.body.classList.add("light");
  document.getElementById("themeBtn").textContent = "🌙";
}

render();
