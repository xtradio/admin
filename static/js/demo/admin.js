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

    function convertor(song) {
        var img = '<img width="250" height="250" src="' + song.img + '" alt="' + song.title + '">';
        var url = '<a href="' + song.sourceurl + '">' + song.sourceurl + '</a>';
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
        <input class="form-check-input" type="checkbox" value="">
      </div>`

      return html
    }

});
