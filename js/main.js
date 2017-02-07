var CLASS_DEBUG_FLAG = false;

// Adds a new row of criteria to the form
function addCriteria(type, vals, points) {
  var newRow =  
    '<div class="criteria col-xs-6 col-md-12">' + 
      '<div class="col-md-3">' + 
        '<div class="form-group">' + 
          '<label>Criteria Type</label>' + 
          '<select name="type" class="form-control" required>' + 
            '<option value="departments">Departments</option>' + 
            '<option value="distributives">Distributives</option>' + 
            '<option value="periods">Periods</option>' + 
            '<option value="medians">Medians</option>' + 
          '</select>' + 
        '</div>' + 
      '</div>' + 
      '<div class="col-md-6">' + 
        '<div class="form-group">' + 
          '<label>Choices</label>' + 
          '<select name="choices" class="form-control" multiple required data-placeholder="Select Some Choices">';
  if (!type || type == 'departments') {
    newRow += departmentOptions;
  } else if (type == 'distributives') {
    newRow += distributiveOptions;
  } else if (type == 'periods') {
    newRow += periodOptions;
  } else if (type == 'medians') {
    newRow += medianOptions;
  }
  newRow+='</select>' + 
        '</div>' + 
      '</div>' + 
      '<div class="col-md-2">' + 
        '<div class="form-group">' + 
          '<label>Points</label>' + 
          '<input name="weight" class="form-control" type="number" min="1" placeholder="Any number" required>' + 
        '</div>' + 
      '</div>' + 
      '<div class="col-md-1">' + 
        '<div class="form-group">' + 
          '<label class="empty">&nbsp;</label>' + 
          '<button type="button" class="btn btn-primary delete">&nbsp;<svg height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g fill="#37404D"><path d="M445 67h-99.5V47c0-22-17.8-39.7-39.7-39.7h-99.4c-22 0-39.7 17.8-39.7 39.7v20H67.4v19.8h20.4l20 377.5c0 22 17.7 39.7 39.7 39.7H366c22 0 39.7-17.8 39.7-39.7l19.6-377.5H445v-20zM186.5 47c0-11 9-19.8 19.8-19.8h99.4c11 0 19.8 9 19.8 19.8v20h-139V47zM386 463.2v1.1c0 11-9 19.8-20 19.8H147.5c-11 0-20-8.8-20-19.7v-1.1L107.8 86.8h297.7L386 463.2z"/><path d="M246.2 126.5h20v318h-20zM207 443.8l-20.4-317.3-20 1.3L187.2 445M345.6 127l-19.8-1-20 317.8 19.8 1.2"/></g></svg></button>' + 
        '</div>' + 
      '</div>' + 
    '</div>';

  var rowElem = $.parseHTML(newRow);
  $('#criteria').append(rowElem);

  // Handle optional default parameters
  if (type) {
    $(rowElem).find('select[name="type"] option[value="' + type + '"]').prop('selected', true);
  }
  if (vals) {
    for (var i = 0; i < vals.length; i++) {
      $(rowElem).find('select[name="choices"] option[value="' + vals[i] + '"]').prop('selected', true);
    }
  }
  if (points) {
    $(rowElem).find('input[name="weight"]').val(points);
  }

  $(rowElem).find('select').chosen({
    search_contains: true,
    width: '100%',
  });

  // Add a listener to update the choices
  $(rowElem).find('select[name="type"]').on('change', function() {
    var selected = $(this).val();
    if (selected == 'departments') {
      $(rowElem).find('select[name^="choices"]').html($.parseHTML(departmentOptions));
    } else if (selected == 'distributives') {
      $(rowElem).find('select[name^="choices"]').html($.parseHTML(distributiveOptions));
    } else if (selected == 'periods') {
      $(rowElem).find('select[name^="choices"]').html($.parseHTML(periodOptions));
    } else if (selected == 'medians') {
      $(rowElem).find('select[name^="choices"]').html($.parseHTML(medianOptions));
    }
    $(rowElem).find('select[name^="choices"]').trigger('chosen:updated');
  });

  // Add a listener to delete the row
  $(rowElem).find('button').on('click', function() {
    $(rowElem).remove();
  });
}

// Opens banner (maybe could be leveraged to run some code)
function openBanner() {
  var banner = window.open('//dartmouth.edu/bannerstudent','_blank');
  return false;
}

