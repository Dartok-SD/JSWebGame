<?php
    $name = $email = $password = $comment = $confirm = $message = $list = "";
    $arrayList = array();
    $classes = array();
    $selectedIndex = 0;
    $selectedQuarter = "blank";
    $checked = false;
    $passwordSimilarity = "";
    $alert = "";
    $nameErr = $emailErr = $passwordErr = $confirmErr = $quarterErr = $checkedErr = $commentErr = "";
//    $disabled = true;
    $midtermForm = "Submit Contact Form";
    $count = 0;
//    if(isset($_POST["firstName"]) && isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["confirm"]) &&
//        isset($_POST["selectQuarter"]) && isset($_POST["checkbox"]) && isset($_POST["comment"])){
//        $name = $_POST["firstName"];
//        $email = $_POST["email"];
//        $password = $_POST["password"];
//        $confirm = $_POST["confirm"];
//        $midtermForm = selectedIndexFinder($_POST["selectQuarter"]);
//        $selectedQuarter = $_POST["selectQuarter"];
//        $checked =  ($_POST["checkbox"] == "on" ? true : false);
//        $comment = $_POST["comment"];
//        if($_POST["confirm"] == ""){
//            $passwordSimilarity = "";
//        } else if($_POST["confirm"] == $_POST["password"]){
//            $passwordSimilarity = "matching";
//        } else {
//            $passwordSimilarity = "not matching";
//        }
//        $list = "";
//        $arrayList = array();
//        if(isset($_POST["experience"])){
//            for($i = 0; $i < count($_POST["experience"]);$i++){
//                $newId = "experience".$i;
//                $arrayList[] = '<li id = "li' .$i.'">' .'<label for="' . $newId . '">Class:</label><input type = "test"' .
//                    ' name = "experience[]" id = "' . $newId . '" value="'. $_POST["experience"][$i] .'"><button type = "button" class = "delete" ' .
//                    'onClick="deleteThisField('. "'" .$i . "'" .')" >Delete class</button>><span class="error"></span><br></li>';
//                $list .=  $arrayList[$i];
//            }
//            $count = count($_POST["experience"]);
//        }
//
//    }
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $errors = false;
        $alert = validateForm();
    }
    function selectedIndexFinder($checkbox){
        switch($checkbox){
            case "winter":
                return "Winter Submit Contact Form";
            case "spring":
                return "Spring Submit Contact Form";
            case "summer":
                return "Summer Submit Contact Form";
            case "fall":
                return "Fall Submit Contact Form";
            default:
                return "Submit Contact Form";
        }
    }
    function validateForm(){
        global $name, $email, $password, $confirm, $message, $list, $arrayList,
               $selectedQuarter, $checked, $passwordSimilarity, $midtermForm, $classes, $count, $comment, $nameErr,
               $emailErr, $passwordErr, $confirmErr, $quarterErr, $checkedErr, $commentErr, $errors;
        $nameErr = $emailErr = $passwordErr = $confirmErr = $quarterErr = $checkedErr = $commentErr = "";
        if(empty($_POST['firstName'])){
            $nameErr = "Missing name field. \n";
            $errors = true;
        } else {
            $name = scrubInput($_POST['firstName']);
            if(!preg_match("/^[a-zA-Z \'\-]*$/",$name)){
                $nameErr = "Only whitespace, characters, ' or - allowed\n";
                $errors = true;
            }
        }
        if(empty($_POST['email'])){
            $emailErr = "Missing email field. \n";
            $errors = true;
        } else {
            $email = scrubInput($_POST['email']);
            if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
                $emailErr = "Needs a valid email.\n";
                $errors = true;
            }
        }
        if(empty($_POST['password'])){
            $passwordErr = "Missing password field. \n";
            $errors = true;
        } else {
            $password = scrubInput($_POST['password']);
        }
        if(empty($_POST['confirm'])){
            $confirmErr = "Missing confirm field. \n";
            $errors = true;
        } else {
            $confirm = scrubInput($_POST['confirm']);
        }
        if(empty($_POST['selectQuarter'])){
            $quarterErr = "Please select a quarter. \n";
            $errors = true;
        } else {
            if($_POST['selectQuarter'] == "blank"){
                $quarterErr = "Please select a quarter. \n";
                $errors = true;
            } else {
                $midtermForm = selectedIndexFinder($_POST["selectQuarter"]);
                $selectedQuarter = scrubInput($_POST["selectQuarter"]);
            }
        }
        if(empty($_POST["checkbox"])){
            $checkedErr = "Please actually check the checkbox. \n";
            $errors = true;
        } else {
            $checked =  ($_POST["checkbox"] == "on" ? true : false);
        }
        if(empty($_POST["comment"])){
            $commentErr = "Please Write a message\n";
            $errors = true;
        } else {
            $comment = scrubInput($_POST["comment"]);
        }
        if($password != $confirm){
            $passwordSimilarity = "not matching";
            $errors = true;
        } else {
            $passwordSimilarity = "matching";
        }
        if(isset($_POST["experience"])){
            $arrayList = array();
            $classes = array();
            for($i = 0; $i < count($_POST["experience"]);$i++){
                array_push($classes, $_POST["experience"][$i]);
                $newId = "experience".$i;
                $arrayList[] = '<li id = "li' .$i.'">' .'<label for="' . $newId . '">Class:</label><input type = "test"' .
                    ' name = "experience[]" id = "' . $newId . '" value="'. $_POST["experience"][$i] .'"><button type = "button" class = "delete" ' .
                    'onClick="deleteThisField('. "'" .$i . "'" .')" >Delete class</button>><span class="error"></span><br></li>';
                $list .=  $arrayList[$i];
            }
            $count = count($_POST["experience"]);
        }
        if($errors == false){
            $summary = "<div id = 'results'><h2>Thank you for participating $name</h2><p>You will see a 
                confirmation message in your email.</p><br>
                Summary of your input: <br>". $email . "<br>" . $password. "<br>". $selectedQuarter . "<br>" . $comment . "<br> And classes: ";
            for($i = 0; $i < count($classes); $i++){
                $summary .= $classes[$i] . "<br>";
            }
            $summary .= "<br>";
//            echo $summary;
            header('Location: thankYou.php?confirmMsg='.urlencode($summary));
            return "Success!" . $summary;
        } else {
            return "Please correct the errors listed above";
        }


    }
    function scrubInput($data){
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
?>
<link href="midterm.css" rel="stylesheet" type="text/css">
<script>
    var count = <?php echo $count; ?>;

    function addField(){
        var newId = "experience"+count;
        var newElem = document.createElement("li");
        newElem.setAttribute('id','li'+count);
        newElem.innerHTML = '<label for="' + newId + '">Class:</label><input type = "test"' +
            'name = "experience[]" id = "' + newId + '"value=""><button type = "button" class = "delete" ' +
            'onClick="deleteThisField('+ "'" +count + "'" +')" >Delete class</button>><span class="error"></span><br>';
        var container = document.getElementById("extra");
        container.appendChild(newElem);
        document.getElementById(newId).focus();
        count++;
    }
    function deleteThisField(elementId) {
        var e = document.querySelector(".classes");
        var child = document.getElementById("li"+ elementId);
        e.removeChild(child);
        // Hurts runtime complexity but I'm not sure how else to do it:
        for(var i = parseInt(elementId)+1; i < count; i++) {
            var changeElem = document.getElementById("li" + i);
            var newId = "experience" + (i-1);
            var oldElem = document.getElementById("experience"+i);
            changeElem.setAttribute('id','li'+(i-1));
            changeElem.innerHTML = '<label for="' + newId + '">Class:</label><input type = "test"' +
                'name = "experience[]" id = "' + newId + '"value="' + oldElem.value + '"><button type = "button" class = "delete" ' +
                'onClick="deleteThisField('+ "'" +(i-1) + "'" +')" >Delete class</button><span class="error"></span><br>';
        }
        count--;
        var newId = "experience"+(count-1);
        var focusElem = document.getElementById(newId);
        if (focusElem != null) {
            focusElem.focus();
        }
    }

    function clearForm(){

        document.getElementById("firstName").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirm").value = "";
        document.getElementById("selectQuarter").selectedIndex = 0;
        document.getElementById("checkbox").checked = false;
        document.getElementById('message').innerHTML = "";
        document.getElementById("mySubmit").disabled = true;
        document.getElementById("mySubmit").style.color = "#AAA";
        document.getElementById("midtermForm").innerHTML = "Submit Contact Form";
        document.getElementById("extra").innerHTML = "";
        count = 0;
    }

    function startHere() {
        if(document.getElementById("checkbox").checked) {
            document.getElementById("mySubmit").disabled = false;
            document.getElementById("mySubmit").style.color = "#000";
        } else {
            document.getElementById("mySubmit").disabled = true;
            document.getElementById("mySubmit").style.color = "#AAA";
        }
    }

    function checkSelect(el) {
        switch(el) {
            case "blank":
                document.getElementById("midtermForm").innerHTML = "Submit Contact Form";
                break;
            case "winter":
                document.getElementById("midtermForm").innerHTML = "Winter Submit Contact Form";
                break;
            case "spring":
                document.getElementById("midtermForm").innerHTML = "Spring Submit Contact Form";
                break;
            case "summer":
                document.getElementById("midtermForm").innerHTML = "Summer Submit Contact Form";
                break;
            case "fall":
                document.getElementById("midtermForm").innerHTML = "Fall Submit Contact Form";
                break;
            default:

        }
    }

    function checkMatch() {
        if (document.getElementById("confirm").value === document.getElementById("password").value) {
            document.getElementById('message').style.color = 'green';
            document.getElementById('message').innerHTML = 'matching';
        } else{
            document.getElementById('message').style.color = 'red';
            document.getElementById('message').innerHTML = 'not matching';
        }
        if(document.getElementById("confirm").value === "") {
            document.getElementById('message').innerHTML = "";
        }
    }
    function iAgree() {
        if(document.getElementById("checkbox").checked) {
            document.getElementById("mySubmit").disabled = false;
            document.getElementById("mySubmit").style.color = "#000";
        } else {
            document.getElementById("mySubmit").disabled = true;
            document.getElementById("mySubmit").style.color = "#AAA";
        }
    }
    function checkForm() {
        // var completed = (document.getElementById("firstName").value !== "") && (document.getElementById("email").value !== "") &&
        //     (document.getElementById("password").value !== "") && (document.getElementById("confirm").value !== "") && document.getElementById("checkbox").checked
        //     && document.getElementById("selectQuarter").selectedIndex !== 0;
        // var isCorrect =  (document.getElementById("confirm").value === document.getElementById("password").value);
        // if(!completed) {
        //     alert("Please fill in all the fields");
        // } else {
        //     if(!isCorrect) {
        //         alert("Your passwords are different");
        //     } else {
        //         alert("Success");
        //     }
        // }
    }
</script>

<div class="part1">

    <?php echo '<span class="error">'.$alert.'</span>';?>

    <h2 id="midtermForm">
        <?php echo $midtermForm;?>
    </h2>
    <p >
    </p>
    <form name="test1" action="<?php
    echo htmlspecialchars($_SERVER['PHP_SELF']);?>"  method="POST" novalidate>

        <label for="firstName">Your Name: </label><br>
        <input type="text" name="firstName" id="firstName" value="<?php echo $name;?>"><br>
        <span class="error"> <?php echo $nameErr;?></span>

        <label for="email" >Your Email: </label><br>
        <input type="email" name="email" id="email" value="<?php echo $email;?>"><br>
        <span class="error"> <?php echo $emailErr;?></span>

        <label for="password" >Password: </label><br>
        <input type="password" name="password" id="password" value="<?php echo $password;?>"><br>
        <span class="error"> <?php echo $passwordErr;?></span>

        <span <?php if($passwordSimilarity=="matching") {echo "style='color: green;'";}
        if($passwordSimilarity=="not matching") {echo "style='color: red;'";}?>class="message" id='message'><?php echo $passwordSimilarity;?></span>

        <label for="confirm" >Confirm: </label><br>
        <input type="password" name="confirm" id="confirm" onkeyup="checkMatch()" value="<?php echo $confirm;?>"><span id="confirmMsg"></span><br>
        <span class="error"> <?php echo $confirmErr;?></span>

        <label for="selectQuarter"></label><select name = "selectQuarter" onchange="checkSelect(this.value)" id="selectQuarter">
            <option <?php if($selectedQuarter=="blank")      echo 'selected="selected" '; ?>id="blank" value="blank">Please select</option>
            <option <?php if($selectedQuarter=="winter")      echo 'selected="selected" '; ?>id="winter" value="winter">Winter</option>
            <option <?php if($selectedQuarter=="spring")      echo 'selected="selected" '; ?>id="spring" value="spring">Spring</option>
            <option <?php if($selectedQuarter=="summer")      echo 'selected="selected" '; ?>id="summer" value="summer">Summer</option>
            <option <?php if($selectedQuarter=="fall")      echo 'selected="selected" '; ?>id="fall" value="fall">Fall</option>
        </select>
        <span class="error"> <?php echo $quarterErr;?></span>
        <div class="part2">
            <p><input type="button" value="Add Class" onclick="addField()"></p>
            <ul class="classes" id="extra"> <?php echo $list;?></ul>
        </div>
        <br>
        <input name = "checkbox" type="checkbox" id="checkbox" onclick="iAgree()" <?php echo ($checked == true?'checked="checked"':'') ?>> I agree
        <span class="error"><?php echo $checkedErr;?></span>
        <p>Message:<br>
            <textarea id="comment" name="comment" ><?php echo $comment;?></textarea></p>
        <span class="error"><?php echo $commentErr;?></span>
        <p>
            <input type="button" onclick="clearForm()" value="Clear Form" />
            <input type="submit" name="Submit" onclick="checkForm()" value="Send Form" id="mySubmit" >
        </p>
    </form>

</div>
<script>
    startHere();
</script>
