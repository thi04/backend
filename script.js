const filterButtons = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card");
const filterStatus = document.querySelector(".filter-status");
const skillButtons = document.querySelectorAll(".skill-chip");
let activeFilter = "all";
let activeSkill = "";

function updateProjects() {
  let visibleCount = 0;
  projectCards.forEach((card) => {
    const tags = card.dataset.tags.split(" ");
    const skills = card.dataset.skills.split(" ");
    const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
    const matchesSkill = !activeSkill || skills.includes(activeSkill);
    const matches = matchesFilter && matchesSkill;
    card.classList.toggle("is-hidden", !matches);
    card.classList.toggle("is-highlighted", matches && Boolean(activeSkill));
    if (matches) visibleCount += 1;
  });
  const filters = {
    all: "Tất cả dự án",
    streaming: "High Concurrency",
    payment: "Payment & Core",
    performance: "Performance / SQL",
    migration: "Migration",
    year: "1 năm qua"
  };
  const skillName = activeSkill
    ? document.querySelector(`.skill-chip[data-skill="${activeSkill}"]`).textContent
    : "";
  const context = [filters[activeFilter], skillName].filter(Boolean).join(" · ");
  filterStatus.textContent = `${context}: ${visibleCount} dự án`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateProjects();
  });
});

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = activeSkill === button.dataset.skill ? "" : button.dataset.skill;
    activeSkill = selected;
    skillButtons.forEach((item) => {
      const isSelected = item.dataset.skill === selected;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    updateProjects();
    document.querySelector(".skill-hint").textContent = selected
      ? `Đang làm nổi bật dự án liên quan đến ${button.textContent}. Chọn lại để bỏ lọc.`
      : "Chọn một kỹ năng để làm nổi bật dự án liên quan.";
  });
});

const viewButtons = document.querySelectorAll(".view-button");
const journeyPanels = document.querySelectorAll(".journey-view");
viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    viewButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    journeyPanels.forEach((panel) => {
      const visible = panel.dataset.panel === view;
      panel.hidden = !visible;
      panel.classList.toggle("is-visible", visible);
    });
  });
});

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");

function applyTheme(theme) {
  const light = theme === "light";
  document.body.classList.toggle("light-theme", light);
  themeIcon.textContent = light ? "☾" : "☼";
  themeLabel.textContent = light ? "Tối" : "Sáng";
  themeToggle.setAttribute("aria-label", light ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng");
  document.querySelector('meta[name="theme-color"]').content = light ? "#f5f7fb" : "#0b1120";
}

let savedTheme;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch (error) {
  console.warn("Could not read the saved theme preference.", error);
  savedTheme = null;
}
applyTheme(savedTheme === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
  const theme = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyTheme(theme);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Could not save the theme preference.", error);
  }
});

updateProjects();
