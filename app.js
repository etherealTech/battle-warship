const searchParams = new URLSearchParams(window.location.search);

new Vue({
    data: {
        playable: true,
        playerA: 'Blue',
        playerB: 'Red',
        number: undefined,
        turnA: true,
        damage: null,
        playWithBot: false,
        underAttackA: false,
        underAttackB: false,
        attacker: null,
        a: { 1: 0, 3: 0, 5: 0, 7: 0, 9: 0 },
        b: { 1: 0, 3: 0, 5: 0, 7: 0, 9: 0 },

        uid: window.uid,
        team: searchParams.has('team') ? searchParams.get('team') : 'b',
        roomId: searchParams.has('roomId') ? searchParams.get('room') : null,

        ref: undefined,
    },
    methods: {
        async random() {
            if (!this.playable) return;
            if (this.team === 'a' && !this.turnA) return;
            if (this.team === 'b' && this.turnA) return;
            this.damage = null;

            if (this.turnA) {
                let odd = Object.entries(this.a).filter(([, v]) => v != -1).map(([k]) => k);
                this.number = odd[Math.floor(Math.random() * odd.length)];
                this.a[this.number]++;
                this.turnA = false;
            } else {
                let odd = Object.entries(this.b).filter(([, v]) => v != -1).map(([k]) => k);
                this.number = odd[Math.floor(Math.random() * odd.length)];
                this.b[this.number]++;
                this.turnA = true;
            }

            await this.update();

            this.compute();
        },
        async compute() {
            let [a, b] = [[], []];
            for (let i in this.a) {
                this.a[i] > 3 && a.push(i);
            }
            for (let i in this.b) {
                this.b[i] > 3 && b.push(i);
            }
            a.length && this.makeMoveByA(...a);
            b.length && this.makeMoveByB(...b);
            // this.playWithBot && this.checkToPlayByBot(a, b);
            await this.update();
        },
        async makeMoveByA(i) {
            let t = Object.entries(this.b).sort(([, a], [, b]) => b - a)[0][0];
            this.playable = false;
            this.underAttackB = true;
            this.attacker = i;
        },
        async makeMoveByB(i) {
            let t = Object.entries(this.b).sort(([, a], [, b]) => b - a)[0][0];
            this.playable = false;
            this.underAttackA = true;
            this.attacker = i;
        },
        async attackTarget(id) {
            if (!(this.underAttackA || this.underAttackB)) return;
            let attacker = this.underAttackA ? this.b : this.a;
            let defender = this.underAttackA ? this.a : this.b;
            if (!(id in defender)) return;
            attacker[this.attacker] = 0;
            defender[id] = -1;
            this.underAttackA = this.underAttackB = false;
            this.playable = true;
            this.attacker = null;
            await this.update();
        },
        async update() {
            let data = {
                playable: this.playable || false,
                number: this.number || null,
                turnA: this.turnA || false,
                underAttackA: this.underAttackA || false,
                underAttackB: this.underAttackB || false,
                attacker: this.attacker || null,
                a: this.a || null,
                b: this.b || null,
            };

            this.ref.update({
                [this.uid]: {
                    team: this.team,
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                },
                data
            }).then(() => {
                this.ref.child('data').on('value', (snap) => {
                    let d = snap.val()
                    Object.entries(d).forEach(([k, v]) => {
                        this[k] = v;
                    });
                    this.a = this.a.filter(x => x !== undefined);
                    this.b = this.b.filter(x => x !== undefined);
                })
            });
        },
        async listenFirebaseEvents() {
            // sessionStorage.setItem('__team', this.team);
            // sessionStorage.setItem('__room', this.roomId);

            this.ref = dbRef.child(this.roomId);

            await this.update();

            window.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        ((this.team === 'a' && this.turnA) || (this.team === 'b' && !this.turnA)) && this.random();
                        break;
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        let n = parseInt(e.key);
                        if (this.team === 'a' && this.underAttackB) {
                            let x = this.b;
                            if (!(n in x)) return;
                            x[n] != -1 && this.attackTarget(n);
                        } else if (this.team === 'b' && this.underAttackA) {
                            let x = this.a;
                            x[n] != -1 && this.attackTarget(n);
                        }
                        break;
                }
            });
        },
        registerControlsForOffline() {
            window.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'z':
                        this.turnA && this.random();
                        break;
                    case 'Enter':
                        this.turnA || this.random();
                        break;
                    case ' ':
                        this.random()
                        break;
                    case '1':
                    case '3':
                    case '5':
                    case '7':
                    case '9':
                        let n = parseInt(e.key);
                        let x = this[this.underAttackA ? 'a' : 'b'];
                        x[n] != -1 && this.attackTarget(n);
                        break;
                }
            });
        },
        registerControlsForOnline() {
            if (!this.roomId) {
                dbRef.push().then(snap => {
                    this.team = 'a';
                    this.roomId = snap.key;
                    this.listenFirebaseEvents();
                });
            } else {
                this.listenFirebaseEvents();
            }
        },
        checkToPlayByBot(a, b) {
            if (!this.turnA && !(a.length && b.length)) {
                this.playable = false;
                setTimeout(() => {
                    this.playable = true;
                    this.random();
                }, Math.random() * 1000 + 800);
            }
        },

    },
    beforeMount() {
        this.registerControlsForOnline();
    }
}).$mount('main');

