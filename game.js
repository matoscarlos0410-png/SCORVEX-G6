/* =========================================================
   SCORVEX G6
   ULTIMATE BATTLE ARENA
   GAME.JS
========================================================= */

"use strict";

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const bootScreen = $("bootScreen");
const mainMenu = $("mainMenu");
const gameScreen = $("gameScreen");

const canvas = $("gameCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;


/* =========================================================
   GAME CONSTANTS
========================================================= */

const VERSION = "G6";
const SAVE_KEY = "SCORVEX_G6_SAVE";

const MAX_HP = 100;
const MAX_ENERGY = 100;

const WORLD = {
  width: 1100,
  height: 650
};


/* =========================================================
   70 WEAPONS
========================================================= */

const weaponNames = [
  "Nova Blade",
  "Pulse Rifle",
  "Void Blaster",
  "Cryo Cannon",
  "Arc SMG",
  "Photon Rifle",
  "Gravity Hammer",
  "Solar Bow",
  "Ion Cannon",
  "Shadow Blades",

  "Meteor Launcher",
  "Quantum Staff",
  "Thunder Spear",
  "Prism Cannon",
  "Nebula Rifle",
  "Chrono Blaster",
  "Spectral Scythe",
  "Starburst Cannon",
  "Plasma Edge",
  "Vortex Gun",

  "Lunar Rifle",
  "Comet Blaster",
  "Hyper Shot",
  "Fusion Cannon",
  "Titan Hammer",
  "Rift Rifle",
  "Eclipse Blade",
  "Storm Bow",
  "Glacier Rifle",
  "Inferno Cannon",

  "Omega Blaster",
  "Cyber Rifle",
  "Pulse Shotgun",
  "Aether Cannon",
  "Void Spear",
  "Solar Blaster",
  "Quantum Bow",
  "Phantom Rifle",
  "Gravity Cannon",
  "Arc Hammer",

  "Plasma Shot",
  "Thunder Rifle",
  "Nova Cannon",
  "Cryo Blade",
  "Photon Cannon",
  "Meteor Bow",
  "Shadow Rifle",
  "Prism Blaster",
  "Chrono Spear",
  "Nebula Cannon",

  "Stellar Rifle",
  "Rift Blaster",
  "Eternal Blade",
  "Hyper Cannon",
  "Cosmic Bow",
  "Dark Matter Gun",
  "Infinity Rifle",
  "Aurora Cannon",
  "Titan Blaster",
  "Omega Blade",

  "Solaris Rifle",
  "Void Reaper",
  "Quantum Cannon",
  "Thunder Edge",
  "Nova Reaper",
  "Galaxy Blaster",
  "Eclipse Cannon",
  "Singularity Rifle",
  "Celestial Blade",
  "SCORVEX X"
];

const weaponRarities = [
  "common",
  "common",
  "uncommon",
  "uncommon",
  "rare",
  "rare",
  "epic",
  "epic",
  "legendary",
  "mythic"
];

const weapons = weaponNames.map((name, index) => {
  const rarity = weaponRarities[index % weaponRarities.length];

  const multiplier = {
    common: 1,
    uncommon: 1.15,
    rare: 1.35,
    epic: 1.6,
    legendary: 1.9,
    mythic: 2.25
  }[rarity];

  return {
    id: `weapon_${index + 1}`,
    name,
    rarity,
    damage: Math.round((18 + index * 0.8) * multiplier),
    speed: Math.min(100, Math.round(35 + index * 0.8)),
    range: Math.min(100, Math.round(35 + index * 0.9)),
    energy: Math.max(1, Math.round(5 + index / 8)),
    price: Math.round(
      (250 + index * 85) * multiplier
    ),
    icon: index % 5 === 0 ? "⚔️" :
          index % 5 === 1 ? "🔫" :
          index % 5 === 2 ? "⚡" :
          index % 5 === 3 ? "🌀" : "☄️"
  };
});


/* =========================================================
   90 SPECIAL ABILITIES
========================================================= */

const abilityPrefixes = [
  "Nova",
  "Void",
  "Quantum",
  "Solar",
  "Cryo",
  "Thunder",
  "Shadow",
  "Gravity",
  "Photon",
  "Chrono",
  "Meteor",
  "Plasma",
  "Eclipse",
  "Prism",
  "Nebula",
  "Aether",
  "Cosmic",
  "Storm",
  "Infinity",
  "Omega"
];

const abilityTypes = [
  "Burst",
  "Dash",
  "Shield",
  "Storm",
  "Freeze",
  "Pulse",
  "Strike",
  "Field",
  "Wave"
];

const abilities = [];

for (let i = 0; i < 90; i++) {
  const prefix = abilityPrefixes[i % abilityPrefixes.length];
  const type = abilityTypes[
    Math.floor(i / abilityPrefixes.length) % abilityTypes.length
  ];

  const rarity =
    i < 15 ? "common" :
    i < 30 ? "uncommon" :
    i < 50 ? "rare" :
    i < 70 ? "epic" :
    i < 84 ? "legendary" :
    "mythic";

  abilities.push({
    id: `ability_${i + 1}`,
    name: `${prefix} ${type}`,
    rarity,
    power: 20 + i * 2,
    cooldown: Math.max(2, 15 - i * 0.1),
    energy: Math.max(10, 55 - Math.floor(i / 3)),
    price: 300 + i * 110,
    icon:
      type === "Shield" ? "🛡️" :
      type === "Dash" ? "💨" :
      type === "Freeze" ? "❄️" :
      type === "Storm" ? "🌩️" :
      type === "Burst" ? "💥" :
      type === "Pulse" ? "⚡" :
      type === "Field" ? "🔵" :
      type === "Wave" ? "🌊" : "☄️"
  });
}


/* =========================================================
   ARMORS
========================================================= */

const armors = [
  {
    id: "armor_1",
    name: "Scout Armor",
    rarity: "common",
    defense: 5,
    price: 200
  },
  {
    id: "armor_2",
    name: "Urban Armor",
    rarity: "uncommon",
    defense: 10,
    price: 500
  },
  {
    id: "armor_3",
    name: "Pulse Armor",
    rarity: "rare",
    defense: 16,
    price: 900
  },
  {
    id: "armor_4",
    name: "Void Armor",
    rarity: "epic",
    defense: 24,
    price: 1500
  },
  {
    id: "armor_5",
    name: "Nova Armor",
    rarity: "legendary",
    defense: 32,
    price: 2500
  },
  {
    id: "armor_6",
    name: "SCORVEX X Armor",
    rarity: "mythic",
    defense: 45,
    price: 4500
  }
];


/* =========================================================
   CHARACTER CUSTOMIZATION
========================================================= */

const customization = {

  outfit: [
    ["Tactical Black", "🧥", "common"],
    ["Urban Runner", "🥋", "uncommon"],
    ["Neon Warrior", "🧥", "rare"],
    ["Void Hunter", "🥷", "epic"],
    ["Cyber Commander", "🤖", "legendary"],
    ["SCORVEX X", "👑", "mythic"]
  ],

  head: [
    ["Combat Helmet", "🪖", "common"],
    ["Shadow Mask", "😷", "uncommon"],
    ["Cyber Mask", "🤖", "rare"],
    ["Void Helmet", "⛑️", "epic"],
    ["Neon Visor", "🥽", "legendary"],
    ["Omega Helmet", "👑", "mythic"]
  ],

  accessories: [
    ["Basic Backpack", "🎒", "common"],
    ["Energy Backpack", "🎒", "uncommon"],
    ["Tactical Pack", "🎒", "rare"],
    ["Void Pack", "🎒", "epic"],
    ["Quantum Pack", "🎒", "legendary"],
    ["SCORVEX Pack", "🎒", "mythic"]
  ],

  effects: [
    ["Sin efecto", "○", "common"],
    ["Azul", "🔵", "uncommon"],
    ["Verde", "🟢", "rare"],
    ["Violeta", "🟣", "epic"],
    ["Dorado", "🟡", "legendary"],
    ["Cosmic", "✨", "mythic"]
  ],

  colors: [
    ["Cyan", "#00e5ff"],
    ["Azul", "#248cff"],
    ["Verde", "#2cff9a"],
    ["Violeta", "#9b59ff"],
    ["Rojo", "#ff405c"],
    ["Dorado", "#ffd84d"],
    ["Rosa", "#ff4fd8"],
    ["Blanco", "#ffffff"]
  ]

};


/* =========================================================
   DEFAULT SAVE
========================================================= */

const defaultSave = {
  coins: 5000,
  crystals: 250,
  score: 0,

  level: 1,
  xp: 0,

  hp: MAX_HP,
  energy: MAX_ENERGY,

  medkits: 5,

  ownedWeapons: ["weapon_1"],
  ownedAbilities: ["ability_1"],
  ownedArmors: ["armor_1"],

  equippedWeapon: "weapon_1",
  equippedAbility: "ability_1",
  equippedArmor: "armor_1",

  customization: {
    outfit: 0,
    head: 0,
    accessories: 0,
    effects: 0,
    colors: "#00e5ff"
  },

  sector: 1,

  music: true,
  sound: true
};


/* =========================================================
   SAVE DATA
========================================================= */

let saveData = loadSave();

function loadSave() {

  try {

    const raw = localStorage.getItem(SAVE_KEY);

    if (!raw) {
      return structuredClone
        ? structuredClone(defaultSave)
        : JSON.parse(JSON.stringify(defaultSave));
    }

    const parsed = JSON.parse(raw);

    return {
      ...defaultSave,
      ...parsed,

      customization: {
        ...defaultSave.customization,
        ...(parsed.customization || {})
      },

      ownedWeapons: Array.isArray(parsed.ownedWeapons)
        ? parsed.ownedWeapons
        : ["weapon_1"],

      ownedAbilities: Array.isArray(parsed.ownedAbilities)
        ? parsed.ownedAbilities
        : ["ability_1"],

      ownedArmors: Array.isArray(parsed.ownedArmors)
        ? parsed.ownedArmors
        : ["armor_1"]
    };

  } catch (error) {

    console.warn("No se pudo cargar la partida:", error);

    return JSON.parse(JSON.stringify(defaultSave));
  }
}


function saveGame() {

  try {

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(saveData)
    );

    notify("Partida guardada correctamente.");

  } catch (error) {

    console.warn("No se pudo guardar:", error);

  }
}


