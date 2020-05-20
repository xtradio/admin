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
          var length = row.data()[0]["lenght"]

          console.log("Edit button was pushed " + filename + " " + artist)
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

          console.log("Queue button was pushed " + share)

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
      }
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
});
