<?php
$title = "Thank you";
include 'header.php';
if (isset($_GET['confirmMsg'])){
    echo '<div class = "result">';
    echo $_GET['confirmMsg'];
    echo '</div>';
} else {
        echo 'Error: There was a problem';
    }
include 'footer.php';
?>