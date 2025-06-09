// userStore.js
// グローバルなユーザー情報を保持するためのシンプルなストア

// ユーザー情報を保持する変数
let currentUser = null;


// ユーザー情報をセットする関数
export function setUserInfo(user) {
    currentUser = user;
}

// ユーザー情報をクリアする関数
export function clearUserInfo() {
    currentUser = null;
}

// 現在のユーザー情報を取得する関数
export function getUserInfo() {
    return {
        user: currentUser,
    };
}