/* =========================================================
   GAME STATE
========================================================= */

const game = {

  running: false,
  paused: false,

  keys: {},

  player: {
    x: WORLD.width / 2,
    y: WORLD.height / 2,

    radius: 17,

    speed: 4,

    angle: 0,

    attackCooldown: 0,

    abilityCooldown: 0,

    invulnerable: 0
  },

  enemies: [],

  projectiles: [],

  particles: [],

  floatingTexts: [],

  wave: 1,

  combo: 0,

  comboTimer: 0,

  boss: null,

  lastTime: 0,

  enemySpawnTimer: 0,

  sectorTimer: 0,

  mouse: {
    x: WORLD.width / 2,
    y: WORLD.height / 2,
    down: false
  }

};


/* =========================================================
   GET EQUIPMENT
========================================================= */

function getWeapon() {
  return weapons.find(
    w => w.id === saveData.equippedWeapon
  ) || weapons[0];
}

function getAbility() {
  return abilities.find(
    a => a.id === saveData.equippedAbility
  ) || abilities[0];
}

function getArmor() {
  return armors.find(
    a => a.id === saveData.equippedArmor
  ) || armors[0];
}


/* =========================================================
   RARITY COLOR
========================================================= */

function rarityColor(rarity) {

  const colors = {
    common: "#d9e0eb",
    uncommon: "#54ff9e",
    rare: "#55aaff",
    epic: "#c277ff",
    legendary: "#ffc94f",
    mythic: "#ff62db"
  };

  return colors[rarity] || "#ffffff";
}


/* =========================================================
   XP SYSTEM
========================================================= */

function xpRequired() {
  return 100 + (saveData.level - 1) * 75;
}


function addXP(amount) {

  saveData.xp += amount;

  while (saveData.xp >= xpRequired()) {

    saveData.xp -= xpRequired();

    saveData.level++;

    saveData.hp = MAX_HP;
    saveData.energy = MAX_ENERGY;

    notify(
      `¡NIVEL ${saveData.level}!`,
      "level"
    );

  }

  updateHUD();
}


/* =========================================================
   PLAYER DAMAGE
========================================================= */

function damagePlayer(amount) {

  if (!game.running || game.player.invulnerable > 0) {
    return;
  }

  const armor = getArmor();

  const reduced = Math.max(
    1,
    amount * (1 - armor.defense / 150)
  );

  saveData.hp -= reduced;

  game.player.invulnerable = 25;

  createFloatingText(
    game.player.x,
    game.player.y - 25,
    `-${Math.round(reduced)}`,
    "#ff405c"
  );

  if (saveData.hp <= 0) {

    saveData.hp = 0;

    gameOver();

  }

  updateHUD();
}


/* =========================================================
   MEDKIT
========================================================= */

function useMedkit() {

  if (!game.running) return;

  if (saveData.medkits <= 0) {

    notify("No tienes botiquines.");

    return;
  }

  if (saveData.hp >= MAX_HP) {

    notify("Tu vida ya está completa.");

    return;
  }

  saveData.medkits--;

  saveData.hp = Math.min(
    MAX_HP,
    saveData.hp + 35
  );

  createParticles(
    game.player.x,
    game.player.y,
    "#2cff9a",
    15
  );

  notify("Botiquín utilizado.");

  updateHUD();
}


/* =========================================================
   ENEMY CREATION
========================================================= */

