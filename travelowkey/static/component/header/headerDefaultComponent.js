const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = ` 
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Inter";
}

html {
  font-size: 12px;
}

body {
  position: relative;
}

.container-fluid {
  width: 100%;
}

.container {
  width: 80%;
  padding: auto;
  margin: auto;
}

.btn-default {
  display: flex;
  width: 12.5rem;
  height: 3.5rem;
  padding: 1.25rem 1rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-shrink: 0;
  cursor: pointer;
  text-decoration: none;
  border-radius: 0.7rem;
  border: 0.1rem solid #ffffff;
}
.btn-default .text {
  text-align: right;
  font-size: 1.5rem;
  font-weight: 500;
}

.btn-default:hover {
  opacity: 0.8;
}

.btn-default:active {
  opacity: 0.6;
}

.header-space {
  height: 9rem;
  background-color: aqua;
}

.header-container {
  background-color: #fff;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: flex-start;
  transition: 0.3s;
  box-shadow: 0px 4px 4px 1px rgba(0, 0, 0, 0.25);
}
.header-container .header__top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}
.header-container .header__top-content a {
  text-decoration: none;
}
.header-container .header__top-content a:visited {
  text-decoration: none;
}
.header-container .header__top-content .top-content__brand-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-container .header__top-content .top-content__brand-container .brand-container__brand-logo {
  width: 8rem;
  background: rgba(165, 165, 165, 0);
  display: flex;
  flex-direction: column;
  gap: 0.83333rem;
}
.header-container .header__top-content .top-content__brand-container .brand-container__brand-logo img {
  width: 100%;
  height: auto;
}
.header-container .header__top-content .top-content__brand-container .brand-container__brand-name {
  display: flex;
  width: 12.5rem;
  height: 3rem;
  align-items: center;
  padding: 0.8rem;
}
.header-container .header__top-content .top-content__brand-container .brand-container__brand-name .text {
  font-size: 2.5rem;
  font-style: italic;
  font-weight: 700;
  color: #000;
}
.header-container .header__top-content .top-content__account-btn-group {
  display: flex;
  align-items: flex-start;
  gap: 1.66667rem;
}
.header-container .header__top-content .top-content__account-btn-group .account-btn-group__login-btn {
  border-radius: 0.7rem;
  border: 1px solid #236eff;
  gap: 1rem;
}
.header-container .header__top-content .top-content__account-btn-group .account-btn-group__login-btn .text {
  color: rgba(35, 110, 255, 0.8);
  font-weight: 700;
}
.header-container .header__top-content .top-content__account-btn-group .account-btn-group__login-btn .login-btn__icon {
  font-size: 2rem;
  color: rgba(35, 110, 255, 0.8);
}
.header-container .header__top-content .top-content__account-btn-group .account-btn-group__register-btn {
  border-radius: 0.7rem;
  background: rgba(35, 110, 255, 0.8);
}
.header-container .header__top-content .top-content__account-btn-group .account-btn-group__register-btn .text {
  color: #fff;
  font-weight: 700;
}
.header-container .header__navbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 0.5rem;
  a: visited;
  a-color: #545d61;
  a-text-decoration: none;
}
.header-container .header__navbar a {
  text-decoration: none;
}
.header-container .header__navbar .navbar__item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18rem;
  height: 5.5rem;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  cursor: pointer;
}
.header-container .header__navbar .navbar__item .text {
  flex: 1 0 0;
  color: #545d61;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
}
.header-container .header__navbar .navbar__item:hover {
  background: rgba(0, 0, 0, 0.2);
}
.header-container .header__navbar .navbar__item:active {
  background: rgba(0, 0, 0, 0.4);
}

@media only screen and (max-width: 900px) {
  .header-container .header__top-content .top-content__brand-container .brand-container__brand-name {
    display: none;
  }
  .header-container .header__top-content .top-content__account-btn-group .account-btn-group__sign-up-btn {
    display: none;
  }
}/*# sourceMappingURL=header.css.map */
</style>
<div id="header" class="container-fluid header-container">
        <div class="container header__top-content">
            <a class="top-content__brand-container" href="#">
                <div class="brand-container__brand-logo">
                    <img class="brand-logo" src="../../../static/images/logo.png" alt="">
                </div>
                <div class="brand-container__brand-name">
                    <p class="text">Travelowkey</h1>
                </div>"
            </a>
            <div class="top-content__account-btn-group">
                <a class="btn-default account-btn-group__login-btn" href="/user/login">
                    <ion-icon class="login-btn__icon" name="person-outline"></ion-icon>
                    <div class="text">Login</div>
                </a>
                <a class="btn-default account-btn-group__register-btn" href="/user/signup">
                    <div class="text">Register</div>
                </a>
            </div>
        </div>
        <nav class="container header__navbar">
            <a class="navbar__item" href="#">
                <div class="text">
                    Ve may bay
                </div>
            </a>
            <a class="navbar__item" href="#">
                <div class="text">
                    Ve xe khach
                </div>
            </a>
            <a class="navbar__item" href="#">
                <div class="text">
                    Xe dich vu
                </div>
            </a>
            <a class="navbar__item" href="#">
                <div class="text">
                    Khach san
                </div>
            </a>
        </nav>
    </div>
    <div class="header-space"></div>
`;
class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.appendChild(headerTemplate.content);
  }
}
customElements.define('header-component', Header);

