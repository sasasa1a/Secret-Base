// commentgetter.js
// このプログラムはAPIを自動で叩くJSです。以下コメントをご参照ください。

// getJSON関数です。APIを叩きHTTPレスポンスコード200を確認しコメントを返却します。
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};


// intervalCounr関数です。入力された秒数に1回、本関数が実行されます。
const intervalCount = async(ms, maxCnt) => {
    let count = 0;

    // 以下の関数がメイン処理です。以下を数秒に一回実行します。
    const _intervalCount = async() => {
        console.log("[INFO] : Program Begin. This Program Is Round ", count, ".");
        count++;


        await new Promise(resolve => {
            setTimeout(resolve, ms);
        });

        // formatDate関数です。現在時刻をぶち込むと本関数はフォーマットされた時刻情報を返却します。
        const formatDate = (current_datetime) => {
            let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + "T" + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
            return formatted_date;
        }

        // formatDate_query関数です。現在時刻をぶち込むと本関数はAPIを叩く用に秒数のみを数秒引いた上で、フォーマットされた時刻情報を返却します。
        const formatDate_query = (current_datetime) => {
            let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + "T" + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + (current_datetime.getSeconds() - 2);
            return formatted_date;
        }

        // 以下は現在時刻を取得、フォーマッター関数を実行する処理を行う構文です。
        var dt = new Date();
        dt = formatDate(dt);
        // 以下は現在時間を取得した上で、APIを叩く用の時刻情報を取得する構文です。
        var afew_seconds_ago = new Date();
        afew_seconds_ago = formatDate_query(afew_seconds_ago);

        // 以下は現在時刻、数秒前の時刻をコンソールに表示する構文です。
        console.log("[INFO] : Now Is ", dt);
        console.log("[INFO] : A Few Seconds Ago Is ", afew_seconds_ago);




        chrome.storage.local.get("storage_table_name", function(value) {


            // 以下はAPIを叩くQuery文を自動作文するプログラムです。
            let query = "";
            query = "https://api.hacku.gidai.me/ajax/inq_comment/?input_data_inq_movie_url=" + value.storage_table_name + "&input_data_inq_created_at=" + afew_seconds_ago + "&input_data_inq_movie_time="
                // 以下でQuery文をコンソールに表示します。
            console.log("[INFO] : Query : ", query);


            getJSON(query,
                function(err, json_data) {
                    if (err !== null) {
                        // APIのクエリに失敗した場合は通知を表示します。
                        alert('Something went wrong: ' + err);
                    } else {
                        // 成功した場合
                        console.log("[INFO] : API Execution Success. The Below Is Comment.")

                        // 以下でコメントを順にコンソールに表示します。そのためにまずコメントの要素数を取得する構文が含まれています。
                        var len = Object.keys(json_data).length;
                        for (i = 0; i < len; i++) {
                            console.log(json_data[i]);
                            // コメントが有った場合にはコメントを流す関数を引き出し、引数としてコメントデータを流します
                            flow_comment(json_data[i]);
                        }
                    }
                });
        });
        await _intervalCount();
    };
    await _intervalCount();
}


// main function関数です。以下のintervalMSに何秒のインターバルにするか設定します。1000で1秒でこの設定は変更しないことをおすすめします。
const main = async() => {
    const intervalMs = 1000;
    await intervalCount(intervalMs, 10);
}

// 各種設定
var tc = {
    settings: {
        keyBindings: [],
    },
    mediaType: []
};
var gottenname = "hakumai";
// メインプログラムトリガーです
main();

// コメントを流すメイン関数です
function flow_comment(gottencomment) {
    console.log("flow_comment AUG")

    initializeNow(window.document, gottencomment)

    console.log("flow_comment UGA")
}



//コメントを流すフレームとコメントの設定を行う
function initializeNow(document, gottencomment) {

    defineFrame();
    defineComment(gottencomment);
    var docs = Array(document);
    docs.push(window.top.document);

    var mediaTags = document.querySelectorAll("video,audio");
    mediaTags.forEach(function(video) {
        new tc.FrameArea(video);
    });

}


// コメントを流すフレームを決定
function defineFrame() {
    tc.FrameArea = function(target, parent) {
        tc.mediaType.push(target);
        this.video = target;
        this.parent = target.parentElement; //今より上のノードの取得

        var getKeyBd = function(action = "fast") {
            return tc.settings.keyBindings.find((item) => item.action === action);
        }
        var setKeyBd = function(action = "reset", value = "getKeyBd") {
            tc.settings.keyBindings.find((item) => item.action === action) = value;
        }

        this.initializeControls();
    };
}


// HTMLコードを生成
function defineComment(gottencomment) {
    tc.FrameArea.prototype.initializeControls = function() {
        var top = getRandomInt(10, 400) + "px";
        var left = 100 + "px";
        var wrapper = document.createElement("div");
        var shadow = wrapper.attachShadow({ mode: "open" });
        var shadowTemplate = `
      <style>
        @import "${chrome.runtime.getURL("shadow.css")}";
      </style>

      <div id="aaaa" style="top:${top}; left:${left};">
        <p>` +
            gottencomment +
            `       
      </div>

    `;
        shadow.innerHTML = shadowTemplate;
        var fragment = document.createDocumentFragment();
        fragment.appendChild(wrapper);
        this.parent.insertBefore(fragment, this.parent.firstChild);

    };
}

// 乱数を生成
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}