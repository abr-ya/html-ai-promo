document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");

  const skillsGrid = document.querySelector("#skills-grid");
  const addSkillButton = document.querySelector("#add-skill");
  const skillsSection = document.querySelector("#skills");
  const heroButton = document.querySelector(".hero-cta");

  const storageKey = "skillsData";
  const skills = [];

  const saveSkills = () => {
    localStorage.setItem(storageKey, JSON.stringify(skills));
  };

  const defaultSkills = [
    {
      title: "TypeScript",
      description: "Typed JavaScript for safer, scalable frontend codebases.",
    },
    {
      title: "React",
      description: "Component-driven UI development with reusable stateful views.",
    },
    {
      title: "Next",
      description: "Hybrid rendering, routing, and performance for production apps.",
    },
  ];

  const loadSkills = () => {
    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      return;
    }

    try {
      const storedSkills = JSON.parse(raw);

      if (Array.isArray(storedSkills)) {
        skills.push(
          ...storedSkills.filter(
            (skill) => skill && skill.title && skill.description
          )
        );
      }
    } catch (error) {
      console.warn("Failed to parse stored skills.", error);
    }
  };

  const createSkillCard = (skill) => {
    const card = document.createElement("article");
    card.className = "skill-card";
    card.setAttribute("tabindex", "0");

    const title = document.createElement("h3");
    title.textContent = skill.title;

    const description = document.createElement("p");
    description.textContent = skill.description;

    card.append(title, description);

    const toggleCard = () => {
      card.classList.toggle("is-expanded");
    };

    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard();
      }
    });

    return card;
  };

  const renderSkills = () => {
    if (!skillsGrid) {
      return;
    }

    skillsGrid.innerHTML = "";

    skills.forEach((skill) => {
      skillsGrid.append(createSkillCard(skill));
    });
  };

  const addSkill = () => {
    const title = window.prompt("Skill title:");

    if (!title) {
      return;
    }

    const description = window.prompt("Skill description:");

    if (!description) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      return;
    }

    skills.push({
      title: trimmedTitle,
      description: trimmedDescription,
    });

    saveSkills();
    renderSkills();
  };

  if (addSkillButton) {
    addSkillButton.addEventListener("click", addSkill);
  }

  if (heroButton && skillsSection) {
    heroButton.addEventListener("click", () => {
      skillsSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  loadSkills();

  if (skills.length === 0) {
    skills.push(...defaultSkills);
    saveSkills();
  }

  renderSkills();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  let rafId = null;
  const maxShift = 8;

  const updateShift = (event) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth - 0.5) * 2;
    const y = (event.clientY / innerHeight - 0.5) * 2;

    const shiftX = (x * maxShift).toFixed(2);
    const shiftY = (y * maxShift).toFixed(2);

    document.documentElement.style.setProperty("--shift-x", `${shiftX}px`);
    document.documentElement.style.setProperty("--shift-y", `${shiftY}px`);
  };

  const onMouseMove = (event) => {
    if (rafId) {
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      updateShift(event);
      rafId = null;
    });
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseleave", () => {
    document.documentElement.style.setProperty("--shift-x", "0px");
    document.documentElement.style.setProperty("--shift-y", "0px");
  });
});
