class Button extends HTMLElement {
    constructor() {
        super();
        // 获取模板内容
        let template = document.getElementById('btn_tpl');
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const btn = document.createElement('button');
        btn.appendChild(templateContent.cloneNode(true));
        btn.setAttribute('class', 'tou-button');
        const type = {
            'primary': '#4e8afa',
            'warning': '#ffc442',
            'default': '#333'
        }
        const btnType = this.getAttribute('type') || 'default';
        const btnColor = btnType === 'default' ? '#888' : '#fff';

        const style = document.createElement('style');
        style.textContent = `
            .tou-button {
                position: relative;
                margin-right: 3px;
                display: inline-block;
                padding: 6px 20px;
                border-radius: 30px;
                background-color: ${type[btnType]};
                color: ${btnColor};
                outline: none;
                border: none;
                box-shadow: inset 0 5px 10px rgba(0,0,0, 0.3);
                cursor: point;
            }
        `;
        shadowRoot.appendChild(btn);
        shadowRoot.appendChild(style);
    }
}
customElements.define('tou-button', Button);