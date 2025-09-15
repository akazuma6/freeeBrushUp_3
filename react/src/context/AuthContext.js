import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../config';

// 修正点: createContextにデフォルト値を設定します。
// これにより、Providerの外部でContextが呼び出された際のクラッシュを防ぎ、
// どの値が欠けているかを明確にします。
//nullはデフォルトの値
//作っているエラーをそうやって解消したか？？
//どうしてその課題を洗い出して、その機能でどうして解決できるとおもったのか
//大変だったのはどこ？どうして大変だったか？どうやって解決したか？
//この機能なんで必要と思ったの？
//まだ時間があるんだったらどんな機能を付けたい？
//インターンで学んだこと
//なにつくったことあるか
//5~7分でプロダクトの説明
// https://zenn.dev/idapan/articles/0a2053e54b41e0
const AuthContext = createContext({
    user: null,
    authToken: null,
    loginUser: async () => { console.error("loginUser関数が呼び出されました"); },
    logoutUser: () => { console.error("logoutUser関数が呼び出されました"); },
});

export default AuthContext;

//認証トークンを取得するためだけの関数
export const AuthProvider = ({ children }) => {
    const getInitialAuthToken = () => {
        try {
            const token = localStorage.getItem('authToken');
            return token ? JSON.parse(token) : null;
        } catch (error) {
            console.error("localStorageからauthTokenの取得に失敗しました", error);
            return null;
        }
    };

    const [authToken, setAuthToken] = useState(getInitialAuthToken);
    //コンポーネントが最初に画面に表示される一度だけ実行
    //authTokenの中身があればauthToken.accessをjwtで分析してその中身がuserの初期値になる
    const [user, setUser] = useState(() => (authToken ? jwtDecode(authToken.access) : null));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
//async関数で非同期処理をわかりやすくかいています。awaitに時間のかかる処理(APIレスポンスを受け取る処理)
//もしawaitがなかったら？
//axios.postは呼び出しベルを渡した瞬間に次の行に進んでしまうため、サーバーからの返事（response）がまだないのにif (response.status === 200)のような処理を行おうとして、エラーになってしまいます。
    const loginUser = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/token/`, {
                username: username,
                password: password,
            });
            if (response.status === 200) {
                const data = response.data;
                setAuthToken(data);
                const decodedUser = jwtDecode(data.access);
                console.log("Decoded JWT:", decodedUser); // Log decoded token for debugging
                setUser(decodedUser);
                localStorage.setItem('authToken', JSON.stringify(data));
                setLoading(false);
                return decodedUser; // ユーザーオブジェクトを返す
            }
            setLoading(false);
            return null; // ログイン失敗
        } catch (error) {
            console.error('Login失敗:', error);
            alert('ログインに失敗しました。従業員番号とパスワードを確認してください。');
            setLoading(false);
            return null; // ログイン失敗
        }
    };

    // ログアウト処理
    const logoutUser = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        navigate('/login');
    };


//このコンポーネントの外でも共有したいデータを指定
    const contextData = {
        user,
        authToken,
        loading,
        loginUser,
        logoutUser,
    };
    
    // アプリの初回読み込み時やトークンが変更された時にユーザー情報を更新し、
    // ローディング状態を管理します。
    useEffect(() => {
        if (authToken) {
            setUser(jwtDecode(authToken.access));
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [authToken]);


    return (
//loadingの仕組みがないと、アプリを開いた瞬間に、
//一瞬だけ「ログアウト状態」の画面が表示された後、すぐに「ログイン状態」の画面に切り替わる、というチラつき（Flicker）が発生する可能性があります。        
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

