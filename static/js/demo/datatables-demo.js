// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable( {
    ajax: '/v1/song/list',
    dataSrc: 'data',
    columns: [{ data: 'image' },
              { data: 'id' },
              { data: 'filename'},
              { data: 'title' },
              { data: 'artist' },
              { data: 'lenght' },
              { data: 'share' }],
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
  } );
});