function spawnEnemy(type = "normal") {

  const side = Math.floor(Math.random() * 4);

  let x;
  let y;

  if (side === 0) {
    x = -30;
    y = Math.random() * WORLD.height;
  }

  if (side === 1) {
    x = WORLD.width + 30;
    y = Math.random() * WORLD.height;
  }

  if (side === 2) {
    x = Math.random() * WORLD.width;
    y = -30;
  }

  if (side === 3) {
    x = Math.random() * WORLD.width;
    y = WORLD.height + 30;
  }

  const boss = type === "boss";

  const hp = boss
    ? 900 + saveData.level * 150
    : 35 + saveData.level * 8 + game.wave * 5;

  game.enemies.push({

    x,
    y,

    radius: boss ? 35 : 15,

    hp,
    maxHp: hp,

    speed: boss ? 0.65 : 1 + Math.random() * .8,

    damage: boss
      ? 12 + saveData.level
      : 4 + saveData.level * .6,

    attackCooldown: 0,

    boss,

    color: boss ? "#ff405c" : "#9b59ff"
  });

  if (boss) {

    game.boss = game.enemies[
      game.enemies.length - 1
    ];

    showBoss();

  }

}


/* =========================================================
   WAVE SYSTEM
========================================================= */

function spawnWave() {

  const amount = Math.min(
    3 + game.wave * 2,
    22
  );

  for (let i = 0; i < amount; i++) {
    spawnEnemy();
  }

  if (game.wave % 5 === 0) {
    spawnEnemy("boss");
  }

  updateMission();
}


/* =========================================================
   PROJECTILES
========================================================= */

function fireWeapon() {

  const weapon = getWeapon();

  if (game.player.attackCooldown > 0) {
    return;
  }

  game.player.attackCooldown =
    Math.max(4, 18 - weapon.speed / 8);

  let angle = game.player.angle;

  if (!Number.isFinite(angle)) {
    angle = 0;
  }

  game.projectiles.push({

    x: game.player.x,
    y: game.player.y,

    vx: Math.cos(angle) * (7 + weapon.speed / 25),
    vy: Math.sin(angle) * (7 + weapon.speed / 25),

    damage: weapon.damage,

    life: Math.max(30, weapon.range * 2),

    radius: 5,

    color: rarityColor(weapon.rarity)

  });

  createParticles(
    game.player.x,
    game.player.y,
    rarityColor(weapon.rarity),
    4
  );

  playShotSound();
}


/* =========================================================
   ABILITY SYSTEM
========================================================= */

function useAbility() {

  if (!game.running) return;

  if (game.player.abilityCooldown > 0) {
    return;
  }

  const ability = getAbility();

  if (saveData.energy < ability.energy) {

    notify("No tienes suficiente energía.");

    return;
  }

  saveData.energy -= ability.energy;

  game.player.abilityCooldown =
    Math.max(45, ability.cooldown * 30);

  executeAbility(ability);

  updateHUD();
}


function executeAbility(ability) {

  const name = ability.name.toLowerCase();

  if (name.includes("dash")) {

    const distance = 130;

    game.player.x +=
      Math.cos(game.player.angle) * distance;

    game.player.y +=
      Math.sin(game.player.angle) * distance;

    clampPlayer();

    game.player.invulnerable = 30;

    createParticles(
      game.player.x,
      game.player.y,
      "#00e5ff",
      30
    );

    return;
  }


  if (name.includes("shield")) {

    game.player.invulnerable = 180;

    createParticles(
      game.player.x,
      game.player.y,
      "#55aaff",
      45
    );

    notify("ESCUDO ACTIVADO.");

    return;
  }


  if (name.includes("freeze")) {

    for (const enemy of game.enemies) {
      enemy.speed *= .2;
    }

    createParticles(
      game.player.x,
      game.player.y,
      "#65eaff",
      60
    );

    notify("ENEMIGOS CONGELADOS.");

    return;
  }


  if (name.includes("storm")) {

    for (const enemy of game.enemies) {

      enemy.hp -= ability.power * .55;

      createParticles(
        enemy.x,
        enemy.y,
        "#ffd84d",
        8
      );

    }

    return;
  }


  if (
    name.includes("burst") ||
    name.includes("pulse") ||
    name.includes("wave") ||
    name.includes("strike")
  ) {

    const radius = 170;

    for (const enemy of game.enemies) {

      const distance = Math.hypot(
        enemy.x - game.player.x,
        enemy.y - game.player.y
      );

      if (distance <= radius) {

        enemy.hp -= ability.power;

      }

    }

    createParticles(
      game.player.x,
      game.player.y,
      rarityColor(ability.rarity),
      80
    );

    return;
  }


  if (name.includes("field")) {

    saveData.hp = Math.min(
      MAX_HP,
      saveData.hp + 25
    );

    createParticles(
      game.player.x,
      game.player.y,
      "#2cff9a",
      50
    );

    return;
  }


  /* HABILIDAD GENÉRICA */

  for (const enemy of game.enemies) {

    const distance = Math.hypot(
      enemy.x - game.player.x,
      enemy.y - game.player.y
    );

    if (distance < 200) {
      enemy.hp -= ability.power * .75;
    }

  }

  createParticles(
    game.player.x,
    game.player.y,
    rarityColor(ability.rarity),
    50
  );
}


/* =========================================================
   ENEMY UPDATE
========================================================= */

function updateEnemies(delta) {

  for (const enemy of game.enemies) {

    const dx = game.player.x - enemy.x;
    const dy = game.player.y - enemy.y;

    const distance = Math.hypot(dx, dy) || 1;

    enemy.x +=
      (dx / distance) *
      enemy.speed *
      delta;

    enemy.y +=
      (dy / distance) *
      enemy.speed *
      delta;

    if (enemy.attackCooldown > 0) {
      enemy.attackCooldown -= delta;
    }

    if (
      distance <
      enemy.radius + game.player.radius + 4
    ) {

      if (enemy.attackCooldown <= 0) {

        damagePlayer(enemy.damage);

        enemy.attackCooldown =
          enemy.boss ? 70 : 50;

      }

    }

  }

}


/* =========================================================
   PROJECTILE UPDATE
========================================================= */

function updateProjectiles(delta) {

  for (let i = game.projectiles.length - 1; i >= 0; i--) {

    const p = game.projectiles[i];

    p.x += p.vx * delta;
    p.y += p.vy * delta;

    p.life -= delta;

    let removed = false;

    for (
      let j = game.enemies.length - 1;
      j >= 0;
      j--
    ) {

      const enemy = game.enemies[j];

      const distance = Math.hypot(
        enemy.x - p.x,
        enemy.y - p.y
      );

      if (
        distance <
        enemy.radius + p.radius
      ) {

        enemy.hp -= p.damage;

        createParticles(
          p.x,
          p.y,
          p.color,
          7
        );

        p.life = 0;

        removed = true;

        if (enemy.hp <= 0) {

          killEnemy(j);

        }

        break;
      }

    }

    if (
      removed ||
      p.life <= 0 ||
      p.x < -50 ||
      p.x > WORLD.width + 50 ||
      p.y < -50 ||
      p.y > WORLD.height + 50
    ) {

      game.projectiles.splice(i, 1);

    }

  }

}


/* =========================================================
   KILL ENEMY
========================================================= */

