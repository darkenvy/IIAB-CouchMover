document.addEventListener("DOMContentLoaded", function() {
  var el = document.getElementById('items');
  var sortable = Sortable.create(el); // jshint ignore:line

  document.getElementById('submit').addEventListener('click', function() {
    var finalOrder = [];
    var list = document.getElementById('items').children
    for (var i=0; i<list.length; i++) finalOrder.push(list[i].innerText);
    console.log(finalOrder)

    // AJAX setup
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/update');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      if (xhr.status === 200) console.log('success!')
      else console.log('unsuccessful');
    };
    xhr.send(encodeURI('order=' + JSON.stringify(finalOrder)));
    // xhr.send(JSON.stringify(finalOrder))


  })
});