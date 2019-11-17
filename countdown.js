/**
 * Countdown Web Component
 * 
 * @param date ISO8601 compatible date string to countdown to
 */
class Countdown extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = this.render();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.completed = false;
        this.days = this.shadowRoot.getElementById('days');
        this.hours = this.shadowRoot.getElementById('hours');
        this.minutes = this.shadowRoot.getElementById('minutes');
        this.seconds = this.shadowRoot.getElementById('seconds');
    }

    update() {
        const currentDate = new Date();
        const milliseconds = this.date - currentDate;

        if (Math.sign(milliseconds) < 1) {
            this.completed = true;
            clearInterval(this.interval);
            this.render();

            return;
        }

        this.seconds.textContent = Math.floor((milliseconds / 1000) % 60);
        this.minutes.textContent = Math.floor((milliseconds / 1000 / 60) % 60);
        this.hours.textContent = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        this.days.textContent = Math.floor((milliseconds / (1000 * 60 * 60 * 24)));
    }

    connectedCallback() {
        this.date = new Date(this.getAttribute('date'));
        this.interval = setInterval(this.update.bind(this), 1000);
    }

    render() {
        console.log(this.completed);
        return `
            <style>
                :host {
                    display: flex;
                }

                :host div {
                    flex: 1 0 auto;
                    text-align: center;
                }

                .num {
                    font-weight: bold;
                    font-size: 6em;
                }

                .title {
                    font-size: 2.5em;
                }

                @media all and (max-width: 800px) {
                    .num {
                        font-size: 3em;
                    }

                    .title {
                        font-size: 1.5em;
                    }
                }

                @media all and (max-width: 450px) {
                    :host {
                        flex-flow: column;
                    }
                }
            </style>

            ${this.completed ? `
                <div>
                    <slot name="completed"></slot>
                </div>
            ` : `<div>
                    <p class="num" id="days">-</p>
                    <p class="title">Days</p>
                </div>
                <div>
                    <p class="num" id="hours">-</p>
                    <p class="title">Hours</p>
                </div>    
                <div>
                    <p class="num" id="minutes">-</p>
                    <p class="title">Minutes</p>
                </div>
                <div>
                    <p class="num" id="seconds">-</p>
                    <p class="title">Seconds</p>
                </div>
            `}
        `;
    }
}

customElements.define('countdown-timer', Countdown);