function killEnemy(index) {

  const enemy = game.enemies[index];

  if (!enemy) return;

  const reward = enemy.boss
    ? 1000
    : 100 + game.wave * 15;

  saveData.coins += reward;

  saveData.score += reward;

  addXP(
    enemy.boss
      ? 250
      : 30 + game.wave * 4
  );

  game.combo++;
  game.comboTimer = 180;

  createParticles(
    enemy.x,
    enemy.y,
    enemy.color,
    enemy.boss ? 100 : 25
  );

  createFloatingText(
    enemy.x,
    enemy.y,
    `+${reward}`,
    "#ffd84d"
  );

  if (enemy.boss) {

    game.boss = null;

    hideBoss();

    notify("¡JEFE DERROTADO!");

  }

  game.enemies.splice(index, 1);

  if (game.enemies.length === 0) {

    game.wave++;

    saveData.sector =
      Math.max(
        saveData.sector,
        Math.floor(game.wave / 3) + 1
      );

    setTimeout(() => {

      if (game.running) {
        spawnWave();
      }

    }, 1200);

  }

  updateHUD();
}


/* =========================================================
   PLAYER UPDATE
========================================================= */

function updatePlayer(delta) {

  let dx = 0;
  let dy = 0;

  if (game.keys["w"] || game.keys["arrowup"]) {
    dy -= 1;
  }

  if (game.keys["s"] || game.keys["arrowdown"]) {
    dy += 1;
  }

  if (game.keys["a"] || game.keys["arrowleft"]) {
    dx -= 1;
  }

  if (game.keys["d"] || game.keys["arrowright"]) {
    dx += 1;
  }

  if (dx !== 0 || dy !== 0) {

    const length = Math.hypot(dx, dy);

    dx /= length;
    dy /= length;

    game.player.x +=
      dx * game.player.speed * delta;

    game.player.y +=
      dy * game.player.speed * delta;
  }

  clampPlayer();

  if (game.player.attackCooldown > 0) {
    game.player.attackCooldown -= delta;
  }

  if (game.player.abilityCooldown > 0) {
    game.player.abilityCooldown -= delta;
  }

  if (game.player.invulnerable > 0) {
    game.player.invulnerable -= delta;
  }

  /* Regeneración de energía */

  saveData.energy = Math.min(
    MAX_ENERGY,
    saveData.energy + .08 * delta
  );

  /* Combo */

  if (game.comboTimer > 0) {

    game.comboTimer -= delta;

  } else {

    game.combo = 0;

  }

}


/* =========================================================
   CLAMP PLAYER
========================================================= */

function clampPlayer() {

  game.player.x = Math.max(
    game.player.radius,
    Math.min(
      WORLD.width - game.player.radius,
      game.player.x
    )
  );

  game.player.y = Math.max(
    game.player.radius,
    Math.min(
      WORLD.height - game.player.radius,
      game.player.y
    )
  );
}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles(
  x,
  y,
  color = "#00e5ff",
  amount = 10
) {

  for (let i = 0; i < amount; i++) {

    const angle =
      Math.random() * Math.PI * 2;

    const speed =
      Math.random() * 4 + 1;

    game.particles.push({

      x,
      y,

      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,

      life: 20 + Math.random() * 35,

      size: 1 + Math.random() * 4,

      color

    });

  }

}


function updateParticles(delta) {

  for (
    let i = game.particles.length - 1;
    i >= 0;
    i--
  ) {

    const p = game.particles[i];

    p.x += p.vx * delta;
    p.y += p.vy * delta;

    p.vx *= .96;
    p.vy *= .96;

    p.life -= delta;

    if (p.life <= 0) {
      game.particles.splice(i, 1);
    }

  }

}


/* =========================================================
   FLOATING TEXT
========================================================= */

function createFloatingText(
  x,
  y,
  text,
  color = "#ffffff"
) {

  game.floatingTexts.push({

    x,
    y,

    text,
    color,

    life: 60

  });

}


function updateFloatingTexts(delta) {

  for (
    let i = game.floatingTexts.length - 1;
    i >= 0;
    i--
  ) {

    const f = game.floatingTexts[i];

    f.y -= .5 * delta;

    f.life -= delta;

    if (f.life <= 0) {
      game.floatingTexts.splice(i, 1);
    }

  }

}


/* =========================================================
   DRAW BACKGROUND
========================================================= */

function drawBackground() {

  ctx.fillStyle = "#05090f";

  ctx.fillRect(
    0,
    0,
    WORLD.width,
    WORLD.height
  );


  /* Grid */

  ctx.strokeStyle =
    "rgba(0,229,255,.045)";

  ctx.lineWidth = 1;

  const size = 50;

  for (
    let x = 0;
    x <= WORLD.width;
    x += size
  ) {

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD.height);
    ctx.stroke();

  }

  for (
    let y = 0;
    y <= WORLD.height;
    y += size
  ) {

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD.width, y);
    ctx.stroke();

  }


  /* Arena circle */

  ctx.beginPath();

  ctx.arc(
    WORLD.width / 2,
    WORLD.height / 2,
    260,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    "rgba(0,229,255,.08)";

  ctx.stroke();

}


/* =========================================================
   DRAW PLAYER
========================================================= */

function drawPlayer() {

  const p = game.player;

  ctx.save();

  ctx.translate(p.x, p.y);

  ctx.rotate(p.angle);

  const color =
    saveData.customization.colors ||
    "#00e5ff";

  /* Aura */

  if (
    saveData.customization.effects > 0
  ) {

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      30 + saveData.customization.effects * 5,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle = color;
    ctx.globalAlpha = .35;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.globalAlpha = 1;

  }


  /* Body */

  ctx.fillStyle = "#172130";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    p.radius,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle = color;

  ctx.lineWidth = 3;

  ctx.stroke();


  /* Direction */

  ctx.fillStyle = color;

  ctx.beginPath();

  ctx.moveTo(22, 0);
  ctx.lineTo(5, -7);
  ctx.lineTo(5, 7);

  ctx.closePath();

  ctx.fill();


  /* Shield */

  if (p.invulnerable > 0) {

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      28,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      "rgba(80,180,255,.75)";

    ctx.lineWidth = 2;

    ctx.stroke();

  }

  ctx.restore();

}


/* =========================================================
   DRAW ENEMIES
========================================================= */

function drawEnemies() {

  for (const enemy of game.enemies) {

    ctx.save();

    ctx.translate(
      enemy.x,
      enemy.y
    );

    /* Enemy body */

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      enemy.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      enemy.color;

    ctx.globalAlpha = .85;

    ctx.fill();

    ctx.globalAlpha = 1;

    ctx.strokeStyle =
      "#ffffff";

    ctx.lineWidth = enemy.boss ? 3 : 1;

    ctx.stroke();


    /* HP */

    const width =
      enemy.radius * 2.5;

    const hpRatio =
      Math.max(
        0,
        enemy.hp / enemy.maxHp
      );

    ctx.fillStyle =
      "rgba(0,0,0,.6)";

    ctx.fillRect(
      -width / 2,
      -enemy.radius - 10,
      width,
      4
    );

    ctx.fillStyle =
      enemy.boss
        ? "#ff405c"
        : "#2cff9a";

    ctx.fillRect(
      -width / 2,
      -enemy.radius - 10,
      width * hpRatio,
      4
    );

    ctx.restore();

  }

}


/* =========================================================
   DRAW PROJECTILES
========================================================= */

function drawProjectiles() {

  for (const p of game.projectiles) {

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = p.color;

    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;

    ctx.fill();

    ctx.shadowBlur = 0;

  }

}


