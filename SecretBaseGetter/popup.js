// THIS IS popup.js
document.addEventListener("DOMContentLoaded", function() {
    var clicked = document.getElementById("clicked");
    clicked.addEventListener("click", clickBtn_post_comment);
});


function clickBtn_post_comment() {
    console.log("[INFO]Clicked");


    var txt_table_name = document.getElementById("input_table_name").value;
    // var txt_movie_time = document.getElementById("input_form_movie_time").value;

    let query = "";
    query = "https://api.hacku.gidai.me/ajax/?input_data_tablename=" + txt_table_name
        // 以下でQuery文をコンソールに表示します。
    console.log("[INFO] : Query : ", query);


    getJSON(query,
        function(err, json_data) {
            if (err !== null) {
                // APIのクエリに失敗した場合は通知を表示します。
                alert('Something went wrong: ' + err);
            } else {
                // 成功した場合
                console.log("[INFO] : API Execution Success.")


                chrome.storage.local.set({ "storage_table_name": txt_table_name }, function() {
                    console.log('DATA Stored', txt_table_name);
                });
                // chrome.storage.local.get("storage_table_name", function(value) {
                //     alert(value.storage_table_name)
                // });





                alert("[完了]運営に知られないことを祈る(｀･ω･´)ゞ\n次のパスを友だちと共有しよう！：" + txt_table_name)
            }
        });
    console.log("[INFO]AJAX AUG");

}

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