'use strict';

$(document).ready(() => {
  $('.deleteContact').on('click', (event) => {
    $.ajax({
      url: '/contact/delete/' + event.target.dataset.id,
      type: 'DELETE'
    }).done((result) => {
      location.reload();
    }).fail((jqXHR, status, textStatus) => {
      toastr.error(textStatus);
    });
  });

  $('#updateContactForm').on('submit', (event) => {
    let form = $('#updateContactForm');
    console.log(getFormData(form))
    event.preventDefault();
    $.ajax({
      url: '/contact/update/' + form.data().id,
      type: 'PUT',
      data: getFormData(form)
    }).done((result) => {
      window.location.href = '/contacts';
    }).fail((jqXHR, status, textStatus) => {
      toastr.error(textStatus);
    });
  });

});

function getFormData ($form) {
  var unindexedArray = $form.serializeArray();
  var indexedArray = {};
  $.map(unindexedArray, (n, i) => {
    indexedArray[n['name']] = n['value'];
  });
  return indexedArray;
}
