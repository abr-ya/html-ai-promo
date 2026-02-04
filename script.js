document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");

  const skillsGrid = document.querySelector("#skills-grid");
  const addSkillButton = document.querySelector("#add-skill");
  const skillsSection = document.querySelector("#skills");
  const heroButton = document.querySelector(".hero-cta");
  const page = document.querySelector(".page");
  const paginationButtons = Array.from(
    document.querySelectorAll(".pagination-dot")
  );
  const screens = Array.from(document.querySelectorAll(".screen"));

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

  if (paginationButtons.length > 0 && page && screens.length > 0) {
    const buttonByTarget = new Map();
    paginationButtons.forEach((button) => {
      const target = button.dataset.target;
      const section = target ? document.querySelector(target) : null;

      if (section) {
        buttonByTarget.set(section.id, button);
        button.addEventListener("click", () => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    });

    const setActiveButton = (sectionId) => {
      paginationButtons.forEach((button) => {
        const isActive = button.dataset.target === `#${sectionId}`;
        button.classList.toggle("is-active", isActive);
        if (isActive) {
          button.setAttribute("aria-current", "true");
        } else {
          button.removeAttribute("aria-current");
        }
      });
    };

    let currentActiveId = screens[0]?.id;
    if (currentActiveId) {
      setActiveButton(currentActiveId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry && visibleEntry.target.id !== currentActiveId) {
          currentActiveId = visibleEntry.target.id;
          setActiveButton(currentActiveId);
        }
      },
      {
        root: page,
        threshold: [0.6],
      }
    );

    screens.forEach((screen) => observer.observe(screen));
  }

  loadSkills();

  if (skills.length === 0) {
    skills.push(...defaultSkills);
    saveSkills();
  }

  renderSkills();

  // Skills Index Section
  const indexStorageKey = "skillsIndexData";
  const indexInputs = Array.from(
    document.querySelectorAll(".skills-index-item input[type='range']")
  );
  const indexOutputs = Array.from(
    document.querySelectorAll(".skills-index-output")
  );
  const averageOutput = document.querySelector("#skills-average");
  const levelText = document.querySelector("#skills-level-text");
  const gaugeFill = document.querySelector(".skills-gauge-fill");

  const getLevelText = (value) => {
    if (value <= 25) {
      return "Beginner, a solid start";
    }
    if (value <= 50) {
      return "Making progress, keep the pace";
    }
    if (value <= 75) {
      return "Growing confidently, almost junior!";
    }
    return "Strong foundation — ready for a portfolio!";
  };

  const saveIndexValues = () => {
    const payload = indexInputs.reduce((accumulator, input) => {
      accumulator[input.id] = input.value;
      return accumulator;
    }, {});

    localStorage.setItem(indexStorageKey, JSON.stringify(payload));
  };

  const loadIndexValues = () => {
    const raw = localStorage.getItem(indexStorageKey);

    if (!raw) {
      return;
    }

    try {
      const savedValues = JSON.parse(raw);
      indexInputs.forEach((input) => {
        if (savedValues && typeof savedValues[input.id] !== "undefined") {
          input.value = savedValues[input.id];
        }
      });
    } catch (error) {
      console.warn("Failed to parse stored index values.", error);
    }
  };

  const updateIndexView = () => {
    if (indexInputs.length === 0) {
      return;
    }

    indexInputs.forEach((input, index) => {
      if (indexOutputs[index]) {
        indexOutputs[index].textContent = `${input.value}%`;
      }
    });

    const total = indexInputs.reduce(
      (accumulator, input) => accumulator + Number(input.value),
      0
    );
    const average = Math.round(total / indexInputs.length);

    if (averageOutput) {
      averageOutput.textContent = `${average}%`;
    }

    if (levelText) {
      levelText.textContent = getLevelText(average);
    }

    if (gaugeFill) {
      gaugeFill.style.width = `${average}%`;
    }
  };

  if (indexInputs.length > 0) {
    loadIndexValues();
    updateIndexView();

    indexInputs.forEach((input) => {
      input.addEventListener("input", () => {
        updateIndexView();
        saveIndexValues();
      });
    });
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
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
  }
});