/* =========================================================
   DRAW PARTICLES
========================================================= */

function drawParticles() {

  for (const p of game.particles) {

    ctx.globalAlpha =
      Math.max(
        0,
        p.life / 50
      );

    ctx.fillStyle = p.color;

    ctx.fillRect(
      p.x,
      p.y,
      p.size,
      p.size
    );

  }

  ctx.globalAlpha = 1;

}


/* =========================================================
   DRAW FLOATING TEXT
========================================================= */

function drawFloatingTexts() {

  ctx.textAlign = "center";
  ctx.font = "bold 13px Arial";

  for (const f of game.floatingTexts) {

    ctx.globalAlpha =
      Math.max(
        0,
        f.life / 60
      );

    ctx.fillStyle = f.color;

    ctx.fillText(
      f.text,
      f.x,
      f.y
    );

  }

  ctx.globalAlpha = 1;

}


/* =========================================================
   RENDER
========================================================= */

function render() {

  if (!ctx) return;

  ctx.clearRect(
    0,
    0,
    WORLD.width,
    WORLD.height
  );

  drawBackground();

  drawParticles();

  drawProjectiles();

  drawEnemies();

  drawPlayer();

  drawFloatingTexts();

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(time) {

  if (!game.running) {
    return;
  }

  const delta = Math.min(
    2,
    (time - game.lastTime) / 16.666 || 1
  );

  game.lastTime = time;

  if (!game.paused) {

    updatePlayer(delta);
    updateEnemies(delta);
    updateProjectiles(delta);
    updateParticles(delta);
    updateFloatingTexts(delta);

    render();

    updateHUD();

  }

  requestAnimationFrame(gameLoop);
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

  if (!canvas || !ctx) {
    console.error(
      "No se encontró gameCanvas."
    );
    return;
  }

  mainMenu?.classList.add("hidden");

  gameScreen?.classList.remove("hidden");

  game.running = true;
  game.paused = false;

  game.wave = 1;
  game.combo = 0;

  game.enemies = [];
  game.projectiles = [];
  game.particles = [];
  game.floatingTexts = [];

  game.player.x =
    WORLD.width / 2;

  game.player.y =
    WORLD.height / 2;

  game.player.angle = 0;

  saveData.hp = MAX_HP;
  saveData.energy = MAX_ENERGY;

  spawnWave();

  updateHUD();

  requestAnimationFrame(gameLoop);

  notify(
    "¡Bienvenido a SCORVEX G6!"
  );
}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

  game.running = false;

  game.paused = false;

  game.enemies = [];
  game.projectiles = [];

  saveData.hp = MAX_HP;
  saveData.energy = MAX_ENERGY;

  notify(
    `DERROTA — SCORE ${saveData.score}`
  );

  setTimeout(() => {

    gameScreen?.classList.add("hidden");
    mainMenu?.classList.remove("hidden");

  }, 1200);
}


/* =========================================================
   PAUSE
========================================================= */

function pauseGame() {

  if (!game.running) return;

  game.paused = true;

  $("pauseModal")?.classList.remove("hidden");
}


function resumeGame() {

  game.paused = false;

  $("pauseModal")?.classList.add("hidden");
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

  const weapon = getWeapon();
  const ability = getAbility();
  const armor = getArmor();

  if ($("sectorValue")) {
    $("sectorValue").textContent =
      String(saveData.sector).padStart(2, "0");
  }

  if ($("hpValue")) {
    $("hpValue").textContent =
      `${Math.ceil(saveData.hp)} / ${MAX_HP}`;
  }

  if ($("energyValue")) {
    $("energyValue").textContent =
      `${Math.ceil(saveData.energy)} / ${MAX_ENERGY}`;
  }

  if ($("xpValue")) {
    $("xpValue").textContent =
      `${Math.floor(saveData.xp)} / ${xpRequired()}`;
  }

  if ($("coinsValue")) {
    $("coinsValue").textContent =
      Math.floor(saveData.coins).toLocaleString();
  }

  if ($("crystalsValue")) {
    $("crystalsValue").textContent =
      Math.floor(saveData.crystals).toLocaleString();
  }

  if ($("scoreValue")) {
    $("scoreValue").textContent =
      Math.floor(saveData.score).toLocaleString();
  }

  if ($("comboValue")) {
    $("comboValue").textContent =
      `x${game.combo}`;
  }

  if ($("levelValue")) {
    $("levelValue").textContent =
      saveData.level;
  }

  if ($("waveValue")) {
    $("waveValue").textContent =
      game.wave;
  }

  if ($("weaponName")) {
    $("weaponName").textContent =
      weapon.name;
  }

  if ($("weaponStats")) {
    $("weaponStats").textContent =
      `ATK ${weapon.damage} • SPD ${weapon.speed}`;
  }

  if ($("abilityName")) {
    $("abilityName").textContent =
      ability.name;
  }

  if ($("abilityStatus")) {

    $("abilityStatus").textContent =
      game.player.abilityCooldown <= 0
        ? "LISTA"
        : `${Math.ceil(
            game.player.abilityCooldown / 30
          )}s`;

  }

  if ($("armorName")) {
    $("armorName").textContent =
      armor.name;
  }

  if ($("armorStats")) {
    $("armorStats").textContent =
      `DEF ${armor.defense}`;
  }

  if ($("medkitValue")) {
    $("medkitValue").textContent =
      saveData.medkits;
  }

  if ($("hpBar")) {
    $("hpBar").style.width =
      `${Math.max(
        0,
        saveData.hp / MAX_HP * 100
      )}%`;
  }

  if ($("energyBar")) {
    $("energyBar").style.width =
      `${Math.max(
        0,
        saveData.energy / MAX_ENERGY * 100
      )}%`;
  }

  if ($("xpBar")) {
    $("xpBar").style.width =
      `${Math.max(
        0,
        saveData.xp / xpRequired() * 100
      )}%`;
  }

  if ($("menuLevel")) {
    $("menuLevel").textContent =
      saveData.level;
  }

}


/* =========================================================
   MISSION
========================================================= */

function updateMission() {

  if (!$("missionText")) return;

  if (game.wave % 5 === 0) {

    $("missionText").textContent =
      "Derrota al jefe del sector.";

  } else {

    $("missionText").textContent =
      `Elimina a los enemigos de la oleada ${game.wave}.`;

  }

}


/* =========================================================
   BOSS UI
========================================================= */

function showBoss() {

  $("bossPanel")?.classList.remove("hidden");

  updateBossUI();
}


function hideBoss() {

  $("bossPanel")?.classList.add("hidden");
}