// Handles formatting the class results
function formatClasses(classes) {
  if (!!CLASS_DEBUG_FLAG) {
    console.log(classes);
  }
  var classText = '';
  if (classes.length == 0) {
    classText = '<div class="class text-center">No search results found.</div>';
  } else {
    for (var i = 0; i < classes.length; i++) {
      var c = classes[i];
      classText += 
        '<div class="class">' +
          '<div class="title"><span>' + c.department + ' ' + c.class + '</span> - ' + c.title + '</div>' + 
          '<div class="teacher">' + c.teacher + '</div>' + 
          '<div class="distribs">';
      for (var j = 0; j < c.distribs.length; j++) {
        classText += 
            '<span>' + c.distribs[j] + '</span>';
      }
      classText += 
          '</div>' + 
          '<div class="prereqs">Prereqs: ' + c.prereqs + '</div>' + 
          '<div class="description">' + c.description + '</div>' + 
          '<div class="median length-' + c.median.length + '">' + c.median + '</div>' + 
          '<div class="period">' + c.period + '</div>' + 
        '</div>';
    }
  }
  $('#classes').html(classText);
}

function toggleBannerText(self) {
  if ($(self).html() == 'Show Scraping Steps') {
    $(self).html('Hide Scraping Steps');
    $('#scrapingSteps').slideDown(200);
  } else {
    $(self).html('Show Scraping Steps');
    $('#scrapingSteps').slideUp(200);
  }
  return false;
}

$(document).ready(function() {
  // Handle Chosen.js override to support 'required' (adapted from github issue: https://github.com/harvesthq/chosen/issues/515#issuecomment-104602031)
  $.fn.oldChosen = $.fn.chosen;
  $.fn.chosen = function(options) {
    var select = $(this), is_creating_chosen = !!options
    if (is_creating_chosen && select.css('position') === 'absolute') { select.removeAttr('style'); }
    var ret = select.oldChosen(options)
    if (is_creating_chosen && select.css('display') === 'none') {
      select.attr('style','display:visible; position:absolute; clip:rect(0,0,0,0); height:34px;');
      select.attr('tabindex', -1);
    }
    return ret;
  };

  // Start off with default criteria
  addCriteria('departments', ['ECON'], 3);
  addCriteria('distributives', ['LIT'], 2);
  addCriteria('periods', ['10','11'], 1);

  // Handles click to select on the javascript code
  $('code#js').on('click', function() {
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents($(this)[0]);

    selection.removeAllRanges();
    selection.addRange(range);
  });

  // Handles validation of session ID if pasted
  var checkingValidity = false;
  $('input[name="sessid"]').on('input', function(e) {
    var input = $(this);
    if (input.val() == "") {
      input.removeAttr('validity');
      input[0].setCustomValidity('');
    } else if (!checkingValidity) {
      checkingValidity = true;
      $.post('php/validate.php', {
        sessid: $(this).val(),
      }, function(data) {
        if (!!CLASS_DEBUG_FLAG) {
          console.log(data);
        }
        if (data == 'valid') {
          input.attr('validity', 'valid');
          input[0].setCustomValidity('');
        } else {
          input.attr('validity', 'invalid');
          input[0].setCustomValidity('This session token is invalid.  Please retry the steps.  If you don\'t want to use this option, just delete all text in the input.');
          input[0].reportValidity();
        }
        checkingValidity = false;
      })
    }
  });

  // Handles submitting the form
  $('form').submit(function(e) {
    e.preventDefault();

    var criteria = [];
    var rawCriteria = $('.row.criteria');

    for (var i = 0; i < rawCriteria.length; i++) {
      criteria.push({
        type: $(rawCriteria[i]).find('select[name="type"]').val(),
        value: $(rawCriteria[i]).find('select[name="choices"]').val(),
        weight: $(rawCriteria[i]).find('input[name="weight"]').val(),
      });
    }

    $('#classes').html('');

    $.post('php/search.php', {
      criteria: criteria,
      sessid: $('form input[name="sessid"]').val(),
    }, function(data) {
      if (!!CLASS_DEBUG_FLAG) {
        console.log(data);
      }
      formatClasses(JSON.parse(data));
    });
  });
});