function customMenu() {
    var allMenuItems = document.querySelectorAll(".menu");
    var myUrl = window.location.href;
    var foundIt = false;
    for (var i = 0; i < allMenuItems.length; i++) {
        var finder = myUrl.indexOf(allMenuItems[i].href);
        if(finder > -1) {
            foundIt = true;
            document.getElementById(allMenuItems[i].id).style.color = "#BBB";
            console.log("BBB");
        } else {
            allMenuItems[i].style.color = "#FFF";
            console.log("FFF");
        }
    } if (foundIt === false) {
        document.getElementById("index").style.color = "#BBB";
        console.log("Did not find it");
    }
}