function updateBossUI() {

  if (!game.boss) return;

  const boss = game.boss;

  if ($("bossName")) {
    $("bossName").textContent =
      `BOSS — SECTOR ${saveData.sector}`;
  }

  if ($("bossHpText")) {
    $("bossHpText").textContent =
      `${Math.max(
        0,
        Math.ceil(boss.hp)
      )} / ${Math.ceil(boss.maxHp)}`;
  }

  if ($("bossBarFill")) {
    $("bossBarFill").style.width =
      `${Math.max(
        0,
        boss.hp / boss.maxHp * 100
      )}%`;
  }

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function notify(message, type = "normal") {

  const container =
    $("notificationContainer");

  if (!container) return;

  const element =
    document.createElement("div");

  element.className =
    "notification";

  if (type === "level") {
    element.style.borderLeftColor =
      "#ffd84d";
  }

  element.textContent = message;

  container.appendChild(element);

  setTimeout(() => {

    element.remove();

  }, 3400);

}


/* =========================================================
   SHOP
========================================================= */

function buyWeapon(id) {

  const weapon =
    weapons.find(w => w.id === id);

  if (!weapon) return;

  if (saveData.ownedWeapons.includes(id)) {

    equipWeapon(id);

    return;
  }

  if (saveData.coins < weapon.price) {

    notify("No tienes suficientes monedas.");

    return;
  }

  saveData.coins -= weapon.price;

  saveData.ownedWeapons.push(id);

  saveData.equippedWeapon = id;

  notify(
    `${weapon.name} adquirida.`
  );

  saveGame();

  updateHUD();
}


function buyAbility(id) {

  const ability =
    abilities.find(a => a.id === id);

  if (!ability) return;

  if (saveData.ownedAbilities.includes(id)) {

    equipAbility(id);

    return;
  }

  if (saveData.coins < ability.price) {

    notify("No tienes suficientes monedas.");

    return;
  }

  saveData.coins -= ability.price;

  saveData.ownedAbilities.push(id);

  saveData.equippedAbility = id;

  notify(
    `${ability.name} desbloqueada.`
  );

  saveGame();

  updateHUD();
}


function buyArmor(id) {

  const armor =
    armors.find(a => a.id === id);

  if (!armor) return;

  if (saveData.ownedArmors.includes(id)) {

    equipArmor(id);

    return;
  }

  if (saveData.coins < armor.price) {

    notify("No tienes suficientes monedas.");

    return;
  }

  saveData.coins -= armor.price;

  saveData.ownedArmors.push(id);

  saveData.equippedArmor = id;

  notify(
    `${armor.name} adquirida.`
  );

  saveGame();

  updateHUD();
}


function buyMedkit() {

  const price = 150;

  if (saveData.coins < price) {

    notify("No tienes suficientes monedas.");

    return;
  }

  saveData.coins -= price;

  saveData.medkits++;

  notify("Botiquín comprado.");

  saveGame();

  updateHUD();
}


/* =========================================================
   EQUIPMENT
========================================================= */

function equipWeapon(id) {

  if (!saveData.ownedWeapons.includes(id)) {
    return;
  }

  saveData.equippedWeapon = id;

  notify(
    `Equipaste ${getWeapon().name}.`
  );

  saveGame();

  updateHUD();
}


function equipAbility(id) {

  if (!saveData.ownedAbilities.includes(id)) {
    return;
  }

  saveData.equippedAbility = id;

  notify(
    `Equipaste ${getAbility().name}.`
  );

  saveGame();

  updateHUD();
}


function equipArmor(id) {

  if (!saveData.ownedArmors.includes(id)) {
    return;
  }

  saveData.equippedArmor = id;

  notify(
    `Equipaste ${getArmor().name}.`
  );

  saveGame();

  updateHUD();
}


/* =========================================================
   INVENTORY
========================================================= */

function openInventory() {

  openModal(
    "INVENTARIO",
    renderInventory()
  );

}


function renderInventory() {

  const weapon =
    getWeapon();

  const ability =
    getAbility();

  const armor =
    getArmor();

  return `
    <div class="inventory-tabs">
      <button class="active">
        EQUIPAMIENTO
      </button>
      <button>
        ARMAS (${saveData.ownedWeapons.length})
      </button>
      <button>
        HABILIDADES (${saveData.ownedAbilities.length})
      </button>
      <button>
        OBJETOS
      </button>
    </div>

    <div class="item-grid">

      <div class="item-card">
        <div class="item-icon">
          ${weapon.icon}
        </div>

        <h3>${weapon.name}</h3>

        <p>
          ATK ${weapon.damage}
          · SPD ${weapon.speed}
        </p>
      </div>

      <div class="item-card">
        <div class="item-icon">
          ${ability.icon}
        </div>

        <h3>${ability.name}</h3>

        <p>
          Poder ${ability.power}
        </p>
      </div>

      <div class="item-card">
        <div class="item-icon">
          🛡️
        </div>

        <h3>${armor.name}</h3>

        <p>
          Defensa ${armor.defense}
        </p>
      </div>

      <div class="item-card">
        <div class="item-icon">
          💊
        </div>

        <h3>Botiquines</h3>

        <p>
          Cantidad: ${saveData.medkits}
        </p>
      </div>

    </div>
  `;
}


/* =========================================================
   SHOP UI
========================================================= */

function openShop() {

  openModal(
    "TIENDA SCORVEX G6",
    renderShop()
  );

}


function renderShop() {

  const weaponCards =
    weapons.slice(0, 18).map(weapon => {

      const owned =
        saveData.ownedWeapons.includes(
          weapon.id
        );

      return `
        <div class="item-card">

          <div class="item-icon">
            ${weapon.icon}
          </div>

          <h3>
            ${weapon.name}
          </h3>

          <p style="color:${rarityColor(
            weapon.rarity
          )}">
            ${weapon.rarity.toUpperCase()}
          </p>

          <p>
            ATK ${weapon.damage}
            · SPD ${weapon.speed}
          </p>

          ${
            owned
              ? `
                <button
                  class="equip-btn"
                  onclick="equipWeapon('${weapon.id}')">
                  EQUIPAR
                </button>
              `
              : `
                <button
                  class="buy-btn"
                  onclick="buyWeapon('${weapon.id}')">
                  🪙 ${weapon.price}
                </button>
              `
          }

        </div>
      `;

    }).join("");


  return `

    <div class="shop-currency">

      <span>
        🪙
        <strong>
          ${saveData.coins.toLocaleString()}
        </strong>
      </span>

      <span class="crystals">
        💎
        <strong>
          ${saveData.crystals}
        </strong>
      </span>

    </div>

    <div class="inventory-tabs">

      <button class="active">
        ARMAS
      </button>

      <button>
        HABILIDADES
      </button>

      <button>
        ARMADURAS
      </button>

      <button>
        OBJETOS
      </button>

    </div>

    <div class="shop-grid">

      ${weaponCards}

      <div class="item-card">

        <div class="item-icon">
          💊
        </div>

        <h3>
          Botiquín
        </h3>

        <p>
          Recupera 35 HP.
        </p>

        <button
          class="buy-btn"
          onclick="buyMedkit()">

          🪙 150

        </button>

      </div>

    </div>

  `;
}


/* =========================================================
   CUSTOMIZATION
========================================================= */

function openCustomization() {

  const container =
    $("customizationContainer");

  if (!container) {

    openModal(
      "PERSONALIZACIÓN",
      renderCustomization()
    );

    return;
  }

  container.classList.remove(
    "hidden"
  );

  renderCustomizationPanel();

}


function renderCustomization() {

  return `
    <div class="customization-grid">

      <div class="custom-card">
        <div class="custom-icon">🧥</div>
        <h3>ROPA</h3>
        <p>Personaliza tu conjunto.</p>
      </div>

      <div class="custom-card">
        <div class="custom-icon">🪖</div>
        <h3>CABEZA</h3>
        <p>Equipamiento para la cabeza.</p>
      </div>

      <div class="custom-card">
        <div class="custom-icon">🎒</div>
        <h3>ACCESORIOS</h3>
        <p>Mochilas y accesorios.</p>
      </div>

      <div class="custom-card">
        <div class="custom-icon">✨</div>
        <h3>EFECTOS</h3>
        <p>Auras y efectos visuales.</p>
      </div>

    </div>
  `;
}


function renderCustomizationPanel(
  category = "outfit"
) {

  const container =
    $("customizationItems");

  if (!container) return;

  const data =
    customization[category];

  if (!data) return;

  container.innerHTML = "";

  data.forEach((item, index) => {

    const card =
      document.createElement("div");

    card.className =
      "customization-item";

    const selected =
      saveData.customization[category] === index;

    if (selected) {
      card.classList.add("selected");
    }

    if (category === "colors") {

      card.innerHTML = `
        <div
          class="color-choice ${
            selected ? "selected" : ""
          }"
          style="background:${item[1]}">
        </div>

        <div class="customization-item-name">
          ${item[0]}
        </div>
      `;

    } else {

      card.innerHTML = `
        <div class="customization-item-icon">
          ${item[1]}
        </div>

        <div class="customization-item-name">
          ${item[0]}
        </div>

        <div
          class="customization-item-rarity"
          style="color:${rarityColor(item[2])}">
          ${item[2].toUpperCase()}
        </div>
      `;

    }

    card.addEventListener(
      "click",
      () => {

        if (category === "colors") {

          saveData.customization.colors =
            item[1];

        } else {

          saveData.customization[category] =
            index;

        }

        renderCustomizationPanel(
          category
        );

        updateCharacterPreview();

      }
    );

    container.appendChild(card);

  });

}


function updateCharacterPreview() {

  const preview =
    $("characterPreview");

  if (!preview) return;

  const outfit =
    customization.outfit[
      saveData.customization.outfit
    ];

  const head =
    customization.head[
      saveData.customization.head
    ];

  const accessory =
    customization.accessories[
      saveData.customization.accessories
    ];

  const effect =
    customization.effects[
      saveData.customization.effects
    ];


  const headElement =
    preview.querySelector(
      ".character-head"
    );

  const bodyElement =
    preview.querySelector(
      ".character-body"
    );

  const legsElement =
    preview.querySelector(
      ".character-legs"
    );

  if (headElement) {
    headElement.textContent =
      head?.[1] || "🙂";
  }

  if (bodyElement) {
    bodyElement.textContent =
      outfit?.[1] || "🧥";
  }

  if (legsElement) {
    legsElement.textContent =
      accessory?.[1] || "👖";
  }

  preview.style.filter =
    `drop-shadow(
      0 0 28px
      ${saveData.customization.colors}
    )`;

  const glow =
    preview.querySelector(
      ".character-glow"
    );

  if (glow) {

    glow.style.background =
      saveData.customization.colors;

    glow.style.opacity =
      .12 + (
        saveData.customization.effects * .03
      );

  }

}


/* =========================================================
   MODAL
========================================================= */

function openModal(title, body) {

  const modal =
    $("modal");

  if (!modal) return;

  modal.classList.remove(
    "hidden"
  );

  if ($("modalTitle")) {
    $("modalTitle").textContent =
      title;
  }

  if ($("modalBody")) {
    $("modalBody").innerHTML =
      body;
  }

}


function closeModal() {

  $("modal")?.classList.add(
    "hidden"
  );

}


/* =========================================================
   MAP
========================================================= */

function openMap() {

  const sectors = [];

  for (let i = 1; i <= 9; i++) {

    const unlocked =
      i <= saveData.sector;

    sectors.push(`
      <div class="
        map-sector
        ${unlocked ? "" : "locked"}
        ${i === saveData.sector ? "active" : ""}
      ">

        <strong>
          SECTOR ${String(i).padStart(2, "0")}
        </strong>

        <span>
          ${
            unlocked
              ? "DESBLOQUEADO"
              : "BLOQUEADO"
          }
        </span>

      </div>
    `);

  }

  openModal(
    "MAPA",
    `<div class="map-grid">
      ${sectors.join("")}
    </div>`
  );

}


/* =========================================================
   MISSIONS
========================================================= */

function openMissions() {

  openModal(
    "MISIONES",
    `
      <div class="battle-card">

        <div class="battle-card-header">
          <strong>
            MISIÓN ACTUAL
          </strong>

          <span>
            OLEADA ${game.wave}
          </span>
        </div>

        <div class="battle-card-body">

          <div class="battle-stat">
            <span>Sector</span>
            <strong>${saveData.sector}</strong>
          </div>

          <div class="battle-stat">
            <span>Nivel</span>
            <strong>${saveData.level}</strong>
          </div>

          <div class="battle-stat">
            <span>Score</span>
            <strong>${saveData.score}</strong>
          </div>

          <div class="battle-stat">
            <span>Objetivo</span>
            <strong>
              Eliminar enemigos
            </strong>
          </div>

        </div>

      </div>
    `
  );

}


/* =========================================================
   SAVE BUTTON
========================================================= */

$("saveBtn")?.addEventListener(
  "click",
  saveGame
);


/* =========================================================
   INVENTORY BUTTON
========================================================= */

$("inventoryBtn")?.addEventListener(
  "click",
  openInventory
);


/* =========================================================
   SHOP BUTTON
========================================================= */

$("shopBtn")?.addEventListener(
  "click",
  openShop
);


/* =========================================================
   MAP BUTTON
========================================================= */

$("mapBtn")?.addEventListener(
  "click",
  openMap
);


/* =========================================================
   MISSIONS BUTTON
========================================================= */

$("missionsBtn")?.addEventListener(
  "click",
  openMissions
);


/* =========================================================
   PLAY BUTTON
========================================================= */

$("playBtn")?.addEventListener(
  "click",
  startGame
);


/* =========================================================
   PAUSE
========================================================= */

$("pauseBtn")?.addEventListener(
  "click",
  pauseGame
);

$("resumeBtn")?.addEventListener(
  "click",
  resumeGame
);

$("menuBtn")?.addEventListener(
  "click",
  () => {

    game.running = false;

    $("pauseModal")?.classList.add(
      "hidden"
    );

    gameScreen?.classList.add(
      "hidden"
    );

    mainMenu?.classList.remove(
      "hidden"
    );

  }
);

$("pauseMenuBtn")?.addEventListener(
  "click",
  () => {

    game.running = false;

    $("pauseModal")?.classList.add(
      "hidden"
    );

    gameScreen?.classList.add(
      "hidden"
    );

    mainMenu?.classList.remove(
      "hidden"
    );

  }
);


/* =========================================================
   CLOSE MODAL
========================================================= */

$("closeModal")?.addEventListener(
  "click",
  closeModal
);


/* =========================================================
   CUSTOMIZATION
========================================================= */

$("closeCustomization")?.addEventListener(
  "click",
  () => {

    $("customizationContainer")
      ?.classList.add("hidden");

  }
);


$("saveCustomizationBtn")?.addEventListener(
  "click",
  () => {

    saveGame();

    notify(
      "Diseño del personaje guardado."
    );

  }
);


$("resetCustomizationBtn")?.addEventListener(
  "click",
  () => {

    saveData.customization =
      JSON.parse(
        JSON.stringify(
          defaultSave.customization
        )
      );

    renderCustomizationPanel();

    updateCharacterPreview();

    notify(
      "Personalización restablecida."
    );

  }
);


/* =========================================================
   CUSTOMIZATION TABS
========================================================= */

document.addEventListener(
  "click",
  event => {

    const tab =
      event.target.closest(
        ".custom-tab"
      );

    if (!tab) return;

    const category =
      tab.dataset.customTab;

    document
      .querySelectorAll(".custom-tab")
      .forEach(button => {
        button.classList.remove(
          "active"
        );
      });

    tab.classList.add("active");

    renderCustomizationPanel(
      category
    );

  }
);


/* =========================================================
   OPEN CUSTOMIZATION WITH C KEY
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key.toLowerCase() === "c" &&
      game.running
    ) {

      openCustomization();

    }

  }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    const key =
      event.key.toLowerCase();

    game.keys[key] = true;

    if (
      key === " " ||
      key === "spacebar"
    ) {

      event.preventDefault();

      fireWeapon();

    }

    if (key === "q") {
      useAbility();
    }

    if (key === "h") {
      useMedkit();
    }

    if (key === "i") {
      openInventory();
    }

    if (key === "b") {
      openShop();
    }

    if (key === "escape") {

      if (game.paused) {
        resumeGame();
      } else {
        pauseGame();
      }

    }

  }
);


document.addEventListener(
  "keyup",
  event => {

    game.keys[
      event.key.toLowerCase()
    ] = false;

  }
);


/* =========================================================
   MOUSE
========================================================= */

if (canvas) {

  canvas.addEventListener(
    "mousemove",
    event => {

      const rect =
        canvas.getBoundingClientRect();

      const scaleX =
        WORLD.width / rect.width;

      const scaleY =
        WORLD.height / rect.height;

      game.mouse.x =
        (event.clientX - rect.left) *
        scaleX;

      game.mouse.y =
        (event.clientY - rect.top) *
        scaleY;

      game.player.angle =
        Math.atan2(
          game.mouse.y - game.player.y,
          game.mouse.x - game.player.x
        );

    }
  );


  canvas.addEventListener(
    "mousedown",
    () => {

      game.mouse.down = true;

      fireWeapon();

    }
  );


  canvas.addEventListener(
    "mouseup",
    () => {

      game.mouse.down = false;

    }
  );


  canvas.addEventListener(
    "mouseleave",
    () => {

      game.mouse.down = false;

    }
  );

}


/* =========================================================
   TOUCH — ATTACK
========================================================= */

if (canvas) {

  canvas.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      fireWeapon();

    },
    { passive: false }
  );

}


