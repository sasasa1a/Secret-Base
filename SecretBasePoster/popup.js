// THIS IS popup.js
document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.local.get("storage_memory_post_table_name", function(value) {
        document.getElementById('input_form_movie_url').value = value.storage_memory_post_table_name;
        // alert(value.storage_memory_post_table_name)
    });


    var clicked = document.getElementById("clicked");
    clicked.addEventListener("click", clickBtn_post_comment);
});


function clickBtn_post_comment() {
    console.log("[INFO]Clicked");


    var txt_comment = document.getElementById("input_form_comment").value;
    var txt_table_name = document.getElementById("input_form_movie_url").value;
    // var txt_movie_time = document.getElementById("input_form_movie_time").value;

    let query = "";
    query = "https://api.hacku.gidai.me/ajax/post_comment/?input_data_comment=" + txt_comment + "&input_data_movie_url=" + txt_table_name + "&input_data_movie_time="
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
                alert("[完了]君のコメントは大海原へ")

                chrome.storage.local.set({ "storage_memory_post_table_name": txt_table_name }, function() {
                    console.log('DATA Stored', txt_table_name);
                });


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