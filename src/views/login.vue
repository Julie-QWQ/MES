<template>
  <div class="login" @wheel="handleScroll">
    <div class="login-overlay"></div>

    <div class="login-container">
      <div class="login-left">
        <div class="text-flow-container">
          <div class="flow-track">
            <div class="flow-item">SMART FACTORY</div>
            <div class="flow-item">INTELLIGENT</div>
            <div class="flow-item">INDUSTRY 4.0</div>
            <div class="flow-item">MES SYSTEM</div>
            <div class="flow-item">DATA DRIVEN</div>
            <div class="flow-item">AUTOMATION</div>
            <div class="flow-item">DIGITAL TWIN</div>
            <div class="flow-item">REAL-TIME</div>
            <div class="flow-item">SMART FACTORY</div>
            <div class="flow-item">INTELLIGENT</div>
            <div class="flow-item">INDUSTRY 4.0</div>
            <div class="flow-item">MES SYSTEM</div>
          </div>
        </div>
        <div class="left-desc">
          <h2>生产执行管理系统</h2>
          <p>Manufacturing Execution System</p>
        </div>
      </div>

      <div class="login-right">
        
        <svg class="orbit-line" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg">
          <path id="orbitPath" d="M 450,-50 Q 50,400 450,850" fill="none" stroke="rgba(0, 242, 255, 0.4)" stroke-width="2" stroke-dasharray="10 6" />
          <circle r="4" fill="#00F2FF">
            <animateMotion dur="8s" repeatCount="indefinite">
              <mpath href="#orbitPath"/>
            </animateMotion>
          </circle>
        </svg>

        <div class="card-stack">
          
          <div class="auth-card login-card" :class="{ 'slide-out-top-right': !isLoginView, 'slide-in-center': isLoginView }">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="glass-form">
              <div class="form-header">
                <h3 class="title">USER LOGIN</h3>
                <span class="sub-title">系统登录 · System Login</span>
              </div>
              
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入账号">
                  <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码" @keyup.enter.native="handleLogin">
                  <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
              </el-form-item>
              
              <el-form-item prop="code" v-if="captchaOnOff" class="code-item">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" class="code-input" @keyup.enter.native="handleLogin">
                  <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                </div>
              </el-form-item>
              
              <div class="form-footer">
                <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
                <span class="switch-tip" @click="isLoginView = false">
                  <i class="el-icon-top"></i> 向上滚动注册
                </span>
              </div>
              
              <el-form-item style="width:100%; margin-top: 25px;">
                <el-button :loading="loading" size="medium" type="primary" class="action-btn" @click.native.prevent="handleLogin">
                  <span v-if="!loading">登  录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="auth-card register-card" :class="{ 'slide-in-center': !isLoginView, 'slide-out-bottom-right': isLoginView }">
            <el-form ref="registerForm" :model="registerForm" class="glass-form">
              <div class="form-header">
                <h3 class="title">NEW ACCOUNT</h3>
                <span class="sub-title">新用户注册 · Register</span>
              </div>

              <el-form-item>
                <el-input v-model="registerForm.username" placeholder="设置账号">
                  <i slot="prefix" class="el-icon-user input-icon"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="registerForm.password" type="password" placeholder="设置密码">
                  <i slot="prefix" class="el-icon-lock input-icon"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码">
                  <i slot="prefix" class="el-icon-lock input-icon"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="registerForm.mobile" placeholder="手机号码">
                  <i slot="prefix" class="el-icon-mobile-phone input-icon"></i>
                </el-input>
              </el-form-item>

              <div class="form-footer">
                <span class="switch-tip" @click="isLoginView = true" style="margin-left: auto; width: 100%; text-align: right;">
                  <i class="el-icon-bottom"></i> 向下滚动登录
                </span>
              </div>

              <el-form-item style="width:100%; margin-top: 25px;">
                <el-button :loading="regLoading" size="medium" type="primary" class="action-btn" @click.native.prevent="handleRegister">
                  <span v-if="!regLoading">注  册</span>
                  <span v-else>提 交 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>

        </div>
      </div>
    </div>

    <div class="el-login-footer">
      <span @click="toIPC">陕ICP备2022002135号-1</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      isLoginView: true, 
      scrollTimer: null,
      
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
        password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        mobile: ""
      },
      
      loading: false,
      regLoading: false,
      captchaOnOff: true,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    handleScroll(e) {
      if (this.scrollTimer) return;
      this.scrollTimer = setTimeout(() => {
        this.scrollTimer = null;
      }, 400);

      if (e.deltaY < 0) {
        if (this.isLoginView) this.isLoginView = false;
      } 
      else if (e.deltaY > 0) {
        if (!this.isLoginView) this.isLoginView = true;
      }
    },

    toIPC(){
      window.open("https://beian.miit.gov.cn/","_blank");
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              this.getCode();
            }
          });
        }
      });
    },
    handleRegister() {
      this.regLoading = true;
      setTimeout(() => {
        this.regLoading = false;
        const success = Math.random() > 0.1;
        if(success) {
            this.$message.success("注册成功！请登录");
            this.isLoginView = true; 
        } else {
            this.$message.error("演示环境：注册模拟失败，请重试");
        }
      }, 1000);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@keyframes scrollText {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); } 
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.login-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at center, rgba(16, 23, 41, 0.7) 0%, rgba(11, 15, 25, 0.95) 100%);
  z-index: 1;
}

.login-container {
  position: relative;
  z-index: 10;
  display: flex;
  width: 85%;
  max-width: 1300px;
  height: 75vh;
  min-height: 600px;
}

