Vue.component('warship', {
    props: ['id', 'icon', 'mirror', 'state', 'colors', 'underattack', 'attacking', 'attacker'],
    template: document.getElementById('warship').innerHTML,
    data: () => ({
        i: 1,
        ended: true,
    }),
    methods: {
        end() {
            this.ended = true;
            setTimeout(() => this.$refs.el.classList.remove('opacity-80'), 800);
        },
        changeClick() {
            this.i = ++this.i
            if (this.i > 6) this.i = 1;;
        }
    },
    watch: {
        state() {
            if (!this.ended) return;
            this.ended = false;
            this.$refs.el.classList.add('opacity-80');
        },
    },
    mounted() {
        this.i = this.icon || '1';
        this.$refs['el'].addEventListener('transitionend', () => this.end());
    },
});