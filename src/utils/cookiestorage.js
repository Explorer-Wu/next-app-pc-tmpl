export default {
    getTime: function (str){
        var str_n = Number(str.substring(1, str.length));
        var str_t = str.substring(0, 1);
        if (str_t === "s") {
            return str_n * 1000;
        } else if (str_t === "h") {
            return str_n * 60 * 60 * 1000;
        } else if (str_t === "d") {
            return str_n * 24 * 60 * 60 * 1000;
        }
    },
    setCookie: function (name, value, time) {
        let endTime = this.getTime(time);
        let now = new Date();
        now.setTime(now.getTime() + endTime * 1);
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + now.toUTCString();
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    },
    // function getCookie(cname){
    //     var name = cname + "=";
    //     var ca = document.cookie.split(';');
    //     for(var i=0; i<ca.length; i++) {
    //         var c = ca[i].trim();
    //         if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    //     }
    //     return "";
    // }
    delCookie: function(name) {
        var now = new Date();
        now.setTime(now.getTime() - 1);
        var cook_name = this.getCookie(name);
        if (cook_name != null)
            document.cookie = name + "=" + cook_name + ";expires=" + now.toUTCString();
    },
    checkCookie: function (){
        let user = getCookie("username");
        if (user != ""){
            alert("欢迎 " + user + " 再次访问");
        } else {
            user = prompt("请输入你的名字:","");
            if (user!="" && user!=null){
                setCookie("username", user, 30);
            }
        }
    },
    setSession: function(name, value) {
        sessionStorage.setItem(name, value);
    },
    getSession: function (name) {
        let newName = sessionStorage.getItem(name);
        if (newName)
            return decodeURIComponent(newName);
        else
            return null;
    },
    delSession: function(name) {
        let newName = sessionStorage.getItem(name);
        if (newName != null) sessionStorage.removeItem(name);
    }
}