/* =========================================================
   SOUND SYSTEM
========================================================= */

let audioContext = null;

function getAudioContext() {

  if (!audioContext) {

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioCtx) return null;

    audioContext =
      new AudioCtx();

  }

  return audioContext;
}


function playTone(
  frequency = 440,
  duration = .08,
  type = "sine",
  volume = .035
) {

  if (!saveData.sound) return;

  const audio =
    getAudioContext();

  if (!audio) return;

  const oscillator =
    audio.createOscillator();

  const gain =
    audio.createGain();

  oscillator.type = type;

  oscillator.frequency.value =
    frequency;

  gain.gain.setValueAtTime(
    volume,
    audio.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    .001,
    audio.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audio.destination);

  oscillator.start();

  oscillator.stop(
    audio.currentTime + duration
  );

}


function playShotSound() {

  playTone(
    150 + Math.random() * 80,
    .06,
    "square",
    .025
  );

}


/* =========================================================
   MUSIC
========================================================= */

let musicTimer = null;

function startMusic() {

  if (!saveData.music) return;

  if (musicTimer) return;

  const notes = [
    220,
    277,
    330,
    370,
    440,
    370,
    330,
    277
  ];

  let index = 0;

  musicTimer = setInterval(() => {

    if (!game.running && mainMenu?.classList.contains("hidden") === false) {
      playTone(
        notes[index],
        .18,
        "sine",
        .012
      );
    }

    index =
      (index + 1) %
      notes.length;

  }, 360);

}


