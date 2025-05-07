function onLoad() {
    // Googleボタンのテキストを変更
    const googleButton = document.querySelector('#GoogleExchange');
    if (googleButton) {
      googleButton.textContent = 'Googleで続ける';
    }
    
    // プレースホルダーを変更して冗長性を解消
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.placeholder = 'example@domain.com';
    }
    
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.placeholder = '••••••••••';
    }
    
    // フォーム入力時のアニメーション
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transition = 'transform 0.2s ease';
        this.parentElement.style.transform = 'translateY(-2px)';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
      });
    });
  
    // 2番目の区切り線のテキストを変更
    const dividers = document.querySelectorAll('.divider');
    if (dividers.length > 1) {
      const secondDivider = dividers[1];
      if (secondDivider && secondDivider.querySelector('h2')) {
        secondDivider.querySelector('h2').textContent = 'またはアカウントがない場合';
      }
    }
  
    // アカウント登録エリアを修正
    const createDiv = document.querySelector('.create');
    if (createDiv) {
      // 既存のサインアップリンクへの参照を保持
      const signupLink = document.getElementById('createAccount');
      const signupHref = signupLink ? signupLink.getAttribute('href') : '';
      
      // 新しいコンテンツで置き換え
      createDiv.innerHTML = `
        <h1 class="signup-heading">アカウント登録</h1>
        <div class="signup-buttons">
          <button id="emailSignup" class="signupButton">メールアドレスで登録</button>
          <button id="googleSignup" class="signupButton googleButton">Googleで登録</button>
        </div>
      `;
      
      // サインインのh1と同じスタイルを適用
      const signupHeading = createDiv.querySelector('.signup-heading');
      if (signupHeading) {
        const mainHeading = document.querySelector('.heading h1');
        if (mainHeading) {
          // メインヘッダーのスタイルを取得して適用
          const computedStyle = window.getComputedStyle(mainHeading);
          signupHeading.style.fontSize = computedStyle.fontSize;
          signupHeading.style.fontWeight = computedStyle.fontWeight;
          signupHeading.style.color = computedStyle.color;
          signupHeading.style.marginBottom = '30px';
          signupHeading.style.textAlign = 'center';
        }
      }
      
      // メールアドレス登録ボタンのイベントリスナー
      const emailSignupBtn = document.getElementById('emailSignup');
      if (emailSignupBtn && signupHref) {
        // 背景色を白に設定
        emailSignupBtn.style.backgroundColor = 'white';
        
        emailSignupBtn.addEventListener('click', function() {
          window.location.href = signupHref;
        });
      }
      
      // Google登録ボタンのイベントリスナー
      const googleSignupBtn = document.getElementById('googleSignup');
      const googleBtn = document.getElementById('GoogleExchange');
      if (googleSignupBtn && googleBtn) {
        googleSignupBtn.addEventListener('click', function() {
          googleBtn.click();
        });
      }
    }
  }
  
  // スクリプト読み込み後に直接関数を実行
  onLoad();