/* 左侧样式 */
.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden; 
  padding-right: 60px;
  
  .text-flow-container {
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    z-index: 0;
    opacity: 0.12; 
    overflow: hidden;
    mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
    pointer-events: none;
  }

  .flow-track {
    animation: scrollText 50s linear infinite; 
  }

  .flow-item {
    font-size: 80px;
    font-weight: 900;
    line-height: 1.2;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    font-family: 'Segoe UI', sans-serif;
    white-space: nowrap;
    letter-spacing: 2px;
  }

  .left-desc {
    position: relative;
    z-index: 2;
    padding-left: 25px;
    border-left: 5px solid;
    border-image: linear-gradient(to bottom, #475569, #94a3b8) 1; 
    
    h2 {
      font-size: 48px;
      margin: 0;
      font-weight: 700;
      color: #fff;
      letter-spacing: 3px;
      text-shadow: 0 4px 15px rgba(0,0,0,0.6);
    }
    
    p {
      font-size: 22px;
      margin: 12px 0 0 0;
      color: rgba(255,255,255,0.7);
      letter-spacing: 6px;
      font-weight: 300;
      text-transform: uppercase;
    }
  }
}

/* --- 右侧交互区域 --- */
.login-right {
  flex: 1;
  position: relative;
  perspective: 1200px;
}

.orbit-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 120%;
  z-index: 0;
  opacity: 0.8; /* 增加透明度，让亮蓝更明显 */
  pointer-events: none;
}

.card-stack {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  position: absolute;
  width: 420px;
  transition: all 0.9s cubic-bezier(0.68, -0.3, 0.3, 1.2); 
  backface-visibility: hidden;
}

/* --- 卡片核心样式 --- */
.glass-form {
  padding: 45px 40px;
  border-radius: 12px;
  
  /* 1. 改为深色背景，无模糊 */
  background: rgba(11, 17, 33, 0.9); 
  /* 移除 backdrop-filter */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  
  /* 2. 边框保持左侧线条颜色一致 */
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.slide-in-center {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  z-index: 10;
  pointer-events: auto;
}

.slide-out-top-right {
  opacity: 0;
  transform: translate3d(350px, -500px, -200px) scale(0.6) rotate(-20deg);
  z-index: 0;
  pointer-events: none;
}

.slide-out-bottom-right {
  opacity: 0;
  transform: translate3d(350px, 500px, -200px) scale(0.6) rotate(20deg);
  z-index: 0;
  pointer-events: none;
}

/* 内部元素 */
.form-header {
  text-align: center;
  margin-bottom: 30px;
  .title {
    margin: 0;
    color: #e2e8f0; 
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 2px;
  }
  .sub-title {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
  }
}

.el-input {
  .el-input__prefix {
    display: flex;
    align-items: center;
    height: 100%;
    left: 12px;
  }
  input {
    height: 44px; 
    background: rgba(0, 0, 0, 0.2); 
    border: 1px solid rgba(255, 255, 255, 0.1); 
    color: #cbd5e1;
    border-radius: 4px; 
    padding-left: 42px !important;
    transition: all 0.3s ease;
    &::placeholder { color: rgba(148, 163, 184, 0.3); }
    
    &:hover { 
      background: rgba(0, 0, 0, 0.3); 
      border-color: rgba(255, 255, 255, 0.2); 
    }
    &:focus { 
      background: rgba(0, 0, 0, 0.4); 
      border-color: #475569; 
    }
  }
  .input-icon {
    color: rgba(255, 255, 255, 0.3);
    width: 16px; height: 16px;
    transition: color 0.3s;
  }
  &.is-focus .input-icon { color: #cbd5e1; }
}

.code-item {
  .el-form-item__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .code-input { width: 60%; }
}

.login-code {
  width: 35%; height: 44px;
  img {
    width: 100%; height: 100%;
    cursor: pointer;
    border-radius: 4px;
    opacity: 0.7;
    &:hover { opacity: 0.9; }
  }
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5px;
  
  .el-checkbox__label { color: rgba(255, 255, 255, 0.5); font-size: 13px; }
  .el-checkbox__input.is-checked + .el-checkbox__label { color: #94a3b8; }
  .el-checkbox__inner { background: transparent; border-color: rgba(255, 255, 255, 0.3); }
  .el-checkbox__input.is-checked .el-checkbox__inner { background-color: #475569; border-color: #475569; }
  
  .switch-tip {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: color 0.3s;
    &:hover { color: #fff; }
    i { margin-right: 2px; }
  }
}

/* 按钮样式：保持暗淡 */
.action-btn {
  width: 100%; height: 46px;
  font-size: 16px; font-weight: 500; letter-spacing: 4px;
  border-radius: 4px;
  background: #1e293b; 
  border: 1px solid #334155; 
  color: #cbd5e1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: #334155;
    border-color: #475569;
    color: #fff;
  }
  &:active { 
    transform: scale(0.99); 
    background: #0f172a;
  }
}

.el-login-footer {
  height: 40px; line-height: 40px; position: fixed; bottom: 0; width: 100%;
  text-align: center; color: rgba(255, 255, 255, 0.2); font-family: Arial; font-size: 12px;
  z-index: 10; cursor: pointer;
  &:hover { color: rgba(255, 255, 255, 0.5); }
}

@media (max-width: 992px) {
  .login-left { display: none; }
  .login-container { width: 95%; justify-content: center; }
  .login-right { perspective: none; } 
  .auth-card { position: relative; transform: none !important; opacity: 1 !important; display: none; }
  .slide-in-center { display: block; }
  .orbit-line { display: none; }
}
</style>