function stopMusic() {

  if (musicTimer) {

    clearInterval(musicTimer);

    musicTimer = null;

  }

}


$("musicBtn")?.addEventListener(
  "click",
  () => {

    saveData.music =
      !saveData.music;

    if (saveData.music) {
      startMusic();
      notify("Música activada.");
    } else {
      stopMusic();
      notify("Música desactivada.");
    }

    saveGame();

  }
);


$("musicGameBtn")?.addEventListener(
  "click",
  () => {

    saveData.music =
      !saveData.music;

    if (saveData.music) {
      startMusic();
    } else {
      stopMusic();
    }

    saveGame();

  }
);


$("soundBtn")?.addEventListener(
  "click",
  () => {

    saveData.sound =
      !saveData.sound;

    notify(
      saveData.sound
        ? "Sonido activado."
        : "Sonido desactivado."
    );

    saveGame();

  }
);


/* =========================================================
   BOOT
========================================================= */

function bootGame() {

  let progress = 0;

  const interval =
    setInterval(() => {

      progress +=
        Math.random() * 8 + 3;

      progress =
        Math.min(100, progress);

      if ($("loadingBar")) {

        $("loadingBar")
          .style.width =
          `${progress}%`;

      }

      if ($("loadingText")) {

        $("loadingText").textContent =
          progress < 30
            ? "Inicializando arena..."
            : progress < 60
              ? "Cargando arsenal..."
              : progress < 80
                ? "Cargando habilidades..."
                : "Preparando SCORVEX G6...";

      }

      if (progress >= 100) {

        clearInterval(interval);

        setTimeout(() => {

          bootScreen?.classList.add(
            "hidden"
          );

          mainMenu?.classList.remove(
            "hidden"
          );

          updateHUD();

          startMusic();

        }, 400);

      }

    }, 100);

}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeGame() {

  console.log(
    `SCORVEX ${VERSION} iniciado.`
  );

  console.log(
    `Armas disponibles: ${weapons.length}`
  );

  console.log(
    `Habilidades disponibles: ${abilities.length}`
  );

  console.log(
    `Armaduras disponibles: ${armors.length}`
  );

  updateHUD();

  bootGame();

}


/* =========================================================
   SAFETY CHECKS
========================================================= */

console.assert(
  weapons.length === 70,
  "SCORVEX G6 debe tener exactamente 70 armas."
);

console.assert(
  abilities.length === 90,
  "SCORVEX G6 debe tener exactamente 90 habilidades."
);

console.assert(
  armors.length >= 6,
  "SCORVEX G6 debe tener armaduras."
);

console.assert(
  canvas !== null,
  "No se encontró #gameCanvas."
);


/* =========================================================
   START
========================================================= */

initializeGame();


/* =========================================================
   END SCORVEX G6
========================================================= */
