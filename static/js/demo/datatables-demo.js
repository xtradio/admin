// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable( {
    dom: 'Bfrtip',
    select: {
      style: 'single'
    },
    buttons: [
      {
        // text: 'Edit',
        titleAttr: "Edit",
        enabled: false,
        className: "fas fa-pen button",
        tag: "button",
        action: function () {
          // var count = table.rows( { selected: true } ).count();
          var row = this.rows( { selected: true } );

          var filename = row.data()[0]["filename"];
          var id = row.data()[0]["id"];
          var artist = row.data()[0]["artist"];
          var title = row.data()[0]["title"];
          var share = row.data()[0]["share"];
          var length = row.data()[0]["lenght"];
          var image = row.data()[0]["image"];

          $("#artist").val(artist);
          $("#title").val(title);
          $("#filename").val(filename);
          $("#image").attr('src', image);
          $("#share").val(share);
          $("#length").val(toS(length));

          $("#editModal").modal('toggle');
        }
      },
      {
        // text: 'Queue',
        titleAttr: "Queue",
        enabled: false,
        className: "fas fa-play button",
        tag: "button",
        action: function () {
          // var count = table.rows( { selected: true } ).count();
          var row = this.rows( { selected: true } );

          var filename = row.data()[0]["filename"];
          // var id = row.data()[0]["id"];
          var artist = row.data()[0]["artist"];
          var title = row.data()[0]["title"];
          var share = row.data()[0]["share"];
          var length = row.data()[0]["lenght"];
          // var image = row.data()[0]["image"];

          var formData = new FormData();
          formData.append("artist", artist);
          formData.append("title", title);
          formData.append("share", share);
          formData.append("filename", filename);
          formData.append("length", length);
          // formData.append("image", image);

          $.ajax({
            url: '/v1/song/queue',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            success: function(data){
              response = JSON.parse(data)
              notification(response.response, response.reason, "info");
            }
        });
        }
      },
      {
        // text: 'Edit',
        titleAttr: "Info",
        enabled: true,
        className: "fas fa-info button",
        tag: "button",
        action: function () {
          // var count = table.rows( { selected: true } ).count();
          $("#editModal").modal('toggle');
        }
      },
    ],
    ajax: '/v1/song/list',
    dataSrc: 'data',
    columns: [{ data: 'image' },
              { data: 'id' },
              { data: 'filename'},
              { data: 'title' },
              { data: 'artist' },
              { data: 'lenght' },
              { data: 'share' },
              { data: 'playlist'}],
    columnDefs: [{
      targets: 0,
      data: 'image',
      render: function(data) {
        return '<img height="30%" width="30%" src="'+data+'">';
      }},
      {
        targets: 5,
        data: 'lenght',
        render: function(data) {
          return toS(data);
      }},
      {
        targets: 1,
        visible: false,
        searchable: false
    }]
  })
  .on( 'select', function ( e, dt, type, indexes ) {
    var selectedRows = dt.rows( { selected: true } ).count();
 
    dt.button( 0 ).enable( selectedRows === 1 );
    dt.button( 1 ).enable( selectedRows === 1 );
    // dt.button( 0 ).( selectedRows > 0 );
  })
  .on( 'deselect', function ( e, dt, type, indexes ) {
    var selectedRows = dt.rows( { selected: true } ).count();

    dt.button( 0 ).disable( selectedRows === 1 );
    dt.button( 1 ).enable( selectedRows === 1 );
    // dt.button( 0 ).( selectedRows > 0 );
  });

  function notification(strong, regular, type) {
    var html = `
    <div class="alert alert-` + type + ` alert-dismissible fade show" role="alert">
        <i class="fas fa-info fa-sm fa-fw mr-2"></i>
        <strong>` + strong + `</strong> ` + regular + `
         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `;

    $("#notifications").append(html);
  }

  function convertor(song) {
    var img = '<img width="100" height="100" src="' + song.img + '" alt="' + song.title + '">';
    var url = '<a class="sourceurl" href="' + song.sourceurl + '">' + song.sourceurl + '</a>';
    var duration = toMS(song.duration);

    return [img, url, duration]

  };

  function toMS(duration) {
    var seconds = duration / 1000;
    var date = new Date(0);
    date.setSeconds(seconds); // specify value for SECONDS here
    var timeString = date.toISOString().substr(14, 5);
    return timeString;
  };

  function toS(duration) {
    var date = new Date(0);
    date.setSeconds(duration); // specify value for SECONDS here
    var timeString = date.toISOString().substr(14, 5);
    return timeString;
  };

  function checkbox() {
    var html = `<div class="form-check">
    <input class="form-check-input" name="metadata" type="radio" value="">
    </div>`

    return html
  }

  $('#search').on('click', function() {
    var html = `
    <table id="song-selector" class="table table-sm">
      <thead>
        <tr>
          <th>Select</th>
          <th>Image</th>
          <th>Artist</th>
          <th>Title</th>
          <th>Duration</th>
          <th>URL</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody id="song-selector">
      <tr></tr>
      </tbody>
    </table>
    `

    $("form#edit").after(html);

    var artist = $('#artist').val();
    var title = $('#title').val();

    $.post( "/search", { artist: artist, title: title }, "json")
      .done(function( data ) {
        data = jQuery.parseJSON(data);

        if (data) {
          data.forEach(function(song) { 
              [song.img, song.sourceurl, song.duration] = convertor(song);
              $('#song-selector tr:last').after("<tr></tr>");
              $('#song-selector tr:last').append("<td>" + checkbox()  + "</td>")
              Object.keys(song).forEach(function(key) {
                if ( key != "service" && key != "bpm" && key != "genre" && key != "license" ) {
                  $('#song-selector tr:last').append("<td>" + song[key] + "</td>");
                }
              })
          });
        };
      });
  });

  $('#submit').on('click', function() {
    event.preventDefault();
    var formData = new FormData();

    var title = $('#title').val();
    var artist = $('#artist').val();
    var filename = $('#filename').val();

    var image = $(".form-check input:checked").closest('tr').find('img').attr('src');
    var url = $(".form-check input:checked").closest('tr').find("a.sourceurl").attr("href");

    formData.append("artist", artist);
    formData.append("title", title);
    formData.append("image", image);
    formData.append("url", url);
    formData.append("filename", filename);

    $.ajax({
      url: '/v1/song/update',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      success: function(data){
        $('#editModal').modal('toggle');
        response = JSON.parse(data)
        notification(response.response, response.reason, "info");
      }
    });
  });

  $('#editModal').on('hidden.bs.modal', function () {
    $("form#edit").get(0).reset();
    $("table#song-selector").remove();
    // do something…
  });
});
