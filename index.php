<?php
  include_once("php/util.php");

  $keycode = getKeycode($_SERVER["HTTP_USER_AGENT"]);
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Classy</title>

    <!-- Meta tags -->
    <meta name="robots" content="index, follow, archive">
    <meta name="description" content="Easily search by department, distribs, periods, and medians to find the perfect class.">
    <meta charset="utf-8" />
    <meta http-equiv="Cache-control" content="public">
    <!-- old -->
    <meta name="google-site-verification" content="9U8kYC24rUGX98pnl1EDy0A4tY4EE8DxFAvpPwNNAEs" />
    <!-- new -->
    <meta name="google-site-verification" content="SmeVIjL9gg0LUuOrJ-ozBhozzBg0ZpmSZ_u86do4Y7U" />

    <!-- Semantic Markup -->
    <meta property="og:title" content="Classy">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://alexbeals.com/projects/classes/images/header_dark.jpg">
    <meta property="og:url" content="https://alexbeals.com/projects/classes">
    <meta property="og:description" content="Easily search by department, distribs, periods, and medians to find the perfect class.">

    <meta name="twitter:card" content="summary">
    <meta name="twitter:creator" content="@alex_beals">

    <!-- Google Analytics -->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-70745807-1', 'auto');
      ga('send', 'pageview');
    </script>

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="images/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="images/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="images/favicons/manifest.json">
    <link rel="mask-icon" href="images/favicons/safari-pinned-tab.svg" color="#222222">
    <link rel="shortcut icon" href="images/favicons/favicon.ico">
    <meta name="msapplication-config" content="images/favicons/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">

    <?php
      if (preg_match("/(iPhone|iPod|iPad|Android|BlackBerry|Mobile)/i", $_SERVER['HTTP_USER_AGENT'])) {
        ?><meta name="viewport" content="width=570"><?php
      }
    ?>
    <script>
      <?php
        $departmentOptions = "<optgroup disabled hidden></optgroup>";
        foreach ($departments as $code => $name) {
          $departmentOptions .= "<option value='$code'>$name ($code)</option>";
        }

        $distributiveOptions = "<optgroup disabled hidden></optgroup>";
        foreach ($distribs as $code => $name) {
          $distributiveOptions .= "<option value='$code'>$name</option>";
        }

        $periodOptions = "<optgroup disabled hidden></optgroup>";
        foreach ($periods as $code => $name) {
          $periodOptions .= "<option value='$code'>$name</option>";
        }

        $medianOptions = "<optgroup disabled hidden></optgroup>";
        foreach ($medians as $code => $value) {
          $medianOptions .= "<option vallue='$code'>$code</option>";
        }
      ?>
      var departmentOptions = "<?php echo $departmentOptions; ?>;";
      var distributiveOptions = "<?php echo $distributiveOptions; ?>;";
      var periodOptions = "<?php echo $periodOptions; ?>";
      var medianOptions = "<?php echo $medianOptions; ?>";
    </script>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/chosen/1.6.2/chosen.jquery.min.js"></script>
    <script src="js/main.js"></script>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/chosen/1.6.2/chosen.min.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
  </head>
  <body>
    <div class="container">
      <div id="search">
        <form>
          <img class="header" src="images/header.png" alt="Logo">

          <p class="overview">
            Classy is a way of searching for classes based on departments, distribs, periods, and medians.  It allows you to find the best fits for <i>you</i> based on your priorities in a course.
          </p>

          <h4>Criteria and Points Explanation</h4>
          <div>
            <p>
              You can build a search by using criteria.  You can add a criteria for the <strong>department</strong>, <strong>distrib</strong>, <strong>period</strong>, or <strong>median</strong>.  For each criteria, you can then choose one or more of the choices, and give it a number of points.  Classes that meet elements of each criteria will be given the number of points for that criteria, and the top classes will be returned, sorted by median.  If you're only searching for one criteria, the number of points is irrelevant.
            </p>
            <p>
              A sample search is displayed below, with an ECON class being most important (3 points), the 'LIT' distrib being second most important (2 points), and the time blocks '10' and '11' least important (1 point).
            </p>
          </div>

          <div id="criteria" class="row">
          </div>
          <button type="button" onClick="addCriteria()" class="btn btn-secondary add">Add New Criteria</button>

          <h4>Filtering Past Classes</h4>
          <p>
            This is optional, and slightly technical.  If you don't feel comfortable with computers, feel free to skip this.  <strong>Additionally, this is <i>not</i> possible on mobile.</strong>
          </p>
          <a href onClick="return toggleBannerText(this);">Show Scraping Steps</a>
          <div id="scrapingSteps" style="display: none;">
            <p>
              You can choose to scrape the classes you've already taken from Dartmouth.  This will prevent it from suggesting classes you've already taken.  The only information it will take is the department, class #, and name of each class you've taken.
            </p>
            <ol>
              <li>
                Click the below code, and copy it.<br>
                <code id="js">
                  prompt('Copy to DartClasses', document.cookie.split(';')[3].slice(8)); window.close();
                </code>
              </li>
              <li>
                Click the following link, and log into Banner:  <strong><a href="javaScript:void(0);" onClick="openBanner()">Log In</a></strong>
              </li>
              <li>
                Open the Developer view by pressing <code><?php echo $keycode; ?></code>, paste the code you copied in step 1 into the new tab, and hit 'Enter'.  (It will pop up a window with text selected.  Copy that <i>new</i> text and hit 'Enter').
              </li>
              <li>
                Paste the newly copied text into the Session ID input.
              </li>
            </ol>
            <div class="form-group">
              <label for="sessid">Session ID (get from above instructions)</label>
              <input type="text" class="form-control" placeholder="RS2JLz19CpZzQkXcHr==" name="sessid" spellcheck="false">
            </div>
          </div>
          <button type="submit" class="btn btn-primary search">Search</button>
        </form>
      </div>

      <div id="classes"></div>
    </div>

    <footer>
      <p>
        Made by <a href="//alexbeals.com">Alex Beals</a> '18.
      </p>
    </footer>
  </body>
</html>
