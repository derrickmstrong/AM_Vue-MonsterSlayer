const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      battleLogs: [],
    };
  },

  // Actions app supports
  methods: {
    battleAction(who, what, value) {
      this.battleLogs.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    attackMonster() {
      // Current Round
      this.currentRound++;
      // attackValue
      const attackValue = getRandValue(5, 12);
      // Deduct monster health by attackValue
      this.monsterHealth -= attackValue;
      // attackPlayer should be triggered
      this.attackPlayer();
      // Log Move
      this.battleAction('Player', 'Attack', attackValue);
    },
    attackPlayer() {
      // attackValue
      const attackValue = getRandValue(8, 15);
      // Deduct monster health by attackValue
      this.playerHealth -= attackValue;
      // Log Move
      this.battleAction('Monster', 'Attack', attackValue);
    },
    specialAttackMonster() {
      // Current Round
      this.currentRound++;
      // attackValue
      const attackValue = getRandValue(10, 25);
      this.monsterHealth -= attackValue;
      // attackPlayer should be triggered
      this.attackPlayer();
      // Log Move
      this.battleAction('Player', 'Special Attack', attackValue);
    },
    healPlayer() {
      // Increment Round
      this.currentRound++;
      // Create healValue
      const healValue = getRandValue(8, 20);
      // Check that playerHealth doesn't exceed 100
      this.playerHealth + healValue > 100
        ? (this.playerHealth = 100)
        : (this.playerHealth += healValue);
      // Monster attacks
      this.attackPlayer();
      // Log Move
      this.battleAction('Player', 'Heal', healValue);
    },
    surrender() {
      this.winner = '😡 You Quit... Monster Wins!';
    },
    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.battleLogs = [];
    },
  },

  computed: {
    monsterHealthBarStyles() {
      return this.monsterHealth <= 0
        ? {
            width: '0%',
          }
        : {
            width: this.monsterHealth + '%',
          };
    },
    playerHealthBarStyles() {
      return this.playerHealth <= 0
        ? {
            width: '0%',
          }
        : {
            width: this.playerHealth + '%',
          };
    },
    specialAttackAvailable() {
      return this.currentRound % 3;
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // Draw
        this.winner = 'Draw!';
        this.monsterHealth = 0;
        this.playerHealth = 0;
      } else if (value <= 0) {
        // Player lost
        this.winner = 'Monster Won!';
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // Draw
        this.winner = 'Draw!';
        this.playerHealth = 0;
        this.monsterHealth = 0;
      } else if (value <= 0) {
        // Monster lost
        this.winner = 'Player Won!';
      }
    },
  },
}).mount('#game');

/* Function Declarations */
// Random attack value btw min and max
function getRandValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
