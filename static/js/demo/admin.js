$(document).ready(function() {
    $('#file').on('change',function(){
        //get the file name
        var fileName = $(this).val().replace(/C\:\\fakepath\\/g, "");
        var fileName = fileName.replace(/.mp3/g, "");
        var [artist, title] = fileName.split(" - ");
        $("#artist").val(artist);
        $("#title").val(title);

        $.post( "/search", { artist: artist, title: title }, "json")
            .done(function( data ) {
            console.log( "Data Loaded: " + data );
            data = jQuery.parseJSON(data);
            if (data) {
                data.forEach(function(song) { 
                    [song.img, song.sourceurl, song.duration] = convertor(song);
                    $('#song-selector tr:last').after("<tr></tr>");
                    $('#song-selector tr:last').append("<td>" + checkbox()  + "</td>")
                    Object.keys(song).forEach(function(key) {
                        console.table(key, song[key])
                        $('#song-selector tr:last').append("<td>" + song[key] + "</td>")
                    })
                });
            };
        });
    })

    $('form#upload').submit(function(event) {
        event.preventDefault();
        // var form = $('#upload')[0];
        var formData = new FormData();
        
        var title = $('#title').val();
        var artist = $('#artist').val();
        var image = $("form#upload input[name=metadata]:checked").closest('tr').find("img").attr("src");
        var url = $("form#upload input[name=metadata]:checked").closest('tr').find("a.sourceurl").attr("href");
        var file = $("#file")[0].files[0];

        formData.append("artist", artist);
        formData.append("title", title);
        formData.append("image", image);
        formData.append("url", url);
        formData.append("file", file);

        $.ajax({
            xhr: function() {
                var progress = $('.progress-bar'),
                    xhr = $.ajaxSettings.xhr();

                progress.show();
                // $('.progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur);
                xhr.upload.onprogress = function(ev) {
                    if (ev.lengthComputable) {
                        var percentComplete = parseInt((ev.loaded / ev.total) * 100);
                        progress.css('width', percentComplete+'%').attr('aria-valuenow', percentComplete);
                        if (percentComplete === 100) {
                            progress.hide().css('width', '0%').attr('aria-valuenow', '0');
                        }
                    }
                };

                return xhr;
            },
            url: '/v1/song/upload',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            success: function(data){
              console.log("Return data: " + data);
            }
        });

        // console.log(formData);
    });

    function convertor(song) {
        var img = '<img width="250" height="250" src="' + song.img + '" alt="' + song.title + '">';
        var url = '<a class="sourceurl" href="' + song.sourceurl + '">' + song.sourceurl + '</a>';
        var duration = toMS(song.duration);

        console.log(img, url, duration);

        return [img, url, duration]

    };

    function toMS(duration) {
        var seconds = duration / 1000;
        var date = new Date(0);
        date.setSeconds(seconds); // specify value for SECONDS here
        var timeString = date.toISOString().substr(14, 5);
        console.log(timeString);
        return timeString;
    };

    function checkbox() {
        var html = `<div class="form-check">
        <input class="form-check-input" name="metadata" type="radio" value="">
      </div>`

      return html
    }

});
